'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';

import { Panel } from '@/components/darkroom/panel';
import { Segmented } from '@/components/darkroom/segmented';
import { Stat } from '@/components/darkroom/stat';
import { Button } from '@/components/ui/button';
import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import {
  fetchBillingStatus,
  fetchTiers,
  type BillingInterval,
  type BillingStatus,
} from '@/lib/auth/accountApi';
import { getCurrentIdToken } from '@/lib/firebase';
import { openPortal, readLastInterval, startCheckout } from '@/lib/billing/checkout';
import { useBillingFallback } from '@/lib/billing/useUpgradeAction';
import { useLocalization } from '@/i18n/useLocalization';

/**
 * The /account Billing panel (MM19 decision 4).
 *
 * One pure function, `billingState`, maps the server's status plus the account tier onto the
 * seven states the panel can show; the render is a switch over that. Everything comes from
 * GET /api/billing/status (a mirror of Stripe, no Stripe call) and the tier from the auth
 * context, so the panel cannot disagree with what the server will enforce.
 */

export type BillingPanelState =
  | 'operator'
  | 'manual_grant'
  | 'past_due'
  | 'cancel_at_period_end'
  | 'active'
  | 'free'
  | 'unavailable';

const PAST_DUE = new Set(['past_due', 'unpaid']);
const LIVE = new Set(['active', 'trialing', 'past_due', 'unpaid']);

export function billingState(tier: string, status: BillingStatus | undefined): BillingPanelState {
  if (tier === 'operator') return 'operator';
  if (!status) return 'unavailable';
  if (status.manualGrant) return 'manual_grant';
  if (status.status && PAST_DUE.has(status.status)) return 'past_due';
  if (status.status && LIVE.has(status.status)) {
    return status.cancelAtPeriodEnd ? 'cancel_at_period_end' : 'active';
  }
  return status.purchasable ? 'free' : 'unavailable';
}

