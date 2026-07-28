'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';

import { ADSENSE_ENABLED } from '@/lib/adsenseConfig';
import { getStoredConsentChoice, onConsentReviewRequest } from '@/lib/consent';

/**
 * Decides whether the consent bar is needed, and only then pays for it.
 *
 * This component is always mounted in the non-chromeless tree but costs
 * essentially nothing: the bar itself is a separate chunk that is fetched only
 * when there is a question to ask. A returning visitor who already answered
 * downloads zero banner bytes.
 *
 * It also owns the reopen path. The footer's "Cookie settings" fallback publishes
 * a review request (lib/consent), which has to reach a component that is mounted
 * even when the bar is not — which is exactly this one.
 *
 * ADSENSE_ENABLED is the handover switch. While it is false the review build
 * loads no AdSense script, so Funding Choices never appears and nothing else
 * would ever ask. Once it is true, Funding Choices IS the CMP: it owns TCF state,
 * and a second banner writing Consent Mode underneath it would be both a
 * duplicate prompt and a source of disagreement. So this renders nothing at all
 * in that world, and app/providers.tsx likewise stops replaying the stored
 * first-party choice.
 */

const ConsentBanner = dynamic(() => import('@/components/consent/consent-banner'), {
  ssr: false,
});

export function ConsentGate() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (ADSENSE_ENABLED) return;

    // Deferred to idle: the bar is fixed-position and shifts nothing, but its
    // chunk should never compete with LCP for bandwidth.
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;
    const ask = () => {
      if (!getStoredConsentChoice()) setVisible(true);
    };

    const ric = (
      window as typeof window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }
    ).requestIdleCallback;
    if (typeof ric === 'function') {
      idleHandle = ric(ask, { timeout: 2000 });
    } else {
      timeoutHandle = window.setTimeout(ask, 1200);
    }

    // A review request is an explicit ask, so it shows the bar even when a
    // choice is already stored — changing your mind is the point.
    const off = onConsentReviewRequest(() => setVisible(true));
    return () => {
      off();
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
      const cancel = (
        window as typeof window & { cancelIdleCallback?: (handle: number) => void }
      ).cancelIdleCallback;
      if (idleHandle !== undefined && typeof cancel === 'function') cancel(idleHandle);
    };
  }, []);

  if (!visible) return null;
  return <ConsentBanner onDecided={() => setVisible(false)} />;
}

export default ConsentGate;
