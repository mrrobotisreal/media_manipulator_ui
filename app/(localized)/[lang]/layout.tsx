import type { Metadata, Viewport } from 'next';
import '../../globals.css';
import Providers from '@/app/providers';
import { SITE_ORIGIN } from '@/lib/seo';
import { inter, jetbrainsMono } from '@/lib/fonts';
import { LayoutBootstrap } from '@/lib/layoutScripts';
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
        {/* Resource hints + theme/consent bootstraps + GA4 loader. Shared with
            app/(system)/layout.tsx via lib/layoutScripts.tsx, which also
            documents why the inline bootstraps are raw HTML rather than
            next/script tags (this layout REMOUNTS when the [lang] param
            changes, and React warns on client-mounted <script> elements). */}
        <LayoutBootstrap />
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
