'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import '@/i18n';
import { ThemeProvider } from '@/components/theme-provider';
import TopNav from '@/components/top-nav';
import Footer from '@/components/footer';
// MobileAnchorAd is intentionally NOT rendered — the sticky mobile anchor ad
// is disabled for the AdSense review build.
import { initWebVitals } from '@/lib/webVitals';
import { initConsentListener, onConsentChange, replayStoredConsent } from '@/lib/consent';
import { ADSENSE_ENABLED } from '@/lib/adsenseConfig';
import { ConsentGate } from '@/components/consent/consent-gate';
import { trackFirstPartyPageView } from '@/lib/firstPartyAnalytics';
import { trackGooglePageView } from '@/lib/gtag';
import { trackMixpanelPageView } from '@/lib/analytics';
import { initMixpanel } from '@/lib/mixpanel';
import { AuthProvider } from '@/lib/auth/AuthProvider';

// One QueryClient for the app lifetime. Created lazily inside the component so
// each browser tab gets its own instance and it is never shared across requests
// on the server.
let browserQueryClient: QueryClient | undefined;
function getQueryClient(): QueryClient {
  if (!browserQueryClient) browserQueryClient = new QueryClient();
  return browserQueryClient;
}

/**
 * Fires first-party + GA + Mixpanel page-view events on every client-side
 * route change. The document title is owned by the Next.js Metadata API, so we
 * read it after the route commits. Replaces the RouteAnalytics component from
 * the Vite Router.
 */
const RouteAnalytics: React.FC = () => {
  const pathname = usePathname();
  const isInitialPageviewSentRef = useRef(false);

  useEffect(() => {
    if (!pathname) return;
    const sendPageview = () => {
      const path = `${pathname}${window.location.search}`;
      const title = document.title;
      trackFirstPartyPageView(title);
      trackGooglePageView(title, path);
      trackMixpanelPageView(title, path);
    };

    if (!isInitialPageviewSentRef.current) {
      isInitialPageviewSentRef.current = true;
      sendPageview();
      return;
    }

    const raf = requestAnimationFrame(sendPageview);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(getQueryClient);
  const pathname = usePathname();
  // The /embed/* routes are chromeless app surfaces meant to be iframed by
  // CreaTV — no site nav/footer and no first-party/GA analytics. They still need
  // react-query + theme for the embedded editor.
  const isEmbed = pathname?.startsWith('/embed') ?? false;
  // The /dr Double Raven partner portal is private: no public top-nav/footer,
  // no ad components, and no site analytics. It gets its own chrome (DrShell)
  // and still needs react-query + theme, so it takes the same chromeless branch
  // as /embed.
  const isDoubleRaven = pathname?.startsWith('/dr') ?? false;
  const isChromeless = isEmbed || isDoubleRaven;

  useEffect(() => {
    if (isChromeless) return;
    // Observe Consent Mode v2 updates before any tracker is set up so the
    // Mixpanel / GA helpers can early-return when consent is denied.
    initConsentListener();
    // Then re-apply whatever this visitor already decided. Consent Mode state
    // lives in the page, so without this replay an accepted choice silently
    // reverts to denied on every load. Skipped once AdSense is enabled, because
    // Funding Choices owns consent from that point and must not be written over.
    if (!ADSENSE_ENABLED) replayStoredConsent();
    initWebVitals();

    const ric = (
      window as typeof window & {
        requestIdleCallback?: (
          cb: () => void,
          opts?: { timeout: number },
        ) => number;
      }
    ).requestIdleCallback;
    // Mixpanel loads and initializes on idle so it never blocks LCP, and only
    // after analytics consent. `initMixpanel` owns the dynamic import of the
    // SDK, keeping ~60 KB out of the root chunk (lib/mixpanel.ts).
    if (typeof ric === 'function') {
      ric(initMixpanel, { timeout: 3000 });
    } else {
      window.setTimeout(initMixpanel, 1500);
    }
    // Re-attempt init when the user grants consent later in the session.
    const off = onConsentChange(initMixpanel);
    return off;
  }, [isChromeless]);

  if (isChromeless) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {/* AuthProvider is deliberately inside the non-chromeless branch only:
            /embed/* is an iframed app surface with no site chrome, and /dr/* is
            the Double Raven portal with its own auth. Neither should mount an
            account listener or poll the quota endpoint. */}
        <AuthProvider>
          <RouteAnalytics />
          <TopNav />
          {/* Non-chromeless only, like AuthProvider: an iframed /embed surface
              and the /dr portal must never render a site-wide consent prompt.

              Mounted here rather than after the footer on purpose. The bar is
              fixed-positioned, so DOM order costs it nothing visually, but it
              deliberately is not a modal — nothing traps focus — and a consent
              choice placed last in the tab order is one a keyboard or
              screen-reader user only finds after traversing the entire page.
              Consent has to be offered, not discoverable. */}
          <ConsentGate />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
