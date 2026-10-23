import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { gzipSync, strToU8 } from 'fflate';
import en from '@/i18n/locales/en-us/interface/components.json';
import { describe as describeResult } from '@/lib/results/describe';
import { writeTar } from '@/lib/results/archive/testTar';
import { resetResultBlobCache } from '@/lib/results/useResultBlob';
import type { TranscodeProbeResponse } from '@/lib/transcodeTypes';
import { ResultPanel, resetPreviewedForTests } from '../result-panel';

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string | number>) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(opts?.[k] ?? ''));
    },
    formatFileSize: (n: number) => `${n} B`,
    formatDate: () => 'Oct 24, 2026',
    formatTime: () => '9:00 AM',
  }),
}));
vi.mock('@/lib/analytics', async () => {
  const actual = await vi.importActual<typeof import('@/lib/analytics')>('@/lib/analytics');
  return { ...actual, analytics: { track: vi.fn() }, useToolAnalytics: () => ({ track: vi.fn(), toolSlug: 'x', setMediaKind: () => undefined }) };
});
const downloadFile = vi.fn();
vi.mock('@/lib/useDownloadFile', () => ({ default: () => ({ downloadFile }) }));
vi.mock('@/lib/results/save', () => ({ saveBlobToDisk: vi.fn() }));

const hlsState = vi.hoisted(() => ({
  instance: null as null | { currentLevel: number; handlers: Record<string, (...a: unknown[]) => void>; loadSource: ReturnType<typeof vi.fn>; destroy: ReturnType<typeof vi.fn>; levels: Array<{ height: number; bitrate: number }> },
}));
vi.mock('hls.js', () => {
  class FakeHls {
    static isSupported() { return true; }
    static Events = { MANIFEST_PARSED: 'manifestParsed', ERROR: 'hlsError' };
    static DefaultConfig = { loader: class {} };
    currentLevel = -1;
    handlers: Record<string, (...a: unknown[]) => void> = {};
    levels = [{ height: 360, bitrate: 900000 }, { height: 720, bitrate: 2800000 }];
    loadSource = vi.fn();
    attachMedia = vi.fn();
    destroy = vi.fn();
    constructor(public config: unknown) {
      hlsState.instance = this;
    }
    on(event: string, cb: (...a: unknown[]) => void) { this.handlers[event] = cb; }
  }
  return { default: FakeHls };
});
const dashImported = vi.hoisted(() => ({ count: 0 }));
vi.mock('dashjs', () => {
  dashImported.count += 1;
  return { MediaPlayer: () => ({ create: () => ({ addRequestInterceptor: vi.fn(), on: vi.fn(), initialize: vi.fn(), destroy: vi.fn(), getRepresentationsByType: () => [], updateSettings: vi.fn(), setRepresentationForTypeById: vi.fn() }) }) };
});

const bundle = (name: string, files: Array<{ path: string; data: string }>) =>
  new Blob([gzipSync(writeTar(files.map((f) => ({ path: f.path, data: strToU8(f.data) })))) as BlobPart], { type: 'application/gzip' });

const probe: TranscodeProbeResponse = {
  s3Key: 'k', bucket: 'b', fileName: 'in.mp4', contentType: 'video/mp4', fileSizeBytes: 1000, width: 1280, height: 720,
  maxQualityLabel: '720p', durationSeconds: 61, fps: 30, hasAudio: true, selectableRungs: [], disabledRungs: [],
};

