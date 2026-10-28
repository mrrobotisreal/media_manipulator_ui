import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import type { TiersResponse } from '@/lib/auth/accountApi';
import { tiersFixture } from '@/lib/billing/test-utils';
import { locales } from '@/i18n/locales';

const tiers = vi.hoisted(() => ({ value: null as unknown }));
vi.mock('@/lib/auth/loadTiers', () => ({ loadPublicTiers: async () => tiers.value }));
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
// Client islands render nothing in a static render test except the launcher, which is
// exercised on its own in recent-projects.test.tsx; here it only needs its Open link.
vi.mock('@/components/tools/tool-analytics-boundary', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('@/components/history/recent-strip', () => ({ RecentStrip: () => null }));
vi.mock('@/components/ad-banner', () => ({ default: () => <div data-testid="ad" /> }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => null }));
vi.mock('@/lib/analytics', () => ({ analytics: { track: vi.fn() }, EVENTS: { CTA_CLICKED: 'cta_clicked' } }));

import MotionToolRoute, { generateMetadata } from './page';

const render = async (lang: string) => renderToStaticMarkup(await MotionToolRoute({ params: Promise.resolve({ lang }) }));

beforeEach(() => {
  tiers.value = tiersFixture();
});
afterEach(() => vi.unstubAllEnvs());

describe('/tools/motion page (MM48 acceptance 2)', () => {
  it('renders the H1 without a beta label (MM85), the four-step guide and the FAQ', async () => {
    const html = await render('en');
    // MM85: "(beta)" lives only in the editor chrome, never on the indexable H1.
    expect(html).toMatch(/<h1[^>]*>Motion<\/h1>/);
    expect(html).not.toContain('data-testid="motion-beta"');
    expect(html).not.toMatch(/\bbeta\b/i);
    expect(html).toContain('data-testid="motion-guide"');
    expect((html.match(/<li>/g) ?? []).length).toBeGreaterThanOrEqual(4);
    expect(html).toContain('Which formats can I export?');
    expect(html).toContain('Does it support Lottie?');
  });

  it.each(locales.map((l) => [l.prefix]))('Open Motion links to /motion/new with no locale prefix (%s)', async (prefix) => {
    const html = await render(prefix);
    const opens = [...html.matchAll(/<a href="([^"]+)" data-testid="motion-open"/g)].map((m) => m[1]);
    expect(opens).toEqual(['/motion/new']);
  });

  it('builds the format table from a 3-tier /api/tiers payload: no Pro column', async () => {
    tiers.value = tiersFixture({ withPro: false });
    const html = await render('en');
    expect(html).toContain('data-testid="motion-plan-table"');
    expect(html).not.toContain('data-testid="motion-pro-chip"');
    expect(html).not.toMatch(/<th[^>]*data-tier="pro"/);
    // Served numbers, not literals: the fixture's anonymous allowance is 2, premium 30.
    expect(html).toMatch(/data-row="exportsPerDay"[\s\S]*?<td[^>]*data-tier="anonymous">2<\/td>[\s\S]*?<td[^>]*data-tier="premium">30<\/td>/);
  });

  it('builds a 4-tier table with Pro and the "Best for Motion" chip when the API returns Pro', async () => {
    const html = await render('en');
    expect(html).toMatch(/<th[^>]*data-tier="pro"/);
    expect(html).toContain('data-testid="motion-pro-chip"');
    expect(html).toContain('Best for Motion');
  });

  it('shows MP4, WebM and PNG sequence as available on request while no tier serves them (MM85 wording)', async () => {
    const html = await render('en');
    for (const f of ['png_sequence', 'mp4', 'webm']) {
      expect(html).toMatch(new RegExp(`data-row="${f}"[\\s\\S]*?data-coming-soon="true"`));
    }
    expect(html).toContain('data-testid="motion-coming-soon-note"');
    expect(html).toContain('Export format available on request');
    expect(html).toMatch(/data-testid="motion-coming-soon-note"[\s\S]*?href="\/contact"/);
    expect(html).not.toMatch(/coming soon|will be added|shortly/i);
  });

  it('degrades to a note (and keeps the rest of the page) when /api/tiers is down', async () => {
    tiers.value = null;
    const html = await render('en');
    expect(html).toContain('data-testid="motion-plans-unavailable"');
    expect(html).toContain('data-testid="motion-guide"');
  });

  it('Hebrew renders dir="rtl" on the page (acceptance 4)', async () => {
    const html = await render('he');
    expect(html).toMatch(/^<div dir="rtl" data-testid="motion-page"/);
  });

  it('carries no ad slot', async () => {
    const html = await render('en');
    expect(html).not.toContain('data-testid="ad"');
  });

  it('is indexable in translated locales and noindex in byte-copy locales', async () => {
    for (const l of locales) {
      const meta = await generateMetadata({ params: Promise.resolve({ lang: l.prefix }) });
      expect(meta.robots, l.code).toEqual({ index: l.translated, follow: true });
      const langs = Object.keys(meta.alternates?.languages ?? {});
      for (const u of locales.filter((x) => !x.translated)) expect(langs).not.toContain(u.code);
    }
  });

  it('the served payload type matches what the page reads', () => {
    const data: TiersResponse = tiersFixture() as TiersResponse;
    expect(data.tiers.every((t) => Array.isArray(t.limits.vectorFormats))).toBe(true);
  });
});
