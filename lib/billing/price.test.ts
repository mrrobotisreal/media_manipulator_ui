import { describe, expect, it } from 'vitest';

import { locales } from '@/i18n/locales';
import { displayPrice, formatPrice, planPrices } from './price';

/** The golden is whatever this runtime's Intl says (never a literal: ICU changes between Node and browsers). */
const intl = (n: number, currency: string, locale: string) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

describe('formatPrice goldens: every registered locale x both currencies (MM69)', () => {
  for (const { code } of locales) {
    for (const currency of ['usd', 'eur'] as const) {
      it(`${code} ${currency}`, () => {
        for (const n of [6, 7, 8, 15, 80, 150]) {
          expect(formatPrice(n, currency, code)).toBe(intl(n, currency.toUpperCase(), code));
        }
        // Same numeral, different symbol: never a converted amount, never cents. (ar-SA's
        // Intl uses Arabic-Indic digits; the equality above is the check there.)
        const latin = formatPrice(8, currency, code).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
        expect(latin).toMatch(/8/);
        expect(latin).not.toMatch(/[.,٫]\d{2}\b/);
      });
    }
  }

  it('prints the golden table (acceptance demonstration)', () => {
    const rows = locales.map(({ code }) => `${code.padEnd(6)} ${formatPrice(8, 'usd', code).padEnd(10)} ${formatPrice(8, 'eur', code)}`);
    console.log(['locale USD 8      EUR 8', ...rows].join('\n'));
    expect(rows).toHaveLength(locales.length);
  });

  it('keeps cents for a legacy non-integer price and falls back to en-US for an unknown locale', () => {
    expect(formatPrice(7.5, 'usd', 'en-US')).toBe('$7.50');
    expect(formatPrice(8, 'eur', 'xx-invalid-@@')).toBe(intl(8, 'EUR', 'en-US'));
    expect(displayPrice(8)).toBe('$8');
  });
});

describe('planPrices (MM69)', () => {
  const legacy = { premiumPriceUSD: 8, premiumPriceYearlyUSD: 80, proPriceUSD: 15, proPriceYearlyUSD: 150 };
  it('reads prices[currency], else the legacy *USD fields (same numerals) for an older API', () => {
    const served = { ...legacy, prices: { usd: { premiumMonthly: 8, premiumYearly: 80, proMonthly: 15, proYearly: 150 }, eur: { premiumMonthly: 9, premiumYearly: 90, proMonthly: 16, proYearly: 160 } } };
    expect(planPrices(served, 'pro', 'eur')).toEqual({ monthly: 16, yearly: 160 });
    expect(planPrices(served, 'premium', 'usd')).toEqual({ monthly: 8, yearly: 80 });
    expect(planPrices(legacy, 'premium', 'eur')).toEqual({ monthly: 8, yearly: 80 });
    expect(planPrices(undefined, 'pro', 'eur')).toEqual({ monthly: undefined, yearly: undefined });
  });
});
