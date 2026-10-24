'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { analytics, EVENTS } from '@/lib/analytics';
import type { BillingStatus, TiersResponse } from '@/lib/auth/accountApi';
import { openPortal } from '@/lib/billing/checkout';
import { useBillingFallback } from '@/lib/billing/useUpgradeAction';
import { useLocalization } from '@/i18n/useLocalization';

/**
 * "Switch to yearly: 2 months free" (MM33 decision 5), a dismissible card in Account > Billing.
 *
 * Shown only to an active monthly subscriber who has paid at least three consecutive periods,
 * a number the API must report as `periodsPaid` (feature-detected; absent today, so the card
 * stays hidden until the API sends it). Months free is computed from the two served prices,
 * exactly as the pricing page does it. No countdown, no deadline, one quiet dismiss.
 *
 * Dismissal is per user in localStorage (the API has no field for it), with try/catch.
 */
export const YEARLY_NUDGE_MIN_PERIODS = 3;
const DISMISS_PREFIX = 'mm.yearlyNudgeDismissed.';

/** Whole months the yearly price saves versus twelve monthly ones; 0 when it is no discount. */
export function monthsFree(tiers: TiersResponse | undefined): number {
  const monthly = tiers?.premiumPriceUSD;
  const yearly = tiers?.premiumPriceYearlyUSD;
  if (!monthly || monthly <= 0 || !yearly) return 0;
  return Math.max(0, Math.round(12 - yearly / monthly));
}

export function shouldShowYearlyNudge(input: {
  status: BillingStatus | undefined;
  tiers: TiersResponse | undefined;
  dismissed: boolean;
}): boolean {
  const s = input.status;
  if (!s || input.dismissed) return false;
  if (s.interval !== 'monthly' || s.status !== 'active' || s.cancelAtPeriodEnd || s.manualGrant) return false;
  if (!s.portalAvailable) return false;
  if (typeof s.periodsPaid !== 'number' || s.periodsPaid < YEARLY_NUDGE_MIN_PERIODS) return false;
  return monthsFree(input.tiers) >= 1;
}

function readDismissed(uid: string): boolean {
  try {
    return window.localStorage.getItem(DISMISS_PREFIX + uid) === '1';
  } catch {
    // Blocked storage: err toward silence.
    return true;
  }
}

function writeDismissed(uid: string): void {
  try {
    window.localStorage.setItem(DISMISS_PREFIX + uid, '1');
  } catch {
    /* nothing to do */
  }
}

export const YearlyNudge: React.FC<{
  uid: string | undefined;
  status: BillingStatus | undefined;
  tiers: TiersResponse | undefined;
}> = ({ uid, status, tiers }) => {
  const { t, language } = useLocalization(['interface']);
  const fallback = useBillingFallback();
  // Read after mount so SSR and the first client render agree.
  const [dismissed, setDismissed] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => {
    setDismissed(uid ? readDismissed(uid) : true);
  }, [uid]);

  const show = shouldShowYearlyNudge({ status, tiers, dismissed });
  const shown = React.useRef(false);
  React.useEffect(() => {
    if (!show || shown.current) return;
    shown.current = true;
    analytics.track(EVENTS.FEATURE_USED, { feature: 'yearly_nudge', action: 'shown' });
  }, [show]);

  if (!show || !uid) return null;

  const placement = 'yearly_nudge';
  const switchToYearly = () => {
    analytics.track(EVENTS.UPGRADE_CTA_CLICKED, { placement, from_tier: 'premium' });
    setBusy(true);
    // The Stripe portal is where a plan change happens; no new checkout is created.
    void openPortal(placement, language?.code)
      .then((outcome) => fallback(outcome, placement))
      .finally(() => setBusy(false));
  };
  const dismiss = () => {
    writeDismissed(uid);
    setDismissed(true);
  };

  return (
    <div
      className="grid gap-3 rounded-md border border-edge bg-surface-2 p-3 text-sm"
      data-testid="yearly-nudge"
    >
      <div>
        <p className="font-medium text-foreground">
          {t('interface:yearlyNudge.title', { months: monthsFree(tiers) })}
        </p>
        <p className="mt-1 text-muted-foreground">{t('interface:yearlyNudge.body')}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={switchToYearly} disabled={busy}>
          {t('interface:yearlyNudge.cta')}
        </Button>
        <Button size="sm" variant="ghost" onClick={dismiss}>
          {t('interface:yearlyNudge.dismiss')}
        </Button>
      </div>
    </div>
  );
};

export default YearlyNudge;
