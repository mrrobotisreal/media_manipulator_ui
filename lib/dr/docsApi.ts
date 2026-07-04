// Double Raven portal API client. Every request carries the caller's Firebase
// ID token as a Bearer header (the /api/dr/* endpoints are always auth-gated).
// getBaseURL() already includes the `/api` suffix (default
// https://api.media-manipulator.com/api), so drFetch('/dr/docs') composes to
// …/api/dr/docs — do NOT re-add the prefix or hardcode a second origin.
// Responses are zod-parsed so malformed content fails fast instead of rendering
// garbage.

import { getBaseURL } from '@/lib/utils';
import { getCurrentIdToken } from '@/lib/firebase';
import {
  DrDocSchema,
  DrDocsListResponseSchema,
  type DrDoc,
  type DrDocSummary,
} from '@/schemas/drDocs';

/** DrApiError carries the HTTP status so the shared retry policy and the
 *  401→sign-in redirect can branch on it. */
export class DrApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'DrApiError';
  }
}

// Prefer the API's {"error": "..."} body; fall back to the status line.
async function safeErrorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: unknown };
    if (body && typeof body.error === 'string' && body.error.trim()) {
      return body.error;
    }
  } catch {
    // Non-JSON / empty body — fall through to the status text.
  }
  return res.statusText || `Request failed (${res.status})`;
}

async function drFetch(path: string): Promise<unknown> {
  const token = await getCurrentIdToken();
  if (!token) throw new DrApiError(401, 'Not signed in');
  const res = await fetch(`${getBaseURL()}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (!res.ok) throw new DrApiError(res.status, await safeErrorMessage(res));
  return res.json();
}

export const fetchDrDocs = async (): Promise<DrDocSummary[]> =>
  DrDocsListResponseSchema.parse(await drFetch('/dr/docs')).docs;

export const fetchDrDoc = async (slug: string): Promise<DrDoc> =>
  DrDocSchema.parse(await drFetch(`/dr/docs/${encodeURIComponent(slug)}`));

// Shared retry policy for the DR queries: never retry auth/authz/not-found
// (401/403/404 won't improve on retry), otherwise up to two attempts.
export const drQueryRetry = (failureCount: number, error: unknown): boolean =>
  !(error instanceof DrApiError && [401, 403, 404].includes(error.status)) &&
  failureCount < 2;
