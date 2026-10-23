import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/i18n/useLocalization', async () => (await import('@/components/account/test-utils')).localizationMock());
vi.mock('@/i18n/useLocalizedHref', () => ({ useLocalizedHref: () => (p: string) => p }));
vi.mock('@/lib/firebase', () => ({ getCurrentIdToken: async () => 'tok' }));
vi.mock('@/lib/i18n/ensureShard', async () => (await import('@/components/metadata/test-utils')).ensureShardMock());
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@/components/results/result-panel', () => ({
  ResultPanel: (p: { descriptor: { jobId: string; fileName: string }; open?: boolean }) =>
    p.open ? <div data-testid="result-panel">{p.descriptor.jobId}:{p.descriptor.fileName}</div> : null,
}));
vi.mock('next/dynamic', async () => {
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

const track = vi.hoisted(() => vi.fn());
vi.mock('@/lib/analytics/client', () => ({ analytics: { track } }));

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
vi.mock('@/lib/auth/accountApi', async (orig) => ({
  ...(await orig<typeof import('@/lib/auth/accountApi')>()),
  fetchHistory: vi.fn(),
  deleteJob: vi.fn(),
  keepJobLonger: vi.fn(),
}));

import { deleteJob, fetchHistory, keepJobLonger } from '@/lib/auth/accountApi';
import { MetadataApiError } from '@/lib/metadata/api';
import { HistoryTab } from './history-tab';
import { copy, row } from '@/components/account/test-utils';

const DAY = 86_400_000;
const inDays = (n: number) => new Date(Date.now() + n * DAY).toISOString();

function renderHistory(entries: object[]) {
  vi.mocked(fetchHistory).mockResolvedValue({ entries, total: entries.length, limit: 20, offset: 0 } as never);
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <HistoryTab copy={copy} uid="u1" />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  track.mockClear();
  vi.mocked(deleteJob).mockReset();
  vi.mocked(keepJobLonger).mockReset();
});
afterEach(() => {
  cleanup();
  hooks.result = { data: undefined, status: 'loading', error: null };
});

describe('HistoryTab metadata affordance', () => {
  it('shows Metadata only for rows with a cached report, and opens the dialog', async () => {
    hooks.result = { data: { schemaVersion: 1, file: { name: 'a', sizeBytes: 1, mime: '', kind: 'image' }, tools: [], entries: [], warnings: [] }, status: 'ready', error: null };
    renderHistory([row('with', { metadataAvailable: { original: false, result: true } }), row('without')]);
    const buttons = await screen.findAllByTestId('history-metadata-button');
    expect(buttons).toHaveLength(1);
    fireEvent.click(buttons[0]);
    expect(await screen.findByTestId('inspector')).toBeTruthy();
  });

  it('still works for an expired row, which offers no Download or Preview', async () => {
    hooks.result = { data: { schemaVersion: 1, file: { name: 'a', sizeBytes: 1, mime: '', kind: 'image' }, tools: [], entries: [], warnings: [] }, status: 'ready', error: null };
    renderHistory([row('old', { expired: true, metadataAvailable: { original: true, result: true } })]);
    expect(screen.queryByText('Download')).toBeNull();
    expect(screen.queryByText('Preview')).toBeNull();
    fireEvent.click(await screen.findByTestId('history-metadata-button'));
    expect(await screen.findByTestId('inspector')).toBeTruthy();
  });

  it('shows an empty state, not an error, on 404', async () => {
    hooks.result = { data: undefined, status: 'error', error: new MetadataApiError(404, 'gone') };
    renderHistory([row('swept', { expired: true, metadataAvailable: { original: false, result: true } })]);
    fireEvent.click(await screen.findByTestId('history-metadata-button'));
    await waitFor(() => expect(screen.getByTestId('history-metadata-gone').textContent).toBe('Metadata no longer available'));
  });
});

describe('HistoryTab rows', () => {
  it('shows "Deletes on" from deletesOn, and Kept longer', async () => {
    renderHistory([row('a', { deletesOn: inDays(11), keptLonger: true, retainedObjectId: 'r1', downloadPath: '/x' })]);
    const line = await screen.findByText(/Deletes on/);
    expect(line.textContent).toMatch(/Deletes on .*11 days/);
    expect(line.textContent).toContain('Kept longer');
    expect(line.getAttribute('title')).toBeTruthy();
  });

  it('expired rows say Expired and offer only Delete record (and Metadata)', async () => {
    renderHistory([row('old', { expired: true, deletesOn: inDays(-1) })]);
    expect(await screen.findByText('Delete record')).toBeTruthy();
    expect(screen.queryByText('Keep longer')).toBeNull();
    expect(screen.queryByText('Delete now')).toBeNull();
    expect(screen.queryByText(/Deletes on/)).toBeNull();
  });

  it('Preview opens the ResultPanel for that job', async () => {
    renderHistory([row('j9', { resultFileName: 'out.mp4', downloadPath: '/download/j9' })]);
    fireEvent.click(await screen.findByRole('button', { name: 'Preview' }));
    expect((await screen.findByTestId('result-panel')).textContent).toBe('j9:out.mp4');
  });

  it('emits history_item_reopened (kind and age bucket only) on Preview and Download, never on render', async () => {
    renderHistory([row('j9', { mediaKind: 'video', createdAt: new Date(Date.now() - 40 * DAY).toISOString(), resultFileName: 'out.mp4', downloadPath: '/download/j9' })]);
    fireEvent.click(await screen.findByRole('button', { name: 'Preview' }));
    expect(track).toHaveBeenCalledWith('history_item_reopened', { kind: 'video', age_bucket: '30-90d' });
    fireEvent.click(screen.getByRole('link', { name: 'Download' }));
    expect(track).toHaveBeenCalledTimes(2);
  });

  it('emits data_deleted item/result for a single delete', async () => {
    vi.mocked(deleteJob).mockResolvedValue({ deleted: { objects: 1, bytes: 1 }, pending: 0 });
    renderHistory([row('j1', { downloadPath: '/x' })]);
    fireEvent.click(await screen.findByRole('button', { name: 'Delete now' }));
    fireEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(track).toHaveBeenCalledWith('data_deleted', { scope: 'item', kind: 'result' }));
  });

  it('Keep longer calls keepJobLonger with the chosen hours', async () => {
    vi.mocked(keepJobLonger).mockResolvedValue({ keepForHours: 720, expiresAt: inDays(30), keptLonger: true, updated: 1 });
    renderHistory([row('j1', { retainedObjectId: 'r1', deletesOn: inDays(3), downloadPath: '/x' })]);
    const trigger = await screen.findByRole('button', { name: 'Keep longer' });
    fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false });
    fireEvent.click(trigger);
    fireEvent.click(await screen.findByRole('menuitem', { name: '1 month' }));
    await waitFor(() => expect(keepJobLonger).toHaveBeenCalledWith('tok', 'j1', 720));
  });

  it('hides Keep longer for rows without a ledger row', async () => {
    renderHistory([row('legacy', { downloadPath: '/x' })]);
    await screen.findByText('Delete now');
    expect(screen.queryByRole('button', { name: 'Keep longer' })).toBeNull();
  });
});

