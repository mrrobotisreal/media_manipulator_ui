/**
 * Client error capture.
 *
 * TWO THINGS MAKE THIS SAFE TO SHIP:
 *
 *   DEDUPE BY (message + stack) HASH. A React render loop or a broken interval can throw
 *   the same error thousands of times a second. Without dedupe, one bug on one visitor's
 *   machine would fill the ingest pipeline, trip the rate limiter, and evict every other
 *   event from the outbox — a client bug becoming a data outage.
 *
 *   A PER-SESSION CAP of 10 distinct errors. Even distinct errors cascade (one failure
 *   causes five more), so the count is bounded regardless of variety. Ten is enough to
 *   diagnose a broken page; the eleventh tells us nothing the first ten did not.
 *
 * The message is sanitized before sending: the server's sanitizer redacts email-shaped
 * substrings, but an error message can also contain a presigned URL with a signature, so
 * long query strings are stripped here at the source.
 */

import type { AnalyticsClient } from './client';
import { EVENTS, type ClientErrorProps } from './events';

const MAX_ERRORS_PER_SESSION = 10;
/** Message cap. Long enough to identify the error, short enough not to be a blob. */
const MAX_MESSAGE_LEN = 300;

const seen = new Set<string>();
let sent = 0;

/**
 * Non-cryptographic 32-bit string hash (FNV-1a).
 *
 * Deliberately not a real digest: this is a dedupe key, not a security boundary, and
 * `crypto.subtle.digest` is async, which would make the error handler asynchronous for
 * no benefit. Collisions merge two distinct errors, which costs one missed report.
 */
function hashString(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

/**
 * Strip anything that looks like a credential out of an error message.
 *
 * The motivating case is real: an upload failure message frequently contains the
 * presigned S3 URL, whose query string holds `X-Amz-Signature` and `X-Amz-Credential`.
 * Those are short-lived but they are still credentials, and they have no place in an
 * analytics store. Query strings are dropped wholesale rather than filtered by key,
 * because an allowlist would need updating every time a URL shape changed.
 */
export function sanitizeErrorMessage(message: string): string {
  let out = message.replace(/(https?:\/\/[^\s?]+)\?[^\s]*/g, '$1?[stripped]');
  // Bearer tokens and JWTs in a message body.
  out = out.replace(/Bearer\s+[A-Za-z0-9._~+/-]+=*/gi, 'Bearer [stripped]');
  out = out.replace(/eyJ[A-Za-z0-9._-]{20,}/g, '[jwt]');
  if (out.length > MAX_MESSAGE_LEN) out = out.slice(0, MAX_MESSAGE_LEN);
  return out;
}

function describeError(value: unknown): { message: string; type: string; stack: string } {
  if (value instanceof Error) {
    return {
      message: value.message || value.name || 'Error',
      type: value.name || 'Error',
      stack: value.stack || '',
    };
  }
  if (typeof value === 'string') return { message: value, type: 'string', stack: '' };
  try {
    return { message: JSON.stringify(value) || 'unknown', type: typeof value, stack: '' };
  } catch {
    return { message: 'unserializable error', type: typeof value, stack: '' };
  }
}

/**
 * Report an error. The single entry point — global handlers, React error boundaries, and
 * manual `catch` blocks all funnel through here so the dedupe and the cap are global.
 */
export function reportError(
  client: AnalyticsClient,
  error: unknown,
  context?: { source?: ClientErrorProps['source']; stage?: string; toolSlug?: string | null },
): void {
  try {
    if (sent >= MAX_ERRORS_PER_SESSION) return;

    const described = describeError(error);
    const message = sanitizeErrorMessage(described.message);
    // The first three stack frames are enough to distinguish two errors with the same
    // message; the whole stack would make near-identical errors look distinct because of
    // a differing line number deep in a vendor chunk.
    const stackKey = described.stack.split('\n').slice(0, 3).join('|');
    const hash = hashString(`${message}|${stackKey}|${context?.stage || ''}`);
    if (seen.has(hash)) return;
    seen.add(hash);
    sent += 1;

    client.track(
      EVENTS.CLIENT_ERROR,
      {
        message,
        stack_hash: hash,
        source: context?.source || 'manual',
        stage: context?.stage,
        error_type: described.type,
      },
      { tool_slug: context?.toolSlug ?? undefined },
    );
  } catch {
    // An error in the error reporter must be the end of the line.
  }
}

/**
 * Attach global handlers. Returns a detach function.
 *
 * `window.onerror` catches synchronous throws that escaped every boundary;
 * `unhandledrejection` catches the promise rejections that a `.catch()` was forgotten on
 * — which, on a site that is mostly file uploads, is where the interesting failures are.
 */
export function initGlobalErrorHandlers(client: AnalyticsClient): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const onError = (event: ErrorEvent) => {
    reportError(client, event.error || event.message, { source: 'window' });
  };
  const onRejection = (event: PromiseRejectionEvent) => {
    reportError(client, event.reason, { source: 'promise' });
  };

  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);

  return () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);
  };
}

/** For tests, and for the preferences centre's "clear diagnostics" path. */
export function resetErrorTrackingForTests(): void {
  seen.clear();
  sent = 0;
}
