import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/components.json';
import type { RestoreResultsResponse } from '@/lib/restoreTypes';
import { fetchVideoRestoreResults } from '@/lib/useVideoRestoreResults';
import RestoreCompare from './restore-compare';

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string | number>) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(opts?.[k] ?? ''));
    },
    formatFileSize: (n: number) => `${n} B`,
    formatDuration: (s: number) => `${s}s`,
  }),
}));
vi.mock('@/lib/analytics', async () => {
  const actual = await vi.importActual<typeof import('@/lib/analytics')>('@/lib/analytics');
  return { ...actual, getSessionId: () => 'sid-9' };
});
const authedFetch = vi.fn();
vi.mock('@/lib/auth/authedFetch', () => ({ authedFetch: (...a: unknown[]) => authedFetch(...a) }));
vi.mock('@/components/results/compare/video-compare', () => ({
  VideoCompare: (p: { originalSrc: string; resultSrc: string; resultLabel?: string }) => (
    <div data-testid="vc" data-original={p.originalSrc} data-result={p.resultSrc}>{p.resultLabel}</div>
  ),
}));

const manifest: RestoreResultsResponse = {
  jobId: 'j1',
  original: { id: 'original', label: 'Original', width: 480, height: 270, fileName: 'original.mp4', sizeBytes: 10, mime: 'video/mp4' },
  models: [
    { id: 'realesrgan', group: 'frame', status: 'completed', durationSeconds: 40, width: 1920, height: 1080, fileName: 'a.mp4', sizeBytes: 100, mime: 'video/mp4' },
    { id: 'swinir', group: 'frame', status: 'completed', durationSeconds: 90, width: 1920, height: 1080, fileName: 'b.mp4', sizeBytes: 200, mime: 'video/mp4' },
    { id: 'basicvsrpp', group: 'video', status: 'completed', durationSeconds: 120, width: 1920, height: 1080, fileName: 'c.mp4', sizeBytes: 300, mime: 'video/mp4' },
    { id: 'hat', group: 'frame', status: 'failed', durationSeconds: 5, error: 'out of memory' },
  ],
};

afterEach(() => {
  cleanup();
  authedFetch.mockReset();
});

describe('RestoreCompare', () => {
  it('lists 3 completed models, switching changes the compare source, failed model shows its error', () => {
    render(<RestoreCompare jobId="j1" manifest={manifest} modelNames={{ realesrgan: 'Real-ESRGAN' }} />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    const vc = () => screen.getByTestId('vc');
    expect(vc().getAttribute('data-original')).toMatch(/\/video-restore\/j1\/result\/original\?sid=sid-9$/);
    expect(vc().getAttribute('data-result')).toMatch(/\/result\/realesrgan\?sid=sid-9$/);
    fireEvent.click(screen.getAllByRole('radio')[1]);
    expect(vc().getAttribute('data-result')).toMatch(/\/result\/swinir\?sid=sid-9$/);
    expect(screen.getByText(/hat: out of memory/)).toBeTruthy();
  });
});

describe('fetchVideoRestoreResults', () => {
  it('returns the manifest on 200', async () => {
    authedFetch.mockResolvedValue({ ok: true, status: 200, json: async () => manifest });
    expect(await fetchVideoRestoreResults('j1')).toEqual(manifest);
    expect(authedFetch.mock.calls[0][0]).toMatch(/\/video-restore\/j1\/results$/);
  });
  it('returns null on 404 so the panel falls back to the tarball', async () => {
    authedFetch.mockResolvedValue({ ok: false, status: 404, text: async () => '' });
    expect(await fetchVideoRestoreResults('j1')).toBeNull();
  });
  it('throws on other errors', async () => {
    authedFetch.mockResolvedValue({ ok: false, status: 500, statusText: 'boom', text: async () => '' });
    await expect(fetchVideoRestoreResults('j1')).rejects.toThrow('boom');
  });
});
