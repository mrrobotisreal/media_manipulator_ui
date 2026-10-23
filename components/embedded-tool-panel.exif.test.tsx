import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import en from '@/i18n/locales/en-us/interface/metadata.json';
import { photoDocument } from './metadata/test-utils';

const h = vi.hoisted(() => ({
  convert: vi.fn(),
  formProps: [] as Array<Record<string, unknown>>,
  job: null as null | Record<string, unknown>,
  onUpload: null as null | ((r: { jobId: string }) => void),
}));

vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<unknown>) => {
    const src = String(loader);
    if (src.includes('image-conversion-form')) {
      const FormStub = (props: Record<string, unknown>) => {
        h.formProps.push(props);
        const presets = props.presets as { defaultMetadataMode?: string } | undefined;
        return <div data-testid="image-form" data-metadata-mode={presets?.defaultMetadataMode ?? 'keep'} />;
      };
      return FormStub;
    }
    const Null = () => null;
    if (src.includes('metadata-diff-modal')) {
      const Modal = () => <div data-testid="diff-modal" />;
      return Modal;
    }
    return Null;
  },
}));
vi.mock('next/link', () => ({ default: ({ children }: { children: React.ReactNode }) => <a>{children}</a> }));
vi.mock('@/i18n/useLocalization', () => ({
  useLocalization: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      const found = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], { metadata: en.metadata });
      let text = typeof found === 'string' ? found : (found === undefined && typeof opts?.count === 'number'
        ? (key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], { metadata: en.metadata }) as string | undefined)
        : undefined) ?? key;
      if (key === 'metadata.strip.removedCount') text = opts?.count === 1 ? 'Removed {{count}} tag' : 'Removed {{count}} tags';
      return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(opts?.[k] ?? ''));
    },
    formatFileSize: (n: number) => `${n} B`,
    formatDate: () => '',
    formatTime: () => '',
    language: { code: 'en-US' },
  }),
}));
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('@/lib/auth/AuthProvider', () => ({ useAuth: () => null }));
vi.mock('@/components/account/upgrade-surfaces', () => ({ UploadLimitHint: () => null, useUpgradeNudge: () => () => undefined }));
vi.mock('@/lib/analytics', () => ({
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
  normalizeMediaKind: (k: string) => k,
  safeFileExtension: (n: string) => n.slice(n.lastIndexOf('.')),
  ToolAnalyticsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  trackFileChoice: () => undefined,
  useToolAnalytics: () => ({ track: () => undefined, setMediaKind: () => undefined }),
}));
vi.mock('@/lib/useConvertFile', () => ({
  default: (onUpload: (r: { jobId: string }) => void) => {
    h.onUpload = onUpload;
    return { mutate: h.convert, isPending: false, uploadProgress: 0 };
  },
}));
vi.mock('@/lib/useTranscribeFile', () => ({ default: () => ({ mutate: vi.fn(), isPending: false, uploadProgress: 0 }) }));
vi.mock('@/lib/useGetJobStatus', () => ({ default: (job: unknown) => ({ data: job ? h.job ?? undefined : undefined }) }));
vi.mock('@/components/results/result-panel', () => ({
  ResultPanel: (p: { metadataStrip?: boolean }) => <div data-testid="result-panel" data-strip={String(p.metadataStrip)} />,
}));
vi.mock('@/components/metadata/metadata-inspector-lazy', () => ({
  LazyMetadataInspector: (p: { document: { file: { name: string } }; status?: string; onStripAll?: () => void; stripDisabled?: boolean; stripLabel?: string; surface: string }) => (
    <div data-testid="inspector" data-surface={p.surface} data-status={p.status}>
      {p.onStripAll ? (
        <button type="button" disabled={p.stripDisabled} onClick={p.onStripAll}>{p.stripLabel}</button>
      ) : null}
    </div>
  ),
}));
const diff = { removed: [{ id: 'GPS:GPSLatitude', group: 'GPS', tag: 'GPSLatitude', value: '1', category: 'gps', privacy: 'location' }], added: [], changed: [], unchanged: 3, byCategory: {} };
vi.mock('@/components/metadata/use-metadata-data', () => ({
  useMetadataInspect: () => ({ data: photoDocument(), status: 'ready', error: null }),
  useJobMetadata: () => ({ data: photoDocument(), status: 'ready', error: null }),
  useJobMetadataDiff: () => ({ data: diff, status: 'ready', error: null }),
  useJobBinaryUrls: () => () => null,
}));
vi.mock('@/components/metadata/metadata-diff-modal', () => ({ MetadataDiffModal: () => <div data-testid="diff-modal" /> }));

