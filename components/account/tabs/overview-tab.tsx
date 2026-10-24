'use client';

import * as React from 'react';
import Link from 'next/link';

import type { AccountCopy } from '@/components/account/account-copy';
import { Panel } from '@/components/darkroom/panel';
import { Stat } from '@/components/darkroom/stat';
import { Button } from '@/components/ui/button';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { useAuth } from '@/lib/auth/AuthProvider';
import { isUnlimited, type UsageMetric } from '@/lib/auth/accountApi';
import { formatBytes, formatDuration, formatResetsIn } from '@/lib/auth/formatLimits';
import { fmt, RETENTION_BANNER_KEY } from '@/lib/account/retention';
import { cn } from '@/lib/utils';
import { LINK_CLASS } from '@/components/account/tabs/shared';

export interface OverviewExtras {
  tierNames: Record<string, string>;
  unlimited: string;
  planRows: { label: string; value: 'ops' | 'file' | 'video' | 'output' | 'projects' }[];
}

const METRICS: UsageMetric[] = ['ops', 'ai_ops', 'export'];

function toneFor(used: number, limit: number): string {
  if (limit <= 0) return 'text-muted-foreground';
  const ratio = used / limit;
  if (ratio >= 1) return 'text-primary';
  if (ratio >= 0.6) return 'text-premium';
  return 'text-data';
}

const UsageBar: React.FC<{ used: number; limit: number; label: string; unlimited: string }> = ({
  used,
  limit,
  label,
  unlimited,
}) => {
  const uncapped = isUnlimited(limit);
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const tone = uncapped ? 'text-data' : toneFor(used, limit);
  return (
    <div className={cn('flex flex-col gap-1.5', tone)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="num text-sm">{uncapped ? `${used} / ${unlimited}` : `${used} / ${limit}`}</span>
      </div>
      <span aria-hidden="true" className="relative block h-1 w-full overflow-hidden rounded-full bg-edge-strong">
        <span
          className="absolute inset-y-0 start-0 bg-current transition-[width] duration-[var(--dur-base)] ease-[var(--ease-instrument)]"
          style={{ width: `${pct}%` }}
        />
      </span>
    </div>
  );
};

export { RETENTION_BANNER_KEY };

function readDismissed(): boolean {
  try {
    return window.localStorage.getItem(RETENTION_BANNER_KEY) === '1';
  } catch {
    return false;
  }
}

export const OverviewTab: React.FC<{
  copy: AccountCopy;
  extras: OverviewExtras;
  onOpenPrivacy: () => void;
}> = ({ copy, extras, onOpenPrivacy }) => {
  const auth = useAuth();
  const localized = useLocalizedHref();
  // Hidden until mounted so the server render and the first client render agree.
  const [dismissed, setDismissed] = React.useState(true);
  React.useEffect(() => setDismissed(readDismissed()), []);
  if (!auth || !auth.user) return null;

  const { limits } = auth;
  const resets = formatResetsIn(auth.resetsAt);

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(RETENTION_BANNER_KEY, '1');
    } catch {
      // Private mode: the banner simply returns next visit.
    }
  };

  const planValue = (kind: OverviewExtras['planRows'][number]['value']): string => {
    if (!limits) return '—';
    switch (kind) {
      case 'ops':
        return isUnlimited(limits.opsPerDay) ? extras.unlimited : `${limits.opsPerDay}`;
      case 'file':
        return formatBytes(limits.maxFileBytes);
      case 'video':
        return formatDuration(limits.maxVideoSeconds);
      case 'output':
        return `${limits.maxOutputHeight}p`;
      case 'projects':
        return isUnlimited(limits.studioProjects) ? extras.unlimited : `${limits.studioProjects}`;
      default:
        return '—';
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="grid gap-6">
        {!dismissed ? (
          <Panel accent="data" data-testid="retention-banner">
            <h2 className="text-base font-semibold text-foreground">{copy.overview.bannerTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.overview.bannerBody}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" className="min-h-11 sm:min-h-9" onClick={onOpenPrivacy}>
                {copy.overview.bannerCta}
              </Button>
              <Button type="button" variant="ghost" className="min-h-11 sm:min-h-9" onClick={dismiss}>
                {copy.overview.bannerDismiss}
              </Button>
            </div>
          </Panel>
        ) : null}

        <Panel title={copy.usageTitle} titleAs="h2">
          <div className="grid gap-5">
            {METRICS.map((metric) => (
              <UsageBar
                key={metric}
                label={copy.metric[metric]}
                used={auth.usage[metric] ?? 0}
                limit={auth.allowanceOf(metric)}
                unlimited={extras.unlimited}
              />
            ))}
          </div>
          {resets ? <p className="mt-5 text-xs text-muted-foreground">{fmt(copy.resets, { when: resets })}</p> : null}
        </Panel>
      </div>

      <Panel title={copy.planTitle} titleAs="h2">
        <p className="num mb-4 text-lg text-foreground">{extras.tierNames[auth.tier] ?? auth.tier}</p>
        {limits ? (
          <div className="grid gap-3">
            {extras.planRows.map((row) => (
              <Stat key={row.value} orientation="inline" label={row.label} value={planValue(row.value)} wrap />
            ))}
            <Stat orientation="inline" label={copy.retentionLabel} value={copy.retentionChoose} wrap />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{copy.loadFailed}</p>
        )}
        <div className="mt-5 flex flex-col gap-2">
          <Link href={localized('/pricing')} className={LINK_CLASS}>
            {copy.comparePlans}
          </Link>
        </div>
      </Panel>
    </div>
  );
};

export default OverviewTab;
