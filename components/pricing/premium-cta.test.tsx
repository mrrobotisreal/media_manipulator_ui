import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const h = vi.hoisted(() => ({
  auth: null as unknown,
  status: undefined as unknown,
  startCheckout: vi.fn(),
  openPortal: vi.fn(),
  planRun: vi.fn(),
  track: vi.fn(),
  fallback: vi.fn(async () => undefined),
  replace: vi.fn(),
}));

vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/lib/billing/test-utils');
  return { useLocalization: () => m.fakeLocalization() };
});
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: h.replace, push: vi.fn() }),
  usePathname: () => '/pricing',
}));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));
vi.mock('@/lib/analytics', () => ({
  analytics: { track: h.track },
  EVENTS: {
    UPGRADE_CTA_CLICKED: 'upgrade_cta_clicked',
    CHECKOUT_ABANDONED: 'checkout_abandoned',
  },
}));
vi.mock('@/lib/billing/useUpgradeAction', () => ({ useBillingFallback: () => h.fallback }));
vi.mock('@/lib/billing/useBillingStatus', () => ({ useBillingStatus: () => ({ data: h.status }) }));
vi.mock('@/lib/billing/usePlanChange', () => ({ usePlanChange: () => ({ busy: false, run: h.planRun }) }));
vi.mock('@/lib/billing/checkout', async (orig) => ({
  ...(await orig<typeof import('@/lib/billing/checkout')>()),
  startCheckout: h.startCheckout,
  openPortal: h.openPortal,
}));

import { CheckoutCancelledNote, PlanPricing, PricingIntervalToggle, type PlanPricingLabels } from './premium-cta';
import { resetPricingIntervalForTests } from './interval-store';

const labelsFor = (plan: 'premium' | 'pro'): PlanPricingLabels => ({
  priceMonthly: plan === 'pro' ? '$17/mo' : '$9/mo',
  priceYearly: plan === 'pro' ? '$170/yr' : '$90/yr',
  yearlyBonus: '2 months free', blurb: 'blurb', cancelAnytime: 'cancel any time', refund: '14-day refund',
  taxNote: 'tax', ctaUpgrade: `Upgrade ${plan}`, ctaManage: 'Manage', ctaOperator: 'Unlimited (operator)',
  ctaUnavailable: 'Not available yet', ctaBusy: 'Opening', currentPlan: 'Your plan',
  ctaChangeUp: 'Upgrade to Pro', ctaChangeDown: 'Switch to Premium', pendingFrom: 'Premium from {{date}}',
});
const prices = { premium: { monthly: 9, yearly: 90 }, pro: { monthly: 17, yearly: 170 } };

function authAs(tier: string, extra: object = {}) {
  h.auth = { tier, loading: false, user: tier === 'anonymous' ? null : { uid: 'u1' }, openAuth: vi.fn(), ...extra };
  return h.auth as { openAuth: ReturnType<typeof vi.fn> };
}
function subscribed(plan: 'premium' | 'pro', extra: object = {}) {
  h.status = { purchasable: true, interval: 'monthly', status: 'active', renewsAt: '2026-11-25T00:00:00Z', cancelAtPeriodEnd: false, portalAvailable: true, manualGrant: null, plan, pendingPlan: null, ...extra };
}

/** Both paid columns plus the shared toggle, as /pricing renders them. */
function renderPage(opts: { premium?: boolean; pro?: boolean } = {}) {
  return render(
    <>
      <PricingIntervalToggle label="interval" monthly="Monthly" yearly="Yearly" />
      <PlanPricing plan="premium" labels={labelsFor('premium')} purchasable={opts.premium ?? true} prices={prices.premium} />
      <PlanPricing plan="pro" labels={labelsFor('pro')} purchasable={opts.pro ?? true} prices={prices.pro} />
    </>,
  );
}
const column = (plan: string) => screen.getByTestId(`${plan}-pricing`);

