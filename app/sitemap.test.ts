import { afterEach, describe, expect, it, vi } from 'vitest';

import sitemap from './sitemap';
import robots from './robots';
import { BLOG_POSTS } from '@/lib/blogPosts';
import { TOOL_PAGES } from '@/content/toolPages';
import {
  PENDING_ALLOWLIST,
  REVIEW_INDEXED_TOOL_SLUGS,
  isReviewIndexedToolSlug,
} from '@/content/reviewAllowlist';
import { PUBLIC_ROUTES } from '@/lib/seo';
import { locales } from '@/i18n/locales';

// The URLs the review-safe sitemap emitted on main before MM34 (10 core routes
// + the 15 allowlisted tools other than content-studio). Frozen here as a
// literal so the flag-off assertion cannot drift with the implementation.
// MM48 adds exactly two core routes after it: /tools/motion and /licenses.
const ORIGIN = 'https://www.media-manipulator.com';
const TODAY_URLS = [
  '/',
  '/tools/content-studio',
  '/about',
  '/how-it-works',
  '/tutorials',
  '/privacy-policy',
  '/terms-of-service',
  '/tools',
  '/pricing',
  '/voices',
  ...[
    'remove-exif-metadata',
    'compress-image',
    'image-resizer',
    'remove-background-from-image',
    'image-to-pdf',
    'pdf-to-jpg',
    'compress-video',
    'video-trimmer',
    'extract-audio-from-video',
    'convert-video-to-animated-gif',
    'transcribe-video',
    'transcode-to-hls',
    'ai-video-restoration',
    'ai-image-restoration',
    'ai-document-scan',
  ].map((s) => `/tools/${s}`),
].map((p) => new URL(p, ORIGIN).toString());

/** MM48: Motion's tool page beside Darkroom, and MM47's /licenses page. */
const MM48_URLS = ['/tools/motion', '/licenses'].map((p) => new URL(p, ORIGIN).toString());
/** The flag-off sitemap since MM48: the pre-MM34 list with Motion and /licenses in the core block. */
const REVIEW_SAFE_URLS = [...TODAY_URLS.slice(0, 2), MM48_URLS[0], ...TODAY_URLS.slice(2, 10), MM48_URLS[1], ...TODAY_URLS.slice(10)];

const urls = () => sitemap().map((e) => e.url);

afterEach(() => vi.unstubAllEnvs());

describe('MM34 flag off (default)', () => {
  it('sitemap equals the pre-MM34 review-safe list plus the two MM48 core routes, exactly', () => {
    vi.stubEnv('NEXT_PUBLIC_SEO_FULL_INDEX', '');
    expect(urls()).toEqual(REVIEW_SAFE_URLS);
    expect(urls()).toHaveLength(27);
    for (const u of TODAY_URLS) expect(urls()).toContain(u);
  });

  it('MM48: /tools/motion and /licenses are listed once, with translated-locale hreflang only', () => {
    vi.stubEnv('NEXT_PUBLIC_SEO_FULL_INDEX', '');
    for (const u of MM48_URLS) {
      const entries = sitemap().filter((e) => e.url === u);
      expect(entries, u).toHaveLength(1);
      const langs = Object.keys(entries[0].alternates?.languages ?? {}).sort();
      expect(langs).toEqual([...locales.filter((l) => l.translated).map((l) => l.code), 'x-default'].sort());
    }
    // The tutorial is a detail page: listed only under the full-index flag.
    expect(urls()).not.toContain(new URL('/tutorials/motion', ORIGIN).toString());
  });

  it('unset behaves the same as empty / "false"', () => {
    vi.stubEnv('NEXT_PUBLIC_SEO_FULL_INDEX', 'false');
    expect(urls()).toEqual(REVIEW_SAFE_URLS);
  });

  it('only the allowlist is indexable; PENDING_ALLOWLIST stays noindex', () => {
    vi.stubEnv('NEXT_PUBLIC_SEO_FULL_INDEX', '');
    for (const s of REVIEW_INDEXED_TOOL_SLUGS) expect(isReviewIndexedToolSlug(s)).toBe(true);
    for (const s of PENDING_ALLOWLIST) expect(isReviewIndexedToolSlug(s)).toBe(false);
    expect(isReviewIndexedToolSlug('compress-audio')).toBe(false);
  });

  it('robots disallows /r/ and keeps the existing rules', () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    expect(rules[0]).toMatchObject({
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/', '/dr', '/r/'],
    });
    expect(rules).toHaveLength(5);
    expect(r.sitemap).toBe(`${ORIGIN}/sitemap.xml`);
  });
});

