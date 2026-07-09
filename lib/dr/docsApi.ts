// Double Raven documents API. The transport/auth/retry plumbing lives in
// apiClient.ts; this module just maps DR document endpoints to zod-parsed
// results. Responses are parsed so malformed content fails fast instead of
// rendering garbage.

import {
  DrDocFolderSchema,
  DrDocFoldersResponseSchema,
  DrDocSchema,
  DrDocsListResponseSchema,
  type DrDoc,
  type DrDocFolder,
  type DrDocSummary,
} from '@/schemas/drDocs';
import { drGet, drSend } from './apiClient';

// Re-exported so existing importers (`@/lib/dr/docsApi`) keep working.
export { DrApiError, drQueryRetry } from './apiClient';

const enc = encodeURIComponent;

export const fetchDrDocs = async (): Promise<DrDocSummary[]> =>
  DrDocsListResponseSchema.parse(await drGet('/dr/docs')).docs;

export const fetchDrDoc = async (slug: string): Promise<DrDoc> =>
  DrDocSchema.parse(await drGet(`/dr/docs/${enc(slug)}`));

// ---- Documentation filesystem (folders + doc move/rename) -------------------
// Folder CRUD lives under /dr/doc-folders (the /docs/:slug wildcard is pinned
// server-side); document move/rename join the /docs/:slug subtree addressed by
// document UUID.

export const fetchDrDocFolders = async (): Promise<DrDocFolder[]> =>
  DrDocFoldersResponseSchema.parse(await drGet('/dr/doc-folders')).folders;

export const createDrDocFolder = async (name: string, parentId: string | null): Promise<DrDocFolder> =>
  DrDocFolderSchema.parse(await drSend('POST', '/dr/doc-folders', { name, parentId }));

/** Partial update: rename and/or move in one call. `parentId: null` moves to
 *  root; OMIT parentId (undefined) to leave placement unchanged. */
export const updateDrDocFolder = async (
  folderId: string,
  body: { name?: string; parentId?: string | null },
): Promise<DrDocFolder> =>
  DrDocFolderSchema.parse(await drSend('PUT', `/dr/doc-folders/${enc(folderId)}`, body));

export const deleteDrDocFolder = async (folderId: string): Promise<void> => {
  await drSend('DELETE', `/dr/doc-folders/${enc(folderId)}`);
};

/** Move a document into a folder (null = root). Addressed by document UUID. */
export const moveDrDoc = async (docId: string, folderId: string | null): Promise<void> => {
  await drSend('PUT', `/dr/docs/${enc(docId)}/move`, { folderId });
};

/** Rename a document's TITLE only — the slug never changes (stable URLs,
 *  comments/revisions chain). Addressed by document UUID. */
export const renameDrDoc = async (docId: string, title: string): Promise<void> => {
  await drSend('PUT', `/dr/docs/${enc(docId)}/rename`, { title });
};
