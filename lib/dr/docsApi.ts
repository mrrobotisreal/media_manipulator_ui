// Double Raven documents API. The transport/auth/retry plumbing lives in
// apiClient.ts; this module just maps DR document endpoints to zod-parsed
// results. Responses are parsed so malformed content fails fast instead of
// rendering garbage.

import {
  DrDocSchema,
  DrDocsListResponseSchema,
  type DrDoc,
  type DrDocSummary,
} from '@/schemas/drDocs';
import { drGet } from './apiClient';

// Re-exported so existing importers (`@/lib/dr/docsApi`) keep working.
export { DrApiError, drQueryRetry } from './apiClient';

export const fetchDrDocs = async (): Promise<DrDocSummary[]> =>
  DrDocsListResponseSchema.parse(await drGet('/dr/docs')).docs;

export const fetchDrDoc = async (slug: string): Promise<DrDoc> =>
  DrDocSchema.parse(await drGet(`/dr/docs/${encodeURIComponent(slug)}`));
