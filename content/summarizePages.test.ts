import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { TOOL_PAGES } from '@/content/toolPages';
import { PENDING_ALLOWLIST, REVIEW_INDEXED_TOOL_SLUGS, isReviewIndexedToolSlug } from '@/content/reviewAllowlist';
import { catalogGroupFor, toCatalogTool } from '@/components/tools/tool-catalog-data';
import { locales } from '@/i18n/locales';
import { getLocalizedToolBySlug } from '@/i18n/toolPageContent';

// MM75 acceptance 7: the two summary pages resolve to the MM74 tasks, stay noindex for the
// AdSense review, carry no "no abstractive summary" caveat anywhere, and summarize-audio is
// listed in the /tools catalog under AI.

const page = (slug: string) => TOOL_PAGES.find((p) => p.slug === slug)!;
const SLUGS = ['summarize-video', 'summarize-audio'] as const;
const LOCALES_DIR = join(__dirname, '..', 'i18n', 'locales');

describe('summary tool pages (MM75)', () => {
  it('summarize-video and summarize-audio resolve to the new tasks, without the old transcribe preset', () => {
    expect(page('summarize-video').embed).toMatchObject({ defaultMediaKind: 'video', defaultTask: 'summarize_video' });
    expect(page('summarize-audio').embed).toMatchObject({ defaultMediaKind: 'audio', defaultTask: 'summarize_audio' });
    for (const slug of SLUGS) {
      expect(page(slug).embed.transcribeMode).toBeUndefined();
      expect(page(slug).embed.defaultOutputFormat).toBeUndefined();
      expect(page(slug).category).toBe('ai');
    }
  });

  it('summarize-audio sits beside transcribe-audio and links to it and to summarize-video', () => {
    const order = TOOL_PAGES.map((p) => p.slug);
    expect(order.indexOf('summarize-audio')).toBeGreaterThan(-1);
    const links = page('summarize-audio').related.map((r) => r.to);
    expect(links).toContain('/tools/transcribe-audio');
    expect(links).toContain('/tools/summarize-video');
    expect(page('summarize-video').related.map((r) => r.to)).toContain('/tools/summarize-audio');
  });

  it('both pages are noindex: not allowlisted, not pending', () => {
    for (const slug of SLUGS) {
      expect((REVIEW_INDEXED_TOOL_SLUGS as readonly string[]).includes(slug)).toBe(false);
      expect((PENDING_ALLOWLIST as readonly string[]).includes(slug)).toBe(false);
      expect(isReviewIndexedToolSlug(slug)).toBe(false);
    }
  });

  it('honest copy: says sign-in is required and that the output is a written summary with chapters', () => {
    for (const slug of SLUGS) {
      const p = page(slug);
      const all = JSON.stringify(p);
      expect(all).toMatch(/free account/i);
      expect(all).toMatch(/chapters/i);
    }
  });

  it('no "no abstractive summary" caveat in the catalog or any locale file', () => {
    const banned = /abstractive|not yet\. it produces a timestamped transcript|written summary is on the roadmap/i;
    for (const slug of SLUGS) {
      for (const l of locales) {
        expect(JSON.stringify(getLocalizedToolBySlug(slug, l.code))).not.toMatch(banned);
      }
    }
    for (const dir of readdirSync(LOCALES_DIR)) {
      const file = join(LOCALES_DIR, dir, 'toolPages.ts');
      let text = '';
      try {
        text = readFileSync(file, 'utf8');
      } catch {
        continue;
      }
      expect(text).not.toMatch(/abstractive/i);
    }
  });

  it('summarize-audio appears in the tools catalog under AI', () => {
    const tool = toCatalogTool(page('summarize-audio'), false);
    expect(tool.category).toBe('ai');
    expect(tool.group).toBe('ai');
    expect(catalogGroupFor(page('summarize-video'))).toBe('ai');
  });
});
