import type { Metadata } from 'next';

import { MOTION_BRAND } from '@/lib/vector/brand';

// /motion/* is the chromeless Motion editor (MM42): an app surface, not SEO
// content. The (system) root layout supplies <html>/<body> + Providers, and
// app/providers.tsx takes its chromeless branch for /motion (no site nav,
// footer, ads, AdSense slots or consent bar). proxy.ts and localizeHref leave
// /motion untouched for every locale. The public, indexable landing page is
// /tools/motion (MM48).
export const metadata: Metadata = {
  title: `${MOTION_BRAND} | Media Manipulator`,
  robots: { index: false, follow: false },
};

export default function MotionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
