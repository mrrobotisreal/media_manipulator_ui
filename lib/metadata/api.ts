/**
 * Metadata API client (pure fetchers, no React). Hooks live in
 * components/metadata/use-metadata-data.ts because lib/metadata may not import React.
 *
 * Every call goes through authedFetch so X-MM-Session-ID / the bearer token ride along
 * (MM05/MM08 ownership). `?sid=` is rejected on these routes, so binaries are fetched into
 * blob URLs rather than used as <img src>.
 */
import { z } from 'zod';
import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL } from '@/lib/utils';
import { metadataDocumentSchema, metadataEntrySchema, type MetadataDocument } from './types';

export type MetadataSide = 'original' | 'result';

export class MetadataApiError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'MetadataApiError';
    this.status = status;
  }
}

export const diffResultSchema = z.object({
  removed: z.array(metadataEntrySchema).nullish().transform((v) => v ?? []),
  added: z.array(metadataEntrySchema).nullish().transform((v) => v ?? []),
  changed: z
    .array(z.object({ id: z.string(), before: z.unknown(), after: z.unknown() }))
    .nullish()
    .transform((v) => v ?? []),
  unchanged: z.number(),
  byCategory: z
    .record(z.string(), z.object({ removed: z.number(), added: z.number(), changed: z.number(), unchanged: z.number() }))
    .nullish()
    .transform((v) => v ?? {}),
});
export type DiffResult = z.infer<typeof diffResultSchema>;

export const metadataBinaryUrl = (jobId: string, entryId: string, side: MetadataSide, inline = false): string =>
  `${getBaseURL()}/job/${encodeURIComponent(jobId)}/metadata/binary/${encodeURIComponent(entryId)}?side=${side}${inline ? '&inline=1' : ''}`;

async function readJson(response: Response): Promise<unknown> {
  if (!response.ok) {
    let message = response.statusText || 'request failed';
    try {
      const body = (await response.json()) as { error?: unknown };
      if (typeof body?.error === 'string') message = body.error;
    } catch {
      // keep statusText
    }
    throw new MetadataApiError(response.status, message);
  }
  return response.json();
}

export async function inspectFile(file: File, signal?: AbortSignal): Promise<MetadataDocument> {
  const form = new FormData();
  form.append('file', file);
  // No Content-Type: the browser sets the multipart boundary.
  const response = await authedFetch(`${getBaseURL()}/metadata/inspect`, { method: 'POST', body: form, signal });
  return metadataDocumentSchema.parse(await readJson(response));
}

export async function fetchJobMetadata(jobId: string, side: MetadataSide, signal?: AbortSignal): Promise<MetadataDocument> {
  const response = await authedFetch(`${getBaseURL()}/job/${encodeURIComponent(jobId)}/metadata?side=${side}`, { signal });
  return metadataDocumentSchema.parse(await readJson(response));
}

export async function fetchJobMetadataDiff(jobId: string, signal?: AbortSignal): Promise<DiffResult> {
  const response = await authedFetch(`${getBaseURL()}/job/${encodeURIComponent(jobId)}/metadata/diff`, { signal });
  return diffResultSchema.parse(await readJson(response));
}

export async function fetchMetadataBinary(url: string, signal?: AbortSignal): Promise<Blob> {
  const response = await authedFetch(url, { signal });
  if (!response.ok) throw new MetadataApiError(response.status, response.statusText || 'binary unavailable');
  return response.blob();
}
