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
  change: vi.fn(),
  keep: vi.fn(),
  tiers: null as unknown,
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
    BILLING_PLAN_CHANGE_REQUESTED: 'billing_plan_change_requested',
    BILLING_PLAN_CHANGE_CANCELLED: 'billing_plan_change_cancelled',
    BILLING_CURRENCY_CHANGED: 'billing_currency_changed',
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
  requestPlanChange: (...args: unknown[]) => h.change(...args),
  cancelPlanChange: (...args: unknown[]) => h.keep(...args),
  fetchTiers: vi.fn(async () => h.tiers ?? ({ tiers: [], premiumPurchasable: true, premiumPriceUSD: 7, premiumPriceYearlyUSD: 70 })),
  fetchSettings: vi.fn(async () => ({ currency: null })),
  patchSettings: vi.fn(async () => ({})),
}));

import { BillingPanel, billingState } from './billing-panel';
import { resetCurrencyForTests } from '@/lib/billing/currency';
import { resetCurrencyLoadsForTests } from '@/lib/billing/useCurrency';

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
  h.tiers = null;
  window.sessionStorage.clear();
  window.localStorage.clear();
  document.cookie = 'mm-currency=; Max-Age=0; Path=/';
  resetCurrencyForTests();
  resetCurrencyLoadsForTests();
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
    expect(screen.getByText(`interface:billing.offer.title|price=$${price}`)).toBeTruthy();
    // The fine print names both prices, so "the new price" is never left unexplained.
    expect(screen.getByText(new RegExp(`billing\\.offer\\.fineprint\\|date=D\\(2026-11-23[^|]*\\),price=\\$${price},current=\\$8`))).toBeTruthy();
    expect(screen.getByRole('button', { name: 'interface:billing.offer.keepAtCurrent|price=$8' })).toBeTruthy();
    await waitFor(() => expect(h.track).toHaveBeenCalledWith('retention_offer_viewed', { offer: kind }));
    expect(h.track.mock.calls.filter((c) => c[0] === 'retention_offer_viewed')).toHaveLength(1);
  });

  it('resume (yearly): shows the current price, same-price fine print, no discount, no secondary link', async () => {
    renderPanel('premium', { ...cancelled, interval: 'yearly', offer: offerOf('resume', 80) });
    await screen.findByText('interface:billing.offer.resumeTitle');
    expect(screen.getByText('interface:billing.offer.resumePrice|price=$80,unit=interface:billing.offer.unitYear')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'interface:billing.offer.resumeCta|price=$80,unit=interface:billing.offer.unitYear' })).toBeTruthy();
    expect(screen.queryByText(/keepAtCurrent/)).toBeNull();
    expect(screen.getByText(/billing\.offer\.resumeFineprint/)).toBeTruthy();
    expect(screen.queryByText(/billing\.offer\.fineprint/)).toBeNull();
  });

  // Mitch's case: a monthly subscriber already on $7 (signed up before $8) gets
  // "resume" at $7. The card must say $7 and must not mention a "new price".
  it('resume (monthly, legacy $7): shows $7/month and no "new price" fine print', async () => {
    renderPanel('premium', { ...cancelled, interval: 'monthly', priceMonthlyUSD: 7, offer: offerOf('resume', 7) });
    await screen.findByText('interface:billing.offer.resumeTitle');
    expect(screen.getByText('interface:billing.offer.resumePrice|price=$7,unit=interface:billing.offer.unitMonth')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'interface:billing.offer.resumeCta|price=$7,unit=interface:billing.offer.unitMonth' })).toBeTruthy();
    expect(screen.getByText(/billing\.offer\.resumeFineprint/)).toBeTruthy();
    expect(screen.queryByText(/billing\.offer\.fineprint/)).toBeNull();
  });

  it('accept success: posts the kind once, replaces status, toasts, tracks accepted', async () => {
    let release!: (v: unknown) => void;
    h.retain.mockReturnValue(new Promise((r) => { release = r; }));
    renderPanel('premium', { ...cancelled, offer: offerOf('retain7', 7) });
    const btn = await screen.findByRole('button', { name: 'interface:billing.offer.cta|price=$7' });
    fireEvent.click(btn);
    fireEvent.click(btn);
    await waitFor(() => expect(screen.getByRole('button', { name: 'interface:billing.offer.working' }).hasAttribute('disabled')).toBe(true));
    expect(h.retain).toHaveBeenCalledTimes(1);
    expect(h.retain).toHaveBeenCalledWith('tok', 'retain7');
    release({ ok: true, status: { ...base, ...cancelled, cancelAtPeriodEnd: false, endsAt: null, priceMonthlyUSD: 7, offer: null } });
    await waitFor(() => expect(h.toast.success).toHaveBeenCalledWith('interface:billing.offer.renewed|date=D(2026-11-23T00:00:00Z),price=$7'));
    expect(h.track).toHaveBeenCalledWith('retention_offer_accepted', { offer: 'retain7' });
    await waitFor(() => expect(screen.getByTestId('billing-panel').dataset.state).toBe('active'));
    expect(screen.queryByTestId('retention-offer')).toBeNull();
  });

  it('secondary link accepts resume', async () => {
    h.retain.mockResolvedValue({ ok: false, reason: 'error', status: 502 });
    renderPanel('premium', { ...cancelled, offer: offerOf('retain6', 6) });
    fireEvent.click(await screen.findByRole('button', { name: 'interface:billing.offer.keepAtCurrent|price=$8' }));
    await waitFor(() => expect(h.retain).toHaveBeenCalledWith('tok', 'resume'));
    await waitFor(() => expect(h.toast.error).toHaveBeenCalledWith('interface:billing.offer.failed'));
    expect(h.track).not.toHaveBeenCalledWith('retention_offer_accepted', expect.anything());
  });

  it('409 offer_changed: card shows the fresh offer and says it changed', async () => {
    h.retain.mockResolvedValue({ ok: false, reason: 'offer_changed', offer: offerOf('retain6', 6) });
    renderPanel('premium', { ...cancelled, offer: offerOf('retain7', 7) });
    fireEvent.click(await screen.findByRole('button', { name: 'interface:billing.offer.cta|price=$7' }));
    await waitFor(() => expect(h.toast).toHaveBeenCalledWith('interface:billing.offer.changed'));
    await screen.findByText('interface:billing.offer.title|price=$6');
    expect(screen.getByTestId('retention-offer').dataset.offer).toBe('retain6');
  });

  it('409 not_cancelled: refetches the status', async () => {
    h.retain.mockResolvedValue({ ok: false, reason: 'not_cancelled' });
    renderPanel('premium', { ...cancelled, offer: offerOf('retain7', 7) });
    const btn = await screen.findByRole('button', { name: 'interface:billing.offer.cta|price=$7' });
    const accountApi = await import('@/lib/auth/accountApi');
    const calls = vi.mocked(accountApi.fetchBillingStatus).mock.calls.length;
    h.status = { ...base, ...cancelled, cancelAtPeriodEnd: false, offer: null };
    fireEvent.click(btn);
    await waitFor(() => expect(vi.mocked(accountApi.fetchBillingStatus).mock.calls.length).toBe(calls + 1));
    await waitFor(() => expect(screen.getByTestId('billing-panel').dataset.state).toBe('active'));
    expect(h.toast.error).not.toHaveBeenCalled();
  });
});

