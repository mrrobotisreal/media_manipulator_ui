/**
 * Context assembly: the standard block that rides along on every event.
 *
 * WHY CONTEXT AND PROPERTIES ARE DIFFERENT THINGS. Everything in here maps to a TYPED
 * COLUMN on the server's `events` table — indexed, groupable, cheap to filter on.
 * Anything put in `properties` instead lands in a jsonb blob that only two partial
 * GIN indexes touch. So `tool_slug`, `tier` and `page_type` belong here, and
 * `duration_ms` belongs in properties. Getting this backwards is the difference
 * between a query that runs in milliseconds and one that scans a partition.
 *
 * The page/device block is computed once per page and cached, because it cannot change
 * without a navigation or a resize — and recomputing `navigator.userAgent` parsing on
 * every event in a 100-event batch would be pure waste.
 */

import { stripLocalePrefix } from '@/i18n/locales';

import { pageTypeFromPathname, type MediaKind, type Tier } from './events';
import type { WireContext } from './queue';

/** Mutable context the app pushes into the SDK: tier, and the current tool. */
export interface ContextPatch {
  tier?: Tier;
  tool_slug?: string | null;
  media_kind?: MediaKind;
  page_type?: string;
}

let overrides: ContextPatch = {};

/** Cached device block, invalidated on resize. */
let deviceCache: Partial<WireContext> | null = null;
let deviceCacheWidth = 0;

/**
 * Merge a patch into the persistent context.
 *
 * `tool_slug: null` explicitly CLEARS the slug — distinct from `undefined`, which
 * leaves it alone. That distinction matters when leaving a tool page: the homepage
 * converter deliberately sets `null` so its events are not attributed to whichever
 * tool the visitor looked at previously.
 */
export function setContext(patch: ContextPatch): void {
  const next: ContextPatch = { ...overrides };
  if ('tier' in patch && patch.tier) next.tier = patch.tier;
  if ('tool_slug' in patch) {
    if (patch.tool_slug === null) {
      delete next.tool_slug;
    } else if (patch.tool_slug !== undefined) {
      next.tool_slug = patch.tool_slug;
    }
  }
  if ('media_kind' in patch) {
    if (patch.media_kind === undefined) {
      delete next.media_kind;
    } else {
      next.media_kind = patch.media_kind;
    }
  }
  if ('page_type' in patch && patch.page_type) next.page_type = patch.page_type;
  overrides = next;
}

export function getContextOverrides(): ContextPatch {
  return { ...overrides };
}

export function resetContext(): void {
  overrides = {};
}

/** Current tier, for callers that need to read it (upgrade CTA attribution). */
export function getTier(): Tier {
  return overrides.tier || 'anonymous';
}

/**
 * Current tool slug, or null when not inside a tool.
 *
 * For the handful of callers that are NOT React components and therefore cannot read
 * `useToolAnalytics()` — specifically `jobTimings.markJobStarted`, which needs the slug so
 * that `peekJobToolSlug` can attribute a job's duration to the right tool later.
 *
 * Reading it off the persistent context rather than taking it as a parameter is what makes
 * it correct: the ToolAnalyticsProvider has already written the slug here, so this can
 * never disagree with the slug the tool's own events carry. Two hooks used to pass a
 * hardcoded `null` instead, which made `peekJobToolSlug` return nothing for the two
 * highest-volume tools on the site.
 */
export function getToolSlug(): string | null {
  return overrides.tool_slug ?? null;
}

/**
 * Coarse device classification from the viewport.
 *
 * Viewport width rather than user-agent sniffing: it is what actually determines the
 * layout the visitor sees, it needs no UA database to stay current, and it does not
 * add to the fingerprinting surface. The trade-off is that a phone in landscape can
 * read as a tablet, which is a rounding error against the question these buckets
 * answer ("is the mobile funnel worse than desktop?").
 */
function deviceTypeFromViewport(width: number): string {
  if (width <= 0) return 'other';
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Browser family and major version from the user agent.
 *
 * Order matters: Edge and Opera both contain "Chrome", and Chrome contains "Safari".
 * Checking specific-before-generic is the whole trick. We keep only the MAJOR version
 * — a minor version is fingerprinting-grade detail we have no use for.
 */
function parseBrowser(ua: string): { browser: string; version: string } {
  const tests: Array<[string, RegExp]> = [
    ['Edge', /Edg\/(\d+)/],
    ['Opera', /OPR\/(\d+)/],
    ['Samsung Internet', /SamsungBrowser\/(\d+)/],
    ['Firefox', /Firefox\/(\d+)/],
    ['Chrome', /Chrome\/(\d+)/],
    ['Safari', /Version\/(\d+).*Safari/],
  ];
  for (const [name, pattern] of tests) {
    const match = ua.match(pattern);
    if (match) return { browser: name, version: match[1] || '' };
  }
  return { browser: 'other', version: '' };
}

function parseOS(ua: string): string {
  if (/Windows NT/.test(ua)) return 'Windows';
  // iPadOS 13+ reports as Macintosh, so the touch check has to come first.
  if (/iPhone|iPod/.test(ua)) return 'iOS';
  if (/iPad/.test(ua)) return 'iPadOS';
  if (/Android/.test(ua)) return 'Android';
  if (/Mac OS X|Macintosh/.test(ua)) {
    if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1) return 'iPadOS';
    return 'macOS';
  }
  if (/CrOS/.test(ua)) return 'ChromeOS';
  if (/Linux/.test(ua)) return 'Linux';
  return 'other';
}

