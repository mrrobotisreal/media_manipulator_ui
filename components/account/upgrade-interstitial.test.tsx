import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const h = vi.hoisted(() => ({
  auth: null as unknown,
  track: vi.fn(),
  startCheckout: vi.fn(),
  purchasable: true as boolean | undefined,
  proPurchasable: true as boolean | undefined,
  tiers: undefined as unknown,
  status: undefined as unknown,
  planRun: vi.fn(),
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
  useProPurchasable: () => h.proPurchasable,
  useTiers: () => h.tiers,
}));
vi.mock('@/lib/billing/useBillingStatus', () => ({ useBillingStatus: () => ({ data: h.status }) }));
vi.mock('@/lib/billing/usePlanChange', () => ({ usePlanChange: () => ({ busy: false, run: h.planRun }) }));

import { UpgradeInterstitial, interstitialCopy, interstitialOffer, premiumChange, proChange } from './upgrade-interstitial';
import { tiersFixture } from '@/lib/billing/test-utils';
import { claimInterstitial, limitKeyOf } from '@/lib/auth/interstitialGate';

const heightBody = { error: 'output_height_limited', limit: 1440, requested: 2160, upgradePath: 'premium' } as const;
const projectsBody = { error: 'project_limit_reached', limit: 5, used: 5, upgradePath: 'premium' } as const;

beforeEach(() => {
  h.purchasable = true;
  h.proPurchasable = true;
  h.status = undefined;
  h.planRun.mockResolvedValue({ ok: true, result: { plan: 'pro', pendingPlan: null } });
  h.tiers = undefined;
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
    await waitFor(() => expect(h.startCheckout).toHaveBeenCalledWith('yearly', 'limit_interstitial', 'en-US'));
    expect(h.track).toHaveBeenCalledWith('upgrade_cta_clicked', { placement: 'limit_interstitial', cta_id: 'output_height_limited', from_tier: 'free' });
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

  it('no upgradePath (operator): explanation and Close only', () => {
    h.auth = { tier: 'operator', openAuth: vi.fn() };
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

const premiumLimits = {
  opsPerDay: 100, aiOpsPerDay: 20, exportsPerDay: 50, maxFileBytes: 5 * 1024 ** 3, maxOutputHeight: 2160,
  studioProjects: -1,
};
const servedTiers = { tiers: [{ tier: 'premium', limits: premiumLimits }], premiumPurchasable: true, premiumPriceUSD: 7 } as never;
const quotaBody = (metric: string) =>
  ({ error: 'quota_exceeded', tier: 'free', metric, limit: 5, used: 5, resetsAt: '', upgradePath: 'premium' }) as never;

describe('limit-specific interstitial (MM33)', () => {
  it('shows the right limit for each of the four error shapes', () => {
    const free = { tier: 'free', limits: { maxFileBytes: 1024 ** 3 } };
    const file = interstitialCopy({ kind: 'limit', detail: { error: 'file_too_large', limit: 0 } }, free as never);
    expect(file).toMatchObject({ titleKey: 'interface:upgradeInterstitial.fileSize.title', limitKey: 'file_too_large', upgradePath: 'premium', values: { limit: '1 GB' } });
    expect(interstitialCopy({ kind: 'quota', detail: quotaBody('ops') })).toMatchObject({ titleKey: 'interface:upgradeInterstitial.quota.title', limitKey: 'quota_ops' });
    expect(interstitialCopy({ kind: 'quota', detail: quotaBody('ai_ops') })).toMatchObject({ limitKey: 'quota_ai_ops', placement: 'limit_interstitial' });
    expect(interstitialCopy({ kind: 'limit', detail: heightBody })).toMatchObject({ limitKey: 'output_height_limited' });
  });

  it('413 for an anonymous caller offers sign-up, and for premium nothing higher', () => {
    const d = { kind: 'limit', detail: { error: 'file_too_large', limit: 0 } } as const;
    expect(interstitialCopy(d, { tier: 'anonymous' }).upgradePath).toBe('signup');
    expect(interstitialCopy(d, { tier: 'premium' }).upgradePath).toBeUndefined();
  });

  it('quotes what Premium changes from the served table, per limit', () => {
    expect(premiumChange('file_too_large', servedTiers)).toEqual({ key: 'interface:upgradeInterstitial.premiumChange.fileSize', values: { value: '5 GB' } });
    expect(premiumChange('quota_ai_ops', servedTiers)).toEqual({ key: 'interface:upgradeInterstitial.premiumChange.aiOps', values: { value: 20 } });
    expect(premiumChange('output_height_limited', servedTiers)).toMatchObject({ values: { value: 2160 } });
    expect(premiumChange('project_limit_reached', servedTiers)?.key).toContain('projectsUnlimited');
    expect(premiumChange('quota_ops', undefined)).toBeNull();
  });

  it('renders the Premium line only when the table is served', () => {
    h.tiers = servedTiers;
    render(<UpgradeInterstitial input={{ kind: 'quota', detail: quotaBody('ai_ops') }} onClose={vi.fn()} />);
    expect(screen.getByTestId('premium-change').textContent).toContain('premiumChange.aiOps');
    cleanup();
    h.tiers = undefined;
    render(<UpgradeInterstitial input={{ kind: 'quota', detail: quotaBody('ai_ops') }} onClose={vi.fn()} />);
    expect(screen.queryByTestId('premium-change')).toBeNull();
  });

  it('allows one interstitial per distinct limit per session', () => {
    const ai = { kind: 'quota', detail: quotaBody('ai_ops') } as const;
    const ops = { kind: 'quota', detail: quotaBody('ops') } as const;
    expect(claimInterstitial(limitKeyOf(ai))).toBe(true);
    expect(claimInterstitial(limitKeyOf(ai))).toBe(false);
    expect(claimInterstitial(limitKeyOf(ops))).toBe(true);
  });
});

describe('UpgradeInterstitial translator mode (MM52)', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('translator mode: hides the upgrade button', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    render(<UpgradeInterstitial input={{ kind: 'limit', detail: heightBody }} onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'interface:upgradeInterstitial.upgrade' })).toBeNull();
  });

  it('production: shows the upgrade button', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    render(<UpgradeInterstitial input={{ kind: 'limit', detail: heightBody }} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'interface:upgradeInterstitial.upgrade' })).toBeTruthy();
  });
});

