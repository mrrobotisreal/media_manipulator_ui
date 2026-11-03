/**
 * Save flow for account projects (pure TypeScript, injectable API): a save
 * sends `If-Match: <revision>`; a 409 surfaces the server revision so the
 * editor can ask "Keep mine / Load theirs".
 */
import { PhotoApiError, getPhotoProject, savePhotoProject, type PhotoProject } from '@/lib/photo/projectsApi';
import type { PhotoDoc } from '@/lib/photo/photoTypes';

export type SaveOutcome =
  | { ok: true; project: PhotoProject }
  | { ok: false; kind: 'conflict'; serverRevision: number }
  | { ok: false; kind: 'error'; retryable: boolean; error: PhotoApiError };

export interface SaveApi {
  save: typeof savePhotoProject;
  get: typeof getPhotoProject;
}
const defaultApi: SaveApi = { save: savePhotoProject, get: getPhotoProject };

export async function saveDoc(id: string, revision: number, name: string, doc: PhotoDoc, api: SaveApi = defaultApi): Promise<SaveOutcome> {
  try {
    return { ok: true, project: await api.save(id, revision, { name, doc }) };
  } catch (e) {
    const err = e instanceof PhotoApiError ? e : new PhotoApiError(0, 'network');
    if (err.conflict) return { ok: false, kind: 'conflict', serverRevision: err.conflict.revision };
    return { ok: false, kind: 'error', retryable: err.retryable, error: err };
  }
}

/** "Keep mine": save my document on top of the server's current revision. */
export function keepMine(id: string, serverRevision: number, name: string, doc: PhotoDoc, api: SaveApi = defaultApi): Promise<SaveOutcome> {
  return saveDoc(id, serverRevision, name, doc, api);
}

/** "Load theirs": the server's document replaces mine (local edits are dropped on purpose). */
export async function loadTheirs(id: string, api: SaveApi = defaultApi): Promise<PhotoProject | null> {
  try {
    return await api.get(id);
  } catch {
    return null;
  }
}
