/**
 * Translator draft store (MM53 decision 8).
 *
 * Translator-deployment-only code: it is loaded behind the NEXT_PUBLIC_DEPLOY_ROLE
 * guard and is never imported by production code paths.
 *
 * Pending translation edits ("drafts") and the per-locale base SHA set are kept in
 * IndexedDB so they survive reload and navigation. The store always keeps a full
 * in-memory mirror (loaded at open) and writes through to IndexedDB on every
 * mutation; reads come from the mirror. When IndexedDB is unavailable (private
 * windows: `indexedDB` undefined, `open()` throws, open fires error/blocked, or
 * open hangs) the store falls back to memory only and reports `persistent: false`
 * so the UI can show a "drafts are not being saved" banner. A write failure after
 * a successful open (quota, aborted transaction) flips the store to memory-only
 * too, keeping everything already held. Every IndexedDB call is in try/catch and
 * `openDraftStore` never rejects.
 */

export const DRAFT_DB_NAME = 'mm-translator-drafts';
export const DRAFT_DB_VERSION = 1;
const DRAFTS = 'drafts';
const META = 'meta';

export interface DraftRecord {
  locale: string;
  file: string;
  key: string;
  value: string;
  baseValue: string;
  updatedAt: number;
}

export interface BaseMeta {
  locale: string;
  sha: string;
  files: Record<string, string>;
  fetchedAt: number;
}

export function draftId(locale: string, file: string, key: string): string {
  return `${locale}|${file}|${key}`;
}

export interface DraftStoreState {
  persistent: boolean;
  reason: string | null;
}

export interface DraftStore {
  readonly persistent: boolean;
  readonly reason: string | null;
  list(locale: string): Promise<DraftRecord[]>;
  get(locale: string, file: string, key: string): Promise<DraftRecord | undefined>;
  put(draft: Omit<DraftRecord, 'updatedAt'> & { updatedAt?: number }): Promise<DraftRecord>;
  remove(locale: string, file: string, key: string): Promise<void>;
  clear(locale: string, keys?: Array<{ file: string; key: string }>): Promise<void>;
  getMeta(locale: string): Promise<BaseMeta | undefined>;
  putMeta(meta: BaseMeta): Promise<void>;
  subscribe(listener: (state: DraftStoreState) => void): () => void;
  close(): void;
}

export interface OpenDraftStoreOptions {
  /** Defaults to globalThis.indexedDB; pass null to force memory. */
  indexedDB?: IDBFactory | null;
  now?: () => number;
  /** ms to wait for open before falling back (default 3000), covers a hung/blocked open. */
  openTimeoutMs?: number;
}

type DraftRow = DraftRecord & { id: string };

function cloneDraft(d: DraftRecord): DraftRecord {
  return {
    locale: d.locale,
    file: d.file,
    key: d.key,
    value: d.value,
    baseValue: d.baseValue,
    updatedAt: d.updatedAt,
  };
}

function cloneMeta(m: BaseMeta): BaseMeta {
  return { locale: m.locale, sha: m.sha, files: { ...m.files }, fetchedAt: m.fetchedAt };
}

function compareDrafts(a: DraftRecord, b: DraftRecord): number {
  if (a.file !== b.file) return a.file < b.file ? -1 : 1;
  if (a.key !== b.key) return a.key < b.key ? -1 : 1;
  return 0;
}

/** Resolves when the transaction completes; rejects on error/abort. Never throws synchronously. */
function runTx(
  db: IDBDatabase,
  stores: string[],
  mode: IDBTransactionMode,
  work: (tx: IDBTransaction) => void,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      const tx = db.transaction(stores, mode);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('transaction error'));
      tx.onabort = () => reject(tx.error ?? new Error('transaction aborted'));
      work(tx);
    } catch (err) {
      reject(err);
    }
  });
}

