import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import core from '@/i18n/locales/en-us/interface/_core.json';

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string) => {
      const k = key.replace(/^(interface|accessibility):/, '');
      const v = k.split('.').reduce<unknown>((o, p) => (o as Record<string, unknown> | undefined)?.[p], core);
      return typeof v === 'string' ? v : key;
    },
  }),
}));
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => `/ru${p === '/' ? '' : p}` }));
vi.mock('@/components/darkroom/wordmark', () => ({ Wordmark: () => null }));
vi.mock('@/lib/consent', () => ({ requestConsentReview: vi.fn() }));

import Footer from './footer';

afterEach(cleanup);

describe('footer (MM48 decision 9)', () => {
  it('links Motion and the open-source licences page, localized', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Motion' }).getAttribute('href')).toBe('/ru/tools/motion');
    expect(screen.getByRole('link', { name: core.footer.licenses }).getAttribute('href')).toBe('/ru/licenses');
  });
});
