'use client';

import * as React from 'react';
import Link from 'next/link';

import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useUpgradeAction } from '@/lib/billing/useUpgradeAction';
import { isUnlimited } from '@/lib/auth/accountApi';
import { formatResetsIn } from '@/lib/auth/formatLimits';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { cn } from '@/lib/utils';
import { NAV_HIT_EXTENSION } from '@/components/nav-control';

/**
 * The daily-allowance readouts in the nav: the everyday allowance (`ops`) and, beside it
 * since MM90, the AI allowance (`ai_ops`, labelled "AI"). They are two separate counters,
 * so they are two separate meters: an AI job moves only the AI meter.
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

interface GaugeLabelProps {
  /** A short prefix naming the allowance ("AI"); the everyday meter has none. */
  label?: string;
}

const Gauge: React.FC<GaugeProps & GaugeLabelProps> = ({ used, limit, tone, pending, label }) => {
  const unlimited = isUnlimited(limit);
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const count = pending ? '— / —' : unlimited ? '∞' : `${used} / ${limit}`;
  return (
    <span className={cn('flex w-full flex-col items-stretch gap-1', tone)}>
      {/* This readout is what WCAG 2.5.3 Label in Name calls the visible label
          of the control that wraps it, so the accessible name has to contain it
          verbatim — which is why `accessibility:quotaMeter.gauge` is phrased
          "{{used}} / {{limit}} daily operations used" rather than "… 0 of 5 …",
          and `aiGauge` starts with the same "AI 0 / 3" the AI meter shows.
          Hiding this text instead does NOT satisfy the rule: axe compares the
          accessible name against text visible on screen, aria-hidden or not. */}
      <span className={cn('num text-[11px] leading-none', label && 'whitespace-nowrap')} data-testid="quota-meter-readout">
        {label ? `${label} ${count}` : count}
      </span>
      <span
        aria-hidden="true"
        className="relative block h-[2px] w-full overflow-hidden rounded-full bg-edge-strong"
      >
        <span
          className="absolute inset-y-0 start-0 bg-current transition-[width] duration-[var(--dur-base)] ease-[var(--ease-instrument)]"
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

/**
 * MM90: the AI meter's box. Same height, padding and grammar; wider, because its readout
 * carries the "AI" label: "AI 200 / 200" is 12 monospace characters, 12 x 0.6em x 11px
 * = 80px, plus 16px padding and the 2px border = 98px; 100px leaves the -0.01em tracking
 * and a localized two-letter label ("KI", "ИИ", "ШІ", "IA") the same room. Fixed in every
 * state like SHELL, so resolving the tier moves nothing.
 */
const AI_SHELL = 'flex h-9 w-[100px] shrink-0 flex-col justify-center rounded-md px-2 py-1';

/** What each meter reads and says. Only `ops` and `ai_ops` have a nav meter. */
type MeterMetric = 'ops' | 'ai_ops';

/**
 * `quota_warning_shown`, at most once per session per metric.
 *
 * WHY SESSIONSTORAGE AND NOT A REF. The meter mounts on every route in the app, so a
 * per-component guard would emit the warning again on every client-side navigation while the
 * visitor is near their limit — turning one meaningful event into dozens and making "how
 * many people got warned today?" unanswerable. sessionStorage is the right scope because the
 * warning is a per-visit experience, and it matches the once-per-session budget the upgrade
 * nudge already uses.
 *
 * Failures are swallowed: private mode and blocked storage are normal, and the correct
 * behaviour there is to stay silent rather than to warn repeatedly.
 */
const WARNED_PREFIX = 'mm.quotaWarned.';

function warnOnce(metric: string, emit: () => void): void {
  const key = WARNED_PREFIX + metric;
  try {
    if (window.sessionStorage.getItem(key) === '1') return;
    window.sessionStorage.setItem(key, '1');
  } catch {
    // Erring toward silence: a prompt we cannot deduplicate is worse than no prompt.
    return;
  }
  emit();
}

export interface QuotaMeterProps {
  /** Which allowance this meter reads. Defaults to the everyday allowance. */
  metric?: MeterMetric;
  /** Extra classes for the control (e.g. a responsive `hidden md:flex`). */
  className?: string;
  /** Called when the meter is activated (the nav sheet closes itself with it). */
  onActivate?: () => void;
}

export const QuotaMeter: React.FC<QuotaMeterProps> = ({ metric = 'ops', className, onActivate }) => {
  const auth = useAuth();
  const { t } = useLocalization(['interface', 'accessibility']);
  const localized = useLocalizedHref();
  const ai = metric === 'ai_ops';
  // Only the signed-out button upgrades from here; signed-in callers get a link to /account.
  // The placement says which meter was pressed.
  const upgrade = useUpgradeAction(ai ? 'quota_meter_ai' : 'quota_meter');

  // THE WARNING EFFECT LIVES ABOVE EVERY EARLY RETURN. This component returns early three
  // times (no provider, still loading, signed in), so an effect declared further down would
  // run in some renders and not others — a hooks-order violation that React would eventually
  // punish with a mismatched-hook error rather than a missing event.
  //
  // Two thresholds, not one: 20% covers generous allowances, and "1 left" covers small ones
  // where 20% of 5 never trips before zero. At-limit is deliberately NOT warned here — that
  // is `quota_exceeded_shown`, emitted from the 429 subscriber in AuthProvider, where the
  // block actually happens. Each meter warns about its own allowance, once per session.
  const warnLimit = auth?.allowanceOf(metric) ?? 0;
  const warnUsed = auth?.usage[metric] ?? 0;
  const warnRemaining = Math.max(0, warnLimit - warnUsed);
  // `warnLimit > 0` also rules out the unlimited (negative) allowance.
  const nearLimit =
    !!auth &&
    !auth.loading &&
    warnLimit > 0 &&
    warnRemaining > 0 &&
    (warnRemaining / warnLimit <= 0.2 || warnRemaining <= 1);
  React.useEffect(() => {
    if (!nearLimit) return;
    warnOnce(metric, () =>
      analytics.track(EVENTS.QUOTA_WARNING_SHOWN, {
        limit: warnLimit,
        remaining: warnRemaining,
        scope: metric,
      }),
    );
  }, [nearLimit, warnLimit, warnRemaining, metric]);

  // Outside the provider (the chromeless /embed and /dr trees) there is no
  // allowance to show and nothing to reserve space for.
  if (!auth) return null;

  const limit = auth.allowanceOf(metric);
  const used = auth.usage[metric] ?? 0;
  const unlimited = isUnlimited(limit);
  // MM90: an unlimited AI allowance (operator) has nothing worth a second box.
  if (ai && unlimited && !auth.loading) return null;
  // An unlimited allowance (operator) is a resolved state with nothing to
  // fill, not a pending one: it links to the account like any signed-in meter.
  const pending = auth.loading || (limit <= 0 && !unlimited);
  const tone = pending ? 'text-muted-foreground' : unlimited ? 'text-data' : toneFor(used, limit);
  const remaining = unlimited ? Number.POSITIVE_INFINITY : Math.max(0, limit - used);
  const atLimit = !pending && remaining === 0;
  const label = ai ? t('interface:quotaMeter.aiLabel') : undefined;
  const shell = ai ? AI_SHELL : SHELL;

  const gauge = <Gauge used={used} limit={limit} tone={tone} pending={pending} label={label} />;

  if (pending) {
    // Not a button yet: nothing to open, and a control that does nothing is
    // worse than a readout. Same box, so resolving costs no layout.
    return (
      <span aria-hidden="true" data-quota-meter={metric} className={cn(shell, 'opacity-60', className)}>
        {gauge}
      </span>
    );
  }

  const resets = formatResetsIn(auth.resetsAt);
  const description = unlimited
    ? t('interface:quotaMeter.unlimited')
    : ai
      ? [
          atLimit
            ? t('interface:quotaChip.ai_ops.empty', { limit })
            : t('interface:quotaChip.ai_ops.remaining', { remaining, limit }),
          atLimit && resets ? t('interface:quotaMeter.resets', { when: resets }) : '',
        ]
          .filter(Boolean)
          .join(' · ')
      : atLimit
        ? [t('interface:quotaMeter.atLimit'), resets && t('interface:quotaMeter.resets', { when: resets })]
            .filter(Boolean)
            .join(' · ')
        : t('interface:quotaMeter.remaining', { remaining, limit });
  const gaugeLabel = ai
    ? t('accessibility:quotaMeter.aiGauge', { label, used, limit })
    : unlimited
      ? t('accessibility:quotaMeter.gaugeUnlimited')
      : t('accessibility:quotaMeter.gauge', { used, limit });

  const shellClass = cn(
    shell,
    // 36px tall like the icon controls; the same 4px extension makes the tap
    // target 44px (MM88).
    NAV_HIT_EXTENSION,
    'cursor-pointer border border-transparent text-start transition-colors',
    'duration-[var(--dur-base)] ease-[var(--ease-instrument)]',
    'hover:border-edge hover:bg-surface-2',
    atLimit && 'border-primary/40',
    className,
  );

  // Signed in: the meter links to the account, where the numbers have room to
  // be explained. Signed out: it opens the account panel, because there is no
  // account page to send them to yet.
  if (auth.user) {
    return (
      <Link
        href={localized('/account')}
        title={description}
        aria-label={`${gaugeLabel}. ${t('accessibility:quotaMeter.openAccount')}`}
        data-quota-meter={metric}
        className={shellClass}
        onClick={onActivate}
      >
        {gauge}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        onActivate?.();
        upgrade.run();
      }}
      title={description}
      aria-label={`${gaugeLabel}. ${t('accessibility:quotaMeter.openUpgrade')}`}
      data-quota-meter={metric}
      className={shellClass}
    >
      {gauge}
    </button>
  );
};

export default QuotaMeter;
