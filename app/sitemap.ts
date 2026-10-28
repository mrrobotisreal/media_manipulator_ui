import type { MetadataRoute } from 'next';
import { REVIEW_INDEXED_TOOL_SLUGS } from '@/content/reviewAllowlist';
import { TOOL_PAGES } from '@/content/toolPages';
import { BLOG_POSTS } from '@/lib/blogPosts';
import { languageAlternates } from '@/lib/metadata';
import { SITE_ORIGIN } from '@/lib/seo';
import { isSeoFullIndex } from '@/lib/seoFlags';
import { CHANGELOG } from '@/content/changelog';
import { isTranslatorEnv } from '@/lib/translator/mode';
import { PAGE_DATES, TOOL_PAGES_DEFAULT_REVIEWED, TUTORIAL_DATES } from '@/content/pageDates';

// Review-safe sitemap: the core pages, the review-allowed tool pages and (MM85)
// the blog and tutorial detail pages, which are original, bylined and dated.
// Deliberately excludes the rest of the tool catalog and thin/placeholder pages. The private /dr Double Raven partner
// portal is intentionally excluded too (this is an allowlist, so /dr is never
// emitted; it is also disallowed in robots.ts and noindex'd via metadata).
// MM34: with NEXT_PUBLIC_SEO_FULL_INDEX on (post-approval only) the sitemap
// also lists every tool slug in content/toolPages.ts and /changelog. With the
// flag off (default) none of that is emitted.
//
// MM85: every lastModified is a real date (content/pageDates.ts, a tool's
// lastReviewed, a post's dateModified, the newest changelog entry), never the
// build time.
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

  // Each path is emitted once, with English as the primary URL and hreflang
  // alternates for the TRANSLATED locales only (all 18 since MM68, driven by
  // the `translated` flag in i18n/locales.ts) plus x-default → English.
  const entry = (
    path: string,
    lastModified: string,
    changeFrequency: 'weekly' | 'monthly',
    priority: number,
  ) => ({
    url: new URL(path, SITE_ORIGIN).toString(),
    lastModified: new Date(lastModified),
    changeFrequency,
    priority,
    alternates: { languages: languageAlternates(path) },
  });

  const coreEntries = CORE_ROUTES.map((route) =>
    entry(route, PAGE_DATES[route], route === '/' ? 'weekly' : 'monthly', route === '/' ? 1 : 0.7),
  );

  const toolEntries = REVIEW_INDEXED_TOOL_SLUGS.filter((slug) => !CORE_TOOL_SLUGS.has(slug)).map((slug) =>
    entry('/tools/' + slug, toolLastReviewed(slug), 'monthly', 0.8),
  );

  // MM85: the best writing on the site joins the review sitemap.
  const blogEntries = BLOG_POSTS.map((post) => entry(post.path, post.dateModified, 'monthly', 0.6));
  const tutorialEntries = (Object.keys(TUTORIAL_DATES) as Array<keyof typeof TUTORIAL_DATES>).map((path) =>
    entry(path, TUTORIAL_DATES[path].dateModified, 'monthly', 0.6),
  );

  if (!isSeoFullIndex()) return [...coreEntries, ...toolEntries, ...blogEntries, ...tutorialEntries];

  const seen = new Set<string>(toolEntries.map((e) => e.url));
  const fullToolEntries = TOOL_PAGES.map((t) => t.slug)
    .filter((slug) => !CORE_TOOL_SLUGS.has(slug))
    .map((slug) => entry('/tools/' + slug, toolLastReviewed(slug), 'monthly', 0.8))
    .filter((e) => !seen.has(e.url));

  // Original content, so it is indexable, but only listed under the flag.
  const changelogEntry = entry('/changelog', CHANGELOG[0]?.date ?? PAGE_DATES['/'], 'weekly', 0.5);

  return [...coreEntries, ...toolEntries, ...fullToolEntries, ...blogEntries, ...tutorialEntries, changelogEntry];
}

/** A tool page's own lastReviewed, else the catalog-wide default (MM84 sets it per page). */
function toolLastReviewed(slug: string): string {
  return TOOL_PAGES.find((t) => t.slug === slug)?.lastReviewed ?? TOOL_PAGES_DEFAULT_REVIEWED;
}