describe('MM34 flag on', () => {
  it('lists every tool slug, blog post and tutorial exactly once', () => {
    vi.stubEnv('NEXT_PUBLIC_SEO_FULL_INDEX', 'true');
    const list = urls();
    expect(new Set(list).size).toBe(list.length);
    for (const t of TOOL_PAGES) {
      expect(list).toContain(new URL(`/tools/${t.slug}`, ORIGIN).toString());
    }
    for (const s of PENDING_ALLOWLIST) {
      expect(list).toContain(new URL(`/tools/${s}`, ORIGIN).toString());
    }
    for (const p of BLOG_POSTS) expect(list).toContain(new URL(p.path, ORIGIN).toString());
    const tutorials = PUBLIC_ROUTES.filter((p) => p.startsWith('/tutorials/'));
    // MM48 adds /tutorials/motion to the five earlier tutorials.
    expect(tutorials.length).toBe(6);
    expect(tutorials).toContain('/tutorials/motion');
    for (const p of tutorials) expect(list).toContain(new URL(p, ORIGIN).toString());
    // Every flag-off URL is still present.
    for (const u of TODAY_URLS) expect(list).toContain(u);
  });

  it('URL count = core (12) + tool slugs + blog + tutorials + changelog', () => {
    vi.stubEnv('NEXT_PUBLIC_SEO_FULL_INDEX', 'true');
    // /tools/content-studio and /tools/motion are core routes, so they are not double counted.
    const toolsOutsideCore = TOOL_PAGES.filter((t) => t.slug !== 'content-studio' && t.slug !== 'motion').length;
    const expected = 12 + toolsOutsideCore + BLOG_POSTS.length + 6 + 1;
    expect(urls()).toHaveLength(expected);
    expect(urls()).toContain(new URL('/changelog', ORIGIN).toString());
  });

  it('every tool page becomes indexable', () => {
    vi.stubEnv('NEXT_PUBLIC_SEO_FULL_INDEX', 'true');
    for (const t of TOOL_PAGES) expect(isReviewIndexedToolSlug(t.slug)).toBe(true);
  });

  it('blog entries carry their real dateModified and hreflang alternates', () => {
    vi.stubEnv('NEXT_PUBLIC_SEO_FULL_INDEX', 'true');
    const post = BLOG_POSTS[0];
    const entry = sitemap().find((e) => e.url === new URL(post.path, ORIGIN).toString());
    expect(entry?.lastModified).toEqual(new Date(post.dateModified));
    expect(entry?.alternates?.languages?.['x-default']).toBe(new URL(post.path, ORIGIN).toString());
  });
});

describe('MM51 locales: none left untranslated', () => {
  // Every MM51 locale is translated (MM57–MM67); the list stays so a future byte-copy locale is caught.
  const NEW_PREFIXES: string[] = [];

  it('no registered prefix is left untranslated', () => {
    const untranslated = locales.filter((l) => !l.translated).map((l) => l.prefix);
    expect(untranslated).toEqual(NEW_PREFIXES);
  });

  it.each(['', 'true'])('sitemap.xml lists no untranslated prefix (NEXT_PUBLIC_SEO_FULL_INDEX=%j)', (flag) => {
    vi.stubEnv('NEXT_PUBLIC_SEO_FULL_INDEX', flag);
    const entries = sitemap();
    const all = entries.flatMap((e) => [e.url, ...Object.values(e.alternates?.languages ?? {})]);
    for (const prefix of NEW_PREFIXES) {
      const hits = all.filter((u) => new URL(u as string).pathname.split('/')[1] === prefix);
      expect(hits, prefix).toEqual([]);
    }
    for (const e of entries) {
      const langs = Object.keys(e.alternates?.languages ?? {});
      for (const l of locales.filter((x) => !x.translated)) expect(langs).not.toContain(l.code);
    }
  });
});

describe('MM68: every sitemap entry carries every locale', () => {
  it.each(['', 'true'])('one alternate per registered locale plus x-default (NEXT_PUBLIC_SEO_FULL_INDEX=%j)', (flag) => {
    vi.stubEnv('NEXT_PUBLIC_SEO_FULL_INDEX', flag);
    const expected = [...locales.map((l) => l.code), 'x-default'].sort();
    for (const e of sitemap()) {
      expect(Object.keys(e.alternates?.languages ?? {}).sort(), e.url).toEqual(expected);
    }
  });
});
