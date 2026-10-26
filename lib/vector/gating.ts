/**
 * Motion plan gating by ladder position (ticket MM49 decision 2, PRO_TIER.md
 * §2.7). Pure functions over the served `GET /api/tiers` table, so the export
 * dialog, its tests and any future surface route the same way:
 *
 *   - `resolveFormatGate(tier, format, tiers)` → `{allowed}` when the caller's
 *     tier has the format, else `{locked, requiredTier, cta}` where
 *     `requiredTier` is the LOWEST public tier whose `vectorFormats` lists it
 *     and `cta` is what to offer: `signup` (a free account unlocks it),
 *     `premium`, `pro`, or `none` (no public tier has it, or the caller is
 *     already at the top).
 *   - `resolveLimitCta(tier, refusal, tiers)` → the upsell for a server
 *     refusal: the daily limit (429) offers the next rung that raises
 *     `vectorExportsPerDay`; a cap (422) offers Pro only when Pro's
 *     `vectorVideo` / `vectorMaxDurationMs` actually raises that axis; a
 *     format lock (403) follows `resolveFormatGate`.
 *
 * Nothing here is a number: every comparison reads the payload. A deployment
 * whose `/api/tiers` has no `pro` row (pre-MM39) degrades to "Premium is the
 * top for Motion": a Pro-only format becomes `none`, a Premium limit hit
 * offers nothing, and nothing throws. `isTopTier` callers (pro, operator) are
 * never offered an upsell. Client gating is ADVISORY: the server's
 * `CheckExport` (POST /api/vector/exports) decides.
 */
import { isTier, isTopTier, isUnlimited, tierRank, type Tier, type TierLimits, type TiersResponse } from '@/lib/auth/accountApi';
import type { VectorExportFormat } from '@/lib/vector/exportsApi';

/** What an upsell offers. `none` = show the lock, offer nothing. */
export type GateCta = 'signup' | 'premium' | 'pro' | 'none';

export type FormatGate =
  | { allowed: true }
  | {
      allowed: false;
      /** Lowest public tier with the format; null when no public tier has it. */
      requiredTier: Tier | null;
      cta: GateCta;
    };

/** The public ladder in order (no operator: /api/tiers never lists it). */
const PUBLIC: readonly Tier[] = ['anonymous', 'free', 'premium', 'pro'];

function rowOf(tiers: TiersResponse | null | undefined, tier: Tier): TierLimits | undefined {
  return tiers?.tiers.find((t) => t.tier === tier)?.limits;
}

/** The served public tiers, in ladder order. */
function servedLadder(tiers: TiersResponse | null | undefined): Tier[] {
  return PUBLIC.filter((t) => !!rowOf(tiers, t));
}

/** The CTA that moves a caller up to `target`. */
function ctaFor(caller: Tier, target: Tier): GateCta {
  if (isTopTier(caller) || tierRank(target) <= tierRank(caller)) return 'none';
  if (target === 'free') return 'signup';
  if (target === 'premium' || target === 'pro') return target;
  return 'none';
}

/**
 * Does `tier` include `format`? Operator has every format; otherwise the
 * served row decides. Unknown (no payload, or the tier is not served) is
 * treated as allowed: the server decides and the dialog shows its refusal.
 */
function tierHas(tiers: TiersResponse | null | undefined, tier: Tier, format: VectorExportFormat): boolean | null {
  if (tier === 'operator') return true;
  const row = rowOf(tiers, tier);
  if (!row?.vectorFormats) return null;
  return row.vectorFormats.includes(format);
}

/**
 * The gate for one counted export format (the SERVER format name, e.g.
 * `js_ts` for both JS and TS) for a caller of `tier`.
 */
export function resolveFormatGate(tier: Tier | string | undefined, format: VectorExportFormat, tiers: TiersResponse | null | undefined): FormatGate {
  const caller: Tier = isTier(tier) ? tier : 'anonymous';
  const has = tierHas(tiers, caller, format);
  if (has !== false) return { allowed: true };
  const required = servedLadder(tiers).find((t) => tierRank(t) > tierRank(caller) && rowOf(tiers, t)?.vectorFormats?.includes(format)) ?? null;
  return { allowed: false, requiredTier: required, cta: required ? ctaFor(caller, required) : 'none' };
}