describe('translator mode (MM52)', () => {
  afterEach(() => vi.unstubAllEnvs());
  const offerCancelled = {
    status: 'active', interval: 'monthly', cancelAtPeriodEnd: true, portalAvailable: true,
    renewsAt: '2026-11-23T00:00:00Z', endsAt: '2026-11-23T00:00:00Z', priceMonthlyUSD: 8,
    offer: { kind: 'retain7', priceUSD: 7, nextChargeAt: '2026-11-23T00:00:00Z' },
  };

  it('translator mode: hides the upgrade button', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    renderPanel('free', {});
    await screen.findByText('interface:billing.panel.freeBody');
    expect(screen.queryByRole('button', { name: 'interface:billing.panel.upgrade' })).toBeNull();
  });

  it('production: shows the upgrade button', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    renderPanel('free', {});
    await screen.findByText('interface:billing.panel.freeBody');
    expect(screen.getByRole('button', { name: 'interface:billing.panel.upgrade' })).toBeTruthy();
  });

  it('translator mode: hides the Manage subscription portal button', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    renderPanel('premium', { status: 'active', interval: 'yearly', portalAvailable: true });
    await screen.findByText('interface:billing.yearly');
    expect(screen.queryByRole('button', { name: 'interface:billing.manage' })).toBeNull();
  });

  it('production: shows the Manage subscription portal button', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    renderPanel('premium', { status: 'active', interval: 'yearly', portalAvailable: true });
    expect(await screen.findByRole('button', { name: 'interface:billing.manage' })).toBeTruthy();
  });

  it('translator mode: hides the retention offer card', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    renderPanel('premium', offerCancelled);
    await screen.findByText('interface:billing.panel.cancelledTitle');
    expect(screen.queryByTestId('retention-offer')).toBeNull();
  });

  it('production: shows the retention offer card', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    renderPanel('premium', offerCancelled);
    expect(await screen.findByTestId('retention-offer')).toBeTruthy();
  });

  const nudgeEligible = {
    status: 'active', interval: 'monthly', portalAvailable: true, periodsPaid: 4, renewsAt: '2026-11-23T00:00:00Z',
  };

  it('translator mode: hides the yearly-switch nudge', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    window.localStorage.clear();
    renderPanel('premium', nudgeEligible);
    await screen.findByText('interface:billing.monthly');
    expect(screen.queryByText('interface:yearlyNudge.cta')).toBeNull();
  });

  it('production: shows the yearly-switch nudge', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    window.localStorage.clear();
    renderPanel('premium', nudgeEligible);
    expect(await screen.findByText('interface:yearlyNudge.cta')).toBeTruthy();
  });
});

