// The one place a price numeral becomes display text (MM40, made currency-aware by MM69;
// design PRO_TIER.md §7).
//
// Every price on /pricing, the Billing panel, the plan summary, the interstitials, the auth
// modal and the confirm dialogs goes through formatPrice. The numerals always come from
// /api/tiers or /api/billing/status; this module never knows a price. USD and EUR carry the
// SAME numerals (no FX conversion anywhere) and are never added together.

import type { BillingCurrency, TiersResponse } from '@/lib/auth/accountApi';

const formatters = new Map<string, Intl.NumberFormat>();

/**
 * A served numeral as a localized currency string through Intl (e.g. 8 -> "$8" or "€8" in
 * en-US, "8 €" in de-DE). Whole numbers drop the fraction; a non-integer (a legacy $7.50)
 * keeps two digits. An unsupported locale falls back to en-US.
 */
export function formatPrice(amount: number, currency: BillingCurrency, locale = 'en-US'): string {
  const fraction = Number.isInteger(amount) ? 0 : 2;
  const key = `${locale}|${currency}|${fraction}`;
  let f = formatters.get(key);
  if (!f) {
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: fraction,
      maximumFractionDigits: fraction,
    };
    try {
      f = new Intl.NumberFormat(locale, options);
    } catch {
      f = new Intl.NumberFormat('en-US', options);
    }
    formatters.set(key, f);
  }
  return f.format(amount);
}

/**
 * MM40's helper, kept for callers that have no currency in scope: a USD price in en-US.
 * New code calls formatPrice.
 */
export function displayPrice(amount: number, currency: BillingCurrency = 'usd', locale = 'en-US'): string {
  return formatPrice(amount, currency, locale);
}

/**
 * Whole months a yearly price saves versus twelve monthly ones (e.g. 8 and 80 -> 2); 0 when
 * it is no discount or a price is missing. Derived from the two served prices, never written.
 */
export function yearlyMonthsFree(monthly: number | undefined, yearly: number | undefined): number {
  if (!monthly || monthly <= 0 || !yearly) return 0;
  return Math.max(0, Math.round(12 - yearly / monthly));
}

type PriceSource = Pick<
  TiersResponse,
  'prices' | 'premiumPriceUSD' | 'premiumPriceYearlyUSD' | 'proPriceUSD' | 'proPriceYearlyUSD'
>;

/**
 * A plan's served monthly and yearly numerals in a currency: `prices[currency]` (MM69), else
 * the legacy `*USD` fields an older API sends (same numerals, so they serve EUR as well).
 */
export function planPrices(
  tiers: Partial<PriceSource> | undefined | null,
  plan: 'premium' | 'pro',
  currency: BillingCurrency = 'usd',
): { monthly: number | undefined; yearly: number | undefined } {
  if (!tiers) return { monthly: undefined, yearly: undefined };
  const served = tiers.prices?.[currency] ?? tiers.prices?.usd;
  if (served) {
    return plan === 'pro'
      ? { monthly: served.proMonthly, yearly: served.proYearly }
      : { monthly: served.premiumMonthly, yearly: served.premiumYearly };
  }
  return plan === 'pro'
    ? { monthly: tiers.proPriceUSD, yearly: tiers.proPriceYearlyUSD }
    : { monthly: tiers.premiumPriceUSD, yearly: tiers.premiumPriceYearlyUSD };
}
