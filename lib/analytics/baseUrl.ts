/**
 * The analytics service's base URL, resolved once and in one place.
 *
 * WHY THIS FILE EXISTS. Four modules had their own private copy of this three-line
 * function: `lib/analytics/client.ts`, `lib/analytics/consent-bridge.ts`,
 * `lib/consent/regions.ts` and `lib/consent/audit.ts`. Four copies of an env-var default is
 * exactly the kind of duplication that is harmless until it isn't: a fifth caller written
 * from memory forgets the trailing-slash strip and produces `https://host//v1/capture`, or
 * someone changes the fallback host in one place and the consent-region lookup keeps
 * pointing at the old one — which would fail open to "unknown region", which means
 * opt-in-required, which means silently capturing nothing.
 *
 * THE TRAILING SLASH STRIP IS LOAD-BEARING. Every caller concatenates a path beginning with
 * `/v1/...`. A base URL ending in `/` (which a `.env` file will absolutely contain sooner or
 * later, because a URL with a trailing slash looks more correct, not less) produces a double
 * slash. nginx and Cloudflare both treat `//v1/capture` as a distinct path from
 * `/v1/capture`, so the request 404s rather than failing loudly at the point of the mistake.
 *
 * `process.env.NEXT_PUBLIC_*` is inlined at build time, so this is a constant fold in the
 * bundle rather than a runtime lookup — there is no cost to calling it per request.
 */

/** The default is the production host, so a missing env var degrades to correct behaviour
 *  in production and an obvious wrong-host error in local development. */
const DEFAULT_ANALYTICS_BASE_URL = 'https://analytics.media-manipulator.com';

export function analyticsBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_ANALYTICS_BASE_URL || DEFAULT_ANALYTICS_BASE_URL).replace(
    /\/$/,
    '',
  );
}

/**
 * The public browser write key.
 *
 * Public by necessity, not by accident: it ships in the bundle, it identifies and
 * rate-buckets the site rather than authorizing anything privileged, and it is rotatable.
 * The SECRET counterpart is `ANALYTICS_SERVER_KEY`, which only the Go API holds and which
 * authorizes `source='server'` events.
 *
 * Empty means capture will 401. That is the correct failure — the analytics service fails
 * CLOSED on write keys, and a missing key should be visibly broken rather than quietly
 * dropping events.
 */
export function analyticsWriteKey(): string {
  return process.env.NEXT_PUBLIC_ANALYTICS_WRITE_KEY || '';
}
