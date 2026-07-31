// The one place the app attaches caller identity to an API request.
//
// Before this existed the same four lines — read the Firebase ID token, add an
// Authorization header if there is one, add X-MM-Session-ID — were copied into
// eight hooks, and omitted from the rest. Omitting them is what made a
// signed-in person get counted against their session instead of their account.
//
// Two rules this file exists to keep:
//   1. The anonymous path keeps working exactly as it did. X-MM-Session-ID is
//      always sent; the Authorization header is added only when a token exists.
//   2. Every response's quota headers are published, so the nav meter updates
//      from the request the visitor just made rather than from a poll.

import { getCurrentIdToken } from '@/lib/firebase';
import { getSessionId } from '@/lib/analytics';
import { isQuotaExceeded, readQuotaHeaders, type QuotaExceeded } from './accountApi';
import { publishQuotaExceeded, publishQuotaState } from './quotaBus';

/**
 * Thrown for a 429 from the quota middleware, carrying the server's structured
 * body so the caller can raise the right upgrade prompt instead of a toast that
 * says "Too Many Requests".
 */
export class QuotaExceededError extends Error {
  readonly detail: QuotaExceeded;

  constructor(detail: QuotaExceeded) {
    super(
      detail.upgradePath === 'signup'
        ? `You've used your ${detail.limit} free conversions for today.`
        : `You've hit your daily limit of ${detail.limit}.`,
    );
    this.name = 'QuotaExceededError';
    this.detail = detail;
  }
}

export interface AuthedFetchOptions extends RequestInit {
  /**
   * Skip the Firebase token lookup. For requests on a hot path that are known
   * not to be identity-sensitive; the session header is still sent.
   */
  anonymous?: boolean;
}

/**
 * Builds the identity headers for an API request.
 *
 * Exported for the handful of call sites that cannot use authedFetch itself —
 * XMLHttpRequest uploads that need progress events, and multipart bodies whose
 * Content-Type the browser must set.
 */
export async function authHeaders(
  options: { anonymous?: boolean } = {},
): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'X-MM-Session-ID': getSessionId() };
  if (options.anonymous) return headers;
  // getCurrentIdToken already swallows its own errors and returns null when
  // Firebase is unconfigured, so this never needs a try/catch of its own.
  const idToken = await getCurrentIdToken();
  if (idToken) headers.Authorization = `Bearer ${idToken}`;
  return headers;
}

/**
 * fetch() with caller identity attached and quota state harvested.
 *
 * Does NOT throw on ordinary non-2xx responses — callers keep their existing
 * error handling. The single exception is 429 `quota_exceeded`, which becomes a
 * QuotaExceededError so no call site can accidentally render it as a generic
 * failure and lose the upgrade moment.
 */
export async function authedFetch(
  input: string,
  init: AuthedFetchOptions = {},
): Promise<Response> {
  const { anonymous, headers: callerHeaders, ...rest } = init;
  const merged = new Headers(callerHeaders);
  const identity = await authHeaders({ anonymous });
  for (const [key, value] of Object.entries(identity)) {
    // A caller that set its own value wins — the Studio backend supplies a
    // scoped token of its own, for instance.
    if (!merged.has(key)) merged.set(key, value);
  }

  const response = await fetch(input, { ...rest, headers: merged });
  publishQuotaState(readQuotaHeaders(response));

  if (response.status === 429) {
    // Clone so the caller can still read the body if it wants to.
    const body = await response
      .clone()
      .json()
      .catch(() => null);
    if (isQuotaExceeded(body)) {
      // Announce before throwing, so the account panel opens even if the
      // calling hook swallows the error or renders only a toast.
      publishQuotaExceeded(body);
      throw new QuotaExceededError(body);
    }
  }

  return response;
}

/** Records quota headers from a response fetched without authedFetch. */
export function observeQuotaHeaders(response: Response): void {
  publishQuotaState(readQuotaHeaders(response));
}
