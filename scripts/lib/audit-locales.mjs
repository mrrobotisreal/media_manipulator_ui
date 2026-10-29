/**
 * MM86 Decision 6: the built-HTML locale audit, shared by
 * `scripts/audit-adsense.mjs` (post-build gate) and
 * `scripts/lib/audit-locales.test.ts` (Vitest, synthetic HTML plus the real
 * build when one exists). Plain JS, no imports, so bare Node can run it.
 *
 * Rules, over `.next/server/app/<prefix>/tools/<slug>.html`:
 *  1. A non-English tool page for an allowlisted slug is either `noindex` or
 *     fully translated: the English page's privacy paragraph (each tool has
 *     its own since MM84) must not appear in it.
 *  2. Every `hreflang` on an indexable page (any built page) names a public
 *     locale (translated and reviewed) or x-default.
 *  3. A page in a locale that is not public is never indexable.
 */

/** The robots meta content of a built page, or '' when absent. */
export function robotsOf(html) {
  return /<meta name="robots" content="([^"]*)"/.exec(html)?.[1] ?? '';
}

/** True unless the page's robots meta says noindex. */
export function isIndexableHtml(html) {
  return !/\bnoindex\b/.test(robotsOf(html));
}

/** Every hreflang code advertised by a built page. */
export function hreflangsOf(html) {
  return [...html.matchAll(/<link[^>]*\bhref[Ll]ang="([^"]+)"[^>]*>/g)].map((m) => m[1]);
}

/** The text of the privacy paragraph a tool page renders (ToolLandingPage), or null. */
export function privacyParagraphOf(html) {
  // The privacy section is the one with the shield icon and the data-coloured
  // left border; its paragraph is the first muted `mt-1` paragraph after it.
  const m = /border-l-data[\s\S]*?<p class="text-sm text-muted-foreground mt-1">([^<]+)<\/p>/.exec(html);
  return m ? m[1] : null;
}

/**
 * @param {object} opts
 * @param {(rel: string) => string | null} opts.readHtml  HTML of a build-relative path, or null when absent
 * @param {string[]} opts.relPaths  every built HTML path (for rule 2)
 * @param {string[]} opts.slugs  allowlisted tool slugs (rule 1)
 * @param {{ code: string, prefix: string, translated: boolean, reviewed: boolean }[]} opts.locales
 * @returns {{ violations: string[], notes: string[], checked: number }}
 */
export function auditLocalePages({ readHtml, relPaths, slugs, locales }) {
  const violations = [];
  const notes = [];
  const publicCodes = new Set(locales.filter((l) => l.translated && l.reviewed).map((l) => l.code));
  const byPrefix = new Map(locales.map((l) => [l.prefix, l]));
  let checked = 0;
  let indexableTranslated = 0;

  // Rule 1: allowlisted tool pages under every non-English prefix.
  for (const slug of slugs) {
    const enHtml = readHtml(`en/tools/${slug}.html`);
    if (!enHtml) continue;
    const enPrivacy = privacyParagraphOf(enHtml);
    for (const l of locales) {
      if (l.prefix === 'en') continue;
      const rel = `${l.prefix}/tools/${slug}.html`;
      const html = readHtml(rel);
      if (!html) continue;
      checked += 1;
      if (!isIndexableHtml(html)) continue;
      indexableTranslated += 1;
      if (enPrivacy && html.includes(enPrivacy)) {
        violations.push(`${rel}: indexable but renders the English privacy note (English-fallback body)`);
      }
    }
  }

  // Rules 2 and 3: every built page.
  for (const rel of relPaths) {
    const html = readHtml(rel);
    if (!html) continue;
    const prefix = rel.split('/')[0].replace(/\.html$/, '');
    const def = byPrefix.get(prefix);
    const indexable = isIndexableHtml(html);
    if (!indexable) continue;
    if (def && !(def.translated && def.reviewed)) {
      violations.push(`${rel}: indexable page in unreviewed locale ${def.code}`);
    }
    for (const code of hreflangsOf(html)) {
      if (code !== 'x-default' && !publicCodes.has(code)) {
        violations.push(`${rel}: hreflang "${code}" is not a reviewed locale`);
      }
    }
  }

  notes.push(`locale audit: ${checked} non-English allowlisted tool page(s), ${indexableTranslated} indexable, ${violations.length} violation(s)`);
  return { violations, notes, checked };
}
