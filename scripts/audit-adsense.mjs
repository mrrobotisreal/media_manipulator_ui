#!/usr/bin/env node
/**
 * AdSense review-safety audit.
 *
 * Fails (exit 1) if any review-unsafe ad pattern is found in runtime source or
 * build output. Documentation under docs/ is exempt (it intentionally records
 * the historical placeholder names and real slot IDs).
 *
 * Run: npm run audit:ads
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { auditLocalePages } from './lib/audit-locales.mjs';
import { loadLocales } from './lib/load-locales.mjs';

const ROOT = process.cwd();
const SCAN_DIRS = ['app', 'components', 'content', 'lib', 'schemas', 'views', 'public'];
const TEXT_EXT = /\.(tsx?|jsx?|mjs|cjs|css|json|txt|html|xml)$/;

// Files allowed to contain the guarded AdSense implementation details.
// MM82 (ADR-0016): the script origin lives in lib/adsenseConfig.ts and the one
// loader is components/ads/adsense-loader.tsx; the <ins> unit (data-ad-slot)
// stays inside the guarded AdBanner.
const AD_SCRIPT_FILES = new Set([
  'lib/adsenseConfig.ts',
  'components/ads/adsense-loader.tsx',
]);
const AD_IMPL = 'components/ad-banner.tsx';
// Files allowed to import the AdBanner component (the single in-content site).
const ALLOWED_ADBANNER_IMPORTERS = new Set([
  'components/ad-banner.tsx',
  'components/tools/tool-landing-page.tsx',
]);

const violations = [];
const fail = (file, msg) => violations.push(`${file}: ${msg}`);

// Read the review allowlist straight from the source of truth so the audit
// stays in sync with content/reviewAllowlist.ts.
function loadAllowlist() {
  const src = readFileSync(join(ROOT, 'content/reviewAllowlist.ts'), 'utf8');
  const block = src.match(/REVIEW_INDEXED_TOOL_SLUGS\s*=\s*\[([^\]]*)\]/s);
  if (!block) return new Set();
  return new Set(
    [...block[1].matchAll(/['"]([a-z0-9-]+)['"]/g)].map((m) => m[1]),
  );
}
const ALLOWED_SLUGS = loadAllowlist();

// MM84: the pending set (the other 7 copy-bar pages) and the alias map, read
// from their sources of truth like the allowlist above.
function loadPending() {
  const src = readFileSync(join(ROOT, 'content/reviewAllowlist.ts'), 'utf8');
  const block = src.match(/PENDING_ALLOWLIST\s*=\s*\[([^\]]*)\]/s);
  if (!block) return new Set();
  return new Set([...block[1].matchAll(/['"]([a-z0-9-]+)['"]/g)].map((m) => m[1]));
}
function loadAliases() {
  const src = readFileSync(join(ROOT, 'content/toolAliases.ts'), 'utf8');
  const block = src.match(/TOOL_ALIAS_OF\s*=\s*\{([\s\S]*?)\}\s*as const/);
  if (!block) return new Map();
  return new Map([...block[1].matchAll(/['"]([a-z0-9-]+)['"]\s*:\s*['"]([a-z0-9-]+)['"]/g)].map((m) => [m[1], m[2]]));
}
const PENDING_SLUGS = loadPending();
const ALIAS_OF = loadAliases();
// Linkable without rel="nofollow" on en.html and en/tools.html while the
// full-index flag is off: the allowlist plus the pending set (decision 4).
const LISTED_SLUGS = new Set([...ALLOWED_SLUGS, ...PENDING_SLUGS]);
if (ALIAS_OF.size === 0) fail('content/toolAliases.ts', 'could not read TOOL_ALIAS_OF (alias rule would be blind)');
if (PENDING_SLUGS.size === 0) fail('content/reviewAllowlist.ts', 'could not read PENDING_ALLOWLIST');

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.next' || name === '.git') continue;
      out.push(...walk(full));
    } else if (TEXT_EXT.test(name)) {
      out.push(full);
    }
  }
  return out;
}

const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)));

for (const abs of files) {
  const rel = relative(ROOT, abs).split(sep).join('/');
  if (rel.startsWith('docs/')) continue;
  const text = readFileSync(abs, 'utf8');

  // 1. No PLACEHOLDER-* in runtime source.
  if (text.includes('PLACEHOLDER-')) {
    fail(rel, 'contains PLACEHOLDER- (placeholder ad slot) in runtime source');
  }

  // 2. pagead2 (AdSense JS) only in the config and the layout loader.
  if (text.includes('pagead2.googlesyndication.com') && !AD_SCRIPT_FILES.has(rel)) {
    fail(rel, 'references pagead2.googlesyndication.com outside lib/adsenseConfig.ts / components/ads/adsense-loader.tsx');
  }

  // 3. data-ad-slot only inside the guarded AdBanner implementation.
  if (text.includes('data-ad-slot') && rel !== AD_IMPL) {
    fail(rel, 'uses data-ad-slot outside the guarded AdBanner');
  }

  // 4. MobileAnchorAd must not be imported/rendered by active app code.
  if (
    rel !== 'components/mobile-anchor-ad.tsx' &&
    /from\s+['"]@?\/?.*mobile-anchor-ad['"]/.test(text)
  ) {
    fail(rel, 'imports MobileAnchorAd (disabled for review)');
  }

  // 5. AlternativeAdBanner must not be imported by active code.
  if (
    rel !== 'components/alternative-ad-banner.tsx' &&
    /alternative-ad-banner/.test(text)
  ) {
    fail(rel, 'imports AlternativeAdBanner (disabled for review)');
  }

  // 6. AdBanner may only be imported by the allowlisted in-content site.
  if (
    /from\s+['"][^'"]*\/ad-banner['"]/.test(text) &&
    !ALLOWED_ADBANNER_IMPORTERS.has(rel)
  ) {
    fail(rel, 'imports AdBanner — only the tool landing page may host an in-content ad');
  }

  // 7. Legacy AD_SLOTS map must be gone from runtime source.
  if (/\bAD_SLOTS\b/.test(text)) {
    fail(rel, 'references the removed AD_SLOTS map');
  }

  // 8. The ad-path guard must check the review allowlist, not a bare
  //    startsWith('/tools/'). Inspect the isReviewAllowedAdPath source.
  if (rel === 'lib/adsenseConfig.ts') {
    const fn = text.match(
      /function isReviewAllowedAdPath[\s\S]*?\n}/,
    );
    const body = fn ? fn[0] : '';
    if (!/isReviewIndexedToolSlug/.test(body)) {
      fail(
        rel,
        'isReviewAllowedAdPath must gate on isReviewIndexedToolSlug (not a generic /tools/* allow)',
      );
    }
  }
}

// macOS artifacts must not exist anywhere in the repo (outside deps/build/vcs).
function walkArtifacts(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', 'out'].includes(entry.name)) continue;
      out.push(...walkArtifacts(full));
    } else if (entry.name === '.DS_Store' || entry.name.startsWith('._')) {
      out.push(full);
    }
  }
  return out;
}
for (const abs of walkArtifacts(ROOT)) {
  fail(relative(ROOT, abs).split(sep).join('/'), 'macOS artifact file must not be committed');
}

// Build output (if present) must be free of PLACEHOLDER-*.
const nextDir = join(ROOT, '.next');
if (existsSync(nextDir)) {
  for (const abs of walkBuild(nextDir)) {
    const text = readFileSync(abs, 'utf8');
    if (text.includes('PLACEHOLDER-')) {
      fail(relative(ROOT, abs).split(sep).join('/'), 'PLACEHOLDER- found in build output');
      break; // one report is enough
    }
  }
}

// ---------------------------------------------------------------------------
// Built-HTML checks (post-build, MM82 decision 7).
//
// English pages are prerendered under the internal /en segment (proxy.ts
// rewrites the public unprefixed URLs to it), so the build's HTML lives at
// .next/server/app/en.html and .next/server/app/en/**/*.html. The pre-MM82
// check looked at index.html / tools/ and silently scanned zero files.
// ---------------------------------------------------------------------------
const builtAppDir = join(ROOT, '.next', 'server', 'app');
const notes = [];
const warnings = [];

