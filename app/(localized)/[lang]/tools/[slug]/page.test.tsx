import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock('@/components/tools/tool-analytics-boundary', () => ({
  default: ({ slug, children }: { slug: string; children: React.ReactNode }) => <div data-analytics-slug={slug}>{children}</div>,
}));
vi.mock('@/components/tools/embedded-tool-panel-client', () => ({
  default: ({ toolSlug, defaultTask }: { toolSlug: string; defaultTask: string }) => (
    <div data-testid="panel" data-tool={toolSlug} data-task={defaultTask} />
  ),
}));
vi.mock('@/components/history/recent-strip', () => ({ RecentStrip: () => null }));
vi.mock('@/components/ad-banner', () => ({ default: () => <div data-testid="ad" /> }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => null }));

import ToolSlugPage, { generateMetadata } from './page';

const render = async (slug: string, lang = 'en') =>
  renderToStaticMarkup(await ToolSlugPage({ params: Promise.resolve({ lang, slug }) }));

describe('/tools/[slug] alias pages (MM84 decision 3)', () => {
  it('renders the alias H1, its own intro and its own panel, then links the primary', async () => {
    const html = await render('mp4-trimmer');
    expect(html).toMatch(/<h1[^>]*>Trim MP4 Online Free<\/h1>/);
    expect(html).toContain('with two settings fixed');
    // tool_viewed keeps firing with the alias's own slug (decision 9).
    expect(html).toContain('data-analytics-slug="mp4-trimmer"');
    expect(html).toContain('data-tool="mp4-trimmer"');
    expect(html).toContain('data-task="mp4_trimmer"');
    expect(html).toContain('data-testid="tool-alias-primary"');
    expect(html).toContain('href="/tools/video-trimmer"');
    expect(html).toContain('Read the full guide for Video Trimmer');
  });

  it('renders none of the full-page body, FAQ, JSON-LD or ad on an alias', async () => {
    const html = await render('jpg-converter');
    expect(html).not.toContain('Frequently asked questions');
    expect(html).not.toContain('Related tools');
    expect(html).not.toContain('application/ld+json');
    expect(html).not.toContain('data-testid="ad"');
  });

  it('localises the primary link inside the active locale', async () => {
    const html = await render('compress-mp4', 'ru');
    expect(html).toContain('href="/ru/tools/compress-video"');
  });

  it('metadata: canonical on the primary, noindex follow, no hreflang', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ lang: 'en', slug: 'video-cutter' }) });
    expect(meta.alternates?.canonical).toBe('https://www.media-manipulator.com/tools/video-trimmer');
    expect(meta.alternates?.languages).toBeUndefined();
    expect(meta.robots).toEqual({ index: false, follow: true });
  });

  it('a non-alias, non-allowlisted page stays noindex nofollow with its own canonical', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ lang: 'en', slug: 'crop-video' }) });
    expect(meta.alternates?.canonical).toBe('https://www.media-manipulator.com/tools/crop-video');
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});
