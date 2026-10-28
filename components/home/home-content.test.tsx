import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { REVIEW_INDEXED_TOOL_SLUGS } from '@/content/reviewAllowlist';
import { locales } from '@/i18n/locales';

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import HomeContent from './home-content';

const text = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ');
const words = (html: string) => text(html).split(/\s+/).filter(Boolean).length;

describe('MM85 home page (acceptance 5)', () => {
  it('English homeContent prose is at least 450 words and has the four sections', () => {
    const html = renderToStaticMarkup(<HomeContent locale="en-US" />);
    // The homeContent strings themselves (the tool grid's names and taglines are not counted).
    const pages = JSON.parse(readFileSync(join(__dirname, '..', '..', 'i18n', 'locales', 'en-us', 'interface', 'pages.json'), 'utf8'));
    const all = (v: unknown): string => (typeof v === 'string' ? v : Array.isArray(v) ? v.map(all).join(' ') : v && typeof v === 'object' ? Object.values(v).map(all).join(' ') : '');
    expect(words(all(pages.homeContent))).toBeGreaterThanOrEqual(450);
    // And it is all in the server-rendered HTML.
    expect(words(html)).toBeGreaterThanOrEqual(450);
    for (const h of ['Tools for every kind of media file', 'Three steps, no account', 'The things we leave out on purpose', 'Built by one engineer, operated by CreaTV Ltd.']) {
      expect(html).toContain(h);
    }
    expect(html).toContain('href="/about"');
    expect(html).toContain('href="/contact"');
  });

  it('links only review-allowlisted tool pages', () => {
    const html = renderToStaticMarkup(<HomeContent locale="en-US" />);
    const slugs = [...html.matchAll(/href="\/tools\/([^"/]+)"/g)].map((m) => m[1]);
    expect(slugs.length).toBeGreaterThan(15);
    for (const s of slugs) expect(REVIEW_INDEXED_TOOL_SLUGS as readonly string[]).toContain(s);
  });

  it.each(locales.map((l) => [l.code]))('%s renders every section with no raw keys or stray tags', (code) => {
    const html = renderToStaticMarkup(<HomeContent locale={code} />);
    expect(html).not.toContain('homeContent.');
    expect(html).not.toMatch(/&lt;\/?[a-zA-Z]+&gt;/);
    expect((html.match(/<h2/g) ?? []).length).toBe(5);
  });

  it('the converter (dropzone) precedes the popular chips and the Darkroom card in source order', () => {
    const src = readFileSync(join(__dirname, '..', '..', 'views', 'file-converter-app.tsx'), 'utf8');
    const dropzone = src.indexOf("t('interface:home.upload.dragDrop')");
    const chips = src.indexOf("t('accessibility:home.popularTools')");
    const darkroom = src.indexOf("t('interface:home.contentStudioCta.title')");
    expect(dropzone).toBeGreaterThan(0);
    expect(chips).toBeGreaterThan(dropzone);
    expect(darkroom).toBeGreaterThan(chips);
  });
});
