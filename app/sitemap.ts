import type { MetadataRoute } from 'next';
import { REVIEW_INDEXED_TOOL_SLUGS } from '@/content/reviewAllowlist';
import { SITE_ORIGIN } from '@/lib/seo';

// Review-safe sitemap: only the core pages + the review-allowed tool pages.
// Deliberately excludes the full 65-tool catalog, thin/placeholder pages, and
// (for now) blog/tutorial detail pages. The private /dr Double Raven partner
// portal is intentionally excluded too (this is an allowlist, so /dr is never
// emitted; it is also disallowed in robots.ts and noindex'd via metadata).
const CORE_ROUTES = [
  '/',
  '/tools/content-studio',
  '/about',
  '/how-it-works',
  '/tutorials',
  '/privacy-policy',
  '/terms-of-service',
  '/tools',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const coreEntries = CORE_ROUTES.map((route) => ({
    url: new URL(route, SITE_ORIGIN).toString(),
    lastModified: now,
    changeFrequency: route === '/' ? ('weekly' as const) : ('monthly' as const),
    priority: route === '/' ? 1 : 0.7,
  }));

  const toolEntries = REVIEW_INDEXED_TOOL_SLUGS.filter(
    (slug) => slug !== 'content-studio',
  ).map((slug) => ({
    url: new URL('/tools/' + slug, SITE_ORIGIN).toString(),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...coreEntries, ...toolEntries];
}
