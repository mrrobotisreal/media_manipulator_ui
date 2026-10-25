// Client-side billing actions: start Checkout, open the Portal, remember the chosen interval.
//
// Plain functions (no React) so the hook, the pricing island, the billing panel and the
// interstitial all share one implementation and one set of analytics call sites. Stripe is
// reached only by a full-page redirect to the URL the API returns (ADR-0009): no Stripe.js.

import { analytics, EVENTS } from '@/lib/analytics';
import { getCurrentIdToken } from '@/lib/firebase';
import {
  BillingRefusal,
  createCheckoutSession,
  createPortalSession,
  type BillingInterval,
  type BillingRefusalReason,
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
export function setPendingCheckout(interval: BillingInterval, placement: string): void {
  try {
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify({ interval, placement, at: Date.now() }));
  } catch {
    /* nothing to do */
  }
}

/** Reads AND clears the pending marker, so a continuation can only ever run once. */
export function takePendingCheckout(): { interval: BillingInterval; placement: string } | null {
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(PENDING_KEY);
    const parsed = JSON.parse(raw) as { interval?: unknown; placement?: unknown; at?: unknown };
    if (!isBillingInterval(parsed.interval)) return null;
    // A marker left by an abandoned sign-up must not fire a checkout days later.
    if (typeof parsed.at !== 'number' || Date.now() - parsed.at > PENDING_TTL_MS) return null;
    return {
      interval: parsed.interval,
      placement: typeof parsed.placement === 'string' ? parsed.placement : 'pricing_premium',
    };
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
 * about to go out (the redirect is imminent), never on a refusal path.
 */
export async function startCheckout(
  interval: BillingInterval,
  placement: string,
  locale?: string,
): Promise<BillingOutcome> {
  // MM52 (design §2.15): no Checkout on translator deployments, whatever UI calls this.
  if (isIrreversibleActionHidden()) return { ok: false, reason: 'billing_unavailable' };
  const idToken = await getCurrentIdToken();
  if (!idToken) return { ok: false, reason: 'no_token' };
  rememberInterval(interval);
  try {
    const { url } = await createCheckoutSession(idToken, { interval, locale });
    analytics.track(EVENTS.CHECKOUT_STARTED, { interval, placement });
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
