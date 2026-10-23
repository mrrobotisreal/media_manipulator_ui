import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { DiffResult } from '@/lib/metadata/api';
import type { MetadataEntry } from '@/lib/metadata/types';
import { photoDocument } from './test-utils';

vi.mock('@/i18n/useLocalization', async () => ({ useLocalization: (await import('./test-utils')).useLocalizationMock }));
vi.mock('@/lib/i18n/ensureShard', async () => (await import('./test-utils')).ensureShardMock());
const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock('sonner', () => ({ toast }));

const state = vi.hoisted(() => ({ diff: undefined as unknown, orig: undefined as unknown }));
vi.mock('./use-metadata-data', () => ({
  useJobMetadataDiff: () => ({ data: state.diff, status: state.diff ? 'ready' : 'loading', error: null }),
  useJobMetadata: () => ({ data: state.orig, status: state.orig ? 'ready' : 'loading', error: null }),
}));

import { MetadataDiffModal, resetDiffModeForTests } from './metadata-diff-modal';

const e = (group: string, tag: string, value: MetadataEntry['value'], category: string, extra: Partial<MetadataEntry> = {}): MetadataEntry => ({
  id: `${group}:${tag}`, group, tag, value, category, ...extra,
});

function fixture(): { diff: DiffResult } {
  return {
    diff: {
      removed: [e('IFD0', 'Make', 'Apple', 'image', { privacy: 'device' }), e('GPS', 'GPSLatitude', '37 deg', 'gps', { privacy: 'location' })],
      added: [e('XMP', 'CreatorTool', 'mm', 'xmp')],
      changed: [
        { id: 'ExifIFD:ISO', before: 80, after: 100 },
        { id: 'System:FileSize', before: '2.1 MB', after: '1.0 MB' },
      ],
      unchanged: 2,
      byCategory: {},
    },
  };
}

let clipboard: string[];
beforeEach(() => {
  resetDiffModeForTests();
  const doc = photoDocument();
  state.diff = fixture().diff;
  state.orig = doc;
  clipboard = [];
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: (s: string) => (clipboard.push(s), Promise.resolve()) } });
  window.matchMedia = ((q: string) => ({ matches: /min-width: 1024px/.test(q), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as unknown as typeof window.matchMedia;
});
afterEach(cleanup);

const open = () =>
  render(<MetadataDiffModal jobId="j1" open onOpenChange={() => {}} originalName="IMG_0001.jpg" resultName="IMG_0001.clean.jpg" />);

describe('MetadataDiffModal', () => {
  it('shows header counts, expected changes excluded', async () => {
    open();
    const counts = await screen.findByTestId('diff-counts');
    await waitFor(() => expect(counts.textContent).toContain('2 removed'));
    expect(counts.textContent).toContain('1 added');
    expect(counts.textContent).toContain('1 changed');
    expect(screen.getByRole('dialog').textContent).toContain('IMG_0001.jpg → IMG_0001.clean.jpg');
  });

  it('marks removed, added and changed rows with glyphs and sr-only labels (split default at 1024)', async () => {
    open();
    await screen.findByTestId('diff-body');
    const rows = await screen.findAllByTestId('diff-row');
    expect(screen.getByTestId('diff-body').getAttribute('data-mode')).toBe('split');
    const byKind = (k: string) => rows.filter((r) => r.getAttribute('data-kind') === k);
    expect(byKind('removed')).toHaveLength(2);
    expect(byKind('removed')[0].textContent).toContain('−');
    expect(byKind('removed')[0].querySelector('.sr-only')?.textContent).toMatch(/removed/);
    expect(byKind('added')[0].textContent).toContain('+');
    expect(byKind('added')[0].querySelector('.sr-only')?.textContent).toMatch(/added/);
    expect(byKind('changed')[0].textContent).toContain('~');
    expect(byKind('changed')[0].querySelector('.sr-only')?.textContent).toMatch(/changed/);
    expect(byKind('expected')).toHaveLength(0);
  });

  it('opens categories with changes and collapses all-unchanged ones', async () => {
    open();
    await screen.findAllByTestId('diff-row');
    // show unchanged so the all-unchanged categories exist
    fireEvent.click(screen.getByTestId('diff-filter-unchanged'));
    await waitFor(() => expect(screen.getByTestId('diff-category-image')).toBeTruthy());
    expect(screen.getByTestId('diff-category-gps').getAttribute('data-state')).toBe('open');
    expect(screen.getByTestId('diff-category-image').getAttribute('data-state')).toBe('open');
    expect(screen.getByTestId('diff-category-camera').getAttribute('data-state')).toBe('open'); // ISO changed
    expect(screen.getByTestId('diff-category-file').getAttribute('data-state')).toBe('closed'); // only expected change + unchanged
    expect(screen.getByTestId('diff-category-counts-gps').textContent).toBe('−1 +0 ~0');
  });

  it('filters hide rows', async () => {
    open();
    await screen.findAllByTestId('diff-row');
    fireEvent.click(screen.getByTestId('diff-filter-removed'));
    await waitFor(() => expect(screen.queryAllByTestId('diff-row').some((r) => r.getAttribute('data-kind') === 'removed')).toBe(false));
    expect(screen.queryAllByTestId('diff-row').length).toBeGreaterThan(0);
  });

  it('switches between split and unified markup, changed rows become a - then + line', async () => {
    open();
    await screen.findAllByTestId('diff-row');
    expect(document.querySelector('[data-mode="split"][data-testid="diff-row"]')).toBeTruthy();
    expect(document.querySelector('[data-mode="unified"][data-testid="diff-row"]')).toBeNull();
    fireEvent.click(screen.getByLabelText('Unified'));
    await waitFor(() => expect(document.querySelector('[data-mode="unified"][data-testid="diff-row"]')).toBeTruthy());
    expect(document.querySelector('[data-mode="split"][data-testid="diff-row"]')).toBeNull();
    const camera = within(screen.getByTestId('diff-category-camera'));
    const lines = camera.getAllByTestId('diff-row');
    expect(lines.map((l) => l.getAttribute('data-line'))).toEqual(['removed', 'added']);
    expect(within(lines[0]).getByTestId('diff-gutter').textContent).toBe('−');
    expect(within(lines[1]).getByTestId('diff-gutter').textContent).toBe('+');
  });

  it('copies the diff as golden text', async () => {
    open();
    await screen.findAllByTestId('diff-row');
    fireEvent.click(screen.getByRole('button', { name: /Copy diff as text/ }));
    await waitFor(() => expect(clipboard).toHaveLength(1));
    expect(clipboard[0]).toBe(
      [
        '--- IMG_0001.jpg',
        '+++ IMG_0001.clean.jpg',
        '@@ image @@',
        '- IFD0:Make: Apple',
        '@@ gps @@',
        '- GPS:GPSLatitude: 37 deg',
        '@@ xmp @@',
        '+ XMP:CreatorTool: mm',
        '@@ camera @@',
        '~ ExifIFD:ISO: 80 → 100 (+20)',
        '',
      ].join('\n'),
    );
    expect(toast.success).toHaveBeenCalled();
  });
});
