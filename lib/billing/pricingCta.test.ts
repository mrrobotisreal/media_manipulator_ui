import { describe, expect, it } from 'vitest';

import { pricingCta } from './pricingCta';

const base = { purchasable: true, hidden: false, pendingPlan: null };

describe('pricing routing by tier (MM40 decision 1, design §4)', () => {
  it.each([
    // tier,       Premium column, Pro column
    ['anonymous', 'signup', 'signup'],
    ['free', 'checkout', 'checkout'],
    ['premium', 'portal', 'upgrade'],
    ['pro', 'downgrade', 'portal'],
    ['operator', 'operator', 'operator'],
  ] as const)('%s: Premium=%s, Pro=%s', (tier, premium, pro) => {
    expect(pricingCta({ ...base, tier, plan: 'premium' })).toBe(premium);
    expect(pricingCta({ ...base, tier, plan: 'pro' })).toBe(pro);
  });

  it('pro with a scheduled downgrade: the Premium column shows the pending state, not another switch', () => {
    const pendingPlan = { to: 'premium' as const, at: '2026-11-25T00:00:00Z' };
    expect(pricingCta({ ...base, tier: 'pro', plan: 'premium', pendingPlan })).toBe('pending');
    expect(pricingCta({ ...base, tier: 'pro', plan: 'pro', pendingPlan })).toBe('portal');
  });

  it('a plan that is not purchasable is "not available yet", except your own plan', () => {
    const off = { ...base, purchasable: false };
    expect(pricingCta({ ...off, tier: 'anonymous', plan: 'pro' })).toBe('unavailable');
    expect(pricingCta({ ...off, tier: 'free', plan: 'pro' })).toBe('unavailable');
    expect(pricingCta({ ...off, tier: 'premium', plan: 'pro' })).toBe('unavailable');
    expect(pricingCta({ ...off, tier: 'pro', plan: 'premium' })).toBe('unavailable');
    expect(pricingCta({ ...off, tier: 'premium', plan: 'premium' })).toBe('portal');
    expect(pricingCta({ ...off, tier: 'pro', plan: 'pro' })).toBe('portal');
  });

  it('translator deployments (MM52) never offer a purchase or plan change', () => {
    for (const tier of ['anonymous', 'free', 'premium', 'pro'] as const) {
      for (const plan of ['premium', 'pro'] as const) {
        expect(pricingCta({ ...base, tier, plan, hidden: true })).toBe('unavailable');
      }
    }
    expect(pricingCta({ ...base, tier: 'operator', plan: 'pro', hidden: true })).toBe('operator');
  });
});
