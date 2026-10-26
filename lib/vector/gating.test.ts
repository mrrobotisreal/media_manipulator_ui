import { describe, expect, it } from 'vitest';

import { isTopTier, type Tier, type TierLimits, type TiersResponse } from '@/lib/auth/accountApi';
import type { VectorExportFormat } from './exportsApi';
import { resolveFormatGate, resolveLimitCta, type GateCta } from './gating';

// MM49 decision 2. The fixture mirrors the API's /api/tiers defaults after
// MM49 (internal/tiers: anonymous 2 / free 5 / premium 30 / pro 150, formats
// cumulative, Pro adds png_sequence, mp4, webm and video 2160/60/60). The
// module never reads these numbers from anywhere but the payload.

const ANON = ['svg_animated'];
const FREE = [...ANON, 'lottie', 'import_lottie', 'import_svg_vectorize'];
const PREMIUM = [...FREE, 'react_tsx', 'js_ts', 'flutter', 'gif'];
const PRO = [...PREMIUM, 'png_sequence', 'mp4', 'webm'];

const row = (formats: string[], perDay: number, video: TierLimits['vectorVideo'], maxDurationMs = 0) =>
  ({ vectorFormats: formats, vectorExportsPerDay: perDay, vectorVideo: video, vectorMaxDurationMs: maxDurationMs }) as TierLimits;
const none = { maxHeight: 0, maxFps: 0, maxSeconds: 0 };

const TIERS: TiersResponse = {
  premiumPurchasable: true,
  premiumPriceUSD: 8,
  proPurchasable: true,
  tiers: [
    { tier: 'anonymous', limits: row(ANON, 2, none, 10000) },
    { tier: 'free', limits: row(FREE, 5, none) },
    { tier: 'premium', limits: row(PREMIUM, 30, { maxHeight: 720, maxFps: 0, maxSeconds: 15 }) },
    { tier: 'pro', limits: row(PRO, 150, { maxHeight: 2160, maxFps: 60, maxSeconds: 60 }) },
  ],
};
/** A pre-MM39 deployment: no pro row, and nobody has the video formats. */
const NO_PRO: TiersResponse = { ...TIERS, tiers: TIERS.tiers.filter((t) => t.tier !== 'pro') };

const TIER_LIST: Tier[] = ['anonymous', 'free', 'premium', 'pro', 'operator'];
const FORMATS: VectorExportFormat[] = ['svg_animated', 'lottie', 'react_tsx', 'js_ts', 'flutter', 'gif', 'png_sequence', 'mp4', 'webm'];

// "A" = allowed; otherwise "<requiredTier>/<cta>".
const WANT: Partial<Record<VectorExportFormat, Partial<Record<Tier, string>>>> = {
  svg_animated: { anonymous: 'A', free: 'A', premium: 'A', pro: 'A', operator: 'A' },
  lottie: { anonymous: 'free/signup', free: 'A', premium: 'A', pro: 'A', operator: 'A' },
  react_tsx: { anonymous: 'premium/premium', free: 'premium/premium', premium: 'A', pro: 'A', operator: 'A' },
  js_ts: { anonymous: 'premium/premium', free: 'premium/premium', premium: 'A', pro: 'A', operator: 'A' },
  flutter: { anonymous: 'premium/premium', free: 'premium/premium', premium: 'A', pro: 'A', operator: 'A' },
  gif: { anonymous: 'premium/premium', free: 'premium/premium', premium: 'A', pro: 'A', operator: 'A' },
  png_sequence: { anonymous: 'pro/pro', free: 'pro/pro', premium: 'pro/pro', pro: 'A', operator: 'A' },
  mp4: { anonymous: 'pro/pro', free: 'pro/pro', premium: 'pro/pro', pro: 'A', operator: 'A' },
  webm: { anonymous: 'pro/pro', free: 'pro/pro', premium: 'pro/pro', pro: 'A', operator: 'A' },
  import_lottie: {},
};

const label = (g: ReturnType<typeof resolveFormatGate>) => (g.allowed ? 'A' : `${g.requiredTier}/${g.cta}`);

describe('resolveFormatGate table (5 tiers × 9 counted formats)', () => {
  const cells = FORMATS.flatMap((f) => TIER_LIST.map((t) => [f, t, WANT[f]![t]!] as const));
  it.each(cells)('%s × %s → %s', (format, tier, want) => {
    expect(label(resolveFormatGate(tier, format, TIERS))).toBe(want);
  });

  it('isTopTier users never see an upsell', () => {
    for (const tier of TIER_LIST.filter(isTopTier)) {
      for (const f of FORMATS) {
        const g = resolveFormatGate(tier, f, TIERS);
        expect(g.allowed || g.cta === 'none').toBe(true);
      }
      expect(resolveLimitCta(tier, { kind: 'limit' }, TIERS)).toBe('none');
      expect(resolveLimitCta(tier, { kind: 'cap', cap: 'duration', max: 1 }, TIERS)).toBe('none');
    }
  });
});

