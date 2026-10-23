import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('@/i18n/useLocalization', async () => ({ useLocalization: (await import('./test-utils')).useLocalizationMock }));
vi.mock('@/lib/i18n/ensureShard', async () => (await import('./test-utils')).ensureShardMock());
const state = vi.hoisted(() => ({ diff: undefined as unknown, status: 'ready' as string, calls: [] as unknown[] }));
vi.mock('./use-metadata-data', () => ({
  useJobMetadataDiff: (id: string, o: unknown) => (state.calls.push([id, o]), { data: state.diff, status: state.status, error: null }),
  useJobMetadata: () => ({ data: undefined, status: 'loading', error: null }),
  useJobBinaryUrls: () => () => null,
}));
vi.mock('./metadata-diff-modal', () => ({
  MetadataDiffModal: ({ open }: { open: boolean }) => (open ? <div data-testid="modal-open" /> : null),
}));
vi.mock('./metadata-inspector-lazy', () => ({ LazyMetadataInspector: () => <div data-testid="lazy-inspector" /> }));

import { MetadataStrip } from './metadata-strip';

const diff = (removed: number, unchanged = 10, changed = 2) => ({
  removed: Array.from({ length: removed }, (_, i) => ({ id: `A:${i}`, group: 'A', tag: String(i), value: 1, category: 'other' })),
  added: [],
  changed: Array.from({ length: changed }, (_, i) => ({ id: `C:${i}`, before: 1, after: 2 })),
  unchanged,
  byCategory: {},
});

const props = { jobId: 'j1', kind: 'image', originalName: 'a.jpg', resultName: 'b.jpg' };

beforeEach(() => {
  state.diff = diff(5);
  state.status = 'ready';
  state.calls = [];
});
afterEach(cleanup);

describe('MetadataStrip', () => {
  it('renders nothing without metadataAvailable.result (pre-MM08 API)', () => {
    const { container } = render(<MetadataStrip {...props} />);
    expect(container.innerHTML).toBe('');
    cleanup();
    const r2 = render(<MetadataStrip {...props} available={{ original: true, result: false }} />);
    expect(r2.container.innerHTML).toBe('');
  });

  it('renders nothing for kinds without comparable metadata', () => {
    const { container } = render(<MetadataStrip {...props} kind="captions" available={{ original: true, result: true }} />);
    expect(container.innerHTML).toBe('');
  });

  it('shows "N kept - M removed" and Compare opens the modal', async () => {
    render(<MetadataStrip {...props} available={{ original: true, result: true }} />);
    const line = await screen.findByTestId('metadata-strip');
    await waitFor(() => expect(line.textContent).toContain('12 kept · 5 removed'));
    fireEvent.click(screen.getByRole('button', { name: 'Compare' }));
    expect(await screen.findByTestId('modal-open')).toBeTruthy();
  });

  it('says "Metadata unchanged" when nothing was removed', async () => {
    state.diff = diff(0);
    render(<MetadataStrip {...props} available={{ original: true, result: true }} />);
    expect((await screen.findByTestId('metadata-strip')).textContent).toContain('Metadata unchanged');
  });

  it('renders nothing on failure and never blocks', async () => {
    state.diff = undefined;
    state.status = 'error';
    render(<MetadataStrip {...props} available={{ original: true, result: true }} />);
    expect(screen.queryByTestId('metadata-strip')).toBeNull();
  });

  it('fetches the diff only once visible (no IntersectionObserver -> immediately)', () => {
    render(<MetadataStrip {...props} available={{ original: true, result: true }} />);
    expect(state.calls[0]).toEqual(['j1', { enabled: true }]);
  });
});
