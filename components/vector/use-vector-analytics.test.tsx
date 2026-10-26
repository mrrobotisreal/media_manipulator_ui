/**
 * MM49: the editor's vector_* emission (useVectorAnalytics) against the real
 * store: opened once, project_created once at the first content, keyframes
 * on edits only (never undo/redo/load), tools and animators, imports, saves.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';

import type { VectorTracker } from '@/lib/vector/analytics';
import { upsertKeyframe } from '@/lib/vector/keyframes';
import { blankDoc } from '@/lib/vector/projects';
import { useVectorStore } from '@/lib/vector/vectorStore';
import { parseVectorDoc } from '@/lib/vector/vectorTypes';

import { useVectorAnalytics } from './use-vector-analytics';

function recorder() {
  const events: Array<[string, Record<string, unknown>]> = [];
  const track: VectorTracker = { track: (name, props) => void events.push([name, props as unknown as Record<string, unknown>]) };
  return { events, track, names: () => events.map(([n]) => n) };
}

const rect = { type: 'rect' as const, id: 'r', x: 0, y: 0, width: 10, height: 10 };

beforeEach(() => {
  useVectorStore.getState().load('local-abc', blankDoc(), 'Untitled');
});
afterEach(() => {
  cleanup();
  useVectorStore.getState().close();
});

describe('useVectorAnalytics', () => {
  it('new project: opened once, created {blank} at the first edit, keyframes on edits but not on undo/redo', () => {
    const rec = recorder();
    const { rerender } = renderHook((p: { ready: boolean }) => useVectorAnalytics({ ready: p.ready, source: 'new', track: rec.track }), { initialProps: { ready: true } });
    rerender({ ready: true });
    expect(rec.events).toEqual([['vector_editor_opened', { source: 'new' }]]);

    const s = () => useVectorStore.getState();
    act(() => s().addLayers([rect], 'Rectangle'));
    expect(rec.events.at(-1)).toEqual(['vector_project_created', { source: 'blank' }]);

    act(() => s().mutate('Add keyframe', (d) => upsertKeyframe(d, 'r', 'opacity', 0, 1)));
    act(() => s().mutate('Add keyframe', (d) => upsertKeyframe(d, 'r', 'opacity', 500, 0)));
    expect(rec.events.filter(([n]) => n === 'vector_keyframe_added')).toEqual([
      ['vector_keyframe_added', { property: 'opacity' }],
      ['vector_keyframe_added', { property: 'opacity' }],
    ]);
    const before = rec.events.length;
    act(() => s().undo());
    act(() => s().redo());
    expect(rec.events.length).toBe(before);
    expect(rec.names().filter((n) => n === 'vector_project_created')).toHaveLength(1);
  });

  it('a draft or account project is never "created" again', () => {
    const rec = recorder();
    renderHook(() => useVectorAnalytics({ ready: true, source: 'account', track: rec.track }));
    act(() => useVectorStore.getState().addLayers([rect], 'Rectangle'));
    expect(rec.names()).toEqual(['vector_editor_opened']);
    expect(rec.events[0][1]).toEqual({ source: 'account' });
  });

  it('an SVG import into the empty canvas creates the project as svg_import; imports carry bucketed counts', () => {
    const rec = recorder();
    const { result } = renderHook(() => useVectorAnalytics({ ready: true, source: 'new', track: rec.track }));
    const parsed = parseVectorDoc({ version: 1, layers: [rect, { ...rect, id: 'r2' }] });
    if (!parsed.ok) throw new Error(parsed.error);
    act(() => {
      useVectorStore.getState().load('local-abc', parsed.doc, 'logo');
      result.current.importCompleted('svg', parsed.doc, 3, true);
    });
    expect(rec.events.slice(1)).toEqual([
      ['vector_import_completed', { format: 'svg', layers: '1-10', unsupported_count: '1-10' }],
      ['vector_project_created', { source: 'svg_import' }],
    ]);
    act(() => result.current.importFailed('lottie'));
    expect(rec.events.at(-1)).toEqual(['vector_import_failed', { format: 'lottie', layers: '0', unsupported_count: '0' }]);
  });

  it('tools, animators and saves go through the same sink', () => {
    const rec = recorder();
    const { result } = renderHook(() => useVectorAnalytics({ ready: false, source: 'new', track: rec.track }));
    act(() => {
      result.current.toolUsed('pen');
      result.current.animatorUsed('morph');
      result.current.projectSaved(3, 40 * 1024);
    });
    expect(rec.events).toEqual([
      ['vector_tool_used', { tool: 'pen' }],
      ['vector_animator_used', { animator: 'morph' }],
      ['vector_project_saved', { revision: '2-5', bytes: '10-100kb' }],
    ]);
  });
});
