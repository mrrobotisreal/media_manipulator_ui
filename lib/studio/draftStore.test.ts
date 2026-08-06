import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { StudioProject } from '@/lib/studioTypes';
import {
  DRAFT_STORE_NAME,
  DRAFT_WRITE_THROTTLE_MS,
  createDraftWriter,
  deleteDraft,
  getDraft,
  pruneDrafts,
  putDraft,
  type StudioDraft,
} from './draftStore';

// ---------------------------------------------------------------------------
// In-repo fake IndexedDB (per AGENTS.md: no fake-indexeddb dependency). Only
// the slice draftStore uses: open/upgrade, one object store with a keyPath,
// put/get/delete/getAll. Operations mutate the backing Map synchronously and
// fire `onsuccess` on a microtask; `transaction.oncomplete` fires on a
// macrotask (setTimeout 0), which is after every microtask-chained request the
// caller issues — mirroring real IndexedDB's "requests keep the transaction
// alive" behavior closely enough for these suites (which use real timers).
// ---------------------------------------------------------------------------

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

class FakeIDBFactory {
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

// ---------------------------------------------------------------------------

const project = (id: string, over: Partial<StudioProject> = {}): StudioProject => ({
  id,
  name: 'Test project',
  schemaVersion: 3,
  fps: 30,
  width: 1920,
  height: 1080,
  durationSeconds: 0,
  tracks: [
    { id: `${id}-v1`, kind: 'video', index: 0, muted: false, clips: [] },
    { id: `${id}-a1`, kind: 'audio', index: 0, muted: false, clips: [] },
  ],
  captions: [],
  captionsEnabled: true,
  createdAt: '2026-08-01T00:00:00Z',
  updatedAt: '2026-08-01T00:00:00Z',
  ...over,
});

const draft = (projectId: string, over: Partial<StudioDraft> = {}): StudioDraft => ({
  projectId,
  baseRevision: 3,
  savedAt: Date.now(),
  document: project(projectId),
  ...over,
});

describe('draftStore (fake IndexedDB)', () => {
  let factory: FakeIDBFactory;

  beforeEach(() => {
    factory = new FakeIDBFactory();
    vi.stubGlobal('indexedDB', factory);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('round-trips a draft: put → get', async () => {
    const d = draft('p1');
    expect(await putDraft(d)).toBe(true);
    const got = await getDraft('p1');
    expect(got).not.toBeNull();
    expect(got!.projectId).toBe('p1');
    expect(got!.baseRevision).toBe(3);
    expect(got!.savedAt).toBe(d.savedAt);
    expect(got!.document).toMatchObject({ id: 'p1', name: 'Test project' });
  });

  it('returns null when no draft exists', async () => {
    expect(await getDraft('missing')).toBeNull();
  });

  it('replaces the previous draft for the same project (one draft per project)', async () => {
    await putDraft(draft('p1', { savedAt: 1000 }));
    await putDraft(draft('p1', { savedAt: 2000 }));
    const got = await getDraft('p1');
    expect(got!.savedAt).toBe(2000);
  });

  it('delete-on-save: deleteDraft removes the record', async () => {
    await putDraft(draft('p1'));
    expect(await deleteDraft('p1')).toBe(true);
    expect(await getDraft('p1')).toBeNull();
  });

  it('normalizes a missing baseRevision to null (legacy backend)', async () => {
    await putDraft(draft('p1', { baseRevision: null }));
    expect((await getDraft('p1'))!.baseRevision).toBeNull();
  });

  it('treats a corrupt record as absent and clears it', async () => {
    await putDraft({
      ...draft('p1'),
      document: { nonsense: true } as unknown as StudioProject,
    });
    expect(await getDraft('p1')).toBeNull();
    // The self-heal delete ran (fire-and-forget) — give it a beat.
    await new Promise((r) => setTimeout(r, 0));
    const db = factory.peek('mm-studio-drafts')!;
    const all = await new Promise<unknown[]>((resolve) => {
      const req = db.getStore(DRAFT_STORE_NAME).getAll();
      req.onsuccess = () => resolve(req.result);
    });
    expect(all).toHaveLength(0);
  });

  describe('pruneDrafts', () => {
    it('keeps the newest `keep` drafts and removes the rest', async () => {
      const now = 1_000_000_000;
      for (let i = 0; i < 12; i++) {
        await putDraft(draft(`p${i}`, { savedAt: now - i * 1000 }));
      }
      const removed = await pruneDrafts(10, 14, now);
      expect(removed).toBe(2);
      // p10/p11 were the two oldest.
      expect(await getDraft('p10')).toBeNull();
      expect(await getDraft('p11')).toBeNull();
      expect(await getDraft('p0')).not.toBeNull();
      expect(await getDraft('p9')).not.toBeNull();
    });

    it('removes drafts older than maxAgeDays even inside the keep window', async () => {
      const now = Date.now();
      const fifteenDaysAgo = now - 15 * 86_400_000;
      await putDraft(draft('fresh', { savedAt: now - 1000 }));
      await putDraft(draft('stale', { savedAt: fifteenDaysAgo }));
      const removed = await pruneDrafts(10, 14, now);
      expect(removed).toBe(1);
      expect(await getDraft('stale')).toBeNull();
      expect(await getDraft('fresh')).not.toBeNull();
    });

    it('removes nothing when everything is fresh and under the cap', async () => {
      const now = Date.now();
      await putDraft(draft('a', { savedAt: now - 1 }));
      await putDraft(draft('b', { savedAt: now - 2 }));
      expect(await pruneDrafts(10, 14, now)).toBe(0);
    });
  });

  describe('IndexedDB unavailable (private-mode Safari)', () => {
    beforeEach(() => {
      vi.stubGlobal('indexedDB', undefined);
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('every method degrades without throwing', async () => {
      expect(await putDraft(draft('p1'))).toBe(false);
      expect(await getDraft('p1')).toBeNull();
      expect(await deleteDraft('p1')).toBe(false);
      expect(await pruneDrafts()).toBe(0);
    });
  });

  it('degrades when open itself fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.stubGlobal('indexedDB', {
      open: () => {
        throw new Error('quota');
      },
    });
    expect(await putDraft(draft('p1'))).toBe(false);
    expect(await getDraft('p1')).toBeNull();
    warn.mockRestore();
  });
});

describe('createDraftWriter (trailing throttle)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('writes once, trailing, after the throttle interval', () => {
    const write = vi.fn();
    const writer = createDraftWriter(write);
    writer.notifyChange();
    expect(write).not.toHaveBeenCalled();
    vi.advanceTimersByTime(DRAFT_WRITE_THROTTLE_MS - 1);
    expect(write).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(write).toHaveBeenCalledTimes(1);
  });

