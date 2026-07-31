/**
 * Region resolution.
 *
 * Which privacy regime applies is a server-side question — it depends on the IP that
 * actually terminated the connection, which the browser cannot see. So the client asks
 * `GET /v1/consent/region`, which answers from Cloudflare's CF-IPCountry header (free,
 * authoritative at the edge) with a MaxMind fallback.
 *
 * CACHED IN sessionStorage, not localStorage. A visitor's region can genuinely change
 * between visits — travel, a VPN toggle — and caching it for weeks would show the
 * wrong prompt to someone who moved. Per-tab-session is the right granularity, and it
 * still removes the request from every navigation within a visit.
 *
 * FAILURE IS `unknown`, WHICH THE CALLER TREATS AS gdpr. That asymmetry is the whole
 * point: if we cannot tell where someone is, we ask for consent. A failed fetch, an
 * offline first load, a blocked request — all of them land on the conservative side
 * without any special-casing.
 */

import type { RegionGroup } from './state';
import { analyticsBaseUrl } from '@/lib/analytics/baseUrl';

const REGION_CACHE_KEY = 'mm.a.region';

/** The endpoint answers in a few milliseconds from a header. Anything slower than
 *  this is a network problem, and waiting longer just delays the banner. */
const REGION_FETCH_TIMEOUT_MS = 3_000;

export interface RegionResult {
  regionGroup: RegionGroup;
  countryCode: string;
}

interface CachedRegion extends RegionResult {
  at: number;
}

let inFlight: Promise<RegionResult> | null = null;

function isRegionGroup(value: unknown): value is RegionGroup {
  return value === 'gdpr' || value === 'us' || value === 'other' || value === 'unknown';
}

function readCache(): RegionResult | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(REGION_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedRegion>;
    if (!isRegionGroup(parsed.regionGroup)) return null;
    return {
      regionGroup: parsed.regionGroup,
      countryCode: typeof parsed.countryCode === 'string' ? parsed.countryCode : '',
    };
  } catch {
    return null;
  }
}

function writeCache(result: RegionResult): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: CachedRegion = { ...result, at: Date.now() };
    window.sessionStorage.setItem(REGION_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Blocked storage just means one request per navigation. Not worth handling.
  }
}

/**
 * Resolve the region. Cached per tab session; concurrent callers share one request.
 *
 * Never rejects — the failure value is `unknown`, and the caller's conservative
 * handling of `unknown` is what makes that safe.
 */
export async function resolveRegion(): Promise<RegionResult> {
  if (typeof window === 'undefined') {
    return { regionGroup: 'unknown', countryCode: '' };
  }

  const cached = readCache();
  if (cached) return cached;
  if (inFlight) return inFlight;

  inFlight = (async (): Promise<RegionResult> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REGION_FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(`${analyticsBaseUrl()}/v1/consent/region`, {
        method: 'GET',
        credentials: 'omit',
        signal: controller.signal,
      });
      if (!response.ok) return { regionGroup: 'unknown', countryCode: '' };
      const data = (await response.json()) as { region_group?: unknown; country_code?: unknown };
      const regionGroup = isRegionGroup(data.region_group) ? data.region_group : 'unknown';
      const countryCode = typeof data.country_code === 'string' ? data.country_code : '';
      const result: RegionResult = { regionGroup, countryCode };
      // Only cache a real answer. Caching `unknown` would pin a transient network
      // failure for the rest of the visit and keep showing the strictest prompt to
      // someone we could have identified on a retry.
      if (regionGroup !== 'unknown') writeCache(result);
      return result;
    } catch {
      return { regionGroup: 'unknown', countryCode: '' };
    } finally {
      clearTimeout(timer);
      inFlight = null;
    }
  })();

  return inFlight;
}

/** Whether a region requires opt-in before analytics. `unknown` counts as yes. */
export function requiresOptIn(region: RegionGroup): boolean {
  return region !== 'us';
}

/** For tests. */
export function resetRegionCacheForTests(): void {
  inFlight = null;
  try {
    window.sessionStorage.removeItem(REGION_CACHE_KEY);
  } catch {
    // ignore
  }
}
