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

  // Links to non-allowlisted tool pages. Enforced on the home page and the
  // allowlisted tool pages; /tools (en/tools.html) is a warning until MM84
  // changes that page; other pages are reported for information.
  const offAllowlistLinks = (html) => {
    const slugs = new Set();
    for (const m of html.matchAll(/href="(\/tools\/[^"#?]*)"/g)) {
      const slug = m[1].replace(/^\/tools\//, '').replace(/\/+$/, '').split('/')[0];
      if (slug && !ALLOWED_SLUGS.has(slug)) slugs.add(slug);
    }
    return slugs;
  };
  const infoPages = [];
  for (const abs of builtHtml) {
    const rel = relOf(abs);
    const bad = offAllowlistLinks(readFileSync(abs, 'utf8'));
    if (!bad.size) continue;
    const enforced = rel === 'en.html' || /^en\/tools\/[^/]+\.html$/.test(rel);
    if (enforced) {
      for (const slug of bad) fail(`.next/server/app/${rel}`, `links to non-allowlisted tool page /tools/${slug}`);
    } else if (rel === 'en/tools.html') {
      warnings.push(`en/tools.html links to ${bad.size} non-allowlisted tool page(s) (fan-out rule moves to MM84; not a failure)`);
    } else {
      infoPages.push(`${rel} (${bad.size})`);
    }
  }
  if (infoPages.length) {
    notes.push(`not enforced, links to non-allowlisted tool pages: ${infoPages.join(', ')}`);
  }
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
