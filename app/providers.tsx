'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import mixpanel from 'mixpanel-browser';
import '@/i18n';
import { ThemeProvider } from '@/components/theme-provider';
import TopNav from '@/components/top-nav';
import Footer from '@/components/footer';
// MobileAnchorAd is intentionally NOT rendered — the sticky mobile anchor ad
// is disabled for the AdSense review build.
import { initWebVitals } from '@/lib/webVitals';
import {
  hasAnalyticsConsent,
  initConsentListener,
  onConsentChange,
} from '@/lib/consent';
import { trackFirstPartyPageView } from '@/lib/firstPartyAnalytics';
import { trackGooglePageView } from '@/lib/gtag';
import { trackMixpanelPageView } from '@/lib/analytics';

// One QueryClient for the app lifetime. Created lazily inside the component so
// each browser tab gets its own instance and it is never shared across requests
// on the server.
let browserQueryClient: QueryClient | undefined;
function getQueryClient(): QueryClient {
  if (!browserQueryClient) browserQueryClient = new QueryClient();
  return browserQueryClient;
}

// Mixpanel is initialized lazily after first paint so it never blocks LCP, and
// only after the user has granted analytics consent. SDK calls fired before
// init are buffered internally. Ported from the Vite entry (main.tsx).
let mixpanelInitialized = false;
function tryInitMixpanel() {
  if (mixpanelInitialized) return;
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_MP_TOKEN) return;
  if (!hasAnalyticsConsent()) return;
  try {
    mixpanel.init(process.env.NEXT_PUBLIC_MP_TOKEN, {
      debug: false,
      // Page-view tracking is owned by RouteAnalytics below. Letting the SDK
      // auto-track here would double-fire.
      track_pageview: false,
      persistence: 'localStorage',
    });
    mixpanelInitialized = true;
  } catch {
    // Mixpanel must never block the editing flow.
  }
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

  useEffect(() => {
    if (isEmbed) return;
    // Observe Consent Mode v2 updates before any tracker is set up so the
    // Mixpanel / GA helpers can early-return when consent is denied.
    initConsentListener();
    initWebVitals();

    const ric = (
      window as typeof window & {
        requestIdleCallback?: (
          cb: () => void,
          opts?: { timeout: number },
        ) => number;
      }
    ).requestIdleCallback;
    if (typeof ric === 'function') {
      ric(tryInitMixpanel, { timeout: 3000 });
    } else {
      window.setTimeout(tryInitMixpanel, 1500);
    }
    // Re-attempt init when the user grants consent later in the session.
    const off = onConsentChange(tryInitMixpanel);
    return off;
  }, [isEmbed]);

  if (isEmbed) {
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
        <RouteAnalytics />
        <TopNav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
