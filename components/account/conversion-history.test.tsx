import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/i18n/useLocalization', async () => {
  const m = await import('@/components/metadata/test-utils');
  return { useLocalization: () => Object.assign(m.mockLocalization(), { formatDate: (d: string) => d }) };
});
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => 'tok' }));
vi.mock('@/lib/i18n/ensureShard', async () => (await import('@/components/metadata/test-utils')).ensureShardMock());
vi.mock('next/dynamic', async () => {
  // Resolve the dynamic import in jsdom by wrapping the lazy module in a Suspense component.
  const React = await import('react');
  return {
    default: (loader: () => Promise<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const Lazy = React.lazy(async () => {
        const mod = await loader();
        return { default: mod.default ?? Object.values(mod)[0] };
      });
      const Wrapped = (props: Record<string, unknown>) => (
        <React.Suspense fallback={null}>
          <Lazy {...props} />
        </React.Suspense>
      );
      return Wrapped;
    },
  };
});

const hooks = vi.hoisted(() => ({ result: { data: undefined as unknown, status: 'loading' as string, error: null as unknown } }));
vi.mock('@/components/metadata/use-metadata-data', () => ({
  useJobMetadata: (_id: string, side: string) => ({ ...hooks.result, side }),
  useJobBinaryUrls: () => () => null,
  useJobMetadataDiff: () => ({ data: undefined, status: 'loading', error: null }),
}));
vi.mock('@/components/metadata/metadata-inspector-lazy', () => ({
  LazyMetadataInspector: ({ fileName }: { fileName?: string }) => <div data-testid="inspector">{fileName ?? 'doc'}</div>,
}));
vi.mock('@/lib/metadata/useMetadataAnalytics', () => ({ useMetadataAnalytics: () => ({ onEvent: vi.fn(), onDiffEvent: vi.fn() }) }));
vi.mock('@/lib/auth/accountApi', async (orig) => ({ ...(await orig<typeof import('@/lib/auth/accountApi')>()), fetchHistory: vi.fn() }));

import { fetchHistory } from '@/lib/auth/accountApi';
import { MetadataApiError } from '@/lib/metadata/api';
import { ConversionHistory, type HistoryLabels } from './conversion-history';

const labels: HistoryLabels = {
  title: 'History', loading: 'l', empty: 'e', emptyCta: 'c', loadFailed: 'f', download: 'Download', expired: 'Expired',
  loadMore: 'More', showing: '{{count}}/{{total}}', tool: {}, status: {},
};
const row = (jobId: string, extra: object = {}) => ({
  jobId, status: 'completed', createdAt: '2026-10-01T00:00:00Z', expired: false, ...extra,
});

function renderHistory(entries: object[]) {
  vi.mocked(fetchHistory).mockResolvedValue({ entries, total: entries.length, limit: 20, offset: 0 } as never);
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <ConversionHistory labels={labels} uid="u1" />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  hooks.result = { data: undefined, status: 'loading', error: null };
});

describe('ConversionHistory metadata affordance', () => {
  it('shows Metadata only for rows with a cached report, and opens the dialog', async () => {
    hooks.result = { data: { schemaVersion: 1, file: { name: 'a', sizeBytes: 1, mime: '', kind: 'image' }, tools: [], entries: [], warnings: [] }, status: 'ready', error: null };
    renderHistory([row('with', { metadataAvailable: { original: false, result: true } }), row('without')]);
    const buttons = await screen.findAllByTestId('history-metadata-button');
    expect(buttons).toHaveLength(1);
    fireEvent.click(buttons[0]);
    expect(await screen.findByTestId('inspector')).toBeTruthy();
  });

  it('still works for an expired row', async () => {
    hooks.result = { data: { schemaVersion: 1, file: { name: 'a', sizeBytes: 1, mime: '', kind: 'image' }, tools: [], entries: [], warnings: [] }, status: 'ready', error: null };
    renderHistory([row('old', { expired: true, metadataAvailable: { original: true, result: true } })]);
    expect(screen.queryByText('Download')).toBeNull();
    fireEvent.click(await screen.findByTestId('history-metadata-button'));
    expect(await screen.findByTestId('inspector')).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Original' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Compare' })).toBeTruthy();
  });

  it('shows an empty state, not an error, on 404', async () => {
    hooks.result = { data: undefined, status: 'error', error: new MetadataApiError(404, 'gone') };
    renderHistory([row('swept', { expired: true, metadataAvailable: { original: false, result: true } })]);
    fireEvent.click(await screen.findByTestId('history-metadata-button'));
    await waitFor(() => expect(screen.getByTestId('history-metadata-gone').textContent).toBe('Metadata no longer available'));
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
