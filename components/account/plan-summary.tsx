'use client';

import * as React from 'react';
import { Check } from 'lucide-react';

import { isUnlimited, type TierDescriptor, type TierLimits } from '@/lib/auth/accountApi';
import { formatBytes, formatDuration } from '@/lib/auth/formatLimits';
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

export default PlanSummary;
