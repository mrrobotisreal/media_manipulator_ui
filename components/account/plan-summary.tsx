'use client';

import * as React from 'react';
import { Check } from 'lucide-react';

import {
  isUnlimited,
  type BillingCurrency,
  type Tier,
  type TierDescriptor,
  type TierLimits,
  type TiersResponse,
} from '@/lib/auth/accountApi';
import { formatBytes, formatDuration } from '@/lib/auth/formatLimits';
import { formatPrice, planPrices } from '@/lib/billing/price';
import { useCurrency } from '@/lib/billing/useCurrency';
import { useLocalization } from '@/i18n/useLocalization';
import { cn } from '@/lib/utils';

/**
 * The capability list for one tier, rendered entirely from /api/tiers.
 *
 * Not one number here is a literal. The tier matrix lives in
 * internal/tiers/tiers.go fed by TIER_* config, and a copy in the UI would be a
 * second source of truth that drifts the first time a limit is retuned.
 */

export function planLines(
  limits: TierLimits,
  t: (key: string, options?: Record<string, unknown>) => string,
  tier?: string,
): string[] {
  const lines = [
    isUnlimited(limits.opsPerDay)
      ? t('interface:authModal.plans.opsPerDayUnlimited')
      : t('interface:authModal.plans.opsPerDay', { count: limits.opsPerDay }),
    t('interface:authModal.plans.maxFileSize', { size: formatBytes(limits.maxFileBytes) }),
    t('interface:authModal.plans.maxVideoLength', {
      duration: formatDuration(limits.maxVideoSeconds),
    }),
    t('interface:authModal.plans.maxOutput', { height: limits.maxOutputHeight }),
    isUnlimited(limits.studioProjects)
      ? t('interface:authModal.plans.studioProjectsUnlimited')
      : t('interface:authModal.plans.studioProjects', { count: limits.studioProjects }),
    // Retention is the user's choice, not a plan limit (MM26): guests are fixed at 24 hours,
    // every signed-in tier picks 24 hours to 2 years. limits.resultRetentionHours is only the
    // server default and is deliberately not shown as a promise.
    tier === 'anonymous'
      ? t('interface:authModal.plans.retentionGuest')
      : t('interface:authModal.plans.retention'),
  ];
  if (limits.priorityGpu) lines.push(t('interface:authModal.plans.priorityGpu'));
  if (limits.adsRemoved) lines.push(t('interface:authModal.plans.noAds'));
  return lines;
}

interface PlanSummaryProps {
  descriptor: TierDescriptor | undefined;
  title: React.ReactNode;
  /** Right-aligned price or status chip. */
  aside?: React.ReactNode;
  tone?: 'data' | 'premium';
  className?: string;
}

export const PlanSummary: React.FC<PlanSummaryProps> = ({
  descriptor,
  title,
  aside,
  tone = 'data',
  className,
}) => {
  const { t } = useLocalization(['interface']);
  if (!descriptor) return null;

  const accent = tone === 'premium' ? 'text-premium' : 'text-data';

  return (
    <section
      className={cn(
        'rounded-lg border border-edge bg-surface-2/60 p-4',
        className,
      )}
    >
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {aside}
      </header>
      <ul className="grid gap-1.5">
        {planLines(descriptor.limits, t, descriptor.tier).map((line) => (
          <li key={line} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check aria-hidden="true" className={cn('mt-0.5 size-3.5 shrink-0', accent)} />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

/** The four public rungs, in ladder order (MM40 decision 6). Operator is never a row. */
export const LADDER: readonly Tier[] = ['anonymous', 'free', 'premium', 'pro'];

export interface PlanLadderRow {
  tier: Tier;
  /** The served monthly price through formatPrice (MM69: in the visitor's currency), or the free label. */
  price: string;
  ops: string;
  aiOps: string;
  fileSize: string;
  current: boolean;
}

/**
 * One row per public tier the API serves, in ladder order, every number from /api/tiers
 * (`tiers`). `current` marks the caller's tier; an operator matches no row.
 */
export function planLadderRows(
  tiers: TiersResponse,
  currentTier: Tier | undefined,
  t: (key: string, options?: Record<string, unknown>) => string,
  currency: BillingCurrency = 'usd',
  locale = 'en-US',
): PlanLadderRow[] {
  const byTier = new Map(tiers.tiers.map((x) => [x.tier, x.limits]));
  const perMonth = t('interface:billing.perMonth');
  return LADDER.flatMap((tier) => {
    const limits = byTier.get(tier);
    if (!limits) return [];
    const monthly = tier === 'premium' || tier === 'pro' ? planPrices(tiers, tier, currency).monthly : undefined;
    return [
      {
        tier,
        price: typeof monthly === 'number' ? `${formatPrice(monthly, currency, locale)}${perMonth}` : t('interface:planSummary.free'),
        ops: isUnlimited(limits.opsPerDay)
          ? t('interface:planSummary.opsUnlimited')
          : t('interface:planSummary.ops', { value: limits.opsPerDay }),
        aiOps: isUnlimited(limits.aiOpsPerDay)
          ? t('interface:planSummary.aiOpsUnlimited')
          : t('interface:planSummary.aiOps', { value: limits.aiOpsPerDay }),
        fileSize: t('interface:planSummary.fileSize', { value: formatBytes(limits.maxFileBytes) }),
        current: tier === currentTier,
      },
    ];
  });
}

/** The plan ladder on the account Billing tab: four rows, the caller's own highlighted. */
export const PlanLadder: React.FC<{ tiers: TiersResponse | undefined; currentTier: Tier | undefined }> = ({
  tiers,
  currentTier,
}) => {
  const { t, language } = useLocalization(['interface']);
  const { currency } = useCurrency();
  if (!tiers) return null;
  const rows = planLadderRows(tiers, currentTier, t, currency, language?.code);
  if (!rows.length) return null;
  return (
    <section className="rounded-lg border border-edge bg-surface-2/60 p-4" data-testid="plan-ladder">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{t('interface:planSummary.title')}</h3>
      <ol className="grid gap-2">
        {rows.map((row) => (
          <li
            key={row.tier}
            data-tier={row.tier}
            data-current={row.current || undefined}
            aria-current={row.current ? 'true' : undefined}
            className={cn(
              'grid gap-1 rounded-md border px-3 py-2 sm:grid-cols-[8rem_1fr]',
              row.current ? 'border-premium/50 bg-surface-2' : 'border-edge',
            )}
          >
            <div className="flex items-baseline justify-between gap-2 sm:flex-col sm:justify-start">
              <span className={cn('text-sm font-medium', row.current ? 'text-premium' : 'text-foreground')}>
                {t(`interface:accountMenu.tier.${row.tier}`)}
              </span>
              <span className="num text-xs text-muted-foreground">{row.price}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {[row.ops, row.aiOps, row.fileSize].join(' · ')}
              {row.current ? (
                <span className="ms-2 text-xs font-medium text-premium">{t('interface:planSummary.current')}</span>
              ) : null}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default PlanSummary;