describe('Premium callers: "Upgrade to Pro" only where Pro raises the limit (MM40 decision 3)', () => {
  const served = tiersFixture();
  const premiumQuota = (metric: string) =>
    ({ error: 'quota_exceeded', tier: 'premium', metric, limit: 300, used: 300, resetsAt: '', upgradePath: 'premium' }) as never;

  it.each(['ops', 'ai_ops', 'export'])('quota %s: offers Pro', (metric) => {
    const copy = interstitialCopy({ kind: 'quota', detail: premiumQuota(metric) });
    expect(interstitialOffer(copy, 'premium', served)).toBe('pro');
  });

  it.each([
    ['file size', { kind: 'limit', detail: { error: 'file_too_large', limit: 0 } }],
    ['resolution', { kind: 'limit', detail: { error: 'output_height_limited', limit: 2160, requested: 4320 } }],
    ['projects', { kind: 'limit', detail: { error: 'project_limit_reached', limit: 5 } }],
  ] as const)('%s: offers nothing (Pro does not raise it)', (_name, input) => {
    const copy = interstitialCopy(input as never, { tier: 'premium' });
    expect(interstitialOffer(copy, 'premium', served)).toBeUndefined();
  });

  it('pro and operator are never offered anything; free keeps Premium', () => {
    const copy = interstitialCopy({ kind: 'quota', detail: premiumQuota('ops') });
    expect(interstitialOffer(copy, 'pro', served)).toBeUndefined();
    expect(interstitialOffer(copy, 'operator', served)).toBeUndefined();
    expect(interstitialOffer(copy, 'free', served)).toBe('premium');
  });

  it('quotes what Pro changes from the served table, only for the daily allowances', () => {
    expect(proChange('quota_ops', served)).toEqual({ key: 'interface:upgradeInterstitial.proChange.ops', values: { value: 700 } });
    expect(proChange('quota_ai_ops', served)).toEqual({ key: 'interface:upgradeInterstitial.proChange.aiOps', values: { value: 200 } });
    expect(proChange('file_too_large', served)).toBeNull();
  });

  it('renders "Upgrade to Pro" for a Premium subscriber at the daily cap and runs the plan change', async () => {
    h.auth = { tier: 'premium', openAuth: vi.fn() };
    h.tiers = served;
    h.status = { plan: 'premium', cancelAtPeriodEnd: false };
    const onClose = vi.fn();
    render(<UpgradeInterstitial input={{ kind: 'quota', detail: premiumQuota('ops') }} onClose={onClose} />);
    expect(screen.getByTestId('pro-change').textContent).toContain('proChange.ops|value=700');
    expect(screen.getByTestId('pro-upgrade-note')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'interface:upgradeInterstitial.upgrade' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'interface:billing.upgradePro' }));
    await waitFor(() => expect(h.planRun).toHaveBeenCalledWith('upgrade'));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(h.startCheckout).not.toHaveBeenCalled();
  });

  it('no "Upgrade to Pro" for a Premium subscriber who hits the file-size, duration or resolution cap', () => {
    h.auth = { tier: 'premium', openAuth: vi.fn(), limits: { maxFileBytes: 5 * 1024 ** 3 } };
    h.tiers = served;
    h.status = { plan: 'premium', cancelAtPeriodEnd: false };
    for (const detail of [
      { error: 'file_too_large', limit: 0 },
      { error: 'output_height_limited', limit: 2160, requested: 4320 },
    ]) {
      render(<UpgradeInterstitial input={{ kind: 'limit', detail } as never} onClose={vi.fn()} />);
      expect(screen.queryByRole('button', { name: 'interface:billing.upgradePro' })).toBeNull();
      expect(screen.queryByRole('button', { name: 'interface:upgradeInterstitial.upgrade' })).toBeNull();
      expect(screen.getByText('interface:upgradeInterstitial.noHigherPlan')).toBeTruthy();
      cleanup();
    }
  });

  it('no Pro button for a team-granted Premium, while Pro is not purchasable, or in translator mode', () => {
    h.auth = { tier: 'premium', openAuth: vi.fn() };
    h.tiers = served;
    h.status = { plan: null, manualGrant: { expiresAt: null } };
    render(<UpgradeInterstitial input={{ kind: 'quota', detail: premiumQuota('ops') }} onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'interface:billing.upgradePro' })).toBeNull();
    cleanup();
    h.status = { plan: 'premium', cancelAtPeriodEnd: false };
    h.proPurchasable = false;
    render(<UpgradeInterstitial input={{ kind: 'quota', detail: premiumQuota('ops') }} onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'interface:billing.upgradePro' })).toBeNull();
    cleanup();
    h.proPurchasable = true;
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    render(<UpgradeInterstitial input={{ kind: 'quota', detail: premiumQuota('ops') }} onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'interface:billing.upgradePro' })).toBeNull();
    vi.unstubAllEnvs();
  });
});
