import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import { describe as describeResult } from '@/lib/results/describe';
import { resetResultBlobCache } from '@/lib/results/useResultBlob';
import { ResultPanel, resetPreviewedForTests } from './result-panel';

const add = vi.hoisted(() => vi.fn(async (_entry: unknown) => undefined));
vi.mock('@/lib/history/localHistory', () => ({ localHistory: { add } }));
vi.mock('@/lib/history/thumbnail', () => ({
  thumbnailable: (k: string) => k === 'image',
  makeThumbnail: vi.fn(async () => new Blob(['t'])),
}));
vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (k: string) => k,
    formatFileSize: (n: number) => `${n} B`,
    formatDate: () => 'd',
    formatTime: () => 't',
  }),
}));
vi.mock('@/lib/analytics', async () => {
  const actual = await vi.importActual<typeof import('@/lib/analytics')>('@/lib/analytics');
  return {
    ...actual,
    analytics: { track: vi.fn() },
    useToolAnalytics: () => ({ track: vi.fn(), toolSlug: 'compress-image', setMediaKind: () => undefined }),
  };
});
vi.mock('@/lib/useDownloadFile', () => ({
  default: () => ({ downloadFile: async () => new Blob(['bytes']) }),
}));
vi.mock('@/lib/results/save', () => ({ saveBlobToDisk: vi.fn() }));
vi.mock('@/components/metadata/metadata-strip', () => ({ MetadataStrip: () => null }));

const descriptor = describeResult({
  job: { id: 'job-rec', resultFileName: 'out.png', resultSizeBytes: 2048, expiresAt: '2026-10-25T09:00:00Z' },
});

describe('ResultPanel history recording', () => {
  beforeEach(() => {
    add.mockClear();
    resetPreviewedForTests();
    resetResultBlobCache();
    Object.assign(URL, { createObjectURL: vi.fn(() => 'blob:x'), revokeObjectURL: vi.fn() });
  });
  afterEach(cleanup);

  it('records metadata once per job on mount, with no bytes', async () => {
    const { rerender } = render(<ResultPanel descriptor={descriptor} />);
    rerender(<ResultPanel descriptor={descriptor} />);
    await waitFor(() => expect(add).toHaveBeenCalled());
    const first = add.mock.calls[0][0] as Record<string, unknown>;
    expect(first).toMatchObject({
      jobId: 'job-rec',
      tool: 'compress-image',
      kind: 'image',
      fileName: 'out.png',
      sizeBytes: 2048,
      expiresAt: Date.parse('2026-10-25T09:00:00Z'),
    });
    expect(Object.keys(first).sort()).toEqual(['createdAt', 'expiresAt', 'fileName', 'jobId', 'kind', 'sizeBytes', 'tool']);
    expect(add.mock.calls.filter(([e]) => (e as { jobId: string }).jobId === 'job-rec' && !(e as { thumbnail?: Blob }).thumbnail)).toHaveLength(1);
  });

  it('does not record from the history surface or when disabled', () => {
    render(<ResultPanel descriptor={{ ...descriptor, jobId: 'job-a' }} surface="history" />);
    render(<ResultPanel descriptor={{ ...descriptor, jobId: 'job-b' }} recordHistory={false} />);
    expect(add).not.toHaveBeenCalled();
  });
});
