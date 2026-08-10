import { describe, expect, it } from 'vitest';

import { locales } from '@/i18n/locales';
import { pageTypeFromPathname } from './events';
import { validateDevEvent } from './devValidation';

describe('pageTypeFromPathname', () => {
  const cases: Array<[string, string]> = [
    ['/', 'home'],
    ['/tools', 'tool'],
    ['/tools/compress-video', 'tool'],
    ['/pricing', 'pricing'],
    ['/blog/video/video-compression-guide', 'blog'],
    ['/tutorials/content-studio', 'tutorial'],
    ['/how-it-works', 'how_it_works'],
    ['/about', 'about'],
    ['/account', 'account'],
    ['/privacy-policy', 'legal'],
    ['/terms-of-service', 'legal'],
    ['/nonsense', 'other'],
  ];

  it.each(cases)('%s → %s', (path, expected) => {
    expect(pageTypeFromPathname(path)).toBe(expected);
  });

  // Locale-prefixed URLs must classify identically to their unprefixed twins —
  // before this held, every /ru|/uk|/he|/de|/es page landed in page_type 'other'.
  const prefixed = locales
    .filter((l) => l.code !== 'en-US')
    .flatMap((l) => cases.map(([path, expected]): [string, string] => [
      path === '/' ? `/${l.prefix}` : `/${l.prefix}${path}`,
      expected,
    ]));

  it.each(prefixed)('%s → %s (locale-prefixed)', (path, expected) => {
    expect(pageTypeFromPathname(path)).toBe(expected);
  });

  // English's /en prefix is internal-only: the proxy rewrite is server-side, so
  // window.location (the SDK's only pathname source) never shows it, and
  // stripLocalePrefix deliberately strips only PUBLIC prefixes.
  it('/en stays unstripped (never a browser pathname)', () => {
    expect(pageTypeFromPathname('/en')).toBe('other');
  });
});

describe('validateDevEvent tool_slug invariant', () => {
  const event = (context?: Record<string, unknown>) =>
    ({ properties: { entry_point: 'homepage' }, context }) as never;

  it('flags a slug-less tool-funnel event on a tool page', () => {
    const issues = validateDevEvent('tool_viewed', event(), { page_type: 'tool' });
    expect(issues.some((i) => i.includes('tool_slug missing'))).toBe(true);
  });

  it('allows the deliberately slug-less homepage converter funnel', () => {
    const issues = validateDevEvent('tool_viewed', event(), { page_type: 'home' });
    expect(issues).toEqual([]);
  });

  it('accepts a slug from batch context anywhere', () => {
    const issues = validateDevEvent('tool_viewed', event(), {
      page_type: 'tool',
      tool_slug: 'compress-video',
    });
    expect(issues).toEqual([]);
  });
});
