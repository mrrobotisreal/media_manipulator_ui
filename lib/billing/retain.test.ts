import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/authedFetch', () => ({
  authedFetch: vi.fn(),
}));

import { authedFetch } from '@/lib/auth/authedFetch';
import { endsAtOf, retainSubscription, type BillingStatus } from '@/lib/auth/accountApi';

const res = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });
afterEach(() => vi.clearAllMocks());

describe('retainSubscription', () => {
  it('posts the offer with bearer + visitor/session headers and returns the status', async () => {
    vi.mocked(authedFetch).mockResolvedValue(res(200, { status: { cancelAtPeriodEnd: false } }));
    const out = await retainSubscription('tok', 'retain7');
    expect(out).toEqual({ ok: true, status: { cancelAtPeriodEnd: false } });
    const [url, init] = vi.mocked(authedFetch).mock.calls[0];
    expect(url).toMatch(/\/billing\/retain$/);
    expect(init?.method).toBe('POST');
    expect(init?.body).toBe(JSON.stringify({ offer: 'retain7' }));
    const h = init?.headers as Record<string, string>;
    expect(h.Authorization).toBe('Bearer tok');
    expect(h['X-MM-Visitor-ID']).toBeTruthy();
    expect(h['X-MM-Session-ID']).toBeTruthy();
  });
  it('maps 409 codes and other failures', async () => {
    const offer = { kind: 'retain6', priceUSD: 6, nextChargeAt: 'x' };
    vi.mocked(authedFetch).mockResolvedValueOnce(res(409, { error: 'offer_changed', offer }));
    expect(await retainSubscription('t', 'retain7')).toEqual({ ok: false, reason: 'offer_changed', offer });
    vi.mocked(authedFetch).mockResolvedValueOnce(res(409, { error: 'not_cancelled' }));
    expect(await retainSubscription('t', 'resume')).toEqual({ ok: false, reason: 'not_cancelled' });
    vi.mocked(authedFetch).mockResolvedValueOnce(res(503, { error: 'billing_unavailable' }));
    expect(await retainSubscription('t', 'resume')).toEqual({ ok: false, reason: 'error', status: 503 });
  });
});

describe('endsAtOf', () => {
  const s = (p: Partial<BillingStatus>) => ({ renewsAt: null, cancelAtPeriodEnd: false, ...p }) as BillingStatus;
  it('only for cancelled plans; endsAt wins, renewsAt is the fallback', () => {
    expect(endsAtOf(s({ renewsAt: 'r' }))).toBeNull();
    expect(endsAtOf(s({ cancelAtPeriodEnd: true, renewsAt: 'r', endsAt: 'e' }))).toBe('e');
    expect(endsAtOf(s({ cancelAtPeriodEnd: true, renewsAt: 'r' }))).toBe('r');
    expect(endsAtOf(undefined)).toBeNull();
  });
});
