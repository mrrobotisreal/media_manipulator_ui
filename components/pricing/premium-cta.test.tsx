import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const h = vi.hoisted(() => ({
  auth: null as unknown,
  startCheckout: vi.fn(),
  openPortal: vi.fn(),
  track: vi.fn(),
  fallback: vi.fn(async () => undefined),
  replace: vi.fn(),
}));

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({ t: (k: string) => k, language: { code: 'en-US' } }),
}));
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
vi.mock('@/lib/billing/checkout', async (orig) => ({
  ...(await orig<typeof import('@/lib/billing/checkout')>()),
  startCheckout: h.startCheckout,
  openPortal: h.openPortal,
}));

import { CheckoutCancelledNote, PremiumPricing, type PremiumPricingLabels } from './premium-cta';

const labels: PremiumPricingLabels = {
  intervalLabel: 'interval', monthly: 'Monthly', yearly: 'Yearly', priceMonthly: '$7/mo', priceYearly: '$70/yr',
  yearlyBonus: '2 months free', blurb: 'blurb', cancelAnytime: 'cancel any time', refund: '14-day refund',
  taxNote: 'tax', ctaUpgrade: 'Upgrade', ctaManage: 'Manage', ctaOperator: 'Unlimited (operator)',
  ctaUnavailable: 'Not available yet', ctaBusy: 'Opening',
};

function authAs(tier: string, extra: object = {}) {
  h.auth = { tier, loading: false, user: tier === 'anonymous' ? null : { uid: 'u1' }, openAuth: vi.fn(), ...extra };
  return h.auth as { openAuth: ReturnType<typeof vi.fn> };
}

beforeEach(() => {
  window.sessionStorage.clear();
  h.startCheckout.mockResolvedValue({ ok: true });
  h.openPortal.mockResolvedValue({ ok: true });
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('PremiumPricing CTA routing', () => {
  it('anonymous: opens the sign-up modal with intent upgrade and remembers the interval', () => {
    const auth = authAs('anonymous');
    render(<PremiumPricing labels={labels} purchasable />);
    fireEvent.click(screen.getByLabelText('Yearly'));
    fireEvent.click(screen.getByRole('button', { name: 'Upgrade' }));
    expect(auth.openAuth).toHaveBeenCalledWith({ intent: 'upgrade', source: 'pricing_premium' });
    expect(h.startCheckout).not.toHaveBeenCalled();
    expect(JSON.parse(window.sessionStorage.getItem('mm.pendingCheckout')!).interval).toBe('yearly');
    expect(h.track).toHaveBeenCalledWith('upgrade_cta_clicked', expect.objectContaining({ from_tier: 'anonymous' }));
  });

  it('free: starts checkout with the chosen interval', async () => {
    authAs('free');
    render(<PremiumPricing labels={labels} purchasable />);
    expect(screen.getByText('$7/mo')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Yearly'));
    expect(screen.getByText('$70/yr')).toBeTruthy();
    expect(screen.getByText('2 months free')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Upgrade' }));
    await waitFor(() => expect(h.startCheckout).toHaveBeenCalledWith('yearly', 'pricing_premium', 'en-US'));
  });

  it('premium: shows Manage subscription and opens the portal', async () => {
    authAs('premium');
    render(<PremiumPricing labels={labels} purchasable />);
    expect(screen.queryByLabelText('Yearly')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Manage' }));
    await waitFor(() => expect(h.openPortal).toHaveBeenCalledWith('pricing_premium', 'en-US'));
    expect(h.startCheckout).not.toHaveBeenCalled();
  });

  it('operator: text only, no CTA button', () => {
    authAs('operator');
    render(<PremiumPricing labels={labels} purchasable />);
    expect(screen.getByText('Unlimited (operator)')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('premiumPurchasable=false: disabled "not available yet", no get-notified', () => {
    authAs('free');
    render(<PremiumPricing labels={labels} purchasable={false} />);
    const btn = screen.getByRole('button', { name: 'Not available yet' }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    fireEvent.click(btn);
    expect(h.startCheckout).not.toHaveBeenCalled();
  });

  it('continues to checkout once after sign-in, without double-firing', async () => {
    window.sessionStorage.setItem('mm.pendingCheckout', JSON.stringify({ interval: 'yearly', placement: 'pricing_premium', at: Date.now() }));
    authAs('free');
    const { rerender } = render(<PremiumPricing labels={labels} purchasable />);
    await waitFor(() => expect(h.startCheckout).toHaveBeenCalledTimes(1));
    expect(h.startCheckout).toHaveBeenCalledWith('yearly', 'pricing_premium', 'en-US');
    rerender(<PremiumPricing labels={labels} purchasable />);
    expect(h.startCheckout).toHaveBeenCalledTimes(1);
    expect(window.sessionStorage.getItem('mm.pendingCheckout')).toBeNull();
  });

  it('ignores a stale pending marker', async () => {
    window.sessionStorage.setItem('mm.pendingCheckout', JSON.stringify({ interval: 'yearly', placement: 'x', at: Date.now() - 3_600_000 }));
    authAs('free');
    render(<PremiumPricing labels={labels} purchasable />);
    await Promise.resolve();
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
