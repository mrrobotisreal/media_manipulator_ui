import { getSessionId } from '@/lib/analytics';
import { getBaseURL } from '@/lib/utils';
import type { ResultDescriptor, ResultKind } from './describe';

/** Kinds the browser can stream from the inline route with range requests. */
const INLINE_KINDS: ReadonlySet<ResultKind> = new Set<ResultKind>(['video', 'audio', 'pdf']);

/** Kinds a public share URL can feed straight into an element. */
const PUBLIC_INLINE_KINDS: ReadonlySet<ResultKind> = new Set<ResultKind>(['video', 'audio', 'pdf', 'image', 'gif']);

/**
 * URL of `GET /api/result/:jobId` (MM05) for kinds that can stream, or null.
 *
 * Feature-detected through `descriptor.mimeFromServer`: the API only sends `resultMime` once
 * it supports the inline route, so an older API (or a job without a sniffed MIME) keeps the
 * blob path. `?sid=` carries the session because <video>/<audio>/<iframe> cannot send the
 * X-MM-Session-ID header; the API accepts it on the inline routes only, never on /download.
 */
export function inlineResultUrl(
  descriptor: Pick<ResultDescriptor, 'jobId' | 'kind' | 'mimeFromServer'> & { sourceUrl?: string },
): string | null {
  // MM32 shared result: the token URL streams image, GIF, video, audio and PDF directly.
  if (descriptor.sourceUrl && PUBLIC_INLINE_KINDS.has(descriptor.kind)) return descriptor.sourceUrl;
  if (!descriptor.mimeFromServer || !INLINE_KINDS.has(descriptor.kind)) return null;
  return `${getBaseURL()}/result/${encodeURIComponent(descriptor.jobId)}?sid=${encodeURIComponent(getSessionId())}`;
}

/**
 * Inline URL of one video-restoration clip: `name` is "original" or a completed model id
 * (MM05 `GET /video-restore/:jobId/result/:name`, video/mp4 with range support). `?sid=`
 * because <video> cannot send X-MM-Session-ID.
 */
export function restoreResultUrl(jobId: string, name: string): string {
  return `${getBaseURL()}/video-restore/${encodeURIComponent(jobId)}/result/${encodeURIComponent(name)}?sid=${encodeURIComponent(getSessionId())}`;
}
