// Which plan to offer whom (MM40, design PRO_TIER.md §2.7, ADR-0011).
//
// Pure functions over the tier ladder and the served /api/tiers table, so every upsell
// surface routes the same way and the routing is unit-testable without React:
//   anonymous -> a free account
//   free      -> Premium (Pro is a second option only on /pricing)
//   premium   -> Pro, but ONLY for a limit Pro actually raises (daily operations, AI jobs,
//                exports, Motion exports); nothing for file size, video length, resolution,
//                ladder height or projects, which Pro does not change
//   pro / operator -> nothing

import { isUnlimited, type PaidPlan, type Tier, type TierLimits, type TiersResponse } from '@/lib/auth/accountApi';

/**
 * Every limit key an upsell surface can name (the interstitial's `limitKey`, the quota chip's
 * metric), mapped to the /api/tiers field that holds its number.
 */
export const LIMIT_FIELDS = {
  quota_ops: 'opsPerDay',
  quota_ai_ops: 'aiOpsPerDay',
  quota_export: 'exportsPerDay',
  quota_vector_export: 'vectorExportsPerDay',
  file_too_large: 'maxFileBytes',
  video_too_long: 'maxVideoSeconds',
  output_height_limited: 'maxOutputHeight',
  ladder_height_limited: 'maxLadderHeight',
  project_limit_reached: 'studioProjects',
} as const satisfies Record<string, keyof TierLimits>;

export type LimitKey = keyof typeof LIMIT_FIELDS;

/**
 * The limits Pro is designed to raise (design §2.3: ops 700, AI ops 120, exports = ops, the
 * top Motion allowance). Everything else equals Premium, so a Premium caller who hits it is
 * told nothing rather than sold a plan that would not help.
 */
const PRO_RAISES: ReadonlySet<LimitKey> = new Set<LimitKey>([
  'quota_ops',
  'quota_ai_ops',
  'quota_export',
  'quota_vector_export',
]);

function limitValue(limits: TierLimits | undefined, key: LimitKey): number | undefined {
  const value = limits?.[LIMIT_FIELDS[key]];
  return typeof value === 'number' ? value : undefined;
}

/** Whether `higher` beats `lower` for a numeric limit (-1 = unlimited beats any cap). */
function raises(higher: number | undefined, lower: number | undefined): boolean {
  if (higher === undefined || lower === undefined) return false;
  if (isUnlimited(lower)) return false;
  if (isUnlimited(higher)) return true;
  return higher > lower;
}

/**
 * Whether moving from Premium to Pro raises this limit. A key outside the design's set is
 * always false. With the served table, the served numbers must agree too: today Pro's Motion
 * allowance equals Premium's (MM49 raises it), and a surface must not promise a raise the
 * server does not grant. Without a table (still loading) the design's set answers.
 */
export function limitRaisedByPro(limitKey: string, tiers?: TiersResponse | null): boolean {
  if (!(limitKey in LIMIT_FIELDS)) return false;
  const key = limitKey as LimitKey;
  if (!PRO_RAISES.has(key)) return false;
  if (!tiers) return true;
  const premium = tiers.tiers.find((x) => x.tier === 'premium')?.limits;
  const pro = tiers.tiers.find((x) => x.tier === 'pro')?.limits;
  if (!pro) return false;
  return raises(limitValue(pro, key), limitValue(premium, key));
}

/** What an upsell surface offers for a limit hit: sign up, a plan, or nothing. */
export type UpsellTarget = 'signup' | PaidPlan | undefined;

export function upsellTargetFor(
  tier: Tier | undefined,
  limitKey: string,
  tiers?: TiersResponse | null,
): UpsellTarget {
  switch (tier) {
    case 'anonymous':
      return 'signup';
    case 'free':
      return 'premium';
    case 'premium':
      return limitRaisedByPro(limitKey, tiers) ? 'pro' : undefined;
    default:
      // pro, operator, or not yet known: nothing to sell.
      return undefined;
  }
}

/** The plan a signed-in tier holds, for plan chips and copy; null when it is not a paid plan. */
export function paidPlanOf(tier: Tier | undefined): PaidPlan | null {
  return tier === 'premium' || tier === 'pro' ? tier : null;
}
