'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import { formatBytes } from '@/lib/auth/formatLimits';
import { useLocalization } from '@/i18n/useLocalization';
import { cn } from '@/lib/utils';

/**
 * §4.9's quiet upgrade surfaces. Tone target is Linear, not a mobile game.
 *
 * The rules these follow, and the reason each exists:
 *   - Nothing blocks a task in progress.
 *   - Nothing counts down, delays, or pretends to be urgent.
 *   - Every prompt states the caller's ACTUAL current limit, read from the
 *     server, rather than a number written into copy.
 *   - The post-conversion nudge fires at most once per browser session, and
 *     only after a download that actually succeeded.
 */

/**
 * The file-size line under a file picker.
 *
 * Shows the caller's own cap, and — for anyone who is not already at the top
 * tier — one short clause naming what would raise it. No second number: the
 * account panel shows the full comparison, and a literal here would be a
 * duplicate of the server's truth.
 */
export const UploadLimitHint: React.FC<{ className?: string }> = ({ className }) => {
  const auth = useAuth();
  const { t } = useLocalization(['interface']);

  // Outside the provider (/embed, /dr) there is no tier and never will be, so
  // render nothing at all — that decision is synchronous and shifts nothing.
  if (!auth) return null;

  // Inside the provider the line is ALWAYS reserved, empty until the tier
  // resolves. Appending it afterwards grew the tool panel and pushed every
  // section below it: measured as 0.069 CLS on /tools/compress-video desktop
  // before this, 0 after. Rendering a guessed limit and correcting it would
  // also read as a bait, so an empty reserved line is the only honest option.
  const ready = !auth.loading && auth.limits !== null;
  const size = ready ? formatBytes(auth.limits!.maxFileBytes) : '';
  const upsell =
    !ready || auth.tier === 'premium'
      ? null
      : auth.tier === 'anonymous'
        ? t('interface:upgradeSurfaces.fileLimitMoreFree')
        : t('interface:upgradeSurfaces.fileLimitMorePremium');

  return (
    <p className={cn('num min-h-4 text-xs leading-4 text-muted-foreground', className)}>
      {ready ? t('interface:upgradeSurfaces.fileLimit', { size }) : null}
      {upsell ? (
        <>
          {' · '}
          <button
            type="button"
            onClick={() => {
              // `upgrade_cta_clicked` is priority 0 — the strongest purchase-intent signal
              // available until a checkout flow exists. `placement` matches the `source`
              // already passed to openAuth, so the analytics dimension and the auth
              // attribution cannot drift apart.
              analytics.track(EVENTS.UPGRADE_CTA_CLICKED, {
                placement: 'file_limit_hint',
                from_tier: auth.tier,
              });
              auth.openAuth({ intent: 'signup', source: 'file_limit_hint' });
            }}
            className="underline decoration-muted-foreground/40 underline-offset-2 hover:text-foreground"
          >
            {upsell}
          </button>
        </>
      ) : null}
    </p>
  );
};

/** One nudge per browser session, tracked here so every tool shares the budget. */
const NUDGE_KEY = 'mm.upgradeNudgeShown';

function alreadyNudged(): boolean {
  try {
    return window.sessionStorage.getItem(NUDGE_KEY) === '1';
  } catch {
    // Private mode / blocked storage: treat as already shown. Erring toward
    // silence is the right failure for a prompt.
    return true;
  }
}

function markNudged(): void {
  try {
    window.sessionStorage.setItem(NUDGE_KEY, '1');
  } catch {
    /* nothing to do */
  }
}

/**
 * Returns a callback to run after a successful download.
 *
 * A toast, not a modal: the visitor has just finished a task and is probably
 * leaving, so interrupting them would be pure friction. Premium users are
 * never nudged — there is nothing to sell them.
 */
export function useUpgradeNudge(): () => void {
  const auth = useAuth();
  const { t } = useLocalization(['interface']);

  return React.useCallback(() => {
    if (!auth || auth.tier === 'premium') return;
    if (alreadyNudged()) return;
    markNudged();

    const body =
      auth.tier === 'anonymous'
        ? t('interface:upgradeSurfaces.nudgeBodyFree')
        : t('interface:upgradeSurfaces.nudgeBodyPremium');

    // The nudge SHOWN is tracked separately from the nudge clicked, and both matter: the
    // pair is the click-through rate of the one upsell prompt this product shows
    // unprompted. Without the `shown` event the click count has no denominator, and a
    // once-per-session prompt cannot be inferred from page views.
    analytics.track(EVENTS.FEATURE_USED, { feature: 'upgrade_nudge', action: 'shown' });

    toast(t('interface:upgradeSurfaces.nudgeTitle'), {
      description: body,
      action: {
        label: t('interface:upgradeSurfaces.nudgeAction'),
        onClick: () => {
          analytics.track(EVENTS.UPGRADE_CTA_CLICKED, {
            placement: 'post_download',
            from_tier: auth.tier,
          });
          auth.openAuth({ intent: 'signup', source: 'post_download' });
        },
      },
    });
  }, [auth, t]);
}
