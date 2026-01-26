import { arrayBufferToBase64, base64ToArrayBuffer } from './encoding';

function utf8ToBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

function randomBytes(len: number): Uint8Array {
  const b = new Uint8Array(len);
  crypto.getRandomValues(b);
  return b;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.slice().buffer;
}

export async function importEcdhPublicKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey('jwk', jwk, { name: 'ECDH', namedCurve: 'P-256' }, true, []);
}

export async function importEcdhPrivateKey(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey('jwk', jwk, { name: 'ECDH', namedCurve: 'P-256' }, true, [
    'deriveBits',
  ]);
}

export async function deriveWrapKeyAesGcm(params: {
  myPrivateJwk: JsonWebKey;
  theirPublicJwk: JsonWebKey;
  chatId: string;
}): Promise<CryptoKey> {
  const myPriv = await importEcdhPrivateKey(params.myPrivateJwk);
  const theirPub = await importEcdhPublicKey(params.theirPublicJwk);

  const sharedBits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: theirPub },
    myPriv,
    256
  );
  const sharedMaterial = await crypto.subtle.importKey('raw', sharedBits, 'HKDF', false, [
    'deriveKey',
  ]);

  const salt = toArrayBuffer(utf8ToBytes(`senderkey-wrap:salt:${params.chatId}:v1`));
  const info = toArrayBuffer(utf8ToBytes(`senderkey-wrap:info:v1`));

  return crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt, info },
    sharedMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export type WrappedPayload = {
  iv: string;
  ct: string;
};

export async function aesGcmEncryptToB64(
  key: CryptoKey,
  plaintext: ArrayBuffer
): Promise<WrappedPayload> {
  const ivBytes = randomBytes(12);
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: toArrayBuffer(ivBytes) },
    key,
    plaintext
  );

  return {
    iv: arrayBufferToBase64(toArrayBuffer(ivBytes)),
    ct: arrayBufferToBase64(ct),
  };
}

export async function aesGcmDecryptFromB64(
  key: CryptoKey,
  payload: WrappedPayload
): Promise<ArrayBuffer> {
  const iv = base64ToArrayBuffer(payload.iv);
  const ct = base64ToArrayBuffer(payload.ct);

  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  return pt;
}

// ECDH(myPrivate, theirPublic) -> HKDF -> AES-GCM -> {iv, ct}
export async function wrapSenderKeyForDevice(params: {
  chatId: string;
  myPrivateJwk: JsonWebKey;
  theirPublicJwk: JsonWebKey;
  senderKeyRaw: ArrayBuffer;
}): Promise<WrappedPayload> {
  const wrapKey = await deriveWrapKeyAesGcm({
    myPrivateJwk: params.myPrivateJwk,
    theirPublicJwk: params.theirPublicJwk,
    chatId: params.chatId,
  });

  return aesGcmEncryptToB64(wrapKey, params.senderKeyRaw);
}

export async function unwrapSenderKeyFromDevice(params: {
  chatId: string;
  myPrivateJwk: JsonWebKey;
  theirPublicJwk: JsonWebKey;
  wrapped: WrappedPayload;
}): Promise<ArrayBuffer> {
  const wrapKey = await deriveWrapKeyAesGcm({
    myPrivateJwk: params.myPrivateJwk,
    theirPublicJwk: params.theirPublicJwk,
    chatId: params.chatId,
  });

  return aesGcmDecryptFromB64(wrapKey, params.wrapped);
}
