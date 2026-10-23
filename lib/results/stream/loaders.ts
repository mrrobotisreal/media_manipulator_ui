import type { LoaderCallbacks, LoaderConfiguration, LoaderContext, LoaderStats } from 'hls.js';

/**
 * In-memory bundle serving. Playlists inside the bundle are resolved against a synthetic
 * origin, so hls.js / dash.js build absolute URLs under it and the loaders strip the origin
 * to get the archive path. Nothing here touches the network.
 */
export const BUNDLE_ORIGIN = 'https://mm-bundle.invalid/';

export const bundleUrl = (path: string): string => BUNDLE_ORIGIN + path.split('/').map(encodeURIComponent).join('/');

export function pathFromBundleUrl(url: string): string | null {
  if (!url.startsWith(BUNDLE_ORIGIN)) return null;
  const rest = url.slice(BUNDLE_ORIGIN.length).split('#')[0].split('?')[0];
  try {
    return rest.split('/').map(decodeURIComponent).join('/');
  } catch {
    return null;
  }
}

export type BundleLookup = (path: string) => Uint8Array | null;

/** Builds an hls.js loader class bound to an entry lookup. Pass it as `config.loader`. */
export function createBundleLoader(lookup: BundleLookup) {
  return class BundleLoader {
    context: LoaderContext | null = null;
    stats = {
      aborted: false, loaded: 0, retry: 0, total: 0, chunkCount: 0, bwEstimate: 0,
      loading: { start: 0, first: 0, end: 0 },
      parsing: { start: 0, end: 0 },
      buffering: { start: 0, first: 0, end: 0 },
    } as LoaderStats;

    destroy(): void {
      this.context = null;
    }

    abort(): void {
      this.stats.aborted = true;
    }

    load(context: LoaderContext, _config: LoaderConfiguration, callbacks: LoaderCallbacks<LoaderContext>): void {
      this.context = context;
      const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
      this.stats.loading.start = now();
      const path = pathFromBundleUrl(context.url);
      const bytes = path === null ? null : lookup(path);
      if (!bytes) {
        this.stats.loading.end = now();
        callbacks.onError({ code: 404, text: `Not in bundle: ${path ?? context.url}` }, context, null, this.stats);
        return;
      }
      const start = context.rangeStart ?? 0;
      const end = context.rangeEnd ?? bytes.length;
      const slice = bytes.subarray(start, Math.min(end, bytes.length));
      let data: ArrayBuffer | string;
      if (context.responseType === 'arraybuffer') {
        data = slice.buffer.slice(slice.byteOffset, slice.byteOffset + slice.byteLength) as ArrayBuffer;
      } else {
        data = new TextDecoder().decode(slice);
      }
      this.stats.loaded = slice.byteLength;
      this.stats.total = slice.byteLength;
      this.stats.loading.first = now();
      this.stats.loading.end = now();
      callbacks.onSuccess({ url: context.url, data }, this.stats, context, null);
    }
  };
}
