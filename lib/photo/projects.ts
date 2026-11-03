/** Route segment classification for `/photo/[projectId]`. */
export const NEW_PROJECT_ID = 'new';
export const LOCAL_ROUTE_ID = 'local';
/** Server ids (MM95): lowercase UUIDs. */
export const SERVER_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export type PhotoRoute = { kind: 'new' } | { kind: 'local' } | { kind: 'server'; id: string } | { kind: 'invalid' };

export function classifyPhotoRoute(segment: string): PhotoRoute {
  if (segment === NEW_PROJECT_ID) return { kind: 'new' };
  if (segment === LOCAL_ROUTE_ID) return { kind: 'local' };
  if (SERVER_ID_PATTERN.test(segment)) return { kind: 'server', id: segment };
  return { kind: 'invalid' };
}

/** A job id for `?from=<jobId>`: conservative, route-safe. */
export const JOB_ID_PATTERN = /^[A-Za-z0-9_-]{6,80}$/;
export const isJobId = (v: string | null | undefined): v is string => !!v && JOB_ID_PATTERN.test(v);

/** Project name from a file name: strip the extension, trim, cap at 80. */
export function nameFromFile(fileName: string, fallback: string): string {
  const base = fileName.replace(/\.[^.]+$/, '').trim().slice(0, 80);
  return base || fallback;
}

/** Formats the browser can usually decode itself; others wait for the server proxy. */
export const BROWSER_DECODABLE = /^image\/(jpeg|png|webp|gif|avif|bmp)$/;
export const isLikelyServerOnlyFormat = (file: { type: string; name: string }): boolean =>
  /^image\/(heic|heif|tiff)$/.test(file.type) || /\.(heic|heif|tif|tiff)$/i.test(file.name);
