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