describe('HistoryTab filters', () => {
  const rows = () => [
    row('v1', { tool: 'video_transcode', mediaKind: 'video', deletesOn: inDays(2), downloadPath: '/x' }),
    row('v2', { tool: 'convert', mediaKind: 'video', deletesOn: inDays(100), downloadPath: '/x' }),
    row('i1', { tool: 'convert', mediaKind: 'image', deletesOn: inDays(3), downloadPath: '/x' }),
  ];
  const count = () => screen.queryAllByTestId('history-row').length;

  it('filters by kind, by tool, by expiring soon, and combined', async () => {
    renderHistory(rows());
    await screen.findAllByTestId('history-row');
    expect(count()).toBe(3);

    fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'video' } });
    expect(count()).toBe(2);

    fireEvent.change(screen.getByLabelText('Tool'), { target: { value: 'convert' } });
    expect(count()).toBe(1);

    fireEvent.change(screen.getByLabelText('Type'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Tool'), { target: { value: '' } });
    fireEvent.click(screen.getByLabelText('Expiring within 7 days'));
    expect(count()).toBe(2); // v1 (2 d) and i1 (3 d)

    fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'image' } });
    expect(count()).toBe(1);
  });

  it('shows the no-match message and Clear filters restores the list', async () => {
    renderHistory(rows());
    await screen.findAllByTestId('history-row');
    fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'image' } });
    fireEvent.change(screen.getByLabelText('Tool'), { target: { value: 'video_transcode' } });
    expect(screen.getByTestId('history-no-match').textContent).toBe('No results match these filters.');
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(count()).toBe(3);
  });
});

describe('HistoryTab delete flows', () => {
  it('Delete now asks first and never fires on one click', async () => {
    vi.mocked(deleteJob).mockResolvedValue({ deleted: { objects: 1, bytes: 1 }, pending: 0 });
    renderHistory([row('j1', { downloadPath: '/x' })]);
    fireEvent.click(await screen.findByRole('button', { name: 'Delete now' }));
    expect(deleteJob).not.toHaveBeenCalled();
    const dialog = await screen.findByRole('alertdialog');
    // Focus is not on the destructive button.
    expect(document.activeElement).not.toBe(within(dialog).getByRole('button', { name: 'Delete' }));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(deleteJob).not.toHaveBeenCalled();

    fireEvent.click(await screen.findByRole('button', { name: 'Delete now' }));
    fireEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(deleteJob).toHaveBeenCalledWith('tok', 'j1'));
    // The list is refetched after the delete.
    await waitFor(() => expect(vi.mocked(fetchHistory).mock.calls.length).toBeGreaterThan(1));
  });

  it('bulk delete loops deleteJob, lists the partial failures, and keeps them selected', async () => {
    vi.mocked(deleteJob).mockImplementation(async (_t, id) => {
      if (id === 'b2') throw new Error('boom');
      return { deleted: { objects: 1, bytes: 1 }, pending: 0 };
    });
    renderHistory([
      row('b1', { resultFileName: 'one.png', downloadPath: '/x' }),
      row('b2', { resultFileName: 'two.png', downloadPath: '/x' }),
      row('b3', { resultFileName: 'three.png', downloadPath: '/x' }),
    ]);
    fireEvent.click(await screen.findByLabelText('Select one.png'));
    fireEvent.click(screen.getByLabelText('Select two.png'));
    fireEvent.click(screen.getByLabelText('Select three.png'));
    expect(screen.getByText('3 selected')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Delete selected' }));
    expect(deleteJob).not.toHaveBeenCalled();
    fireEvent.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Delete' }));

    const failures = await screen.findByTestId('bulk-failures');
    expect(deleteJob).toHaveBeenCalledTimes(3);
    expect(failures.textContent).toContain('Deleted 2 of 3');
    expect(failures.textContent).toContain('two.png');
    expect(failures.textContent).not.toContain('one.png');
  });
});
