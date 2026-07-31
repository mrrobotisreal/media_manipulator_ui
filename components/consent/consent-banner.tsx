'use client';

import * as React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getConsentDetails, setConsent } from '@/lib/consent';
import { useLocalization } from '@/i18n/useLocalization';

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

export function ConsentBanner({ onDecided, onCustomize }: ConsentBannerProps) {
  const { t } = useLocalization(['interface']);
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
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {region === 'gdpr'
            ? t('interface:consentBanner.bodyGdpr')
            : t('interface:consentBanner.body')}{' '}
          <Link
            href="/privacy-policy"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            {t('interface:consentBanner.privacyLink')}
          </Link>
        </p>

        <div className="flex shrink-0 flex-wrap gap-3">
          {/* A tertiary affordance — a link-styled button, so it reads as "more options"
              rather than competing with the two equal choices. */}
          <Button
            variant="ghost"
            onClick={onCustomize}
            className="min-h-11 px-4 text-muted-foreground hover:text-foreground"
          >
            {t('interface:consentBanner.customize')}
          </Button>
          <Button
            variant="outline"
            onClick={() => decide(false)}
            className="min-h-11 flex-1 px-5 sm:flex-none"
          >
            {t('interface:consentBanner.decline')}
          </Button>
          <Button
            variant="outline"
            onClick={() => decide(true)}
            className="min-h-11 flex-1 px-5 sm:flex-none"
          >
            {t('interface:consentBanner.accept')}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ConsentBanner;
