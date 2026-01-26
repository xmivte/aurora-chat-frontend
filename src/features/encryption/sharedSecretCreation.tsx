import { api } from '@/auth/utils/api';

import { wrapSenderKeyForDevice } from './cryptoWrap';
import { arrayBufferToBase64 } from './encoding';
import { getDeviceId, getDeviceIdentityKeyPair, getSenderKey, setSenderKey } from './indexedDb';

const creationInProgress = new Map<string, Promise<void>>();

type DeviceKeyRecord = {
  userId: string;
  senderDeviceId: string;
  identityPublicKey: JsonWebKey;
};

function randomBytes(len: number): Uint8Array {
  const b = new Uint8Array(len);
  crypto.getRandomValues(b);
  return b;
}

async function fetchChatParticipants(chatId: string): Promise<string[]> {
  const res = await api.get<string[]>(`/group/${encodeURIComponent(chatId)}/participants`);
  return res.data;
}

async function fetchUserDevices(userId: string): Promise<DeviceKeyRecord[]> {
  const res = await api.get<DeviceKeyRecord[]>(
    `/encryption/keys/${encodeURIComponent(userId)}/devices`
  );
  return res.data;
}

export async function createGeneralSharedSecretForMessages(chatId: string, currentUserId: string) {
  const existing = await getSenderKey(chatId);
  if (existing) return;

  if (creationInProgress.has(chatId)) {
    return creationInProgress.get(chatId);
  }

  const promise = (async () => {
    try {
      const deviceId = await getDeviceId();

      const senderKeyBytes = randomBytes(32);
      const senderKeyRaw = senderKeyBytes.slice().buffer;
      const senderKeyB64 = arrayBufferToBase64(senderKeyRaw);

      await setSenderKey({ chatId, senderDeviceId: deviceId, key: senderKeyB64 });

      await shareSharedSecretWithAllParticipants(chatId, senderKeyRaw, currentUserId, deviceId);
    } finally {
      creationInProgress.delete(chatId);
    }
  })();

  creationInProgress.set(chatId, promise);
  return promise;
}

export async function shareSharedSecretWithAllParticipants(
  chatId: string,
  senderKeyRaw: ArrayBuffer,
  currentUserId: string,
  senderDeviceId: string
) {
  const myIdentity = await getDeviceIdentityKeyPair(currentUserId);
  if (!myIdentity) throw new Error('Missing local identity keypair');

  const participantIds = await fetchChatParticipants(chatId);

  const allDevicesNested = await Promise.all(participantIds.map(uid => fetchUserDevices(uid)));
  const allDevices = allDevicesNested.flat();

  const recipients = allDevices.filter(
    d => !(d.userId === currentUserId && d.senderDeviceId === senderDeviceId)
  );

  const items = [];
  for (const device of recipients) {
    const wrapped = await wrapSenderKeyForDevice({
      chatId,
      myPrivateJwk: myIdentity.privateKey,
      theirPublicJwk: device.identityPublicKey,
      senderKeyRaw,
    });

    items.push({
      chatId,
      fromUserId: currentUserId,
      fromDeviceId: senderDeviceId,
      toUserId: device.userId,
      toDeviceId: device.senderDeviceId,
      wrapped,
    });
  }

  await api.post('/encryption/sender-keys/distribute', { chatId, items });
}

export async function shareSharedSecretWithSpecificDevice(
  chatId: string,
  senderKeyRaw: ArrayBuffer,
  currentUserId: string,
  senderDeviceId: string,
  targetUserId: string,
  targetDeviceId: string
) {
  const myIdentity = await getDeviceIdentityKeyPair(currentUserId);
  if (!myIdentity) throw new Error('Missing local identity keypair');

  const devices = await fetchUserDevices(targetUserId);
  const targetDevice = devices.find(d => d.senderDeviceId === targetDeviceId);

  if (!targetDevice) throw new Error('Target device not found');

  const wrapped = await wrapSenderKeyForDevice({
    chatId,
    myPrivateJwk: myIdentity.privateKey,
    theirPublicJwk: targetDevice.identityPublicKey,
    senderKeyRaw,
  });

  try {
    await api.post('/encryption/sender-keys/distribute', {
      chatId,
      items: [
        {
          chatId,
          fromUserId: currentUserId,
          fromDeviceId: senderDeviceId,
          toUserId: targetUserId,
          toDeviceId: targetDeviceId,
          wrapped,
        },
      ],
    });
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error('Failed to distribute sender key:', {
      chatId,
      fromUserId: currentUserId,
      fromDeviceId: senderDeviceId,
      toUserId: targetUserId,
      toDeviceId: targetDeviceId,
      error: err.response?.data || err.message,
    });
    throw error;
  }
}
