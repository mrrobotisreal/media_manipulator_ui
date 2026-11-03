import { describe, expect, it } from 'vitest';

import type { Tier, TierLimits, TiersResponse } from '@/lib/auth/accountApi';
import { resolvePhotoGate, resolveProjectsGate, upgradePathProp, type PhotoCta } from './gating';

// MM101 decision 2. The fixture mirrors the API's /api/tiers after MM95
// (internal/tiers: projects 0 / 5 / 50 / unlimited, export 12 / 12 / 120 / 120 MP,
// batch 0 / 3 / 10 / 25). The module reads these numbers from the payload only.
const row = (photoProjects: number, photoMaxMegapixels: number, photoBatch: number) => ({ photoProjects, photoMaxMegapixels, photoBatch }) as TierLimits;
const TIERS: TiersResponse = {
  premiumPurchasable: true,
  premiumPriceUSD: 8,
  proPurchasable: true,
  tiers: [
    { tier: 'anonymous', limits: row(0, 12, 0) },
    { tier: 'free', limits: row(5, 12, 3) },
    { tier: 'premium', limits: row(50, 120, 10) },
    { tier: 'pro', limits: row(-1, 120, 25) },
  ],
};
const NO_PHOTO: TiersResponse = { ...TIERS, tiers: TIERS.tiers.map((t) => ({ tier: t.tier, limits: {} as TierLimits })) };
const NO_PRO: TiersResponse = { ...TIERS, tiers: TIERS.tiers.filter((t) => t.tier !== 'pro') };

const ALL: Tier[] = ['anonymous', 'free', 'premium', 'pro', 'operator'];
const out = (g: ReturnType<typeof resolvePhotoGate>) => (g.allowed ? 'A' : `${g.requiredTier}/${g.cta}`);

describe('resolvePhotoGate: megapixels (tier x size table)', () => {
  const want: Record<number, Record<Tier, string>> = {
    // The dialog offers 12 / 24 / 64 / 120 MP; 12 is the free cap.
    12: { anonymous: 'A', free: 'A', premium: 'A', pro: 'A', operator: 'A' },
    24: { anonymous: 'premium/premium', free: 'premium/premium', premium: 'A', pro: 'A', operator: 'A' },
    64: { anonymous: 'premium/premium', free: 'premium/premium', premium: 'A', pro: 'A', operator: 'A' },
    120: { anonymous: 'premium/premium', free: 'premium/premium', premium: 'A', pro: 'A', operator: 'A' },
    // Above every cap: nobody can lift it, nothing is offered.
    121: { anonymous: 'null/none', free: 'null/none', premium: 'null/none', pro: 'null/none', operator: 'A' },
  };
  for (const [mp, byTier] of Object.entries(want)) {
    for (const tier of ALL) {
      it(`${mp} MP for ${tier} -> ${byTier[tier]}`, () => {
        expect(out(resolvePhotoGate(tier, { kind: 'megapixels', megapixels: Number(mp) }, TIERS))).toBe(byTier[tier]);
      });
    }
  }
  it('signing in alone never unlocks a bigger size: free is offered Premium, not "sign in"', () => {
    const g = resolvePhotoGate('anonymous', { kind: 'megapixels', megapixels: 24 }, TIERS);
    expect(g).toMatchObject({ allowed: false, reason: 'megapixels', requiredTier: 'premium', cta: 'premium' });
  });
});

