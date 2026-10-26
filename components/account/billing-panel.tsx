'use client';

import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Panel } from '@/components/darkroom/panel';
import { Segmented } from '@/components/darkroom/segmented';
import { Stat } from '@/components/darkroom/stat';
import { Button } from '@/components/ui/button';
import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import {
  endsAtOf,
  fetchTiers,
  retainSubscription,
  type BillingCurrency,
  type BillingInterval,
  type BillingStatus,
  type RetentionOffer,
} from '@/lib/auth/accountApi';
import { getCurrentIdToken } from '@/lib/firebase';
import { billingStatusKey, useBillingStatus } from '@/lib/billing/useBillingStatus';
import { openPortal, readLastInterval, startCheckout } from '@/lib/billing/checkout';
import { useBillingFallback } from '@/lib/billing/useUpgradeAction';
import { useLocalization } from '@/i18n/useLocalization';
import { YearlyNudge } from './yearly-nudge';
import { PlanChangeDialog } from './plan-change-dialog';
import { isIrreversibleActionHidden } from '@/lib/translator/mode';
import { formatPrice, planPrices } from '@/lib/billing/price';
import { useCurrency, useCurrencyLockFrom } from '@/lib/billing/useCurrency';
import { CurrencyToggle } from '@/components/pricing/currency-toggle';
import { usePlanChange } from '@/lib/billing/usePlanChange';
import type { PaidPlan } from '@/lib/auth/accountApi';

/**
 * The /account Billing panel (MM19 decision 4; Premium and Pro since MM40).
 *
 * Plan changes (MM40 decision 4): an active Premium subscription can upgrade to Pro (confirm,
 * then POST change-plan); an active Pro one can switch to Premium at the end of the paid
 * period; once that is scheduled the panel says "Premium from <date>" with "Keep Pro" (DELETE
 * change-plan). A cancelling Pro subscription never sees the Premium retention offer; it gets
 * "Drop to Premium and keep going" instead, which routes through the Portal because the API
 * refuses a plan change on a cancelling subscription.
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

/** The panel copy key for this plan: Pro has its own wording where Premium is named. */
const PRO_KEYS = new Set(['endsLabel', 'cancelledTitle', 'cancelledBody', 'cancelledBodyNoDate', 'pastDueBody', 'grantUntil', 'grantOpen']);
function panelKey(plan: PaidPlan, key: string): string {
  return plan === 'pro' && PRO_KEYS.has(key) ? `interface:billing.panel.pro.${key}` : `interface:billing.panel.${key}`;
}

const RetentionOfferCard: React.FC<{
  offer: RetentionOffer;
  currentPrice: number | null | undefined;
  fallbackPrice: number | undefined;
  interval: string | null | undefined;
  busy: boolean;
  onAccept: (kind: RetentionOffer['kind']) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  date: (iso: string | null | undefined) => string;
  /** Formats a numeral in the subscription's currency (MM69). */
  money: (amount: number) => string;
}> = ({ offer, currentPrice, fallbackPrice, interval, busy, onAccept, t, date, money }) => {
  const discounted = offer.kind !== 'resume';
  // What the subscriber pays now: the API's offer price for "resume" is exactly that (read
  // from the Stripe subscription), else the status's current price.
  const offerPrice = offer.price ?? offer.priceUSD;
  const currentRaw = discounted ? (currentPrice ?? fallbackPrice) : (offerPrice ?? currentPrice ?? fallbackPrice);
  const unit = t(interval === 'yearly' ? 'interface:billing.offer.unitYear' : 'interface:billing.offer.unitMonth');
  const hasCurrent = typeof currentRaw === 'number';
  const current = hasCurrent ? money(currentRaw) : '';
  const price = money(offerPrice);
  const keepAt = currentPrice ?? fallbackPrice;
  return (
    <section
      aria-labelledby="retention-offer-title"
      data-testid="retention-offer"
      data-offer={offer.kind}
      className="grid gap-3 rounded-md border border-premium/40 bg-surface-2 p-4"
    >
      {discounted ? (
        <h3 id="retention-offer-title" className="text-base font-semibold text-foreground">
          {t('interface:billing.offer.title', { price })}
        </h3>
      ) : (
        <h3 id="retention-offer-title" className="text-base font-semibold text-foreground">
          {t('interface:billing.offer.resumeTitle')}
        </h3>
      )}
      {!discounted && hasCurrent ? (
        <p className="text-sm text-foreground">
          {t('interface:billing.offer.resumePrice', { price: current, unit })}
        </p>
      ) : null}
      <p className="text-xs text-muted-foreground">
        {discounted
          ? hasCurrent
            ? t('interface:billing.offer.fineprint', { date: date(offer.nextChargeAt), price, current })
            : t('interface:billing.offer.fineprintNoCurrent', { date: date(offer.nextChargeAt), price })
          : t('interface:billing.offer.resumeFineprint', { date: date(offer.nextChargeAt) })}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button
          className="w-fit"
          onClick={() => onAccept(offer.kind)}
          disabled={busy}
          aria-busy={busy}
        >
          {busy
            ? t('interface:billing.offer.working')
            : discounted
              ? t('interface:billing.offer.cta', { price })
              : hasCurrent
                ? t('interface:billing.offer.resumeCta', { price: current, unit })
                : t('interface:billing.offer.resumeCtaNoPrice')}
        </Button>
        {discounted ? (
          <button
            type="button"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-50"
            onClick={() => onAccept('resume')}
            disabled={busy}
          >
            {typeof keepAt === 'number'
              ? t('interface:billing.offer.keepAtCurrent', { price: money(keepAt) })
              : t('interface:billing.offer.keepAtCurrentNoPrice')}
          </button>
        ) : null}
      </div>
    </section>
  );
};

