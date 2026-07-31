'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';

import { ADSENSE_ENABLED } from '@/lib/adsenseConfig';
import {
  getConsentDetails,
  initConsent,
  needsPrompt,
  onConsentReviewRequest,
} from '@/lib/consent';

/**
 * Decides what consent surface — if any — is needed, and only then pays for it.
 *
 * Always mounted in the non-chromeless tree but costs essentially nothing: both surfaces are
 * separate chunks fetched only when there is something to show. A returning visitor with a
 * decision on file downloads zero consent bytes.
 *
 * TWO SURFACES, and the distinction is the whole reason this component grew:
 *
 *   THE BANNER asks the question. Shown only when `analytics` is `unset`, which after region
 *   resolution means an opt-in region (EEA/UK/CH, or anywhere we could not identify). In the
 *   US the region default is notice-and-opt-out, so `unset` never persists and the banner
 *   never appears — the footer's permanent opt-out path is the compliant surface there.
 *
 *   THE PREFERENCES CENTRE lets someone change their mind. It is opened on demand from the
 *   footer's "Cookie settings" and "Do Not Sell or Share My Personal Information" links,
 *   which is why this component — mounted whether or not the banner is — owns the reopen
 *   subscription.
 *
 * ADSENSE_ENABLED is the Phase 12 handover switch. While it is false the review build loads
 * no AdSense script, so Google's certified CMP (Privacy & Messaging / TCF v2.2) never
 * appears and our banner is the only thing asking. Once it is true, that CMP owns TCF state
 * for EEA/UK ADS consent, and a second banner writing ad signals underneath it would be both
 * a duplicate prompt and a source of disagreement. Analytics consent remains ours either
 * way, which is why the preferences centre stays available and only the BANNER is
 * suppressed.
 */

const ConsentBanner = dynamic(() => import('@/components/consent/consent-banner'), {
  ssr: false,
});

const ConsentPreferences = dynamic(() => import('@/components/consent/consent-preferences'), {
  ssr: false,
});

export function ConsentGate() {
  const [showBanner, setShowBanner] = React.useState(false);
  const [showPreferences, setShowPreferences] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    // Resolve consent first. Until it settles we do not know whether this visitor is in an
    // opt-in region, and guessing in either direction is wrong: guess opt-in and a US
    // visitor gets a needless banner, guess opt-out and an EEA visitor is processed without
    // consent.
    void initConsent()
      .then(() => {
        if (cancelled) return;
        if (ADSENSE_ENABLED) return;
        if (needsPrompt(getConsentDetails())) setShowBanner(true);
      })
      .catch(() => {
        // initConsent never rejects; this is belt and braces.
      });

    // A review request is an explicit ask, so it opens the preferences centre even when a
    // choice is already stored — changing your mind is the entire point of the link.
    const off = onConsentReviewRequest(() => {
      setShowBanner(false);
      setShowPreferences(true);
    });

    return () => {
      cancelled = true;
      off();
    };
  }, []);

  return (
    <>
      {showBanner ? (
        <ConsentBanner
          onDecided={() => setShowBanner(false)}
          onCustomize={() => {
            setShowBanner(false);
            setShowPreferences(true);
          }}
        />
      ) : null}
      {showPreferences ? <ConsentPreferences onClose={() => setShowPreferences(false)} /> : null}
    </>
  );
}

export default ConsentGate;