export const BillingPanel: React.FC = () => {
  const auth = useAuth();
  const { t, formatDate, language } = useLocalization(['interface']);
  const fallback = useBillingFallback();
  const uid = auth?.user?.uid;
  const [interval, setInterval] = React.useState<BillingInterval>('monthly');
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    setInterval(readLastInterval());
  }, []);

  const statusQuery = useQuery({
    queryKey: ['billing-status', uid ?? 'none'],
    enabled: !!uid && auth?.tier !== 'operator',
    staleTime: 30_000,
    retry: 1,
    queryFn: async () => {
      const token = await getCurrentIdToken();
      if (!token) throw new Error('no token');
      return fetchBillingStatus(token);
    },
  });
  const tiersQuery = useQuery({
    queryKey: ['tiers'],
    queryFn: ({ signal }) => fetchTiers(signal),
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const tier = auth?.tier ?? 'anonymous';
  const status = statusQuery.data;
  const state: BillingPanelState | 'loading' | 'error' =
    tier === 'operator'
      ? 'operator'
      : statusQuery.isPending
        ? 'loading'
        : statusQuery.isError
          ? 'error'
          : billingState(tier, status);

  // Once per mount, and only for a resolved state: the loading skeleton is not a status.
  const viewed = React.useRef(false);
  React.useEffect(() => {
    if (viewed.current || state === 'loading' || state === 'error') return;
    viewed.current = true;
    analytics.track(EVENTS.SUBSCRIPTION_STATUS_VIEWED, {
      status: state,
      interval: status?.interval ?? 'none',
    });
  }, [state, status?.interval]);

  const placement = 'account_billing';
  const manage = () => {
    setBusy(true);
    void openPortal(placement, language?.code)
      .then((outcome) => fallback(outcome, placement))
      .finally(() => setBusy(false));
  };
  const upgrade = () => {
    setBusy(true);
    void startCheckout(interval, placement, language?.code)
      .then((outcome) => fallback(outcome, placement))
      .finally(() => setBusy(false));
  };

  const date = (iso: string | null | undefined) => (iso ? formatDate(iso) : '');
  const intervalName = (value: string | null | undefined) =>
    value === 'yearly' ? t('interface:billing.yearly') : value === 'monthly' ? t('interface:billing.monthly') : '—';

  const monthly = tiersQuery.data?.premiumPriceUSD;
  const yearly = tiersQuery.data?.premiumPriceYearlyUSD;

  let body: React.ReactNode;
  switch (state) {
    case 'loading':
      body = (
        <p className="text-sm text-muted-foreground" role="status">
          {t('interface:billing.panel.loading')}
        </p>
      );
      break;
    case 'error':
      body = <p className="text-sm text-muted-foreground">{t('interface:billing.panel.loadFailed')}</p>;
      break;
    case 'operator':
      body = <p className="text-sm text-data">{t('interface:billing.panel.operator')}</p>;
      break;
    case 'unavailable':
      body = <p className="text-sm text-muted-foreground">{t('interface:billing.panel.unavailable')}</p>;
      break;
    case 'manual_grant':
      // No Stripe controls and no Upgrade: the team granted this; Checkout would 409.
      body = (
        <p className="text-sm text-foreground">
          {status?.manualGrant?.expiresAt
            ? t('interface:billing.panel.grantUntil', { date: date(status.manualGrant.expiresAt) })
            : t('interface:billing.panel.grantOpen')}
        </p>
      );
      break;
    case 'free':
      body = (
        <div className="grid gap-4">
          <p className="text-sm text-muted-foreground">{t('interface:billing.panel.freeBody')}</p>
          {typeof yearly === 'number' ? (
            <Segmented<BillingInterval>
              name="billing-panel-interval"
              label={t('interface:billing.intervalLabel')}
              value={interval}
              onValueChange={setInterval}
              options={[
                { value: 'monthly', label: t('interface:billing.monthly') },
                { value: 'yearly', label: t('interface:billing.yearly') },
              ]}
              className="max-w-[240px]"
            />
          ) : null}
          {typeof monthly === 'number' ? (
            <p className="num text-lg text-foreground">
              {interval === 'yearly' && typeof yearly === 'number'
                ? `$${yearly}${t('interface:billing.perYear')}`
                : `$${monthly}${t('interface:billing.perMonth')}`}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">{t('interface:billing.refund')}</p>
          <Button className="w-fit" onClick={upgrade} disabled={busy}>
            {t('interface:billing.panel.upgrade')}
          </Button>
        </div>
      );
      break;
    default: {
      // active | cancel_at_period_end | past_due: all have a subscription and a Portal.
      const ending = state === 'cancel_at_period_end';
      body = (
        <div className="grid gap-4">
          {state === 'past_due' ? (
            <div
              role="alert"
              className="rounded-md border border-premium/40 bg-surface-2 p-3 text-sm text-foreground"
            >
              <p className="font-medium">{t('interface:billing.panel.pastDueTitle')}</p>
              <p className="mt-1 text-muted-foreground">{t('interface:billing.panel.pastDueBody')}</p>
            </div>
          ) : null}
          <div className="grid gap-3">
            <Stat
              orientation="inline"
              label={t('interface:billing.panel.intervalLabel')}
              value={intervalName(status?.interval)}
            />
            {status?.renewsAt ? (
              <Stat
                orientation="inline"
                label={
                  ending
                    ? t('interface:billing.panel.endsLabel')
                    : t('interface:billing.panel.renewsLabel')
                }
                value={date(status.renewsAt)}
              />
            ) : null}
          </div>
          {ending ? (
            <p className="text-sm text-muted-foreground">
              {t('interface:billing.panel.endsOn', { date: date(status?.renewsAt) })}{' '}
              {t('interface:billing.panel.resumeHint')}
            </p>
          ) : state === 'active' && status?.renewsAt ? (
            <p className="text-sm text-muted-foreground">
              {t('interface:billing.panel.renewsOn', { date: date(status.renewsAt) })}
            </p>
          ) : null}
          {status?.portalAvailable ? (
            <Button className="w-fit" onClick={manage} disabled={busy}>
              {state === 'past_due'
                ? t('interface:billing.panel.updatePayment')
                : t('interface:billing.manage')}
            </Button>
          ) : null}
        </div>
      );
    }
  }

  return (
    <Panel title={t('interface:billing.panel.title')} titleAs="h2" data-testid="billing-panel" data-state={state}>
      {body}
    </Panel>
  );
};

export default BillingPanel;
