import { afterEach, describe, expect, it, vi } from 'vitest';
import { createLocalHistory, HISTORY_CAP, localHistory, type HistoryAdapter, type LocalHistoryEntry } from './localHistory';

function memoryAdapter(): HistoryAdapter & { rows: Map<string, LocalHistoryEntry> } {
  const rows = new Map<string, LocalHistoryEntry>();
  return {
    rows,
    getAll: async () => [...rows.values()],
    put: async (e) => void rows.set(e.jobId, e),
    delete: async (ids) => ids.forEach((id) => rows.delete(id)),
    clear: async () => rows.clear(),
  };
}

const NOW = 1_000_000_000;
const entry = (n: number, extra: Partial<LocalHistoryEntry> = {}): LocalHistoryEntry => ({
  jobId: `job-${n}`,
  tool: 'compress-image',
  kind: 'image',
  fileName: `out-${n}.jpg`,
  sizeBytes: 100,
  createdAt: NOW + n,
  expiresAt: NOW + 86_400_000,
  ...extra,
});

afterEach(() => vi.unstubAllGlobals());

describe('localHistory', () => {
  it('evicts the oldest entries beyond the cap of 20 on add', async () => {
    const a = memoryAdapter();
    const h = createLocalHistory(() => a, () => NOW);
    for (let i = 1; i <= HISTORY_CAP + 3; i += 1) await h.add(entry(i));
    const ids = (await h.list()).map((e) => e.jobId);
    expect(ids).toHaveLength(HISTORY_CAP);
    expect(ids[0]).toBe('job-23');
    expect(ids).not.toContain('job-1');
    expect(ids).not.toContain('job-3');
    expect(ids).toContain('job-4');
  });

  it('prunes expired entries on list and on prune()', async () => {
    const a = memoryAdapter();
    let now = NOW;
    const h = createLocalHistory(() => a, () => now);
    await h.add(entry(1, { expiresAt: NOW + 1000 }));
    await h.add(entry(2));
    now = NOW + 2000;
    expect((await h.list()).map((e) => e.jobId)).toEqual(['job-2']);
    expect(a.rows.has('job-1')).toBe(false);
    await h.add(entry(3, { expiresAt: NOW + 2500 }));
    now = NOW + 3000;
    expect(await h.prune()).toBe(1);
    expect(a.rows.has('job-3')).toBe(false);
  });

  it('add is idempotent per jobId and keeps an existing thumbnail', async () => {
    const a = memoryAdapter();
    const h = createLocalHistory(() => a, () => NOW);
    const thumb = new Blob(['x']);
    await h.add(entry(1, { thumbnail: thumb }));
    await h.add(entry(1, { createdAt: NOW + 50 }));
    await h.add(entry(1, { createdAt: NOW + 99 }));
    const list = await h.list();
    expect(list).toHaveLength(1);
    expect(list[0].thumbnail).toBe(thumb);
    expect(list[0].createdAt).toBe(NOW + 1);
  });

  it('remove and clear work', async () => {
    const a = memoryAdapter();
    const h = createLocalHistory(() => a, () => NOW);
    await h.add(entry(1));
    await h.add(entry(2));
    await h.remove('job-1');
    expect((await h.list()).map((e) => e.jobId)).toEqual(['job-2']);
    await h.clear();
    expect(await h.list()).toEqual([]);
  });

  it('resolves without throwing when indexedDB is undefined', async () => {
    vi.stubGlobal('indexedDB', undefined);
    await expect(localHistory.list()).resolves.toEqual([]);
    await expect(localHistory.add(entry(1))).resolves.toBeUndefined();
    await expect(localHistory.remove('job-1')).resolves.toBeUndefined();
    await expect(localHistory.clear()).resolves.toBeUndefined();
    await expect(localHistory.prune()).resolves.toBe(0);
  });

  it('resolves without throwing when the adapter throws', async () => {
    const h = createLocalHistory(() => {
      throw new Error('denied');
    });
    await expect(h.list()).resolves.toEqual([]);
    await expect(h.add(entry(1))).resolves.toBeUndefined();
  });
});
