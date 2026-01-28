import { api } from '@/auth/utils/api';

import { unwrapSenderKeyFromDevice } from './cryptoWrap';
import type { WrappedPayload } from './cryptoWrap';
import { arrayBufferToBase64 } from './encoding';
import { getDeviceId, getSenderKey, setSenderKey, getDeviceIdentityKeyPair } from './indexedDb';

const pendingRequests = new Map<string, Promise<void>>();

type PendingEnvelope = {
  id: number;
  chatId: string;
  fromUserId: string;
  fromDeviceId: string;
  wrapped: WrappedPayload;
};

export async function tryFetchAndDecryptSenderKey(
  chatId: string,
  currentUserId: string
): Promise<boolean> {
  const deviceId = await getDeviceId();

  const existing = await getSenderKey(chatId);
  if (existing) return true;

  const myIdentity = await getDeviceIdentityKeyPair(currentUserId);
  if (!myIdentity) throw new Error('Missing local identity keypair');

  const res = await api.get<PendingEnvelope>(
    `/encryption/sender-keys/pending?chatId=${encodeURIComponent(chatId)}&userId=${encodeURIComponent(currentUserId)}&deviceId=${encodeURIComponent(deviceId)}`
  );

  if (res.status === 204) return false;

  const envelope = res.data;

  type DeviceRecord = { senderDeviceId: string; identityPublicKey: JsonWebKey };
  const senderDevicesRes = await api.get<DeviceRecord[]>(
    `/encryption/keys/${encodeURIComponent(envelope.fromUserId)}/devices`
  );
  const senderDevice = senderDevicesRes.data.find(d => d.senderDeviceId === envelope.fromDeviceId);

  if (!senderDevice) throw new Error('Sender device not found');

  const senderKeyRaw = await unwrapSenderKeyFromDevice({
    chatId,
    myPrivateJwk: myIdentity.privateKey,
    theirPublicJwk: senderDevice.identityPublicKey,
    wrapped: envelope.wrapped,
  });

  const senderKeyB64 = arrayBufferToBase64(senderKeyRaw);
  await setSenderKey({ chatId, senderDeviceId: deviceId, key: senderKeyB64 });

  await api.post(`/encryption/sender-keys/${envelope.id}/consume`);

  return true;
}

export async function requestSenderKey(
  chatId: string,
  requesterUserId: string,
  client: { connected?: boolean; publish: (params: { destination: string; body: string }) => void }
) {
  const deviceId = await getDeviceId();
  const requestKey = `${chatId}:${requesterUserId}:${deviceId}`;

  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }

  if (!client?.connected) {
    throw new Error('WebSocket not connected');
  }

  const promise = (async () => {
    try {
      client.publish({
        destination: `/app/groups.${chatId}.senderkey.request`,
        body: JSON.stringify({
          requesterUserId,
          requesterDeviceId: deviceId,
        }),
      });

      // Pending for 2s to prevent duplicates during retries
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      pendingRequests.delete(requestKey);
    }
  })();

  pendingRequests.set(requestKey, promise);
  return promise;
}
