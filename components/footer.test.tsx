import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

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
import { requestConsentReview } from '@/lib/consent';

afterEach(() => {
  cleanup();
  vi.mocked(requestConsentReview).mockClear();
  delete (window as { googlefc?: unknown }).googlefc;
});

describe('footer (MM48 decision 9)', () => {
  it('links Motion and the open-source licences page, localized', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Motion' }).getAttribute('href')).toBe('/ru/tools/motion');
    expect(screen.getByRole('link', { name: core.footer.licenses }).getAttribute('href')).toBe('/ru/licenses');
  });
});

describe('footer Cookie settings (MM82 decision 4)', () => {
  it('reopens Google’s consent message when it is present', () => {
    const showRevocationMessage = vi.fn();
    const callbackQueue: Array<() => void> = [];
    (window as { googlefc?: unknown }).googlefc = { callbackQueue, showRevocationMessage };
    render(<Footer />);
    fireEvent.click(screen.getByRole('button', { name: core.footer.cookieSettings }));
    callbackQueue.forEach((cb) => cb());
    expect(showRevocationMessage).toHaveBeenCalledTimes(1);
    expect(requestConsentReview).not.toHaveBeenCalled();
  });

  it('otherwise opens the first-party preferences centre, never an explainer dialog', () => {
    render(<Footer />);
    fireEvent.click(screen.getByRole('button', { name: core.footer.cookieSettings }));
    expect(requestConsentReview).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('falls back to the preferences centre when Google’s message throws', () => {
    const callbackQueue: Array<() => void> = [];
    (window as { googlefc?: unknown }).googlefc = {
      callbackQueue,
      showRevocationMessage: () => {
        throw new Error('blocked');
      },
    };
    render(<Footer />);
    fireEvent.click(screen.getByRole('button', { name: core.footer.cookieSettings }));
    callbackQueue.forEach((cb) => cb());
    expect(requestConsentReview).toHaveBeenCalledTimes(1);
  });
});
