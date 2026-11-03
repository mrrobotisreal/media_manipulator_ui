import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => 'tok' }));
vi.mock('@/lib/analytics', () => ({ getSessionId: () => 'sess-1' }));

import { checkJobStatus } from './useGetJobStatus';

afterEach(() => vi.unstubAllGlobals());

describe('job status poll identity (MA08)', () => {
  it('sends X-MM-Session-ID and the Bearer token', async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ status: 'processing', progress: 10 }), { status: 200 }));
    vi.stubGlobal('fetch', f);
    await checkJobStatus('job-1');
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain('/job/job-1');
    const h = new Headers(init.headers);
    expect(h.get('X-MM-Session-ID')).toBe('sess-1');
    expect(h.get('Authorization')).toBe('Bearer tok');
  });
});
