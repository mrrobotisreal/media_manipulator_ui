'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';

import { Segmented } from '@/components/darkroom/segmented';
import { Button } from '@/components/ui/button';
import { PlanChangeDialog } from '@/components/account/plan-change-dialog';
import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import { isPaidTier, type BillingInterval, type PaidPlan } from '@/lib/auth/accountApi';
import {
  openPortal,
  pendingCheckoutPlan,
  readLastInterval,
  setPendingCheckout,
  startCheckout,
  takePendingCheckout,
} from '@/lib/billing/checkout';
import { pricingCta } from '@/lib/billing/pricingCta';
import { useBillingStatus } from '@/lib/billing/useBillingStatus';
import { usePlanChange } from '@/lib/billing/usePlanChange';
import { useBillingFallback } from '@/lib/billing/useUpgradeAction';
import { useLocalization } from '@/i18n/useLocalization';
import { cn } from '@/lib/utils';
import { isIrreversibleActionHidden } from '@/lib/translator/mode';
import { setPricingInterval, usePricingInterval } from './interval-store';

/**
 * A paid column's price, CTA and plan state on /pricing (Premium and Pro, MM40): the page's
 * client islands (see pricing-tracker.tsx for why the page is otherwise a server component).
 *
 * All strings arrive as props from the server view so `pages.json` stays out of the client
 * bundle (the plan-change dialog reads the small `billing.planChange` client strings). Prices
 * come from /api/tiers via the same props, never from literals here. The routing table lives
 * in lib/billing/pricingCta.ts; one interval toggle (PricingIntervalToggle) drives both
 * columns through ./interval-store.
 */

export interface PlanPricingLabels {
  /** Pre-formatted through displayPrice, e.g. "$15/mo" and "$150/yr". */
  priceMonthly: string;
  /** Empty when the API did not send a yearly price: the column then always shows monthly. */
  priceYearly: string;
  /** e.g. "2 months free"; empty when the yearly price is not a discount. */
  yearlyBonus: string;
  blurb: string;
  cancelAnytime: string;
  refund: string;
  taxNote: string;
  /** Buy this plan (anonymous and free). */
  ctaUpgrade: string;
  ctaManage: string;
  ctaOperator: string;
  ctaUnavailable: string;
  ctaBusy: string;
  /** "Your plan" chip on the caller's own column. */
  currentPlan: string;
  /** Pro column for a Premium subscriber. */
  ctaChangeUp: string;
  /** Premium column for a Pro subscriber. */
  ctaChangeDown: string;
  /** Premium column once a downgrade is scheduled; `{{date}}` is filled in here. */
  pendingFrom: string;
}

