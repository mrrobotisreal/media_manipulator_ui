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

  // 2. pagead2 (AdSense JS) only inside the guarded AdBanner implementation.
  if (text.includes('pagead2.googlesyndication.com') && rel !== AD_IMPL) {
    fail(rel, 'references pagead2.googlesyndication.com outside the guarded AdBanner');
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

// Built-link check (post-build): the homepage and review-allowed tool pages
// must not link to non-allowlisted /tools/<slug> pages.
const builtAppDir = join(ROOT, '.next', 'server', 'app');
if (existsSync(builtAppDir)) {
  const reviewHtml = [];
  const home = join(builtAppDir, 'index.html');
  if (existsSync(home)) reviewHtml.push(home);
  const toolsIndex = join(builtAppDir, 'tools.html');
  if (existsSync(toolsIndex)) reviewHtml.push(toolsIndex);
  const toolsDir = join(builtAppDir, 'tools');
  if (existsSync(toolsDir)) {
    const collect = (dir) => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) collect(full);
        else if (name.endsWith('.html')) reviewHtml.push(full);
      }
    };
    collect(toolsDir);
  }

  for (const abs of reviewHtml) {
    const html = readFileSync(abs, 'utf8');
    const rel = relative(ROOT, abs).split(sep).join('/');
    const hrefs = [...html.matchAll(/href="(\/tools\/[^"#?]*)"/g)].map((m) => m[1]);
    for (const href of hrefs) {
      const slug = href.replace(/^\/tools\//, '').replace(/\/+$/, '').split('/')[0];
      if (!slug) continue; // "/tools" itself
      if (!ALLOWED_SLUGS.has(slug)) {
        fail(rel, `links to non-allowlisted tool page /tools/${slug}`);
      }
    }
  }
} else {
  console.warn(
    '! Built-link check skipped: run `npm run build` first to verify review pages do not link to non-allowlisted tools.',
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
  console.error('\n✗ AdSense audit FAILED:\n');
  for (const v of violations) console.error('  - ' + v);
  console.error(`\n${violations.length} violation(s).\n`);
  process.exit(1);
}

console.log('✓ AdSense audit passed — no review-unsafe ad patterns found.');
