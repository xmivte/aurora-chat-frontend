import { api } from '@/auth/utils/api';

import { getDeviceId, getDeviceIdentityKeyPair, setDeviceIdentityKeyPair } from './indexedDb';

export type PublicDeviceKeyData = {
  userId: string;
  senderDeviceId: string;
  identityPublicKey: JsonWebKey;
};

export async function storeDeviceIdentityKeyPair(userId: string): Promise<PublicDeviceKeyData> {
  const deviceId = await getDeviceId();

  let DeviceIdentityKeyPair = await getDeviceIdentityKeyPair(userId);
  if (!DeviceIdentityKeyPair) {
    const generatedKeyPair = await crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      ['deriveBits', 'deriveKey']
    );

    DeviceIdentityKeyPair = {
      publicKey: await crypto.subtle.exportKey('jwk', generatedKeyPair.publicKey),
      privateKey: await crypto.subtle.exportKey('jwk', generatedKeyPair.privateKey),
    };

    await setDeviceIdentityKeyPair(userId, DeviceIdentityKeyPair);
  }

  try {
    await api.post('/encryption/keys', {
      userId,
      senderDeviceId: deviceId,
      identityPublicKey: DeviceIdentityKeyPair.publicKey,
    });
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error(
      'Failed to register device identity key with backend:',
      err.response?.data || err.message
    );
  }

  return {
    userId,
    senderDeviceId: deviceId,
    identityPublicKey: DeviceIdentityKeyPair.publicKey,
  };
}
