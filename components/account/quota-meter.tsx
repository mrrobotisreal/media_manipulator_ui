'use client';

import * as React from 'react';
import Link from 'next/link';

import { useAuth } from '@/lib/auth/AuthProvider';
import { formatResetsIn } from '@/lib/auth/formatLimits';
import { useLocalization } from '@/i18n/useLocalization';
import { cn } from '@/lib/utils';

/**
 * The daily-allowance readout in the nav.
 *
 * This is the conversion surface: it makes the value of an account visible
 * BEFORE the visitor hits a wall, which is the difference between an upgrade
 * prompt that feels like information and one that feels like a toll gate. So it
 * is always present, always quiet, and never animates for attention.
 *
 * Form follows the rest of the Darkroom system — a frame counter on the back of
 * a camera. Monospace tabular count over a 2px gauge rail; the rail is a real
 * measurement of a real value, not a decorative progress bar. Nothing glows.
 *
 * CLS: the outer button is a fixed size in every state, including loading, so
 * mounting it and then resolving the tier shifts nothing. Phase 3 measured CLS
 * at 0 on every route and this must not be what breaks it.
 */

/** Warmth tracks how close the wall is. Coral only once it is actually hit. */
function toneFor(used: number, limit: number): string {
  if (limit <= 0) return 'text-muted-foreground';
  const ratio = used / limit;
  if (ratio >= 1) return 'text-primary';
  if (ratio >= 0.6) return 'text-premium';
  return 'text-data';
}

interface GaugeProps {
  used: number;
  limit: number;
  tone: string;
  /** Renders the dashed placeholder state at the same size. */
  pending?: boolean;
}

const Gauge: React.FC<GaugeProps> = ({ used, limit, tone, pending }) => {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  return (
    <span className={cn('flex w-full flex-col items-stretch gap-1', tone)}>
      {/* This readout is what WCAG 2.5.3 Label in Name calls the visible label
          of the control that wraps it, so the accessible name has to contain it
          verbatim — which is why `accessibility:quotaMeter.gauge` is phrased
          "{{used}} / {{limit}} daily operations used" rather than "… 0 of 5 …".
          Hiding this text instead does NOT satisfy the rule: axe compares the
          accessible name against text visible on screen, aria-hidden or not. */}
      <span className="num text-[11px] leading-none">
        {pending ? '— / —' : `${used} / ${limit}`}
      </span>
      <span
        aria-hidden="true"
        className="relative block h-[2px] w-full overflow-hidden rounded-full bg-edge-strong"
      >
        <span
          className="absolute inset-y-0 left-0 bg-current transition-[width] duration-[var(--dur-base)] ease-[var(--ease-instrument)]"
          style={{ width: pending ? '0%' : `${pct}%` }}
        />
      </span>
    </span>
  );
};

/**
 * Every state — loading, link, button — occupies exactly this box. Sharing the
 * class rather than a wrapper component keeps the rendered element a real
 * <a>/<button> with no extra node between it and the nav's flex row.
 */
const SHELL = 'flex h-9 w-[68px] shrink-0 flex-col justify-center rounded-md px-2 py-1';

export const QuotaMeter: React.FC = () => {
  const auth = useAuth();
  const { t } = useLocalization(['interface', 'accessibility']);

  // Outside the provider (the chromeless /embed and /dr trees) there is no
  // allowance to show and nothing to reserve space for.
  if (!auth) return null;

  const limit = auth.allowanceOf('ops');
  const used = auth.usage.ops ?? 0;
  const pending = auth.loading || limit <= 0;
  const tone = pending ? 'text-muted-foreground' : toneFor(used, limit);
  const remaining = Math.max(0, limit - used);
  const atLimit = !pending && remaining === 0;

  const gauge = <Gauge used={used} limit={limit} tone={tone} pending={pending} />;

  if (pending) {
    // Not a button yet: nothing to open, and a control that does nothing is
    // worse than a readout. Same box, so resolving costs no layout.
    return (
      <span aria-hidden="true" className={cn(SHELL, 'opacity-60')}>
        {gauge}
      </span>
    );
  }

  const resets = formatResetsIn(auth.resetsAt);
  const description = atLimit
    ? [t('interface:quotaMeter.atLimit'), resets && t('interface:quotaMeter.resets', { when: resets })]
        .filter(Boolean)
        .join(' · ')
    : t('interface:quotaMeter.remaining', { remaining, limit });

  const shellClass = cn(
    SHELL,
    'cursor-pointer border border-transparent text-left transition-colors',
    'duration-[var(--dur-base)] ease-[var(--ease-instrument)]',
    'hover:border-edge hover:bg-surface-2',
    atLimit && 'border-primary/40',
  );

  // Signed in: the meter links to the account, where the numbers have room to
  // be explained. Signed out: it opens the account panel, because there is no
  // account page to send them to yet.
  if (auth.user) {
    return (
      <Link
        href="/account"
        title={description}
        aria-label={`${t('accessibility:quotaMeter.gauge', { used, limit })}. ${t('accessibility:quotaMeter.openAccount')}`}
        className={shellClass}
      >
        {gauge}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => auth.openAuth({ intent: 'signup', source: 'quota_meter' })}
      title={description}
      aria-label={`${t('accessibility:quotaMeter.gauge', { used, limit })}. ${t('accessibility:quotaMeter.openUpgrade')}`}
      className={shellClass}
    >
      {gauge}
    </button>
  );
};

export default QuotaMeter;