describe('Pro plan states (MM40 decision 4)', () => {
  const active = { status: 'active', interval: 'monthly', renewsAt: '2026-11-25T00:00:00Z', portalAvailable: true };
  const withPro = async () => {
    const m = await import('@/lib/billing/test-utils');
    h.tiers = m.tiersFixture();
  };

  it('premium: plan chip reads Premium; "Upgrade to Pro" confirms the prorated charge, then posts target pro', async () => {
    await withPro();
    h.change.mockResolvedValue({ plan: 'pro', pendingPlan: null, timing: 'immediate' });
    renderPanel('premium', { ...active, plan: 'premium' });
    expect((await screen.findByTestId('billing-plan-chip')).dataset.plan).toBe('premium');
    fireEvent.click(await screen.findByRole('button', { name: 'interface:billing.upgradePro' }));
    const dialog = await screen.findByTestId('plan-change-dialog');
    // The served Pro monthly price (fixture: 17), the unchanged renewal date.
    expect(dialog.textContent).toContain('interface:billing.planChange.upgrade.body|date=D(2026-11-25T00:00:00Z),price=$17,unit=interface:billing.offer.unitMonth');
    fireEvent.click(screen.getByRole('button', { name: 'interface:billing.planChange.upgrade.confirm' }));
    await waitFor(() => expect(h.change).toHaveBeenCalledWith('tok', 'pro'));
    expect(h.track).toHaveBeenCalledWith('billing_plan_change_requested', { from: 'premium', to: 'pro', timing: 'immediate', currency: 'usd' });
    await waitFor(() => expect(h.toast.success).toHaveBeenCalledWith('interface:billing.planChange.upgraded'));
    expect(screen.queryByRole('button', { name: 'interface:billing.switchToPremium' })).toBeNull();
  });

  it('premium: no "Upgrade to Pro" while Pro is not purchasable', async () => {
    const m = await import('@/lib/billing/test-utils');
    h.tiers = m.tiersFixture({ proPurchasable: false });
    renderPanel('premium', { ...active, plan: 'premium' });
    await screen.findByTestId('billing-plan-chip');
    await screen.findByRole('button', { name: 'interface:billing.manage' });
    expect(screen.queryByRole('button', { name: 'interface:billing.upgradePro' })).toBeNull();
  });

  it('pro: plan chip reads Pro; "Switch to Premium" confirms period-end, no refund, then posts target premium', async () => {
    await withPro();
    h.change.mockResolvedValue({ plan: 'pro', pendingPlan: { to: 'premium', at: '2026-11-25T00:00:00Z' }, timing: 'period_end' });
    renderPanel('pro', { ...active, interval: 'yearly', plan: 'pro' });
    expect((await screen.findByTestId('billing-plan-chip')).dataset.plan).toBe('pro');
    expect(screen.queryByRole('button', { name: 'interface:billing.upgradePro' })).toBeNull();
    fireEvent.click(await screen.findByRole('button', { name: 'interface:billing.switchToPremium' }));
    const dialog = await screen.findByTestId('plan-change-dialog');
    expect(dialog.dataset.target).toBe('premium');
    expect(dialog.textContent).toContain('price=$90,unit=interface:billing.offer.unitYear');
    expect(dialog.textContent).toContain('interface:billing.planChange.downgrade.fineprint');
    fireEvent.click(screen.getByRole('button', { name: 'interface:billing.planChange.downgrade.confirm' }));
    await waitFor(() => expect(h.change).toHaveBeenCalledWith('tok', 'premium'));
    expect(h.track).toHaveBeenCalledWith('billing_plan_change_requested', { from: 'pro', to: 'premium', timing: 'period_end', currency: 'usd' });
    await waitFor(() => expect(h.toast.success).toHaveBeenCalledWith('interface:billing.planChange.scheduled|date=D(2026-11-25T00:00:00Z)'));
  });

  it('pending downgrade: "Premium from <date>" with Keep Pro (DELETE), and no Switch to Premium', async () => {
    await withPro();
    h.keep.mockResolvedValue({ plan: 'pro', pendingPlan: null });
    renderPanel('pro', { ...active, plan: 'pro', pendingPlan: { to: 'premium', at: '2026-11-25T00:00:00Z' } });
    const box = await screen.findByTestId('pending-downgrade');
    expect(box.textContent).toContain('interface:billing.planChange.pendingBody|date=D(2026-11-25T00:00:00Z)');
    expect(screen.queryByRole('button', { name: 'interface:billing.switchToPremium' })).toBeNull();
    expect(screen.queryByText(/billing\.panel\.renewsOn/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'interface:billing.planChange.keepPro' }));
    await waitFor(() => expect(h.keep).toHaveBeenCalledWith('tok'));
    expect(h.track).toHaveBeenCalledWith('billing_plan_change_cancelled', { from: 'pro', to: 'premium' });
    await waitFor(() => expect(h.toast.success).toHaveBeenCalledWith('interface:billing.planChange.kept'));
  });

  it.each([
    ['not_subscription', 'interface:billing.planChange.errors.notSubscription'],
    ['same_plan', 'interface:billing.planChange.errors.samePlan'],
    ['change_not_available', 'interface:billing.planChange.errors.notAvailable'],
    ['billing_unavailable', 'interface:billing.errors.unavailable'],
    ['billing_provider_error', 'interface:billing.planChange.errors.generic'],
  ])('a %s refusal shows its friendly message and records no event', async (reason, key) => {
    await withPro();
    const { BillingRefusal } = await import('@/lib/auth/accountApi');
    h.change.mockRejectedValue(new BillingRefusal(reason as never, 409));
    renderPanel('premium', { ...active, plan: 'premium' });
    fireEvent.click(await screen.findByRole('button', { name: 'interface:billing.upgradePro' }));
    fireEvent.click(await screen.findByRole('button', { name: 'interface:billing.planChange.upgrade.confirm' }));
    await waitFor(() => expect(h.toast.error).toHaveBeenCalledWith(key));
    expect(h.track).not.toHaveBeenCalledWith('billing_plan_change_requested', expect.anything());
  });

  it('cancelling Pro: no retention offer (even if one arrives), "Drop to Premium and keep going" instead', async () => {
    await withPro();
    renderPanel('pro', {
      ...active, plan: 'pro', cancelAtPeriodEnd: true, endsAt: '2026-11-25T00:00:00Z',
      offer: { kind: 'retain7', priceUSD: 7, nextChargeAt: '2026-11-25T00:00:00Z' },
    });
    await screen.findByText('interface:billing.panel.pro.cancelledTitle');
    expect(screen.queryByTestId('retention-offer')).toBeNull();
    expect(h.track).not.toHaveBeenCalledWith('retention_offer_viewed', expect.anything());
    const drop = screen.getByTestId('pro-drop-to-premium');
    expect(drop.textContent).toContain('interface:billing.planChange.dropTitle');
    h.openPortal.mockResolvedValue({ ok: true });
    fireEvent.click(screen.getByRole('button', { name: 'interface:billing.planChange.dropCta' }));
    await waitFor(() => expect(h.openPortal).toHaveBeenCalledWith('account_billing', 'en-US'));
    // A cancelling subscription cannot change plan through the API (409 change_not_available).
    expect(screen.queryByRole('button', { name: 'interface:billing.switchToPremium' })).toBeNull();
  });

  it('cancelling Premium keeps the Premium retention offer and wording', async () => {
    renderPanel('premium', {
      ...active, plan: 'premium', cancelAtPeriodEnd: true, endsAt: '2026-11-25T00:00:00Z',
      offer: { kind: 'retain7', priceUSD: 7, nextChargeAt: '2026-11-25T00:00:00Z' },
    });
    expect(await screen.findByTestId('retention-offer')).toBeTruthy();
    expect(screen.getByText('interface:billing.panel.cancelledTitle')).toBeTruthy();
    expect(screen.queryByTestId('pro-drop-to-premium')).toBeNull();
  });

  it('translator mode: hides Upgrade to Pro, Switch to Premium and Keep Pro', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    await withPro();
    renderPanel('premium', { ...active, plan: 'premium' });
    await screen.findByTestId('billing-plan-chip');
    expect(screen.queryByRole('button', { name: 'interface:billing.upgradePro' })).toBeNull();
    cleanup();
    renderPanel('pro', { ...active, plan: 'pro' });
    await screen.findByTestId('billing-plan-chip');
    expect(screen.queryByRole('button', { name: 'interface:billing.switchToPremium' })).toBeNull();
    cleanup();
    renderPanel('pro', { ...active, plan: 'pro', pendingPlan: { to: 'premium', at: '2026-11-25T00:00:00Z' } });
    await screen.findByTestId('billing-plan-chip');
    expect(screen.queryByRole('button', { name: 'interface:billing.planChange.keepPro' })).toBeNull();
    cleanup();
    renderPanel('pro', { ...active, plan: 'pro', cancelAtPeriodEnd: true });
    await screen.findByTestId('billing-plan-chip');
    expect(screen.queryByTestId('pro-drop-to-premium')).toBeNull();
    vi.unstubAllEnvs();
  });
});

