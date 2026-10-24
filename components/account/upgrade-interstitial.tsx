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
import {
  isTopTier,
  isUnlimited,
  type BillingInterval,
  type LimitRefusal,
  type QuotaExceeded,
  type Tier,
  type TierLimits,
  type TiersResponse,
} from '@/lib/auth/accountApi';
import { formatBytes } from '@/lib/auth/formatLimits';
import { readLastInterval, startCheckout } from '@/lib/billing/checkout';
import { useBillingFallback, usePremiumPurchasable, useTiers } from '@/lib/billing/useUpgradeAction';
import { useLocalization } from '@/i18n/useLocalization';

/**
 * The shared "you hit a plan limit" dialog for the 429 `quota_exceeded` (free account on its
 * daily cap) and the 403 `project_limit_reached` / `output_height_limited` bodies.
 *
 * Four limit shapes, each with its own copy and its own "what Premium changes" line, read from
 * the served /api/tiers table (never written into the copy):
 *   - 413 on an upload              -> file size
 *   - 429 quota_exceeded `ops`      -> daily conversions
 *   - 429 quota_exceeded `ai_ops`   -> daily AI jobs   (`export` -> daily exports)
 *   - 403 output_height_limited     -> resolution (and 403 project_limit_reached -> projects)
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
  /** The limit-specific key; rides on `cta_id` so each limit's funnel reads separately. */
  limitKey: string;
}

/** The upgrade path for a refusal that carries none (the 413 has no body): derived from tier. */
function pathForTier(tier: Tier | undefined): 'signup' | 'premium' | undefined {
  if (!tier) return undefined;
  if (tier === 'anonymous') return 'signup';
  return isTopTier(tier) ? undefined : 'premium';
}

/** Pure mapping from a server body to copy keys: the part worth unit-testing. */
export function interstitialCopy(
  input: InterstitialDetail,
  context: { tier?: Tier; limits?: TierLimits | null } = {},
): InterstitialCopy {
  if (input.kind === 'quota') {
    const d = input.detail;
    return {
      titleKey: 'interface:upgradeInterstitial.quota.title',
      bodyKey: 'interface:upgradeInterstitial.quota.body',
      values: { limit: d.limit },
      upgradePath: d.upgradePath,
      placement: 'limit_interstitial',
      limitKey: `quota_${d.metric}`,
    };
  }
  const d = input.detail;
  if (d.error === 'file_too_large') {
    return {
      titleKey: 'interface:upgradeInterstitial.fileSize.title',
      bodyKey: 'interface:upgradeInterstitial.fileSize.body',
      // The 413 has no body, so the caller's own cap comes from the account snapshot.
      values: { limit: context.limits ? formatBytes(context.limits.maxFileBytes) : '' },
      upgradePath: d.upgradePath ?? pathForTier(context.tier),
      placement: 'limit_interstitial',
      limitKey: 'file_too_large',
    };
  }
  if (d.error === 'output_height_limited') {
    return {
      titleKey: 'interface:upgradeInterstitial.outputHeight.title',
      bodyKey: 'interface:upgradeInterstitial.outputHeight.body',
      values: { limit: d.limit, requested: d.requested ?? d.limit },
      upgradePath: d.upgradePath,
      placement: 'limit_interstitial',
      limitKey: 'output_height_limited',
    };
  }
  return {
    titleKey: 'interface:upgradeInterstitial.projects.title',
    bodyKey: 'interface:upgradeInterstitial.projects.body',
    values: { limit: d.limit },
    upgradePath: d.upgradePath,
    placement: 'limit_interstitial',
    limitKey: 'project_limit_reached',
  };
}

/**
 * What Premium changes for this limit, as a copy key plus its value; null when the served
 * table has no number for it (the line is then omitted rather than guessed).
 */
export function premiumChange(
  limitKey: string,
  tiers: TiersResponse | undefined,
): { key: string; values: Record<string, unknown> } | null {
  const premium = tiers?.tiers.find((x) => x.tier === 'premium')?.limits;
  if (!premium) return null;
  const count = (n: number, key: string) =>
    isUnlimited(n)
      ? { key: `${key}Unlimited`, values: {} }
      : n > 0
        ? { key, values: { value: n } }
        : null;
  switch (limitKey) {
    case 'file_too_large':
      return premium.maxFileBytes > 0
        ? { key: 'interface:upgradeInterstitial.premiumChange.fileSize', values: { value: formatBytes(premium.maxFileBytes) } }
        : null;
    case 'quota_ops':
      return count(premium.opsPerDay, 'interface:upgradeInterstitial.premiumChange.ops');
    case 'quota_ai_ops':
      return count(premium.aiOpsPerDay, 'interface:upgradeInterstitial.premiumChange.aiOps');
    case 'quota_export':
      return count(premium.exportsPerDay, 'interface:upgradeInterstitial.premiumChange.exports');
    case 'output_height_limited':
      return premium.maxOutputHeight > 0
        ? { key: 'interface:upgradeInterstitial.premiumChange.height', values: { value: premium.maxOutputHeight } }
        : null;
    case 'project_limit_reached':
      return count(premium.studioProjects, 'interface:upgradeInterstitial.premiumChange.projects');
    default:
      return null;
  }
}

export const UpgradeInterstitial: React.FC<{
  input: InterstitialDetail;
  onClose: () => void;
}> = ({ input, onClose }) => {
  const auth = useAuth();
  const { t, language } = useLocalization(['interface']);
  const fallback = useBillingFallback();
  const copy = interstitialCopy(input, { tier: auth?.tier, limits: auth?.limits });
  const tiers = useTiers(copy.upgradePath === 'premium');
  const change = copy.upgradePath === 'premium' ? premiumChange(copy.limitKey, tiers) : null;
  const purchasable = usePremiumPurchasable(copy.upgradePath === 'premium');
  const [interval, setInterval] = React.useState<BillingInterval>('monthly');
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    setInterval(readLastInterval());
  }, []);

  const proceed = () => {
    if (!auth) return;
    analytics.track(EVENTS.UPGRADE_CTA_CLICKED, {
      placement: copy.placement,
      cta_id: copy.limitKey,
      from_tier: auth.tier,
    });
    if (copy.upgradePath === 'signup') {
      onClose();
      auth.openAuth({ intent: 'signup', source: copy.limitKey });
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

        {change ? (
          <p className="text-sm text-foreground" data-testid="premium-change">
            {t(change.key, change.values)}
          </p>
        ) : null}

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
