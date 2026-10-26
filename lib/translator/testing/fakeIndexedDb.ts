/**
 * Minimal in-memory fake of the IndexedDB surface used by draftStore (tests only).
 * Data persists across open() calls on the same factory instance, so closing a
 * store and opening a new one on the same factory simulates a page reload.
 * Values are structured-cloned on put and on read to expose aliasing bugs.
 */

export interface FakeIndexedDbOptions {
  failOpen?: 'throw' | 'error' | 'blocked' | 'hang';
}

interface StoreData {
  keyPath: string;
  indexes: Map<string, string>;
  rows: Map<string, unknown>;
}
interface DbData {
  version: number;
  stores: Map<string, StoreData>;
}

type Handler = ((ev?: unknown) => void) | null;

export interface FakeIndexedDb {
  /** Set true to make every subsequent write transaction abort. */
  failWrites: boolean;
  failOpen: FakeIndexedDbOptions['failOpen'];
  open(name: string, version?: number): IDBOpenDBRequest;
  /** The fake typed as an IDBFactory. */
  asFactory(): IDBFactory;
}

const later = (fn: () => void): void => {
  setTimeout(fn, 0);
};

export function createFakeIndexedDb(options: FakeIndexedDbOptions = {}): FakeIndexedDb {
  const databases = new Map<string, DbData>();

  const fake: FakeIndexedDb = {
    failWrites: false,
    failOpen: options.failOpen,
    asFactory: () => fake as unknown as IDBFactory,
    open(name: string, version = 1) {
      if (fake.failOpen === 'throw') throw new Error('fake indexedDB.open threw');
      const req = {
        result: undefined as unknown,
        error: null as unknown,
        onsuccess: null as Handler,
        onerror: null as Handler,
        onblocked: null as Handler,
        onupgradeneeded: null as Handler,
      };
      later(() => {
        if (fake.failOpen === 'hang') return;
        if (fake.failOpen === 'blocked') {
          req.onblocked?.({});
          return;
        }
        if (fake.failOpen === 'error') {
          req.error = new Error('fake open error');
          req.onerror?.({});
          return;
        }
        let data = databases.get(name);
        const needsUpgrade = !data || data.version < version;
        if (!data) {
          data = { version, stores: new Map() };
          databases.set(name, data);
        }
        const db = makeConnection(data, fake);
        req.result = db;
        if (needsUpgrade) {
          data.version = version;
          req.onupgradeneeded?.({ target: req });
        }
        req.onsuccess?.({ target: req });
      });
      return req as unknown as IDBOpenDBRequest;
    },
  };
  return fake;
}

function makeConnection(data: DbData, fake: FakeIndexedDb) {
  let closed = false;
  const db = {
    onversionchange: null as Handler,
    get objectStoreNames() {
      return { contains: (n: string) => data.stores.has(n) };
    },
    createObjectStore(name: string, opts: { keyPath: string }) {
      const sd: StoreData = { keyPath: opts.keyPath, indexes: new Map(), rows: new Map() };
      data.stores.set(name, sd);
      return makeStore(sd, null);
    },
    transaction(names: string | string[], mode: IDBTransactionMode = 'readonly') {
      if (closed) throw new Error('InvalidStateError: connection is closed');
      const list = Array.isArray(names) ? names : [names];
      for (const n of list) if (!data.stores.has(n)) throw new Error(`NotFoundError: ${n}`);
      return makeTx(data, mode, fake);
    },
    close() {
      closed = true;
    },
  };
  return db;
}

interface TxState {
  mode: IDBTransactionMode;
  fake: FakeIndexedDb;
  pending: number;
  done: boolean;
  fail: () => void;
  settle: () => void;
}

function makeTx(data: DbData, mode: IDBTransactionMode, fake: FakeIndexedDb) {
  const tx = {
    error: null as unknown,
    oncomplete: null as Handler,
    onerror: null as Handler,
    onabort: null as Handler,
    objectStore(name: string) {
      const sd = data.stores.get(name);
      if (!sd) throw new Error(`NotFoundError: ${name}`);
      return makeStore(sd, state);
    },
  };
  const state: TxState = {
    mode,
    fake,
    pending: 0,
    done: false,
    fail: () => {
      if (state.done) return;
      state.done = true;
      tx.error = new Error('QuotaExceededError (fake)');
      later(() => {
        tx.onerror?.({});
        tx.onabort?.({});
      });
    },
    settle: () => {
      later(() => {
        if (state.done || state.pending > 0) return;
        state.done = true;
        tx.oncomplete?.({});
      });
    },
  };
  state.settle();
  return tx;
}

function makeStore(sd: StoreData, tx: TxState | null) {
  const request = (op: () => unknown, write: boolean) => {
    const req = {
      result: undefined as unknown,
      error: null as unknown,
      onsuccess: null as Handler,
      onerror: null as Handler,
    };
    if (tx) tx.pending++;
    if (write && tx && tx.fake.failWrites) {
      tx.pending--;
      later(() => {
        req.error = new Error('QuotaExceededError (fake)');
        req.onerror?.({});
      });
      tx.fail();
      return req;
    }
    const result = op();
    later(() => {
      if (tx) tx.pending--;
      if (tx?.done) return;
      req.result = result === undefined ? undefined : structuredClone(result);
      req.onsuccess?.({ target: req });
      tx?.settle();
    });
    return req;
  };
  return {
    createIndex(name: string, keyPath: string) {
      sd.indexes.set(name, keyPath);
      return {};
    },
    get: (key: string) => request(() => sd.rows.get(key), false),
    getAll: () => request(() => [...sd.rows.values()], false),
    put: (value: Record<string, unknown>) =>
      request(() => {
        const key = String(value[sd.keyPath]);
        sd.rows.set(key, structuredClone(value));
        return key;
      }, true),
    delete: (key: string) =>
      request(() => {
        sd.rows.delete(key);
        return undefined;
      }, true),
    clear: () =>
      request(() => {
        sd.rows.clear();
        return undefined;
      }, true),
  };
}
