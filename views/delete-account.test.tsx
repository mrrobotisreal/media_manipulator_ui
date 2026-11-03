/**
 * MA26: the public /delete-account page (Google Play account-deletion URL) renders in every locale
 * with the app and developer names, the three routes, and what is deleted/kept; localized in ru.
 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { locales } from '@/i18n/locales';

import DeleteAccountPage from './delete-account';

describe('/delete-account page', () => {
  it('en-US names the app, the developer, the in-app path and the email route', () => {
    const html = renderToStaticMarkup(<DeleteAccountPage locale="en-US" />);
    expect(html).toContain('Media Manipulator');
    expect(html).toContain('CreaTV Ltd.');
    expect(html).toContain('Delete your Media Manipulator account');
    expect(html).toContain('mailto:privacy@media-manipulator.com');
    expect(html).toContain('href="/account?tab=privacy"');
    expect(html).toContain('within 30 days');
  });

  it('ru-RU is localized', () => {
    const html = renderToStaticMarkup(<DeleteAccountPage locale="ru-RU" />);
    expect(html).toMatch(/[А-Яа-я]{4,}/);
    expect(html).not.toContain('Delete your Media Manipulator account');
    expect(html).toContain('href="/ru/account?tab=privacy"');
  });

  for (const { code } of locales) {
    it(`${code}: renders the steps and lists`, () => {
      const html = renderToStaticMarkup(<DeleteAccountPage locale={code} />);
      expect((html.match(/<li>/g) ?? []).length).toBeGreaterThanOrEqual(17);
      expect(html).toContain('DELETE MY ACCOUNT');
    });
  }
});
