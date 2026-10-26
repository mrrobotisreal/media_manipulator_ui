import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const h = vi.hoisted(() => ({
  auth: null as unknown,
  track: vi.fn(),
  tiers: vi.fn(),
  settings: vi.fn(),
  status: vi.fn(),
  patch: vi.fn(async () => ({})),
}));
vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/lib/billing/test-utils');
  return { useLocalization: () => m.fakeLocalization() };
});
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => 'tok' }));
vi.mock('@/lib/analytics', () => ({ analytics: { track: h.track }, EVENTS: { BILLING_CURRENCY_CHANGED: 'billing_currency_changed' } }));
vi.mock('@/lib/auth/accountApi', async (orig) => ({
  ...(await orig<typeof import('@/lib/auth/accountApi')>()),
  fetchTiers: h.tiers,
  fetchSettings: h.settings,
  fetchBillingStatus: h.status,
  patchSettings: h.patch,
}));

import { CurrencyToggle } from '@/components/pricing/currency-toggle';
import { resetCurrencyForTests } from './currency';
import { resetCurrencyLoadsForTests, useCurrency } from './useCurrency';

const SELLS_EUR = { tiers: [], premiumPurchasable: true, premiumPriceUSD: 8, defaultCurrency: 'eur', prices: { usd: {}, eur: {} } };
const Probe = () => {
  const c = useCurrency();
  return <output data-testid="probe" data-currency={c.currency} data-source={c.source} data-locked={String(c.locked)} />;
};
const probe = () => screen.getByTestId('probe').dataset;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  document.cookie = 'mm-currency=; Max-Age=0; Path=/';
  window.localStorage.clear();
  resetCurrencyForTests();
  resetCurrencyLoadsForTests();
});

describe('useCurrency (MM69)', () => {
  it('anonymous: geo default from the browser /api/tiers, a cookie beats it, the toggle switches and remembers', async () => {
    h.auth = { tier: 'anonymous', user: null };
    h.tiers.mockResolvedValue(SELLS_EUR);
    render(<><Probe /><CurrencyToggle placement="pricing" /></>);
    await waitFor(() => expect(probe()).toMatchObject({ currency: 'eur', source: 'geo' }));
    fireEvent.click(screen.getByLabelText('USD'));
    expect(probe()).toMatchObject({ currency: 'usd', source: 'cookie' });
    expect(document.cookie).toContain('mm-currency=usd');
    expect(h.track).toHaveBeenCalledWith('billing_currency_changed', { from: 'eur', to: 'usd', source: 'toggle', placement: 'pricing' });
    expect(h.patch).not.toHaveBeenCalled();
  });

  it('signed in: the account setting beats the cookie, a toggle PATCHes settings', async () => {
    document.cookie = 'mm-currency=usd; Path=/';
    h.auth = { tier: 'free', user: { uid: 'u1' } };
    h.tiers.mockResolvedValue(SELLS_EUR);
    h.settings.mockResolvedValue({ currency: 'eur' });
    h.status.mockResolvedValue({ currencyLocked: false, currency: null });
    render(<><Probe /><CurrencyToggle placement="billing_panel" /></>);
    await waitFor(() => expect(probe()).toMatchObject({ currency: 'eur', source: 'setting' }));
    fireEvent.click(screen.getByLabelText('USD'));
    await waitFor(() => expect(h.patch).toHaveBeenCalledWith('tok', { currency: 'usd' }));
  });

  it('a subscription lock wins, renders the chip (no control), and replaces a different stored pick once', async () => {
    document.cookie = 'mm-currency=usd; Path=/';
    h.auth = { tier: 'premium', user: { uid: 'u1' } };
    h.tiers.mockResolvedValue(SELLS_EUR);
    h.settings.mockResolvedValue({ currency: 'usd' });
    h.status.mockResolvedValue({ currencyLocked: true, currency: 'eur' });
    render(<><Probe /><CurrencyToggle placement="pricing" /></>);
    await waitFor(() => expect(probe()).toMatchObject({ currency: 'eur', source: 'lock', locked: 'true' }));
    expect(screen.getByTestId('currency-locked').textContent).toContain('EUR');
    expect(screen.queryByLabelText('USD')).toBeNull();
    expect(h.track).toHaveBeenCalledWith('billing_currency_changed', { from: 'usd', to: 'eur', source: 'lock', placement: 'billing_status' });
  });

  it('hidden against a pre-MM69 API (no prices.eur): USD, no toggle', async () => {
    document.cookie = 'mm-currency=eur; Path=/';
    h.auth = { tier: 'anonymous', user: null };
    h.tiers.mockResolvedValue({ tiers: [], premiumPurchasable: true, premiumPriceUSD: 8 });
    render(<><Probe /><CurrencyToggle placement="pricing" /></>);
    await act(async () => {});
    expect(probe().currency).toBe('usd');
    expect(screen.queryByLabelText('EUR')).toBeNull();
  });

  it('translator deployment: no toggle, no account reads', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    h.auth = { tier: 'free', user: { uid: 'u1' } };
    h.tiers.mockResolvedValue(SELLS_EUR);
    render(<CurrencyToggle placement="pricing" />);
    await act(async () => {});
    expect(screen.queryByLabelText('EUR')).toBeNull();
    expect(screen.queryByTestId('currency-locked')).toBeNull();
    expect(h.settings).not.toHaveBeenCalled();
    expect(h.status).not.toHaveBeenCalled();
  });
});
