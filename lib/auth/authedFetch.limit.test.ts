import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => 'tok' }));
vi.mock('@/lib/analytics', () => ({ getSessionId: () => 's1' }));

import { authedFetch } from './authedFetch';
import { subscribeLimitRefusal } from './quotaBus';

afterEach(() => vi.unstubAllGlobals());

describe('authedFetch 403 plan-limit refusals', () => {
  it('publishes output_height_limited and still returns the response untouched', async () => {
    const body = { error: 'output_height_limited', message: 'm', limit: 1440, requested: 2160, upgradePath: 'premium' };
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(body), { status: 403 })));
    const seen: unknown[] = [];
    const off = subscribeLimitRefusal((d) => seen.push(d));
    const res = await authedFetch('https://api.test/api/upload', { method: 'POST' });
    off();
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual(body);
    expect(seen).toEqual([body]);
  });

  it('ignores unrelated 403s', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 })));
    const seen: unknown[] = [];
    const off = subscribeLimitRefusal((d) => seen.push(d));
    await authedFetch('https://api.test/api/x');
    off();
    expect(seen).toEqual([]);
  });

  it('publishes a file_too_large refusal on a 413 and returns the response untouched', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('too big', { status: 413 })));
    const seen: unknown[] = [];
    const off = subscribeLimitRefusal((d) => seen.push(d));
    const res = await authedFetch('https://api.test/api/upload', { method: 'POST' });
    off();
    expect(res.status).toBe(413);
    expect(seen).toEqual([{ error: 'file_too_large', limit: 0 }]);
  });
});
