import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

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

// The client RelatedLinks island needs the app router; it is not under test here.
vi.mock('@/components/related-links', () => ({ default: () => null }));

import AboutPage from './about';

describe('/about founder block (MM85 acceptance 3)', () => {
  it('names the founder with a photo and alt text, both emails and a /contact link', () => {
    const html = renderToStaticMarkup(<AboutPage locale="en-US" />);
    expect(html).toContain('data-testid="about-founder"');
    expect(html).toMatch(/<img[^>]*src="\/ProfilePic.webp"[^>]*>/);
    expect(html).toMatch(/alt="Portrait of Mitchell Wintrow[^"]*"/);
    expect(html).toContain('Founder and sole engineer');
    expect(html).toContain('People Inc.');
    expect(html).toContain('Colorado, USA');
    expect(html).toContain('href="mailto:support@media-manipulator.com"');
    expect(html).toContain('href="mailto:privacy@media-manipulator.com"');
    expect(html).toContain('href="/contact"');
    expect(html).not.toContain("We're a small team");
  });

  it.each(locales.map((l) => [l.code]))('%s renders the name, an alt text and the contact link', (code) => {
    const html = renderToStaticMarkup(<AboutPage locale={code} />);
    expect(html).toContain('Mitchell Wintrow');
    expect(html).toMatch(/<img[^>]*alt="[^"]{10,}"/);
    expect(html).toMatch(/href="(\/[a-z-]+)?\/contact"/);
    expect(html).not.toContain('about.whoBuilds');
  });
});