describe('BillingPanel currency (MM69)', () => {
  const eur = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  const served = {
    tiers: [], premiumPurchasable: true, premiumPriceUSD: 7, premiumPriceYearlyUSD: 70, defaultCurrency: 'eur',
    prices: { usd: { premiumMonthly: 7, premiumYearly: 70, proMonthly: 15, proYearly: 150 }, eur: { premiumMonthly: 7, premiumYearly: 70, proMonthly: 15, proYearly: 150 } },
  };

  it('free: shows the USD / EUR toggle once the API sells EUR, prices in the geo default, switch persists', async () => {
    h.tiers = served;
    renderPanel('free', {});
    const price = await screen.findByTestId('billing-panel-price');
    await waitFor(() => expect(price.dataset.currency).toBe('eur'));
    expect(price.textContent).toBe(`${eur(7)}interface:billing.perMonth`);
    fireEvent.click(screen.getByLabelText('USD'));
    await waitFor(() => expect(screen.getByTestId('billing-panel-price').textContent).toBe('$7interface:billing.perMonth'));
    expect(document.cookie).toContain('mm-currency=usd');
    expect(h.track).toHaveBeenCalledWith('billing_currency_changed', { from: 'eur', to: 'usd', source: 'toggle', placement: 'billing_panel' });
  });

  it('an older API (no prices): no toggle, USD from the legacy fields', async () => {
    renderPanel('free', {});
    const price = await screen.findByTestId('billing-panel-price');
    expect(price.textContent).toBe('$7interface:billing.perMonth');
    expect(screen.queryByLabelText('EUR')).toBeNull();
  });

  it('subscriber billed in EUR: locked chip with the explanation, offer and prices in euros', async () => {
    h.tiers = served;
    renderPanel('premium', {
      status: 'active', interval: 'monthly', cancelAtPeriodEnd: true, portalAvailable: true, plan: 'premium',
      renewsAt: '2026-11-23T00:00:00Z', endsAt: '2026-11-23T00:00:00Z', priceMonthly: 8, priceMonthlyUSD: null,
      currency: 'eur', currencyLocked: true,
      offer: { kind: 'retain7', price: 7, priceUSD: 7, currency: 'eur', nextChargeAt: '2026-11-23T00:00:00Z' },
    });
    const chip = await screen.findByTestId('currency-locked');
    expect(chip.dataset.currency).toBe('eur');
    expect(chip.getAttribute('title')).toBe('interface:billing.currency.lockedNote|currency=EUR');
    expect(screen.queryByLabelText('USD')).toBeNull();
    expect(screen.getByText(`interface:billing.offer.title|price=${eur(7)}`)).toBeTruthy();
    expect(screen.getByRole('button', { name: `interface:billing.offer.keepAtCurrent|price=${eur(8)}` })).toBeTruthy();
  });
});
