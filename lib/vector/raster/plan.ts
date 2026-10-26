/**
 * The caller's Motion plan for the raster options (ticket MM47 decision 6).
 *
 *   - `GET /api/tiers` (public, cacheable): the tier matrix. It says whether
 *     ANY public tier offers a format, which decides between "your plan does
 *     not include this" (with a link to plans) and "not available on any plan
 *     yet" (MP4, WebM and PNG sequence until MM49 adds them to a tier).
 *   - `GET /api/account/usage` (optional auth + session id): the caller's own
 *     tier and its limits row, `registry.For(tier)`, the same struct
 *     `/api/tiers` lists, including the operator tier `/api/tiers` omits.
 *
 * Both are reads and never count. Any failure yields null: nothing is locked
 * or clamped client-side and the server decides (`POST /api/vector/exports`).
 */
import { fetchTiers, type TierLimits, type TiersResponse } from '@/lib/auth/accountApi';
import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL } from '@/lib/utils';

import { capsFromLimits, type RasterCaps } from './caps';

export interface RasterPlan {
  tier: string;
  caps: RasterCaps | null;
  /** Formats at least one public tier offers (null = unknown). */
  publicFormats: ReadonlySet<string> | null;
  /** MM49: the served /api/tiers table, for ladder-aware locks (lib/vector/gating.ts). */
  tiers?: TiersResponse | null;
}

export function planFrom(tiers: TiersResponse | null, me: { tier?: string; limits?: TierLimits } | null): RasterPlan | null {
  if (!me?.limits) return null;
  const publicFormats = tiers ? new Set(tiers.tiers.flatMap((t) => t.limits.vectorFormats ?? [])) : null;
  return { tier: me.tier ?? '', caps: capsFromLimits(me.limits), publicFormats, tiers };
}

export async function loadRasterPlan(signal?: AbortSignal): Promise<RasterPlan | null> {
  try {
    const [tiers, me] = await Promise.all([
      fetchTiers(signal).catch(() => null),
      authedFetch(`${getBaseURL()}/account/usage`, { signal }).then((r) => (r.ok ? (r.json() as Promise<{ tier?: string; limits?: TierLimits }>) : null)),
    ]);
    return planFrom(tiers, me);
  } catch {
    return null;
  }
}
