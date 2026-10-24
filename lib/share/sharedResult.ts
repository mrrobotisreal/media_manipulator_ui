import { cache } from 'react';
import type { ResultDescriptor, ResultKind } from '@/lib/results/describe';
import { TOOL_PAGES } from '@/content/toolPages';
import { absoluteApiUrl } from './apiUrl';
import { getBaseURL } from '@/lib/utils';

/** Public descriptor of `GET /api/share/:token` (handlers/share.go shareDescriptor). */
export interface ShareDescriptor {
  kind: string;
  fileName: string;
  sizeBytes: number;
  mime: string;
  tool: string;
  expiresAt: string;
  downloadUrl: string;
  thumbnailUrl?: string;
}

export type SharedLookup =
  | { status: 'ok'; share: ShareDescriptor }
  | { status: 'not_found' };

const KINDS: ReadonlySet<string> = new Set([
  'image', 'video', 'gif', 'audio', 'transcript', 'captions', 'pdf', 'archive', 'hls', 'dash', 'metadata', 'unknown',
]);

/** Server-side fetch of the descriptor. 404 -> not_found; any other failure throws (error boundary). */
export async function lookupShare(token: string, base: string = getBaseURL()): Promise<SharedLookup> {
  const res = await fetch(`${base.replace(/\/+$/, '')}/share/${encodeURIComponent(token)}`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  if (res.status === 404) return { status: 'not_found' };
  if (!res.ok) throw new Error(`share lookup failed: ${res.status}`);
  const share = (await res.json()) as ShareDescriptor;
  return { status: 'ok', share };
}

/** One lookup per request, shared by generateMetadata and the page. */
export const lookupShareCached = cache((token: string) => lookupShare(token));

/** The descriptor's panel model. `jobId` is a constant: the real job id is never public. */
export function shareToResultDescriptor(share: ShareDescriptor, base?: string): ResultDescriptor {
  const kind = (KINDS.has(share.kind) ? share.kind : 'unknown') as ResultKind;
  return {
    kind,
    mime: share.mime,
    fileName: share.fileName,
    sizeBytes: share.sizeBytes,
    jobId: 'shared',
    downloadUrl: absoluteApiUrl(share.downloadUrl, base),
    sourceUrl: shareFileUrl(share, base),
    expiresAt: share.expiresAt,
    mimeFromServer: true,
  };
}

/** Inline file URL: the download path minus `?download=1`. */
export function shareFileUrl(share: ShareDescriptor, base?: string): string {
  return absoluteApiUrl(share.downloadUrl.replace(/\?.*$/, ''), base);
}

/**
 * Tool page for the API's `tool` id: the single tool page whose embedded task is that id, or
 * the id used directly as a slug. Ambiguous ids (`convert` fits many pages) return null so the
 * CTA falls back to home.
 */
export function toolPathFor(tool: string): string | null {
  const direct = TOOL_PAGES.find((t) => t.slug === tool);
  if (direct) return `/tools/${direct.slug}`;
  const matches = TOOL_PAGES.filter((t) => t.embed.defaultTask === tool);
  return matches.length === 1 ? `/tools/${matches[0].slug}` : null;
}