describe('resolvePhotoGate: batch (tier x count table)', () => {
  const want: Array<[number, Record<Tier, string>]> = [
    [1, { anonymous: 'free/signup', free: 'A', premium: 'A', pro: 'A', operator: 'A' }],
    [3, { anonymous: 'free/signup', free: 'A', premium: 'A', pro: 'A', operator: 'A' }],
    [4, { anonymous: 'free/signup', free: 'premium/premium', premium: 'A', pro: 'A', operator: 'A' }],
    [11, { anonymous: 'free/signup', free: 'premium/premium', premium: 'pro/pro', pro: 'A', operator: 'A' }],
    [26, { anonymous: 'free/signup', free: 'premium/premium', premium: 'pro/pro', pro: 'null/none', operator: 'A' }],
  ];
  for (const [count, byTier] of want) {
    for (const tier of ALL) {
      it(`${count} photos for ${tier} -> ${byTier[tier]}`, () => {
        expect(out(resolvePhotoGate(tier, { kind: 'batch', count }, TIERS))).toBe(byTier[tier]);
      });
    }
  }
  it('a caller at exactly its own limit + 1 is routed to the next rung (what the dialog asks)', () => {
    expect(resolvePhotoGate('free', { kind: 'batch', count: 4 }, TIERS)).toMatchObject({ reason: 'batch', requiredTier: 'premium', cta: 'premium' });
  });
});

describe('resolveProjectsGate', () => {
  it('anonymous: always gated, sign in free (the browser-only banner)', () => {
    expect(resolveProjectsGate('anonymous', undefined, TIERS)).toMatchObject({ allowed: false, reason: 'projects', requiredTier: 'free', cta: 'signup' });
    expect(resolveProjectsGate(undefined, 0, TIERS)).toMatchObject({ cta: 'signup' });
  });
  it('free at 5 -> Premium; premium at 50 -> Pro; below the cap -> allowed', () => {
    expect(out(resolveProjectsGate('free', 5, TIERS))).toBe('premium/premium');
    expect(out(resolveProjectsGate('free', 4, TIERS))).toBe('A');
    expect(out(resolveProjectsGate('free', undefined, TIERS))).toBe('A');
    expect(out(resolveProjectsGate('premium', 50, TIERS))).toBe('pro/pro');
    expect(out(resolveProjectsGate('premium', 49, TIERS))).toBe('A');
  });
  it('pro (unlimited) and operator: never gated, never an upsell', () => {
    expect(resolveProjectsGate('pro', 9999, TIERS)).toEqual({ allowed: true });
    expect(resolveProjectsGate('operator', 9999, TIERS)).toEqual({ allowed: true });
  });
});

describe('degradation and routing details', () => {
  it('a payload without photo* fields (or no payload) is allowed everywhere: the server decides', () => {
    for (const tiers of [NO_PHOTO, null, undefined]) {
      for (const tier of ALL) {
        expect(resolvePhotoGate(tier, { kind: 'megapixels', megapixels: 120 }, tiers)).toEqual({ allowed: true });
        expect(resolvePhotoGate(tier, { kind: 'batch', count: 99 }, tiers)).toEqual({ allowed: true });
        expect(resolveProjectsGate(tier, 999, tiers)).toEqual({ allowed: true });
      }
    }
  });
  it('pro never gets a CTA, even when its own limit is hit', () => {
    for (const request of [{ kind: 'batch', count: 26 }, { kind: 'megapixels', megapixels: 121 }] as const) {
      const g = resolvePhotoGate('pro', request, TIERS);
      expect(g.allowed ? 'none' : g.cta).toBe('none');
    }
  });
  it('a deployment with no pro row: a premium batch hit offers nothing (premium is the top it knows)', () => {
    expect(out(resolvePhotoGate('premium', { kind: 'batch', count: 11 }, NO_PRO))).toBe('null/none');
    expect(out(resolveProjectsGate('premium', 50, NO_PRO))).toBe('null/none');
  });
  it('an unknown tier string reads as anonymous', () => {
    expect(out(resolvePhotoGate('weird', { kind: 'batch', count: 1 }, TIERS))).toBe('free/signup');
  });
  it('upgradePathProp is the identity on the wire vocabulary', () => {
    const all: PhotoCta[] = ['signup', 'premium', 'pro', 'none'];
    expect(all.map(upgradePathProp)).toEqual(all);
  });
});
