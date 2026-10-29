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
vi.mock('@/lib/analytics', () => ({ analytics: { track: vi.fn() }, EVENTS: { CONTACT_SUBMITTED: 'contact_submitted' }, getSessionId: () => 's' }));

import ContactRoute, { generateMetadata } from './page';

const render = async (lang: string) => renderToStaticMarkup(await ContactRoute({ params: Promise.resolve({ lang }) }));

describe('/contact (MM85 acceptance 1)', () => {
  it('server-renders the H1, the form, both emails, /status and the ContactPage JSON-LD', async () => {
    const html = await render('en');
    expect(html).toMatch(/<h1[^>]*>Contact Media Manipulator<\/h1>/);
    expect(html).toContain('data-testid="contact-form"');
    expect(html).toContain('href="mailto:support@media-manipulator.com"');
    expect(html).toContain('href="mailto:privacy@media-manipulator.com"');
    expect(html).toContain('href="/status"');
    expect(html).toContain('href="/about"');
    expect(html).toContain('two business days');
    expect(html).toContain('"@type":"ContactPage"');
    for (const s of ['bug', 'billing', 'privacy', 'press', 'other']) expect(html).toContain(`<option value="${s}"`);
    expect(html).toContain('name="website"');
    expect(html).toContain('0 of 2000 characters');
  });

  it.each(locales.map((l) => [l.prefix]))('renders in %s with a localized title and no raw keys', async (prefix) => {
    const html = await render(prefix);
    expect(html).not.toMatch(/contact\.(form|title|intro)/);
    expect(html).not.toContain('{{');
    const meta = await generateMetadata({ params: Promise.resolve({ lang: prefix }) });
    expect(typeof meta.title).toBe('string');
    // MM86: indexable with hreflang only in reviewed locales (4 + x-default).
    const def = locales.find((l) => l.prefix === prefix)!;
    const reviewed = locales.filter((l) => l.translated && l.reviewed);
    if (def.reviewed) {
      expect(meta.robots).toEqual({ index: true, follow: true });
      expect(Object.keys(meta.alternates?.languages ?? {})).toHaveLength(reviewed.length + 1);
    } else {
      expect(meta.robots).toEqual({ index: false, follow: true });
      expect(meta.alternates?.languages).toBeUndefined();
    }
  });
});
