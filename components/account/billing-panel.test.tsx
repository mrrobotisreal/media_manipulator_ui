import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const h = vi.hoisted(() => ({
  auth: null as unknown,
  status: null as unknown,
  track: vi.fn(),
  startCheckout: vi.fn(),
  openPortal: vi.fn(),
  retain: vi.fn(),
  toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}));
vi.mock('sonner', () => ({ toast: h.toast }));

vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/lib/billing/test-utils');
  return { useLocalization: () => m.fakeLocalization() };
});
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => 'tok' }));
vi.mock('@/lib/analytics', () => ({
  analytics: { track: h.track },
  EVENTS: {
    SUBSCRIPTION_STATUS_VIEWED: 'subscription_status_viewed',
    RETENTION_OFFER_VIEWED: 'retention_offer_viewed',
    RETENTION_OFFER_ACCEPTED: 'retention_offer_accepted',
  },
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
  retainSubscription: (...args: unknown[]) => h.retain(...args),
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

  it('cancel_at_period_end: cancelled headline, body, "Premium ends on" label, never "Renews"', async () => {
    const { container } = renderPanel('premium', { status: 'active', interval: 'monthly', cancelAtPeriodEnd: true, endsAt: '2026-11-23T00:00:00Z', renewsAt: '2026-12-01T00:00:00Z', portalAvailable: true });
    await screen.findByText('interface:billing.panel.cancelledTitle');
    expect(screen.getByText(/billing\.panel\.cancelledBody\|date=D\(2026-11-23/)).toBeTruthy();
    expect(screen.getByText('interface:billing.panel.endsLabel')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'interface:billing.manage' })).toBeTruthy();
    expect(container.textContent).not.toMatch(/renews/i);
  });

  it('cancel_at_period_end without endsAt falls back to renewsAt and still never says Renews', async () => {
    const { container } = renderPanel('premium', { status: 'active', interval: 'monthly', cancelAtPeriodEnd: true, renewsAt: '2026-12-01T00:00:00Z', portalAvailable: true });
    await screen.findByText(/billing\.panel\.cancelledBody\|date=D\(2026-12-01/);
    expect(screen.getByText('interface:billing.panel.endsLabel')).toBeTruthy();
    expect(container.textContent).not.toMatch(/renews/i);
    expect(screen.getByText(/billing\.panel\.resumeHint/)).toBeTruthy();
    expect(screen.queryByTestId('retention-offer')).toBeNull();
  });

  it('cancelled with neither date: no date row and no Renews', async () => {
    const { container } = renderPanel('premium', { status: 'active', interval: 'monthly', cancelAtPeriodEnd: true, portalAvailable: true });
    await screen.findByText('interface:billing.panel.cancelledTitle');
    expect(screen.getByText(/cancelledBodyNoDate/)).toBeTruthy();
    expect(container.textContent).not.toMatch(/renews/i);
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

describe('retention offer', () => {
  const cancelled = {
    status: 'active', interval: 'monthly', cancelAtPeriodEnd: true, portalAvailable: true,
    renewsAt: '2026-11-23T00:00:00Z', endsAt: '2026-11-23T00:00:00Z', priceMonthlyUSD: 8,
  };
  const offerOf = (kind: string, priceUSD: number) => ({ kind, priceUSD, nextChargeAt: '2026-11-23T00:00:00Z' });

  it('no offer object: no card (older API)', async () => {
    renderPanel('premium', cancelled);
    await screen.findByText('interface:billing.panel.cancelledTitle');
    expect(screen.queryByTestId('retention-offer')).toBeNull();
    expect(h.track).not.toHaveBeenCalledWith('retention_offer_viewed', expect.anything());
  });

  it.each([['retain7', 7], ['retain6', 6]])('%s: discounted headline, fine print, secondary resume link, viewed once', async (kind, price) => {
    renderPanel('premium', { ...cancelled, offer: offerOf(kind, price) });
    const card = await screen.findByTestId('retention-offer');
    expect(card.dataset.offer).toBe(kind);
    expect(screen.getByText(`interface:billing.offer.title|price=${price}`)).toBeTruthy();
    // The fine print names both prices, so "the new price" is never left unexplained.
    expect(screen.getByText(new RegExp(`billing\\.offer\\.fineprint\\|date=D\\(2026-11-23[^|]*\\),price=${price},current=8`))).toBeTruthy();
    expect(screen.getByRole('button', { name: 'interface:billing.offer.keepAtCurrent|price=8' })).toBeTruthy();
    await waitFor(() => expect(h.track).toHaveBeenCalledWith('retention_offer_viewed', { offer: kind }));
    expect(h.track.mock.calls.filter((c) => c[0] === 'retention_offer_viewed')).toHaveLength(1);
  });

  it('resume (yearly): shows the current price, same-price fine print, no discount, no secondary link', async () => {
    renderPanel('premium', { ...cancelled, interval: 'yearly', offer: offerOf('resume', 80) });
    await screen.findByText('interface:billing.offer.resumeTitle');
    expect(screen.getByText('interface:billing.offer.resumePrice|price=80,unit=interface:billing.offer.unitYear')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'interface:billing.offer.resumeCta|price=80,unit=interface:billing.offer.unitYear' })).toBeTruthy();
    expect(screen.queryByText(/keepAtCurrent/)).toBeNull();
    expect(screen.getByText(/billing\.offer\.resumeFineprint/)).toBeTruthy();
    expect(screen.queryByText(/billing\.offer\.fineprint/)).toBeNull();
  });

  // Mitch's case: a monthly subscriber already on $7 (signed up before $8) gets
  // "resume" at $7. The card must say $7 and must not mention a "new price".
  it('resume (monthly, legacy $7): shows $7/month and no "new price" fine print', async () => {
    renderPanel('premium', { ...cancelled, interval: 'monthly', priceMonthlyUSD: 7, offer: offerOf('resume', 7) });
    await screen.findByText('interface:billing.offer.resumeTitle');
    expect(screen.getByText('interface:billing.offer.resumePrice|price=7,unit=interface:billing.offer.unitMonth')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'interface:billing.offer.resumeCta|price=7,unit=interface:billing.offer.unitMonth' })).toBeTruthy();
    expect(screen.getByText(/billing\.offer\.resumeFineprint/)).toBeTruthy();
    expect(screen.queryByText(/billing\.offer\.fineprint/)).toBeNull();
  });

  it('accept success: posts the kind once, replaces status, toasts, tracks accepted', async () => {
    let release!: (v: unknown) => void;
    h.retain.mockReturnValue(new Promise((r) => { release = r; }));
    renderPanel('premium', { ...cancelled, offer: offerOf('retain7', 7) });
    const btn = await screen.findByRole('button', { name: 'interface:billing.offer.cta|price=7' });
    fireEvent.click(btn);
    fireEvent.click(btn);
    await waitFor(() => expect(screen.getByRole('button', { name: 'interface:billing.offer.working' }).hasAttribute('disabled')).toBe(true));
    expect(h.retain).toHaveBeenCalledTimes(1);
    expect(h.retain).toHaveBeenCalledWith('tok', 'retain7');
    release({ ok: true, status: { ...base, ...cancelled, cancelAtPeriodEnd: false, endsAt: null, priceMonthlyUSD: 7, offer: null } });
    await waitFor(() => expect(h.toast.success).toHaveBeenCalledWith('interface:billing.offer.renewed|date=D(2026-11-23T00:00:00Z),price=7'));
    expect(h.track).toHaveBeenCalledWith('retention_offer_accepted', { offer: 'retain7' });
    await waitFor(() => expect(screen.getByTestId('billing-panel').dataset.state).toBe('active'));
    expect(screen.queryByTestId('retention-offer')).toBeNull();
  });

  it('secondary link accepts resume', async () => {
    h.retain.mockResolvedValue({ ok: false, reason: 'error', status: 502 });
    renderPanel('premium', { ...cancelled, offer: offerOf('retain6', 6) });
    fireEvent.click(await screen.findByRole('button', { name: 'interface:billing.offer.keepAtCurrent|price=8' }));
    await waitFor(() => expect(h.retain).toHaveBeenCalledWith('tok', 'resume'));
    await waitFor(() => expect(h.toast.error).toHaveBeenCalledWith('interface:billing.offer.failed'));
    expect(h.track).not.toHaveBeenCalledWith('retention_offer_accepted', expect.anything());
  });

  it('409 offer_changed: card shows the fresh offer and says it changed', async () => {
    h.retain.mockResolvedValue({ ok: false, reason: 'offer_changed', offer: offerOf('retain6', 6) });
    renderPanel('premium', { ...cancelled, offer: offerOf('retain7', 7) });
    fireEvent.click(await screen.findByRole('button', { name: 'interface:billing.offer.cta|price=7' }));
    await waitFor(() => expect(h.toast).toHaveBeenCalledWith('interface:billing.offer.changed'));
    await screen.findByText('interface:billing.offer.title|price=6');
    expect(screen.getByTestId('retention-offer').dataset.offer).toBe('retain6');
  });

  it('409 not_cancelled: refetches the status', async () => {
    h.retain.mockResolvedValue({ ok: false, reason: 'not_cancelled' });
    renderPanel('premium', { ...cancelled, offer: offerOf('retain7', 7) });
    const btn = await screen.findByRole('button', { name: 'interface:billing.offer.cta|price=7' });
    const accountApi = await import('@/lib/auth/accountApi');
    const calls = vi.mocked(accountApi.fetchBillingStatus).mock.calls.length;
    h.status = { ...base, ...cancelled, cancelAtPeriodEnd: false, offer: null };
    fireEvent.click(btn);
    await waitFor(() => expect(vi.mocked(accountApi.fetchBillingStatus).mock.calls.length).toBe(calls + 1));
    await waitFor(() => expect(screen.getByTestId('billing-panel').dataset.state).toBe('active'));
    expect(h.toast.error).not.toHaveBeenCalled();
  });
});
