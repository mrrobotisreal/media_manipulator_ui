import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const h = vi.hoisted(() => ({
  search: '',
  auth: null as unknown,
}));

// Production reality: usePathname() would be the internal rewrite (/en/account)
// while the address bar is /account. The dashboard must only touch the query.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => '/en/account',
  useSearchParams: () => new URLSearchParams(h.search),
}));
vi.mock('@/i18n/useLocalization', async () => (await import('@/components/account/test-utils')).localizationMock());
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));
vi.mock('@/lib/analytics', () => ({ analytics: { track: vi.fn() }, EVENTS: { UPGRADE_CTA_CLICKED: 'x' } }));
vi.mock('@/components/account/checkout-return', () => ({ CheckoutReturn: () => null }));
vi.mock('@/components/account/tabs/overview-tab', () => ({ OverviewTab: () => <div>OVERVIEW</div> }));
vi.mock('@/components/account/tabs/history-tab', () => ({ HistoryTab: () => <div>HISTORY</div> }));
vi.mock('@/components/account/tabs/projects-tab', () => ({ ProjectsTab: () => <div>PROJECTS</div> }));
vi.mock('@/components/account/tabs/billing-tab', () => ({ BillingTab: () => <div>BILLING</div> }));
vi.mock('@/components/account/tabs/privacy-tab', () => ({ PrivacyTab: () => <div>PRIVACY</div> }));
vi.mock('@/components/account/tabs/profile-tab', () => ({ ProfileTab: () => <div>PROFILE</div> }));

import { AccountDashboard } from './account-dashboard';
import { copy } from '@/components/account/test-utils';

const labels = { copy, tierNames: {}, unlimited: '∞', planRows: [] };
const signedIn = { loading: false, user: { uid: 'u1' }, tier: 'free', operatorEligibility: 'none', openAuth: vi.fn() };

function renderAt(search: string, auth: unknown = signedIn) {
  h.search = search;
  h.auth = auth;
  window.history.replaceState(null, '', `/account${search ? `?${search}` : ''}`);
  return render(<AccountDashboard labels={labels} />);
}

afterEach(() => {
  cleanup();
});

describe('account tabs routing', () => {
  it.each([
    ['', 'OVERVIEW'],
    ['tab=overview', 'OVERVIEW'],
    ['tab=history', 'HISTORY'],
    ['tab=projects', 'PROJECTS'],
    ['tab=billing', 'BILLING'],
    ['tab=privacy', 'PRIVACY'],
    ['tab=profile', 'PROFILE'],
  ])('?%s shows %s', (search, text) => {
    renderAt(search);
    expect(screen.getByText(text)).toBeTruthy();
  });

  it('an unknown tab falls back to the overview', () => {
    renderAt('tab=banana');
    expect(screen.getByText('OVERVIEW')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Overview' }).getAttribute('aria-selected')).toBe('true');
  });

  it('exposes six labelled tabs inside a labelled tablist, with the active one selected', () => {
    renderAt('tab=history');
    expect(screen.getByRole('tablist', { name: 'Account sections' })).toBeTruthy();
    expect(screen.getAllByRole('tab')).toHaveLength(6);
    expect(screen.getByRole('tab', { name: 'History' }).getAttribute('aria-selected')).toBe('true');
  });

  it('changing tab rewrites only the query on the browser path and keeps other params', () => {
    renderAt('tab=history&checkout=cancelled');
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Privacy & data' }));
    expect(window.location.pathname + window.location.search).toBe('/account?tab=privacy&checkout=cancelled');
  });

  it('going back to overview drops the tab param', () => {
    renderAt('tab=history');
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Overview' }));
    expect(window.location.pathname + window.location.search).toBe('/account');
  });

  it('regression: leaving Profile never navigates to the internal /en path', () => {
    renderAt('tab=profile');
    for (const name of ['History', 'Projects', 'Billing', 'Privacy & data', 'Overview']) {
      fireEvent.mouseDown(screen.getByRole('tab', { name }));
      expect(window.location.pathname).toBe('/account');
    }
  });

  it('signed-out state is unchanged: sign-in prompt, no tabs', () => {
    renderAt('tab=privacy', { loading: false, user: null, tier: 'anonymous', openAuth: vi.fn() });
    expect(screen.getByText(copy.signedOutTitle)).toBeTruthy();
    expect(screen.queryByRole('tablist')).toBeNull();
  });
});
