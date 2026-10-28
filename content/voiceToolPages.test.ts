import { describe, expect, it } from 'vitest';
import { TOOL_PAGES } from '@/content/toolPages';
import { VOICE_TOOL_PAGES } from '@/content/toolPagesCatalog';
import { REVIEW_INDEXED_TOOL_SLUGS } from '@/content/reviewAllowlist';
import { catalogGroupFor, toCatalogTool } from '@/components/tools/tool-catalog-data';
import { getLocalizedToolBySlug } from '@/i18n/toolPageContent';
import { locales } from '@/i18n/locales';

// MM78 acceptance 9: the three voice pages exist in TOOL_PAGES, are noindex (not in the
// review allowlist), appear in /tools under AI, and say what the system really does.

const SLUGS = ['voice-cloning', 'voice-designer', 'voice-changer'];
const TASKS = { 'voice-cloning': 'voice_clone', 'voice-designer': 'voice_design', 'voice-changer': 'voice_convert' };

describe('voice tool pages (MM78)', () => {
  it('are in TOOL_PAGES once each, with their tasks', () => {
    for (const slug of SLUGS) {
      const pages = TOOL_PAGES.filter((t) => t.slug === slug);
      expect(pages, slug).toHaveLength(1);
      expect(pages[0].embed.defaultTask).toBe(TASKS[slug as keyof typeof TASKS]);
      expect(pages[0].embed.defaultMediaKind).toBe('audio');
    }
    expect(VOICE_TOOL_PAGES.map((t) => t.slug)).toEqual(SLUGS);
  });

  it('are noindex: not in the review allowlist', () => {
    for (const slug of SLUGS) expect(REVIEW_INDEXED_TOOL_SLUGS as readonly string[]).not.toContain(slug);
  });

  it('appear in the /tools catalog under AI', () => {
    for (const page of VOICE_TOOL_PAGES) {
      expect(page.category).toBe('ai');
      expect(catalogGroupFor(page)).toBe('ai');
      expect(toCatalogTool(page, false).search).toContain('voice');
    }
  });

  it('link only to pages that exist', () => {
    for (const page of VOICE_TOOL_PAGES) {
      for (const r of page.related) {
        expect(TOOL_PAGES.some((p) => `/tools/${p.slug}` === r.to), `${page.slug} -> ${r.to}`).toBe(true);
      }
    }
  });

  it('copy is honest: watermark on generated speech, not on shift; permission; no training; own servers; no "indistinguishable"', () => {
    const all = JSON.stringify(VOICE_TOOL_PAGES);
    expect(all).not.toMatch(/indistinguishable/i);
    expect(all).not.toMatch(/eleven ?labs/i);
    const changer = JSON.stringify(VOICE_TOOL_PAGES[2]);
    expect(changer).toMatch(/output is not watermarked/);
    expect(changer).toMatch(/carries an inaudible watermark/);
    for (const page of VOICE_TOOL_PAGES) {
      const text = JSON.stringify(page);
      expect(text, page.slug).toMatch(/watermark/);
      expect(text, page.slug).toMatch(/our own (GPU )?server/);
      expect(page.privacyNote).toMatch(/nothing is used to train any model/);
    }
    expect(JSON.stringify(VOICE_TOOL_PAGES[0])).toMatch(/permission/);
  });

  it.each(locales.map((l) => l.code))('resolves in %s with a localized name and tagline', (code) => {
    for (const slug of SLUGS) {
      const t = getLocalizedToolBySlug(slug, code)!;
      expect(t.name.trim().length).toBeGreaterThan(0);
      expect(t.tagline.length).toBeGreaterThan(15);
      // Every non-English locale ships its own name (toolPages.ts override), never the English one.
      if (code !== 'en-US') expect(t.name).not.toBe(getLocalizedToolBySlug(slug, 'en-US')!.name);
    }
  });
});
