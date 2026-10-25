import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';

const h = vi.hoisted(() => ({
  tier: 'free',
  verify: vi.fn(),
  account: vi.fn(),
  billing: vi.fn(),
  track: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  router: { replace: vi.fn() },
  auth: { loading: false, user: { uid: 'u1' } } as Record<string, unknown>,
}));
h.router.replace = h.replace;
h.auth.refresh = h.refresh;

vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/lib/billing/test-utils');
  return { useLocalization: () => m.fakeLocalization() };
});
vi.mock('next/navigation', () => ({
  useRouter: () => h.router,
  usePathname: () => '/account',
}));
vi.mock('@/lib/auth/AuthProvider', () => ({
  useAuth: () => h.auth,
}));
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => 'tok' }));
vi.mock('@/lib/analytics', () => ({
  analytics: { track: h.track },
  EVENTS: { CHECKOUT_COMPLETED: 'checkout_completed' },
}));
vi.mock('@/lib/auth/accountApi', async (orig) => ({
  ...(await orig<typeof import('@/lib/auth/accountApi')>()),
  verifyCheckoutSession: h.verify,
  fetchAccount: h.account,
  fetchBillingStatus: h.billing,
}));

import { CheckoutReturn, POLL_INTERVAL_MS, POLL_LIMIT_MS } from './checkout-return';

async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  window.history.pushState({}, '', '/account?tab=billing&checkout=success&session_id=cs_test_1');
  h.billing.mockResolvedValue({ interval: 'yearly' });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.clearAllMocks();
  window.history.pushState({}, '', '/');
});

describe('CheckoutReturn', () => {
  it('polls until the tier flips, then confirms and fires checkout_completed once', async () => {
    h.verify.mockResolvedValue({ belongsToUser: true, paid: true, tierApplied: false });
    h.account.mockResolvedValueOnce({ tier: 'free' }).mockResolvedValue({ tier: 'premium' });
    render(<CheckoutReturn />);
    await advance(0);
    expect(screen.getByTestId('checkout-return').dataset.phase).toBe('waiting');
    await advance(POLL_INTERVAL_MS);
    expect(h.account).toHaveBeenCalledTimes(1);
    await advance(POLL_INTERVAL_MS);
    expect(screen.getByTestId('checkout-return').dataset.phase).toBe('confirmed');
    expect(h.track).toHaveBeenCalledTimes(1);
    expect(h.track).toHaveBeenCalledWith('checkout_completed', { interval: 'yearly', plan: 'premium' });
    // Checkout params dropped; browser path and the open tab kept.
    expect(window.location.pathname + window.location.search).toBe('/account?tab=billing');
    // Polling has stopped.
    const calls = h.account.mock.calls.length;
    await advance(POLL_LIMIT_MS);
    expect(h.account.mock.calls.length).toBe(calls);
    expect(h.track).toHaveBeenCalledTimes(1);
  });

  it('confirms immediately when the webhook already applied the tier', async () => {
    h.verify.mockResolvedValue({ belongsToUser: true, paid: true, tierApplied: true });
    render(<CheckoutReturn />);
    await advance(0);
    expect(screen.getByTestId('checkout-return').dataset.phase).toBe('confirmed');
    expect(h.account).not.toHaveBeenCalled();
    expect(h.track).toHaveBeenCalledTimes(1);
  });

  it('stops at 20 s with the "shortly" message and a manual refresh', async () => {
    h.verify.mockResolvedValue({ belongsToUser: true, paid: true, tierApplied: false });
    h.account.mockResolvedValue({ tier: 'free' });
    render(<CheckoutReturn />);
    await advance(POLL_LIMIT_MS + POLL_INTERVAL_MS);
    expect(screen.getByTestId('checkout-return').dataset.phase).toBe('shortly');
    expect(screen.getByText('interface:billing.return.shortly.title')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'interface:billing.return.refresh' })).toBeTruthy();
    expect(h.account.mock.calls.length).toBeLessThanOrEqual(POLL_LIMIT_MS / POLL_INTERVAL_MS);
    expect(h.track).not.toHaveBeenCalled();
    const calls = h.account.mock.calls.length;
    await advance(POLL_LIMIT_MS);
    expect(h.account.mock.calls.length).toBe(calls);
  });

  it('shows a neutral error for a session that belongs to someone else', async () => {
    h.verify.mockResolvedValue({ belongsToUser: false, paid: false, tierApplied: false });
    render(<CheckoutReturn />);
    await advance(0);
    expect(screen.getByTestId('checkout-return').dataset.phase).toBe('foreign');
    expect(h.account).not.toHaveBeenCalled();
    expect(h.track).not.toHaveBeenCalled();
  });

  it('renders nothing without the success query', async () => {
    window.history.pushState({}, '', '/account');
    render(<CheckoutReturn />);
    await advance(0);
    expect(screen.queryByTestId('checkout-return')).toBeNull();
    expect(h.verify).not.toHaveBeenCalled();
  });

  it('checkout=success&plan=pro: Pro copy (with the Motion mention), checkout_completed carries plan pro', async () => {
    window.history.pushState({}, '', '/account?tab=billing&checkout=success&session_id=cs_test_1&plan=pro');
    h.verify.mockResolvedValue({ belongsToUser: true, paid: true, tierApplied: true, plan: 'pro' });
    render(<CheckoutReturn />);
    await advance(0);
    const panel = screen.getByTestId('checkout-return');
    expect(panel.dataset.phase).toBe('confirmed');
    expect(panel.dataset.plan).toBe('pro');
    expect(screen.getByText('interface:billing.return.confirmedPro.title')).toBeTruthy();
    expect(screen.getByText('interface:billing.return.confirmedPro.body')).toBeTruthy();
    expect(h.track).toHaveBeenCalledWith('checkout_completed', { interval: 'yearly', plan: 'pro' });
    expect(window.location.search).toBe('?tab=billing');
  });

  it('no plan in the URL (the API success URL today): reads plan from the session verdict', async () => {
    h.verify.mockResolvedValue({ belongsToUser: true, paid: true, tierApplied: true, plan: 'pro' });
    render(<CheckoutReturn />);
    await advance(0);
    expect(screen.getByText('interface:billing.return.confirmedPro.title')).toBeTruthy();
    expect(h.track).toHaveBeenCalledWith('checkout_completed', { interval: 'yearly', plan: 'pro' });
  });

  it('webhook lag: the polled tier pro confirms with Pro copy', async () => {
    h.verify.mockResolvedValue({ belongsToUser: true, paid: true, tierApplied: false, plan: null });
    h.account.mockResolvedValue({ tier: 'pro' });
    render(<CheckoutReturn />);
    await advance(0);
    await advance(POLL_INTERVAL_MS);
    expect(screen.getByTestId('checkout-return').dataset.plan).toBe('pro');
    expect(screen.getByText('interface:billing.return.confirmedPro.title')).toBeTruthy();
  });

  it('a Premium purchase keeps the Premium copy', async () => {
    h.verify.mockResolvedValue({ belongsToUser: true, paid: true, tierApplied: true, plan: 'premium' });
    render(<CheckoutReturn />);
    await advance(0);
    expect(screen.getByText('interface:billing.return.confirmed.title')).toBeTruthy();
  });
});
