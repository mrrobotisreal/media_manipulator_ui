import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const h = vi.hoisted(() => ({ track: vi.fn(), openPortal: vi.fn() }));

vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/lib/billing/test-utils');
  return { useLocalization: () => m.fakeLocalization() };
});
vi.mock('@/lib/analytics', () => ({
  analytics: { track: h.track },
  EVENTS: { UPGRADE_CTA_CLICKED: 'upgrade_cta_clicked', FEATURE_USED: 'feature_used' },
}));
vi.mock('@/lib/billing/checkout', () => ({ openPortal: h.openPortal }));
vi.mock('@/lib/billing/useUpgradeAction', () => ({ useBillingFallback: () => vi.fn(async () => undefined) }));

import { YearlyNudge, monthsFree, shouldShowYearlyNudge } from './yearly-nudge';

const tiers = { tiers: [], premiumPurchasable: true, premiumPriceUSD: 7, premiumPriceYearlyUSD: 70 } as never;
const status = (over: object = {}) =>
  ({
    purchasable: true, interval: 'monthly', status: 'active', renewsAt: null, cancelAtPeriodEnd: false,
    portalAvailable: true, manualGrant: null, periodsPaid: 3, ...over,
  }) as never;

beforeEach(() => window.localStorage.clear());
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('monthsFree', () => {
  it('is computed from the served prices', () => {
    expect(monthsFree(tiers)).toBe(2);
    expect(monthsFree({ premiumPriceUSD: 10, premiumPriceYearlyUSD: 100 } as never)).toBe(2);
    expect(monthsFree({ premiumPriceUSD: 7, premiumPriceYearlyUSD: 84 } as never)).toBe(0);
    expect(monthsFree({ premiumPriceUSD: 7 } as never)).toBe(0);
    expect(monthsFree(undefined)).toBe(0);
  });
});

describe('shouldShowYearlyNudge', () => {
  const base = { status: status(), tiers, dismissed: false };
  it('shows only at periodsPaid >= 3', () => {
    expect(shouldShowYearlyNudge(base)).toBe(true);
    expect(shouldShowYearlyNudge({ ...base, status: status({ periodsPaid: 2 }) })).toBe(false);
    expect(shouldShowYearlyNudge({ ...base, status: status({ periodsPaid: 12 }) })).toBe(true);
  });
  it('feature-detects periodsPaid (absent from the API today)', () => {
    expect(shouldShowYearlyNudge({ ...base, status: status({ periodsPaid: undefined }) })).toBe(false);
  });
  it('needs an active monthly plan with a portal, and a real discount', () => {
    expect(shouldShowYearlyNudge({ ...base, status: status({ interval: 'yearly' }) })).toBe(false);
    expect(shouldShowYearlyNudge({ ...base, status: status({ status: 'past_due' }) })).toBe(false);
    expect(shouldShowYearlyNudge({ ...base, status: status({ cancelAtPeriodEnd: true }) })).toBe(false);
    expect(shouldShowYearlyNudge({ ...base, status: status({ portalAvailable: false }) })).toBe(false);
    expect(shouldShowYearlyNudge({ ...base, tiers: { premiumPriceUSD: 7, premiumPriceYearlyUSD: 84 } as never })).toBe(false);
    expect(shouldShowYearlyNudge({ ...base, dismissed: true })).toBe(false);
  });
});

describe('YearlyNudge', () => {
  it('renders the computed months, routes to the portal, and tracks yearly_nudge', async () => {
    h.openPortal.mockResolvedValue({ ok: true });
    render(<YearlyNudge uid="u1" status={status()} tiers={tiers} />);
    await waitFor(() => expect(screen.getByTestId('yearly-nudge')).toBeTruthy());
    expect(screen.getByText('interface:yearlyNudge.title|months=2')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'interface:yearlyNudge.cta' }));
    expect(h.track).toHaveBeenCalledWith('upgrade_cta_clicked', { placement: 'yearly_nudge', from_tier: 'premium' });
    expect(h.openPortal).toHaveBeenCalledWith('yearly_nudge', 'en-US');
  });

  it('dismissal is stored per user and survives a remount', async () => {
    const { unmount } = render(<YearlyNudge uid="u1" status={status()} tiers={tiers} />);
    await waitFor(() => screen.getByTestId('yearly-nudge'));
    fireEvent.click(screen.getByRole('button', { name: 'interface:yearlyNudge.dismiss' }));
    expect(screen.queryByTestId('yearly-nudge')).toBeNull();
    unmount();
    render(<YearlyNudge uid="u1" status={status()} tiers={tiers} />);
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.queryByTestId('yearly-nudge')).toBeNull();
    cleanup();
    render(<YearlyNudge uid="u2" status={status()} tiers={tiers} />);
    await waitFor(() => expect(screen.getByTestId('yearly-nudge')).toBeTruthy());
  });

  it('renders nothing below three paid periods', async () => {
    render(<YearlyNudge uid="u1" status={status({ periodsPaid: 2 })} tiers={tiers} />);
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.queryByTestId('yearly-nudge')).toBeNull();
  });
});
