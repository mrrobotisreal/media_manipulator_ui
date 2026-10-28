'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';

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
 * ADS ON OR OFF, THE BANNER SHOWS wherever `needsPrompt` is true (MM82, ADR-0016). It used
 * to be suppressed when ADSENSE_ENABLED, expecting Google's certified CMP to take over — but
 * that CMP ships inside the ad script, so whenever the script did not load EEA visitors got
 * no banner at all. Now both can coexist: ours asks about ANALYTICS only, Google's Privacy &
 * messaging message (configured in MM83) asks about ADS for EEA/UK/CH visitors, and the
 * Consent Mode bridge never writes the ad signals in that group (`ownsAdSignals`), so the two
 * never disagree.
 */

const ConsentBanner = dynamic(() => import('@/components/consent/consent-banner'), {
  ssr: false,
});

const ConsentPreferences = dynamic(() => import('@/components/consent/consent-preferences'), {
  ssr: false,
});

export function ConsentGate() {
  // MM52: nothing is captured on a translator deployment, so there is nothing to
  // consent to, and initConsent() would contact the analytics service (region
  // lookup, consent audit). The literal folds away in production builds.
  if (process.env.NEXT_PUBLIC_DEPLOY_ROLE === 'translator') return null;
  return <ConsentGateInner />;
}

function ConsentGateInner() {
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
