// The one place a price numeral becomes display text (MM40, design PRO_TIER.md §7).
//
// Every price on /pricing, the Billing panel, the plan summary and the confirm dialogs goes
// through displayPrice, so MM69 can swap it for formatPrice(amount, currency, locale) without
// touching a component. The numerals themselves always come from /api/tiers or
// /api/billing/status; this module never knows a price.

/** A served price numeral as display text, e.g. 8 -> "$8". Today every price is USD. */
export function displayPrice(amount: number): string {
  return `$${amount}`;
}

/**
 * Whole months a yearly price saves versus twelve monthly ones (e.g. 8 and 80 -> 2); 0 when
 * it is no discount or a price is missing. Derived from the two served prices, never written.
 */
export function yearlyMonthsFree(monthly: number | undefined, yearly: number | undefined): number {
  if (!monthly || monthly <= 0 || !yearly) return 0;
  return Math.max(0, Math.round(12 - yearly / monthly));
}

/** The served monthly and yearly numerals for a plan (legacy `*USD` fields; MM69 adds currency). */
export function planPrices(
  tiers: { premiumPriceUSD?: number; premiumPriceYearlyUSD?: number; proPriceUSD?: number; proPriceYearlyUSD?: number } | undefined | null,
  plan: 'premium' | 'pro',
): { monthly: number | undefined; yearly: number | undefined } {
  if (!tiers) return { monthly: undefined, yearly: undefined };
  return plan === 'pro'
    ? { monthly: tiers.proPriceUSD, yearly: tiers.proPriceYearlyUSD }
    : { monthly: tiers.premiumPriceUSD, yearly: tiers.premiumPriceYearlyUSD };
}
