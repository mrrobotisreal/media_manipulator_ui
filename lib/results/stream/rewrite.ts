/**
 * Pure helpers for playing an HLS/DASH bundle that lives in memory.
 *
 * hls.js and dash.js normally fetch by URL. The primary mechanism is a loader keyed by entry
 * path (loaders.ts), which needs no rewriting. These helpers are the Safari-native fallback
 * (no MSE: the video element plays a blob playlist itself) and the codec sniff.
 */

/** Resolves `ref` against the directory of `basePath`, collapsing `.` and `..`. Null for absolute URLs. */
export function resolveEntryPath(basePath: string, ref: string): string | null {
  const cleaned = ref.split('#')[0].split('?')[0].trim();
  if (!cleaned || /^[a-z][a-z0-9+.-]*:/i.test(cleaned) || cleaned.startsWith('//')) return null;
  const parts = cleaned.startsWith('/') ? [] : basePath.split('/').slice(0, -1);
  for (const seg of cleaned.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') parts.pop();
    else parts.push(decodeURIComponent(seg));
  }
  return parts.join('/');
}

/**
 * Rewrites every reference in an m3u8: `URI="..."` attributes (EXT-X-MAP, EXT-X-KEY,
 * EXT-X-MEDIA, I-FRAME-STREAM-INF, ...) and bare segment / playlist lines. `resolve` gets the
 * reference as written and returns its replacement, or null to leave it alone.
 */
export function rewriteM3u8(text: string, resolve: (ref: string) => string | null): string {
  return text
    .split(/\r?\n/)
    .map((line) => {
      if (!line.trim()) return line;
      if (line.startsWith('#')) {
        return line.replace(/URI="([^"]*)"/g, (whole, ref: string) => {
          const next = resolve(ref);
          return next === null ? whole : `URI="${next}"`;
        });
      }
      return resolve(line.trim()) ?? line;
    })
    .join('\n');
}

/**
 * Rewrites `<BaseURL>` elements of an mpd. `media=` / `initialization=` templates are NOT
 * rewritten (they hold `$Number$` placeholders); those go through the request loader.
 */
export function rewriteMpd(text: string, resolve: (ref: string) => string | null): string {
  return text.replace(/(<BaseURL[^>]*>)([^<]*)(<\/BaseURL>)/g, (whole, open: string, ref: string, close: string) => {
    const next = resolve(ref.trim());
    return next === null ? whole : `${open}${next}${close}`;
  });
}

/** Codec strings an mpd declares, e.g. `av01.0.05M.08`. */
export function mpdCodecs(text: string): string[] {
  const out = new Set<string>();
  for (const match of text.matchAll(/codecs="([^"]+)"/g)) out.add(match[1]);
  return [...out];
}

/** True when any declared video codec is AV1. */
export const mpdUsesAv1 = (text: string): boolean => mpdCodecs(text).some((c) => c.startsWith('av01'));

export interface BundleFile {
  path: string;
  size: number;
}

/** The playlist/manifest to start from: `master.m3u8`, else the shallowest `.m3u8`; or the shallowest `.mpd`. */
export function findEntryPoint(files: readonly BundleFile[], kind: 'hls' | 'dash'): string | null {
  const ext = kind === 'hls' ? '.m3u8' : '.mpd';
  const candidates = files.filter((f) => f.path.toLowerCase().endsWith(ext));
  if (!candidates.length) return null;
  const depth = (p: string) => p.split('/').length;
  const master = candidates.filter((f) => /(^|\/)(master|index|playlist|manifest)[^/]*$/i.test(f.path));
  const pool = master.length ? master : candidates;
  return [...pool].sort((a, b) => depth(a.path) - depth(b.path) || a.path.localeCompare(b.path))[0].path;
}
