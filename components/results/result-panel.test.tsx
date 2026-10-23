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

  it('registry covers every kind that has a viewer', () => {
    expect(Object.keys(RESULT_VIEWERS).sort()).toEqual(['archive', 'audio', 'captions', 'dash', 'gif', 'hls', 'image', 'pdf', 'transcript', 'unknown', 'video']);
  });

  it('emits result_previewed once per job with a coarse kind', () => {
    const d = descriptorFor('image', 'out.png');
    const view = render(<ResultPanel descriptor={d} />);
    view.rerender(<ResultPanel descriptor={d} />);
    const previews = () => track.mock.calls.filter((c) => c[0] === 'result_previewed');
    expect(previews()).toHaveLength(1);
    expect(track).toHaveBeenCalledWith('result_previewed', { job_id: 'job-image', preview_kind: 'image' }, { job_id: 'job-image' });
    view.unmount();
    render(<ResultPanel descriptor={d} />);
    expect(previews()).toHaveLength(1);
  });

  it('emits result_viewed with the surface and result_download_clicked before the download', () => {
    const d = descriptorFor('image', 'out.png');
    render(<ResultPanel descriptor={d} surface="tutorial" onDownload={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Download/ }));
    const calls = track.mock.calls.filter((c) => /^result_(viewed|download)/.test(c[0]));
    expect(calls.map((c) => c[0])).toEqual(['result_viewed', 'result_download_clicked']);
    expect(calls[0][1]).toEqual({ job_id: 'job-image', kind: 'image', surface: 'tutorial', has_original: false });
    expect(calls[1][1]).toEqual({ job_id: 'job-image', kind: 'image', surface: 'tutorial', viewed_first: true });
  });

  it('toggles Original/Result for kinds without a compare view (gif)', async () => {
    const original = new File(['abc'], 'in.gif', { type: 'image/gif' });
    const d = descriptorFor('gif', 'out.gif', original);
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

  describe('compare modes', () => {
    beforeEach(() => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: () => undefined, removeEventListener: () => undefined }) as unknown as typeof window.matchMedia;
      sessionStorage.clear();
    });

    it('image with an original offers wipe / side by side / toggle, wipe first', async () => {
      const d = descriptorFor('image', 'out.png', new File(['abc'], 'in.png', { type: 'image/png' }));
      const onCompareModeChange = vi.fn();
      const { container } = render(<ResultPanel descriptor={d} onCompareModeChange={onCompareModeChange} />);
      const group = screen.getByRole('radiogroup', { name: 'Compare' });
      expect(group.querySelectorAll('input[type="radio"]')).toHaveLength(3);
      await waitFor(() => expect(container.querySelector('[data-compare-mode="wipe"]')).toBeTruthy());
      expect(screen.getByRole('radio', { name: 'Wipe' })).toHaveProperty('checked', true);

      fireEvent.click(screen.getByRole('radio', { name: 'Side by side' }));
      await waitFor(() => expect(container.querySelector('[data-compare-mode="side_by_side"]')).toBeTruthy());
      expect(onCompareModeChange).toHaveBeenCalledWith('image', 'side_by_side');
      expect(sessionStorage.getItem('mm.result.compareMode.image')).toBe('side_by_side');
    });

    it('remembers the mode per kind for the session', async () => {
      sessionStorage.setItem('mm.result.compareMode.image', 'toggle');
      const d = descriptorFor('image', 'out.png', new File(['abc'], 'in.png', { type: 'image/png' }));
      const { container } = render(<ResultPanel descriptor={d} />);
      await waitFor(() => expect(container.querySelector('[data-compare-mode="toggle"]')).toBeTruthy());
    });

    it('shows no Compare control without an original', () => {
      render(<ResultPanel descriptor={descriptorFor('image', 'out.png')} />);
      expect(screen.queryByRole('radiogroup', { name: 'Compare' })).toBeNull();
    });

    it('video defaults to side by side with three modes; audio is a single A/B view', async () => {
      const video = descriptorFor('video', 'out.mp4', new File(['abc'], 'in.mp4', { type: 'video/mp4' }));
      const v = render(<ResultPanel descriptor={video} />);
      expect(screen.getByRole('radiogroup', { name: 'Compare' }).querySelectorAll('input')).toHaveLength(3);
      await waitFor(() => expect(v.container.querySelector('[data-compare-mode="side_by_side"]')).toBeTruthy());
      v.unmount();
      const audio = descriptorFor('audio', 'out.mp3', new File(['abc'], 'in.mp3', { type: 'audio/mpeg' }));
      const a = render(<ResultPanel descriptor={audio} />);
      await waitFor(() => expect(a.container.querySelector('[data-compare-mode="ab"]')).toBeTruthy());
      expect(screen.queryByRole('radiogroup', { name: 'Compare' })).toBeNull();
    });
  });
});
