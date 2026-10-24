import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL } from '@/lib/utils';
import type { ResultKind } from '@/lib/results/describe';
import type { MediaKind } from '@/lib/analytics/events';

/** MM32 share-link client: `POST|DELETE /api/jobs/:jobId/share` (owner only). */

export type ShareErrorCode =
  | 'not_allowed' // 422 share_not_allowed (metadata report, Darkroom, unknown kind)
  | 'unavailable' // 409 result_unavailable (files expired or deleted)
  | 'limit' // 409 share_limit (5 live links per job)
  | 'unauthorized' // 401
  | 'not_found' // 404 (not the owner / unknown job)
  | 'bad_request' // 400
  | 'network'
  | 'unknown';

export class ShareError extends Error {
  constructor(
    public readonly code: ShareErrorCode,
    public readonly status = 0,
  ) {
    super(`share failed: ${code}`);
    this.name = 'ShareError';
  }
}

/** Pure status+body to code mapping (unit-tested; mirrors handlers/share.go CreateShare). */
export function shareErrorFromResponse(status: number, body: unknown): ShareError {
  const error = typeof (body as { error?: unknown } | null)?.error === 'string' ? (body as { error: string }).error : '';
  if (status === 422 && error === 'share_not_allowed') return new ShareError('not_allowed', status);
  if (status === 409 && error === 'result_unavailable') return new ShareError('unavailable', status);
  if (status === 409 && error === 'share_limit') return new ShareError('limit', status);
  if (status === 401) return new ShareError('unauthorized', status);
  if (status === 404) return new ShareError('not_found', status);
  if (status === 400) return new ShareError('bad_request', status);
  return new ShareError('unknown', status);
}

export interface CreatedShare {
  token: string;
  url: string;
  expiresAt: string;
}

const jobShareUrl = (jobId: string) => `${getBaseURL()}/jobs/${encodeURIComponent(jobId)}/share`;

async function readJson(res: Response): Promise<unknown> {
  return res.json().catch(() => null);
}

/** NOT idempotent: every call mints a new link, and the plaintext token is returned once. */
export async function createShareLink(jobId: string, ttlHours?: number): Promise<CreatedShare> {
  let res: Response;
  try {
    res = await authedFetch(jobShareUrl(jobId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ttlHours ? { ttlHours } : {}),
    });
  } catch (error) {
    if (error instanceof ShareError) throw error;
    throw new ShareError('network');
  }
  const body = await readJson(res);
  if (!res.ok) throw shareErrorFromResponse(res.status, body);
  const created = body as Partial<CreatedShare> | null;
  if (!created || typeof created.url !== 'string' || typeof created.expiresAt !== 'string') {
    throw new ShareError('unknown', res.status);
  }
  return { token: String(created.token ?? ''), url: created.url, expiresAt: created.expiresAt };
}

/** Revokes every live link of the job. Resolves with how many were revoked. */
export async function revokeShareLinks(jobId: string): Promise<number> {
  let res: Response;
  try {
    res = await authedFetch(jobShareUrl(jobId), { method: 'DELETE' });
  } catch {
    throw new ShareError('network');
  }
  const body = await readJson(res);
  if (!res.ok) throw shareErrorFromResponse(res.status, body);
  const n = (body as { revoked?: unknown } | null)?.revoked;
  return typeof n === 'number' ? n : 0;
}

/**
 * Kinds the API can share. Mirrors internal/share Shareable: metadata reports and unknown
 * kinds are refused, and so is any Darkroom (`studio*`) or metadata-inspector tool/mode.
 */
const SHAREABLE_KINDS: ReadonlySet<ResultKind> = new Set<ResultKind>([
  'image', 'gif', 'video', 'audio', 'transcript', 'captions', 'pdf', 'archive', 'hls', 'dash',
]);
const METADATA_LABELS = new Set(['inspect_metadata', 'metadata', 'metadata_inspect', 'metadata_report']);

export function isShareable(kind: ResultKind, ...toolOrMode: Array<string | null | undefined>): boolean {
  if (!SHAREABLE_KINDS.has(kind)) return false;
  for (const raw of toolOrMode) {
    const label = (raw ?? '').trim().toLowerCase();
    if (label.startsWith('studio') || METADATA_LABELS.has(label)) return false;
  }
  return true;
}

/** Coarse analytics bucket for `share_link_copied.job_kind`. */
export function shareJobKind(kind: ResultKind): MediaKind {
  switch (kind) {
    case 'image':
    case 'gif':
      return 'image';
    case 'video':
    case 'hls':
    case 'dash':
      return 'video';
    case 'audio':
      return 'audio';
    case 'pdf':
    case 'transcript':
    case 'captions':
    case 'archive':
      return 'document';
    default:
      return 'unknown';
  }
}