export const PlanPricing: React.FC<{
  plan: PaidPlan;
  labels: PlanPricingLabels;
  purchasable: boolean;
  /** This plan's served numerals, for the plan-change dialog. */
  prices: { monthly?: number; yearly?: number };
}> = ({ plan, labels, purchasable, prices }) => {
  const auth = useAuth();
  const fallback = useBillingFallback();
  const { language, formatDate } = useLocalization(['interface']);
  const interval = usePricingInterval();
  const [busy, setBusy] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const continued = React.useRef(false);
  const planChange = usePlanChange();

  const tier = auth?.tier ?? 'anonymous';
  const ready = !!auth && !auth.loading;
  const placement = `pricing_${plan}`;
  // Subscribers' plan state (pending downgrade, interval, renewal date) for the change CTAs.
  const statusQuery = useBillingStatus(tier === 'premium' || tier === 'pro');
  const status = statusQuery.data;
  const subscribed = !status ? undefined : !status.manualGrant && status.plan !== null;

  const checkout = React.useCallback(
    async (chosen: BillingInterval) => {
      setBusy(true);
      try {
        const outcome = await startCheckout(chosen, placement, language?.code, plan);
        await fallback(outcome, placement);
      } finally {
        setBusy(false);
      }
    },
    [fallback, language?.code, placement, plan],
  );

  // Post-sign-in continuation: an anonymous visitor chose a plan and an interval, signed up,
  // and lands here a free account. Only the column for the marker's plan takes it;
  // takePendingCheckout() clears it as it reads and the ref guards StrictMode, so
  // checkout_started cannot double-fire.
  React.useEffect(() => {
    if (!ready || !auth?.user || continued.current || pendingCheckoutPlan() !== plan) return;
    continued.current = true;
    const pending = takePendingCheckout();
    if (!pending) return;
    setPricingInterval(pending.interval);
    if (tier === 'free' && purchasable) void checkout(pending.interval);
  }, [ready, auth?.user, tier, purchasable, checkout, plan]);

  let kind = pricingCta({
    plan,
    tier,
    purchasable,
    pendingPlan: status?.pendingPlan,
    hidden: isIrreversibleActionHidden(),
  });
  // A team-granted plan has no subscription to change (the API answers not_subscription).
  if ((kind === 'upgrade' || kind === 'downgrade') && subscribed === false) kind = 'unavailable';

  const onCta = () => {
    if (!auth) return;
    if (kind === 'portal') {
      setBusy(true);
      void openPortal(placement, language?.code)
        .then((outcome) => fallback(outcome, placement))
        .finally(() => setBusy(false));
      return;
    }
    if (kind === 'downgrade') {
      setConfirming(true);
      return;
    }
    analytics.track(EVENTS.UPGRADE_CTA_CLICKED, { placement: 'pricing_page', cta_id: placement, from_tier: tier });
    if (kind === 'upgrade') {
      setConfirming(true);
      return;
    }
    if (kind === 'signup') {
      setPendingCheckout(interval, placement, plan);
      auth.openAuth({ intent: 'upgrade', source: placement });
      return;
    }
    void checkout(interval);
  };

  const confirm = () => {
    void planChange.run(kind === 'upgrade' ? 'upgrade' : 'downgrade').then((outcome) => {
      if (outcome) setConfirming(false);
    });
  };

  const yearly = interval === 'yearly' && !!labels.priceYearly;
  const subInterval = status?.interval ?? null;
  const dialogPrice = subInterval === 'yearly' ? prices.yearly : subInterval === 'monthly' ? prices.monthly : undefined;

  let cta: React.ReactNode;
  switch (kind) {
    case 'operator':
      cta = <p className="mt-1 text-sm text-data">{labels.ctaOperator}</p>;
      break;
    case 'unavailable':
      // MM52: on a translator deployment Checkout, the portal and plan changes are disabled;
      // the existing "not available" label is the reason (no new copy, design §2.15).
      cta = (
        <Button className="mt-1 w-full" variant="outline" disabled>
          {labels.ctaUnavailable}
        </Button>
      );
      break;
    case 'pending':
      cta = (
        <p className="mt-1 text-sm text-foreground" data-testid="pricing-pending">
          {status?.pendingPlan ? labels.pendingFrom.replace('{{date}}', formatDate(status.pendingPlan.at)) : null}
        </p>
      );
      break;
    default: {
      const label =
        kind === 'portal'
          ? labels.ctaManage
          : kind === 'upgrade'
            ? labels.ctaChangeUp
            : kind === 'downgrade'
              ? labels.ctaChangeDown
              : labels.ctaUpgrade;
      cta = (
        <Button
          className="mt-1 w-full"
          variant={kind === 'downgrade' || kind === 'portal' ? 'outline' : 'default'}
          onClick={onCta}
          disabled={!ready || busy || planChange.busy}
          data-cta={kind}
        >
          {busy ? labels.ctaBusy : label}
        </Button>
      );
    }
  }

  return (
    <div className="flex flex-col gap-2" data-testid={`${plan}-pricing`} data-cta={kind}>
      {isPaidTier(tier) && tier === plan ? (
        <p className="w-fit rounded-full border border-premium/40 px-2 py-0.5 text-xs font-medium text-premium">
          {labels.currentPlan}
        </p>
      ) : null}
      <p className="num text-2xl leading-none text-foreground">
        {yearly ? labels.priceYearly : labels.priceMonthly}
      </p>
      {yearly && labels.yearlyBonus ? (
        <p className="text-xs font-medium text-premium">{labels.yearlyBonus}</p>
      ) : null}
      <p className="text-sm leading-relaxed text-muted-foreground">{labels.blurb}</p>
      {tier !== 'operator' ? (
        <ul className={cn('grid gap-0.5 text-xs text-muted-foreground')}>
          <li>{labels.cancelAnytime}</li>
          <li>{labels.refund}</li>
          <li>{labels.taxNote}</li>
        </ul>
      ) : null}
      {cta}
      {kind === 'upgrade' || kind === 'downgrade' ? (
        <PlanChangeDialog
          open={confirming}
          onOpenChange={setConfirming}
          target={kind === 'upgrade' ? 'pro' : 'premium'}
          interval={subInterval}
          price={dialogPrice}
          periodEnd={status?.renewsAt}
          busy={planChange.busy}
          onConfirm={confirm}
        />
      ) : null}
    </div>
  );
};

/**
 * The one interval toggle for both paid columns. Its row leaves room for a second Segmented
 * beside it (the USD/EUR toggle, MM69).
 */
export const PricingIntervalToggle: React.FC<{ label: string; monthly: string; yearly: string }> = ({
  label,
  monthly,
  yearly,
}) => {
  const value = usePricingInterval();
  // The last-used interval is restored after mount, not during render, so SSR and the first
  // client render agree.
  React.useEffect(() => {
    setPricingInterval(readLastInterval());
  }, []);
  return (
    <Segmented<BillingInterval>
      name="pricing-interval"
      label={label}
      value={value}
      onValueChange={setPricingInterval}
      options={[
        { value: 'monthly', label: monthly },
        { value: 'yearly', label: yearly },
      ]}
      className="w-full max-w-[240px]"
    />
  );
};

/**
 * `/pricing?checkout=cancelled`: Stripe's cancel URL. Fires `checkout_abandoned` once and
 * shows a dismissible note, then strips the query so a refresh does not re-fire it.
 */
export const CheckoutCancelledNote: React.FC<{ message: string; dismiss: string }> = ({
  message,
  dismiss,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [shown, setShown] = React.useState(false);
  const fired = React.useRef(false);

  React.useEffect(() => {
    if (fired.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') !== 'cancelled') return;
    fired.current = true;
    analytics.track(EVENTS.CHECKOUT_ABANDONED, {});
    setShown(true);
    params.delete('checkout');
    const rest = params.toString();
    router.replace(rest ? `${pathname}?${rest}` : pathname, { scroll: false });
  }, [pathname, router]);

  if (!shown) return null;
  return (
    <div
      role="status"
      className="mb-6 flex items-start justify-between gap-3 rounded-md border border-edge bg-surface-2 px-4 py-3 text-sm text-muted-foreground"
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={() => setShown(false)}
        aria-label={dismiss}
        className="shrink-0 text-muted-foreground hover:text-foreground"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
};

export default PlanPricing;
