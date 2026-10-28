'use client';

import * as React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getConsentDetails, setConsent } from '@/lib/consent';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';

/**
 * The first-party consent bar.
 *
 * WHAT IS DELIBERATELY UNCHANGED from the previous version, because it was right:
 *
 *   NOT A MODAL. No backdrop, no focus trap, Escape does nothing, and everything behind it
 *   stays reachable — a visitor who wants to convert a file before answering can.
 *   `position: fixed` means it overlays rather than reflows, so it contributes nothing to CLS.
 *
 *   EQUAL PROMINENCE. Accept and Decline are the same component, same variant, same size,
 *   side by side. That equality is a requirement, not a style preference: both an AdSense
 *   reviewer and the GDPR need to see no steering. **Do not make one of them the primary
 *   button.**
 *
 *   `role="region"`, not `role="dialog"`. It makes an announcement and offers a choice; it
 *   does not take over the page.
 *
 * WHAT CHANGED:
 *
 *   REGION-AWARE COPY. This bar is now only rendered where opt-in is required, so the copy
 *   can say plainly that nothing is collected until the visitor chooses — which is true, and
 *   which the old geo-blind wording could not claim.
 *
 *   NO COMPENSATING PAGE VIEW. The old banner had to fire a page_view by hand on accept,
 *   because the pre-consent view had been reduced to an anonymous path count and the
 *   session's first real page view was otherwise lost. The SDK now buffers pre-consent events
 *   in memory and flushes them on grant with their original timestamps, so the first page
 *   view arrives by itself — correctly timed, rather than back-dated to the moment of the
 *   click.
 *
 *   A CUSTOMIZE PATH. Accept-all / decline-all is the fast answer for most people; per-
 *   category control belongs in the preferences centre rather than in a bar at the bottom of
 *   the screen.
 */

export interface ConsentBannerProps {
  /** Called after a choice is stored and applied, so the host can unmount us. */
  onDecided: (granted: boolean) => void;
  /** Open the preferences centre instead of answering here. */
  onCustomize: () => void;
}

/**
 * Decline and Accept share this exact class string, so they cannot drift apart (MM88; the
 * equal-prominence rule above). Below `sm` they split the row equally and a long label wraps
 * to two lines inside the 44px box rather than spilling out of it (German or Ukrainian at
 * 320px); from `sm` they size to their text, as before.
 */
export const EQUAL_CHOICE =
  'h-auto min-h-11 min-w-0 flex-1 whitespace-normal px-2 py-1 leading-tight sm:flex-none sm:whitespace-nowrap sm:px-5 sm:py-2';

export function ConsentBanner({ onDecided, onCustomize }: ConsentBannerProps) {
  const { t } = useLocalization(['interface']);
  const localized = useLocalizedHref();
  const region = getConsentDetails().regionGroup;

  const decide = (granted: boolean) => {
    // `mechanism: 'banner'` is what the audit record stores, and it is how a regulator can
    // tell an explicit click apart from the US notice-and-opt-out default
    // (`implied_notice`) or an automatic GPC opt-out (`gpc`).
    setConsent({ analytics: granted, mechanism: 'banner' });
    onDecided(granted);
  };

  return (
    <section
      role="region"
      aria-label={t('interface:consentBanner.label')}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-edge bg-surface-1 shadow-[inset_0_1px_0_var(--edge-highlight)] animate-in fade-in-0 slide-in-from-bottom-4 duration-200"
    >
      {/* MM88: COMPACT BELOW `sm`, UNCHANGED FROM `sm` UP.
          At 375px the old column (5–6 lines of copy over three wrapping buttons) was
          ~210–250px, about 40% of a 375×667 screen under the sticky header. Now:

            border-t 1 + py-3 12 + copy (line-clamp-2 × leading-5) 40 + gap-2 8
            + button row (min-h-11) 44 + py-3 12  =  117px  (≤ 120px)

          The copy is clamped to two lines, and the privacy-policy link, which the clamp
          would hide while leaving it focusable, moves behind "More": that opens the
          preferences centre, whose text and policy link say everything the clamp cut.
          Customize stays a text button; Decline and Accept stay IDENTICAL (variant,
          size, flex-1), side by side, on one row. */}
      <div className="container mx-auto flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-4">
        <div className="flex items-end gap-2 sm:block">
          <p className="line-clamp-2 min-w-0 flex-1 text-sm leading-5 text-muted-foreground sm:line-clamp-none sm:max-w-2xl sm:leading-relaxed">
            {region === 'gdpr'
              ? t('interface:consentBanner.bodyGdpr')
              : t('interface:consentBanner.body')}
            <span className="hidden sm:inline">
              {' '}
              <Link
                href={localized('/privacy-policy')}
                className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
              >
                {t('interface:consentBanner.privacyLink')}
              </Link>
            </span>
          </p>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={onCustomize}
            className="min-h-10 shrink-0 rounded-md px-1 text-sm text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary sm:hidden"
          >
            {t('interface:consentBanner.more')}
          </button>
        </div>

        <div className="flex shrink-0 gap-2 sm:gap-3">
          {/* A tertiary affordance — a link-styled button, so it reads as "more options"
              rather than competing with the two equal choices. */}
          <Button
            variant="ghost"
            onClick={onCustomize}
            className="min-h-11 px-2 leading-tight text-muted-foreground hover:text-foreground sm:px-4"
          >
            {t('interface:consentBanner.customize')}
          </Button>
          <Button
            variant="outline"
            onClick={() => decide(false)}
            className={EQUAL_CHOICE}
          >
            {t('interface:consentBanner.decline')}
          </Button>
          <Button
            variant="outline"
            onClick={() => decide(true)}
            className={EQUAL_CHOICE}
          >
            {t('interface:consentBanner.accept')}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ConsentBanner;
