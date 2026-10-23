import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/components.json';
import { describe as describeResult, type ResultKind } from '@/lib/results/describe';
import { resetResultBlobCache } from '@/lib/results/useResultBlob';
import { ResultPanel, resetPreviewedForTests } from './result-panel';
import { RESULT_VIEWERS } from './viewers';

const track = vi.fn();

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string>) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => opts?.[k] ?? '');
    },
    formatFileSize: (n: number) => `${n} B`,
    formatDate: () => 'Oct 24, 2026',
    formatTime: () => '9:00 AM',
  }),
}));
vi.mock('@/lib/analytics', async () => {
  const actual = await vi.importActual<typeof import('@/lib/analytics')>('@/lib/analytics');
  return {
    ...actual,
    analytics: { track: vi.fn() },
    useToolAnalytics: () => ({ track, toolSlug: 'x', setMediaKind: () => undefined }),
  };
});
vi.mock('@/lib/useDownloadFile', () => ({
  default: () => ({ downloadFile: async () => new Blob(['bytes'], { type: 'application/octet-stream' }) }),
}));
vi.mock('@/lib/results/save', () => ({ saveBlobToDisk: vi.fn() }));

const FILES: Array<[ResultKind, string]> = [
  ['image', 'out.png'],
  ['gif', 'out.gif'],
  ['video', 'out.mp4'],
  ['audio', 'out.mp3'],
  ['unknown', 'out.xyz'],
  // Kinds without a viewer yet fall back to the file card.
  ['pdf', 'out.pdf'],
  ['archive', 'out.zip'],
  ['hls', 'out.tar.gz'],
  ['dash', 'out.tar.gz'],
];

const descriptorFor = (kind: ResultKind, fileName: string, original?: File) =>
  describeResult({
    job: { id: `job-${kind}`, resultFileName: fileName, resultSizeBytes: 2048, expiresAt: '2026-10-24T09:00:00Z' },
    originalFile: original,
    mode: kind === 'transcript' ? 'transcribe' : kind === 'hls' ? 'transcode' : kind === 'dash' ? 'transcode' : 'convert',
    task: kind === 'dash' ? 'transcode_to_dash' : undefined,
  });

describe('ResultPanel', () => {
  beforeEach(() => {
    let n = 0;
    Object.assign(URL, { createObjectURL: vi.fn(() => `blob:fake-${++n}`), revokeObjectURL: vi.fn() });
    HTMLMediaElement.prototype.load = vi.fn();
    track.mockClear();
  });
  afterEach(() => {
    cleanup();
    resetResultBlobCache();
    resetPreviewedForTests();
  });

  it.each(FILES)('%s (%s) renders its viewer and header', async (kind, fileName) => {
    const d = descriptorFor(kind, fileName);
    expect(d.kind).toBe(kind);
    const { container } = render(<ResultPanel descriptor={d} />);

    expect(screen.getAllByText(fileName).length).toBeGreaterThan(0);
    expect(screen.getByText(/Keeps until/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Download/ })).toBeTruthy();

    await waitFor(() => expect(screen.queryByRole('status')).toBeNull());
    const stage = container.querySelector('[data-testid="result-stage"]')!;
    switch (kind) {
      case 'image':
        expect(stage.querySelector('img')?.getAttribute('src')).toMatch(/^blob:/);
        expect(screen.getByRole('radiogroup', { name: 'Zoom' })).toBeTruthy();
        break;
      case 'gif':
        expect(stage.querySelector('img')?.getAttribute('src')).toMatch(/^blob:/);
        break;
      case 'video': {
        const video = stage.querySelector('video')!;
        expect(video.hasAttribute('controls')).toBe(true);
        expect(video.getAttribute('src')).toMatch(/^blob:/);
        break;
      }
      case 'audio':
        expect(stage.querySelector('audio')?.hasAttribute('controls')).toBe(true);
        expect(stage.querySelector('canvas')).toBeTruthy();
        break;
      default:
        expect(stage.textContent).toContain(fileName);
        expect(stage.textContent).toContain('no in-browser preview');
    }
  });

  it('registry covers the core kinds and leaves the MM04 kinds to the fallback', () => {
    expect(Object.keys(RESULT_VIEWERS).sort()).toEqual(['audio', 'captions', 'gif', 'image', 'transcript', 'unknown', 'video']);
  });

  it('emits result_previewed once per job with a coarse kind', () => {
    const d = descriptorFor('image', 'out.png');
    const view = render(<ResultPanel descriptor={d} />);
    view.rerender(<ResultPanel descriptor={d} />);
    expect(track).toHaveBeenCalledTimes(1);
    expect(track).toHaveBeenCalledWith('result_previewed', { job_id: 'job-image', preview_kind: 'image' }, { job_id: 'job-image' });
    view.unmount();
    render(<ResultPanel descriptor={d} />);
    expect(track).toHaveBeenCalledTimes(1);
  });

  it('toggles Original/Result when an original exists and plays each side', async () => {
    const original = new File(['abc'], 'in.png', { type: 'image/png' });
    const d = descriptorFor('image', 'out.png', original);
    const { container } = render(<ResultPanel descriptor={d} />);
    await waitFor(() => expect(container.querySelector('img')).toBeTruthy());
    const resultSrc = container.querySelector('img')!.getAttribute('src');

    fireEvent.click(screen.getByRole('radio', { name: 'Original' }));
    await waitFor(() => expect(container.querySelector('[data-view="original"]')).toBeTruthy());
    const originalSrc = container.querySelector('img')!.getAttribute('src');
    expect(originalSrc).toMatch(/^blob:/);
    expect(originalSrc).not.toBe(resultSrc);

    fireEvent.click(screen.getByRole('radio', { name: 'Result' }));
    await waitFor(() => expect(container.querySelector('[data-view="result"]')).toBeTruthy());
  });

  it('offers no toggle without an original', () => {
    render(<ResultPanel descriptor={descriptorFor('image', 'out.png')} />);
    expect(screen.queryByRole('radiogroup', { name: 'Compare' })).toBeNull();
  });

  it('shows Run another only when asked', () => {
    const onRunAnother = vi.fn();
    render(<ResultPanel descriptor={descriptorFor('unknown', 'out.xyz')} onRunAnother={onRunAnother} />);
    fireEvent.click(screen.getByRole('button', { name: /Run another/ }));
    expect(onRunAnother).toHaveBeenCalled();
  });

  it('modal variant renders inside a dialog and nothing when closed', () => {
    const d = descriptorFor('unknown', 'out.xyz');
    const view = render(<ResultPanel descriptor={d} variant="modal" open onOpenChange={() => undefined} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    view.rerender(<ResultPanel descriptor={d} variant="modal" open={false} onOpenChange={() => undefined} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
