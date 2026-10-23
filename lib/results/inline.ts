import { getSessionId } from '@/lib/analytics';
import { getBaseURL } from '@/lib/utils';
import type { ResultDescriptor, ResultKind } from './describe';

/** Kinds the browser can stream from the inline route with range requests. */
const INLINE_KINDS: ReadonlySet<ResultKind> = new Set<ResultKind>(['video', 'audio', 'pdf']);

/**
 * URL of `GET /api/result/:jobId` (MM05) for kinds that can stream, or null.
 *
 * Feature-detected through `descriptor.mimeFromServer`: the API only sends `resultMime` once
 * it supports the inline route, so an older API (or a job without a sniffed MIME) keeps the
 * blob path. `?sid=` carries the session because <video>/<audio>/<iframe> cannot send the
 * X-MM-Session-ID header; the API accepts it on the inline routes only, never on /download.
 */
export function inlineResultUrl(
  descriptor: Pick<ResultDescriptor, 'jobId' | 'kind' | 'mimeFromServer'>,
): string | null {
  if (!descriptor.mimeFromServer || !INLINE_KINDS.has(descriptor.kind)) return null;
  return `${getBaseURL()}/result/${encodeURIComponent(descriptor.jobId)}?sid=${encodeURIComponent(getSessionId())}`;
}