beforeEach(() => {
  window.sessionStorage.clear();
  resetPricingIntervalForTests();
  h.status = undefined;
  h.startCheckout.mockResolvedValue({ ok: true });
  h.openPortal.mockResolvedValue({ ok: true });
  h.planRun.mockResolvedValue({ ok: true, result: { plan: 'pro', pendingPlan: null } });
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('/pricing paid columns: CTA routing by tier (MM40)', () => {
  it('one interval toggle drives both paid columns', () => {
    authAs('free');
    renderPage();
    expect(screen.getByText('$9/mo')).toBeTruthy();
    expect(screen.getByText('$17/mo')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Yearly'));
    expect(screen.getByText('$90/yr')).toBeTruthy();
    expect(screen.getByText('$170/yr')).toBeTruthy();
    expect(screen.getAllByText('2 months free')).toHaveLength(2);
  });

  it('anonymous: either column opens sign-up and remembers plan + interval', () => {
    const auth = authAs('anonymous');
    renderPage();
    fireEvent.click(screen.getByLabelText('Yearly'));
    fireEvent.click(screen.getByRole('button', { name: 'Upgrade pro' }));
    expect(auth.openAuth).toHaveBeenCalledWith({ intent: 'upgrade', source: 'pricing_pro' });
    expect(h.startCheckout).not.toHaveBeenCalled();
    expect(JSON.parse(window.sessionStorage.getItem('mm.pendingCheckout')!)).toMatchObject({ interval: 'yearly', plan: 'pro' });
    expect(h.track).toHaveBeenCalledWith('upgrade_cta_clicked', expect.objectContaining({ from_tier: 'anonymous', cta_id: 'pricing_pro' }));
  });

  it.each(['premium', 'pro'] as const)('free: %s column starts checkout with that plan and the chosen interval', async (plan) => {
    authAs('free');
    renderPage();
    fireEvent.click(screen.getByLabelText('Yearly'));
    fireEvent.click(screen.getByRole('button', { name: `Upgrade ${plan}` }));
    await waitFor(() => expect(h.startCheckout).toHaveBeenCalledWith('yearly', `pricing_${plan}`, 'en-US', plan));
  });

  it('premium: Premium column is the current plan (portal); Pro column upgrades through change-plan after a confirm', async () => {
    authAs('premium');
    subscribed('premium');
    renderPage();
    expect(column('premium').dataset.cta).toBe('portal');
    expect(column('premium').textContent).toContain('Your plan');
    fireEvent.click(screen.getByRole('button', { name: 'Manage' }));
    await waitFor(() => expect(h.openPortal).toHaveBeenCalledWith('pricing_premium', 'en-US'));
    fireEvent.click(screen.getByRole('button', { name: 'Upgrade to Pro' }));
    const dialog = await screen.findByTestId('plan-change-dialog');
    expect(dialog.dataset.target).toBe('pro');
    // The confirm states the prorated charge now and the unchanged renewal date, at the served Pro price.
    expect(dialog.textContent).toContain('interface:billing.planChange.upgrade.body|date=D(2026-11-25T00:00:00Z),price=$17,unit=interface:billing.offer.unitMonth');
    fireEvent.click(screen.getByRole('button', { name: 'interface:billing.planChange.upgrade.confirm' }));
    await waitFor(() => expect(h.planRun).toHaveBeenCalledWith('upgrade'));
    expect(h.startCheckout).not.toHaveBeenCalled();
  });

  it('pro: Pro column is the current plan (portal); Premium column schedules the downgrade after a confirm', async () => {
    authAs('pro');
    subscribed('pro', { interval: 'yearly' });
    renderPage();
    expect(column('pro').dataset.cta).toBe('portal');
    expect(column('premium').dataset.cta).toBe('downgrade');
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Premium' }));
    const dialog = await screen.findByTestId('plan-change-dialog');
    expect(dialog.dataset.target).toBe('premium');
    expect(dialog.textContent).toContain('price=$90,unit=interface:billing.offer.unitYear');
    fireEvent.click(screen.getByRole('button', { name: 'interface:billing.planChange.downgrade.confirm' }));
    await waitFor(() => expect(h.planRun).toHaveBeenCalledWith('downgrade'));
  });

  it('pro with a scheduled downgrade: "Premium from <date>", no second switch', () => {
    authAs('pro');
    subscribed('pro', { pendingPlan: { to: 'premium', at: '2026-11-25T00:00:00Z' } });
    renderPage();
    expect(screen.getByTestId('pricing-pending').textContent).toBe('Premium from D(2026-11-25T00:00:00Z)');
    expect(screen.queryByRole('button', { name: 'Switch to Premium' })).toBeNull();
  });

  it('a team-granted Premium cannot change plan (no subscription): Pro column is unavailable', () => {
    authAs('premium');
    subscribed('premium', { plan: null, manualGrant: { expiresAt: null } });
    renderPage();
    expect(column('pro').dataset.cta).toBe('unavailable');
  });

  it('operator: text only, no CTA button in either column', () => {
    authAs('operator');
    renderPage();
    expect(screen.getAllByText('Unlimited (operator)')).toHaveLength(2);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('proPurchasable=false: the Pro CTA is the disabled "not available yet" (Premium unaffected)', () => {
    authAs('free');
    renderPage({ pro: false });
    const btn = screen.getAllByRole('button', { name: 'Not available yet' });
    expect(btn).toHaveLength(1);
    expect((btn[0] as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(btn[0]);
    expect(h.startCheckout).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Upgrade premium' })).toBeTruthy();
  });

  it('continues to checkout once after sign-in, on the column the marker names', async () => {
    window.sessionStorage.setItem('mm.pendingCheckout', JSON.stringify({ interval: 'yearly', placement: 'pricing_pro', plan: 'pro', at: Date.now() }));
    authAs('free');
    const { rerender } = renderPage();
    await waitFor(() => expect(h.startCheckout).toHaveBeenCalledTimes(1));
    expect(h.startCheckout).toHaveBeenCalledWith('yearly', 'pricing_pro', 'en-US', 'pro');
    rerender(<PlanPricing plan="pro" labels={labelsFor('pro')} purchasable prices={prices.pro} />);
    expect(h.startCheckout).toHaveBeenCalledTimes(1);
    expect(window.sessionStorage.getItem('mm.pendingCheckout')).toBeNull();
  });

  it('a pre-MM40 marker without a plan continues as Premium', async () => {
    window.sessionStorage.setItem('mm.pendingCheckout', JSON.stringify({ interval: 'monthly', placement: 'pricing_premium', at: Date.now() }));
    authAs('free');
    renderPage();
    await waitFor(() => expect(h.startCheckout).toHaveBeenCalledWith('monthly', 'pricing_premium', 'en-US', 'premium'));
  });

  it('ignores a stale pending marker', async () => {
    window.sessionStorage.setItem('mm.pendingCheckout', JSON.stringify({ interval: 'yearly', placement: 'x', plan: 'pro', at: Date.now() - 3_600_000 }));
    authAs('free');
    renderPage();
    await act(async () => {});
    expect(h.startCheckout).not.toHaveBeenCalled();
  });
});

describe('CheckoutCancelledNote', () => {
  it('fires checkout_abandoned once, shows a dismissible note and strips the query', async () => {
    window.history.pushState({}, '', '/pricing?checkout=cancelled');
    const { rerender } = render(<CheckoutCancelledNote message="cancelled" dismiss="Dismiss" />);
    await waitFor(() => expect(screen.getByText('cancelled')).toBeTruthy());
    rerender(<CheckoutCancelledNote message="cancelled" dismiss="Dismiss" />);
    expect(h.track.mock.calls.filter((c) => c[0] === 'checkout_abandoned')).toHaveLength(1);
    expect(h.replace).toHaveBeenCalledWith('/pricing', { scroll: false });
    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(screen.queryByText('cancelled')).toBeNull();
    window.history.pushState({}, '', '/');
  });
});

describe('translator mode (MM52)', () => {
  afterEach(() => vi.unstubAllEnvs());

  it.each(['free', 'premium', 'pro'])('translator mode: %s sees only disabled unavailable buttons', (tier) => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    authAs(tier);
    if (tier !== 'free') subscribed(tier as 'premium' | 'pro');
    renderPage();
    const btns = screen.getAllByRole('button', { name: 'Not available yet' }) as HTMLButtonElement[];
    expect(btns).toHaveLength(2);
    expect(btns.every((b) => b.disabled)).toBe(true);
    for (const name of ['Upgrade premium', 'Upgrade pro', 'Manage', 'Upgrade to Pro', 'Switch to Premium']) {
      expect(screen.queryByRole('button', { name })).toBeNull();
    }
  });

  it('production: shows the Upgrade buttons for free', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    authAs('free');
    renderPage();
    expect(screen.getByRole('button', { name: 'Upgrade premium' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Upgrade pro' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Not available yet' })).toBeNull();
  });

  it('production: Manage and Upgrade to Pro for premium', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    authAs('premium');
    subscribed('premium');
    renderPage();
    expect(screen.getByRole('button', { name: 'Manage' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Upgrade to Pro' })).toBeTruthy();
  });
});
