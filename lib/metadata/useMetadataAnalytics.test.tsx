import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { photoDocument } from '@/components/metadata/test-utils';

const track = vi.fn();
vi.mock('@/lib/analytics', async (orig) => ({
  ...(await orig<typeof import('@/lib/analytics')>()),
  useToolAnalytics: () => ({ track, toolSlug: 'exif-remover', mediaKind: 'image', setMediaKind: () => undefined }),
}));

import { EVENTS } from '@/lib/analytics/events';
import { useMetadataAnalytics } from './useMetadataAnalytics';

beforeEach(() => track.mockClear());

describe('useMetadataAnalytics', () => {
  it('fires metadata_inspected once per document with enum/bucket props only', () => {
    const doc = photoDocument();
    const { rerender } = renderHook(({ d }) => useMetadataAnalytics('home', d), { initialProps: { d: doc } });
    rerender({ d: doc });
    const calls = track.mock.calls.filter((c) => c[0] === EVENTS.METADATA_INSPECTED);
    expect(calls).toHaveLength(1);
    const props = calls[0][1];
    expect(Object.keys(props).sort()).toEqual(['has_c2pa', 'has_gps', 'kind', 'surface', 'tag_bucket']);
    expect(props.surface).toBe('home');
    expect(props.kind).toBe('image');
    expect(['1-25', '26-100', '101-500', '500+']).toContain(props.tag_bucket);
    expect(JSON.stringify(props)).not.toContain('IMG_0001');
  });

  it('does not fire without a document', () => {
    renderHook(() => useMetadataAnalytics('home', undefined));
    expect(track).not.toHaveBeenCalled();
  });

  it('maps inspector events; search fires once; filter only when switched on', () => {
    const doc = photoDocument();
    const { result } = renderHook(() => useMetadataAnalytics('result', doc));
    track.mockClear();
    result.current.onEvent({ type: 'section_toggled', category: 'gps', open: true });
    result.current.onEvent({ type: 'search_used', length: 4, results: 2 });
    result.current.onEvent({ type: 'search_used', length: 5, results: 1 });
    result.current.onEvent({ type: 'privacy_filter_used', privacy: 'location', active: true });
    result.current.onEvent({ type: 'privacy_filter_used', privacy: 'location', active: false });
    expect(track.mock.calls).toEqual([
      [EVENTS.METADATA_SECTION_TOGGLED, { category: 'gps', open: true }],
      [EVENTS.METADATA_SEARCH_USED, {}],
      [EVENTS.METADATA_PRIVACY_FILTER_USED, { flag: 'location' }],
    ]);
  });

  it('resolves binary category from the document, never the entry id', () => {
    const doc = photoDocument();
    const thumb = doc.entries.find((e) => e.category === 'thumbnail') ?? doc.entries[0];
    const { result } = renderHook(() => useMetadataAnalytics('result', doc));
    track.mockClear();
    result.current.onEvent({ type: 'binary_downloaded', entryId: thumb.id });
    expect(track).toHaveBeenCalledWith(EVENTS.METADATA_BINARY_DOWNLOADED, { category: thumb.category });
  });

  it('maps diff events with buckets and the tool slug', () => {
    const { result } = renderHook(() => useMetadataAnalytics('tool_page'));
    result.current.onDiffEvent({ type: 'diff_opened', surface: 'tool_page', removed: 30, added: 0, changed: 501 });
    result.current.onDiffEvent({ type: 'mode_changed', mode: 'split' });
    expect(track.mock.calls).toEqual([
      [EVENTS.METADATA_DIFF_OPENED, { tool: 'exif-remover', removed_bucket: '26-100', added_bucket: '0', changed_bucket: '500+' }],
      [EVENTS.METADATA_DIFF_MODE_CHANGED, { mode: 'split' }],
    ]);
  });
});
