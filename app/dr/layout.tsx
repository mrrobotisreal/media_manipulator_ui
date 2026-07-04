import type { Metadata } from 'next';

// The /dr section is private. This noindex/nofollow metadata applies to every
// nested route (including /dr/auth). app/robots.ts also disallows /dr and
// app/sitemap.ts emits no /dr URLs. This layout is intentionally a thin
// boundary: the authenticated chrome (DrShell) and the auth gate (DrAuthGate)
// live in the nested (portal) route group so /dr/auth renders bare. The public
// top-nav/footer/ads and site analytics are stripped for /dr in
// app/providers.tsx.
export const metadata: Metadata = {
  title: 'Double Raven × Media Manipulator — Partner Portal',
  robots: { index: false, follow: false },
};

export default function DrLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
