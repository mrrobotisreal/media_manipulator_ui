import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const h = vi.hoisted(() => ({
  auth: null as unknown,
  track: vi.fn(),
  startCheckout: vi.fn(),
  purchasable: true as boolean | undefined,
}));

vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/lib/billing/test-utils');
  return { useLocalization: () => m.fakeLocalization() };
});
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));
vi.mock('@/lib/analytics', () => ({
  analytics: { track: h.track },
  EVENTS: { UPGRADE_CTA_CLICKED: 'upgrade_cta_clicked' },
}));
vi.mock('@/lib/billing/checkout', async (orig) => ({
  ...(await orig<typeof import('@/lib/billing/checkout')>()),
  startCheckout: h.startCheckout,
}));
vi.mock('@/lib/billing/useUpgradeAction', () => ({
  useBillingFallback: () => vi.fn(async () => undefined),
  usePremiumPurchasable: () => h.purchasable,
}));

import { UpgradeInterstitial, interstitialCopy } from './upgrade-interstitial';

const heightBody = { error: 'output_height_limited', limit: 1440, requested: 2160, upgradePath: 'premium' } as const;
const projectsBody = { error: 'project_limit_reached', limit: 5, used: 5, upgradePath: 'premium' } as const;

beforeEach(() => {
  h.purchasable = true;
  h.auth = { tier: 'free', openAuth: vi.fn() };
  h.startCheckout.mockResolvedValue({ ok: true });
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  window.sessionStorage.clear();
});

describe('interstitialCopy', () => {
  it('maps each server body to its own copy and passes limit/requested through', () => {
    expect(interstitialCopy({ kind: 'limit', detail: heightBody })).toMatchObject({
      titleKey: 'interface:upgradeInterstitial.outputHeight.title',
      values: { limit: 1440, requested: 2160 },
      upgradePath: 'premium',
    });
    expect(interstitialCopy({ kind: 'limit', detail: projectsBody })).toMatchObject({
      titleKey: 'interface:upgradeInterstitial.projects.title',
      values: { limit: 5 },
    });
  });
});

describe('UpgradeInterstitial', () => {
  it('output_height_limited (premium path): shows limit/requested and starts checkout', async () => {
    const onClose = vi.fn();
    render(<UpgradeInterstitial input={{ kind: 'limit', detail: heightBody }} onClose={onClose} />);
    expect(screen.getByText('interface:upgradeInterstitial.outputHeight.body|limit=1440,requested=2160')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('interface:billing.yearly'));
    fireEvent.click(screen.getByRole('button', { name: 'interface:upgradeInterstitial.upgrade' }));
    await waitFor(() => expect(h.startCheckout).toHaveBeenCalledWith('yearly', 'output_height_limited', 'en-US'));
    expect(h.track).toHaveBeenCalledWith('upgrade_cta_clicked', { placement: 'output_height_limited', from_tier: 'free' });
  });

  it('project_limit_reached: names the project cap', () => {
    render(<UpgradeInterstitial input={{ kind: 'limit', detail: projectsBody }} onClose={vi.fn()} />);
    expect(screen.getByText('interface:upgradeInterstitial.projects.body|limit=5')).toBeTruthy();
  });

  it('upgradePath signup (anonymous): closes and opens the sign-up modal', () => {
    const auth = { tier: 'anonymous', openAuth: vi.fn() };
    h.auth = auth;
    const onClose = vi.fn();
    render(
      <UpgradeInterstitial
        input={{ kind: 'limit', detail: { error: 'output_height_limited', limit: 720, requested: 1080, upgradePath: 'signup' } }}
        onClose={onClose}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'interface:upgradeInterstitial.signup' }));
    expect(onClose).toHaveBeenCalled();
    expect(auth.openAuth).toHaveBeenCalledWith({ intent: 'signup', source: 'output_height_limited' });
  });

  it('no upgradePath (premium/operator): explanation and Close only', () => {
    h.auth = { tier: 'premium', openAuth: vi.fn() };
    render(
      <UpgradeInterstitial
        input={{ kind: 'limit', detail: { error: 'output_height_limited', limit: 2160, requested: 4320 } }}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText('interface:upgradeInterstitial.topTier')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'interface:upgradeInterstitial.upgrade' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'interface:upgradeInterstitial.signup' })).toBeNull();
  });

  it('premium path while not purchasable: honest "not available yet", no upgrade button', () => {
    h.purchasable = false;
    render(<UpgradeInterstitial input={{ kind: 'limit', detail: heightBody }} onClose={vi.fn()} />);
    expect(screen.getByText('interface:billing.unavailable')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'interface:upgradeInterstitial.upgrade' })).toBeNull();
  });
});
