/**
 * Motion crash-recovery drafts (IndexedDB), modelled on Darkroom's
 * `lib/studio/draftStore.ts` (part 08). One draft per project under the key
 * `vector-draft:<projectId>`; the editor writes it on a 2 s trailing debounce
 * and offers recovery on open (`draftRecovery.ts` owns that decision).
 *
 * Anonymous projects live ONLY here (design §3.5); server save is MM44.
 *
 * Strictly best-effort: every IndexedDB access is wrapped and degrades to
 * "no draft" (private mode, quota, corruption, IndexedDB missing). Nothing
 * here may break the editor.
 */
import { parseVectorDoc, type VectorDoc } from '@/lib/vector/vectorTypes';

export const VECTOR_DRAFT_DB_NAME = 'mm-vector-drafts';
export const VECTOR_DRAFT_STORE_NAME = 'drafts';
const DB_VERSION = 1;
/** Ticket decision 13: 2 s debounce. */
export const VECTOR_DRAFT_DEBOUNCE_MS = 2000;
export const VECTOR_DRAFT_PRUNE_KEEP = 20;
export const VECTOR_DRAFT_PRUNE_MAX_AGE_DAYS = 30;

export const draftKey = (projectId: string) => `vector-draft:${projectId}`;

export interface VectorDraft {
  projectId: string;
  /** Project name at write time. */
  name: string;
  /** Client clock at write time, epoch ms. */
  savedAt: number;
  /** Server revision the draft is based on (MM44); null for local-only projects. */
  baseRevision: number | null;
  document: VectorDoc;
}

interface StoredDraft extends VectorDraft {
  key: string;
}

let warned = false;
function warnOnce(err: unknown): void {
  if (warned) return;
  warned = true;
  console.warn('[vector] draft buffer unavailable; crash recovery is disabled this session', err);
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(VECTOR_DRAFT_DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(VECTOR_DRAFT_STORE_NAME)) {
        db.createObjectStore(VECTOR_DRAFT_STORE_NAME, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('indexedDB open failed'));
  });
}

function requestDone<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('indexedDB request failed'));
  });
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('indexedDB transaction failed'));
    tx.onabort = () => reject(tx.error ?? new Error('indexedDB transaction aborted'));
  });
}

/** Open → one operation → wait for the transaction → close. Null on ANY failure. */
async function withStore<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => Promise<T>): Promise<T | null> {
  let db: IDBDatabase | null = null;
  try {
    if (typeof indexedDB === 'undefined') throw new Error('indexedDB is not defined');
    db = await openDb();
    const tx = db.transaction(VECTOR_DRAFT_STORE_NAME, mode);
    const result = await fn(tx.objectStore(VECTOR_DRAFT_STORE_NAME));
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

export async function putVectorDraft(draft: VectorDraft): Promise<boolean> {
  const record: StoredDraft = { ...draft, key: draftKey(draft.projectId) };
  const ok = await withStore('readwrite', async (store) => {
    await requestDone(store.put(record));
    return true;
  });
  return ok === true;
}

/** The project's draft, or null. Invalid records are deleted so they cannot wedge the open flow. */
export async function getVectorDraft(projectId: string): Promise<VectorDraft | null> {
  const raw = await withStore('readonly', (store) => requestDone(store.get(draftKey(projectId)) as IDBRequest<unknown>));
  if (raw === null || raw === undefined || typeof raw !== 'object') return null;
  const rec = raw as Partial<StoredDraft>;
  const doc = parseVectorDoc(rec.document);
  if (typeof rec.savedAt !== 'number' || !doc.ok) {
    void deleteVectorDraft(projectId);
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

export async function deleteVectorDraft(projectId: string): Promise<boolean> {
  const ok = await withStore('readwrite', async (store) => {
    await requestDone(store.delete(draftKey(projectId)));
    return true;
  });
  return ok === true;
}

/** Local drafts newest first (the "recent local projects" list on `/motion/new`). */
export async function listVectorDrafts(): Promise<Array<Pick<VectorDraft, 'projectId' | 'name' | 'savedAt'>>> {
  const all = await withStore('readonly', (store) => requestDone(store.getAll() as IDBRequest<unknown[]>));
  if (!all) return [];
  return all
    .filter((r): r is StoredDraft => typeof r === 'object' && r !== null && typeof (r as StoredDraft).projectId === 'string')
    .map((r) => ({ projectId: r.projectId, name: typeof r.name === 'string' ? r.name : '', savedAt: typeof r.savedAt === 'number' ? r.savedAt : 0 }))
    .sort((a, b) => b.savedAt - a.savedAt);
}

/** Keep at most `keep` drafts and drop any older than `maxAgeDays`. */
export async function pruneVectorDrafts(
  keep = VECTOR_DRAFT_PRUNE_KEEP,
  maxAgeDays = VECTOR_DRAFT_PRUNE_MAX_AGE_DAYS,
  now = Date.now(),
): Promise<number> {
  const removed = await withStore('readwrite', async (store) => {
    const all = (await requestDone(store.getAll() as IDBRequest<unknown[]>)) as Array<Partial<StoredDraft>>;
    const cutoff = now - maxAgeDays * 86_400_000;
    const sorted = [...all].sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));
    let count = 0;
    for (let i = 0; i < sorted.length; i++) {
      const d = sorted[i];
      if (typeof d.key !== 'string') continue;
      if (i >= keep || typeof d.savedAt !== 'number' || d.savedAt < cutoff) {
        await requestDone(store.delete(d.key));
        count++;
      }
    }
    return count;
  });
  return removed ?? 0;
}

// ---------------------------------------------------------------------------
// debounced writer
// ---------------------------------------------------------------------------

export interface DraftWriter {
  /** The document changed; (re)start the debounce. */
  notifyChange: () => void;
  /** Write now if a change is pending (pagehide / tab hidden). */
  flush: () => void;
  dispose: () => void;
}

/**
 * Trailing debounce: the write fires `delayMs` after the LAST change, so a
 * continuous drag writes once when it settles. `write` reads current state
 * and owns its own error handling.
 */
export function createDraftWriter(write: () => void, delayMs = VECTOR_DRAFT_DEBOUNCE_MS): DraftWriter {
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
