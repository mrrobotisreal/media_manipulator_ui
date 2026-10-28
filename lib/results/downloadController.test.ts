import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({
  authedFetch: vi.fn(),
  save: vi.fn(),
  track: vi.fn(),
}));

vi.mock('@/lib/auth/authedFetch', () => ({ authedFetch: h.authedFetch }));
vi.mock('./save', () => ({ saveBlobToDisk: h.save }));
vi.mock('@/lib/utils', async () => {
  const actual = await vi.importActual<typeof import('@/lib/utils')>('@/lib/utils');
  return { ...actual, getBaseURL: () => 'https://api.example.test/api' };
});

import {
  CACHED_SAVE_MAX_BYTES,
  REPEAT_GUARD_MS,
  downloadResult,
  getDownloadStatus,
  resetDownloadStatusesForTests,
} from './downloadController';

const LINK = '/api/download/job-1?token=v1.sealed';
const linkResponse = (overrides: Partial<{ ok: boolean; status: number; body: unknown }> = {}) => {
  const blob = vi.fn();
  const res = {
    ok: overrides.ok ?? true,
    status: overrides.status ?? 200,
    json: async () => overrides.body ?? { url: LINK, expiresAt: '2026-10-28T12:05:00Z', sizeBytes: 922_710_094, fileName: 'song.wav' },
    blob,
  };
  return { res, blob };
};

describe('downloadController', () => {
  let clicks: HTMLAnchorElement[];

  beforeEach(() => {
    clicks = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      clicks.push(this);
    });
    h.authedFetch.mockReset();
    h.save.mockReset();
    h.track.mockReset();
    resetDownloadStatusesForTests();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('uncached result: mints a signed link and hands it to the browser, never reading the body', async () => {
    const { res, blob } = linkResponse();
    h.authedFetch.mockResolvedValue(res);

    const out = await downloadResult({ jobId: 'job-1', fileName: 'song.wav', sizeBytes: 922_710_094, track: h.track });

    expect(out).toEqual({ outcome: 'link' });
    const [url, init] = h.authedFetch.mock.calls[0];
    expect(url).toBe('https://api.example.test/api/download/job-1/link');
    expect(init).toMatchObject({ method: 'POST', body: JSON.stringify({ fileName: 'song.wav' }) });
    expect(blob).not.toHaveBeenCalled();
    expect(h.save).not.toHaveBeenCalled();
    expect(clicks).toHaveLength(1);
    expect(clicks[0].href).toBe('https://api.example.test/api/download/job-1?token=v1.sealed');
    expect(clicks[0].download).toBe('song.wav');
    expect(getDownloadStatus('job-1')).toMatchObject({ phase: 'started', via: 'link', sizeBytes: 922_710_094 });
  });

  it('link path emits download_started only (the server owns completion)', async () => {
    h.authedFetch.mockResolvedValue(linkResponse().res);
    await downloadResult({ jobId: 'job-1', fileName: 'song.wav', sizeBytes: 10, track: h.track });
    expect(h.track.mock.calls.map((c) => c[0])).toEqual(['download_started']);
    expect(h.track).toHaveBeenCalledWith(
      'download_started',
      { job_id: 'job-1', output_format: 'wav', size_bytes: 10 },
      { job_id: 'job-1' },
    );
  });

  it('is "preparing" while the link request is in flight', async () => {
    let resolve!: (v: unknown) => void;
    h.authedFetch.mockReturnValue(new Promise((r) => (resolve = r)));
    const pending = downloadResult({ jobId: 'job-1', fileName: 'song.wav', track: h.track });
    expect(getDownloadStatus('job-1').phase).toBe('preparing');
    resolve(linkResponse().res);
    await pending;
    expect(getDownloadStatus('job-1').phase).toBe('started');
  });

  it('small cached bytes are saved from memory with download_completed', async () => {
    const cached = new Blob(['abc']);
    const out = await downloadResult({ jobId: 'job-2', fileName: 'a.png', cachedBlob: cached, track: h.track });
    expect(out).toEqual({ outcome: 'cache' });
    expect(h.authedFetch).not.toHaveBeenCalled();
    expect(h.save).toHaveBeenCalledWith(cached, 'a.png');
    expect(h.track.mock.calls.map((c) => c[0])).toEqual(['download_completed']);
    expect(getDownloadStatus('job-2')).toMatchObject({ phase: 'started', via: 'cache', sizeBytes: 3 });
  });

  it('large cached bytes still go through the native download', async () => {
    h.authedFetch.mockResolvedValue(linkResponse().res);
    const big = { size: CACHED_SAVE_MAX_BYTES + 1 } as Blob;
    const out = await downloadResult({ jobId: 'job-1', fileName: 'song.wav', cachedBlob: big, track: h.track });
    expect(out).toEqual({ outcome: 'link' });
    expect(h.save).not.toHaveBeenCalled();
  });

  it('ignores a repeat click while preparing and within the guard window, then allows one', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-28T12:00:00Z'));
    let resolve!: (v: unknown) => void;
    h.authedFetch.mockReturnValueOnce(new Promise((r) => (resolve = r)));
    const first = downloadResult({ jobId: 'job-1', fileName: 'song.wav', track: h.track });
    expect(await downloadResult({ jobId: 'job-1', fileName: 'song.wav', track: h.track })).toEqual({ outcome: 'skipped' });
    resolve(linkResponse().res);
    await first;
    vi.setSystemTime(new Date(Date.now() + REPEAT_GUARD_MS - 1));
    expect(await downloadResult({ jobId: 'job-1', fileName: 'song.wav', track: h.track })).toEqual({ outcome: 'skipped' });
    expect(h.authedFetch).toHaveBeenCalledTimes(1);
    expect(clicks).toHaveLength(1);

    vi.setSystemTime(new Date(Date.now() + 2));
    h.authedFetch.mockResolvedValueOnce(linkResponse().res);
    expect(await downloadResult({ jobId: 'job-1', fileName: 'song.wav', track: h.track })).toEqual({ outcome: 'link' });
    expect(clicks).toHaveLength(2);
  });

  it('failure: status failed + download_failed; a retry goes straight back through', async () => {
    h.authedFetch.mockResolvedValueOnce(linkResponse({ ok: false, status: 503 }).res);
    const out = await downloadResult({ jobId: 'job-1', fileName: 'song.wav', track: h.track });
    expect(out.outcome).toBe('failed');
    expect(getDownloadStatus('job-1')).toMatchObject({ phase: 'failed', errorStatus: 503 });
    expect(clicks).toHaveLength(0);
    expect(h.track).toHaveBeenLastCalledWith(
      'download_failed',
      { job_id: 'job-1', reason: 'Download link failed: 503', status: 503 },
      { job_id: 'job-1' },
    );

    h.authedFetch.mockResolvedValueOnce(linkResponse().res);
    expect(await downloadResult({ jobId: 'job-1', fileName: 'song.wav', track: h.track })).toEqual({ outcome: 'link' });
    expect(getDownloadStatus('job-1').phase).toBe('started');
  });

  it('a network error is a failure, not a throw', async () => {
    h.authedFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    const out = await downloadResult({ jobId: 'job-1', fileName: 'song.wav', track: h.track });
    expect(out.outcome).toBe('failed');
    expect(getDownloadStatus('job-1').phase).toBe('failed');
  });

  it('a response without a url is a failure', async () => {
    h.authedFetch.mockResolvedValueOnce(linkResponse({ body: {} }).res);
    expect((await downloadResult({ jobId: 'job-1', fileName: 'x', track: h.track })).outcome).toBe('failed');
  });
});
