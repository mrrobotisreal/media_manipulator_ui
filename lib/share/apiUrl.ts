import { getBaseURL } from '@/lib/utils';

/**
 * MM32: the share descriptor's `downloadUrl` / `thumbnailUrl` are paths that START WITH
 * `/api/...`, but the UI's API base (`getBaseURL()`, from NEXT_PUBLIC_API_BASE_URL) normally
 * ALREADY ends in `/api` (default `https://api.media-manipulator.com/api`). Naively joining the
 * two gives `/api/api/share/...`. This joins them once, whichever shape the base has.
 */
export function absoluteApiUrl(path: string, base: string = getBaseURL()): string {
  if (/^https?:\/\//i.test(path)) return path;
  const origin = base.replace(/\/+$/, '');
  const rel = path.startsWith('/') ? path : `/${path}`;
  if (/\/api$/i.test(origin) && /^\/api(\/|$)/i.test(rel)) {
    return origin + rel.slice('/api'.length);
  }
  return origin + rel;
}
