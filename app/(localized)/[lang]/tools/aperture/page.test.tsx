import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isLocaleIndexHeld } from '@/content/localeIndexHold';
import { renderToStaticMarkup } from 'react-dom/server';

import { tiersFixture } from '@/lib/billing/test-utils';
import { locales } from '@/i18n/locales';
import { localeBodyCoverage } from '@/i18n/toolPageContent';

const tiers = vi.hoisted(() => ({ value: null as unknown }));
vi.mock('@/lib/auth/loadTiers', () => ({ loadPublicTiers: async () => tiers.value }));
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
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => null }));

import ApertureToolRoute, { generateMetadata } from './page';

const render = async (lang: string) => renderToStaticMarkup(await ApertureToolRoute({ params: Promise.resolve({ lang }) }));

beforeEach(() => {
  tiers.value = tiersFixture({ withPhoto: true });
});
afterEach(() => vi.unstubAllEnvs());

describe('/tools/aperture page (MM100)', () => {
  it('renders the H1, the four-step guide, the drop zone and the FAQ', async () => {
    const html = await render('en');
    expect(html).toMatch(/<h1[^>]*>Aperture: Online Photo Editor<\/h1>/);
    expect(html).toContain('data-testid="photo-guide"');
    expect(html).toContain('data-testid="photo-dropzone"');
    expect(html).toContain('data-panel="basic"');
    expect((html.match(/<li>/g) ?? []).length).toBeGreaterThanOrEqual(4);
  });

  it('builds the plan table from the served photo fields, with no numeric literal in the page', async () => {
    const html = await render('en');
    expect(html).toContain('data-testid="photo-plan-table"');
    expect(html).toMatch(/data-row="projects"[\s\S]*?data-tier="anonymous">1, in this browser only<\/td>[\s\S]*?data-tier="free">5<\/td>[\s\S]*?data-tier="premium">50<\/td>[\s\S]*?data-tier="pro">Unlimited<\/td>/);
    expect(html).toMatch(/data-row="maxMegapixels"[\s\S]*?data-tier="free">12 MP<\/td>[\s\S]*?data-tier="premium">120 MP<\/td>/);
    expect(html).toMatch(/data-row="batch"[\s\S]*?data-tier="anonymous">Not available<\/td>[\s\S]*?data-tier="free">3<\/td>[\s\S]*?data-tier="pro">25<\/td>/);
  });

  it('hides the table, not the page, for a payload without photo fields or when the API is down', async () => {
    tiers.value = tiersFixture();
    let html = await render('en');
    expect(html).toContain('data-testid="photo-plans-unavailable"');
    expect(html).toContain('data-testid="photo-guide"');
    tiers.value = null;
    html = await render('en');
    expect(html).toContain('data-testid="photo-plans-unavailable"');
  });

  it('serves a retuned allowance without a code change', async () => {
    const f = tiersFixture({ withPhoto: true });
    f.tiers.find((t) => t.tier === 'free')!.limits = { ...f.tiers.find((t) => t.tier === 'free')!.limits, photoProjects: 7 } as never;
    tiers.value = f;
    expect(await render('en')).toMatch(/data-row="projects"[\s\S]*?data-tier="free">7<\/td>/);
  });

  it('the editor links are raw /photo paths in every locale (no locale prefix)', async () => {
    for (const l of locales) {
      const html = await render(l.prefix);
      const hrefs = [...html.matchAll(/data-testid="photo-open-empty"/g)];
      expect(hrefs.length, l.code).toBe(1);
      expect(html, l.code).toMatch(/<a href="\/photo\/new"/);
      expect(html, l.code).not.toMatch(/href="\/[a-z-]+\/photo\//);
    }
  });

  it('Hebrew renders dir="rtl" on the page', async () => {
    expect(await render('he')).toMatch(/^<div dir="rtl" data-testid="photo-page"/);
  });

  it('carries no ad slot', async () => {
    expect(await render('en')).not.toContain('data-testid="ad"');
  });

  it('is indexable only in reviewed locales that cover the whole body (and not while the locale index hold is on)', async () => {
    for (const l of locales) {
      const meta = await generateMetadata({ params: Promise.resolve({ lang: l.prefix }) });
      // content/localeIndexHold.ts (Mitch, 2026-11-04): translated landings stay noindex during the AdSense review.
      const indexable = l.code === 'en-US' || (!isLocaleIndexHeld('aperture') && l.translated && l.reviewed && localeBodyCoverage('aperture', l.code).complete);
      expect(meta.robots, l.code).toEqual({ index: indexable, follow: true });
    }
  });
});
