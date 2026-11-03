import type { Metadata } from 'next';

import { PHOTO_BRAND } from '@/lib/photo/brand';

// /photo/* is the chromeless photo editor (MM97): an app surface, not SEO
// content. The (system) root layout supplies <html>/<body> + Providers, and
// app/providers.tsx takes its chromeless branch for /photo (no site nav,
// footer, ads, AdSense slots or consent bar). proxy.ts and localizeHref leave
// /photo untouched for every locale. The public landing page is
// /tools/aperture (MM100). The tab title is set per project by the editor.
export const metadata: Metadata = {
  title: `${PHOTO_BRAND} | Media Manipulator`,
  robots: { index: false, follow: false },
};

export default function PhotoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