function createStore(
  db: IDBDatabase | null,
  initialReason: string | null,
  now: () => number,
  drafts: Map<string, DraftRow>,
  metas: Map<string, BaseMeta>,
): DraftStore {
  let reason: string | null = db ? null : (initialReason ?? 'unavailable');
  let handle: IDBDatabase | null = db;
  const listeners = new Set<(state: DraftStoreState) => void>();

  const degrade = (why: string): void => {
    if (reason !== null) return;
    reason = why;
    const h = handle;
    handle = null;
    try {
      h?.close();
    } catch {
      /* ignore */
    }
    const state = { persistent: false, reason: why };
    for (const l of [...listeners]) {
      try {
        l(state);
      } catch {
        /* a bad listener must not break the store */
      }
    }
  };

  const write = async (stores: string[], work: (tx: IDBTransaction) => void): Promise<void> => {
    const h = handle;
    if (!h) return;
    try {
      await runTx(h, stores, 'readwrite', work);
    } catch {
      degrade('write_failed');
    }
  };

  if (db) {
    try {
      db.onversionchange = () => degrade('versionchange');
    } catch {
      /* ignore */
    }
  }

  return {
    get persistent() {
      return reason === null;
    },
    get reason() {
      return reason;
    },
    async list(locale) {
      return [...drafts.values()]
        .filter((d) => d.locale === locale)
        .sort(compareDrafts)
        .map(cloneDraft);
    },
    async get(locale, file, key) {
      const d = drafts.get(draftId(locale, file, key));
      return d ? cloneDraft(d) : undefined;
    },
    async put(draft) {
      const rec: DraftRecord = cloneDraft({ ...draft, updatedAt: draft.updatedAt ?? now() });
      const id = draftId(rec.locale, rec.file, rec.key);
      drafts.set(id, { ...rec, id });
      await write([DRAFTS], (tx) => {
        tx.objectStore(DRAFTS).put({ ...rec, id });
      });
      return cloneDraft(rec);
    },
    async remove(locale, file, key) {
      const id = draftId(locale, file, key);
      drafts.delete(id);
      await write([DRAFTS], (tx) => {
        tx.objectStore(DRAFTS).delete(id);
      });
    },
    async clear(locale, keys) {
      const ids: string[] = [];
      if (keys) {
        for (const k of keys) ids.push(draftId(locale, k.file, k.key));
      } else {
        for (const d of drafts.values()) if (d.locale === locale) ids.push(d.id);
      }
      for (const id of ids) drafts.delete(id);
      await write([DRAFTS], (tx) => {
        const os = tx.objectStore(DRAFTS);
        for (const id of ids) os.delete(id);
      });
    },
    async getMeta(locale) {
      const m = metas.get(locale);
      return m ? cloneMeta(m) : undefined;
    },
    async putMeta(meta) {
      const copy = cloneMeta(meta);
      metas.set(copy.locale, copy);
      await write([META], (tx) => {
        tx.objectStore(META).put(cloneMeta(copy));
      });
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    close() {
      const h = handle;
      handle = null;
      listeners.clear();
      try {
        h?.close();
      } catch {
        /* ignore */
      }
    },
  };
}

export function createMemoryDraftStore(
  reason: string | null = 'unavailable',
  now: () => number = Date.now,
): DraftStore {
  return createStore(null, reason, now, new Map(), new Map());
}

async function loadAll(db: IDBDatabase): Promise<{ drafts: Map<string, DraftRow>; metas: Map<string, BaseMeta> }> {
  const drafts = new Map<string, DraftRow>();
  const metas = new Map<string, BaseMeta>();
  await runTx(db, [DRAFTS, META], 'readonly', (tx) => {
    const dReq = tx.objectStore(DRAFTS).getAll() as IDBRequest<DraftRow[]>;
    dReq.onsuccess = () => {
      for (const row of dReq.result) {
        const id = draftId(row.locale, row.file, row.key);
        drafts.set(id, { ...cloneDraft(row), id });
      }
    };
    const mReq = tx.objectStore(META).getAll() as IDBRequest<BaseMeta[]>;
    mReq.onsuccess = () => {
      for (const m of mReq.result) metas.set(m.locale, cloneMeta(m));
    };
  });
  return { drafts, metas };
}

export function openDraftStore(options: OpenDraftStoreOptions = {}): Promise<DraftStore> {
  const now = options.now ?? Date.now;
  const timeoutMs = options.openTimeoutMs ?? 3000;

  return new Promise<DraftStore>((resolve) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const fallback = (why: string): void => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      resolve(createMemoryDraftStore(why, now));
    };

    let factory: IDBFactory | null | undefined;
    try {
      factory = options.indexedDB === undefined ? globalThis.indexedDB : options.indexedDB;
    } catch {
      factory = null;
    }
    if (!factory) {
      fallback('unavailable');
      return;
    }

    try {
      timer = setTimeout(() => fallback('open_timeout'), timeoutMs);
      const req = factory.open(DRAFT_DB_NAME, DRAFT_DB_VERSION);
      req.onupgradeneeded = () => {
        try {
          const db = req.result;
          if (!db.objectStoreNames.contains(DRAFTS)) {
            const os = db.createObjectStore(DRAFTS, { keyPath: 'id' });
            os.createIndex('locale', 'locale');
          }
          if (!db.objectStoreNames.contains(META)) db.createObjectStore(META, { keyPath: 'locale' });
        } catch {
          fallback('open_failed');
        }
      };
      req.onblocked = () => fallback('blocked');
      req.onerror = () => fallback('open_failed');
      req.onsuccess = () => {
        const db = req.result;
        if (settled) {
          try {
            db.close();
          } catch {
            /* ignore */
          }
          return;
        }
        loadAll(db).then(
          ({ drafts, metas }) => {
            if (settled) {
              try {
                db.close();
              } catch {
                /* ignore */
              }
              return;
            }
            settled = true;
            if (timer) clearTimeout(timer);
            resolve(createStore(db, null, now, drafts, metas));
          },
          () => {
            try {
              db.close();
            } catch {
              /* ignore */
            }
            fallback('open_failed');
          },
        );
      };
    } catch {
      fallback('open_failed');
    }
  });
}
