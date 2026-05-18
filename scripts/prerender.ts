/**
 * Postbuild prerender for Media Manipulator's public SEO routes.
 *
 * Reads dist/index.html (output of `vite build`) and writes one HTML file
 * per route in src/lib/seo.ts. Each emitted file contains route-specific
 * <title>, <meta description>, canonical URL, Open Graph and Twitter card
 * tags, plus all JSON-LD blocks for the route.
 *
 * The body of the page is still hydrated by React when the SPA loads
 * (the original <div id="root"> shell from index.html is preserved), so
 * users get the full app experience while crawlers and social card
 * scrapers see the correct metadata immediately.
 *
 * If you add a new public route:
 *  1. Add a Route to src/Router.tsx
 *  2. Add an entry to src/lib/seo.ts
 *  3. Add it to public/sitemap.xml
 *  4. Rebuild — this script will pick it up automatically.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAllRouteSeo, type RouteSeo } from '../src/lib/seo.ts';

const __filename = fileURLToPath(import.meta.url);
const ROOT = dirname(dirname(__filename));
const DIST = join(ROOT, 'dist');
const TEMPLATE_PATH = join(DIST, 'index.html');

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildHeadTags = (seo: RouteSeo): string => {
  const tags: string[] = [];
  tags.push(`<link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}">`);
  tags.push(`<meta name="description" content="${escapeHtml(seo.description)}">`);
  tags.push(
    `<meta name="keywords" content="${escapeHtml(seo.keywords.join(', '))}">`,
  );
  tags.push(`<meta property="og:title" content="${escapeHtml(seo.ogTitle)}">`);
  tags.push(
    `<meta property="og:description" content="${escapeHtml(seo.ogDescription)}">`,
  );
  tags.push(`<meta property="og:type" content="${escapeHtml(seo.ogType)}">`);
  tags.push(`<meta property="og:url" content="${escapeHtml(seo.canonicalUrl)}">`);
  tags.push(`<meta property="og:image" content="${escapeHtml(seo.ogImage)}">`);
  tags.push(`<meta property="og:site_name" content="Media Manipulator">`);
  tags.push(`<meta name="twitter:card" content="${escapeHtml(seo.twitterCard)}">`);
  tags.push(`<meta name="twitter:title" content="${escapeHtml(seo.ogTitle)}">`);
  tags.push(
    `<meta name="twitter:description" content="${escapeHtml(seo.ogDescription)}">`,
  );
  tags.push(`<meta name="twitter:image" content="${escapeHtml(seo.ogImage)}">`);
  seo.jsonLd.forEach((data) => {
    const safe = JSON.stringify(data).replace(/</g, '\\u003c');
    tags.push(
      `<script type="application/ld+json" data-managed-by="media-manipulator-seo">${safe}</script>`,
    );
  });
  return tags.join('\n    ');
};

const PRERENDER_MARKER_OPEN = '<!-- prerender:meta:start -->';
const PRERENDER_MARKER_CLOSE = '<!-- prerender:meta:end -->';

const stripExistingPrerenderBlock = (html: string): string => {
  const startIdx = html.indexOf(PRERENDER_MARKER_OPEN);
  const endIdx = html.indexOf(PRERENDER_MARKER_CLOSE);
  if (startIdx === -1 || endIdx === -1) return html;
  return (
    html.slice(0, startIdx) +
    html.slice(endIdx + PRERENDER_MARKER_CLOSE.length)
  );
};

const stripExistingMetaForReplacement = (html: string): string => {
  return html
    .replace(/<meta name="description"[^>]*>\s*/gi, '')
    .replace(/<meta name="keywords"[^>]*>\s*/gi, '')
    .replace(/<link rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<meta property="og:[^"]+"[^>]*>\s*/gi, '')
    .replace(/<meta name="twitter:[^"]+"[^>]*>\s*/gi, '')
    .replace(
      /<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi,
      '',
    );
};

const renderRoute = (template: string, seo: RouteSeo): string => {
  let html = stripExistingPrerenderBlock(template);
  html = stripExistingMetaForReplacement(html);

  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(seo.title)}</title>`,
  );

  const block = `${PRERENDER_MARKER_OPEN}\n    ${buildHeadTags(seo)}\n    ${PRERENDER_MARKER_CLOSE}`;
  html = html.replace('</head>', `    ${block}\n  </head>`);
  return html;
};

const targetPathFor = (route: string): string => {
  if (route === '/') return join(DIST, 'index.html');
  const trimmed = route.replace(/^\//, '');
  return join(DIST, trimmed, 'index.html');
};

async function main(): Promise<void> {
  let template: string;
  try {
    template = await readFile(TEMPLATE_PATH, 'utf8');
  } catch (err) {
    console.error(
      `[prerender] Could not read ${TEMPLATE_PATH}. Run \`vite build\` first.`,
    );
    throw err;
  }

  const routes = getAllRouteSeo();
  for (const seo of routes) {
    const html = renderRoute(template, seo);
    const target = targetPathFor(seo.path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, html, 'utf8');
    console.log(`[prerender] wrote ${target.replace(ROOT, '.')}`);
  }
  console.log(`[prerender] done — ${routes.length} routes prerendered`);
}

main().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
