import { resolveEntryPath, rewriteM3u8 } from './rewrite';

/**
 * Safari-native HLS has no loader hook, so it needs real blob URLs in the playlists. Builds a
 * blob URL for `entryPath`, rewriting every playlist it references first (depth first, cycle
 * safe). `makeUrl` turns a file's bytes into a URL (the caller owns revocation).
 */
export function buildNativePlaylistUrl(
  entryPath: string,
  read: (path: string) => Uint8Array | null,
  makeUrl: (path: string, bytes: Uint8Array | string) => string,
): string | null {
  const done = new Map<string, string | null>();
  const visiting = new Set<string>();
  const urlFor = (path: string): string | null => {
    if (done.has(path)) return done.get(path)!;
    const bytes = read(path);
    if (!bytes) return null;
    if (!path.toLowerCase().endsWith('.m3u8')) {
      const url = makeUrl(path, bytes);
      done.set(path, url);
      return url;
    }
    if (visiting.has(path)) return null;
    visiting.add(path);
    const text = new TextDecoder().decode(bytes);
    const rewritten = rewriteM3u8(text, (ref) => {
      const target = resolveEntryPath(path, ref);
      return target === null ? null : urlFor(target);
    });
    visiting.delete(path);
    const url = makeUrl(path, rewritten);
    done.set(path, url);
    return url;
  };
  return urlFor(entryPath);
}
