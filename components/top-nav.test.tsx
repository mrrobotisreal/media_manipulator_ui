/**
 * MM88: the four icon controls in the sticky nav (mobile-menu trigger, theme toggle,
 * language trigger, account trigger) each have a hit area of at least 44 x 44 px, and
 * neighbouring hit areas do not overlap.
 *
 * jsdom has no layout, so this asserts the class contract instead of measured boxes:
 * `size-9` (36px) plus an `after:-inset-1` pseudo-element (4px on every side) is 44px,
 * and the row's `gap-2` (8px) is exactly two extensions. The 320px no-overflow check is
 * on Mitch's phone checklist (MM88 ticket), with the width budget in top-nav.tsx.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import { createI18nInstance } from '@/i18n';
import { NAV_HIT_EXTENSION, NAV_ICON_CONTROL } from '@/components/nav-control';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/tools',
}));
vi.mock('@/components/theme-provider', () => ({
  useTheme: () => ({ theme: 'dark', resolvedTheme: 'dark', setTheme: vi.fn() }),
}));
vi.mock('@/components/darkroom/aperture-motion', () => ({ AnimatedApertureMark: () => null }));
vi.mock('@/lib/analytics', () => ({ analytics: { track: vi.fn() }, EVENTS: {} }));
vi.mock('@/lib/billing/useUpgradeAction', () => ({ useUpgradeAction: () => ({ run: vi.fn() }) }));
vi.mock('@/lib/billing/useBillingStatus', () => ({ useCancelledEndsAt: () => null }));
// Signed in, so the account slot renders the meter + the (dynamic) account trigger.
vi.mock('@/lib/auth/AuthProvider', () => ({
  useAuth: () => ({
    loading: false,
    user: { uid: 'u1', email: 'a@b.c' },
    tier: 'free',
    usage: { ops: 1 },
    resetsAt: null,
    allowanceOf: () => 20,
    openAuth: vi.fn(),
    signOut: vi.fn(),
  }),
}));
// next/dynamic resolves asynchronously; render the real dropdown synchronously.
vi.mock('next/dynamic', async () => {
  const mod = await import('@/components/account/account-dropdown');
  return { default: () => mod.default };
});

import TopNav from './top-nav';

afterEach(cleanup);

const ACCOUNT_LABEL = 'Account menu';

/** px from Tailwind's spacing scale (0.25rem = 4px per step). */
function hitArea(className: string): number {
  const size = /(?:^|\s)size-(\d+)(?:\s|$)/.exec(className);
  const inset = /(?:^|\s)after:-inset-(\d+)(?:\s|$)/.exec(className);
  expect(size, `size-* in "${className}"`).not.toBeNull();
  expect(inset, `after:-inset-* in "${className}"`).not.toBeNull();
  expect(className).toMatch(/(?:^|\s)after:absolute(?:\s|$)/);
  expect(className).toMatch(/(?:^|\s)relative(?:\s|$)/);
  return Number(size![1]) * 4 + 2 * Number(inset![1]) * 4;
}

function renderNav() {
  render(
    <I18nextProvider i18n={createI18nInstance('en-US')}>
      <TopNav />
    </I18nextProvider>,
  );
}

describe('MM88 nav controls: 44 px hit areas', () => {
  it('the shared control class is a 36px box with a 4px extension (44px)', () => {
    expect(hitArea(NAV_ICON_CONTROL)).toBe(44);
    expect(NAV_ICON_CONTROL).toContain(NAV_HIT_EXTENSION);
  });

  it('hamburger, theme toggle, language trigger and account trigger each have a >= 44px hit area', () => {
    renderNav();
    const controls = {
      hamburger: screen.getByRole('button', { name: 'Open menu' }),
      theme: screen.getByRole('button', { name: 'Toggle theme' }),
      language: screen.getByRole('button', { name: 'Change language' }),
      account: screen.getByRole('button', { name: ACCOUNT_LABEL }),
    };
    for (const [name, el] of Object.entries(controls)) {
      expect(hitArea(el.className), name).toBeGreaterThanOrEqual(44);
    }
  });

  it('the control row is gap-2 (two 4px extensions), so neighbouring hit areas abut but never overlap', () => {
    renderNav();
    const row = screen.getByRole('button', { name: 'Open menu' }).parentElement!;
    expect(row.className).toMatch(/(?:^|\s)gap-2(?:\s|$)/);
    expect(row.className).not.toMatch(/space-x-/);
  });

  it('keeps the 56px nav bar (h-14) the controls are centred in', () => {
    renderNav();
    const bar = document.querySelector('[data-site-header] > div')!;
    expect(bar.className).toMatch(/(?:^|\s)h-14(?:\s|$)/);
    expect(bar.className).toMatch(/(?:^|\s)items-center(?:\s|$)/);
  });
});
