import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/studio/previewEngine', () => ({ studioProxyUrl: (id: string) => `/proxy/${id}` }));

import { createImageCache, IMAGE_CACHE_MAX } from './imageCache';

function harness(max?: number) {
  const closes: string[] = [];
  const fetchImpl = vi.fn(async (url: string) => ({
    ok: true,
    status: 200,
    blob: async () => new Blob([url]),
  }));
  const createBitmap = vi.fn(async (blob: Blob) => {
    const name = await blob.text();
    return { width: 10, height: 10, close: () => closes.push(name) } as unknown as ImageBitmap;
  });
  const cache = createImageCache({ urlFor: (id) => `/proxy/${id}`, fetchImpl, createBitmap, max });
  return { cache, closes, fetchImpl, createBitmap };
}

describe('imageCache', () => {
  it('evicts the least recently used entry past the cap and closes it once', async () => {
    const { cache, closes } = harness();
    for (let i = 0; i < IMAGE_CACHE_MAX; i++) await cache.ensureImage(`a${i}`);
    expect(cache.size()).toBe(IMAGE_CACHE_MAX);
    expect(closes).toEqual([]);
    await cache.ensureImage('a24'); // the 25th entry
    expect(cache.size()).toBe(IMAGE_CACHE_MAX);
    expect(closes).toEqual(['/proxy/a0']);
    expect(cache.getImageBitmap('a0')).toBeNull();
    expect(cache.getImageBitmap('a24')).not.toBeNull();
  });

  it('a read refreshes recency so the touched entry survives eviction', async () => {
    const { cache, closes } = harness(2);
    await cache.ensureImage('x');
    await cache.ensureImage('y');
    cache.getImageBitmap('x');
    await cache.ensureImage('z');
    expect(closes).toEqual(['/proxy/y']);
  });

  it('shares one fetch between concurrent ensureImage calls', async () => {
    const { cache, fetchImpl } = harness();
    await Promise.all([cache.ensureImage('a'), cache.ensureImage('a'), cache.ensureImage('a')]);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    await cache.ensureImage('a');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('release closes the bitmap', async () => {
    const { cache, closes } = harness();
    await cache.ensureImage('a');
    cache.release('a');
    expect(closes).toEqual(['/proxy/a']);
    expect(cache.getImageBitmap('a')).toBeNull();
  });

  it('closes a bitmap whose asset was released mid-load', async () => {
    const { cache, closes } = harness();
    const p = cache.ensureImage('a');
    cache.release('a');
    await p;
    expect(closes).toEqual(['/proxy/a']);
    expect(cache.size()).toBe(0);
  });

  it('notifies subscribers when a bitmap lands and prunes unreferenced entries', async () => {
    const { cache, closes } = harness();
    const seen: string[] = [];
    cache.subscribe((id) => seen.push(id));
    await cache.ensureImage('a');
    await cache.ensureImage('b');
    expect(seen).toEqual(['a', 'b']);
    cache.prune(new Set(['b']));
    expect(closes).toEqual(['/proxy/a']);
  });

  it('falls back to default decode options when the first attempt throws', async () => {
    const { cache, createBitmap } = harness();
    createBitmap.mockRejectedValueOnce(new Error('unsupported options'));
    await cache.ensureImage('a');
    expect(createBitmap).toHaveBeenCalledTimes(2);
    expect(cache.getImageBitmap('a')).not.toBeNull();
  });
});
