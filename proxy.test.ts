/**
 * MM51: the locale proxy routes every registered prefix, including the
 * hyphenated ones (`zh-cn`, `pt-br`), with no per-locale code.
 */
import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';

import { proxy } from './proxy';
import { publicLocalePrefixes } from './i18n/locales';

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
});