describe('StreamViewer', () => {
  beforeEach(() => {
    let n = 0;
    Object.assign(URL, { createObjectURL: vi.fn(() => `blob:fake-${++n}`), revokeObjectURL: vi.fn() });
    HTMLMediaElement.prototype.load = vi.fn();
    hlsState.instance = null;
    dashImported.count = 0;
  });
  afterEach(() => {
    cleanup();
    resetResultBlobCache();
    resetPreviewedForTests();
    vi.clearAllMocks();
  });

  const hlsDescriptor = (id: string, withProbe = true) =>
    describeResult({ job: { id, resultFileName: 'hls-package.tar.gz', resultSizeBytes: 5000 }, task: 'transcode_to_hls', mode: 'transcode', probe: withProbe ? probe : undefined });

  it('hls: levels populate the rung selector; selecting a rung sets currentLevel; callback fires', async () => {
    downloadFile.mockResolvedValue(bundle('h', [{ path: 'pkg/hls/master.m3u8', data: '#EXTM3U\n' }, { path: 'pkg/hls/720p/index.m3u8', data: '#EXTM3U\n' }]));
    const onRungSelect = vi.fn();
    const { Viewer } = { Viewer: (await import('./stream-viewer')).StreamViewer };
    const d = hlsDescriptor('s1');
    render(<Viewer role="result" kind="hls" src={null} blob={null} fileName={d.fileName} mime={d.mime} sizeBytes={d.sizeBytes} descriptor={d} onRungSelect={onRungSelect} />);
    await waitFor(() => expect(hlsState.instance).not.toBeNull());
    expect(hlsState.instance!.loadSource).toHaveBeenCalledWith(expect.stringContaining('pkg/hls/master.m3u8'));
    act(() => hlsState.instance!.handlers['manifestParsed']());
    const radio = await screen.findByRole('radio', { name: /720p, 2800 kbps/ });
    expect(screen.getByRole('radio', { name: /360p/ })).toBeTruthy();
    fireEvent.click(radio);
    expect(hlsState.instance!.currentLevel).toBe(1);
    expect(onRungSelect).toHaveBeenCalledWith('720p');
    fireEvent.click(screen.getByRole('radio', { name: 'Auto' }));
    expect(hlsState.instance!.currentLevel).toBe(-1);
    expect(dashImported.count).toBe(0);
  });

  it('transcode-to-hls through ResultPanel renders the stream viewer', async () => {
    downloadFile.mockResolvedValue(bundle('h', [{ path: 'pkg/hls/master.m3u8', data: '#EXTM3U\n' }]));
    render(<ResultPanel descriptor={hlsDescriptor('s2')} />);
    expect(await screen.findByTestId('stream-viewer')).toBeTruthy();
    expect(dashImported.count).toBe(0);
  });

  it('a fatal hls error shows the transcode report', async () => {
    downloadFile.mockResolvedValue(bundle('h', [{ path: 'pkg/hls/master.m3u8', data: '#EXTM3U\n' }]));
    render(<ResultPanel descriptor={hlsDescriptor('s3')} />);
    await waitFor(() => expect(hlsState.instance).not.toBeNull());
    act(() => hlsState.instance!.handlers['hlsError']('hlsError', { fatal: true }));
    expect(await screen.findByTestId('stream-report')).toBeTruthy();
    expect(screen.getByText('1280×720')).toBeTruthy();
  });

  it('a non-fatal hls error keeps playing', async () => {
    downloadFile.mockResolvedValue(bundle('h', [{ path: 'pkg/hls/master.m3u8', data: '#EXTM3U\n' }]));
    render(<ResultPanel descriptor={hlsDescriptor('s4')} />);
    await waitFor(() => expect(hlsState.instance).not.toBeNull());
    act(() => hlsState.instance!.handlers['hlsError']('hlsError', { fatal: false }));
    expect(screen.queryByTestId('stream-report')).toBeNull();
  });

  it('over the cap: report only, nothing fetched', async () => {
    const d = describeResult({ job: { id: 's5', resultFileName: 'hls-package.tar.gz', resultSizeBytes: 300 * 1024 * 1024 + 1 }, task: 'transcode_to_hls', mode: 'transcode', probe });
    render(<ResultPanel descriptor={d} />);
    expect(await screen.findByTestId('stream-report')).toBeTruthy();
    expect(downloadFile).not.toHaveBeenCalled();
  });

  it('dash: imports dashjs; an AV1 manifest without decoder support shows the report', async () => {
    const mpd = '<MPD><Representation codecs="av01.0.05M.08"/></MPD>';
    downloadFile.mockResolvedValue(bundle('d', [{ path: 'pkg/dash/manifest.mpd', data: mpd }]));
    vi.stubGlobal('MediaSource', { isTypeSupported: () => false });
    const d = describeResult({ job: { id: 's6', resultFileName: 'dash-package.tar.gz', resultSizeBytes: 5000 }, task: 'transcode_to_dash', mode: 'transcode', probe });
    expect(d.kind).toBe('dash');
    render(<ResultPanel descriptor={d} />);
    expect(await screen.findByTestId('stream-report')).toBeTruthy();
    expect(screen.getByText(/cannot decode AV1/)).toBeTruthy();
    vi.unstubAllGlobals();
  });

  it('dash: a playable manifest imports dashjs', async () => {
    downloadFile.mockResolvedValue(bundle('d', [{ path: 'pkg/dash/manifest.mpd', data: '<MPD/>' }]));
    const d = describeResult({ job: { id: 's7', resultFileName: 'dash-package.tar.gz', resultSizeBytes: 5000 }, task: 'transcode_to_dash', mode: 'transcode' });
    render(<ResultPanel descriptor={d} />);
    await screen.findByTestId('stream-viewer');
    await waitFor(() => expect(dashImported.count).toBe(1));
  });
});
