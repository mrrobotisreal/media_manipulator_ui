/**
 * The ONE browser-local project (Mitch 2026-11-03, design §3.5, ticket MM97
 * decision 12). Anonymous visitors get no server project: the original (Blob),
 * the doc and any healed base live in IndexedDB; the doc alone also falls back
 * to `localStorage`. Opening a second photo replaces it after a prompt. After
 * sign-in the project is offered for upload as a server project.
 *
 * Strictly best-effort like the draft store: every access is wrapped.
 */
import { parsePhotoDoc, type PhotoDoc } from '@/lib/photo/photoTypes';

export const LOCAL_DB_NAME = 'mm-photo-local';
export const LOCAL_STORE_NAME = 'project';
export const LOCAL_KEY = 'current';
export const LOCAL_DOC_FALLBACK_KEY = 'mm-photo-local-doc';
export const LOCAL_PROJECT_ID = 'local';

export interface LocalProject {
  name: string;
  fileName: string;
  /** The original bytes (null only when IndexedDB was unavailable and just the doc survived). */
  original: Blob | null;
  /** A healed base (stateless heal result), if any. */
  base: Blob | null;
  doc: PhotoDoc;
  savedAt: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(LOCAL_DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(LOCAL_STORE_NAME)) req.result.createObjectStore(LOCAL_STORE_NAME, { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('indexedDB open failed'));
  });
}
const done = <T,>(req: IDBRequest<T>): Promise<T> =>
  new Promise((res, rej) => {
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error ?? new Error('indexedDB request failed'));
  });
const txDone = (tx: IDBTransaction): Promise<void> =>
  new Promise((res, rej) => {
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error ?? new Error('indexedDB transaction failed'));
    tx.onabort = () => rej(tx.error ?? new Error('indexedDB transaction aborted'));
  });

async function withStore<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => Promise<T>): Promise<T | null> {
  let db: IDBDatabase | null = null;
  try {
    if (typeof indexedDB === 'undefined') throw new Error('indexedDB is not defined');
    db = await openDb();
    const tx = db.transaction(LOCAL_STORE_NAME, mode);
    const r = await fn(tx.objectStore(LOCAL_STORE_NAME));
    await txDone(tx);
    return r;
  } catch {
    return null;
  } finally {
    try {
      db?.close();
    } catch {
      // ignore
    }
  }
}

function lsGet(): string | null {
  try {
    return localStorage.getItem(LOCAL_DOC_FALLBACK_KEY);
  } catch {
    return null;
  }
}
function lsSet(v: string | null): void {
  try {
    if (v === null) localStorage.removeItem(LOCAL_DOC_FALLBACK_KEY);
    else localStorage.setItem(LOCAL_DOC_FALLBACK_KEY, v);
  } catch {
    // quota / private mode: the doc just is not mirrored
  }
}

/** Replace the local project with a new photo (call only after the replace prompt was accepted). */
export async function putLocalProject(p: LocalProject): Promise<boolean> {
  const ok = await withStore('readwrite', async (s) => {
    await done(s.put({ ...p, key: LOCAL_KEY }));
    return true;
  });
  lsSet(JSON.stringify({ name: p.name, fileName: p.fileName, savedAt: p.savedAt, doc: p.doc }));
  return ok === true;
}

/** Update only the doc/name (every edit); keeps the stored original. */
export async function updateLocalDoc(doc: PhotoDoc, name?: string): Promise<boolean> {
  const ok = await withStore('readwrite', async (s) => {
    const cur = (await done(s.get(LOCAL_KEY) as IDBRequest<LocalProject | undefined>)) as LocalProject | undefined;
    if (!cur) return false;
    await done(s.put({ ...cur, doc, name: name ?? cur.name, savedAt: Date.now(), key: LOCAL_KEY }));
    return true;
  });
  const prev = lsGet();
  try {
    const old = prev ? (JSON.parse(prev) as Record<string, unknown>) : {};
    lsSet(JSON.stringify({ ...old, doc, name: name ?? old.name ?? '', savedAt: Date.now() }));
  } catch {
    lsSet(JSON.stringify({ doc, name: name ?? '', savedAt: Date.now() }));
  }
  return ok === true;
}

export async function setLocalBase(base: Blob | null): Promise<boolean> {
  const ok = await withStore('readwrite', async (s) => {
    const cur = (await done(s.get(LOCAL_KEY) as IDBRequest<LocalProject | undefined>)) as LocalProject | undefined;
    if (!cur) return false;
    await done(s.put({ ...cur, base, key: LOCAL_KEY }));
    return true;
  });
  return ok === true;
}

/** The local project, or null. A record whose doc fails to parse is dropped. */
export async function getLocalProject(): Promise<LocalProject | null> {
  const raw = await withStore('readonly', (s) => done(s.get(LOCAL_KEY) as IDBRequest<unknown>));
  if (raw && typeof raw === 'object') {
    const r = raw as Partial<LocalProject>;
    const doc = parsePhotoDoc(r.doc);
    if (doc.ok) {
      return {
        name: typeof r.name === 'string' ? r.name : '',
        fileName: typeof r.fileName === 'string' ? r.fileName : 'photo',
        original: r.original instanceof Blob ? r.original : null,
        base: r.base instanceof Blob ? r.base : null,
        doc: doc.doc,
        savedAt: typeof r.savedAt === 'number' ? r.savedAt : 0,
      };
    }
    void clearLocalProject();
    return null;
  }
  // IndexedDB gave nothing: the doc-only fallback can restore settings but not the pixels.
  const ls = lsGet();
  if (ls) {
    try {
      const j = JSON.parse(ls) as Record<string, unknown>;
      const doc = parsePhotoDoc(j.doc);
      if (doc.ok) {
        return {
          name: typeof j.name === 'string' ? j.name : '',
          fileName: typeof j.fileName === 'string' ? j.fileName : 'photo',
          original: null,
          base: null,
          doc: doc.doc,
          savedAt: typeof j.savedAt === 'number' ? j.savedAt : 0,
        };
      }
    } catch {
      // fall through
    }
  }
  return null;
}

export async function hasLocalProject(): Promise<boolean> {
  return (await getLocalProject()) !== null;
}

export async function clearLocalProject(): Promise<void> {
  await withStore('readwrite', async (s) => {
    await done(s.delete(LOCAL_KEY));
    return true;
  });
  lsSet(null);
}

export type OpenDecision = 'open' | 'confirm-replace';
/** Opening a NEW photo while a different local project exists needs the replace prompt. */
export function decideOpen(existing: LocalProject | null): OpenDecision {
  return existing ? 'confirm-replace' : 'open';
}

export interface UploadOffer {
  /** Show the "keep on your account" prompt. */
  offer: boolean;
  reason: 'no-local' | 'no-pixels' | 'cap-reached' | 'ok';
}
/** After sign-in: offer the upload when there is a local project with pixels and a free slot. */
export function decideUploadOffer(local: LocalProject | null, serverProjectCount: number, cap: number): UploadOffer {
  if (!local) return { offer: false, reason: 'no-local' };
  if (!local.original) return { offer: false, reason: 'no-pixels' };
  if (cap >= 0 && serverProjectCount >= cap) return { offer: false, reason: 'cap-reached' };
  return { offer: true, reason: 'ok' };
}

/** The document for the server upload: the heal base is already baked in, so `heals` is emptied. */
export function docForUpload(local: LocalProject): PhotoDoc {
  return local.base ? { ...local.doc, heals: [] } : local.doc;
}
