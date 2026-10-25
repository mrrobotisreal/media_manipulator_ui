/**
 * MM52 deployment hardening (ticket decision 9, criteria 6), both ways:
 * translator mode on (NEXT_PUBLIC_DEPLOY_ROLE=translator) and off (production).
 *
 * Modules that read the role at MODULE scope (`lib/adsenseConfig.ts`,
 * `next.config.ts`, the layouts' `metadata`) are re-imported after
 * `vi.resetModules()` with the env stubbed, which mirrors a build with that env.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: 'font-inter' }),
  JetBrains_Mono: () => ({ variable: 'font-mono' }),
}));

const ROLE = 'NEXT_PUBLIC_DEPLOY_ROLE';
const modes = [
  ['translator', 'translator'],
  ['production', ''],
] as const;

async function withRole<T>(role: string, load: () => Promise<T>): Promise<T> {
  vi.stubEnv(ROLE, role);
  vi.stubEnv('NEXT_PUBLIC_TRANSLATOR_LOCALE', role ? 'de-DE' : '');
  vi.resetModules();
  return load();
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

describe('next.config.ts headers()', () => {
  it('translator mode: adds the catch-all X-Robots-Tag and keeps /embed and /sw.js rules', async () => {
    const config = (await withRole('translator', () => import('@/next.config'))).default;
    const rules = await config.headers!();
    expect(rules).toContainEqual({
      source: '/:path*',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    });
    expect(rules.map((r) => r.source)).toEqual(['/:path*', '/embed/:path*', '/sw.js']);
    expect(config.env).toEqual({ NEXT_PUBLIC_DEPLOY_ROLE: 'translator', NEXT_PUBLIC_TRANSLATOR_LOCALE: 'de-DE' });
  });

  it('production: exactly the pre-MM52 rules, and the role is defined as an empty string', async () => {
    vi.stubEnv(ROLE, undefined as unknown as string);
    delete process.env[ROLE];
    delete process.env.NEXT_PUBLIC_TRANSLATOR_LOCALE;
    vi.resetModules();
    const config = (await import('@/next.config')).default;
    const rules = await config.headers!();
    expect(rules.map((r) => r.source)).toEqual(['/embed/:path*', '/sw.js']);
    expect(JSON.stringify(rules)).not.toContain('X-Robots-Tag');
    expect(config.env).toEqual({ NEXT_PUBLIC_DEPLOY_ROLE: '', NEXT_PUBLIC_TRANSLATOR_LOCALE: '' });
  });
});

describe('robots.txt, sitemap.xml, llms.txt', () => {
  it('translator mode: robots disallow-all with no sitemap entry; empty sitemap; llms 404', async () => {
    const [robots, sitemap, llms, llmsFull] = await withRole('translator', () =>
      Promise.all([
        import('@/app/robots'),
        import('@/app/sitemap'),
        import('@/app/llms.txt/route'),
        import('@/app/llms-full.txt/route'),
      ]),
    );
    expect(robots.default()).toEqual({ rules: [{ userAgent: '*', disallow: '/' }] });
    expect(sitemap.default()).toEqual([]);
    expect(llms.GET().status).toBe(404);
    expect(llmsFull.GET().status).toBe(404);
  });

  it('production: robots allows crawling and names the sitemap; sitemap and llms are served', async () => {
    const [robots, sitemap, llms] = await withRole('', () =>
      Promise.all([import('@/app/robots'), import('@/app/sitemap'), import('@/app/llms.txt/route')]),
    );
    const r = robots.default();
    expect(r.sitemap).toMatch(/\/sitemap\.xml$/);
    expect(JSON.stringify(r.rules)).toContain('"allow":"/"');
    expect(sitemap.default().length).toBeGreaterThan(10);
    expect(llms.GET().status).toBe(200);
  });
});

describe('metadata.robots', () => {
  it('translator mode: both root layouts and page builders force noindex/nofollow and drop the AdSense meta', async () => {
    const [localized, system, meta, blog] = await withRole('translator', () =>
      Promise.all([
        import('@/app/(localized)/[lang]/layout'),
        import('@/app/(system)/layout'),
        import('@/lib/metadata'),
        import('@/lib/blogPosts'),
      ]),
    );
    for (const m of [localized.metadata, system.metadata]) {
      expect(m.robots).toEqual({ index: false, follow: false });
      expect(m.other).toEqual({});
    }
    // An indexable, translated page in production is still noindex here.
    expect(meta.buildMetadata('/', 'en-US').robots).toEqual({ index: false, follow: false });
    expect(meta.buildMetadata('/tools', 'de-DE').robots).toEqual({ index: false, follow: false });
    expect(blog.blogPostMetadata(blog.BLOG_POSTS[0], 'en-US').robots).toEqual({ index: false, follow: false });
    expect(blog.blogIndexMetadata('en-US').robots).toEqual({ index: false, follow: false });
  });

  it('production: layouts carry no robots override, keep the AdSense account meta; pages stay indexable', async () => {
    const [localized, system, meta] = await withRole('', () =>
      Promise.all([import('@/app/(localized)/[lang]/layout'), import('@/app/(system)/layout'), import('@/lib/metadata')]),
    );
    for (const m of [localized.metadata, system.metadata]) {
      expect(m.robots).toBeUndefined();
      expect(m.other).toEqual({ 'google-adsense-account': 'ca-pub-3413790368941825' });
    }
    expect(meta.buildMetadata('/', 'en-US').robots).toEqual({ index: true, follow: true });
  });

  it.each([
    ['voices', () => import('@/app/(localized)/[lang]/voices/page')],
    ['changelog', () => import('@/app/(localized)/[lang]/changelog/page')],
    ['pricing', () => import('@/app/(localized)/[lang]/pricing/page')],
  ])('translator mode: the %s page’s own robots rule is forced to noindex/nofollow', async (_n, load) => {
    const page = await withRole('translator', load);
    const m = await page.generateMetadata({ params: Promise.resolve({ lang: 'en' }) });
    expect(m.robots).toEqual({ index: false, follow: false });
  });
});

describe('layout <head>/<body> bootstrap scripts', () => {
  it.each(modes)('%s mode', async (mode, role) => {
    const { LayoutBootstrap } = await withRole(role, () => import('@/lib/layoutScripts'));
    const html = renderToStaticMarkup(<LayoutBootstrap />);
    expect(html).toContain('id="theme-init"');
    if (mode === 'translator') {
      expect(html).not.toContain('gtag');
      expect(html).not.toContain('dataLayer');
      expect(html).not.toContain('googletagmanager');
      expect(html).not.toContain('googlesyndication');
      expect(html.match(/<script/g)).toHaveLength(1);
    } else {
      expect(html).toContain('id="gtag-consent"');
    }
  });

  it('translator mode: the localized root layout renders no GA4/AdSense/consent/MockAd script', async () => {
    // The Providers island is a client tree; its analytics/consent gates are tested below.
    vi.doMock('@/app/providers', () => ({ default: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
    const Layout = (await withRole('translator', () => import('@/app/(localized)/[lang]/layout'))).default;
    const tree = await Layout({ children: <p>page</p>, params: Promise.resolve({ lang: 'de' }) });
    const html = renderToStaticMarkup(tree);
    vi.doUnmock('@/app/providers');
    for (const forbidden of ['gtag', 'dataLayer', 'googletagmanager', 'googlesyndication', 'adsbygoogle', 'mock-ad']) {
      expect(html, forbidden).not.toContain(forbidden);
    }
    expect(html.match(/<script/g) ?? []).toHaveLength(1);
    expect(html).toContain('lang="de-DE"');
  });
});

describe('ads', () => {
  it.each(modes)('%s mode: ADSENSE_ENABLED / MOCK_ADS_ENABLED', async (mode, role) => {
    vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', 'true');
    vi.stubEnv('NEXT_PUBLIC_MOCK_ADS_ENABLED', 'true');
    vi.stubEnv('NODE_ENV', 'production');
    const prod = await withRole(role, () => import('@/lib/adsenseConfig'));
    vi.stubEnv('NODE_ENV', 'development');
    const dev = await withRole(role, () => import('@/lib/adsenseConfig'));
    expect(prod.ADSENSE_ENABLED).toBe(mode !== 'translator');
    expect(dev.MOCK_ADS_ENABLED).toBe(mode !== 'translator');
  });
});

describe('analytics', () => {
  it('translator mode: AnalyticsProvider renders children only and starts no tracker', async () => {
    const start = vi.fn(() => () => undefined);
    const initConsent = vi.fn(async () => ({}));
    vi.doMock('@/lib/analytics/client', () => ({ analytics: { start, track: vi.fn(), setContext: vi.fn() } }));
    vi.doMock('@/lib/consent', () => ({ initConsent }));
    vi.doMock('@/lib/auth/AuthProvider', () => ({ useAuth: () => null }));
    vi.doMock('next/navigation', () => ({ usePathname: () => '/de' }));
    const { AnalyticsProvider } = await withRole('translator', () => import('@/lib/analytics/AnalyticsProvider'));
    const { render } = await import('@testing-library/react');
    const { container } = render(
      <AnalyticsProvider>
        <span>child</span>
      </AnalyticsProvider>,
    );
    expect(container.innerHTML).toBe('<span>child</span>');
    expect(start).not.toHaveBeenCalled();
    expect(initConsent).not.toHaveBeenCalled();
    vi.doUnmock('@/lib/analytics/client');
    vi.doUnmock('@/lib/consent');
    vi.doUnmock('@/lib/auth/AuthProvider');
    vi.doUnmock('next/navigation');
  });

  it('production: AnalyticsProvider starts the client and resolves consent', async () => {
    const start = vi.fn(() => () => undefined);
    const initConsent = vi.fn(async () => ({}));
    vi.doMock('@/lib/analytics/client', () => ({
      analytics: { start, track: vi.fn(), setContext: vi.fn(), subscribe: () => () => undefined, flushSync: vi.fn() },
    }));
    vi.doMock('@/lib/consent', () => ({ initConsent, getConsentDetails: () => ({}), onConsentDetailsChange: () => () => undefined }));
    vi.doMock('@/lib/auth/AuthProvider', () => ({ useAuth: () => null }));
    vi.doMock('next/navigation', () => ({ usePathname: () => '/' }));
    const { AnalyticsProvider } = await withRole('', () => import('@/lib/analytics/AnalyticsProvider'));
    const { render, cleanup } = await import('@testing-library/react');
    render(
      <AnalyticsProvider>
        <span>child</span>
      </AnalyticsProvider>,
    );
    expect(start).toHaveBeenCalledTimes(1);
    expect(initConsent).toHaveBeenCalledTimes(1);
    cleanup();
    vi.doUnmock('@/lib/analytics/client');
    vi.doUnmock('@/lib/consent');
    vi.doUnmock('@/lib/auth/AuthProvider');
    vi.doUnmock('next/navigation');
  });

  it('translator mode: GA4 never loads even with analytics consent and the hard-coded fallback id', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '');
    const ga4 = await withRole('translator', () => import('@/lib/analytics/ga4'));
    expect(ga4.GA_MEASUREMENT_ID).toMatch(/^G-/); // the fallback the ticket warned about
    const { applyConsent, getConsentDetails } = await import('@/lib/consent/state');
    applyConsent({ ...getConsentDetails(), analytics: 'granted' }, false);
    ga4.loadGa4();
    const off = ga4.initGA4Bridge({ subscribe: () => () => undefined } as never);
    off();
    expect(document.getElementById(ga4.GA4_SCRIPT_ID)).toBeNull();
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();
  });

  it('production: GA4 loads once analytics consent is granted', async () => {
    const ga4 = await withRole('', () => import('@/lib/analytics/ga4'));
    ga4.loadGa4();
    expect(document.getElementById(ga4.GA4_SCRIPT_ID)).not.toBeNull();
  });

  it('translator mode: the first-party client tracks and sends nothing', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'));
    const beacon = vi.fn(() => true);
    Object.defineProperty(navigator, 'sendBeacon', { value: beacon, configurable: true });
    const { analytics } = await withRole('translator', () => import('@/lib/analytics/client'));
    const { EVENTS } = await import('@/lib/analytics/events');
    analytics.start();
    analytics.track(EVENTS.PAGE_VIEW, { is_initial: true });
    await analytics.flush();
    analytics.flushSync();
    expect(analytics.queueSize()).toBe(0);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(beacon).not.toHaveBeenCalled();
  });

  it('translator mode: the consent gate renders nothing and resolves nothing', async () => {
    const initConsent = vi.fn(async () => ({}));
    vi.doMock('@/lib/consent', () => ({
      initConsent,
      getConsentDetails: () => ({}),
      needsPrompt: () => true,
      onConsentReviewRequest: () => () => undefined,
    }));
    const { ConsentGate } = await withRole('translator', () => import('@/components/consent/consent-gate'));
    const { render } = await import('@testing-library/react');
    const { container } = render(<ConsentGate />);
    expect(container.innerHTML).toBe('');
    expect(initConsent).not.toHaveBeenCalled();
    vi.doUnmock('@/lib/consent');
  });
});

describe('/dr partner portal', () => {
  it('translator mode: the /dr layout 404s', async () => {
    const Dr = (await withRole('translator', () => import('@/app/(system)/dr/layout'))).default;
    expect(() => Dr({ children: null })).toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/);
  });

  it('production: the /dr layout renders its children', async () => {
    const Dr = (await withRole('', () => import('@/app/(system)/dr/layout'))).default;
    expect(renderToStaticMarkup(Dr({ children: <i>portal</i> }))).toBe('<i>portal</i>');
  });
});

describe('markers never reach attributes the scanner does not clean', () => {
  it('translator mode: the privacy policy and terms render no marker inside href/src/id', async () => {
    vi.stubEnv(ROLE, 'translator');
    vi.stubEnv('NEXT_PUBLIC_TRANSLATOR_LOCALE', 'de-DE');
    vi.resetModules();
    await import('@/lib/translator/keyMarker');
    const { hasMarker } = await import('@/lib/translator/markerCodec');
    const views = await Promise.all([import('@/views/privacy-policy'), import('@/views/terms-of-service')]);
    for (const view of views) {
      const html = renderToStaticMarkup(<view.default locale="de-DE" />);
      expect(hasMarker(html)).toBe(true); // copy is marked…
      for (const [, attr, value] of html.matchAll(/\s(href|src|id|for|name)="([^"]*)"/g)) {
        expect(hasMarker(value), `${attr}="${value.slice(0, 40)}"`).toBe(false); // …identifiers are not
      }
    }
  });
});
