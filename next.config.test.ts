/**
 * MM88 decision 8: security headers from `next.config.ts` `headers()`, checked by calling
 * it and matching sources with Next's own path matcher (the one the router uses).
 */
import { describe, expect, it } from 'vitest';
import { getPathMatch } from 'next/dist/shared/lib/router/utils/path-match';

import nextConfig, { NON_EMBED_SOURCE } from './next.config';

type Rule = { source: string; headers: { key: string; value: string }[] };

/** Effective headers for a path: every matching rule, later rules overriding the same key. */
async function headersFor(pathname: string): Promise<Record<string, string>> {
  const rules = (await nextConfig.headers!()) as Rule[];
  const out: Record<string, string> = {};
  const seen: Record<string, number> = {};
  for (const rule of rules) {
    if (!getPathMatch(rule.source)(pathname)) continue;
    for (const h of rule.headers) {
      const k = h.key.toLowerCase();
      out[k] = h.value;
      seen[k] = (seen[k] ?? 0) + 1;
    }
  }
  // No path may get the same header from two rules (no reliance on override order).
  for (const [k, n] of Object.entries(seen)) expect(n, `${pathname}: ${k} set ${n}x`).toBe(1);
  return out;
}

const PAGES = ['/', '/en', '/ar/tools/compress-image', '/tools/compress-image', '/account', '/dr/docs', '/motion/new', '/api/x', '/embedded-thing'];

describe('MM88 next.config headers()', () => {
  it.each(PAGES)('%s: nosniff, referrer policy, permissions policy, frame-ancestors self', async (path) => {
    const h = await headersFor(path);
    expect(h['x-content-type-options']).toBe('nosniff');
    expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(h['permissions-policy']).toBe('camera=(self), microphone=(self), geolocation=()');
    expect(h['content-security-policy']).toBe("frame-ancestors 'self';");
  });

  it.each(['/embed', '/embed/content-studio'])('%s keeps only the CreaTV frame-ancestors policy', async (path) => {
    const h = await headersFor(path);
    expect(h['content-security-policy']).toMatch(/^frame-ancestors 'self' https:\/\/creatv\.io https:\/\/www\.creatv\.io/);
    expect(h['x-content-type-options']).toBe('nosniff');
  });

  it('sets no global X-Frame-Options and no HSTS (Vercel owns HSTS)', async () => {
    for (const path of [...PAGES, '/embed/content-studio']) {
      const h = await headersFor(path);
      expect(h['x-frame-options']).toBeUndefined();
      expect(h['strict-transport-security']).toBeUndefined();
    }
  });

  it('the non-embed source excludes exactly the embed tree', () => {
    const m = getPathMatch(NON_EMBED_SOURCE);
    expect(m('/embed')).toBe(false);
    expect(m('/embed/content-studio')).toBe(false);
    expect(m('/embedded-thing')).not.toBe(false);
    expect(m('/')).not.toBe(false);
  });

  it('keeps the existing sw.js cache rule', async () => {
    const h = await headersFor('/sw.js');
    expect(h['cache-control']).toBe('no-cache, no-store, must-revalidate');
  });
});
