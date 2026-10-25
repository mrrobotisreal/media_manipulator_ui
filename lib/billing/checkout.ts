// Client-side billing actions: start Checkout, open the Portal, remember the chosen interval.
//
// Plain functions (no React) so the hook, the pricing island, the billing panel and the
// interstitial all share one implementation and one set of analytics call sites. Stripe is
// reached only by a full-page redirect to the URL the API returns (ADR-0009): no Stripe.js.

import { analytics, EVENTS } from '@/lib/analytics';
import { getCurrentIdToken } from '@/lib/firebase';
import {
  BillingRefusal,
  cancelPlanChange,
  createCheckoutSession,
  createPortalSession,
  isPaidPlan,
  requestPlanChange,
  type BillingInterval,
  type BillingRefusalReason,
  type PaidPlan,
  type PlanChangeResult,
} from '@/lib/auth/accountApi';
import { isIrreversibleActionHidden } from '@/lib/translator/mode';

const INTERVAL_KEY = 'mm.billingInterval';
const PENDING_KEY = 'mm.pendingCheckout';
const PENDING_TTL_MS = 15 * 60_000;

export const DEFAULT_INTERVAL: BillingInterval = 'monthly';

export function isBillingInterval(value: unknown): value is BillingInterval {
  return value === 'monthly' || value === 'yearly';
}

/** The interval the visitor last picked; storage failures fall back to monthly. */
export function readLastInterval(): BillingInterval {
  try {
    const v = window.sessionStorage.getItem(INTERVAL_KEY);
    if (isBillingInterval(v)) return v;
  } catch {
    /* blocked storage is normal */
  }
  return DEFAULT_INTERVAL;
}

export function rememberInterval(interval: BillingInterval): void {
  try {
    window.sessionStorage.setItem(INTERVAL_KEY, interval);
  } catch {
    /* nothing to do */
  }
}

/** Marks "continue to checkout after sign-in" (pricing page, anonymous visitors). */
export function setPendingCheckout(
  interval: BillingInterval,
  placement: string,
  plan: PaidPlan = 'premium',
): void {
  try {
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify({ interval, placement, plan, at: Date.now() }));
  } catch {
    /* nothing to do */
  }
}

/** Reads AND clears the pending marker, so a continuation can only ever run once. */
export function takePendingCheckout(): {
  interval: BillingInterval;
  placement: string;
  plan: PaidPlan;
} | null {
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(PENDING_KEY);
    const parsed = JSON.parse(raw) as { interval?: unknown; placement?: unknown; plan?: unknown; at?: unknown };
    if (!isBillingInterval(parsed.interval)) return null;
    // A marker left by an abandoned sign-up must not fire a checkout days later.
    if (typeof parsed.at !== 'number' || Date.now() - parsed.at > PENDING_TTL_MS) return null;
    return {
      interval: parsed.interval,
      placement: typeof parsed.placement === 'string' ? parsed.placement : 'pricing_premium',
      // A marker written before MM40 has no plan: it was a Premium checkout.
      plan: isPaidPlan(parsed.plan) ? parsed.plan : 'premium',
    };
  } catch {
    return null;
  }
}

/**
 * The plan a pending marker is for, WITHOUT clearing it: /pricing has one island per paid
 * column, and only the column for that plan may take the marker. null when there is none.
 */
export function pendingCheckoutPlan(): PaidPlan | null {
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { plan?: unknown };
    return isPaidPlan(parsed.plan) ? parsed.plan : 'premium';
  } catch {
    return null;
  }
}

export function hasPendingCheckout(): boolean {
  try {
    return window.sessionStorage.getItem(PENDING_KEY) !== null;
  } catch {
    return false;
  }
}

/** Why an action did not redirect. `redirected` means the browser is leaving. */
export type BillingOutcome =
  | { ok: true }
  | { ok: false; reason: BillingRefusalReason | 'no_token' | 'network'; refusal?: BillingRefusal };

function outcomeFor(error: unknown): BillingOutcome {
  if (error instanceof BillingRefusal) return { ok: false, reason: error.reason, refusal: error };
  return { ok: false, reason: 'network' };
}

/**
 * Creates a Checkout Session and redirects. `checkout_started` fires once the request is
 * about to go out (the redirect is imminent), never on a refusal path. `plan` defaults to
 * Premium: only /pricing sells Pro directly (MM40 decision 3).
 */
