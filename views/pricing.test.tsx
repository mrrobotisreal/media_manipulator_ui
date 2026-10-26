import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

vi.mock('@/components/pricing/pricing-tracker', () => ({
  PricingTracker: () => null,
  PricingUpgradeLink: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));
vi.mock('@/components/pricing/currency-toggle', () => ({
  CurrencyToggle: ({ placement }: { placement: string }) => <div data-testid="currency-toggle" data-placement={placement} />,
}));
vi.mock('@/components/pricing/premium-cta', async () => {
  const { formatPrice } = await import('@/lib/billing/price');
  type Prices = Record<'usd' | 'eur', { monthly?: number; yearly?: number }>;
  return {
    CheckoutCancelledNote: () => null,
    PricingIntervalToggle: () => <div data-testid="interval-toggle" />,
    // Echo what the island receives, formatted the way the island formats it (MM69).
    PlanPricing: ({ plan, labels, purchasable, prices }: { plan: string; labels: Record<string, string>; purchasable: boolean; prices: Prices }) => (
      <div data-plan-island={plan} data-purchasable={String(purchasable)}>
        {(['usd', 'eur'] as const).map((c) => `${formatPrice(prices[c].monthly ?? 0, c)}${labels.perMonth} ${formatPrice(prices[c].yearly ?? 0, c)}${labels.perYear}`).join(' | ')} {labels.yearlyBonus}
      </div>
    ),
  };
});

import PricingView from './pricing';
import type { TiersResponse, TierLimits } from '@/lib/auth/accountApi';
import { tiersFixture } from '@/lib/billing/test-utils';

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

describe('three-column pricing (MM40 decision 1)', () => {
  const served = tiersFixture();
  const html = renderToStaticMarkup(<PricingView data={served} />);

  it('renders Free, Premium and Pro panels plus the anonymous strip, and four table columns', () => {
    for (const tier of ['free', 'premium', 'pro']) expect(html).toContain(`data-testid="pricing-panel-${tier}"`);
    expect(html).toContain('data-testid="pricing-anonymous"');
    for (const tier of ['anonymous', 'free', 'premium', 'pro']) expect(html).toContain(`data-tier="${tier}" data-row="opsPerDay"`);
    expect(html).toContain('data-plan-island="premium"');
    expect(html).toContain('data-plan-island="pro"');
  });

  it('badges Pro "Best for Motion" and shows one shared interval toggle with the currency toggle beside it', () => {
    expect(html).toContain('data-testid="pro-badge"');
    expect(html).toContain('Best for Motion');
    expect(html.match(/data-testid="interval-toggle"/g)).toHaveLength(1);
    // MM69: one USD / EUR toggle in the same row.
    expect(html).toMatch(/data-testid="pricing-toggles"[^>]*><div data-testid="interval-toggle"><\/div><div data-testid="currency-toggle" data-placement="pricing">/);
  });

  it('prices both paid columns from the served numerals in both currencies, months free derived', () => {
    expect(html).toMatch(/data-plan-island="premium"[^>]*>\$9\/mo \$90\/yr \| €9\/mo €90\/yr 2 months free/);
    expect(html).toMatch(/data-plan-island="pro"[^>]*>\$17\/mo \$170\/yr \| €17\/mo €170\/yr 2 months free/);
  });

  it('MM69: reads prices.eur when the API sends it, the legacy *USD fields otherwise', () => {
    const served2 = { ...tiersFixture(), defaultCurrency: 'eur' as const, prices: {
      usd: { premiumMonthly: 9, premiumYearly: 90, proMonthly: 17, proYearly: 170 },
      eur: { premiumMonthly: 11, premiumYearly: 110, proMonthly: 19, proYearly: 190 },
    } };
    const out = renderToStaticMarkup(<PricingView data={served2} />);
    expect(out).toMatch(/data-plan-island="premium"[^>]*>\$9\/mo \$90\/yr \| €11\/mo €110\/yr/);
    expect(out).toMatch(/data-plan-island="pro"[^>]*>\$17\/mo \$170\/yr \| €19\/mo €190\/yr/);
  });

  it('passes proPurchasable through: the island renders "not available" when false', () => {
    const off = renderToStaticMarkup(<PricingView data={tiersFixture({ proPurchasable: false })} />);
    expect(off).toContain('data-plan-island="pro" data-purchasable="false"');
    expect(off).toContain('data-plan-island="premium" data-purchasable="true"');
  });

  it('every limit cell is the served value (Pro ops 700, AI 120, Motion 30/25)', () => {
    const cell = (tier: string, row: string) => {
      const m = html.match(new RegExp(`data-tier="${tier}" data-row="${row}"><span[^>]*>([^<]*)<`));
      return m?.[1];
    };
    expect(cell('pro', 'opsPerDay')).toBe('700');
    expect(cell('pro', 'aiOpsPerDay')).toBe('120');
    expect(cell('pro', 'exportsPerDay')).toBe('700');
    expect(cell('premium', 'opsPerDay')).toBe('300');
    expect(cell('pro', 'vectorExportsPerDay')).toBe('30');
    expect(cell('pro', 'vectorProjects')).toBe('25');
    expect(cell('anonymous', 'vectorProjects')).toBe('1, local only');
    expect(cell('premium', 'studioProjects')).toBe('Unlimited');
    expect(cell('pro', 'maxFileBytes')).toBe('5 GB');
  });

  it('a changed table changes the page: nothing is a literal', () => {
    const retuned = tiersFixture();
    const pro = retuned.tiers.find((x) => x.tier === 'pro')!.limits;
    pro.opsPerDay = 1234;
    pro.exportsPerDay = 1235;
    pro.vectorExportsPerDay = 77;
    retuned.proPriceUSD = 21;
    const out = renderToStaticMarkup(<PricingView data={retuned} />);
    expect(out).toContain('>1234<');
    expect(out).toContain('>77<');
    expect(out).toContain('$21/mo');
    expect(out).not.toContain('>700<');
  });

  it('an API without Motion fields or a Pro row degrades: no Motion rows, no Pro column', () => {
    const out = renderToStaticMarkup(<PricingView data={data} />);
    expect(out).not.toContain('data-row="vectorExportsPerDay"');
    expect(out).not.toContain('data-plan-island="pro"');
    expect(out).not.toContain('pricing-motion-note');
  });

  it('uses logical properties only (RTL-safe for Hebrew)', () => {
    const he = renderToStaticMarkup(<PricingView data={served} locale="he-IL" />);
    expect(he).toContain('data-plan-island="pro"');
    expect(he).not.toMatch(/\b(text-left|text-right|pl-\d|pr-\d|ml-\d|mr-\d|left-\d|right-\d)\b/);
  });
});

describe('no numeric literal for limits or prices in views/pricing.tsx (MM40 acceptance 2)', () => {
  const source = readFileSync(join(__dirname, 'pricing.tsx'), 'utf8')
    // Comments may cite numbers; code may not.
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    // Tailwind classes carry numbers (bg-premium/15, py-12); they are styling, not limits.
    .replace(/className=("[^"]*"|\{[^}]*\})/g, '');

  it('names no price and no limit value', () => {
    for (const n of ['8', '80', '15', '150', '300', '700', '60', '120', '1080', '1440', '2160']) {
      expect(source).not.toMatch(new RegExp(`[^\\w.-]${n}[^\\w.%-]`));
    }
    expect(source).not.toMatch(/\$\d/);
    expect(source).not.toMatch(/'\$'|`\$\$\{/);
  });
});