describe('resolveFormatGate fallbacks', () => {
  it('without a pro row (pre-MM39) Premium is the top: video formats are locked with no upsell, nothing throws', () => {
    for (const tier of TIER_LIST) {
      for (const f of ['png_sequence', 'mp4', 'webm'] as const) {
        const g = resolveFormatGate(tier, f, NO_PRO);
        // operator has every format; a pro caller has no served row to read, so the server decides.
        expect(g).toEqual(tier === 'operator' || tier === 'pro' ? { allowed: true } : { allowed: false, requiredTier: null, cta: 'none' });
      }
      expect(label(resolveFormatGate(tier, 'gif', NO_PRO))).toBe(WANT.gif![tier]);
    }
  });

  it('no payload at all: everything is allowed (the server decides)', () => {
    for (const tier of TIER_LIST) for (const f of FORMATS) expect(resolveFormatGate(tier, f, null)).toEqual({ allowed: true });
  });

  it('an unknown tier string is treated as anonymous', () => {
    expect(label(resolveFormatGate('enterprise', 'lottie', TIERS))).toBe('free/signup');
    expect(label(resolveFormatGate(undefined, 'mp4', TIERS))).toBe('pro/pro');
  });

  it('reads the payload, not literals: moving gif to Pro moves its CTA', () => {
    const moved: TiersResponse = {
      ...TIERS,
      tiers: TIERS.tiers.map((t) =>
        t.tier === 'premium' ? { ...t, limits: { ...t.limits, vectorFormats: PREMIUM.filter((f) => f !== 'gif') } } : t,
      ),
    };
    expect(label(resolveFormatGate('free', 'gif', moved))).toBe('pro/pro');
    expect(label(resolveFormatGate('premium', 'gif', moved))).toBe('pro/pro');
  });
});

describe('resolveLimitCta', () => {
  const limit = { kind: 'limit' } as const;
  it.each<[Tier, GateCta, GateCta]>([
    // tier, with pro row, without pro row
    ['anonymous', 'signup', 'signup'],
    ['free', 'premium', 'premium'],
    ['premium', 'pro', 'none'],
    ['pro', 'none', 'none'],
    ['operator', 'none', 'none'],
  ])('429 for %s → %s (no pro row: %s)', (tier, withPro, withoutPro) => {
    expect(resolveLimitCta(tier, limit, TIERS)).toBe(withPro);
    expect(resolveLimitCta(tier, limit, NO_PRO)).toBe(withoutPro);
  });

  it('429 for premium offers nothing when Pro does not raise the allowance', () => {
    const flat: TiersResponse = {
      ...TIERS,
      tiers: TIERS.tiers.map((t) => (t.tier === 'pro' ? { ...t, limits: { ...t.limits, vectorExportsPerDay: 30 } } : t)),
    };
    expect(resolveLimitCta('premium', limit, flat)).toBe('none');
  });

  it.each<[Tier, string, GateCta]>([
    ['premium', 'duration', 'pro'],
    ['premium', 'height', 'pro'],
    ['premium', 'fps', 'none'], // Premium has no fps cap (0), so Pro cannot raise it
    ['anonymous', 'duration', 'signup'], // the 10 s cap: free has none
    ['free', 'height', 'none'], // free has no raster cap (no raster format)
    ['pro', 'duration', 'none'],
  ])('422 %s %s → %s', (tier, cap, want) => {
    expect(resolveLimitCta(tier, { kind: 'cap', cap, max: 1 }, TIERS)).toBe(want);
  });

  it('a cap Pro does not raise offers no upsell (PRO_TIER §2.7)', () => {
    const sameHeight: TiersResponse = {
      ...TIERS,
      tiers: TIERS.tiers.map((t) => (t.tier === 'pro' ? { ...t, limits: { ...t.limits, vectorVideo: { maxHeight: 720, maxFps: 60, maxSeconds: 60 } } } : t)),
    };
    expect(resolveLimitCta('premium', { kind: 'cap', cap: 'height', max: 720 }, sameHeight)).toBe('none');
    expect(resolveLimitCta('premium', { kind: 'cap', cap: 'duration', max: 15000 }, NO_PRO)).toBe('none');
  });

  it('403 follows the format gate; 503 offers nothing', () => {
    expect(resolveLimitCta('premium', { kind: 'locked', format: 'mp4' }, TIERS)).toBe('pro');
    expect(resolveLimitCta('free', { kind: 'locked', format: 'gif' }, TIERS)).toBe('premium');
    expect(resolveLimitCta('free', { kind: 'unavailable' }, TIERS)).toBe('none');
  });
});
