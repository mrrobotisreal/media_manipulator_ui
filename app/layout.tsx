import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Providers from './providers';
import { ResourceHints } from '@/components/seo/resource-hints';
import { ADSENSE_ENABLED, ADSENSE_SCRIPT_ORIGIN } from '@/lib/adsenseConfig';
import { SITE_ORIGIN } from '@/lib/seo';

// Self-hosted and preloaded by next/font, with size-adjust fallback metrics that
// remove the FOUT-driven CLS the old 1.1 MB of unpreloaded .ttf caused.
// The CSS variables are consumed by --font-sans / --font-mono in globals.css.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Every number in the product renders in this face (see `.num` in globals.css).
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

// No-flash theme bootstrap. Runs before first paint so <html> already carries
// the correct class.
//
// Dark is the product default and the assumption in the absence of explicit
// user input. ONLY a stored value of exactly "light" produces light mode —
// the OS `prefers-color-scheme` is deliberately NOT consulted, so a visitor on
// a light desktop still gets the darkroom. A legacy "system" value from the old
// Vite app resolves to dark rather than following the OS.
//
// Keep the storage key in sync with components/theme-provider.tsx
// ("vite-ui-theme") — changing it would reset every returning user's choice.
const THEME_INIT = `
(function(){try{
  var t = localStorage.getItem('vite-ui-theme');
  document.documentElement.classList.add(t === 'light' ? 'light' : 'dark');
}catch(e){document.documentElement.classList.add('dark');}})();
`;

// Consent Mode v2 defaults — every signal denied before any tag runs.
//
// `lib/consent/consentModeBridge.ts` upgrades them via gtag('consent','update')
// once our own first-party state resolves. Note the direction: our state is the
// SOURCE OF TRUTH and Consent Mode is the mirror. The previous implementation had
// this inverted — it wrapped window.gtag and inferred consent from whoever called
// it — which meant consent state depended on a Google API we do not control and
// which never fires at all on the review build (no AdSense script → no Funding
// Choices → no update → everything stayed denied forever).
//
// `wait_for_update: 500` gives our resolution a window before GA4 acts on the
// defaults. functionality_storage and security_storage stay granted: they cover
// the strictly-necessary storage (theme, quota/abuse identifiers) that consent
// does not gate.
const GTAG_CONSENT_BOOTSTRAP = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
gtag('js', new Date());
gtag('config', 'G-6J910CMHRY', { send_page_view: false });
`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title:
    'Free Online Media Converter, Editor, Transcriber & Metadata Tool | Media Manipulator',
  description:
    'Convert, edit, compress, transcribe, summarize, and inspect image, video, and audio files online with Media Manipulator.',
  // Icons are driven entirely by the App Router file conventions in app/:
  //   favicon.ico   → browser tab icon (multi-size .ico)
  //   icon.png      → modern high-res <link rel="icon">
  //   apple-icon.png→ iOS home-screen <link rel="apple-touch-icon">
  // Next content-hashes each one for automatic cache-busting. We intentionally
  // do NOT declare `metadata.icons` here, to avoid emitting a second competing
  // rel="icon" (and a .webp apple-touch-icon that iOS Safari can't render).
  other: {
    'google-adsense-account': 'ca-pub-3413790368941825',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0B0D',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        {/*
          Third-party origins worth warming.

          The AdSense preconnect is conditional on ADSENSE_ENABLED, the same
          top-level flag lib/adsenseConfig.ts gates every ad request on. On the
          review build no adsbygoogle.js ever loads, and an unconditional hint
          there holds a socket open for an origin the page never contacts —
          Lighthouse reports it as an unused preconnect and it competes with the
          requests the page does make. When ads are on, the slot is above the
          fold and the DNS+TLS handshake is on the critical path to filling the
          reserved height, so the full preconnect is right.

          googletagmanager gets a DNS prefetch only: GA4 loads lazily, so
          resolving the name early is enough.
        */}
        <ResourceHints
          preconnect={
            ADSENSE_ENABLED
              ? [{ href: ADSENSE_SCRIPT_ORIGIN, crossOrigin: 'anonymous' }]
              : []
          }
          dnsPrefetch={['https://www.googletagmanager.com']}
        />
        {/* Apply the theme class before first paint to avoid a light flash. */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_INIT }}
        />
        {/* Consent defaults must run before GA processes any events. */}
        <Script
          id="gtag-consent"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: GTAG_CONSENT_BOOTSTRAP }}
        />
        {/*
          gtag/js is 149 KB of third-party JavaScript and nothing on the page
          waits for it — the consent defaults and the dataLayer stub above are
          what matter early, and both are inline. `lazyOnload` moves it past the
          load event instead of competing with the app's own hydration during
          the interactive window.

          GA4 now receives exactly three events (page_view, sign_up,
          job_completed), forwarded by lib/analytics/ga4.ts from the first-party
          SDK. It is a CROSS-CHECK, not a second analytics system: if our own
          numbers and GA4's diverge beyond a sampling-and-blocking band, one of
          them is broken. Events are dispatched through the dataLayer, which
          buffers until the tag arrives, so nothing is lost to the lazy load.
        */}
        <Script
          id="ga4"
          src="https://www.googletagmanager.com/gtag/js?id=G-6J910CMHRY"
          strategy="lazyOnload"
        />
        {/*
          The global AdSense (pagead2) script was intentionally REMOVED for the
          AdSense review build. No Google ad script loads anywhere unless a
          guarded AdBanner explicitly enables it (see components/ad-banner.tsx +
          lib/adsenseConfig.ts), which is disabled by default via env. The
          `google-adsense-account` meta above is kept for account verification.
        */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