  it('coalesces a burst of changes into one write (not per keystroke)', () => {
    const write = vi.fn();
    const writer = createDraftWriter(write);
    for (let i = 0; i < 50; i++) {
      writer.notifyChange();
      vi.advanceTimersByTime(10);
    }
    vi.advanceTimersByTime(DRAFT_WRITE_THROTTLE_MS);
    expect(write).toHaveBeenCalledTimes(1);
  });

  it('a change after a fire schedules the next trailing write', () => {
    const write = vi.fn();
    const writer = createDraftWriter(write);
    writer.notifyChange();
    vi.advanceTimersByTime(DRAFT_WRITE_THROTTLE_MS);
    expect(write).toHaveBeenCalledTimes(1);
    writer.notifyChange();
    vi.advanceTimersByTime(DRAFT_WRITE_THROTTLE_MS);
    expect(write).toHaveBeenCalledTimes(2);
  });

  it('flush writes a pending change immediately and cancels the timer', () => {
    const write = vi.fn();
    const writer = createDraftWriter(write);
    writer.notifyChange();
    writer.flush();
    expect(write).toHaveBeenCalledTimes(1);
    // The cancelled timer must not double-fire.
    vi.advanceTimersByTime(DRAFT_WRITE_THROTTLE_MS * 2);
    expect(write).toHaveBeenCalledTimes(1);
  });

  it('flush is a no-op when nothing changed since the last write', () => {
    const write = vi.fn();
    const writer = createDraftWriter(write);
    writer.flush();
    expect(write).not.toHaveBeenCalled();
    writer.notifyChange();
    vi.advanceTimersByTime(DRAFT_WRITE_THROTTLE_MS);
    writer.flush();
    expect(write).toHaveBeenCalledTimes(1);
  });

  it('dispose cancels pending work', () => {
    const write = vi.fn();
    const writer = createDraftWriter(write);
    writer.notifyChange();
    writer.dispose();
    vi.advanceTimersByTime(DRAFT_WRITE_THROTTLE_MS * 2);
    writer.flush();
    expect(write).not.toHaveBeenCalled();
  });

  it('honors a custom interval', () => {
    const write = vi.fn();
    const writer = createDraftWriter(write, 500);
    writer.notifyChange();
    vi.advanceTimersByTime(500);
    expect(write).toHaveBeenCalledTimes(1);
  });
});
