'use client';

import Link from 'next/link';
import * as React from 'react';

import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';

/**
 * The pricing page's two client islands.
 *
 * THE BUNDLE TRADE-OFF, STATED. `views/pricing.tsx` is a deliberate zero-JS React Server
 * Component: every limit is fetched at build/revalidate time so a crawler reads the real
 * matrix and the browser downloads nothing extra. That is a property worth protecting, and
 * it is also why `pricing_viewed` — a priority-1 monetization event — had no producer at
 * all: there was no client code on the page to emit it.
 *
 * These two components are the smallest possible exception. No state, no data fetching, no
 * effects beyond one mount-time emission; the only real dependency either adds is `useAuth`,
 * which is already in the shared layout chunk for the nav's quota meter. The page stays a
 * server component, the matrix stays in the prerendered HTML, and the cost is a few hundred
 * bytes on the one route where knowing that someone looked is worth more than that.
 *
 * The alternative — inferring pricing views from `page_view` + pathname — sounds free and
 * is not: it cannot carry `placement`, so a pricing view from the nav and a pricing surface
 * shown inside the account panel would be indistinguishable the moment the second one
 * exists.
 */

/**
 * Emits `pricing_viewed` once on mount.
 *
 * Rendered by the pricing view; produces no DOM. StrictMode double-invokes effects in
 * development, which is why the ref guard is here rather than trusting the empty dep list.
 */
export const PricingTracker: React.FC<{ placement?: string }> = ({
  placement = 'pricing_page',
}) => {
  const emitted = React.useRef(false);
  React.useEffect(() => {
    if (emitted.current) return;
    emitted.current = true;
    analytics.track(EVENTS.PRICING_VIEWED, { placement });
  }, [placement]);
  return null;
};

/**
 * A pricing-page CTA that reports the click before navigating.
 *
 * `upgrade_cta_clicked` is priority 0 — the strongest purchase-intent signal that exists
 * before there is a checkout flow to measure. From the pricing page specifically it is the
 * clearest one available: this visitor read the comparison and then acted on it.
 *
 * The event fires in the click handler rather than on the destination page, and that is
 * deliberate: the destination cannot know which surface sent the visitor, and priority-0
 * events flush immediately, so the navigation does not race the delivery.
 */
export const PricingUpgradeLink: React.FC<{
  href: string;
  ctaId: string;
  className?: string;
  children: React.ReactNode;
}> = ({ href, ctaId, className, children }) => {
  const auth = useAuth();
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        analytics.track(EVENTS.UPGRADE_CTA_CLICKED, {
          placement: 'pricing_page',
          cta_id: ctaId,
          // Nullable auth: this page renders inside the normal layout, so there is
          // normally a provider, but reading through `?.` keeps the CTA working rather
          // than throwing if it is ever rendered outside one.
          from_tier: auth?.tier,
        });
      }}
    >
      {children}
    </Link>
  );
};
