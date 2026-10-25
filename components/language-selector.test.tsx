/**
 * MM51: the selector lists every registered locale (17) with its native label
 * and flag, and choosing one navigates to the same path under its prefix.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import LanguageSelector from './language-selector';
import { createI18nInstance } from '@/i18n';
import { locales } from '@/i18n/locales';

const nav = vi.hoisted(() => ({ push: vi.fn(), pathname: '/tools/compress-image' }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: nav.push }),
  usePathname: () => nav.pathname,
}));

afterEach(() => {
  cleanup();
  nav.push.mockReset();
});

function open(pathname = '/tools/compress-image', locale = 'en-US') {
  nav.pathname = pathname;
  render(
    <I18nextProvider i18n={createI18nInstance(locale)}>
      <LanguageSelector />
    </I18nextProvider>,
  );
  fireEvent.click(screen.getByRole('button'));
  return screen.getByRole('listbox');
}

describe('LanguageSelector', () => {
  it('lists all 17 locales with native labels and flags', () => {
    const options = within(open()).getAllByRole('option');
    expect(options).toHaveLength(17);
    expect(locales).toHaveLength(17);
    locales.forEach((l, i) => {
      expect(options[i].textContent).toContain(l.label);
      expect(options[i].textContent).toContain(l.flag);
    });
  });

  it('selecting Arabic navigates to the /ar version of the page', () => {
    const list = open();
    fireEvent.click(within(list).getByRole('option', { name: /العربية/ }));
    expect(nav.push).toHaveBeenCalledWith('/ar/tools/compress-image');
  });

  it('switches between two hyphenated prefixes', () => {
    const list = open('/zh-cn/pricing', 'en-US');
    fireEvent.click(within(list).getByRole('option', { name: /Português \(Brasil\)/ }));
    expect(nav.push).toHaveBeenCalledWith('/pt-br/pricing');
  });

  it('selecting English returns to the unprefixed URL', () => {
    const list = open('/ar/about');
    fireEvent.click(within(list).getByRole('option', { name: /English/ }));
    expect(nav.push).toHaveBeenCalledWith('/about');
  });
});
