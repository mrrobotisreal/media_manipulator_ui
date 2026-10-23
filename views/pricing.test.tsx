import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('@/components/pricing/pricing-tracker', () => ({
  PricingTracker: () => null,
  PricingUpgradeLink: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));
vi.mock('@/components/pricing/premium-cta', () => ({
  CheckoutCancelledNote: () => null,
  PremiumPricing: () => <div>premium</div>,
}));

import PricingView from './pricing';
import type { TiersResponse, TierLimits } from '@/lib/auth/accountApi';

const limits = (hours: number): TierLimits => ({
  opsPerDay: 5, aiOpsPerDay: 1, exportsPerDay: 1, maxFileBytes: 200 * 1024 * 1024, maxVideoSeconds: 300,
  maxOutputHeight: 1080, maxLadderHeight: 1080, studioProjects: 1, priorityGpu: false,
  resultRetentionHours: hours, adsRemoved: false,
});
const data: TiersResponse = {
  tiers: [
    { tier: 'anonymous', limits: limits(24) },
    { tier: 'free', limits: limits(4320) },
    { tier: 'premium', limits: limits(4320) },
  ],
  premiumPurchasable: true,
  premiumPriceUSD: 7,
  premiumPriceYearlyUSD: 70,
};

describe('pricing page retention wording (MM26)', () => {
  it('drops the "Results kept for" row and prints the You-choose line', () => {
    const html = renderToStaticMarkup(<PricingView data={data} />);
    expect(html).not.toContain('Results kept for');
    expect(html).not.toMatch(/6 months|180 days/);
    expect(html).toContain('You choose: 24 hours to 2 years');
    expect(html).toContain('Guests without an account: 24 hours');
  });

  it.each(['de-DE', 'es-ES', 'he-IL', 'ru-RU', 'uk-UA'])('%s renders the retention note without the old row', (loc) => {
    const html = renderToStaticMarkup(<PricingView data={data} locale={loc} />);
    expect(html).toContain('data-testid="pricing-retention-note"');
    expect(html).not.toContain('Results kept for');
  });
});