/** Effective connection type from the Network Information API, when available. */
function connectionType(): string | undefined {
  try {
    const connection = (
      navigator as Navigator & { connection?: { effectiveType?: string } }
    ).connection;
    return connection?.effectiveType || undefined;
  } catch {
    return undefined;
  }
}

function deviceBlock(): Partial<WireContext> {
  if (typeof window === 'undefined') return {};
  const width = window.innerWidth || 0;
  if (deviceCache && deviceCacheWidth === width) return deviceCache;

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  const { browser, version } = parseBrowser(ua);

  deviceCache = {
    device_type: deviceTypeFromViewport(width),
    browser,
    browser_version: version,
    os: parseOS(ua),
    viewport_width: width || undefined,
    viewport_height: window.innerHeight || undefined,
    locale: typeof navigator !== 'undefined' ? navigator.language || undefined : undefined,
    timezone: resolvedTimezone(),
    connection_type: connectionType(),
  };
  deviceCacheWidth = width;
  return deviceCache;
}

function resolvedTimezone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}

/** Read UTM parameters from the current URL. */
function currentUTM(): WireContext['utm'] {
  if (typeof window === 'undefined') return undefined;
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: NonNullable<WireContext['utm']> = {};
    const source = params.get('utm_source');
    const medium = params.get('utm_medium');
    const campaign = params.get('utm_campaign');
    const term = params.get('utm_term');
    const content = params.get('utm_content');
    if (source) utm.source = source;
    if (medium) utm.medium = medium;
    if (campaign) utm.campaign = campaign;
    if (term) utm.term = term;
    if (content) utm.content = content;
    return Object.keys(utm).length > 0 ? utm : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Build the batch-level context: everything shared by every event in this flush.
 *
 * Sending it once per batch rather than once per event is a real saving — on a
 * 100-event batch the page/device/UTM block would otherwise be repeated a hundred
 * times, and the server merges per-event context over the batch default field by
 * field.
 *
 * The URL is stripped of its query string and fragment. The query can carry a
 * password-reset token, a presigned URL signature, or an email address, and none of
 * that belongs in an analytics store. UTM parameters are extracted into their own
 * typed fields first, so nothing analytically useful is lost.
 */
export function buildBatchContext(): WireContext {
  if (typeof window === 'undefined') return {};
  // `pathname` is the LOCALE-NEUTRAL logical page (/es/tools/x → /tools/x): every
  // pathname-keyed aggregation downstream — the admin live view's top pathnames,
  // daily_anonymous_counts, session entry/exit — should group a page's traffic
  // across locales, not split it six ways. `url` keeps the exact locale-prefixed
  // address, so per-locale analysis stays possible from the raw rows.
  const rawPathname = window.location.pathname || '';
  const pathname = stripLocalePrefix(rawPathname);
  return {
    url: `${window.location.origin}${rawPathname}`,
    pathname,
    page_type: overrides.page_type || pageTypeFromPathname(pathname),
    referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
    utm: currentUTM(),
    ...deviceBlock(),
    tier: overrides.tier || 'anonymous',
    tool_slug: overrides.tool_slug || undefined,
    media_kind: overrides.media_kind || undefined,
  };
}

/**
 * Build the per-event context DELTA: only what differs from the batch context.
 *
 * Returns undefined when there is nothing to say, which keeps the common event a
 * handful of bytes on the wire.
 */
export function buildEventContext(options?: {
  tool_slug?: string | null;
  media_kind?: MediaKind;
  job_id?: string;
  feature?: string;
  page_type?: string;
}): WireContext | undefined {
  if (!options) return undefined;
  const context: WireContext = {};
  if (options.tool_slug) context.tool_slug = options.tool_slug;
  if (options.media_kind) context.media_kind = options.media_kind;
  if (options.job_id) context.job_id = options.job_id;
  if (options.feature) context.feature = options.feature;
  if (options.page_type) context.page_type = options.page_type;
  return Object.keys(context).length > 0 ? context : undefined;
}

/** Invalidate the device cache. Wired to `resize` by the provider. */
export function invalidateDeviceCache(): void {
  deviceCache = null;
  deviceCacheWidth = -1;
}
