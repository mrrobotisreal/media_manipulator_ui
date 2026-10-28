import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/components.json';
import { describe as describeResult } from '@/lib/results/describe';
import { resetResultBlobCache } from '@/lib/results/useResultBlob';
import { resetDownloadStatusesForTests } from '@/lib/results/downloadController';
import { ResultPanel, resetPreviewedForTests } from './result-panel';

const h = vi.hoisted(() => ({ authedFetch: vi.fn(), downloadFile: vi.fn(), track: vi.fn() }));

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string>) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => opts?.[k] ?? '');
    },
    formatFileSize: (n: number) => `${Math.round(n / 1_000_000)} MB`,
    formatDate: () => 'Oct 28, 2026',
    formatTime: () => '9:00 AM',
  }),
}));
vi.mock('@/lib/analytics', async () => {
  const actual = await vi.importActual<typeof import('@/lib/analytics')>('@/lib/analytics');
  return {
    ...actual,
    analytics: { track: vi.fn() },
    useToolAnalytics: () => ({ track: h.track, toolSlug: 'x', setMediaKind: () => undefined }),
  };
});
vi.mock('@/lib/auth/authedFetch', () => ({ authedFetch: h.authedFetch }));
vi.mock('@/lib/useDownloadFile', () => ({ default: () => ({ downloadFile: h.downloadFile }) }));
vi.mock('@/lib/results/save', () => ({ saveBlobToDisk: vi.fn() }));

// An 880 MB WAV that the panel never loads into memory (unknown viewer: no blob).
const descriptor = describeResult({
  job: { id: 'job-big', resultFileName: 'mix_converted.xyz', resultSizeBytes: 922_710_094 },
  mode: 'convert',
});

const okLink = () => ({
  ok: true,
  status: 200,
  json: async () => ({ url: '/api/download/job-big?token=v1.t', sizeBytes: 922_710_094, fileName: 'mix_converted.xyz' }),
  blob: vi.fn(),
});

describe('ResultPanel download feedback (MM80)', () => {
  let clicks: string[];
  beforeEach(() => {
    clicks = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      clicks.push(this.href);
    });
    Object.assign(URL, { createObjectURL: vi.fn(() => 'blob:x'), revokeObjectURL: vi.fn() });
    h.authedFetch.mockReset();
    h.downloadFile.mockReset();
    h.track.mockReset();
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    resetResultBlobCache();
    resetPreviewedForTests();
    resetDownloadStatusesForTests();
  });

  it('shows a disabled "Preparing download…" button, then the started line with the size', async () => {
    let resolve!: (v: unknown) => void;
    h.authedFetch.mockReturnValue(new Promise((r) => (resolve = r)));
    render(<ResultPanel descriptor={descriptor} />);

    fireEvent.click(screen.getByRole('button', { name: /^Download$/ }));
    const busy = await screen.findByRole('button', { name: /Preparing download…/ });
    expect((busy as HTMLButtonElement).disabled).toBe(true);
    expect(busy.getAttribute('aria-busy')).toBe('true');
    expect(busy.querySelector('.animate-spin')).toBeTruthy();

    await act(async () => resolve(okLink()));
    await waitFor(() => expect(screen.getByTestId('download-status').textContent).toContain('Your download has started (923 MB)'));
    expect(screen.getByTestId('download-status').textContent).toContain("check your browser's downloads");
    expect(screen.getByRole('button', { name: /^Download$/ })).toBeTruthy();
    expect(clicks).toHaveLength(1);
    expect(clicks[0]).toMatch(/\/download\/job-big\?token=v1\.t$/);
    // No in-memory fetch of the result, ever.
    expect(h.downloadFile).not.toHaveBeenCalled();
    expect(h.authedFetch.mock.calls[0][0]).toMatch(/\/download\/job-big\/link$/);
  });

  it('a quick second click does not start a second download', async () => {
    h.authedFetch.mockResolvedValue(okLink());
    render(<ResultPanel descriptor={descriptor} />);
    const button = screen.getByRole('button', { name: /^Download$/ });
    fireEvent.click(button);
    fireEvent.click(button);
    await screen.findByTestId('download-status');
    fireEvent.click(screen.getByRole('button', { name: /^Download$/ }));
    await act(async () => undefined);
    expect(h.authedFetch).toHaveBeenCalledTimes(1);
    expect(clicks).toHaveLength(1);
  });

  it('a failure shows an inline error, the no-recharge note and a working "Try again"', async () => {
    h.authedFetch.mockResolvedValueOnce({ ok: false, status: 503, json: async () => ({}) });
    render(<ResultPanel descriptor={descriptor} />);
    fireEvent.click(screen.getByRole('button', { name: /^Download$/ }));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain("The download couldn't start.");
    expect(alert.textContent).toContain('Downloading again never re-runs or charges the job.');
    expect(clicks).toHaveLength(0);

    h.authedFetch.mockResolvedValueOnce(okLink());
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await waitFor(() => expect(screen.getByTestId('download-status').textContent).toContain('Your download has started'));
    expect(clicks).toHaveLength(1);
  });

  it('a 404 says the result is gone', async () => {
    h.authedFetch.mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({}) });
    render(<ResultPanel descriptor={descriptor} />);
    fireEvent.click(screen.getByRole('button', { name: /^Download$/ }));
    expect((await screen.findByRole('alert')).textContent).toContain('no longer available');
  });
});
