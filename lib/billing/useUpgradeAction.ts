'use client';

// One hook behind every upgrade surface (file-limit hint, post-download nudge, quota meter,
// auth-modal plan card, the interstitial). Routing by state:
//   anonymous      -> the signup modal
//   free           -> Stripe Checkout with the last-used interval (when Premium is purchasable)
//   premium/operator -> nothing to sell; `visible` is false and `run` is a no-op

import * as React from 'react';
import { toast } from 'sonner';

import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import { fetchTiers, isTopTier, type BillingInterval } from '@/lib/auth/accountApi';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { openPortal, readLastInterval, startCheckout, type BillingOutcome } from './checkout';

// One shared /api/tiers fetch for every surface that asks. Deliberately NOT react-query: the
// upgrade hint renders inside the chromeless /embed and /dr trees, which mount no
// QueryClientProvider, and useQuery would throw there.
let purchasableCache: Promise<boolean> | null = null;

function loadPurchasable(): Promise<boolean> {
  if (!purchasableCache) {
    purchasableCache = fetchTiers()
      .then((data) => data.premiumPurchasable === true)
      .catch(() => {
        purchasableCache = null;
        return false;
      });
  }
  return purchasableCache;
}

/** Test seam: forget the cached /api/tiers verdict. */
export function resetPurchasableCacheForTests(): void {
  purchasableCache = null;
}

/** Whether Premium can be bought right now; undefined until known. */
export function usePremiumPurchasable(enabled = true): boolean | undefined {
  const [value, setValue] = React.useState<boolean | undefined>(undefined);
  React.useEffect(() => {
    if (!enabled) return;
    let live = true;
    void loadPurchasable().then((v) => {
      if (live) setValue(v);
    });
    return () => {
      live = false;
    };
  }, [enabled]);
  return value;
}

/**
 * Turns a refused checkout into the right next step instead of a dead end.
 * Returns after surfacing a toast or navigating; never throws.
 */
export function useBillingFallback() {
  const localized = useLocalizedHref();
  const { t, language } = useLocalization(['interface']);

  return React.useCallback(
    async (outcome: BillingOutcome, placement: string): Promise<void> => {
      if (outcome.ok) return;
      switch (outcome.reason) {
        case 'already_subscribed':
          if (outcome.refusal?.portalAvailable) {
            const portal = await openPortal(placement, language?.code);
            if (portal.ok) return;
          }
          // A full navigation, not router.push: this hook also runs in trees without an app router.
          window.location.assign(localized('/account'));
          return;
        case 'manual_grant_active':
        case 'no_billing_account':
          // A full navigation, not router.push: this hook also runs in trees without an app router.
          window.location.assign(localized('/account'));
          return;
        case 'billing_unavailable':
          toast(t('interface:billing.errors.unavailable'));
          return;
        case 'operator_account':
          toast(t('interface:billing.errors.operator'));
          return;
        default:
          toast.error(t('interface:billing.errors.generic'));
      }
    },
    [language?.code, localized, t],
  );
}

export interface UpgradeAction {
  /** False for premium/operator, and for free users while Premium is not purchasable. */
  visible: boolean;
  busy: boolean;
  /** Fires `upgrade_cta_clicked`, then routes by state. */
  run: () => void;
}

export function useUpgradeAction(placement: string, interval?: BillingInterval): UpgradeAction {
  const auth = useAuth();
  const { language } = useLocalization(['interface']);
  const fallback = useBillingFallback();
  const [busy, setBusy] = React.useState(false);
  const tier = auth?.tier ?? 'anonymous';
  const purchasable = usePremiumPurchasable(tier === 'free');

  const top = isTopTier(tier);
  const visible = !!auth && !top && (tier !== 'free' || purchasable === true);

  const run = React.useCallback(() => {
    if (!auth || isTopTier(auth.tier)) return;
    // Same props as the per-surface calls this replaced.
    analytics.track(EVENTS.UPGRADE_CTA_CLICKED, { placement, from_tier: auth.tier });
    if (auth.tier !== 'free') {
      auth.openAuth({ intent: 'signup', source: placement });
      return;
    }
    setBusy(true);
    void startCheckout(interval ?? readLastInterval(), placement, language?.code)
      .then((outcome) => fallback(outcome, placement))
      .finally(() => setBusy(false));
  }, [auth, fallback, interval, language?.code, placement]);

  return { visible, busy, run };
}
