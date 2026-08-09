import type { Metadata } from 'next';

// /embed/* are app surfaces, not SEO content. The root layout still provides
// <html>/<body> + the (chromeless, see app/providers.tsx) Providers tree.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
