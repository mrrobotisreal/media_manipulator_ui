/**
 * MM84: the tool-copy gate. Permanent: keep it in the suite.
 *
 * - Report: prints words / unique words / FAQ count for the 24 copy-bar pages
 *   and the three site-wide duplication numbers (run with --silent=false).
 * - Site-wide (decision 2 and S3): no privacyNote on more than one page, no FAQ
 *   answer on more than two, no sentence of six or more words on more than
 *   four pages (the retention promise and the per-category privacy template
 *   sentences are the only exemptions), no "Is it free?" on a bulk page, no
 *   "Free, online, no signup." anywhere.
 * - Copy bar (decision 1): every one of the 24 pages meets it
 *   (content/toolCopyMetrics.ts#copyBarProblems).
 *
 * Counts are over rendered pages: alias pages render only their tagline and
 * intro and are measured that way.
 */
import { describe, expect, it } from 'vitest';
import { TOOL_PAGES } from '@/content/toolPages';
import { REVIEW_CATALOG_SLUGS } from '@/content/reviewAllowlist';
import { PRIVACY_TEMPLATES } from '@/content/toolPrivacy';
import {
  copyBarProblems,
  duplication,
  exemptSentences,
  norm,
  pageWords,
  proseBlocks,
  sentenceIndex,
} from '@/content/toolCopyMetrics';

const exempt = exemptSentences(Object.values(PRIVACY_TEMPLATES));

/**
 * All 24 copy-bar pages are rewritten (S4-S7), so the site-wide limits and the
 * copy bar are asserted over every tool page.
 */
const REWRITTEN: readonly string[] = REVIEW_CATALOG_SLUGS;
const measured = TOOL_PAGES.filter((t) => !REVIEW_CATALOG_SLUGS.includes(t.slug) || REWRITTEN.includes(t.slug));
const idx = sentenceIndex(TOOL_PAGES);
const page = (slug: string) => TOOL_PAGES.find((t) => t.slug === slug)!;
const bulk = TOOL_PAGES.filter((t) => !t.aliasOf && !REVIEW_CATALOG_SLUGS.includes(t.slug));

describe('MM84 tool copy: report', () => {
  it('prints per-page words and the site-wide duplication numbers', () => {
    const d = duplication(TOOL_PAGES, exempt);
    const rows = REVIEW_CATALOG_SLUGS.map((slug) => {
      const t = page(slug);
      const { total, unique } = pageWords(t, idx);
      return `${slug.padEnd(32)} words ${String(total).padStart(5)}  unique ${String(unique).padStart(5)}  faq ${t.faq.length}`;
    });
    console.log(
      [
        `copy-bar pages (${REVIEW_CATALOG_SLUGS.length}):`,
        ...rows,
        `site-wide over ${TOOL_PAGES.filter((t) => !t.aliasOf).length} rendered pages (+${TOOL_PAGES.filter((t) => t.aliasOf).length} aliases):`,
        `  privacyNotes shared by >1 page = ${d.sharedPrivacyNotes.length}`,
        `  FAQ answers shared by >2 pages = ${d.sharedFaqAnswers.length}`,
        `  sentences of >=6 words shared by >4 pages = ${d.sharedSentences.length}`,
      ].join('\n'),
    );
    expect(rows).toHaveLength(24);
  });
});

describe('MM84 tool copy: site-wide duplication limits', () => {
  const d = duplication(measured, exempt);

  it('no privacyNote is shared by more than one page', () => {
    expect(d.sharedPrivacyNotes).toEqual([]);
  });

  it('no FAQ answer is shared by more than two pages', () => {
    expect(d.sharedFaqAnswers).toEqual([]);
  });

  it('no sentence of six or more words is on more than four pages (template sentences exempt)', () => {
    expect(d.sharedSentences).toEqual([]);
  });

  it('every bulk privacy note is a page-specific first sentence plus its category template', () => {
    const templates = Object.values(PRIVACY_TEMPLATES);
    const voiceOrSummary = /^(voice-|summarize-)/;
    for (const t of bulk) {
      if (voiceOrSummary.test(t.slug)) continue;
      const tpl = templates.find((x) => t.privacyNote.endsWith(x));
      expect(tpl, t.slug).toBeDefined();
      expect(t.privacyNote.length - tpl!.length, t.slug).toBeGreaterThan(40);
    }
  });

  it('no bulk page asks "Is it free?" (decision 2(b))', () => {
    for (const t of bulk) {
      for (const f of t.faq) expect(f.question, t.slug).not.toMatch(/^is it (really )?free/i);
    }
  });

  it('"Free, online, no signup." appears nowhere (decision 2(d))', () => {
    for (const t of measured) expect(proseBlocks(t).join(' '), t.slug).not.toMatch(/free, online, no signup/i);
  });

  it('the retention sentence is never paraphrased into a privacy note', () => {
    for (const t of TOOL_PAGES) {
      if (/kept|retain|delet/i.test(t.privacyNote) && /24 hours/.test(t.privacyNote)) {
        expect(t.privacyNote, t.slug).toContain('Files are kept 24 hours for guests; with a free account you choose 24 hours to 2 years');
      }
    }
  });
});

describe('MM84 tool copy: the copy bar (decision 1)', () => {
  it.each(REVIEW_CATALOG_SLUGS.map((s) => [s]))('%s meets the copy bar', (slug) => {
    if (!REWRITTEN.includes(slug)) return;
    expect(copyBarProblems(page(slug), TOOL_PAGES, idx, REVIEW_CATALOG_SLUGS)).toEqual([]);
  });

  it('normalisation folds case, whitespace and closing punctuation', () => {
    expect(norm('  Hello   World. ')).toBe(norm('hello world'));
  });
});
