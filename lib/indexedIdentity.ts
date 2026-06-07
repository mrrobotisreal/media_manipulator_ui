const DB_NAME = 'media-manipulator-identity';
const DB_VERSION = 1;
const STORE_NAME = 'identity';
const USER_KEY = 'userID';
const SESSION_KEY = 'sessionID';
const USER_STORAGE_KEY = 'mm_user_id';
const LEGACY_VISITOR_STORAGE_KEY = 'mm_visitor_id';
const SESSION_STORAGE_KEY = 'mm_session_id';

const uuid = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const openIdentityDB = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const getValue = async (key: string): Promise<string | undefined> => {
  const db = await openIdentityDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve(typeof request.result === 'string' ? request.result : undefined);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
};

const setValue = async (key: string, value: string) => {
  const db = await openIdentityDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const request = transaction.objectStore(STORE_NAME).put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
};

export const initializeIndexedIdentity = async () => {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return;
  }

  const existingIndexedUser = await getValue(USER_KEY).catch(() => undefined);
  const localUser = localStorage.getItem(USER_STORAGE_KEY) || localStorage.getItem(LEGACY_VISITOR_STORAGE_KEY);
  const userID = existingIndexedUser || localUser || uuid();
  localStorage.setItem(USER_STORAGE_KEY, userID);
  localStorage.setItem(LEGACY_VISITOR_STORAGE_KEY, userID);
  await setValue(USER_KEY, userID).catch(() => undefined);

  const sessionID = sessionStorage.getItem(SESSION_STORAGE_KEY) || uuid();
  sessionStorage.setItem(SESSION_STORAGE_KEY, sessionID);
  await setValue(SESSION_KEY, sessionID).catch(() => undefined);
};

export const getUserIdSync = () => {
  const existing = localStorage.getItem(USER_STORAGE_KEY) || localStorage.getItem(LEGACY_VISITOR_STORAGE_KEY);
  if (existing) return existing;
  const userID = uuid();
  localStorage.setItem(USER_STORAGE_KEY, userID);
  localStorage.setItem(LEGACY_VISITOR_STORAGE_KEY, userID);
  void setValue(USER_KEY, userID).catch(() => undefined);
  return userID;
};

export const getSessionIdSync = () => {
  const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;
  const sessionID = uuid();
  sessionStorage.setItem(SESSION_STORAGE_KEY, sessionID);
  void setValue(SESSION_KEY, sessionID).catch(() => undefined);
  return sessionID;
};
