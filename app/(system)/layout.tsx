import type { Metadata, Viewport } from 'next';
import '../globals.css';
import Providers from '@/app/providers';
import { SITE_ORIGIN } from '@/lib/seo';
import { inter, jetbrainsMono } from '@/lib/fonts';
import { LayoutBootstrap } from '@/lib/layoutScripts';

/**
 * Root layout for the non-localized surfaces: the `/dr/**` Double Raven
 * partner portal and the `/embed/**` CreaTV-framed editor. Both are English
 * only, keep their exact pre-i18n URLs and behavior, and must never move under
 * the `[lang]` segment — `proxy.ts` passes them through untouched.
 *
 * Byte-for-byte this mirrors the old single root layout (fonts, theme
 * bootstrap, consent defaults, GA4 loader) via the shared `lib/fonts.ts` +
 * `lib/layoutScripts.tsx` modules; the localized twin lives at
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
        {/* Resource hints + theme/consent bootstraps + GA4 loader — shared
            with the localized twin via lib/layoutScripts.tsx. */}
        <LayoutBootstrap />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