export async function startCheckout(
  interval: BillingInterval,
  placement: string,
  locale?: string,
  plan: PaidPlan = 'premium',
): Promise<BillingOutcome> {
  // MM52 (design §2.15): no Checkout on translator deployments, whatever UI calls this.
  if (isIrreversibleActionHidden()) return { ok: false, reason: 'billing_unavailable' };
  const idToken = await getCurrentIdToken();
  if (!idToken) return { ok: false, reason: 'no_token' };
  rememberInterval(interval);
  try {
    const { url } = await createCheckoutSession(idToken, { interval, plan, locale });
    analytics.track(EVENTS.CHECKOUT_STARTED, { interval, placement, plan });
    window.location.assign(url);
    return { ok: true };
  } catch (error) {
    return outcomeFor(error);
  }
}

/** Opens the Stripe billing portal (manage, cancel, update card). */
export async function openPortal(placement: string, locale?: string): Promise<BillingOutcome> {
  if (isIrreversibleActionHidden()) return { ok: false, reason: 'billing_unavailable' };
  const idToken = await getCurrentIdToken();
  if (!idToken) return { ok: false, reason: 'no_token' };
  try {
    const { url } = await createPortalSession(idToken, { locale });
    analytics.track(EVENTS.PORTAL_OPENED, { placement });
    window.location.assign(url);
    return { ok: true };
  } catch (error) {
    return outcomeFor(error);
  }
}

export function clearPendingCheckout(): void {
  try {
    window.sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* nothing to do */
  }
}

/** Why a plan change did not happen; `result` is the server's new plan state on success. */
export type PlanChangeOutcome =
  | { ok: true; result: PlanChangeResult }
  | { ok: false; reason: BillingRefusalReason | 'no_token' | 'network' };

function planOutcomeFor(error: unknown): PlanChangeOutcome {
  if (error instanceof BillingRefusal) return { ok: false, reason: error.reason };
  return { ok: false, reason: 'network' };
}

/**
 * Moves a live subscription between Premium and Pro (MM39 change-plan): to Pro now with a
 * prorated charge, or to Premium at the end of the paid period. `from` is the caller's plan,
 * for the `billing_plan_change_requested` event, which fires only once the server accepted.
 */
export async function changePlan(from: PaidPlan, target: PaidPlan): Promise<PlanChangeOutcome> {
  // MM52 (design §2.15): no plan changes on translator deployments.
  if (isIrreversibleActionHidden()) return { ok: false, reason: 'billing_unavailable' };
  const idToken = await getCurrentIdToken();
  if (!idToken) return { ok: false, reason: 'no_token' };
  try {
    const result = await requestPlanChange(idToken, target);
    analytics.track(EVENTS.BILLING_PLAN_CHANGE_REQUESTED, {
      from,
      to: target,
      timing: result.timing ?? (target === 'pro' ? 'immediate' : 'period_end'),
    });
    return { ok: true, result };
  } catch (error) {
    return planOutcomeFor(error);
  }
}

/** "Keep Pro": releases a scheduled downgrade (DELETE change-plan). */
export async function keepPlan(from: PaidPlan, to: PaidPlan): Promise<PlanChangeOutcome> {
  if (isIrreversibleActionHidden()) return { ok: false, reason: 'billing_unavailable' };
  const idToken = await getCurrentIdToken();
  if (!idToken) return { ok: false, reason: 'no_token' };
  try {
    const result = await cancelPlanChange(idToken);
    analytics.track(EVENTS.BILLING_PLAN_CHANGE_CANCELLED, { from, to });
    return { ok: true, result };
  } catch (error) {
    return planOutcomeFor(error);
  }
}

/** The copy key for a refused plan change, so every surface says the same thing. */
export function planChangeErrorKey(reason: BillingRefusalReason | 'no_token' | 'network'): string {
  switch (reason) {
    case 'not_subscription':
      return 'interface:billing.planChange.errors.notSubscription';
    case 'same_plan':
      return 'interface:billing.planChange.errors.samePlan';
    case 'change_not_available':
      return 'interface:billing.planChange.errors.notAvailable';
    case 'billing_unavailable':
      return 'interface:billing.errors.unavailable';
    default:
      return 'interface:billing.planChange.errors.generic';
  }
}
