/**
 * Guest "Recent" history (MM29): metadata about the last completed jobs, kept in this browser.
 *
 * WHAT IS STORED, per job: jobId, tool slug, result kind, the RESULT file name (the server's
 * name for the output, needed to name a re-download), result size, createdAt, expiresAt and an
 * optional 160 px JPEG thumbnail. NEVER the file itself, never the input file's name, never user
 * text. Guests' results live on the server for 24 hours, so entries carry the server's real
 * expiry and are pruned the moment it passes.
 *
 * Every call is try/catch-wrapped and resolves (never throws): private windows, blocked storage
 * and Safari ITP simply behave as "no history". `createLocalHistory` takes an adapter so the
 * rules (cap, eviction, expiry, idempotence) are unit-tested without IndexedDB.
 */

export interface LocalHistoryEntry {
  jobId: string;
  /** Tool slug; the home converter records `converter`. */
  tool: string;
  /** ResultDescriptor.kind. */
  kind: string;
  /** Name of the RESULT file. */
  fileName: string;
  sizeBytes?: number;
  /** Epoch ms. */
  createdAt: number;
  /** Epoch ms; when the server deletes the result. */
  expiresAt: number;
  thumbnail?: Blob;
}

export interface HistoryAdapter {
  getAll(): Promise<LocalHistoryEntry[]>;
  put(entry: LocalHistoryEntry): Promise<void>;
  delete(jobIds: string[]): Promise<void>;
  clear(): Promise<void>;
}

export const HISTORY_CAP = 20;
export const DB_NAME = 'mm-local-history';
const STORE = 'jobs';

export interface LocalHistory {
  /** Live entries, newest first. Expired entries are pruned as a side effect. */
  list(): Promise<LocalHistoryEntry[]>;
  /** Upsert by jobId (idempotent: a repeat never duplicates; a missing thumbnail never erases one). Evicts the oldest beyond the cap. */
  add(entry: LocalHistoryEntry): Promise<void>;
  remove(jobId: string): Promise<void>;
  clear(): Promise<void>;
  /** Deletes expired entries; resolves to how many went. */
  prune(): Promise<number>;
}

export function createLocalHistory(
  getAdapter: () => HistoryAdapter | null | Promise<HistoryAdapter | null>,
  now: () => number = Date.now,
): LocalHistory {
  async function run<T>(fallback: T, fn: (adapter: HistoryAdapter) => Promise<T>): Promise<T> {
    try {
      const adapter = await getAdapter();
      return adapter ? await fn(adapter) : fallback;
    } catch {
      return fallback;
    }
  }

  const prune = () =>
    run(0, async (a) => {
      const expired = (await a.getAll()).filter((e) => e.expiresAt <= now()).map((e) => e.jobId);
      if (expired.length) await a.delete(expired);
      return expired.length;
    });

  return {
    list: () =>
      run<LocalHistoryEntry[]>([], async (a) => {
        const all = await a.getAll();
        const expired = all.filter((e) => e.expiresAt <= now()).map((e) => e.jobId);
        if (expired.length) await a.delete(expired);
        return all.filter((e) => e.expiresAt > now()).sort((x, y) => y.createdAt - x.createdAt);
      }),
    add: (entry) =>
      run(undefined, async (a) => {
        const all = await a.getAll();
        const existing = all.find((e) => e.jobId === entry.jobId);
        const merged: LocalHistoryEntry = existing
          ? { ...existing, ...entry, thumbnail: entry.thumbnail ?? existing.thumbnail }
          : entry;
        await a.put(merged);
        const rest = [...all.filter((e) => e.jobId !== entry.jobId), merged].sort((x, y) => x.createdAt - y.createdAt);
        const overflow = rest.length - HISTORY_CAP;
        if (overflow > 0) await a.delete(rest.slice(0, overflow).map((e) => e.jobId));
      }),
    remove: (jobId) => run(undefined, (a) => a.delete([jobId])),
    clear: () => run(undefined, (a) => a.clear()),
    prune,
  };
}

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

function openDb(factory: IDBFactory): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = factory.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore(STORE, { keyPath: 'jobId' });
      store.createIndex('createdAt', 'createdAt');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('blocked'));
  });
}

/** The IndexedDB adapter, or null when the browser has none (SSR, private windows, ITP). */
export function indexedDbAdapter(): HistoryAdapter | null {
  let factory: IDBFactory | undefined;
  try {
    factory = (globalThis as { indexedDB?: IDBFactory }).indexedDB;
  } catch {
    return null;
  }
  if (!factory) return null;
  const f = factory;
  const db = openDb(f);
  db.catch(() => undefined);
  const store = async (mode: IDBTransactionMode) => {
    const tx = (await db).transaction(STORE, mode);
    return { tx, store: tx.objectStore(STORE) };
  };
  return {
    async getAll() {
      const { store: s } = await store('readonly');
      return request(s.getAll() as IDBRequest<LocalHistoryEntry[]>);
    },
    async put(entry) {
      const { tx, store: s } = await store('readwrite');
      s.put(entry);
      await done(tx);
    },
    async delete(ids) {
      const { tx, store: s } = await store('readwrite');
      ids.forEach((id) => s.delete(id));
      await done(tx);
    },
    async clear() {
      const { tx, store: s } = await store('readwrite');
      s.clear();
      await done(tx);
    },
  };
}

let shared: HistoryAdapter | null | undefined;
/** The app's store. The adapter is created lazily and re-resolved while IndexedDB is missing. */
export const localHistory: LocalHistory = createLocalHistory(() => {
  if (shared === undefined) shared = indexedDbAdapter();
  const current = shared;
  if (current === null) shared = undefined; // retry later; storage may become available
  return current;
});