/** A server refusal, as `countVectorExport` returns it (only the fields used here). */
export type GateRefusal =
  | { kind: 'locked'; format: string }
  | { kind: 'limit' }
  | { kind: 'cap'; cap: string; max: number }
  | { kind: 'unavailable' };

/** Whether `higher` beats `lower` on a cap (0 = no cap, -1 = unlimited, both beat any cap). */
function raisesCap(higher: number | undefined, lower: number | undefined): boolean {
  if (higher === undefined || lower === undefined) return false;
  const free = (v: number) => v === 0 || isUnlimited(v);
  if (free(lower)) return false;
  if (free(higher)) return true;
  return higher > lower;
}

function capValue(row: TierLimits | undefined, cap: string): number | undefined {
  const v = row?.vectorVideo;
  switch (cap) {
    case 'height':
      return v?.maxHeight;
    case 'fps':
      return v?.maxFps;
    case 'duration': {
      // The effective duration cap is the tighter of the two axes (0 = none).
      const a = row?.vectorMaxDurationMs ?? 0;
      const b = v && v.maxSeconds > 0 ? v.maxSeconds * 1000 : 0;
      if (a === 0) return b;
      if (b === 0) return a;
      return Math.min(a, b);
    }
  }
  return undefined;
}

/** The first served rung above `caller` that raises the limit, by `raise(next, current)`. */
function nextRaising(caller: Tier, tiers: TiersResponse | null | undefined, raise: (next: TierLimits, current: TierLimits | undefined) => boolean): Tier | null {
  const current = rowOf(tiers, caller);
  for (const t of servedLadder(tiers)) {
    if (tierRank(t) <= tierRank(caller)) continue;
    const row = rowOf(tiers, t);
    if (row && raise(row, current)) return t;
  }
  return null;
}

/**
 * The upsell for a server refusal (MM49 decision 2):
 *   - 429 daily limit: the next rung that raises `vectorExportsPerDay`
 *     (anonymous → signup, free → premium, premium → pro; Pro/operator none).
 *   - 422 cap (duration / height / fps): Pro only if Pro raises that axis over
 *     the caller's row; a lower tier is still offered the next rung that
 *     raises it (signup cannot raise a raster cap, so it is skipped).
 *   - 403 lock: `resolveFormatGate`.
 *   - anything else: none.
 */
export function resolveLimitCta(tier: Tier | string | undefined, refusal: GateRefusal, tiers: TiersResponse | null | undefined): GateCta {
  const caller: Tier = isTier(tier) ? tier : 'anonymous';
  if (isTopTier(caller)) return 'none';
  switch (refusal.kind) {
    case 'locked': {
      const gate = resolveFormatGate(caller, refusal.format as VectorExportFormat, tiers);
      return gate.allowed ? 'none' : gate.cta;
    }
    case 'limit': {
      const next = nextRaising(caller, tiers, (row, cur) => {
        const a = row.vectorExportsPerDay;
        const b = cur?.vectorExportsPerDay;
        if (a === undefined) return false;
        if (b === undefined) return true;
        if (isUnlimited(b)) return false;
        return isUnlimited(a) || a > b;
      });
      return next ? ctaFor(caller, next) : 'none';
    }
    case 'cap': {
      const next = nextRaising(caller, tiers, (row, cur) => raisesCap(capValue(row, refusal.cap), capValue(cur, refusal.cap)));
      return next ? ctaFor(caller, next) : 'none';
    }
    default:
      return 'none';
  }
}

/** `vector_export_gated.upgrade_path` for a CTA (the wire vocabulary). */
export function upgradePathProp(cta: GateCta): 'signup' | 'premium' | 'pro' | 'none' {
  return cta;
}
