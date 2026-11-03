/**
 * Aperture crash-recovery drafts (IndexedDB), modelled on Motion's
 * `lib/vector/draftStore.ts` and Darkroom's `lib/studio/draftStore.ts`. One
 * draft per project under the key `photo-draft:<projectId>`; the editor writes
 * it on a 2 s trailing debounce and offers recovery on open.
 *
 * Strictly best-effort: every IndexedDB access is wrapped and degrades to "no
 * draft" (private mode, quota, corruption, IndexedDB missing). Nothing here may
 * break the editor.
 */
import { parsePhotoDoc, type PhotoDoc } from '@/lib/photo/photoTypes';

export const PHOTO_DRAFT_DB_NAME = 'mm-photo-drafts';
export const PHOTO_DRAFT_STORE_NAME = 'drafts';
const DB_VERSION = 1;
export const PHOTO_DRAFT_DEBOUNCE_MS = 2000;
export const PHOTO_DRAFT_PRUNE_KEEP = 20;
export const PHOTO_DRAFT_PRUNE_MAX_AGE_DAYS = 30;

export const photoDraftKey = (projectId: string) => `photo-draft:${projectId}`;

export interface PhotoDraft {
  projectId: string;
  name: string;
  /** Client clock at write time, epoch ms. */
  savedAt: number;
  /** Server revision the draft is based on; null for local-only projects. */
  baseRevision: number | null;
  document: PhotoDoc;
}

interface StoredDraft extends PhotoDraft {
  key: string;
}

let warned = false;
function warnOnce(err: unknown): void {
  if (warned) return;
  warned = true;
  console.warn('[photo] draft buffer unavailable; crash recovery is disabled this session', err);
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(PHOTO_DRAFT_DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(PHOTO_DRAFT_STORE_NAME)) req.result.createObjectStore(PHOTO_DRAFT_STORE_NAME, { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('indexedDB open failed'));
  });
}

const requestDone = <T,>(req: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('indexedDB request failed'));
  });

const transactionDone = (tx: IDBTransaction): Promise<void> =>
  new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('indexedDB transaction failed'));
    tx.onabort = () => reject(tx.error ?? new Error('indexedDB transaction aborted'));
  });

async function withStore<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => Promise<T>): Promise<T | null> {
  let db: IDBDatabase | null = null;
  try {
    if (typeof indexedDB === 'undefined') throw new Error('indexedDB is not defined');
    db = await openDb();
    const tx = db.transaction(PHOTO_DRAFT_STORE_NAME, mode);
    const result = await fn(tx.objectStore(PHOTO_DRAFT_STORE_NAME));
    await transactionDone(tx);
    return result;
  } catch (err) {
    warnOnce(err);
    return null;
  } finally {
    try {
      db?.close();
    } catch {
      // ignore
    }
  }
}

export async function putPhotoDraft(draft: PhotoDraft): Promise<boolean> {
  const record: StoredDraft = { ...draft, key: photoDraftKey(draft.projectId) };
  return (
    (await withStore('readwrite', async (store) => {
      await requestDone(store.put(record));
      return true;
    })) === true
  );
}

/** The project's draft, or null. Invalid records are deleted so they cannot wedge the open flow. */
export async function getPhotoDraft(projectId: string): Promise<PhotoDraft | null> {
  const raw = await withStore('readonly', (store) => requestDone(store.get(photoDraftKey(projectId)) as IDBRequest<unknown>));
  if (raw === null || raw === undefined || typeof raw !== 'object') return null;
  const rec = raw as Partial<StoredDraft>;
  const doc = parsePhotoDoc(rec.document);
  if (typeof rec.savedAt !== 'number' || !doc.ok) {
    void deletePhotoDraft(projectId);
    return null;
  }
  return {
    projectId,
    name: typeof rec.name === 'string' ? rec.name : '',
    savedAt: rec.savedAt,
    baseRevision: typeof rec.baseRevision === 'number' ? rec.baseRevision : null,
    document: doc.doc,
  };
}

export async function deletePhotoDraft(projectId: string): Promise<boolean> {
  return (
    (await withStore('readwrite', async (store) => {
      await requestDone(store.delete(photoDraftKey(projectId)));
      return true;
    })) === true
  );
}

export async function listPhotoDrafts(): Promise<Array<Pick<PhotoDraft, 'projectId' | 'name' | 'savedAt'>>> {
  const all = await withStore('readonly', (store) => requestDone(store.getAll() as IDBRequest<unknown[]>));
  if (!all) return [];
  return all
    .filter((r): r is StoredDraft => typeof r === 'object' && r !== null && typeof (r as StoredDraft).projectId === 'string')
    .map((r) => ({ projectId: r.projectId, name: typeof r.name === 'string' ? r.name : '', savedAt: typeof r.savedAt === 'number' ? r.savedAt : 0 }))
    .sort((a, b) => b.savedAt - a.savedAt);
}

export async function prunePhotoDrafts(keep = PHOTO_DRAFT_PRUNE_KEEP, maxAgeDays = PHOTO_DRAFT_PRUNE_MAX_AGE_DAYS, now = Date.now()): Promise<number> {
  const removed = await withStore('readwrite', async (store) => {
    const all = (await requestDone(store.getAll() as IDBRequest<unknown[]>)) as Array<Partial<StoredDraft>>;
    const cutoff = now - maxAgeDays * 86_400_000;
    const sorted = [...all].sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));
    let count = 0;
    for (let i = 0; i < sorted.length; i += 1) {
      const d = sorted[i];
      if (typeof d.key !== 'string') continue;
      if (i >= keep || typeof d.savedAt !== 'number' || d.savedAt < cutoff) {
        await requestDone(store.delete(d.key));
        count += 1;
      }
    }
    return count;
  });
  return removed ?? 0;
}

export interface DraftWriter {
  notifyChange: () => void;
  flush: () => void;
  dispose: () => void;
}

/** Trailing debounce: the write fires `delayMs` after the LAST change. */
export function createDraftWriter(write: () => void, delayMs = PHOTO_DRAFT_DEBOUNCE_MS): DraftWriter {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending = false;
  let disposed = false;
  const fire = () => {
    timer = null;
    if (disposed || !pending) return;
    pending = false;
    write();
  };
  return {
    notifyChange: () => {
      if (disposed) return;
      pending = true;
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(fire, delayMs);
    },
    flush: () => {
      if (disposed || !pending) return;
      if (timer !== null) clearTimeout(timer);
      timer = null;
      pending = false;
      write();
    },
    dispose: () => {
      disposed = true;
      pending = false;
      if (timer !== null) clearTimeout(timer);
      timer = null;
    },
  };
}

/** Should the recovery prompt show? A draft newer than what was loaded and different from it. */
export function shouldOfferRecovery(draft: PhotoDraft | null, loadedDoc: PhotoDoc, loadedUpdatedAtMs: number | null): boolean {
  if (!draft) return false;
  if (JSON.stringify(draft.document) === JSON.stringify(loadedDoc)) return false;
  return loadedUpdatedAtMs === null || draft.savedAt > loadedUpdatedAtMs;
}
