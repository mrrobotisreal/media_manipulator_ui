// MM48 acceptance 3: Motion's SEO surfaces.
import { describe, expect, it } from 'vitest';

import { ROUTE_SEO_MAP, PUBLIC_ROUTES } from '@/lib/seo';
import { TOOL_PAGES } from '@/content/toolPages';
import { isReviewIndexedToolSlug, isReviewSafeInternalHref } from '@/content/reviewAllowlist';
import { llmsFullMarkdown, llmsIndexMarkdown } from '@/lib/llmsTxt';
import { CODE_FORMATS } from '@/lib/vector/export/formats';

const seo = ROUTE_SEO_MAP['/tools/motion'];
const ld = (type: string) => seo.jsonLd.find((b) => b['@type'] === type) as Record<string, unknown> | undefined;

describe('ROUTE_SEO_MAP /tools/motion', () => {
  it('exists with a title ≤ 70 and a description of about 155 characters', () => {
    expect(seo).toBeDefined();
    expect(seo.title.length).toBeLessThanOrEqual(70);
    expect(seo.title).toMatch(/^Motion\b/);
    expect(seo.description.length).toBeGreaterThanOrEqual(120);
    expect(seo.description.length).toBeLessThanOrEqual(160);
    expect(seo.ogTitle.length).toBeGreaterThan(10);
    expect(seo.ogDescription.length).toBeGreaterThan(50);
    expect(seo.noindex).toBeFalsy();
  });

  it('JSON-LD parses and has SoftwareApplication, FAQPage and BreadcrumbList', () => {
    for (const block of seo.jsonLd) expect(JSON.parse(JSON.stringify(block))).toEqual(block);
    expect(ld('SoftwareApplication')).toBeDefined();
    expect(ld('WebApplication')).toBeUndefined();
    expect(ld('BreadcrumbList')).toBeDefined();
    const faq = ld('FAQPage') as { mainEntity: unknown[] };
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(6);
  });

  it('featureList names only shipped features (no MP4, WebM or PNG sequence before MM49)', () => {
    const features = (ld('SoftwareApplication')!.featureList as string[]).join(' | ');
    expect(features).not.toMatch(/MP4|WebM|PNG sequence|video export|AI|Figma|vectoriz/i);
    for (const shipped of ['SVG import', 'Lottie JSON import', 'Lottie JSON export', 'Animated GIF export', 'Static SVG export']) {
      expect(features).toContain(shipped);
    }
    expect(CODE_FORMATS).toEqual(['lottie', 'react_tsx', 'js', 'ts', 'flutter']);
  });

  it('the tool page FAQ covers the ticket\'s questions (≥ 6)', () => {
    const tool = TOOL_PAGES.find((t) => t.slug === 'motion')!;
    const qs = tool.faq.map((f) => f.question).join('\n');
    for (const q of [/formats/i, /limits/i, /free/i, /SVG I already have/i, /Lottie/i, /browsers.*video/i, /licen[cs]e/i]) {
      expect(qs).toMatch(q);
    }
  });

  it('is indexable now: in the review allowlist, linkable from review pages', () => {
    expect(isReviewIndexedToolSlug('motion')).toBe(true);
    expect(isReviewSafeInternalHref('/tools/motion')).toBe(true);
    expect(isReviewSafeInternalHref('/tutorials/motion')).toBe(true);
    expect(isReviewSafeInternalHref('/licenses')).toBe(true);
  });

  it('the tutorial has its own route entry', () => {
    expect(PUBLIC_ROUTES).toContain('/tutorials/motion');
    const t = ROUTE_SEO_MAP['/tutorials/motion'];
    expect(t.title.length).toBeLessThanOrEqual(75);
    expect(t.jsonLd.some((b) => b['@type'] === 'TechArticle' && b.dateModified === '2026-10-26')).toBe(true);
  });
});

describe('llms.txt (MM48)', () => {
  const index = llmsIndexMarkdown();

  it('carries the Motion paragraph beside Darkroom, with the tutorial and licences links', () => {
    expect(index).toContain('## Motion');
    expect(index.indexOf('## Darkroom')).toBeLessThan(index.indexOf('## Motion'));
    expect(index).toContain('https://www.media-manipulator.com/tools/motion');
    expect(index).toContain('](https://www.media-manipulator.com/tutorials/motion)');
    expect(index).toContain('](https://www.media-manipulator.com/licenses)');
    expect(index).not.toMatch(/## Motion[\s\S]*?MP4[\s\S]*?## Voices/);
  });

  it('llms-full lists the Motion tool page in full', () => {
    const full = llmsFullMarkdown();
    expect(full).toContain('URL: https://www.media-manipulator.com/tools/motion');
    expect(full).toContain('Q: Does it support Lottie?');
  });
});
