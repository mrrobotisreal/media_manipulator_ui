import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { PHOTO_ADJUSTMENT_SLUGS } from '@/content/photo/slugs';
import { PHOTO_PAGE_WIRING } from '@/content/photo/index';
import { TOOL_PAGES } from '@/content/toolPages';
import { proseBlocks, words } from '@/content/toolCopyMetrics';
import { locales } from '@/i18n/locales';

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock('@/components/tools/tool-analytics-boundary', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('@/components/history/recent-strip', () => ({ RecentStrip: () => null }));
vi.mock('@/components/ad-banner', () => ({ default: () => <div data-testid="ad" /> }));

import ToolSlugPage, { generateMetadata } from './page';

const render = async (lang: string, slug: string) => renderToStaticMarkup(await ToolSlugPage({ params: Promise.resolve({ lang, slug }) }));

afterEach(() => vi.unstubAllEnvs());

describe('Aperture adjustment pages (MM100)', () => {
  it('there are 24, each wired to a panel, and every wired panel exists in the editor', () => {
    expect(PHOTO_ADJUSTMENT_SLUGS).toHaveLength(24);
    for (const s of PHOTO_ADJUSTMENT_SLUGS) expect(PHOTO_PAGE_WIRING[s], s).toBeDefined();
  });

  it('color-pop opens HSL with the red color-pop look; black-and-white-photo opens B&W with the film look', () => {
    expect(PHOTO_PAGE_WIRING['color-pop']).toEqual({ panel: 'hsl', preset: 'color-pop-red' });
    expect(PHOTO_PAGE_WIRING['black-and-white-photo']).toEqual({ panel: 'blackWhite', preset: 'bw-film' });
  });

  it('every page carries its drop zone with its panel (and look) in front, no ad slot', async () => {
    for (const slug of PHOTO_ADJUSTMENT_SLUGS) {
      const html = await render('en', slug);
      const w = PHOTO_PAGE_WIRING[slug];
      expect(html, slug).toContain('data-testid="photo-dropzone"');
      expect(html, slug).toContain(`data-panel="${w.panel}"`);
      expect(html, slug).toContain(`data-preset="${w.preset ?? ''}"`);
      expect(html, slug).not.toContain('data-testid="ad"');
    }
  });

  it('color-pop renders at least 900 words of prose and is noindex in English until reviewed', async () => {
    const tool = TOOL_PAGES.find((t) => t.slug === 'color-pop')!;
    expect(proseBlocks(tool).reduce((n, b) => n + words(b).length, 0)).toBeGreaterThanOrEqual(900);
    vi.stubEnv('NEXT_PUBLIC_SEO_FULL_INDEX', '');
    const meta = await generateMetadata({ params: Promise.resolve({ lang: 'en', slug: 'color-pop' }) });
    expect(meta.robots).toEqual({ index: false, follow: false });
    const html = await render('en', 'color-pop');
    expect(html).toMatch(/<h1[^>]*>Make a Photo Black and White Except One Color|<h1/);
  });

  it('under every other locale the pages are noindex (English body until MM102-<prefix>)', async () => {
    for (const l of locales.filter((x) => x.code !== 'en-US')) {
      const meta = await generateMetadata({ params: Promise.resolve({ lang: l.prefix, slug: 'color-pop' }) });
      const robots = meta.robots as { index: boolean };
      expect(robots.index, l.code).toBe(false);
    }
  });

  it('with the full-index flag on, the pages become indexable in English', async () => {
    vi.stubEnv('NEXT_PUBLIC_SEO_FULL_INDEX', 'true');
    const meta = await generateMetadata({ params: Promise.resolve({ lang: 'en', slug: 'brighten-image' }) });
    expect((meta.robots as { index: boolean }).index).toBe(true);
  });

  it('the English hand-off sentence is on the one-shot image pages, not on translations', async () => {
    const { getLocalizedToolBySlug } = await import('@/i18n/toolPageContent');
    const en = getLocalizedToolBySlug('grayscale-image', 'en-US')!;
    expect(en.whatItDoes.join(' ')).toContain('Black & white panel in Aperture');
    expect(en.related.some((r) => r.to === '/tools/black-and-white-photo')).toBe(true);
    const de = getLocalizedToolBySlug('grayscale-image', 'de-DE')!;
    expect(de.related.some((r) => r.to === '/tools/black-and-white-photo')).toBe(false);
  });
});
