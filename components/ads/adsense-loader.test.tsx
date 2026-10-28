/**
 * MM82 decision 1: Google's ad script renders once per ad-eligible page, under
 * the Consent Mode defaults, and nowhere else.
 *
 * `ADSENSE_ENABLED` is read at module scope, so each case re-imports the
 * component after `vi.resetModules()` with the env stubbed (as a build would).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

let pathname = '/tools/compress-image';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));
vi.mock('next/script', () => ({
  default: (props: Record<string, unknown>) => (
    <script
      data-testid="next-script"
      data-id={props.id as string}
      data-src={props.src as string}
      data-strategy={props.strategy as string}
      data-crossorigin={props.crossOrigin as string}
    />
  ),
}));

async function load(env: { enabled?: boolean; role?: string } = {}) {
  vi.stubEnv('NEXT_PUBLIC_ADSENSE_ENABLED', env.enabled === false ? 'false' : 'true');
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', env.role ?? '');
  vi.resetModules();
  return (await import('./adsense-loader')).AdsenseLoader;
}

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  pathname = '/tools/compress-image';
});

describe('AdsenseLoader', () => {
  it.each(['/tools/compress-image', '/en/tools/compress-image', '/tools/compress-video/'])(
    'eligible path %s renders the loader script with the layout props',
    async (path) => {
      pathname = path;
      const AdsenseLoader = await load();
      const { getAllByTestId } = render(<AdsenseLoader />);
      const tags = getAllByTestId('next-script');
      expect(tags).toHaveLength(1);
      const tag = tags[0];
      expect(tag.dataset.id).toBe('adsense-loader');
      const { ADSENSE_SCRIPT_SRC } = await import('@/lib/adsenseConfig');
      expect(tag.dataset.src).toBe(ADSENSE_SCRIPT_SRC);
      expect(tag.dataset.src).toMatch(/\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-3413790368941825$/);
      expect(tag.dataset.strategy).toBe('afterInteractive');
      expect(tag.dataset.crossorigin).toBe('anonymous');
    },
  );

  it.each([
    '/',
    '/en',
    '/tools',
    '/en/tools',
    '/pricing',
    '/account',
    '/privacy-policy',
    '/terms-of-service',
    '/blog/video/video-compression-guide',
    '/tools/some-unlisted-tool',
    '/ru/tools/compress-image',
    '/embed/studio',
  ])('ineligible path %s renders nothing', async (path) => {
    pathname = path;
    const AdsenseLoader = await load();
    const { container } = render(<AdsenseLoader />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when ads are disabled', async () => {
    const AdsenseLoader = await load({ enabled: false });
    const { container } = render(<AdsenseLoader />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing on a translator deployment, even with ads enabled', async () => {
    const AdsenseLoader = await load({ role: 'translator' });
    const { container } = render(<AdsenseLoader />);
    expect(container.innerHTML).toBe('');
  });
});

describe('isAdEligiblePath / toAdPathname', () => {
  it('folds the internal /en segment and keeps other locale prefixes', async () => {
    const { toAdPathname, isAdEligiblePath } = await import('@/lib/adsenseConfig');
    expect(toAdPathname('/en')).toBe('/');
    expect(toAdPathname('/en/tools/compress-image?x=1')).toBe('/tools/compress-image');
    expect(toAdPathname('/ru/tools/compress-image')).toBe('/ru/tools/compress-image');
    expect(toAdPathname('/english-tool')).toBe('/english-tool');
    expect(isAdEligiblePath('/en/tools/image-to-pdf')).toBe(true);
    expect(isAdEligiblePath('/tools/motion')).toBe(true);
    expect(isAdEligiblePath('/en/pricing')).toBe(false);
    expect(isAdEligiblePath('/tools/')).toBe(false);
  });
});
