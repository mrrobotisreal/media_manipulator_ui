/**
 * MM51: the locale proxy routes every registered prefix, including the
 * hyphenated ones (`zh-cn`, `pt-br`), with no per-locale code.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

import { config, proxy } from './proxy';
import { publicLocalePrefixes, translatorLocales } from './i18n/locales';

const ORIGIN = 'https://www.media-manipulator.com';
const run = (path: string) => proxy(new NextRequest(new URL(path, ORIGIN)));
const isPassThrough = (res: Response) => res.headers.get('x-middleware-next') === '1';
const rewriteTarget = (res: Response) => {
  const raw = res.headers.get('x-middleware-rewrite');
  return raw ? new URL(raw).pathname : null;
};

describe('proxy', () => {
  it('knows all 16 public prefixes', () => {
    expect(publicLocalePrefixes).toHaveLength(16);
    expect(publicLocalePrefixes).toEqual(
      expect.arrayContaining(['zh-cn', 'zh-tw', 'pt-pt', 'pt-br', 'ar', 'fr', 'it', 'ja', 'ko', 'hi', 'vi']),
    );
  });

  it.each(publicLocalePrefixes.map((p) => [p]))('passes /%s and its sub-paths through untouched', (prefix) => {
    for (const path of [`/${prefix}`, `/${prefix}/`, `/${prefix}/tools/compress-image`]) {
      const res = run(path);
      expect(isPassThrough(res), path).toBe(true);
      expect(rewriteTarget(res), path).toBeNull();
    }
  });

  it('permanently redirects /en and /en/... to the unprefixed URL', () => {
    const root = run('/en');
    expect(root.status).toBe(308);
    expect(new URL(root.headers.get('location')!).pathname).toBe('/');
    const sub = run('/en/about');
    expect(sub.status).toBe(308);
    expect(new URL(sub.headers.get('location')!).pathname).toBe('/about');
  });

  it('rewrites unprefixed paths onto the English tree', () => {
    expect(rewriteTarget(run('/'))).toBe('/en');
    expect(rewriteTarget(run('/tools/compress-image'))).toBe('/en/tools/compress-image');
  });

  it('does not treat unregistered look-alike prefixes as locales', () => {
    for (const path of ['/pt', '/zh', '/pt/about', '/zh-hk', '/arabic']) {
      expect(rewriteTarget(run(path)), path).toBe(`/en${path}`);
    }
  });

  it('leaves /dr, /embed, /api and files alone', () => {
    for (const path of ['/dr', '/dr/x', '/embed/content-studio', '/api/x', '/robots.txt']) {
      const res = run(path);
      expect(isPassThrough(res), path).toBe(true);
    }
  });

  // MM42: the chromeless Motion editor is never localized or rewritten.
  it.each(['', ...publicLocalePrefixes.map((p) => `/${p}`)])(
    'does not rewrite /motion/... requested from locale %s',
    (localePrefix) => {
      const paths = ['/motion', '/motion/new', '/motion/abc-123'];
      for (const path of paths) {
        const res = run(path);
        expect(isPassThrough(res), path).toBe(true);
        expect(rewriteTarget(res), path).toBeNull();
        expect(res.status, path).not.toBe(308);
      }
      // A locale-prefixed /<lang>/motion/... is just an unknown page under that
      // locale (passed through, never rewritten onto the English tree).
      if (localePrefix) {
        const res = run(`${localePrefix}/motion/new`);
        expect(rewriteTarget(res)).toBeNull();
      }
    },
  );

  it('keeps /motion-* look-alikes and /tools/motion on the locale logic', () => {
    expect(rewriteTarget(run('/motion-graphics'))).toBe('/en/motion-graphics');
    expect(rewriteTarget(run('/motions'))).toBe('/en/motions');
    expect(rewriteTarget(run('/tools/motion'))).toBe('/en/tools/motion');
  });

  it('excludes /motion in the matcher exactly', () => {
    const matcher = new RegExp(`^${config.matcher[0]}$`);
    expect(matcher.test('/motion')).toBe(false);
    expect(matcher.test('/motion/new')).toBe(false);
    expect(matcher.test('/motion-graphics')).toBe(true);
    expect(matcher.test('/motions')).toBe(true);
    expect(matcher.test('/tools/motion')).toBe(true);
  });
});


/**
 * MM56 defect 1 (Mitch's dry run): `de.translate…` opened in English. A translator
 * deployment lands unprefixed URLs on its own locale and keeps `/en/...` as the
 * English view; with the role unset nothing changes (production).
 */
describe('proxy on a translator deployment (MM56)', () => {
  afterEach(() => vi.unstubAllEnvs());
  const asTranslator = (code: string) => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    vi.stubEnv('NEXT_PUBLIC_TRANSLATOR_LOCALE', code);
  };
  const location = (res: Response) => {
    const raw = res.headers.get('location');
    return raw ? new URL(raw).pathname + new URL(raw).search : null;
  };

  it('redirects / and unprefixed pages to the German prefix on de-DE (307, query kept)', () => {
    asTranslator('de-DE');
    for (const [from, to] of [
      ['/', '/de'],
      ['/about', '/de/about'],
      ['/tools/compress-image?x=1', '/de/tools/compress-image?x=1'],
      ['/translate-guide', '/de/translate-guide'],
    ]) {
      const res = run(from);
      expect(res.status, from).toBe(307);
      expect(location(res), from).toBe(to);
    }
  });

  it.each(translatorLocales.map((l) => [l.code, l.prefix]))('%s lands / on /%s', (code, prefix) => {
    asTranslator(code);
    expect(location(run('/'))).toBe(`/${prefix}`);
    // The locale's own pages pass through untouched.
    expect(isPassThrough(run(`/${prefix}/about`))).toBe(true);
  });

  it('accepts the locale code case-insensitively, like translatorLocale()', () => {
    asTranslator('de-de');
    expect(location(run('/about'))).toBe('/de/about');
  });

  it('serves /en and /en/... as the English view instead of redirecting them', () => {
    asTranslator('de-DE');
    for (const path of ['/en', '/en/about']) {
      const res = run(path);
      expect(isPassThrough(res), path).toBe(true);
      expect(res.status, path).not.toBe(308);
    }
  });

  it('leaves /dr, /embed, /motion, /api and files alone', () => {
    asTranslator('ar-SA');
    for (const path of ['/dr', '/dr/x', '/embed/content-studio', '/motion/new', '/api/translator/me', '/robots.txt']) {
      expect(isPassThrough(run(path)), path).toBe(true);
    }
  });

  it('an invalid or missing locale keeps the production routing (hardened, unarmed)', () => {
    for (const bad of ['', 'xx-XX', 'en-US']) {
      asTranslator(bad);
      expect(rewriteTarget(run('/about')), bad).toBe('/en/about');
      expect(run('/en/about').status, bad).toBe(308);
    }
  });

  it('production (role unset) is unchanged: rewrite to /en, 308 for /en/...', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    vi.stubEnv('NEXT_PUBLIC_TRANSLATOR_LOCALE', 'de-DE');
    expect(rewriteTarget(run('/'))).toBe('/en');
    expect(rewriteTarget(run('/about'))).toBe('/en/about');
    expect(run('/en/about').status).toBe(308);
  });
});
