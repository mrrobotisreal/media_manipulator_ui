'use client';

import * as React from 'react';

import { Panel } from '@/components/darkroom/panel';
import { Button } from '@/components/ui/button';
import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import {
  isBillingCurrency,
  isPaidPlan,
  isPaidTier,
  fetchAccount,
  fetchBillingStatus,
  verifyCheckoutSession,
  type BillingInterval,
  type PaidPlan,
} from '@/lib/auth/accountApi';
import { getCurrentIdToken } from '@/lib/firebase';
import { isBillingInterval, readLastInterval } from '@/lib/billing/checkout';
import { readStoredCurrency } from '@/lib/billing/currency';
import { useLocalization } from '@/i18n/useLocalization';

/**
 * `/account?checkout=success&session_id=cs_...`: Stripe's success URL.
 *
 * The redirect proves nothing by itself, so: (1) ask the API whether the session is ours,
 * (2) poll /account/me until the webhook has flipped the tier, (3) confirm. The webhook can
 * lag the redirect by seconds, so after POLL_LIMIT_MS the page stops polling and says the
 * payment was received and the plan will update shortly, with a manual refresh.
 *
 * MM40: the success URL may carry `plan` (`?checkout=success&plan=pro`); when it does not (the
 * API's success URL today has only session_id), the plan comes from the session verdict's
 * `plan`, then from the account tier, so a Pro purchase lands on Pro copy either way.
 */

export const POLL_INTERVAL_MS = 2_000;
export const POLL_LIMIT_MS = 20_000;

type Phase = 'verifying' | 'waiting' | 'confirmed' | 'shortly' | 'foreign' | 'failed';

export const CheckoutReturn: React.FC = () => {
  const auth = useAuth();
  const { t } = useLocalization(['interface']);
  const [phase, setPhase] = React.useState<Phase | null>(null);
  // Read once, at mount. window rather than useSearchParams: the account page is static, and
  // useSearchParams would force a Suspense boundary around the whole dashboard.
  const [sessionId] = React.useState(() => {
    if (typeof window === 'undefined') return null;
    const p = new URLSearchParams(window.location.search);
    return p.get('checkout') === 'success' ? p.get('session_id') : null;
  });
  const [plan, setPlan] = React.useState<PaidPlan | null>(() => {
    if (typeof window === 'undefined') return null;
    const value = new URLSearchParams(window.location.search).get('plan');
    return isPaidPlan(value) ? value : null;
  });
  const planRef = React.useRef(plan);
  const notePlan = React.useCallback((next: unknown) => {
    if (planRef.current || !isPaidPlan(next)) return;
    planRef.current = next;
    setPlan(next);
  }, []);
  const started = React.useRef(false);
  const completed = React.useRef(false);
  const refresh = auth?.refresh;
  const signedIn = !!auth?.user;
  const authLoading = auth?.loading ?? true;

  // Drop checkout/session_id but keep the browser path and any ?tab= (pathname
  // from usePathname is the internal /en rewrite; navigating to it 308s).
  const strip = React.useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    params.delete('checkout');
    params.delete('session_id');
    params.delete('plan');
    const query = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
  }, []);

  const complete = React.useCallback(async () => {
    if (completed.current) return;
    completed.current = true;
    let interval: BillingInterval = readLastInterval();
    // MM69: the subscription's currency once the API reports it, else the pick the visitor
    // checked out with (the cookie survives the Stripe round trip).
    let currency = readStoredCurrency() ?? 'usd';
    try {
      const token = await getCurrentIdToken();
      const status = token ? await fetchBillingStatus(token) : null;
      if (status && isBillingInterval(status.interval)) interval = status.interval;
      if (isBillingCurrency(status?.currency)) currency = status.currency;
      notePlan(status?.plan);
    } catch {
      /* the remembered interval is a fine fallback for a lossy client event */
    }
    analytics.track(EVENTS.CHECKOUT_COMPLETED, { interval, plan: planRef.current ?? 'premium', currency });
    refresh?.();
    setPhase('confirmed');
    strip();
  }, [notePlan, refresh, strip]);

  const poll = React.useCallback(
    async (isCancelled: () => boolean) => {
      setPhase('waiting');
      const deadline = Date.now() + POLL_LIMIT_MS;
      for (;;) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
        if (isCancelled()) return;
        try {
          const token = await getCurrentIdToken();
          const tier = token ? (await fetchAccount(token)).tier : null;
          if (tier && isPaidTier(tier)) {
            notePlan(tier);
            await complete();
            return;
          }
        } catch {
          /* a failed poll is just a poll that found nothing yet */
        }
        if (Date.now() >= deadline) {
          setPhase('shortly');
          strip();
          return;
        }
      }
    },
    [complete, notePlan, strip],
  );

  React.useEffect(() => {
    if (!sessionId || started.current || authLoading || !signedIn) return;
    started.current = true;
    let cancelled = false;
    setPhase('verifying');
    void (async () => {
      try {
        const token = await getCurrentIdToken();
        if (!token) throw new Error('no token');
        const verdict = await verifyCheckoutSession(token, sessionId);
        if (cancelled) return;
        notePlan(verdict.plan);
        if (!verdict.belongsToUser) {
          setPhase('foreign');
          strip();
          return;
        }
        if (verdict.tierApplied) {
          await complete();
          return;
        }
        await poll(() => cancelled);
      } catch {
        if (!cancelled) {
          setPhase('failed');
          strip();
        }
      }
    })();
    return () => {
      cancelled = true;
      // StrictMode re-runs the effect: allow the second pass to start the work again.
      started.current = false;
    };
  }, [authLoading, complete, notePlan, poll, sessionId, signedIn, strip]);

  if (!sessionId || !phase) return null;

  const manualRefresh = () => {
    started.current = false;
    completed.current = false;
    setPhase('verifying');
    refresh?.();
    void (async () => {
      try {
        const token = await getCurrentIdToken();
        const tier = token ? (await fetchAccount(token)).tier : null;
        if (tier && isPaidTier(tier)) {
          notePlan(tier);
          await complete();
          return;
        }
      } catch {
        /* fall through */
      }
      setPhase('shortly');
    })();
  };

  const key =
    phase === 'verifying' || phase === 'waiting'
      ? 'waiting'
      : phase === 'confirmed' && plan === 'pro'
        ? 'confirmedPro'
        : phase;
  return (
    <Panel
      className="mb-6"
      accent={phase === 'confirmed' ? 'premium' : undefined}
      role="status"
      data-testid="checkout-return"
      data-phase={phase}
      data-plan={plan ?? undefined}
    >
      <h2 className="text-base font-semibold text-foreground">
        {t(`interface:billing.return.${key}.title`)}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t(`interface:billing.return.${key}.body`)}
      </p>
      {phase === 'shortly' ? (
        <Button className="mt-4" variant="outline" onClick={manualRefresh}>
          {t('interface:billing.return.refresh')}
        </Button>
      ) : null}
    </Panel>
  );
};

export default CheckoutReturn;