export const BillingPanel: React.FC = () => {
  const auth = useAuth();
  const { t, formatDate, language } = useLocalization(['interface']);
  const fallback = useBillingFallback();
  const uid = auth?.user?.uid;
  const [interval, setInterval] = React.useState<BillingInterval>('monthly');
  const [busy, setBusy] = React.useState(false);
  const queryClient = useQueryClient();
  const [retaining, setRetaining] = React.useState(false);
  const retainingRef = React.useRef(false);
  const viewedOffers = React.useRef(new Set<string>());
  const planChange = usePlanChange();
  const [confirming, setConfirming] = React.useState<'pro' | 'premium' | null>(null);

  React.useEffect(() => {
    setInterval(readLastInterval());
  }, []);

  const statusQuery = useBillingStatus();
  // MM69: the subscription's currency locks the page's; the free state's toggle picks it.
  useCurrencyLockFrom(statusQuery.data);
  const picked = useCurrency();
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
  // MM52 (design §2.15): no Checkout, portal or plan change on translator deployments.
  const hideBilling = isIrreversibleActionHidden();
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

  // The subscription's plan (MM39 status.plan); a team grant has none, so the tier says.
  const plan: PaidPlan = status?.plan ?? (tier === 'pro' ? 'pro' : 'premium');
  // MM69: a subscriber's prices are in the subscription's currency; a free account's in the
  // visitor's pick. Never both added together.
  const currency: BillingCurrency = status?.currency ?? picked.currency;
  const money = (amount: number) => formatPrice(amount, currency, language?.code);
  const { monthly, yearly } = planPrices(tiersQuery.data, 'premium', currency);
  // What the subscriber pays per interval in that currency (older APIs: USD only).
  const currentPrice = status?.priceMonthly ?? status?.priceMonthlyUSD;
  const pk = (key: string) => panelKey(plan, key);
  const pending = status?.pendingPlan ?? null;

  const endsAt = endsAtOf(status);
  // The retention offer is Premium-only (MM39): never rendered for Pro, whatever arrives.
  const offer: RetentionOffer | null =
    state === 'cancel_at_period_end' && status?.offer && plan !== 'pro' ? status.offer : null;
  const offerKind = offer?.kind;
  React.useEffect(() => {
    if (!offerKind || viewedOffers.current.has(offerKind)) return;
    viewedOffers.current.add(offerKind);
    analytics.track(EVENTS.RETENTION_OFFER_VIEWED, { offer: offerKind });
  }, [offerKind]);

  const setStatus = (next: BillingStatus) => queryClient.setQueryData(billingStatusKey(uid), next);
  const accept = async (kind: RetentionOffer['kind']) => {
    if (retainingRef.current) return;
    retainingRef.current = true;
    setRetaining(true);
    try {
      const token = await getCurrentIdToken();
      if (!token) {
        toast.error(t('interface:billing.offer.failed'));
        return;
      }
      const result = await retainSubscription(token, kind);
      if (result.ok) {
        analytics.track(EVENTS.RETENTION_OFFER_ACCEPTED, { offer: kind });
        setStatus(result.status);
        const next = result.status.renewsAt;
        const price = result.status.priceMonthly ?? result.status.priceMonthlyUSD;
        toast.success(
          next && typeof price === 'number'
            ? t('interface:billing.offer.renewed', { date: date(next), price: formatPrice(price, result.status.currency ?? currency, language?.code) })
            : next
              ? t('interface:billing.offer.renewedNoPrice', { date: date(next) })
              : t('interface:billing.offer.renewedBare'),
        );
      } else if (result.reason === 'offer_changed') {
        if (status) setStatus({ ...status, offer: result.offer ?? null });
        else void statusQuery.refetch();
        toast(t('interface:billing.offer.changed'));
      } else if (result.reason === 'not_cancelled') {
        await statusQuery.refetch();
      } else {
        toast.error(t('interface:billing.offer.failed'));
      }
    } catch {
      toast.error(t('interface:billing.offer.failed'));
    } finally {
      retainingRef.current = false;
      setRetaining(false);
    }
  };

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
            ? t(pk('grantUntil'), { date: date(status.manualGrant.expiresAt) })
            : t(pk('grantOpen'))}
        </p>
      );
      break;
    case 'free':
      body = (
        <div className="grid gap-4">
          <p className="text-sm text-muted-foreground">{t('interface:billing.panel.freeBody')}</p>
          <div className="flex flex-wrap items-center gap-3">
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
            {hideBilling ? null : <CurrencyToggle placement="billing_panel" />}
          </div>
          {typeof monthly === 'number' ? (
            <p className="num text-lg text-foreground" data-testid="billing-panel-price" data-currency={currency}>
              {interval === 'yearly' && typeof yearly === 'number'
                ? `${money(yearly)}${t('interface:billing.perYear')}`
                : `${money(monthly)}${t('interface:billing.perMonth')}`}
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">{t('interface:billing.refund')}</p>
          {hideBilling ? null : (
            <Button className="w-fit" onClick={upgrade} disabled={busy}>
              {t('interface:billing.panel.upgrade')}
            </Button>
          )}
        </div>
      );
      break;
    default: {
      // active | cancel_at_period_end | past_due: all have a subscription and a Portal.
      const ending = state === 'cancel_at_period_end';
      const active = state === 'active';
      const proPurchasable = tiersQuery.data?.proPurchasable === true;
      // Plan changes need an active, uncancelled subscription the API knows the plan of.
      const canChange = active && !hideBilling && status?.plan != null;
      const showUpgrade = canChange && plan === 'premium' && proPurchasable;
      const showDowngrade = canChange && plan === 'pro' && !pending;
      const showKeep = active && !hideBilling && plan === 'pro' && pending?.to === 'premium';
      body = (
        <div className="grid gap-4">
          {state === 'past_due' ? (
            <div
              role="alert"
              className="rounded-md border border-premium/40 bg-surface-2 p-3 text-sm text-foreground"
            >
              <p className="font-medium">{t('interface:billing.panel.pastDueTitle')}</p>
              <p className="mt-1 text-muted-foreground">{t(pk('pastDueBody'))}</p>
            </div>
          ) : null}
          <div className="grid gap-3">
            <Stat
              orientation="inline"
              label={t('interface:billing.panel.planLabel')}
              value={
                <span data-testid="billing-plan-chip" data-plan={plan} className="text-premium">
                  {t(`interface:accountMenu.tier.${plan}`)}
                </span>
              }
            />
            <Stat
              orientation="inline"
              label={t('interface:billing.panel.intervalLabel')}
              value={intervalName(status?.interval)}
            />
            {status?.currency ? (
              <Stat
                orientation="inline"
                label={t('interface:billing.currency.panelLabel')}
                value={<CurrencyToggle placement="billing_panel" />}
              />
            ) : null}
            {ending ? (
              endsAt ? (
                <Stat
                  orientation="inline"
                  label={t(pk('endsLabel'))}
                  value={date(endsAt)}
                />
              ) : null
            ) : status?.renewsAt ? (
              <Stat
                orientation="inline"
                label={t('interface:billing.panel.renewsLabel')}
                value={date(status.renewsAt)}
              />
            ) : null}
          </div>
          {ending ? (
            <div className="grid gap-1">
              <p className="text-sm font-medium text-foreground">{t(pk('cancelledTitle'))}</p>
              <p className="text-sm text-muted-foreground">
                {endsAt
                  ? t(pk('cancelledBody'), { date: date(endsAt) })
                  : t(pk('cancelledBodyNoDate'))}
                {offer || plan === 'pro' ? null : <> {t('interface:billing.panel.resumeHint')}</>}
              </p>
            </div>
          ) : state === 'active' && status?.renewsAt && !pending ? (
            <p className="text-sm text-muted-foreground">
              {t('interface:billing.panel.renewsOn', { date: date(status.renewsAt) })}
            </p>
          ) : null}
          {showKeep && pending ? (
            <div className="grid gap-3 rounded-md border border-edge bg-surface-2 p-3" data-testid="pending-downgrade">
              <p className="text-sm text-foreground">
                {t('interface:billing.planChange.pendingBody', { date: date(pending.at) })}
              </p>
              <Button
                className="w-fit"
                onClick={() => void planChange.run('keep')}
                disabled={planChange.busy}
                aria-busy={planChange.busy}
              >
                {planChange.busy ? t('interface:billing.offer.working') : t('interface:billing.planChange.keepPro')}
              </Button>
            </div>
          ) : null}
          {ending && plan === 'pro' && !hideBilling ? (
            // MM39: no discount for Pro. Change-plan refuses a cancelling subscription, so the
            // way to "drop to Premium and keep going" is to resume in the Portal, then switch.
            <section className="grid gap-2 rounded-md border border-premium/40 bg-surface-2 p-4" data-testid="pro-drop-to-premium">
              <h3 className="text-base font-semibold text-foreground">{t('interface:billing.planChange.dropTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('interface:billing.planChange.dropBody')}</p>
              {status?.portalAvailable ? (
                <Button className="w-fit" onClick={manage} disabled={busy}>
                  {t('interface:billing.planChange.dropCta')}
                </Button>
              ) : null}
            </section>
          ) : null}
          {offer && !hideBilling ? (
            <RetentionOfferCard
              offer={offer}
              currentPrice={currentPrice}
              fallbackPrice={status?.interval === 'yearly' ? yearly : monthly}
              interval={status?.interval}
              busy={retaining}
              onAccept={accept}
              t={t}
              date={date}
              money={money}
            />
          ) : null}
          {state === 'active' && !hideBilling ? (
            <YearlyNudge uid={uid} status={status} tiers={tiersQuery.data} currency={currency} />
          ) : null}
          <div className="flex flex-wrap gap-2">
            {showUpgrade ? (
              <Button className="w-fit" onClick={() => setConfirming('pro')} disabled={planChange.busy}>
                {t('interface:billing.upgradePro')}
              </Button>
            ) : null}
            {status?.portalAvailable && !hideBilling ? (
              <Button className="w-fit" variant={showUpgrade ? 'outline' : 'default'} onClick={manage} disabled={busy}>
                {state === 'past_due'
                  ? t('interface:billing.panel.updatePayment')
                  : t('interface:billing.manage')}
              </Button>
            ) : null}
            {showDowngrade ? (
              <Button className="w-fit" variant="ghost" onClick={() => setConfirming('premium')} disabled={planChange.busy}>
                {t('interface:billing.switchToPremium')}
              </Button>
            ) : null}
          </div>
          {showUpgrade || showDowngrade ? (
            <PlanChangeDialog
              open={confirming !== null}
              onOpenChange={(open) => !open && setConfirming(null)}
              target={confirming ?? 'pro'}
              interval={status?.interval}
              price={(() => {
                const p = planPrices(tiersQuery.data, confirming ?? 'pro', currency);
                return status?.interval === 'yearly' ? p.yearly : status?.interval === 'monthly' ? p.monthly : undefined;
              })()}
              currency={currency}
              periodEnd={status?.renewsAt}
              busy={planChange.busy}
              onConfirm={() =>
                void planChange.run(confirming === 'premium' ? 'downgrade' : 'upgrade').then((outcome) => {
                  if (outcome) setConfirming(null);
                })
              }
            />
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
