import { afterEach, describe, expect, it, vi } from 'vitest';
import { TOOL_ALIAS_OF, aliasesOf } from '@/content/toolAliases';
import { PRIMARY_TOOL_PAGES, TOOL_PAGES } from '@/content/toolPages';
import { PENDING_ALLOWLIST, REVIEW_INDEXED_TOOL_SLUGS, isReviewIndexedToolSlug, isReviewSafeInternalHref } from '@/content/reviewAllowlist';
import { buildMetadata } from '@/lib/metadata';
import { getSeoForPath } from '@/lib/seo';
import { words } from '@/content/toolCopyMetrics';
import sitemap from '@/app/sitemap';

const aliases = Object.entries(TOOL_ALIAS_OF) as Array<[string, string]>;
const page = (slug: string) => TOOL_PAGES.find((t) => t.slug === slug);

afterEach(() => vi.unstubAllEnvs());

describe('MM84 alias tool pages', () => {
  it('every aliasOf target exists and is not itself an alias', () => {
    for (const t of TOOL_PAGES.filter((p) => p.aliasOf)) {
      const target = page(t.aliasOf!);
      expect(target, `${t.slug} -> ${t.aliasOf}`).toBeDefined();
      expect(target!.aliasOf, `${t.aliasOf} is an alias`).toBeUndefined();
    }
  });

  it('stamps aliasOf from the alias map onto every listed slug, and only those', () => {
    expect(TOOL_PAGES.filter((t) => t.aliasOf).map((t) => t.slug).sort()).toEqual(Object.keys(TOOL_ALIAS_OF).sort());
    for (const [alias, target] of aliases) expect(page(alias)!.aliasOf).toBe(target);
    expect(PRIMARY_TOOL_PAGES.length).toBe(TOOL_PAGES.length - aliases.length);
  });

  it('never aliases an allowlisted, pending or editor page', () => {
    const protectedSlugs = new Set<string>([...REVIEW_INDEXED_TOOL_SLUGS, ...PENDING_ALLOWLIST]);
    for (const [alias] of aliases) expect(protectedSlugs.has(alias), alias).toBe(false);
  });

  it('keeps each alias in its primary category', () => {
    for (const [alias, target] of aliases) expect(page(alias)!.category, alias).toBe(page(target)!.category);
  });

  it.each(aliases)('%s has its own H1 and a 120-200 word intro', (alias, target) => {
    const t = page(alias)!;
    expect(t.h1).not.toBe(page(target)!.h1);
    const n = words(t.intro).length;
    expect(n).toBeGreaterThanOrEqual(120);
    expect(n).toBeLessThanOrEqual(200);
    expect(t.intro).not.toMatch(/free, online, no signup/i);
  });

  it.each(aliases)('%s canonicalises to its primary, noindex follow, no hreflang, no JSON-LD', (alias, target) => {
    const seo = getSeoForPath(`/tools/${alias}`);
    expect(seo.noindex).toBe(true);
    expect(seo.jsonLd).toEqual([]);
    const meta = buildMetadata(`/tools/${alias}`, 'en-US');
    expect(meta.alternates?.canonical).toBe(`https://www.media-manipulator.com/tools/${target}`);
    expect(meta.alternates?.languages).toBeUndefined();
    expect(meta.robots).toEqual({ index: false, follow: true });
    const ru = buildMetadata(`/tools/${alias}`, 'ru-RU');
    expect(ru.alternates?.canonical).toBe(`https://www.media-manipulator.com/ru/tools/${target}`);
  });

  it('is never indexable, even with the full-index flag on', () => {
    vi.stubEnv('NEXT_PUBLIC_SEO_FULL_INDEX', 'true');
    for (const [alias] of aliases) {
      expect(isReviewIndexedToolSlug(alias), alias).toBe(false);
      expect(isReviewSafeInternalHref(`/tools/${alias}`), alias).toBe(false);
    }
    expect(isReviewIndexedToolSlug('crop-video')).toBe(true);
  });

  it.each([['false'], ['true']])('is never in the sitemap (full index %s)', (flag) => {
    vi.stubEnv('NEXT_PUBLIC_SEO_FULL_INDEX', flag);
    const urls = new Set(sitemap().map((e) => e.url));
    for (const [alias] of aliases) expect(urls.has(`https://www.media-manipulator.com/tools/${alias}`), alias).toBe(false);
    if (flag === 'true') expect(urls.has('https://www.media-manipulator.com/tools/crop-video')).toBe(true);
  });

  it('groups aliases under their primary', () => {
    expect(aliasesOf('video-trimmer').sort()).toEqual(['cut-video-online', 'mp4-trimmer', 'video-cutter']);
    expect(aliasesOf('compress-video').sort()).toEqual(['compress-mp4', 'video-compressor']);
  });

  it('no primary page links to an alias in its related links', () => {
    for (const t of PRIMARY_TOOL_PAGES) {
      for (const r of t.related) {
        const slug = r.to.replace(/^\/tools\//, '');
        expect(slug in TOOL_ALIAS_OF, `${t.slug} -> ${r.to}`).toBe(false);
      }
    }
  });
});
