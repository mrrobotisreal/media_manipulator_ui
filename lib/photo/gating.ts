/**
 * Aperture plan gating by ladder position (ticket MM101 decision 2, PRO_TIER.md
 * §2.7). Pure functions over the served `GET /api/tiers` table so the export
 * dialog, the batch picker, the project banners and their tests route the same
 * way. Nothing here is a number: every comparison reads the payload's
 * `photoMaxMegapixels`, `photoBatch` and `photoProjects`.
 *
 *   - `resolvePhotoGate(tier, {kind:'megapixels', megapixels}, tiers)`: a size
 *     above the caller's cap names the LOWEST public tier whose cap covers it
 *     (24 / 64 / 120 MP are first available at Premium, so anonymous AND free
 *     are offered "Upgrade to Premium": signing in alone never unlocks them).
 *   - `resolvePhotoGate(tier, {kind:'batch', count}, tiers)`: a run longer than
 *     the caller's `photoBatch` (or any run at 0) offers the next rung that
 *     RAISES it: anonymous -> sign in free (0 -> 3), free -> Premium (10),
 *     premium -> Pro (25).
 *   - `resolveProjectsGate(tier, used, tiers)`: anonymous always has the
 *     browser-only project (sign in free); a signed-in caller whose saved
 *     projects reach `photoProjects` is offered the next rung that raises it
 *     (free -> Premium 50, premium -> Pro unlimited).
 *
 * A payload without the `photo*` fields (an API before MM95, or a failed fetch)
 * treats everything as allowed: the server is the authority and answers with
 * 403 `photo_batch_limit` / `photo_projects_limit` or clamps the export size.
 * Pro and operator (`isTopTier`) are never offered an upsell. Client gating is
 * ADVISORY.
 */
import { isTier, isTopTier, isUnlimited, tierRank, type Tier, type TierLimits, type TiersResponse } from '@/lib/auth/accountApi';

/** What an upsell offers. `none` = show the lock, offer nothing. */
export type PhotoCta = 'signup' | 'premium' | 'pro' | 'none';

export type PhotoGateReason = 'megapixels' | 'batch' | 'projects';

export type PhotoGateRequest = { kind: 'megapixels'; megapixels: number } | { kind: 'batch'; count: number };

export type PhotoGate =
  | { allowed: true }
  | {
      allowed: false;
      reason: PhotoGateReason;
      /** The tier that lifts the limit (lowest covering / next raising rung); null when none does. */
      requiredTier: Tier | null;
      cta: PhotoCta;
    };

/** The public ladder in order (no operator: /api/tiers never lists it). */
const PUBLIC: readonly Tier[] = ['anonymous', 'free', 'premium', 'pro'];

const rowOf = (tiers: TiersResponse | null | undefined, tier: Tier): TierLimits | undefined => tiers?.tiers.find((t) => t.tier === tier)?.limits;
const servedLadder = (tiers: TiersResponse | null | undefined): Tier[] => PUBLIC.filter((t) => !!rowOf(tiers, t));
const callerOf = (tier: Tier | string | undefined): Tier => (isTier(tier) ? tier : 'anonymous');

/** The CTA that moves a caller up to `target`. */
function ctaFor(caller: Tier, target: Tier): PhotoCta {
  if (isTopTier(caller) || tierRank(target) <= tierRank(caller)) return 'none';
  if (target === 'free') return 'signup';
  return target === 'premium' || target === 'pro' ? target : 'none';
}

/** Does `higher` beat `lower` on a count (0 = none, negative = unlimited, unlimited beats everything)? */
function raises(higher: number | undefined, lower: number): boolean {
  if (higher === undefined) return false;
  if (isUnlimited(lower)) return false;
  if (isUnlimited(higher)) return true;
  return higher > lower;
}

/** The first served rung above `caller` whose `field` raises the caller's. */
function nextRaising(caller: Tier, tiers: TiersResponse, field: 'photoBatch' | 'photoProjects', current: number): Tier | null {
  for (const t of servedLadder(tiers)) {
    if (tierRank(t) <= tierRank(caller)) continue;
    if (raises(rowOf(tiers, t)?.[field], current)) return t;
  }
  return null;
}

const GATED = (reason: PhotoGateReason, requiredTier: Tier | null, caller: Tier): PhotoGate => ({
  allowed: false,
  reason,
  requiredTier,
  cta: requiredTier ? ctaFor(caller, requiredTier) : 'none',
});

/** The gate for an export size or a batch run. */
export function resolvePhotoGate(tier: Tier | string | undefined, request: PhotoGateRequest, tiers: TiersResponse | null | undefined): PhotoGate {
  const caller = callerOf(tier);
  if (caller === 'operator' || !tiers) return { allowed: true };
  const mine = rowOf(tiers, caller);
  if (request.kind === 'megapixels') {
    const cap = mine?.photoMaxMegapixels;
    if (cap === undefined || cap <= 0 || request.megapixels <= cap) return { allowed: true };
    const required = servedLadder(tiers).find((t) => tierRank(t) > tierRank(caller) && (rowOf(tiers, t)?.photoMaxMegapixels ?? 0) >= request.megapixels) ?? null;
    return GATED('megapixels', required, caller);
  }
  const limit = mine?.photoBatch;
  if (limit === undefined) return { allowed: true };
  if (isUnlimited(limit) || (limit > 0 && request.count <= limit)) return { allowed: true };
  return GATED('batch', nextRaising(caller, tiers, 'photoBatch', limit), caller);
}

/**
 * The saved-projects gate. `used` is how many server projects the caller has
 * (undefined = unknown: only the anonymous browser-only banner can be decided).
 */
export function resolveProjectsGate(tier: Tier | string | undefined, used: number | undefined, tiers: TiersResponse | null | undefined): PhotoGate {
  const caller = callerOf(tier);
  if (caller === 'operator' || !tiers) return { allowed: true };
  const limit = rowOf(tiers, caller)?.photoProjects;
  if (limit === undefined || isUnlimited(limit)) return { allowed: true };
  // Anonymous (0): no server projects at all, only the one browser-local project.
  if (limit === 0 || (used !== undefined && used >= limit)) return GATED('projects', nextRaising(caller, tiers, 'photoProjects', limit), caller);
  return { allowed: true };
}

/** The wire value of `photo_export_gated.upgrade_path` for a CTA. */
export const upgradePathProp = (cta: PhotoCta): 'signup' | 'premium' | 'pro' | 'none' => cta;
