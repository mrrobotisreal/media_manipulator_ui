'use client';

import * as React from 'react';
import Link from 'next/link';

import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import { isTopTier, isUnlimited, type UsageMetric } from '@/lib/auth/accountApi';
import { limitRaisedByPro } from '@/lib/billing/plans';
import { formatResetsIn } from '@/lib/auth/formatLimits';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { cn } from '@/lib/utils';

/**
 * The allowance readout in a tool's header (MM33 decision 2): "3 of 5 AI jobs left today".
 *
 * It reads the same auth-context numbers as the nav meter (no new endpoint) but names the
 * metric THIS tool spends: conversions, AI jobs or exports. It is information first and a
 * link to /pricing second, so it never opens a modal and never counts down.
 *
 * Hidden for Pro/Operator and for any unlimited allowance. Premium sees it (MM40): every
 * metric it counts is one Pro raises, so its /pricing link reads "See Pro". While the tier is
 * resolving it renders a skeleton of the same box, so resolving shifts nothing.
 */

/** Tasks that spend the AI allowance, matching the API's `ai_ops` routes. */
const AI_TASKS = new Set(['ai_video_restoration', 'image_restoration', 'document_scan', 'voice_clone', 'voice_design', 'summarize_video', 'summarize_audio']);

/** Which allowance a tool task spends. Everything else is an everyday conversion (`ops`). */
export function quotaMetricForTask(task?: string): UsageMetric {
  if (!task) return 'ops';
  if (AI_TASKS.has(task)) return 'ai_ops';
  if (task === 'studio_export') return 'export';
  return 'ops';
}

/** The tone shifts at or below this share of the allowance remaining. */
export const LOW_QUOTA_RATIO = 0.2;

export type QuotaChipTone = 'calm' | 'low' | 'empty';

export function quotaChipTone(remaining: number, limit: number): QuotaChipTone {
  if (remaining <= 0) return 'empty';
  return remaining / limit <= LOW_QUOTA_RATIO ? 'low' : 'calm';
}

const TONE_CLASS: Record<QuotaChipTone, string> = {
  calm: 'text-muted-foreground border-edge',
  low: 'text-premium border-premium/40',
  empty: 'text-primary border-primary/40',
};

export interface QuotaChipProps {
  /** The tool's task; picks the metric. Ignored when `metric` is given. */
  task?: string;
  metric?: UsageMetric;
  /** While a job uploads or runs the chip keeps its space but is not shown. */
  busy?: boolean;
  className?: string;
}

export const QuotaChip: React.FC<QuotaChipProps> = ({ task, metric: metricProp, busy, className }) => {
  const auth = useAuth();
  const { t } = useLocalization(['interface']);
  const localized = useLocalizedHref();
  const metric = metricProp ?? quotaMetricForTask(task);

  // Outside the provider (/embed, /dr) there is no allowance to show.
  if (!auth) return null;
  if (!auth.loading && isTopTier(auth.tier)) return null;
  if (!auth.loading && auth.tier === 'premium' && !limitRaisedByPro(`quota_${metric}`)) return null;

  const box = cn('flex min-h-7 items-center', className);

  if (auth.loading) {
    return (
      <div className={box} aria-hidden="true" data-testid="quota-chip-skeleton">
        <span className="block h-7 w-44 animate-pulse rounded-full bg-surface-2 motion-reduce:animate-none" />
      </div>
    );
  }

  const limit = auth.allowanceOf(metric);
  // 0 is uncounted and a negative value is unlimited: neither has a number to show.
  if (limit <= 0 || isUnlimited(limit)) return null;

  const used = auth.usage[metric] ?? 0;
  const remaining = Math.max(0, limit - used);
  const tone = quotaChipTone(remaining, limit);
  const resets = remaining === 0 ? formatResetsIn(auth.resetsAt) : '';
  const text =
    remaining === 0
      ? t(`interface:quotaChip.${metric}.empty`, { limit })
      : t(`interface:quotaChip.${metric}.remaining`, { remaining, limit });

  return (
    <div className={cn(box, busy && 'invisible')} data-testid="quota-chip-box">
      <Link
        href={localized('/pricing')}
        tabIndex={busy ? -1 : undefined}
        data-testid="quota-chip"
        data-tone={tone}
        title={
          resets
            ? t('interface:quotaMeter.resets', { when: resets })
            : t(auth.tier === 'premium' ? 'interface:quotaChip.titlePro' : 'interface:quotaChip.title')
        }
        onClick={() =>
          analytics.track(EVENTS.UPGRADE_CTA_CLICKED, {
            placement: 'quota_chip',
            cta_id: metric,
            from_tier: auth.tier,
          })
        }
        className={cn(
          'num inline-flex items-center rounded-full border bg-surface-1 px-3 py-1 text-xs leading-5',
          'transition-colors duration-[var(--dur-base)] ease-[var(--ease-instrument)] hover:bg-surface-2',
          TONE_CLASS[tone],
        )}
      >
        {text}
      </Link>
    </div>
  );
};

export default QuotaChip;
