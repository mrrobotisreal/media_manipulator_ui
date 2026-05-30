/**
 * Generate sitemap.xml from the central SEO route map.
 *
 * `public/sitemap.xml` is the source of truth crawlers fetch, and historically
 * it has been hand-edited whenever a route was added. This script derives the
 * full sitemap from `getAllRouteSeo()` (the same map that powers prerendering)
 * so the two never drift.
 *
 * Usage:
 *   npm run sitemap            # print the generated sitemap to stdout (review)
 *   npm run sitemap -- --write # overwrite public/sitemap.xml in place
 *
 * Priorities/changefreq are heuristic: the homepage is highest and updated
 * weekly; tool landing pages are high-value (0.8); legal pages are low. Adjust
 * the heuristics below if the strategy changes. noindex routes (e.g. /404) are
 * skipped.
 */
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAllRouteSeo, SITE_ORIGIN, type RouteSeo } from '../src/lib/seo.ts';

const __filename = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(__filename));
const OUT_PATH = join(ROOT, 'public', 'sitemap.xml');

// ISO date (YYYY-MM-DD) for <lastmod>. Overridable via --lastmod=YYYY-MM-DD so
// CI can pin a deterministic value if desired.
const lastmodArg = process.argv.find((a) => a.startsWith('--lastmod='));
const LASTMOD = lastmodArg
  ? lastmodArg.slice('--lastmod='.length)
  : new Date().toISOString().slice(0, 10);

interface SitemapHints {
  changefreq: 'weekly' | 'monthly';
  priority: string;
}

const hintsFor = (route: RouteSeo): SitemapHints => {
  if (route.path === '/') return { changefreq: 'weekly', priority: '1.0' };
  if (route.path === '/privacy-policy' || route.path === '/terms-of-service') {
    return { changefreq: 'monthly', priority: '0.3' };
  }
  if (route.path.startsWith('/tools/')) return { changefreq: 'monthly', priority: '0.8' };
  if (route.path === '/tools') return { changefreq: 'weekly', priority: '0.9' };
  if (route.path.startsWith('/tutorials')) return { changefreq: 'monthly', priority: '0.7' };
  if (route.path.startsWith('/blog')) return { changefreq: 'weekly', priority: '0.6' };
  return { changefreq: 'monthly', priority: '0.7' };
};

const urlBlock = (route: RouteSeo): string => {
  const { changefreq, priority } = hintsFor(route);
  const loc = route.path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route.path}`;
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${LASTMOD}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
};

const build = (): string => {
  const routes = getAllRouteSeo()
    .filter((r) => !r.noindex)
    .sort((a, b) => a.path.localeCompare(b.path));
  const body = routes.map(urlBlock).join('\n\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${body}

</urlset>
`;
};

async function main(): Promise<void> {
  const xml = build();
  if (process.argv.includes('--write')) {
    await writeFile(OUT_PATH, xml, 'utf8');
    console.log(`[sitemap] wrote ${OUT_PATH.replace(ROOT, '.')} (lastmod ${LASTMOD})`);
  } else {
    process.stdout.write(xml);
  }
}

main().catch((err) => {
  console.error('[sitemap] failed:', err);
  process.exit(1);
});
