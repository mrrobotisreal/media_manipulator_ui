import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const h = vi.hoisted(() => ({
  auth: null as unknown,
  track: vi.fn(),
  startCheckout: vi.fn(),
  purchasable: true,
  toast: vi.fn(),
}));

vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/lib/billing/test-utils');
  return { useLocalization: () => m.fakeLocalization() };
});
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('sonner', () => ({ toast: Object.assign(h.toast, { error: h.toast }) }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => h.auth }));
vi.mock('@/lib/analytics', () => ({
  analytics: { track: h.track },
  EVENTS: { UPGRADE_CTA_CLICKED: 'upgrade_cta_clicked', FEATURE_USED: 'feature_used' },
}));
vi.mock('@/lib/billing/checkout', async (orig) => ({
  ...(await orig<typeof import('@/lib/billing/checkout')>()),
  startCheckout: h.startCheckout,
}));
vi.mock('@/lib/auth/accountApi', async (orig) => ({
  ...(await orig<typeof import('@/lib/auth/accountApi')>()),
  fetchTiers: vi.fn(async () => ({ tiers: [], premiumPurchasable: h.purchasable, premiumPriceUSD: 7 })),
}));

import { resetPurchasableCacheForTests, useUpgradeAction } from './useUpgradeAction';
import { UploadLimitHint } from '@/components/account/upgrade-surfaces';

const Probe: React.FC<{ placement: string }> = ({ placement }) => {
  const a = useUpgradeAction(placement);
  return a.visible ? <button onClick={a.run}>go</button> : <span>none</span>;
};

function authAs(tier: string) {
  h.auth = { tier, loading: false, limits: { maxFileBytes: 1e9 }, user: tier === 'anonymous' ? null : { uid: 'u' }, openAuth: vi.fn() };
  return h.auth as { openAuth: ReturnType<typeof vi.fn> };
}

beforeEach(() => {
  resetPurchasableCacheForTests();
  h.purchasable = true;
  h.startCheckout.mockResolvedValue({ ok: true });
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  window.sessionStorage.clear();
});

describe('useUpgradeAction routing', () => {
  it('anonymous -> signup modal, upgrade_cta_clicked props unchanged', () => {
    const auth = authAs('anonymous');
    render(<Probe placement="quota_meter" />);
    fireEvent.click(screen.getByText('go'));
    expect(auth.openAuth).toHaveBeenCalledWith({ intent: 'signup', source: 'quota_meter' });
    expect(h.track).toHaveBeenCalledWith('upgrade_cta_clicked', { placement: 'quota_meter', from_tier: 'anonymous' });
    expect(h.startCheckout).not.toHaveBeenCalled();
  });

  it('free -> checkout with the last-used interval', async () => {
    const auth = authAs('free');
    window.sessionStorage.setItem('mm.billingInterval', 'yearly');
    render(<Probe placement="file_limit_hint" />);
    await waitFor(() => expect(screen.getByText('go')).toBeTruthy());
    fireEvent.click(screen.getByText('go'));
    await waitFor(() => expect(h.startCheckout).toHaveBeenCalledWith('yearly', 'file_limit_hint', 'en-US'));
    expect(auth.openAuth).not.toHaveBeenCalled();
    expect(h.track).toHaveBeenCalledWith('upgrade_cta_clicked', { placement: 'file_limit_hint', from_tier: 'free' });
  });

  it('free while Premium is not purchasable -> no nudge', async () => {
    authAs('free');
    h.purchasable = false;
    render(<Probe placement="x" />);
    await act(async () => {});
    expect(screen.getByText('none')).toBeTruthy();
  });

  it.each(['premium', 'operator'])('%s -> no nudge and run is a no-op', (tier) => {
    const auth = authAs(tier);
    render(<Probe placement="x" />);
    expect(screen.getByText('none')).toBeTruthy();
    expect(auth.openAuth).not.toHaveBeenCalled();
    expect(h.startCheckout).not.toHaveBeenCalled();
  });
});

describe('UploadLimitHint upgrade link', () => {
  it('anonymous sees the link and it opens signup; premium sees only the limit', async () => {
    const auth = authAs('anonymous');
    const { unmount } = render(<UploadLimitHint />);
    fireEvent.click(screen.getByText('interface:upgradeSurfaces.fileLimitMoreFree'));
    expect(auth.openAuth).toHaveBeenCalledWith({ intent: 'signup', source: 'file_limit_hint' });
    unmount();
    authAs('premium');
    render(<UploadLimitHint />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
