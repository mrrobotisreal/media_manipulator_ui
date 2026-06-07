import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Providers from './providers';
import { SITE_ORIGIN } from '@/lib/seo';

// Consent Mode v2 defaults — all signals denied until Google Funding Choices
// (loaded via the AdSense script below) prompts the user and upgrades them via
// gtag('consent', 'update', ...). Ported verbatim from the Vite index.html so
// EEA/UK/CH visitors keep seeing the banner and analytics stays consent-gated.
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
  icons: {
    icon: { url: '/MMIcon.webp', type: 'image/webp' },
    apple: '/MMIcon.webp',
  },
  other: {
    'google-adsense-account': 'ca-pub-3413790368941825',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0e1a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        {/* Consent defaults must run before GA processes any events. */}
        <Script
          id="gtag-consent"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: GTAG_CONSENT_BOOTSTRAP }}
        />
        <Script
          id="ga4"
          src="https://www.googletagmanager.com/gtag/js?id=G-6J910CMHRY"
          strategy="afterInteractive"
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
