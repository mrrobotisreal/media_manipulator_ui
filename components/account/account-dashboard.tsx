'use client';

import * as React from 'react';
import Link from 'next/link';

import { Panel } from '@/components/darkroom/panel';
import { Button } from '@/components/ui/button';
import { Stat } from '@/components/darkroom/stat';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { ConversionHistory, type HistoryLabels } from '@/components/account/conversion-history';
import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import type { UsageMetric } from '@/lib/auth/accountApi';
import {
  formatBytes,
  formatDuration,
  formatResetsIn,
  formatRetention,
} from '@/lib/auth/formatLimits';
import { cn } from '@/lib/utils';

/**
 * The live half of /account.
 *
 * Every label arrives as a prop from the server component that owns the page,
 * so `pages.json` never crosses into a client chunk — the rule Phase 3 set up
 * and the single easiest thing for a later change to undo by accident
 * (§0.5.13–14). Only the numbers are fetched here.
 */

export interface AccountLabels {
  signedOutTitle: string;
  signedOutBody: string;
  signInCta: string;
  usageTitle: string;
  planTitle: string;
  projectsTitle: string;
  resets: string;
  metric: Record<UsageMetric, string>;
  emptyProjects: string;
  openStudio: string;
  comparePlans: string;
  signOut: string;
  loadFailed: string;
  planRows: { label: string; value: 'ops' | 'file' | 'video' | 'output' | 'projects' | 'retention' }[];
  tierNames: Record<string, string>;
  unlimited: string;
  history: HistoryLabels;
}

const METRICS: UsageMetric[] = ['ops', 'ai_ops', 'export'];

/** Same warmth ramp as the nav meter, so one glance means the same thing twice. */
function toneFor(used: number, limit: number): string {
  if (limit <= 0) return 'text-muted-foreground';
  const ratio = used / limit;
  if (ratio >= 1) return 'text-primary';
  if (ratio >= 0.6) return 'text-premium';
  return 'text-data';
}

const UsageBar: React.FC<{ used: number; limit: number; label: string }> = ({
  used,
  limit,
  label,
}) => {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const tone = toneFor(used, limit);
  return (
    <div className={cn('flex flex-col gap-1.5', tone)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="num text-sm">
          {used} / {limit}
        </span>
      </div>
      <span
        aria-hidden="true"
        className="relative block h-1 w-full overflow-hidden rounded-full bg-edge-strong"
      >
        <span
          className="absolute inset-y-0 left-0 bg-current transition-[width] duration-[var(--dur-base)] ease-[var(--ease-instrument)]"
          style={{ width: `${pct}%` }}
        />
      </span>
    </div>
  );
};

export const AccountDashboard: React.FC<{ labels: AccountLabels }> = ({ labels }) => {
  const auth = useAuth();

  if (!auth || auth.loading) {
    // The heading has to exist in the loading state too. Without it the page
    // goes h1 → (footer) h3 and fails Lighthouse's heading-order check, which
    // is not a Lighthouse quirk: a screen-reader user tabbing the outline
    // during the fetch would genuinely lose a level.
    return (
      <Panel title={labels.usageTitle} titleAs="h2">
        <PanelLoading variant="inline" label={labels.usageTitle} />
      </Panel>
    );
  }

  if (!auth.user) {
    return (
      <Panel className="max-w-xl">
        <h2 className="text-lg font-semibold text-foreground">{labels.signedOutTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {labels.signedOutBody}
        </p>
        <Button
          className="mt-4"
          onClick={() => {
            // The signed-out account page: from_tier is always 'anonymous' here.
            analytics.track(EVENTS.UPGRADE_CTA_CLICKED, {
              placement: 'account_page',
              from_tier: auth.tier,
            });
            auth.openAuth({ intent: 'signin', source: 'account_page' });
          }}
        >
          {labels.signInCta}
        </Button>
      </Panel>
    );
  }

  const { limits } = auth;
  const resets = formatResetsIn(auth.resetsAt);

  const planValue = (kind: AccountLabels['planRows'][number]['value']): string => {
    if (!limits) return '—';
    switch (kind) {
      case 'ops':
        return `${limits.opsPerDay}`;
      case 'file':
        return formatBytes(limits.maxFileBytes);
      case 'video':
        return formatDuration(limits.maxVideoSeconds);
      case 'output':
        return `${limits.maxOutputHeight}p`;
      case 'projects':
        return limits.studioProjects < 0 ? labels.unlimited : `${limits.studioProjects}`;
      case 'retention':
        return formatRetention(limits.resultRetentionHours);
      default:
        return '—';
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* The wide column carries the two things that change: today's counts and
          the log of what produced them. */}
      <div className="grid gap-6">
        <Panel title={labels.usageTitle} titleAs="h2">
          <div className="grid gap-5">
            {METRICS.map((metric) => (
              <UsageBar
                key={metric}
                label={labels.metric[metric]}
                used={auth.usage[metric] ?? 0}
                limit={auth.allowanceOf(metric)}
              />
            ))}
          </div>
          {resets ? (
            <p className="mt-5 text-xs text-muted-foreground">
              {labels.resets.replace('{{when}}', resets)}
            </p>
          ) : null}
        </Panel>

        <ConversionHistory labels={labels.history} uid={auth.user.uid} />
      </div>

      <div className="grid gap-6">
        <Panel title={labels.planTitle} titleAs="h2">
          <p className="num mb-4 text-lg text-foreground">
            {labels.tierNames[auth.tier] ?? auth.tier}
          </p>
          {limits ? (
            <div className="grid gap-3">
              {labels.planRows.map((row) => (
                <Stat
                  key={row.value}
                  orientation="inline"
                  label={row.label}
                  value={planValue(row.value)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{labels.loadFailed}</p>
          )}
          <div className="mt-5 flex flex-col gap-2">
            <Link
              href="/pricing"
              className="text-sm text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              {labels.comparePlans}
            </Link>
            <button
              type="button"
              onClick={() => void auth.signOut()}
              className="w-fit text-sm text-muted-foreground underline decoration-muted-foreground/40 underline-offset-2 hover:text-foreground"
            >
              {labels.signOut}
            </button>
          </div>
        </Panel>

        <Panel title={labels.projectsTitle} titleAs="h2">
          {/* Studio projects are scoped server-side to the signed-in account
              (internal/handlers/studio.go). The editor owns listing and
              opening them; duplicating that here would be a second, weaker
              copy of the same view. */}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {labels.emptyProjects}
          </p>
          <Link
            href="/tools/content-studio"
            className="mt-3 inline-flex text-sm text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            {labels.openStudio}
          </Link>
        </Panel>
      </div>
    </div>
  );
};

export default AccountDashboard;
