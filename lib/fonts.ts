import { Inter, JetBrains_Mono } from 'next/font/google';

// Self-hosted and preloaded by next/font, with size-adjust fallback metrics that
// remove the FOUT-driven CLS the old 1.1 MB of unpreloaded .ttf caused.
// The CSS variables are consumed by --font-sans / --font-mono in globals.css.
//
// Shared by both root layouts — `app/(localized)/[lang]/layout.tsx` and
// `app/(system)/layout.tsx` — so the font pipeline stays identical on every
// route. (next/font calls must sit in module scope; a shared module keeps the
// two layouts from drifting.)
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Every number in the product renders in this face (see `.num` in globals.css).
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});
