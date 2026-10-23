import { studioProxyUrl } from '@/lib/studio/previewEngine';

/**
 * LRU cache of decoded still-image bitmaps for the preview (ADR-0008).
 *
 * One entry per ASSET (not per clip): every clip using the same image shares
 * the bitmap and the single GL texture keyed by the asset id. The cap is
 * deliberate: a 1920-px proxy is ~8 MB RGBA, so 24 entries is ~200 MB worst
 * case. Evicted / released bitmaps are close()d to free the GPU/CPU memory.
 */
export const IMAGE_CACHE_MAX = 24;

export interface ImageCacheDeps {
  urlFor: (assetId: string) => string;
  fetchImpl: (url: string) => Promise<{ ok: boolean; status: number; blob(): Promise<Blob> }>;
  createBitmap: (blob: Blob, options?: ImageBitmapOptions) => Promise<ImageBitmap>;
  max?: number;
}

export interface ImageCache {
  getImageBitmap(assetId: string): ImageBitmap | null;
  ensureImage(assetId: string): Promise<void>;
  release(assetId: string): void;
  /** Releases every cached entry whose asset id is not in `live`. */
  prune(live: Set<string>): void;
  subscribe(cb: (assetId: string) => void): () => void;
  size(): number;
}

export function createImageCache(deps: ImageCacheDeps): ImageCache {
  const max = deps.max ?? IMAGE_CACHE_MAX;
  // Map iteration order is insertion order: re-inserting on read keeps the
  // least-recently-used entry first.
  const entries = new Map<string, ImageBitmap>();
  const pending = new Map<string, Promise<void>>();
  const released = new Set<string>();
  const listeners = new Set<(assetId: string) => void>();

  const closeBitmap = (bmp: ImageBitmap) => {
    try {
      bmp.close();
    } catch {
      /* already closed */
    }
  };

  const decode = async (blob: Blob): Promise<ImageBitmap> => {
    try {
      return await deps.createBitmap(blob, { premultiplyAlpha: 'none', colorSpaceConversion: 'default' });
    } catch {
      // Safari's option support is partial: retry with defaults.
      return deps.createBitmap(blob);
    }
  };

  const insert = (assetId: string, bmp: ImageBitmap) => {
    entries.delete(assetId);
    entries.set(assetId, bmp);
    while (entries.size > max) {
      const oldest = entries.keys().next().value as string;
      const victim = entries.get(oldest);
      entries.delete(oldest);
      if (victim) closeBitmap(victim);
    }
  };

  return {
    getImageBitmap(assetId) {
      const bmp = entries.get(assetId);
      if (!bmp) return null;
      entries.delete(assetId);
      entries.set(assetId, bmp);
      return bmp;
    },
    ensureImage(assetId) {
      if (entries.has(assetId)) return Promise.resolve();
      const inflight = pending.get(assetId);
      if (inflight) return inflight;
      released.delete(assetId);
      const p = (async () => {
        try {
          const res = await deps.fetchImpl(deps.urlFor(assetId));
          if (!res.ok) throw new Error(`image proxy ${res.status}`);
          const bmp = await decode(await res.blob());
          if (released.has(assetId)) {
            // release() raced the load: nobody wants this bitmap any more.
            released.delete(assetId);
            closeBitmap(bmp);
            return;
          }
          insert(assetId, bmp);
          listeners.forEach((cb) => cb(assetId));
        } catch {
          /* leave uncached; the next frame retries */
        } finally {
          pending.delete(assetId);
        }
      })();
      pending.set(assetId, p);
      return p;
    },
    release(assetId) {
      const bmp = entries.get(assetId);
      if (bmp) {
        entries.delete(assetId);
        closeBitmap(bmp);
      }
      if (pending.has(assetId)) released.add(assetId);
    },
    prune(live) {
      for (const id of [...entries.keys()]) {
        if (!live.has(id)) this.release(id);
      }
    },
    subscribe(cb) {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    size: () => entries.size,
  };
}

let shared: ImageCache | null = null;

function sharedCache(): ImageCache {
  if (!shared) {
    shared = createImageCache({
      urlFor: studioProxyUrl,
      fetchImpl: (url) => fetch(url, { mode: 'cors' }),
      createBitmap: (blob, options) => createImageBitmap(blob, options),
    });
  }
  return shared;
}

export const getImageBitmap = (assetId: string) => sharedCache().getImageBitmap(assetId);
export const ensureImage = (assetId: string) => sharedCache().ensureImage(assetId);
export const releaseImage = (assetId: string) => sharedCache().release(assetId);
export const pruneImageCache = (live: Set<string>) => sharedCache().prune(live);
export const subscribeImageCache = (cb: (assetId: string) => void) => sharedCache().subscribe(cb);