function collectHtml(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...collectHtml(full));
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

// Slot ids per tool, read from the runtime source of truth (lib/adSlots.ts).
function loadToolSlots() {
  const src = readFileSync(join(ROOT, 'lib/adSlots.ts'), 'utf8');
  const generic = src.match(/GENERIC_INCONTENT_MREC\s*=\s*'([0-9]+)'/)?.[1];
  const map = new Map();
  for (const m of src.matchAll(/'([a-z0-9-]+)':\s*\{\s*incontent:\s*([^}]+?)\s*\}/g)) {
    const raw = m[2].trim();
    const id = raw === 'GENERIC_INCONTENT_MREC' ? generic : raw.match(/'([0-9]+)'/)?.[1];
    if (id) map.set(m[1], id);
  }
  return map;
}

let scannedHtml = 0;
if (existsSync(builtAppDir)) {
  const enRoot = join(builtAppDir, 'en.html');
  const enDir = join(builtAppDir, 'en');
  const builtHtml = [...(existsSync(enRoot) ? [enRoot] : []), ...collectHtml(enDir)];
  scannedHtml = builtHtml.length;
  const relOf = (abs) => relative(builtAppDir, abs).split(sep).join('/');
  const byRel = new Map(builtHtml.map((abs) => [relOf(abs), abs]));

  // (a) A build exists but no English HTML was found: the check is blind.
  if (builtHtml.length === 0) {
    fail('.next/server/app', 'built-HTML check found 0 English HTML files (expected en.html and en/**/*.html)');
  }

  // Ads-on build? The ADSENSE_ENABLED preconnect is in every page's <head>
  // when the build had NEXT_PUBLIC_ADSENSE_ENABLED=true; the env is honoured too.
  const enHtml = existsSync(enRoot) ? readFileSync(enRoot, 'utf8') : '';
  const adsOnBuild =
    process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' || enHtml.includes('pagead2.googlesyndication.com');

  // (b) Pages that must never carry Google's ad script or a unit.
  const INELIGIBLE = [
    'en.html',
    'en/pricing.html',
    'en/account.html',
    'en/privacy-policy.html',
    'en/terms-of-service.html',
    'en/tools.html',
  ];
  for (const rel of INELIGIBLE) {
    const abs = byRel.get(rel);
    if (!abs) {
      if (builtHtml.length) fail(`.next/server/app/${rel}`, 'expected ineligible page missing from the build');
      continue;
    }
    const html = readFileSync(abs, 'utf8');
    if (html.includes('adsbygoogle')) {
      fail(`.next/server/app/${rel}`, 'ineligible page contains adsbygoogle (loader or unit)');
    }
  }

  // (c) Eligible pages: with ads on, every allowlisted tool page that has a
  // slot carries the loader, and its slot id is in the page. The <ins> itself
  // renders on the client once the tier resolves (MM82 decision 3: nothing
  // while auth loads, and a static prerender always is), so the id is matched
  // as data-ad-slot="…" or as AdBanner's adSlot prop in the RSC payload.
  const toolSlots = loadToolSlots();
  let eligibleWithUnit = 0;
  for (const [slug, slot] of toolSlots) {
    if (!ALLOWED_SLUGS.has(slug)) continue;
    const rel = `en/tools/${slug}.html`;
    const abs = byRel.get(rel);
    if (!abs) continue;
    const html = readFileSync(abs, 'utf8');
    const hasLoader = html.includes('adsbygoogle.js?client=');
    const hasSlot =
      html.includes(`data-ad-slot="${slot}"`) ||
      html.includes(`"adSlot":"${slot}"`) ||
      html.includes(`\\"adSlot\\":\\"${slot}\\"`);
    if (adsOnBuild) {
      if (!hasLoader) fail(`.next/server/app/${rel}`, 'ad-eligible tool page is missing the adsbygoogle.js loader');
      if (!hasSlot) fail(`.next/server/app/${rel}`, `ad-eligible tool page is missing its slot ${slot}`);
      if (hasLoader && hasSlot) eligibleWithUnit += 1;
    } else if (hasLoader) {
      fail(`.next/server/app/${rel}`, 'adsbygoogle.js loader present in a build with ads disabled');
    }
  }
  if (adsOnBuild) {
    if (eligibleWithUnit === 0) {
      fail('.next/server/app/en/tools', 'ads-on build: no allowlisted tool page carries the loader and a slot');
    } else {
      notes.push(`ads-on build: ${eligibleWithUnit} allowlisted tool page(s) carry the loader and their slot`);
    }
  } else {
    notes.push('eligible-page rule skipped: build ran without NEXT_PUBLIC_ADSENSE_ENABLED=true');
  }

  // MM84 decision 6. Every <a href="/tools/<slug>"> in the English build:
  //  (a) an alias slug may not be linked from any built page, nofollow or not
  //      (aliases canonicalise elsewhere and are never listed);
  //  (b) on en.html and en/tools.html a link to a slug outside the allowlist +
  //      pending set must carry rel="nofollow";
  //  (c) on an allowlisted tool page (en/tools/<slug>.html) every tool link
  //      must point inside the allowlist + pending set (related links, MM84
  //      decision 5);
  //  other pages are reported for information.
  const toolAnchors = (html) => {
    const out = [];
    for (const m of html.matchAll(/<a\b[^>]*>/g)) {
      const tag = m[0];
      const href = /\bhref="(\/tools\/[^"#?]*)"/.exec(tag)?.[1];
      if (!href) continue;
      const slug = href.replace(/^\/tools\//, '').replace(/\/+$/, '').split('/')[0];
      if (!slug) continue;
      out.push({ slug, nofollow: /\brel="[^"]*\bnofollow\b[^"]*"/.test(tag) });
    }
    return out;
  };
  const infoPages = [];
  const linkCounts = { listed: 0, nofollow: 0, alias: 0 };
  for (const abs of builtHtml) {
    const rel = relOf(abs);
    const anchors = toolAnchors(readFileSync(abs, 'utf8'));
    const isCatalog = rel === 'en.html' || rel === 'en/tools.html';
    const isToolPage = /^en\/tools\/[^/]+\.html$/.test(rel);
    const toolSlug = isToolPage ? rel.replace(/^en\/tools\//, '').replace(/\.html$/, '') : null;
    const off = new Set();
    for (const a of anchors) {
      if (ALIAS_OF.has(a.slug) && a.slug !== toolSlug) {
        fail(`.next/server/app/${rel}`, `links to alias tool page /tools/${a.slug} (canonical: /tools/${ALIAS_OF.get(a.slug)})`);
        if (rel === 'en/tools.html') linkCounts.alias += 1;
        continue;
      }
      const listed = LISTED_SLUGS.has(a.slug);
      if (rel === 'en/tools.html') {
        if (listed) linkCounts.listed += 1;
        else if (a.nofollow) linkCounts.nofollow += 1;
      }
      if (listed) continue;
      if (isCatalog) {
        if (!a.nofollow) fail(`.next/server/app/${rel}`, `links to non-allowlisted tool page /tools/${a.slug} without rel="nofollow"`);
      } else if (isToolPage && toolSlug && ALLOWED_SLUGS.has(toolSlug)) {
        fail(`.next/server/app/${rel}`, `links to non-allowlisted tool page /tools/${a.slug}`);
      } else {
        off.add(a.slug);
      }
    }
    if (off.size) infoPages.push(`${rel} (${off.size})`);
  }
  // MM84 acceptance 2: every alias page in the build canonicalises to its
  // primary and is noindex, follow.
  let aliasPagesChecked = 0;
  for (const [alias, target] of ALIAS_OF) {
    const rel = `en/tools/${alias}.html`;
    const abs = byRel.get(rel);
    if (!abs) {
      fail(`.next/server/app/${rel}`, 'alias page missing from the build (expected prerendered)');
      continue;
    }
    const html = readFileSync(abs, 'utf8');
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? '';
    if (!canonical.endsWith(`/tools/${target}`)) fail(`.next/server/app/${rel}`, `alias canonical is "${canonical}", expected …/tools/${target}`);
    if (!/<meta name="robots" content="noindex, follow"/.test(html)) fail(`.next/server/app/${rel}`, 'alias page is not "noindex, follow"');
    if (/hreflang=/.test(html)) fail(`.next/server/app/${rel}`, 'alias page advertises hreflang alternates');
    aliasPagesChecked += 1;
  }
  notes.push(`alias pages: ${aliasPagesChecked}/${ALIAS_OF.size} canonicalise to their primary with noindex, follow`);
  if (byRel.has('en/tools.html')) {
    notes.push(
      `en/tools.html tool links: ${linkCounts.listed} allowlisted/pending, ${linkCounts.nofollow} nofollow, ${linkCounts.alias} alias`,
    );
  }
  if (infoPages.length) {
    notes.push(`not enforced, links to non-allowlisted tool pages: ${infoPages.join(', ')}`);
  }

  // MM86 decision 6: every locale's built HTML. A non-English allowlisted tool
  // page is noindex or carries no English privacy note; an indexable page
  // advertises hreflang only to reviewed locales; an unreviewed locale has no
  // indexable page.
  const { locales: localeDefs } = await loadLocales(ROOT);
  const allHtml = collectHtml(builtAppDir).map(relOf);
  const localeAudit = auditLocalePages({
    readHtml: (rel) => (existsSync(join(builtAppDir, rel)) ? readFileSync(join(builtAppDir, rel), 'utf8') : null),
    relPaths: allHtml,
    slugs: [...ALLOWED_SLUGS],
    locales: localeDefs,
  });
  for (const v of localeAudit.violations) fail('.next/server/app/' + v.split(':')[0], v.slice(v.indexOf(':') + 2));
  notes.push(...localeAudit.notes);
} else {
  console.warn(
    '! Built-HTML checks skipped: run `npm run build` first (no .next/server/app).',
  );
}

function walkBuild(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      // Skip the dev server cache + dev-only artifacts; we audit the production
      // build output (.next/server, .next/static) emitted by `next build`.
      if (name === 'cache' || name === 'dev') continue;
      out.push(...walkBuild(full));
    } else if (/\.(js|html|json|txt)$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

if (violations.length) {
  if (existsSync(builtAppDir)) console.error(`· built-HTML checks scanned ${scannedHtml} English HTML file(s)`);
  console.error('\n✗ AdSense audit FAILED:\n');
  for (const v of violations) console.error('  - ' + v);
  console.error(`\n${violations.length} violation(s).\n`);
  process.exit(1);
}

for (const w of warnings) console.warn('! ' + w);
for (const n of notes) console.log('· ' + n);
if (existsSync(builtAppDir)) console.log(`· built-HTML checks scanned ${scannedHtml} English HTML file(s)`);
console.log('✓ AdSense audit passed — no review-unsafe ad patterns found.');
