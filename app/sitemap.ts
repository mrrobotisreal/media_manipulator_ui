import type { MetadataRoute } from 'next';
import { REVIEW_INDEXED_TOOL_SLUGS } from '@/content/reviewAllowlist';
import { TOOL_PAGES } from '@/content/toolPages';
import { BLOG_POSTS } from '@/lib/blogPosts';
import { languageAlternates } from '@/lib/metadata';
import { PUBLIC_ROUTES, ROUTE_SEO_MAP, SITE_ORIGIN } from '@/lib/seo';
import { isSeoFullIndex } from '@/lib/seoFlags';
import { CHANGELOG } from '@/content/changelog';
import { isTranslatorEnv } from '@/lib/translator/mode';

// Review-safe sitemap: only the core pages + the review-allowed tool pages.
// Deliberately excludes the full 65-tool catalog, thin/placeholder pages, and
// (for now) blog/tutorial detail pages. The private /dr Double Raven partner
// portal is intentionally excluded too (this is an allowlist, so /dr is never
// emitted; it is also disallowed in robots.ts and noindex'd via metadata).
// MM34: with NEXT_PUBLIC_SEO_FULL_INDEX on (post-approval only) the sitemap
// also lists every tool slug in content/toolPages.ts, the blog and tutorial
// detail pages and /changelog. With the flag off (default) none of that is
// emitted and the output is exactly the review-safe list below.
const CORE_ROUTES = [
  '/',
  '/tools/content-studio',
  // MM48: Motion's landing page, beside Darkroom (also in the review allowlist).
  '/tools/motion',
  '/about',
  '/how-it-works',
  '/tutorials',
  '/privacy-policy',
  '/terms-of-service',
  '/tools',
  // Phase 4. Public, indexable, and the one page that answers "what does this
  // cost" — the question an AdSense reviewer and a search visitor both ask.
  '/pricing',
  // Mitchell Wintrow's ElevenLabs voices, playable in eight languages.
  '/voices',
  // MM47's open-source licence notices (mediabunny MPL-2.0, anime.js, fflate);
  // indexable in translated locales, listed here by MM48.
  '/licenses',
  // MM85: the contact page (who runs the site, how to reach them).
  '/contact',
] as const;

/** Tool pages already emitted as core routes, so the tool lists skip them. */
const CORE_TOOL_SLUGS = new Set(['content-studio', 'motion']);

export default function sitemap(): MetadataRoute.Sitemap {
  // MM52: a translator deployment lists nothing.
  if (isTranslatorEnv()) return [];
  const now = new Date();

  // Each path is emitted once, with English as the primary URL and hreflang
  // alternates for the TRANSLATED locales only (all 18 since MM68, driven by
  // the `translated` flag in i18n/locales.ts) plus x-default → English. A
  // locale still serving copied-English files is deliberately absent here and
  // noindex'd in its page metadata until its real translation lands.
  const coreEntries = CORE_ROUTES.map((route) => ({
    url: new URL(route, SITE_ORIGIN).toString(),
    lastModified: now,
    changeFrequency: route === '/' ? ('weekly' as const) : ('monthly' as const),
    priority: route === '/' ? 1 : 0.7,
    alternates: { languages: languageAlternates(route) },
  }));

  const toolEntries = REVIEW_INDEXED_TOOL_SLUGS.filter(
    (slug) => !CORE_TOOL_SLUGS.has(slug),
  ).map((slug) => ({
    url: new URL('/tools/' + slug, SITE_ORIGIN).toString(),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: { languages: languageAlternates('/tools/' + slug) },
  }));

  if (!isSeoFullIndex()) return [...coreEntries, ...toolEntries];

  const seen = new Set<string>(toolEntries.map((e) => e.url));
  const fullToolEntries = TOOL_PAGES.map((t) => t.slug)
    .filter((slug) => !CORE_TOOL_SLUGS.has(slug))
    .map((slug) => ({
      url: new URL('/tools/' + slug, SITE_ORIGIN).toString(),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: { languages: languageAlternates('/tools/' + slug) },
    }))
    .filter((e) => !seen.has(e.url));

  const blogEntries = BLOG_POSTS.map((post) => ({
    url: new URL(post.path, SITE_ORIGIN).toString(),
    lastModified: new Date(post.dateModified),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    alternates: { languages: languageAlternates(post.path) },
  }));

  const tutorialEntries = PUBLIC_ROUTES.filter((p) =>
    p.startsWith('/tutorials/'),
  ).map((path) => ({
    url: new URL(path, SITE_ORIGIN).toString(),
    lastModified: tutorialLastModified(path) ?? now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    alternates: { languages: languageAlternates(path) },
  }));

  // Original content, so it is indexable, but only listed under the flag.
  const changelogEntry = {
    url: new URL('/changelog', SITE_ORIGIN).toString(),
    lastModified: new Date(CHANGELOG[0]?.date ?? now),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
    alternates: { languages: languageAlternates('/changelog') },
  };

  return [
    ...coreEntries,
    ...toolEntries,
    ...fullToolEntries,
    ...blogEntries,
    ...tutorialEntries,
    changelogEntry,
  ];
}

/** Real modified date from a tutorial's own Article JSON-LD, if it has one. */
function tutorialLastModified(path: string): Date | undefined {
  const ld = ROUTE_SEO_MAP[path]?.jsonLd ?? [];
  for (const item of ld) {
    const d = (item as { dateModified?: unknown }).dateModified;
    if (typeof d === 'string' && !Number.isNaN(Date.parse(d))) return new Date(d);
  }
  return undefined;
}
