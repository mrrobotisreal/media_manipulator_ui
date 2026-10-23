import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const h = vi.hoisted(() => ({
  auth: null as unknown,
  status: null as unknown,
  track: vi.fn(),
  startCheckout: vi.fn(),
  openPortal: vi.fn(),
}));

vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/lib/billing/test-utils');
  return { useLocalization: () => m.fakeLocalization() };
});
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => 'tok' }));
vi.mock('@/lib/analytics', () => ({
  analytics: { track: h.track },
  EVENTS: { SUBSCRIPTION_STATUS_VIEWED: 'subscription_status_viewed' },
}));
vi.mock('@/lib/billing/useUpgradeAction', () => ({ useBillingFallback: () => vi.fn(async () => undefined) }));
vi.mock('@/lib/billing/checkout', async (orig) => ({
  ...(await orig<typeof import('@/lib/billing/checkout')>()),
  startCheckout: h.startCheckout,
  openPortal: h.openPortal,
}));
vi.mock('@/lib/auth/accountApi', async (orig) => ({
  ...(await orig<typeof import('@/lib/auth/accountApi')>()),
  fetchBillingStatus: vi.fn(async () => h.status),
  fetchTiers: vi.fn(async () => ({ tiers: [], premiumPurchasable: true, premiumPriceUSD: 7, premiumPriceYearlyUSD: 70 })),
}));

import { BillingPanel, billingState } from './billing-panel';

const base = {
  purchasable: true, interval: null, status: null, renewsAt: null, cancelAtPeriodEnd: false,
  portalAvailable: false, manualGrant: null,
};

function renderPanel(tier: string, status: object | null) {
  h.auth = { tier, user: { uid: 'u1' }, loading: false };
  h.status = status && { ...base, ...status };
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <BillingPanel />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  window.sessionStorage.clear();
});

describe('billingState', () => {
  it('maps status onto the seven panel states', () => {
    expect(billingState('operator', undefined)).toBe('operator');
    expect(billingState('premium', { ...base, manualGrant: { expiresAt: null } })).toBe('manual_grant');
    expect(billingState('premium', { ...base, status: 'past_due', interval: 'monthly' })).toBe('past_due');
    expect(billingState('premium', { ...base, status: 'active', cancelAtPeriodEnd: true })).toBe('cancel_at_period_end');
    expect(billingState('premium', { ...base, status: 'active' })).toBe('active');
    expect(billingState('free', { ...base, status: 'canceled' })).toBe('free');
    expect(billingState('free', { ...base, purchasable: false })).toBe('unavailable');
  });
});

describe('BillingPanel states', () => {
  it('free: plan body, interval toggle, prices and an Upgrade CTA that starts checkout', async () => {
    renderPanel('free', {});
    await screen.findByText('interface:billing.panel.freeBody');
    expect(screen.getByTestId('billing-panel').dataset.state).toBe('free');
    await screen.findByText('$7interface:billing.perMonth');
    fireEvent.click(screen.getByLabelText('interface:billing.yearly'));
    expect(screen.getByText('$70interface:billing.perYear')).toBeTruthy();
    h.startCheckout.mockResolvedValue({ ok: true });
    fireEvent.click(screen.getByRole('button', { name: 'interface:billing.panel.upgrade' }));
    await waitFor(() => expect(h.startCheckout).toHaveBeenCalledWith('yearly', 'account_billing', 'en-US'));
  });

  it('active: interval, renew date and Manage subscription -> portal', async () => {
    renderPanel('premium', { status: 'active', interval: 'yearly', renewsAt: '2027-01-01T00:00:00Z', portalAvailable: true });
    await screen.findByText(/billing\.panel\.renewsOn\|date=D\(2027-01-01/);
    expect(screen.getByText('interface:billing.yearly')).toBeTruthy();
    h.openPortal.mockResolvedValue({ ok: true });
    fireEvent.click(screen.getByRole('button', { name: 'interface:billing.manage' }));
    await waitFor(() => expect(h.openPortal).toHaveBeenCalledWith('account_billing', 'en-US'));
    expect(screen.queryByText('interface:billing.panel.upgrade')).toBeNull();
  });

  it('cancel_at_period_end: shows "Ends on" and the resume hint', async () => {
    renderPanel('premium', { status: 'active', interval: 'monthly', cancelAtPeriodEnd: true, renewsAt: '2026-12-01T00:00:00Z', portalAvailable: true });
    await screen.findByText(/billing\.panel\.endsOn\|date=D\(2026-12-01/);
    expect(screen.getByText('interface:billing.panel.endsLabel')).toBeTruthy();
    expect(screen.getByText(/billing\.panel\.resumeHint/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'interface:billing.manage' })).toBeTruthy();
  });

  it('past_due: warning, grace copy and Update payment method', async () => {
    renderPanel('premium', { status: 'past_due', interval: 'monthly', renewsAt: '2026-11-01T00:00:00Z', portalAvailable: true });
    await screen.findByRole('alert');
    expect(screen.getByText('interface:billing.panel.pastDueBody')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'interface:billing.panel.updatePayment' })).toBeTruthy();
  });

  it('manual grant with an end date: no Stripe controls, no Upgrade', async () => {
    renderPanel('premium', { manualGrant: { expiresAt: '2027-03-01T00:00:00Z' } });
    await screen.findByText(/billing\.panel\.grantUntil\|date=D\(2027-03-01/);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('manual grant with no end date', async () => {
    renderPanel('premium', { manualGrant: { expiresAt: null } });
    await screen.findByText('interface:billing.panel.grantOpen');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('operator: just "Operator access", and no billing request', async () => {
    renderPanel('operator', null);
    await screen.findByText('interface:billing.panel.operator');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('billing unavailable: hides every CTA', async () => {
    renderPanel('free', { purchasable: false });
    await screen.findByText('interface:billing.panel.unavailable');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('fires subscription_status_viewed exactly once per mount', async () => {
    const { rerender } = renderPanel('premium', { status: 'active', interval: 'yearly', portalAvailable: true });
    await screen.findByTestId('billing-panel');
    await waitFor(() => expect(h.track).toHaveBeenCalledTimes(1));
    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <BillingPanel />
      </QueryClientProvider>,
    );
    expect(h.track).toHaveBeenCalledWith('subscription_status_viewed', { status: 'active', interval: 'yearly' });
    expect(h.track).toHaveBeenCalledTimes(1);
  });
});