import EmbeddedToolPanel from './embedded-tool-panel';

beforeEach(() => {
  h.convert.mockReset();
  h.formProps.length = 0;
  h.job = null;
  Object.assign(URL, { createObjectURL: vi.fn(() => 'blob:x'), revokeObjectURL: vi.fn() });
});
afterEach(cleanup);

const pick = (name = 'trip.heic') => {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  const file = new File(['abc'], name, { type: 'image/heic' });
  fireEvent.change(input, { target: { files: [file] } });
  return file;
};

describe('EXIF page flow (remove_metadata)', () => {
  it('shows the inspector above the form with the form preset to strip, and Strip everything submits strip', async () => {
    render(<EmbeddedToolPanel toolSlug="remove-exif-metadata" defaultMediaKind="image" defaultTask="remove_metadata" />);
    const file = pick('trip.png');
    const inspector = await screen.findByTestId('inspector');
    const form = await screen.findByTestId('image-form');
    expect(inspector.getAttribute('data-surface')).toBe('tool_page');
    expect(inspector.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(form.getAttribute('data-metadata-mode')).toBe('strip');

    fireEvent.click(screen.getByRole('button', { name: 'Strip everything' }));
    expect(h.convert).toHaveBeenCalledTimes(1);
    const arg = h.convert.mock.calls[0][0];
    expect(arg.file).toBe(file);
    expect(arg.options.metadataMode).toBe('strip');
    expect(arg.options.format).toBe('png');
  });

  it('falls back to jpg for containers the converter cannot write', async () => {
    render(<EmbeddedToolPanel toolSlug="remove-exif-metadata" defaultMediaKind="image" defaultTask="remove_metadata" />);
    pick('trip.heic');
    fireEvent.click(await screen.findByRole('button', { name: 'Strip everything' }));
    expect(h.convert.mock.calls[0][0].options.format).toBe('jpg');
  });

  it('on completion shows the result inspector, the removed count with location, and Compare', async () => {
    render(<EmbeddedToolPanel toolSlug="remove-exif-metadata" defaultMediaKind="image" defaultTask="remove_metadata" />);
    pick('trip.jpg');
    h.job = { id: 'j1', status: 'completed', resultFileName: 'trip.jpg', strippedCount: 143, metadataAvailable: { original: true, result: true } };
    fireEvent.click(await screen.findByRole('button', { name: 'Strip everything' }));
    act(() => h.onUpload?.({ jobId: 'j1' }));
    const removed = await screen.findByTestId('exif-removed');
    expect(removed.textContent).toBe('Removed 143 tags including location');
    expect(screen.getByTestId('result-panel').getAttribute('data-strip')).toBe('false');
    expect(screen.getAllByTestId('inspector').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Compare' }));
    await waitFor(() => expect(screen.getByTestId('diff-modal')).toBeTruthy());
  });

  it('does nothing extra on other tools', async () => {
    render(<EmbeddedToolPanel toolSlug="compress-image" defaultMediaKind="image" defaultTask="compress_image" />);
    pick('a.png');
    await screen.findByTestId('image-form');
    expect(screen.queryByTestId('inspector')).toBeNull();
    expect(screen.getByTestId('image-form').getAttribute('data-metadata-mode')).toBe('keep');
  });
});
