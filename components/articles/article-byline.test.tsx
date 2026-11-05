import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { TUTORIAL_DATES } from '@/content/pageDates';
import { locales } from '@/i18n/locales';

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock('next/image', () => ({
  // eslint-disable-next-line jsx-a11y/alt-text
  default: (props: Record<string, unknown>) => <img {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />,
}));

import { TutorialByline, TutorialScreenshot, formatArticleDate } from './article-byline';

describe('MM85 tutorial byline and screenshot slot', () => {
  it('names the founder, links /about and shows the git dates', () => {
    const html = renderToStaticMarkup(<TutorialByline path="/tutorials/audio/getting-started" locale="en-US" />);
    expect(html).toContain('By Mitchell Wintrow');
    expect(html).toContain('href="/about"');
    expect(html).toContain('rel="author"');
    expect(html).toContain('<time dateTime="2026-05-17">Published May 17, 2026</time>');
    expect(html).toContain('<time dateTime="2026-10-23">Updated October 23, 2026</time>');
  });

  it('omits "Updated" when the tutorial was never edited after publication', () => {
    const html = renderToStaticMarkup(<TutorialByline path="/tutorials/motion" locale="en-US" />);
    expect(html).toContain('Published October 26, 2026');
    expect(html).not.toContain('Updated');
  });

  it.each(locales.map((l) => [l.code]))('%s: every tutorial byline renders without raw keys', (code) => {
    for (const path of Object.keys(TUTORIAL_DATES) as Array<keyof typeof TUTORIAL_DATES>) {
      const html = renderToStaticMarkup(<TutorialByline path={path} locale={code} />);
      expect(html).toContain('Mitchell Wintrow');
      expect(html).not.toContain('articleMeta');
      expect(html).not.toContain('{{');
    }
    for (const k of ['audioGettingStarted', 'videoGettingStarted', 'imageGettingStarted', 'aiFrameInterpolation', 'motion', 'aperture'] as const) {
      const html = renderToStaticMarkup(<TutorialScreenshot k={k} locale={code} />);
      expect(html).toMatch(/role="img" aria-label="[^"]{20,}"/);
      expect(html).toContain('<figcaption');
      expect(html).not.toContain('articleMeta');
      // Regression (2026-11-04): the Aperture slot rendered a literal "{{brand}}" in every locale.
      expect(html, `${code} ${k}`).not.toContain('{{');
    }
  });

  it('renders the real image once a PNG is supplied', () => {
    const html = renderToStaticMarkup(<TutorialScreenshot k="motion" locale="en-US" src="/tutorials/motion.png" />);
    expect(html).toMatch(/<img[^>]*src="\/tutorials\/motion.png"[^>]*alt="The Motion editor/);
  });

  it('passes the real image size through so the Aperture screenshot keeps its aspect ratio', () => {
    const html = renderToStaticMarkup(
      <TutorialScreenshot k="aperture" locale="en-US" src="/tutorials/aperture-editor.webp" width={1600} height={911} />,
    );
    expect(html).toMatch(/<img[^>]*src="\/tutorials\/aperture-editor.webp"[^>]*width="1600"[^>]*height="911"/);
  });

  it('formats dates in UTC so a day never shifts', () => {
    expect(formatArticleDate('2026-05-17', 'en-US')).toBe('May 17, 2026');
    expect(formatArticleDate('2026-05-17', 'de-DE')).toBe('17. Mai 2026');
  });
});
