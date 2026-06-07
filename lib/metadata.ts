// Server-side bridge between the existing SEO route map (lib/seo.ts) and the
// Next.js Metadata API. Each App Router page calls buildMetadata(path) from a
// Server Component so the per-route <title>, description, canonical, Open
// Graph, Twitter, and robots tags are emitted into the prerendered HTML head
// at build time — the SSG/SEO win this migration is about.

import type { Metadata } from 'next';
import { getSeoForPath, SITE_NAME, SITE_ORIGIN } from '@/lib/seo';

export function buildMetadata(path: string): Metadata {
  const seo = getSeoForPath(path);
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.length ? seo.keywords : undefined,
    alternates: { canonical: seo.canonicalUrl },
    robots: seo.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: seo.canonicalUrl,
      siteName: SITE_NAME,
      type: seo.ogType,
      images: [{ url: seo.ogImage }],
    },
    twitter: {
      card: seo.twitterCard,
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [seo.ogImage],
    },
  };
}

export { SITE_ORIGIN, SITE_NAME };
