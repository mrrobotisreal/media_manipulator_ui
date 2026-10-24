'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';

import { Segmented } from '@/components/darkroom/segmented';
import { Button } from '@/components/ui/button';
import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import type { BillingInterval } from '@/lib/auth/accountApi';
import {
  openPortal,
  readLastInterval,
  setPendingCheckout,
  startCheckout,
  takePendingCheckout,
  hasPendingCheckout,
} from '@/lib/billing/checkout';
import { useBillingFallback } from '@/lib/billing/useUpgradeAction';
import { useLocalization } from '@/i18n/useLocalization';
import { cn } from '@/lib/utils';

/**
 * The Premium column's price, interval toggle and call to action: the pricing page's third
 * client island (see pricing-tracker.tsx for why the page is otherwise a server component).
 *
 * All strings arrive as props from the server view so `pages.json` stays out of the client
 * bundle. Prices come from /api/tiers via the same props, never from literals here.
 *
 * CTA routing, by who is looking:
 *   anonymous -> sign-up modal (intent 'upgrade'); after sign-in, straight on to Checkout
 *   free      -> Checkout, then a full-page redirect to Stripe
 *   premium   -> "Manage subscription" -> the Stripe billing portal
 *   operator  -> text only (ADR-0005: the site's own people have nothing to buy)
 *   not purchasable -> disabled "not available yet"
 */

export interface PremiumPricingLabels {
  intervalLabel: string;
  monthly: string;
  yearly: string;
  /** Pre-formatted, e.g. "$8/mo" and "$80/yr". */
  priceMonthly: string;
  /** Empty when the API did not send a yearly price: the toggle is then hidden. */
  priceYearly: string;
  /** e.g. "2 months free"; empty when the yearly price is not a discount. */
  yearlyBonus: string;
  blurb: string;
  cancelAnytime: string;
  refund: string;
  taxNote: string;
  ctaUpgrade: string;
  ctaManage: string;
  ctaOperator: string;
  ctaUnavailable: string;
  ctaBusy: string;
}

export const PremiumPricing: React.FC<{
  labels: PremiumPricingLabels;
  purchasable: boolean;
}> = ({ labels, purchasable }) => {
  const auth = useAuth();
  const fallback = useBillingFallback();
  const { language } = useLocalization(['interface']);
  const [interval, setInterval] = React.useState<BillingInterval>('monthly');
  const [busy, setBusy] = React.useState(false);
  const continued = React.useRef(false);

  // The last-used interval is restored after mount, not during render, so SSR and the first
  // client render agree.
  React.useEffect(() => {
    setInterval(readLastInterval());
  }, []);

  const tier = auth?.tier ?? 'anonymous';
  const ready = !!auth && !auth.loading;
  const placement = 'pricing_premium';

  const checkout = React.useCallback(
    async (chosen: BillingInterval) => {
      setBusy(true);
      try {
        const outcome = await startCheckout(chosen, placement, language?.code);
        await fallback(outcome, placement);
      } finally {
        setBusy(false);
      }
    },
    [fallback, language?.code],
  );

  // Post-sign-in continuation: an anonymous visitor chose an interval, signed up, and lands
  // here a free account. takePendingCheckout() clears the marker as it reads it and the ref
  // guards StrictMode, so checkout_started cannot double-fire.
  React.useEffect(() => {
    if (!ready || !auth?.user || continued.current || !hasPendingCheckout()) return;
    continued.current = true;
    const pending = takePendingCheckout();
    if (!pending) return;
    setInterval(pending.interval);
    if (tier === 'free' && purchasable) void checkout(pending.interval);
  }, [ready, auth?.user, tier, purchasable, checkout]);

  const onToggle = (next: BillingInterval) => {
    setInterval(next);
  };

  const onCta = () => {
    if (!auth) return;
    if (tier === 'premium') {
      setBusy(true);
      void openPortal(placement, language?.code)
        .then((outcome) => fallback(outcome, placement))
        .finally(() => setBusy(false));
      return;
    }
    analytics.track(EVENTS.UPGRADE_CTA_CLICKED, {
      placement: 'pricing_page',
      cta_id: 'pricing_premium',
      from_tier: tier,
    });
    if (tier === 'anonymous') {
      setPendingCheckout(interval, placement);
      auth.openAuth({ intent: 'upgrade', source: placement });
      return;
    }
    void checkout(interval);
  };

  const yearly = interval === 'yearly';

  let cta: React.ReactNode;
  if (tier === 'operator') {
    cta = <p className="mt-1 text-sm text-data">{labels.ctaOperator}</p>;
  } else if (!purchasable && tier !== 'premium') {
    cta = (
      <Button className="mt-1 w-full" variant="outline" disabled>
        {labels.ctaUnavailable}
      </Button>
    );
  } else {
    cta = (
      <Button className="mt-1 w-full" onClick={onCta} disabled={!ready || busy}>
        {busy ? labels.ctaBusy : tier === 'premium' ? labels.ctaManage : labels.ctaUpgrade}
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2" data-testid="premium-pricing">
      {tier !== 'operator' && tier !== 'premium' && labels.priceYearly ? (
        <Segmented<BillingInterval>
          name="premium-interval"
          label={labels.intervalLabel}
          value={interval}
          onValueChange={onToggle}
          options={[
            { value: 'monthly', label: labels.monthly },
            { value: 'yearly', label: labels.yearly },
          ]}
          className="w-full max-w-[240px]"
        />
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
    </div>
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

export default PremiumPricing;
