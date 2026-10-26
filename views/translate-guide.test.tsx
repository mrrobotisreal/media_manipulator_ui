/**
 * MM56 acceptance 2: `/translate-guide` renders on translator deployments with an
 * English section and a section in the deployment's locale, 404s in production
 * for every locale, is absent from the sitemap, and its strings exist in all 17
 * locales (`localeParity` covers the key trees; the checks below cover content).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import TranslateGuide, { generateMetadata } from '@/app/(localized)/[lang]/translate-guide/page';
import sitemap from '@/app/sitemap';
import { localePrefixes, locales } from '@/i18n/locales';

const params = (lang: string) => ({ params: Promise.resolve({ lang }) });
const asTranslator = (code: string) => {
  vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
  vi.stubEnv('NEXT_PUBLIC_TRANSLATOR_LOCALE', code);
};
const ZW = /[‌‍]/;

afterEach(() => vi.unstubAllEnvs());

describe('/translate-guide in production (role unset)', () => {
  it.each(localePrefixes.map((p) => [p]))('/%s/translate-guide is a 404', async (lang) => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    await expect(TranslateGuide(params(lang))).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/);
    expect(await generateMetadata()).toEqual({});
  });

  it('is not in the sitemap', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    expect(sitemap().some((e) => e.url.includes('translate-guide'))).toBe(false);
    vi.stubEnv('NEXT_PUBLIC_SEO_FULL_INDEX', 'true');
    expect(sitemap().some((e) => e.url.includes('translate-guide'))).toBe(false);
  });
});

describe('/translate-guide on a translator deployment', () => {
  it('renders the English guide and a German section on de-DE (from /de/ and /en/)', async () => {
    asTranslator('de-DE');
    for (const lang of ['de', 'en']) {
      const html = renderToStaticMarkup(await TranslateGuide(params(lang)));
      expect(html).toContain('data-guide-section="en-US"');
      expect(html).toContain('data-guide-section="de-DE"');
      expect(html).toMatch(/<section lang="de-DE" dir="ltr"/);
      expect(html).toContain('Translator guide');
      expect(html).toContain('{{name}}');
      expect(html).toContain('support@media-manipulator.com');
      // The German copy is still the English text (TODO(i18n)), so the note shows.
      expect(html).toContain('data-guide-untranslated');
    }
    const meta = await generateMetadata();
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it('an RTL deployment (ar-SA) renders its section right-to-left', async () => {
    asTranslator('ar-SA');
    const html = renderToStaticMarkup(await TranslateGuide(params('ar')));
    expect(html).toMatch(/<section lang="ar-SA" dir="rtl"/);
  });

  it('the English section carries no key markers (only the locale section is editable in place)', async () => {
    asTranslator('de-DE');
    // Next's bundler resolves mode.ts's guarded `require('./keyMarker')`; vitest's
    // CommonJS require cannot load TS, so evaluate it first (as hydration.test does).
    await import('@/lib/translator/keyMarker');
    const html = renderToStaticMarkup(await TranslateGuide(params('de')));
    const [en, de] = html.split('data-guide-section="de-DE"');
    expect(en).not.toMatch(ZW);
    expect(de).toMatch(ZW);
  });

  it('an invalid locale (hardened, unarmed) still shows the English guide alone', async () => {
    asTranslator('xx-XX');
    const html = renderToStaticMarkup(await TranslateGuide(params('en')));
    expect(html).toContain('data-guide-section="en-US"');
    expect(html).not.toContain('data-guide-section="de-DE"');
  });

  it('an unknown URL prefix is still a 404', async () => {
    asTranslator('de-DE');
    await expect(TranslateGuide(params('xx'))).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/);
  });
});

describe('translateGuide strings', () => {
  const read = (code: string) =>
    JSON.parse(readFileSync(join(__dirname, '..', 'i18n', 'locales', code.toLowerCase(), 'interface', 'pages.json'), 'utf8'))
      .translateGuide;
  const en = read('en-US');

  it('cover every topic design §5 lists', () => {
    const text = JSON.stringify(en);
    for (const needle of [
      'Supported browsers',
      'verify your email',
      'This page',
      'All keys',
      'Changes',
      'Alt',
      'Search',
      'Arabic needs six forms',
      'Japanese needs only one',
      '{{name}}',
      'Warnings',
      'Drafts',
      'pull request',
      'What happens next',
      'What not to do',
      'support@media-manipulator.com',
    ]) {
      expect(text, needle).toContain(needle);
    }
  });

  it.each(locales.map((l) => [l.code]))('%s ships the section with the same shape', (code) => {
    const g = read(code);
    expect(g.sections).toHaveLength(en.sections.length);
    g.sections.forEach((s: { paragraphs?: string[]; bullets?: string[] }, i: number) => {
      expect(s.paragraphs?.length).toBe(en.sections[i].paragraphs?.length);
      expect(s.bullets?.length).toBe(en.sections[i].bullets?.length);
    });
  });
});
