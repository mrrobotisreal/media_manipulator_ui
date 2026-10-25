/**
 * Local project ids for the Motion editor (MM42: every project is local;
 * server ids arrive with MM44). `/motion/new` mints a local id and the URL is
 * replaced with `/motion/<id>` so a reload reopens the same IndexedDB draft.
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

export type ProjectRoute = { kind: 'new' } | { kind: 'local'; id: string } | { kind: 'invalid' };

/** Classify the `[projectId]` route segment. */
export function classifyProjectId(segment: string): ProjectRoute {
  if (segment === NEW_PROJECT_ID) return { kind: 'new' };
  if (LOCAL_ID_PATTERN.test(segment)) return { kind: 'local', id: segment };
  return { kind: 'invalid' };
}

/** A fresh blank document with the proposed defaults. */
export function blankDoc(): VectorDoc {
  const r = parseVectorDoc({ version: 1 });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
}
