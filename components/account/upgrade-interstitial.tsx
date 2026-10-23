'use client';

import * as React from 'react';

import { Segmented } from '@/components/darkroom/segmented';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import type { BillingInterval, LimitRefusal, QuotaExceeded } from '@/lib/auth/accountApi';
import { readLastInterval, startCheckout } from '@/lib/billing/checkout';
import { useBillingFallback, usePremiumPurchasable } from '@/lib/billing/useUpgradeAction';
import { useLocalization } from '@/i18n/useLocalization';

/**
 * The shared "you hit a plan limit" dialog for the 429 `quota_exceeded` (free account on its
 * daily cap) and the 403 `project_limit_reached` / `output_height_limited` bodies.
 *
 * `upgradePath` is the server's call and is never guessed here:
 *   'signup'  -> an anonymous caller: open the sign-up modal
 *   'premium' -> a free account: Checkout (interval picker first), or an honest "not
 *                available yet" while Premium is not purchasable
 *   absent    -> Premium/operator: nothing higher to buy, so an explanation and Close only
 */

export type InterstitialDetail =
  | { kind: 'quota'; detail: QuotaExceeded }
  | { kind: 'limit'; detail: LimitRefusal };

export interface InterstitialCopy {
  titleKey: string;
  bodyKey: string;
  values: Record<string, unknown>;
  upgradePath: 'signup' | 'premium' | undefined;
  placement: string;
}

/** Pure mapping from a server body to copy keys: the part worth unit-testing. */
export function interstitialCopy(input: InterstitialDetail): InterstitialCopy {
  if (input.kind === 'quota') {
    const d = input.detail;
    return {
      titleKey: 'interface:upgradeInterstitial.quota.title',
      bodyKey: 'interface:upgradeInterstitial.quota.body',
      values: { limit: d.limit },
      upgradePath: d.upgradePath,
      placement: `quota_${d.metric}`,
    };
  }
  const d = input.detail;
  if (d.error === 'output_height_limited') {
    return {
      titleKey: 'interface:upgradeInterstitial.outputHeight.title',
      bodyKey: 'interface:upgradeInterstitial.outputHeight.body',
      values: { limit: d.limit, requested: d.requested ?? d.limit },
      upgradePath: d.upgradePath,
      placement: 'output_height_limited',
    };
  }
  return {
    titleKey: 'interface:upgradeInterstitial.projects.title',
    bodyKey: 'interface:upgradeInterstitial.projects.body',
    values: { limit: d.limit },
    upgradePath: d.upgradePath,
    placement: 'project_limit_reached',
  };
}

export const UpgradeInterstitial: React.FC<{
  input: InterstitialDetail;
  onClose: () => void;
}> = ({ input, onClose }) => {
  const auth = useAuth();
  const { t, language } = useLocalization(['interface']);
  const fallback = useBillingFallback();
  const copy = interstitialCopy(input);
  const purchasable = usePremiumPurchasable(copy.upgradePath === 'premium');
  const [interval, setInterval] = React.useState<BillingInterval>('monthly');
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    setInterval(readLastInterval());
  }, []);

  const proceed = () => {
    if (!auth) return;
    analytics.track(EVENTS.UPGRADE_CTA_CLICKED, { placement: copy.placement, from_tier: auth.tier });
    if (copy.upgradePath === 'signup') {
      onClose();
      auth.openAuth({ intent: 'signup', source: copy.placement });
      return;
    }
    setBusy(true);
    void startCheckout(interval, copy.placement, language?.code)
      .then((outcome) => {
        if (!outcome.ok) onClose();
        return fallback(outcome, copy.placement);
      })
      .finally(() => setBusy(false));
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-5 sm:max-w-[460px]" data-testid="upgrade-interstitial">
        <DialogHeader>
          <DialogTitle>{t(copy.titleKey, copy.values)}</DialogTitle>
          <DialogDescription>{t(copy.bodyKey, copy.values)}</DialogDescription>
        </DialogHeader>

        {copy.upgradePath === 'premium' && purchasable ? (
          <Segmented<BillingInterval>
            name="interstitial-interval"
            label={t('interface:billing.intervalLabel')}
            value={interval}
            onValueChange={setInterval}
            options={[
              { value: 'monthly', label: t('interface:billing.monthly') },
              { value: 'yearly', label: t('interface:billing.yearly') },
            ]}
          />
        ) : null}
        {copy.upgradePath === 'premium' && purchasable === false ? (
          <p className="text-sm text-muted-foreground">
            {t('interface:billing.unavailable')}
          </p>
        ) : null}
        {copy.upgradePath === undefined ? (
          <p className="text-sm text-muted-foreground">
            {t('interface:upgradeInterstitial.topTier')}
          </p>
        ) : null}

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t('interface:upgradeInterstitial.close')}
          </Button>
          {copy.upgradePath === 'signup' ? (
            <Button onClick={proceed}>{t('interface:upgradeInterstitial.signup')}</Button>
          ) : null}
          {copy.upgradePath === 'premium' && purchasable ? (
            <Button onClick={proceed} disabled={busy}>
              {t('interface:upgradeInterstitial.upgrade')}
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeInterstitial;
