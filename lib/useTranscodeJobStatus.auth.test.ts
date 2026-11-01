import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => 'tok' }));
vi.mock('@/lib/analytics', () => ({ getSessionId: () => 'sess 1' }));

import useTranscodeJobStatus from './useTranscodeJobStatus';

afterEach(() => vi.unstubAllGlobals());

describe('transcode job status identity (MA08)', () => {
  it('opens the EventSource with ?sid= and polls with identity headers', async () => {
    const urls: string[] = [];
    class FakeES {
      onerror: (() => void) | null = null;
      constructor(url: string) {
        urls.push(url);
      }
      addEventListener() {}
      close() {}
    }
    vi.stubGlobal('EventSource', FakeES);
    const f = vi.fn(async () => new Response(JSON.stringify({ status: 'processing' }), { status: 200 }));
    vi.stubGlobal('fetch', f);
    renderHook(() => useTranscodeJobStatus('job-2'));
    await waitFor(() => expect(urls.length).toBe(1));
    expect(urls[0]).toContain('/job/job-2/events?sid=sess%201');
    await waitFor(() => expect(f).toHaveBeenCalled());
    const init = (f.mock.calls[0] as unknown as [string, RequestInit])[1];
    const h = new Headers(init.headers);
    expect(h.get('X-MM-Session-ID')).toBe('sess 1');
    expect(h.get('Authorization')).toBe('Bearer tok');
  });
});
