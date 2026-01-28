import { base64ToArrayBuffer, arrayBufferToBase64, u8ToArrayBuffer } from './encoding';
import { getSenderKey } from './indexedDb';

const AES_GCM_IV_LENGTH_BYTES = 12; // 96-bit cryptographic nonce
const BASE64_IV_LENGTH_CHARS = 16;
const MIN_COMBINED_CIPHERTEXT_CHARS = BASE64_IV_LENGTH_CHARS + 16; // IV + minimum ciphertext

function randomBytes(len: number): Uint8Array {
  const b = new Uint8Array(len);
  crypto.getRandomValues(b);
  return b;
}

async function importSenderKeyAsAesGcm(keyB64: string): Promise<CryptoKey> {
  const keyBytes = base64ToArrayBuffer(keyB64);
  return crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ]);
}

export async function encryptMessage(chatId: string, content: string): Promise<string> {
  const senderKey = await getSenderKey(chatId);
  if (!senderKey) throw new Error('No sender key available for this chat');

  const aesKey = await importSenderKeyAsAesGcm(senderKey.key);

  const plaintextBytes = new TextEncoder().encode(content);
  const plaintext = u8ToArrayBuffer(plaintextBytes);

  const ivBytes = randomBytes(AES_GCM_IV_LENGTH_BYTES);
  const iv = u8ToArrayBuffer(ivBytes);

  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, plaintext);

  return arrayBufferToBase64(iv) + arrayBufferToBase64(ciphertext);
}

export async function decryptMessage(chatId: string, ciphertext: string): Promise<string> {
  const senderKey = await getSenderKey(chatId);
  if (!senderKey) throw new Error('No sender key available for this chat');

  if (ciphertext.length < MIN_COMBINED_CIPHERTEXT_CHARS)
    throw new Error('Invalid ciphertext format');

  const ivB64 = ciphertext.slice(0, BASE64_IV_LENGTH_CHARS);
  const ctB64 = ciphertext.slice(BASE64_IV_LENGTH_CHARS);

  const aesKey = await importSenderKeyAsAesGcm(senderKey.key);
  const iv = base64ToArrayBuffer(ivB64);
  const ct = base64ToArrayBuffer(ctB64);

  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, ct);
  return new TextDecoder().decode(new Uint8Array(plaintext));
}
