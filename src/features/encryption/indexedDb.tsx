import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

const DB_NAME = 'encryption-db';
const DB_VERSION = 1;

export type DeviceMetaKey = 'deviceId';

export type DeviceIdentityKeyPair = {
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
};

export type SenderKey = {
  chatId: string;
  senderDeviceId: string;
  key: string;
};

interface EncryptionDbSchema extends DBSchema {
  meta: {
    key: DeviceMetaKey;
    value: string;
  };

  identityKeys: {
    key: string; // userId
    value: DeviceIdentityKeyPair;
  };

  senderKeys: {
    key: string; // chatId
    value: SenderKey;
  };
}

let dbPromise: Promise<IDBPDatabase<EncryptionDbSchema>> | null = null;

export function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<EncryptionDbSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta');
        }
        if (!db.objectStoreNames.contains('identityKeys')) {
          db.createObjectStore('identityKeys');
        }
        if (!db.objectStoreNames.contains('senderKeys')) {
          db.createObjectStore('senderKeys', { keyPath: 'chatId' });
        }
      },
    });
  }
  return dbPromise;
}

export async function getDeviceId(): Promise<string> {
  const exists = await getDb().then(db => db.get('meta', 'deviceId'));
  if (exists) return exists;
  const deviceIdentity = crypto.randomUUID();
  await getDb().then(db => db.put('meta', deviceIdentity, 'deviceId'));
  return deviceIdentity;
}

export async function getDeviceIdentityKeyPair(
  userId: string
): Promise<DeviceIdentityKeyPair | null> {
  const keyPair = await getDb().then(db => db.get('identityKeys', userId));
  return keyPair || null;
}

export async function setDeviceIdentityKeyPair(
  userId: string,
  keyPair: DeviceIdentityKeyPair
): Promise<void> {
  await getDb().then(db => db.put('identityKeys', keyPair, userId));
}

export async function getSenderKey(chatId: string): Promise<SenderKey | null> {
  const item = await getDb().then(db => db.get('senderKeys', chatId));
  return item || null;
}

export async function setSenderKey(item: SenderKey): Promise<void> {
  await getDb().then(db => db.put('senderKeys', item));
}
