import { describe, expect, it } from 'vitest';

import { isPaidTier, isTopTier, tierRank, type Tier } from '@/lib/auth/accountApi';
import { LIMIT_FIELDS, limitRaisedByPro, paidPlanOf, upsellTargetFor } from './plans';
import { displayPrice } from './price';
import { tiersFixture } from './test-utils';

const ALL: Tier[] = ['anonymous', 'free', 'premium', 'pro', 'operator'];

describe('isTopTier / isPaidTier matrix (MM40 decision 2)', () => {
  it.each([
    ['anonymous', false, false],
    ['free', false, false],
    ['premium', false, true],
    ['pro', true, true],
    ['operator', true, true],
  ] as const)('%s: top=%s paid=%s', (tier, top, paid) => {
    expect(isTopTier(tier)).toBe(top);
    expect(isPaidTier(tier)).toBe(paid);
  });

  it('ranks the ladder strictly upward', () => {
    expect(ALL.map(tierRank)).toEqual([0, 1, 2, 3, 4]);
  });
});

describe('limitRaisedByPro (MM40 decision 3)', () => {
  const tiers = tiersFixture();

  it.each(['quota_ops', 'quota_ai_ops', 'quota_export'])('%s: Pro raises it (served numbers agree)', (key) => {
    expect(limitRaisedByPro(key, tiers)).toBe(true);
  });

  it.each(['file_too_large', 'video_too_long', 'output_height_limited', 'ladder_height_limited', 'project_limit_reached'])(
    '%s: Pro does not raise it',
    (key) => {
      expect(limitRaisedByPro(key, tiers)).toBe(false);
      expect(limitRaisedByPro(key)).toBe(false);
    },
  );

  it('Motion exports: in the design set, but the served table decides (Pro = Premium until MM49)', () => {
    expect(limitRaisedByPro('quota_vector_export')).toBe(true);
    expect(limitRaisedByPro('quota_vector_export', tiers)).toBe(false);
    const raised = tiersFixture();
    raised.tiers.find((x) => x.tier === 'pro')!.limits.vectorExportsPerDay = 100;
    expect(limitRaisedByPro('quota_vector_export', raised)).toBe(true);
  });

  it('agrees with the fixture for every mapped key: a raise needs Pro > Premium', () => {
    const premium = tiers.tiers.find((x) => x.tier === 'premium')!.limits as unknown as Record<string, number>;
    const pro = tiers.tiers.find((x) => x.tier === 'pro')!.limits as unknown as Record<string, number>;
    for (const [key, field] of Object.entries(LIMIT_FIELDS)) {
      if (limitRaisedByPro(key, tiers)) expect(pro[field]).toBeGreaterThan(premium[field]);
    }
  });

  it('is false when the API has no Pro row, and for unknown keys', () => {
    expect(limitRaisedByPro('quota_ops', tiersFixture({ withPro: false }))).toBe(false);
    expect(limitRaisedByPro('nope', tiers)).toBe(false);
  });
});

describe('upsellTargetFor', () => {
  const tiers = tiersFixture();
  it('routes by tier: signup, Premium, Pro only for a Pro-raised limit, nothing at the top', () => {
    expect(upsellTargetFor('anonymous', 'file_too_large', tiers)).toBe('signup');
    expect(upsellTargetFor('free', 'quota_ops', tiers)).toBe('premium');
    expect(upsellTargetFor('free', 'file_too_large', tiers)).toBe('premium');
    expect(upsellTargetFor('premium', 'quota_ops', tiers)).toBe('pro');
    expect(upsellTargetFor('premium', 'file_too_large', tiers)).toBeUndefined();
    expect(upsellTargetFor('premium', 'output_height_limited', tiers)).toBeUndefined();
    expect(upsellTargetFor('pro', 'quota_ops', tiers)).toBeUndefined();
    expect(upsellTargetFor('operator', 'quota_ops', tiers)).toBeUndefined();
    expect(upsellTargetFor(undefined, 'quota_ops', tiers)).toBeUndefined();
  });

  it('paidPlanOf names only the two paid plans', () => {
    expect(ALL.map(paidPlanOf)).toEqual([null, null, 'premium', 'pro', null]);
  });
});

describe('displayPrice (the one price helper, MM69 seam)', () => {
  it('renders the served numeral', () => {
    expect(displayPrice(15)).toBe('$15');
    expect(displayPrice(150)).toBe('$150');
  });
});
