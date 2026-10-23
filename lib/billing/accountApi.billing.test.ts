import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/analytics/session', () => ({ getSessionId: () => 'sess-1' }));
vi.mock('@/lib/analytics/identity', () => ({ getVisitorId: () => 'vis-1' }));
vi.mock('@/lib/utils', () => ({ getBaseURL: () => 'https://api.test/api', cn: (...a: unknown[]) => a.join(' ') }));

import {
  BillingRefusal,
  createCheckoutSession,
  createPortalSession,
  fetchBillingStatus,
  isLimitRefusal,
  verifyCheckoutSession,
} from '@/lib/auth/accountApi';

function reply(status: number, body: unknown) {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(body), { status }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
afterEach(() => vi.unstubAllGlobals());

describe('billing API client', () => {
  it('checkout sends interval + locale and stamps the visitor and session ids', async () => {
    const f = reply(200, { url: 'https://checkout.stripe.test/c/1' });
    await expect(createCheckoutSession('tok', { interval: 'yearly', locale: 'ru-RU' })).resolves.toEqual({ url: 'https://checkout.stripe.test/c/1' });
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.test/api/billing/checkout');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({ interval: 'yearly', locale: 'ru-RU' });
    expect(init.headers).toMatchObject({ Authorization: 'Bearer tok', 'X-MM-Visitor-ID': 'vis-1', 'X-MM-Session-ID': 'sess-1' });
  });

  it.each([
    [409, { error: 'already_subscribed', reason: 'already_subscribed', portalAvailable: true }, 'already_subscribed'],
    [409, { error: 'manual_grant_active', reason: 'manual_grant_active', expiresAt: null }, 'manual_grant_active'],
    [503, { error: 'billing_unavailable' }, 'billing_unavailable'],
    [403, { error: 'operator_account', reason: 'operator_account' }, 'operator_account'],
    [401, { error: 'Authentication required' }, 'unauthorized'],
    [502, { error: 'billing_provider_error' }, 'billing_provider_error'],
  ])('checkout %i -> BillingRefusal(%s)', async (status, body, reason) => {
    reply(status, body);
    const err = await createCheckoutSession('tok', { interval: 'monthly' }).catch((e) => e);
    expect(err).toBeInstanceOf(BillingRefusal);
    expect((err as BillingRefusal).reason).toBe(reason);
  });

  it('keeps portalAvailable on already_subscribed', async () => {
    reply(409, { error: 'already_subscribed', reason: 'already_subscribed', portalAvailable: true });
    const err = (await createCheckoutSession('t', { interval: 'monthly' }).catch((e) => e)) as BillingRefusal;
    expect(err.portalAvailable).toBe(true);
  });

  it('portal, status and session verification hit the MM17 routes', async () => {
    let f = reply(200, { url: 'https://portal.test' });
    await createPortalSession('t', { locale: 'de-DE' });
    expect((f.mock.calls[0] as unknown as [string])[0]).toBe('https://api.test/api/billing/portal');
    f = reply(200, { purchasable: false, interval: null, status: null, renewsAt: null, cancelAtPeriodEnd: false, portalAvailable: false, manualGrant: null });
    expect((await fetchBillingStatus('t')).purchasable).toBe(false);
    expect((f.mock.calls[0] as unknown as [string])[0]).toBe('https://api.test/api/billing/status');
    f = reply(200, { belongsToUser: true, paid: true, tierApplied: false });
    await verifyCheckoutSession('t', 'cs_test_1');
    expect((f.mock.calls[0] as unknown as [string])[0]).toBe('https://api.test/api/billing/session/cs_test_1');
  });

  it('isLimitRefusal recognizes the MM18 bodies', () => {
    expect(isLimitRefusal({ error: 'output_height_limited', limit: 1440, requested: 2160, upgradePath: 'premium' })).toBe(true);
    expect(isLimitRefusal({ error: 'project_limit_reached', limit: 5 })).toBe(true);
    expect(isLimitRefusal({ error: 'nope' })).toBe(false);
    expect(isLimitRefusal(null)).toBe(false);
  });
});
