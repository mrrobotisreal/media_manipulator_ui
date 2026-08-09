'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import type { i18n as I18nInstance } from 'i18next';
import { Toaster } from 'sonner';
import { getI18nForLocale, defaultLanguage } from '@/i18n';
import { ThemeProvider } from '@/components/theme-provider';
import TopNav from '@/components/top-nav';
import Footer from '@/components/footer';
// MobileAnchorAd is intentionally NOT rendered — the sticky mobile anchor ad
// is disabled for the AdSense review build.
import { ConsentGate } from '@/components/consent/consent-gate';
import { AnalyticsProvider } from '@/lib/analytics';
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
 * WHAT USED TO BE HERE, and why it is gone.
 *
 * This file previously owned a `RouteAnalytics` component that fired three page-view calls
 * (first-party + GA4 + Mixpanel) on every route change, plus an init effect that wired the
 * consent listener, web vitals, and a deferred Mixpanel bootstrap.
 *
 * All of it now lives in `AnalyticsProvider`, for one concrete reason: those concerns need
 * to share state. Page views need the current tier, `page_leave` needs the engagement
 * measurements for the page that is ending, and the consent gate needs to be able to flush
 * a pre-consent buffer into the same queue the route tracker writes to. Spread across a
 * provider and a sibling component, they could not.
 *
 * Mixpanel is removed entirely, along with Firebase Analytics and Performance.
 */
export default function Providers({
  children,
  locale = defaultLanguage,
}: {
  children: React.ReactNode;
  /** Locale code resolved from the `[lang]` URL segment by the root layout. */
  locale?: string;
}) {
  const [queryClient] = useState(getQueryClient);
  // The i18next instance must speak the same language as the server HTML it
  // hydrates into, so it is created synchronously from the URL locale before
  // the first render — per-mount on the server (no cross-request sharing),
  // the process-wide singleton in the browser.
  const [i18nInstance] = useState<I18nInstance>(() => getI18nForLocale(locale));
  // Client-side navigation across locales (e.g. the language selector calling
  // router.push('/ru/...')) re-renders this provider with a new locale prop;
  // switch the live singleton so every mounted component follows.
  useEffect(() => {
    if (i18nInstance.language !== locale) {
      void i18nInstance.changeLanguage(locale);
    }
  }, [i18nInstance, locale]);
  const pathname = usePathname();
  // The /embed/* routes are chromeless app surfaces meant to be iframed by
  // CreaTV — no site nav/footer and no analytics of any kind. They still need
  // react-query + theme for the embedded editor.
  const isEmbed = pathname?.startsWith('/embed') ?? false;
  // The /dr Double Raven partner portal is private: no public top-nav/footer,
  // no ad components, and no site analytics. It gets its own chrome (DrShell)
  // and still needs react-query + theme, so it takes the same chromeless branch
  // as /embed.
  const isDoubleRaven = pathname?.startsWith('/dr') ?? false;
  const isChromeless = isEmbed || isDoubleRaven;

  if (isChromeless) {
    // ANALYTICS-FREE BY CONSTRUCTION, not by a runtime flag. There is no
    // AnalyticsProvider, no ConsentGate and no GA4 bridge in this branch, so
    // there is nothing to accidentally leave enabled: `/embed/*` is an iframed
    // surface inside someone else's page, and `/dr/*` is a private partner
    // portal. Neither may mount a consent prompt or emit a single event.
    return (
      <I18nextProvider i18n={i18nInstance}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </I18nextProvider>
    );
  }

  return (
    <I18nextProvider i18n={i18nInstance}>
      <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {/* AuthProvider is deliberately inside the non-chromeless branch only:
            /embed/* is an iframed app surface with no site chrome, and /dr/* is
            the Double Raven portal with its own auth. Neither should mount an
            account listener or poll the quota endpoint. */}
        <AuthProvider>
          {/* AnalyticsProvider sits INSIDE AuthProvider because it reads the tier
              and the sign-in state: every event snapshots the tier at the time it
              happened, and identify()/reset() follow the auth state. */}
          <AnalyticsProvider>
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
          </AnalyticsProvider>
        </AuthProvider>
      </ThemeProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
