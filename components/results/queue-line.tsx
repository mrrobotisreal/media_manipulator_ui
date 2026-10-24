'use client';

import * as React from 'react';
import Link from 'next/link';

import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import { isTopTier, type Tier } from '@/lib/auth/accountApi';
import { useTiers } from '@/lib/billing/useUpgradeAction';
import { formatJobDuration } from '@/lib/auth/formatLimits';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';

/**
 * "This took 48 s on the shared queue. Premium jobs go first." (MM33 decision 4)
 *
 * It states only what is true, so every condition below is load-bearing:
 *   - the job REPORTED a queue wait (`queueWaitMs`; no pipeline sends one yet, so today this
 *     renders nothing) and it was at least 30 s, i.e. worth mentioning;
 *   - the caller is not Premium/Operator (nothing to sell them);
 *   - the served tier table says Premium has GPU priority (`priorityGpu`), i.e. MM18's
 *     scheduling is live. Without it we would be claiming a perk that does not exist.
 *
 * The copy deliberately says "go first", not "skip the wait forever": MM18's aging promotes
 * a free job that has waited past the aging window, so free jobs are never starved and the
 * line must not suggest they are.
 */
export const QUEUE_LINE_MIN_MS = 30_000;

export function shouldShowQueueLine(input: {
  waitMs: number | undefined;
  tierIsTop: boolean;
  premiumHasPriority: boolean;
}): boolean {
  return (
    typeof input.waitMs === 'number' &&
    input.waitMs >= QUEUE_LINE_MIN_MS &&
    !input.tierIsTop &&
    input.premiumHasPriority
  );
}

export const QueueLine: React.FC<{ waitMs?: number }> = ({ waitMs }) => {
  const auth = useAuth();
  // Only fetch the tier table when there is a wait worth explaining.
  const relevant = !!auth && !auth.loading && !isTopTier(auth.tier) && (waitMs ?? 0) >= QUEUE_LINE_MIN_MS;
  const tiers = useTiers(relevant);

  const premiumHasPriority = tiers?.tiers.find((x) => x.tier === 'premium')?.limits.priorityGpu === true;
  if (!auth || !shouldShowQueueLine({ waitMs, tierIsTop: isTopTier(auth.tier), premiumHasPriority })) return null;

  return <QueueLineBody waitMs={waitMs} tier={auth.tier} />;
};

// Split out so the localization hooks run only when the line is actually shown.
const QueueLineBody: React.FC<{ waitMs?: number; tier: Tier }> = ({ waitMs, tier }) => {
  const { t } = useLocalization(['interface']);
  const localized = useLocalizedHref();
  return (
    <p className="text-sm text-muted-foreground" data-testid="queue-line">
      {t('interface:queueLine.text', { time: formatJobDuration(waitMs) })}{' '}
      <Link
        href={localized('/pricing')}
        className="underline decoration-muted-foreground/40 underline-offset-2 hover:text-foreground"
        onClick={() =>
          analytics.track(EVENTS.UPGRADE_CTA_CLICKED, { placement: 'queue_line', from_tier: tier })
        }
      >
        {t('interface:queueLine.cta')}
      </Link>
    </p>
  );
};

export default QueueLine;
