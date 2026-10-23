import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { strToU8, zipSync } from 'fflate';
import en from '@/i18n/locales/en-us/interface/components.json';
import { describe as describeResult } from '@/lib/results/describe';
import { resetResultBlobCache } from '@/lib/results/useResultBlob';
import { ResultPanel, resetPreviewedForTests } from '../result-panel';

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, string | number>) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
      const archive = en.resultPanel.archive as Record<string, string>;
      const plural = opts?.count !== undefined ? archive[`${key.split('.').pop()}_${opts.count === 1 ? 'one' : 'other'}`] : undefined;
      const text = typeof plural === 'string' ? plural : typeof found === 'string' ? found : key;
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
const downloadFile = vi.fn();
vi.mock('@/lib/useDownloadFile', () => ({ default: () => ({ downloadFile }) }));
vi.mock('@/lib/results/save', () => ({ saveBlobToDisk: vi.fn() }));

const zip = zipSync({
  'frames/f1.png': strToU8('a'),
  'frames/f2.png': strToU8('b'),
  'frames/f3.png': strToU8('c'),
  'notes.txt': strToU8('n'),
});

describe('ArchiveViewer', () => {
  beforeEach(() => {
    let n = 0;
    Object.assign(URL, { createObjectURL: vi.fn(() => `blob:fake-${++n}`), revokeObjectURL: vi.fn() });
    downloadFile.mockResolvedValue(new Blob([zip as BlobPart], { type: 'application/zip' }));
  });
  afterEach(() => {
    cleanup();
    resetResultBlobCache();
    resetPreviewedForTests();
    vi.clearAllMocks();
  });

  it('extract-frames-from-video: a zip of frames lists entries and downloads one', async () => {
    const d = describeResult({ job: { id: 'a1', resultFileName: 'clip_frames.zip' }, task: 'extract_frames' });
    expect(d.kind).toBe('archive');
    const { container } = render(<ResultPanel descriptor={d} />);
    await screen.findByTestId('archive-viewer');
    // 3 of 4 files are images: the gallery is the default view
    expect(container.querySelectorAll('[data-testid="gallery-cell"]').length).toBe(3);
    fireEvent.click(screen.getByRole('button', { name: 'List' }));
    fireEvent.click(screen.getByRole('button', { name: /frames/ }));
    await waitFor(() => expect(screen.getByText('f1.png')).toBeTruthy());
    expect(screen.getByText('notes.txt')).toBeTruthy();
  });

  it('pdf-to-image all pages: _pages.zip renders the archive viewer, not the file card', async () => {
    const d = describeResult({ job: { id: 'a2', resultFileName: 'doc_pages.zip' }, task: 'pdf_to_image' });
    expect(d.kind).toBe('archive');
    render(<ResultPanel descriptor={d} />);
    expect(await screen.findByTestId('archive-viewer')).toBeTruthy();
  });

  it('shows the file card and never reads the bytes when over the cap', async () => {
    const d = describeResult({ job: { id: 'a3', resultFileName: 'huge.zip', resultSizeBytes: 300 * 1024 * 1024 + 1 } });
    render(<ResultPanel descriptor={d} />);
    expect(await screen.findByTestId('archive-fallback')).toBeTruthy();
    expect(screen.getAllByText(/Too large to preview in the browser/).length).toBeGreaterThan(0);
    expect(downloadFile).not.toHaveBeenCalled();
  });

  it('falls back for a non-archive', async () => {
    downloadFile.mockResolvedValue(new Blob(['plain text']));
    const d = describeResult({ job: { id: 'a4', resultFileName: 'x.zip' } });
    render(<ResultPanel descriptor={d} />);
    expect(await screen.findByTestId('archive-fallback')).toBeTruthy();
  });
});
