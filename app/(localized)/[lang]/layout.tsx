import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '../../globals.css';
import Providers from '@/app/providers';
import { ResourceHints } from '@/components/seo/resource-hints';
import { ADSENSE_ENABLED, ADSENSE_SCRIPT_ORIGIN } from '@/lib/adsenseConfig';
import { SITE_ORIGIN } from '@/lib/seo';
import { inter, jetbrainsMono } from '@/lib/fonts';
import { THEME_INIT, GTAG_CONSENT_BOOTSTRAP } from '@/lib/layoutScripts';
import {
  defaultLocale,
  getLocaleDef,
  localePrefixes,
  urlPrefixToCode,
} from '@/i18n/locales';

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

// Prerender every locale's tree, including English's internal `en` segment —
// `proxy.ts` rewrites the public unprefixed URLs onto it, and permanently
// redirects any explicit `/en/...` hit back to the unprefixed URL, so English
// never has two live URLs.
export function generateStaticParams() {
  return localePrefixes.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  // An unknown `lang` reaches this layout only while the 404 boundary renders
  // (e.g. `/dr/no-such-page` backtracking into the dynamic segment — the pages
  // themselves 404 via `resolveLangParam`). Render that chrome as English.
  const locale = urlPrefixToCode(lang) ?? defaultLocale;
  const def = getLocaleDef(locale)!;
  return (
    <html
      lang={def.code}
      dir={def.dir}
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
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
