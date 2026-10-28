/**
 * The plan price numerals as GET /api/tiers serves them (`prices.usd` /
 * `prices.eur`, MM69: the same numerals in both currencies), for the places that
 * are built without the API: structured data (lib/seo.ts AggregateOffer and the
 * /pricing Product, MM85) and /llms.txt. The pricing page itself always renders
 * the served numbers. If the API's config defaults change, change these with it;
 * planPrices.test.ts pins them to the Terms' price sentence.
 */
export const PLAN_PRICES = {
  premium: { monthly: 8, yearly: 80 },
  pro: { monthly: 15, yearly: 150 },
} as const;

export type PaidPlanKey = keyof typeof PLAN_PRICES;
