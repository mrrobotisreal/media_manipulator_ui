import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({ authedFetch: vi.fn(), track: vi.fn() }));
vi.mock('@/lib/auth/authedFetch', () => ({ authedFetch: h.authedFetch }));
vi.mock('@/lib/utils', async () => {
  const actual = await vi.importActual<typeof import('@/lib/utils')>('@/lib/utils');
  return { ...actual, getBaseURL: () => 'https://api.example.test/api' };
});

import {
  MP3_POLL_MS,
  MP3_POLL_TIMEOUT_MS,
  canDownloadAsMp3,
  downloadResultAsMp3,
  getMp3Status,
  isVocalStemJob,
  mp3NameFor,
  resetMp3StatusesForTests,
} from './mp3Download';

const res = (status: number, body: unknown) => ({ ok: status < 300, status, json: async () => body });
const READY = { status: 'ready', url: '/api/download/job-1?token=v1.mp3', sizeBytes: 209_000_000, fileName: 'Set_converted.mp3' };

describe('MM81 Download as MP3', () => {
  let clicks: HTMLAnchorElement[];
  const sleep = vi.fn(async () => undefined);
  beforeEach(() => {
    clicks = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      clicks.push(this);
    });
    h.authedFetch.mockReset();
    h.track.mockReset();
    sleep.mockClear();
    resetMp3StatusesForTests();
  });
  afterEach(() => vi.restoreAllMocks());

  it('POST starts the conversion, GET polls until ready, then the browser downloads the signed link', async () => {
    h.authedFetch
      .mockResolvedValueOnce(res(202, { status: 'processing' }))
      .mockResolvedValueOnce(res(202, { status: 'processing' }))
      .mockResolvedValueOnce(res(200, READY));
    const out = await downloadResultAsMp3({ jobId: 'job-1', fileName: 'Set_converted.wav', track: h.track, sleep });
    expect(out).toBe('started');
    expect(h.authedFetch.mock.calls.map((c) => [c[0], (c[1] as RequestInit).method])).toEqual([
      ['https://api.example.test/api/download/job-1/mp3', 'POST'],
      ['https://api.example.test/api/download/job-1/mp3', 'GET'],
      ['https://api.example.test/api/download/job-1/mp3', 'GET'],
    ]);
    expect(sleep).toHaveBeenCalledWith(MP3_POLL_MS);
    expect(clicks).toHaveLength(1);
    expect(clicks[0].href).toMatch(/\/api\/download\/job-1\?token=v1\.mp3$/);
    expect(clicks[0].download).toBe('Set_converted.mp3');
    expect(getMp3Status('job-1')).toMatchObject({ phase: 'started', sizeBytes: 209_000_000 });
    expect(h.track).toHaveBeenCalledWith('download_started', { job_id: 'job-1', output_format: 'mp3' }, expect.objectContaining({ job_id: 'job-1' }));
  });

  it('a cached MP3 answers ready at once (no polling)', async () => {
    h.authedFetch.mockResolvedValueOnce(res(200, READY));
    expect(await downloadResultAsMp3({ jobId: 'job-1', fileName: 'a.wav', track: h.track, sleep })).toBe('started');
    expect(h.authedFetch).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('a second click while converting is ignored', async () => {
    let release!: (v: unknown) => void;
    h.authedFetch.mockReturnValueOnce(new Promise((r) => (release = r)));
    const first = downloadResultAsMp3({ jobId: 'job-1', fileName: 'a.wav', track: h.track, sleep });
    expect(await downloadResultAsMp3({ jobId: 'job-1', fileName: 'a.wav', track: h.track, sleep })).toBe('skipped');
    release(res(200, READY));
    expect(await first).toBe('started');
    expect(h.authedFetch).toHaveBeenCalledTimes(1);
  });

  it('server failure, HTTP error and timeout report download_failed and no download', async () => {
    h.authedFetch.mockResolvedValueOnce(res(202, { status: 'processing' })).mockResolvedValueOnce(res(200, { status: 'failed', error: 'Could not convert' }));
    expect(await downloadResultAsMp3({ jobId: 'a', fileName: 'a.wav', track: h.track, sleep })).toBe('failed');
    expect(h.track).toHaveBeenCalledWith('download_failed', { job_id: 'a', reason: 'Could not convert' }, expect.anything());

    h.authedFetch.mockResolvedValueOnce(res(404, { error: 'Job not found' }));
    expect(await downloadResultAsMp3({ jobId: 'b', fileName: 'b.wav', track: h.track, sleep })).toBe('failed');
    expect(getMp3Status('b')).toMatchObject({ phase: 'failed', errorStatus: 404 });

    let t = 0;
    h.authedFetch.mockResolvedValue(res(202, { status: 'processing' }));
    const out = await downloadResultAsMp3({ jobId: 'c', fileName: 'c.wav', track: h.track, sleep, now: () => (t += MP3_POLL_TIMEOUT_MS / 3) });
    expect(out).toBe('failed');
    expect(clicks).toHaveLength(0);
  });

  it('helpers', () => {
    expect(canDownloadAsMp3('x_converted.WAV')).toBe(true);
    expect(canDownloadAsMp3('x.mp3') || canDownloadAsMp3(undefined)).toBe(false);
    expect(mp3NameFor('My Song_converted.wav')).toBe('My Song_converted.mp3');
    for (const hint of ['remove_vocals', 'isolate_vocals', 'ai_remove_vocals', 'ai_isolate_vocals', 'remove-vocals-from-song', 'isolate-vocals-from-song']) {
      expect(isVocalStemJob(hint), hint).toBe(true);
    }
    for (const hint of ['converter', 'convert', 'ai_clean_voice', 'mp3-to-wav', undefined]) expect(isVocalStemJob(hint)).toBe(false);
  });
});
