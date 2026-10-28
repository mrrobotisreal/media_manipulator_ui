/**
 * MM85: the real "last materially changed" date of each core page, for the
 * sitemap's lastModified and nothing else. Hand-maintained: bump a page's date
 * in the same commit that changes what a visitor reads on it (copy, sections,
 * tables), not for refactors or styling. Every date below was read from
 * `git log` on the page's view and its i18n section when MM85 created the file.
 *
 * Tool pages carry their own `lastReviewed` in content/toolPages.ts, blog posts
 * their `dateModified` in lib/blogPosts.ts, tutorials theirs in
 * content/tutorialDates.ts, and /changelog uses its newest entry.
 */
export const PAGE_DATES = {
  // MM85: hero reorder and the longer home prose.
  '/': '2026-10-28',
  // Tool page entry + guide copy (MM26 retention wording).
  '/tools/content-studio': '2026-10-23',
  // MM85: "available on request" wording in the plan table.
  '/tools/motion': '2026-10-28',
  // MM85: named founder block.
  '/about': '2026-10-28',
  // MM26 retention wording.
  '/how-it-works': '2026-10-23',
  // MM48 added the Motion tutorial card.
  '/tutorials': '2026-10-26',
  // MM85: section 1.11 (contact messages).
  '/privacy-policy': '2026-10-28',
  // MM78 voices terms (section 8.11).
  '/terms-of-service': '2026-10-28',
  // The catalog rebuild that lists every tool.
  '/tools': '2026-10-28',
  // MM69 currency toggle.
  '/pricing': '2026-10-26',
  // MM78 voice pages and results.
  '/voices': '2026-10-28',
  // MM47 licence entries.
  '/licenses': '2026-10-26',
  // MM85: new page.
  '/contact': '2026-10-28',
} as const satisfies Record<string, string>;

export type DatedPage = keyof typeof PAGE_DATES;

/**
 * MM85: tutorials' publication and last-edit dates from `git log` (first commit
 * of the view; last commit that changed its English text in the view or in
 * interface/articles.json / pages.json `tutorials.tutorials.*`). Rendered in
 * the byline, the TechArticle JSON-LD and the sitemap.
 */
export const TUTORIAL_DATES = {
  '/tutorials/audio/getting-started': { datePublished: '2026-05-17', dateModified: '2026-10-23' },
  '/tutorials/video/getting-started': { datePublished: '2026-05-17', dateModified: '2026-05-24' },
  '/tutorials/image/getting-started': { datePublished: '2026-05-17', dateModified: '2026-10-23' },
  '/tutorials/ai-frame-interpolation': { datePublished: '2026-05-24', dateModified: '2026-05-24' },
  '/tutorials/content-studio': { datePublished: '2026-05-30', dateModified: '2026-10-24' },
  '/tutorials/motion': { datePublished: '2026-10-26', dateModified: '2026-10-26' },
} as const satisfies Record<string, { datePublished: string; dateModified: string }>;

export type TutorialPath = keyof typeof TUTORIAL_DATES;

/**
 * Fallback `lastReviewed` for a tool page that does not set its own: the last
 * commit that changed content/toolPages.ts as a whole (the 2026-10-28 catalog
 * work). MM84 sets `lastReviewed` per page as it rewrites each one.
 */
export const TOOL_PAGES_DEFAULT_REVIEWED = '2026-10-28';
