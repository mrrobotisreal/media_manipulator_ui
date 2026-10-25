/**
 * Project ids for the Motion editor. `/motion/new` mints a local id and the
 * URL is replaced with `/motion/<id>` so a reload reopens the same IndexedDB
 * draft. MM44: a project saved to the account (MM43) has a server id (a UUID,
 * `uuid.NewString()` in the API), and its first save replaces the URL again.
 */
import { parseVectorDoc, type VectorDoc } from '@/lib/vector/vectorTypes';

export const NEW_PROJECT_ID = 'new';
/** Local ids: `local-` + 12 base-36 chars. Valid as a route segment and a draft key. */
export const LOCAL_ID_PATTERN = /^local-[a-z0-9]{6,32}$/;

export function newLocalProjectId(random: () => number = Math.random): string {
  let s = '';
  while (s.length < 12) s += Math.floor(random() * 36).toString(36);
  return `local-${s.slice(0, 12)}`;
}

/** Server ids (MM43): lowercase UUIDs. */
export const SERVER_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export type ProjectRoute =
  | { kind: 'new' }
  | { kind: 'local'; id: string }
  | { kind: 'server'; id: string }
  | { kind: 'invalid' };

/** Classify the `[projectId]` route segment. */
export function classifyProjectId(segment: string): ProjectRoute {
  if (segment === NEW_PROJECT_ID) return { kind: 'new' };
  if (LOCAL_ID_PATTERN.test(segment)) return { kind: 'local', id: segment };
  if (SERVER_ID_PATTERN.test(segment)) return { kind: 'server', id: segment };
  return { kind: 'invalid' };
}

/** `<name>.motion.json`: the document as a file (signed-out save, "keep a copy" before a reload). */
export function docFileName(name: string | undefined): string {
  const base = (name ?? '').trim().replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '-').slice(0, 80) || 'drawing';
  return `${base}.motion.json`;
}

/** A fresh blank document with the proposed defaults. */
export function blankDoc(): VectorDoc {
  const r = parseVectorDoc({ version: 1 });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
}
