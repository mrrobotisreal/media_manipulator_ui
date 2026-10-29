import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('@/lib/analytics', () => ({ analytics: { track: vi.fn() }, EVENTS: { FEATURE_USED: 'feature_used' } }));

import ToolCatalog, { type ToolCatalogLabels } from '@/components/tools/tool-catalog';
import { buildCatalogTools, toCatalogTool } from '@/components/tools/tool-catalog-data';
import { TOOL_PAGES } from '@/content/toolPages';
import { TOOL_ALIAS_OF } from '@/content/toolAliases';
import { REVIEW_CATALOG_SLUGS, REVIEW_INDEXED_TOOL_SLUGS } from '@/content/reviewAllowlist';

afterEach(cleanup);

const labels: ToolCatalogLabels = {
  categories: { image: 'Image tools', video: 'Video tools', audio: 'Audio tools', ai: 'AI tools', metadata: 'Privacy' },
  groups: { edit: 'Edit', convert: 'Convert', ai: 'AI tools', privacy: 'Privacy', editor: 'Editors' },
  searchPlaceholder: 'Search',
  searchAriaLabel: 'Search tools',
  showingCount: 'Showing {{count}} of {{total}} tools',
  categoriesAriaLabel: 'Tool categories',
  allCategories: 'All',
  noResults: 'No tools match {{query}}',
  popular: 'Popular',
  moreTools: '{{category}}: {{count}} more',
};

const build = (fullIndex: boolean) =>
  buildCatalogTools(TOOL_PAGES, {
    featuredSlugs: new Set<string>(REVIEW_INDEXED_TOOL_SLUGS),
    listedSlugs: new Set<string>(REVIEW_CATALOG_SLUGS),
    fullIndex,
  });

const hrefs = (html: string) =>
  [...html.matchAll(/<a ([^>]*)>/g)].map((m) => ({
    href: /href="([^"]+)"/.exec(m[1])?.[1] ?? '',
    nofollow: /rel="nofollow"/.test(m[1]),
  }));

describe('/tools catalog data (MM73, MM84)', () => {
  it('lists every non-alias tool except the two editors, never an alias', () => {
    const tools = build(false);
    const aliases = Object.keys(TOOL_ALIAS_OF);
    expect(tools.some((t) => aliases.includes(t.slug))).toBe(false);
    const expected = TOOL_PAGES.filter((t) => !t.aliasOf && t.category !== 'contentStudio' && t.category !== 'motion');
    expect(tools.map((t) => t.slug).sort()).toEqual(expected.map((t) => t.slug).sort());
  });

  it('review mode: exactly the copy-bar tools (minus the two editors) are full cards', () => {
    const listed = build(false).filter((t) => t.listed).map((t) => t.slug).sort();
    expect(listed).toEqual(REVIEW_CATALOG_SLUGS.filter((s) => s !== 'content-studio' && s !== 'motion').sort());
    expect(listed).toHaveLength(22);
  });

  it('full index: every tool is a full card', () => {
    expect(build(true).every((t) => t.listed)).toBe(true);
  });

  it('folds alias names and keywords into the primary: search and an "Also:" line', () => {
    const trimmer = build(false).find((t) => t.slug === 'video-trimmer')!;
    expect(trimmer.tagline).toMatch(/Also: .*MP4 Trimmer.*Video Cutter/);
    expect(trimmer.search).toContain('mp4 trimmer');
    expect(trimmer.search).toContain('cut video online');
    const gif = build(false).find((t) => t.slug === 'convert-video-to-animated-gif')!;
    expect(gif.search).toContain('mp4 to gif');
  });

  it('toCatalogTool keeps its two-argument form (voices, summaries)', () => {
    const t = toCatalogTool(TOOL_PAGES.find((p) => p.slug === 'crop-video')!, false);
    expect(t.listed).toBe(true);
    expect(t.tagline).not.toContain('Also:');
  });
});

describe('/tools catalog render (MM84 decision 4)', () => {
  it('review mode: full-card links are copy-bar tools only; every other tool link is nofollow; no alias linked', () => {
    const html = renderToStaticMarkup(<ToolCatalog tools={build(false)} labels={labels} />);
    const links = hrefs(html).filter((l) => l.href.startsWith('/tools/'));
    const aliases = new Set(Object.keys(TOOL_ALIAS_OF));
    const listed = new Set(REVIEW_CATALOG_SLUGS);
    expect(links.length).toBe(build(false).length);
    for (const l of links) {
      const slug = l.href.replace('/tools/', '');
      expect(aliases.has(slug), slug).toBe(false);
      expect(listed.has(slug) || l.nofollow, slug).toBe(true);
      if (listed.has(slug)) expect(l.nofollow, slug).toBe(false);
    }
  });

  it('review mode: the rest sit in a closed <details> per category, server-rendered', () => {
    const html = renderToStaticMarkup(<ToolCatalog tools={build(false)} labels={labels} />);
    for (const cat of ['image', 'video', 'audio', 'ai'] as const) {
      const m = new RegExp(`<details[^>]*data-testid="tool-catalog-more-${cat}"[^>]*>`).exec(html);
      expect(m, cat).not.toBeNull();
      expect(m![0]).not.toMatch(/\sopen(=|\s|>)/);
    }
    expect(html).toContain('href="/tools/crop-video"');
    expect(html).toMatch(/Video tools: \d+ more/);
  });

  it('full index: no nofollow and no collapsed lists', () => {
    const html = renderToStaticMarkup(<ToolCatalog tools={build(true)} labels={labels} />);
    expect(html).not.toContain('rel="nofollow"');
    expect(html).not.toContain('tool-catalog-more-');
  });

  it('search still finds a collapsed tool and opens its list; count covers every tool', () => {
    render(<ToolCatalog tools={build(false)} labels={labels} />);
    expect(screen.getByTestId('tool-catalog-count').textContent).toBe(`Showing ${build(false).length} of ${build(false).length} tools`);
    fireEvent.change(screen.getByTestId('tool-catalog-search'), { target: { value: 'reverse' } });
    const details = screen.getByTestId('tool-catalog-more-video') as HTMLDetailsElement;
    expect(details.open).toBe(true);
    expect(screen.getByTestId('tool-link-reverse-video').getAttribute('rel')).toBe('nofollow');
  });

  it('searching an alias name finds its primary', () => {
    render(<ToolCatalog tools={build(false)} labels={labels} />);
    fireEvent.change(screen.getByTestId('tool-catalog-search'), { target: { value: 'mp4 trimmer' } });
    expect(screen.getByTestId('tool-card-video-trimmer')).toBeTruthy();
    expect(screen.queryByTestId('tool-card-mp4-trimmer')).toBeNull();
  });
});
