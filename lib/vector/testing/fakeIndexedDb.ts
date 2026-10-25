/**
 * In-repo fake IndexedDB for tests (no fake-indexeddb dependency), copied from
 * the Darkroom draft tests (lib/studio/draftStore.test.ts) and extended with
 * a 'throws' mode. Only the slice the draft stores use.
 */
class FakeRequest<T = unknown> {
  result!: T;
  error: Error | null = null;
  onsuccess: (() => void) | null = null;
  onerror: (() => void) | null = null;
}

class FakeObjectStore {
  constructor(
    private data: Map<string, unknown>,
    private keyPath: string,
  ) {}

  private run<T>(op: () => T): FakeRequest<T> {
    const req = new FakeRequest<T>();
    let result: T | undefined;
    let error: Error | null = null;
    try {
      result = op();
    } catch (e) {
      error = e instanceof Error ? e : new Error(String(e));
    }
    queueMicrotask(() => {
      if (error) {
        req.error = error;
        req.onerror?.();
      } else {
        req.result = result as T;
        req.onsuccess?.();
      }
    });
    return req;
  }

  put(value: unknown) {
    return this.run(() => {
      const key = (value as Record<string, unknown>)[this.keyPath];
      if (typeof key !== 'string') throw new Error('missing key');
      this.data.set(key, structuredClone(value));
      return key;
    });
  }

  get(key: string) {
    return this.run(() => structuredClone(this.data.get(key)));
  }

  delete(key: string) {
    return this.run(() => {
      this.data.delete(key);
      return undefined;
    });
  }

  getAll() {
    return this.run(() => Array.from(this.data.values(), (v) => structuredClone(v)));
  }
}

class FakeTransaction {
  oncomplete: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onabort: (() => void) | null = null;
  error: Error | null = null;

  constructor(private db: FakeDatabase) {
    // After all microtask-chained requests: the macrotask boundary.
    setTimeout(() => this.oncomplete?.(), 0);
  }

  objectStore(name: string) {
    return this.db.getStore(name);
  }
}

class FakeDatabase {
  private stores = new Map<string, { data: Map<string, unknown>; keyPath: string }>();

  objectStoreNames = {
    contains: (name: string) => this.stores.has(name),
  };

  createObjectStore(name: string, opts: { keyPath: string }) {
    this.stores.set(name, { data: new Map(), keyPath: opts.keyPath });
  }

  getStore(name: string): FakeObjectStore {
    const s = this.stores.get(name);
    if (!s) throw new Error(`no object store ${name}`);
    return new FakeObjectStore(s.data, s.keyPath);
  }

  transaction(name: string) {
    if (!this.stores.has(name)) throw new Error(`no object store ${name}`);
    return new FakeTransaction(this);
  }

  close() {}
}

export class FakeIDBFactory {
  private dbs = new Map<string, FakeDatabase>();

  open(name: string) {
    const req = new FakeRequest<FakeDatabase>() as FakeRequest<FakeDatabase> & {
      onupgradeneeded: (() => void) | null;
    };
    req.onupgradeneeded = null;
    const isNew = !this.dbs.has(name);
    if (isNew) this.dbs.set(name, new FakeDatabase());
    req.result = this.dbs.get(name)!;
    queueMicrotask(() => {
      if (isNew) req.onupgradeneeded?.();
      req.onsuccess?.();
    });
    return req;
  }

  /** Raw access for assertions. */
  peek(name: string): FakeDatabase | undefined {
    return this.dbs.get(name);
  }
}


/** A factory whose every open() throws synchronously (IndexedDB blocked). */
export const throwingIndexedDb = {
  open() {
    throw new Error('SecurityError: IndexedDB is disabled');
  },
};

/** A factory whose open() fails asynchronously (quota / corruption). */
export const failingIndexedDb = {
  open() {
    const req: { error: Error; onsuccess: null | (() => void); onerror: null | (() => void); onupgradeneeded: null } = {
      error: new Error('UnknownError'),
      onsuccess: null,
      onerror: null,
      onupgradeneeded: null,
    };
    queueMicrotask(() => req.onerror?.());
    return req;
  },
};
