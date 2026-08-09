import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '../globals.css';
import Providers from '@/app/providers';
import { ResourceHints } from '@/components/seo/resource-hints';
import { ADSENSE_ENABLED, ADSENSE_SCRIPT_ORIGIN } from '@/lib/adsenseConfig';
import { SITE_ORIGIN } from '@/lib/seo';
import { inter, jetbrainsMono } from '@/lib/fonts';
import { THEME_INIT, GTAG_CONSENT_BOOTSTRAP } from '@/lib/layoutScripts';

/**
 * Root layout for the non-localized surfaces: the `/dr/**` Double Raven
 * partner portal and the `/embed/**` CreaTV-framed editor. Both are English
 * only, keep their exact pre-i18n URLs and behavior, and must never move under
 * the `[lang]` segment — `proxy.ts` passes them through untouched.
 *
 * Byte-for-byte this mirrors the old single root layout (fonts, theme
 * bootstrap, consent defaults, GA4 loader) via the shared `lib/fonts.ts` +
 * `lib/layoutScripts.ts` modules; the localized twin lives at
 * `app/(localized)/[lang]/layout.tsx`. `app/providers.tsx` renders these
 * routes through its chromeless, analytics-free branch exactly as before.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title:
    'Free Online Media Converter, Editor, Transcriber & Metadata Tool | Media Manipulator',
  description:
    'Convert, edit, compress, transcribe, summarize, and inspect image, video, and audio files online with Media Manipulator.',
  other: {
    'google-adsense-account': 'ca-pub-3413790368941825',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0B0D',
  width: 'device-width',
  initialScale: 1,
};

export default function SystemRootLayout({
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
        <Script
          id="ga4"
          src="https://www.googletagmanager.com/gtag/js?id=G-6J910CMHRY"
          strategy="lazyOnload"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
