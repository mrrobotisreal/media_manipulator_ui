import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/components.json';
import { describe as describeResult } from '@/lib/results/describe';
import { resetResultBlobCache } from '@/lib/results/useResultBlob';
import { ResultPanel, resetPreviewedForTests } from '../result-panel';

vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en);
      return typeof found === 'string' ? found : key;
    },
    formatFileSize: (n: number) => `${n} B`,
    formatDate: () => 'Oct 24, 2026',
    formatTime: () => '9:00 AM',
  }),
}));
vi.mock('@/lib/analytics', async () => {
  const actual = await vi.importActual<typeof import('@/lib/analytics')>('@/lib/analytics');
  return { ...actual, analytics: { track: vi.fn() }, getSessionId: () => 'sid-1', useToolAnalytics: () => ({ track: vi.fn(), toolSlug: 'x', setMediaKind: () => undefined }) };
});
vi.mock('@/lib/useDownloadFile', () => ({ default: () => ({ downloadFile: async () => new Blob(['%PDF-1.4'], { type: 'application/pdf' }) }) }));

describe('PdfViewer', () => {
  beforeEach(() => {
    Object.assign(URL, { createObjectURL: vi.fn(() => 'blob:pdf-1'), revokeObjectURL: vi.fn() });
  });
  afterEach(() => {
    cleanup();
    resetResultBlobCache();
    resetPreviewedForTests();
  });

  it('renders a .pdf result in an <object> with an iframe fallback and an open-in-new-tab link', async () => {
    const d = describeResult({ job: { id: 'p1', resultFileName: 'merged.pdf' }, task: 'jpg_to_pdf' });
    expect(d.kind).toBe('pdf');
    const { container, findByText } = render(<ResultPanel descriptor={d} />);
    const object = await vi.waitFor(() => {
      const el = container.querySelector('object[type="application/pdf"]');
      if (!el) throw new Error('not yet');
      return el;
    });
    expect(object.getAttribute('data')).toBe('blob:pdf-1');
    expect(object.querySelector('iframe')?.getAttribute('src')).toBe('blob:pdf-1');
    const link = await findByText('Open in new tab');
    expect(link.closest('a')?.getAttribute('href')).toBe('blob:pdf-1');
  });

  it('streams from the inline route with ?sid= when the API reports a MIME', async () => {
    const d = describeResult({ job: { id: 'p2', resultFileName: 'scan.pdf', resultMime: 'application/pdf' }, task: 'image_to_pdf' });
    const { container } = render(<ResultPanel descriptor={d} />);
    const object = container.querySelector('object[type="application/pdf"]')!;
    expect(object.getAttribute('data')).toMatch(/\/result\/p2\?sid=sid-1$/);
  });
});

describe('tool pages that produce a pdf, archive or stream no longer fall back to the file card', () => {
  it('registry maps pdf, archive, hls and dash to real viewers', async () => {
    const { viewerFor } = await import('./index');
    const { UnknownViewer } = await import('./unknown-viewer');
    for (const kind of ['pdf', 'archive', 'hls', 'dash'] as const) {
      expect(viewerFor(kind).component).not.toBe(UnknownViewer);
    }
  });

  it('every pdf converter task decides kind pdf', () => {
    for (const task of ['image_to_pdf', 'jpg_to_pdf', 'png_to_pdf']) {
      expect(describeResult({ job: { id: 'x', resultFileName: 'o.pdf' }, task }).kind).toBe('pdf');
    }
  });
});
