import { afterEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({
  token: vi.fn(async () => 'tok'),
  checkout: vi.fn(async () => ({ url: 'https://stripe.test/c' })),
  portal: vi.fn(async () => ({ url: 'https://stripe.test/p' })),
}));
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: h.token }));
vi.mock('@/lib/analytics', () => ({ analytics: { track: vi.fn() }, EVENTS: { CHECKOUT_STARTED: 'c', PORTAL_OPENED: 'p' } }));
vi.mock('@/lib/auth/accountApi', async (orig) => ({
  ...(await orig<typeof import('@/lib/auth/accountApi')>()),
  createCheckoutSession: h.checkout,
  createPortalSession: h.portal,
}));

import { openPortal, startCheckout } from './checkout';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('billing actions', () => {
  it('translator mode: startCheckout refuses without calling the API', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    expect(await startCheckout('monthly', 'x')).toEqual({ ok: false, reason: 'billing_unavailable' });
    expect(h.token).not.toHaveBeenCalled();
    expect(h.checkout).not.toHaveBeenCalled();
  });

  it('translator mode: openPortal refuses without calling the API', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    expect(await openPortal('x')).toEqual({ ok: false, reason: 'billing_unavailable' });
    expect(h.token).not.toHaveBeenCalled();
    expect(h.portal).not.toHaveBeenCalled();
  });

  it('production: startCheckout and openPortal call the API', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    const assign = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign });
    expect(await startCheckout('monthly', 'x')).toEqual({ ok: true });
    expect(await openPortal('x')).toEqual({ ok: true });
    expect(h.checkout).toHaveBeenCalledTimes(1);
    expect(h.portal).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });
});

describe('Checkout currency (MM69)', () => {
  it('sends the page currency once the API sells EUR, and tags checkout_started with it', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    const assign = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign });
    const { noteTiers, pickCurrency, resetCurrencyForTests } = await import('./currency');
    const { analytics } = await import('@/lib/analytics');
    resetCurrencyForTests();
    // An older API (no EUR prices): no currency field, USD in the event.
    await startCheckout('monthly', 'pricing_premium');
    expect(h.checkout).toHaveBeenLastCalledWith('tok', { interval: 'monthly', plan: 'premium', locale: undefined });
    expect(analytics.track).toHaveBeenLastCalledWith('c', { interval: 'monthly', placement: 'pricing_premium', plan: 'premium', currency: 'usd' });
    noteTiers({ prices: { eur: {} } }, { geo: false });
    pickCurrency('eur', true);
    await startCheckout('yearly', 'pricing_pro', 'de-DE', 'pro');
    expect(h.checkout).toHaveBeenLastCalledWith('tok', { interval: 'yearly', plan: 'pro', locale: 'de-DE', currency: 'eur' });
    expect(analytics.track).toHaveBeenLastCalledWith('c', { interval: 'yearly', placement: 'pricing_pro', plan: 'pro', currency: 'eur' });
    resetCurrencyForTests();
    vi.unstubAllGlobals();
  });

  it('currency_locked: switches the page to the locked currency and reports the refusal', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    const { BillingRefusal } = await import('@/lib/auth/accountApi');
    const { currentCurrency, noteTiers, pickCurrency, resetCurrencyForTests } = await import('./currency');
    resetCurrencyForTests();
    noteTiers({ prices: { eur: {} } }, { geo: false });
    pickCurrency('usd', true);
    h.checkout.mockRejectedValueOnce(new BillingRefusal('currency_locked', 409, { currency: 'eur' }));
    const outcome = await startCheckout('monthly', 'pricing_premium');
    expect(outcome).toMatchObject({ ok: false, reason: 'currency_locked' });
    expect(currentCurrency()).toMatchObject({ currency: 'eur', locked: true, source: 'lock' });
    resetCurrencyForTests();
  });
});
