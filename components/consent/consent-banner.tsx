'use client';

import * as React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { storeConsentChoice } from '@/lib/consent';
import { trackFirstPartyPageView } from '@/lib/firstPartyAnalytics';
import { useLocalization } from '@/i18n/useLocalization';

/**
 * The first-party consent bar.
 *
 * Shown to every visitor, not region-gated: the question is the same everywhere
 * and geo-targeting a consent prompt is a dark pattern with a compliance excuse
 * attached.
 *
 * It is deliberately NOT a modal. No backdrop, no focus trap, Escape does
 * nothing, and every element behind it stays reachable — a visitor who wants to
 * convert a file before answering can. `position: fixed` means it overlays
 * rather than reflows, so it contributes nothing to CLS.
 *
 * Accept and Decline are the same component, same variant, same size, and sit
 * side by side. That equality is a requirement, not a style preference: an
 * AdSense reviewer and the GDPR both need to see no steering. Do not make one of
 * them the primary button.
 *
 * On accept it also fires one first-party page view for the current path. The
 * view that brought the visitor here was reduced to the anonymous
 * pathname-and-timestamp fallback, so without this the session's first real page
 * view is simply lost.
 */

export interface ConsentBannerProps {
  /** Called after a choice is stored and applied, so the host can unmount us. */
  onDecided: (granted: boolean) => void;
}

export function ConsentBanner({ onDecided }: ConsentBannerProps) {
  const { t } = useLocalization(['interface']);

  const decide = (granted: boolean) => {
    storeConsentChoice(granted);
    if (granted) {
      // Consent listeners have already fired by now, so this event carries the
      // full payload the pre-consent view could not.
      trackFirstPartyPageView(document.title);
    }
    onDecided(granted);
  };

  return (
    <section
      // A region, not a dialog: it makes an announcement and offers a choice,
      // it does not take over the page.
      role="region"
      aria-label={t('interface:consentBanner.label')}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-edge bg-surface-1 shadow-[inset_0_1px_0_var(--edge-highlight)] animate-in fade-in-0 slide-in-from-bottom-4 duration-200"
    >
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t('interface:consentBanner.body')}{' '}
          <Link
            href="/privacy-policy"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            {t('interface:consentBanner.privacyLink')}
          </Link>
        </p>

        <div className="flex shrink-0 gap-3">
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
