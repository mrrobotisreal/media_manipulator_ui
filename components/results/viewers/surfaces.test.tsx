import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/components.json';
import panels from '@/i18n/locales/en-us/interface/panels.json';
import { describe as describeResult } from '@/lib/results/describe';
import { resetResultBlobCache } from '@/lib/results/useResultBlob';
import { ResultPanel, resetPreviewedForTests } from '../result-panel';

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string | number>) => {
      const lookup = (root: unknown, path: string) => path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], root);
      const found = lookup(en, key) ?? lookup(panels, key);
      const text = typeof found === 'string' ? found : key;
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(opts?.[k] ?? ''));
    },
    formatDuration: (s: number) => `${s}s`,
    formatFileSize: (n: number) => `${n} B`,
    formatDate: () => 'Oct 24, 2026',
    formatTime: () => '9:00 AM',
  }),
}));
vi.mock('@/lib/analytics', async () => {
  const actual = await vi.importActual<typeof import('@/lib/analytics')>('@/lib/analytics');
  return { ...actual, analytics: { track: vi.fn() }, useToolAnalytics: () => ({ track: vi.fn(), toolSlug: 'x', setMediaKind: () => undefined }) };
});
const SRT = '1\n00:00:01,000 --> 00:00:02,000\nCaption one\n\n2\n00:00:03,000 --> 00:00:04,000\nCaption two\n';
vi.mock('@/lib/useDownloadFile', () => ({
  default: () => ({ downloadFile: async () => new Blob([SRT]) }),
}));
vi.mock('@/lib/results/save', () => ({ saveBlobToDisk: vi.fn() }));
vi.mock('@/lib/useTranscribeResult', () => ({
  useTranscribeResult: () => ({
    isLoading: false,
    isError: false,
    data: {
      format: 'srt', hasAudio: true, hasSpeech: true, segmentCount: 1, outputFile: 'a.srt', startedAt: '', completedAt: '',
      segments: [{ id: 0, start: 1, end: 2, text: 'Spoken words' }],
    },
  }),
  useAnalysisResult: () => ({ isLoading: false, data: null }),
}));

describe('tool surfaces render a cue list after completion', () => {
  beforeEach(() => {
    let n = 0;
    Object.assign(URL, { createObjectURL: vi.fn(() => `blob:fake-${++n}`), revokeObjectURL: vi.fn() });
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => {
    cleanup();
    resetResultBlobCache();
    resetPreviewedForTests();
  });

  const media = new File(['x'], 'talk.mp4', { type: 'video/mp4' });

  it('/tools/transcribe-video (txt transcript, media original seeks)', async () => {
    const d = describeResult({ job: { id: 't1', resultFileName: 'talk_transcript.txt' }, originalFile: media, task: 'transcribe_video', mode: 'transcribe' });
    const { container } = render(<ResultPanel descriptor={d} />);
    await screen.findByText('Spoken words');
    expect(container.querySelector('video')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Jump to/ })).toBeTruthy();
  });

  it('/tools/srt-generator (srt output)', async () => {
    const d = describeResult({ job: { id: 't2', resultFileName: 'talk.srt' }, originalFile: media, task: 'srt_generator', mode: 'transcribe' });
    render(<ResultPanel descriptor={d} />);
    await screen.findByText('Caption one');
    expect(screen.getAllByTestId('caption-row')).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /Jump to/ })).toHaveLength(2);
  });

  it('/tools/caption-translator (two columns against the uploaded srt)', async () => {
    const src = new File([SRT.replace('Caption', 'Legenda')], 'talk.srt');
    const d = describeResult({ job: { id: 't3', resultFileName: 'talk_es.srt' }, originalFile: src, task: 'caption_translator' });
    render(<ResultPanel descriptor={d} />);
    await waitFor(() => expect(screen.getByText('Legenda one')).toBeTruthy());
    expect(screen.getByText('Caption one')).toBeTruthy();
    expect(screen.getAllByTestId('caption-row')).toHaveLength(2);
  });
});
