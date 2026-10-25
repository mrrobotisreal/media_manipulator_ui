// What a /pricing paid column offers whom (MM40 decision 1, design PRO_TIER.md §4). A pure
// function, so the whole routing table is one unit test rather than a render per cell.
//
//                 Premium column              Pro column
//   anonymous     sign up, then Checkout      sign up, then Checkout (plan=pro)
//   free          Checkout plan=premium       Checkout plan=pro
//   premium       current plan -> Portal      "Upgrade to Pro" -> change-plan (now, prorated)
//   pro           "Switch to Premium"         current plan -> Portal
//                 (scheduled, period end;
//                 "Premium from <date>" once
//                 scheduled)
//   operator      no CTA                      no CTA
//
// Not purchasable (per plan, from /api/tiers) -> the disabled "not available yet" button,
// except on the caller's own plan, which can always be managed. Translator deployments
// (MM52) -> disabled on every column.

import type { PaidPlan, PendingPlan, Tier } from '@/lib/auth/accountApi';

export type PricingCtaKind =
  | 'operator'
  | 'unavailable'
  | 'signup'
  | 'checkout'
  | 'portal'
  | 'upgrade'
  | 'downgrade'
  | 'pending';

export interface PricingCtaInput {
  plan: PaidPlan;
  tier: Tier;
  /** This column's plan can be bought (premiumPurchasable / proPurchasable). */
  purchasable: boolean;
  /** The caller's scheduled change, from GET /api/billing/status. */
  pendingPlan?: PendingPlan | null;
  /** isIrreversibleActionHidden(): a translator deployment. */
  hidden: boolean;
}

export function pricingCta({ plan, tier, purchasable, pendingPlan, hidden }: PricingCtaInput): PricingCtaKind {
  if (tier === 'operator') return 'operator';
  if (hidden) return 'unavailable';
  if (tier === plan) return 'portal';
  switch (tier) {
    case 'anonymous':
      return purchasable ? 'signup' : 'unavailable';
    case 'free':
      return purchasable ? 'checkout' : 'unavailable';
    case 'premium':
      // Only the Pro column is left here (tier === plan handled above).
      return purchasable ? 'upgrade' : 'unavailable';
    case 'pro':
      if (pendingPlan?.to === plan) return 'pending';
      return purchasable ? 'downgrade' : 'unavailable';
    default:
      return 'unavailable';
  }
}
