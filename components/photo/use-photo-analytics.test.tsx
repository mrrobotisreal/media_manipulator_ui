/**
 * MM101 acceptance 4: each seam emits the right event name + props. The adjustment
 * seam is debounced 600 ms and reports keys only; AI/heal timing is bucketed;
 * opened/created/saved come through the returned callbacks.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';

import { ADJUSTMENT_DEBOUNCE_MS, onAdjustmentChanged, onAiMaskCompleted, onAiMaskFailed, onAiMaskRequested, onBatchStarted, onCompareUsed, onHealCompleted, onHealFailed, onHealRequested, onMaskAdded, onPresetApplied } from '@/lib/photo/seams';
import { newPhotoDoc } from '@/lib/photo/photoTypes';
import { resetPhotoAnalyticsForTests, setPhotoBatchContext, type PhotoTracker } from '@/lib/photo/analytics';
import { usePhotoAnalytics } from './use-photo-analytics';

function recorder() {
  const events: Array<[string, Record<string, unknown>]> = [];
  const track: PhotoTracker = { track: (name, props) => void events.push([name, props as unknown as Record<string, unknown>]) };
  return { events, track };
}

beforeEach(() => {
  vi.useFakeTimers();
  resetPhotoAnalyticsForTests();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('usePhotoAnalytics', () => {
  it('adjustment: debounced 600 ms, one event per drag, keys only (no values)', () => {
    expect(ADJUSTMENT_DEBOUNCE_MS).toBe(600);
    const rec = recorder();
    renderHook(() => usePhotoAnalytics({ track: rec.track }));
    for (let i = 0; i < 10; i += 1) {
      onAdjustmentChanged('exposure', 'ev');
      vi.advanceTimersByTime(100);
    }
    expect(rec.events).toEqual([]);
    vi.advanceTimersByTime(600);
    expect(rec.events).toEqual([['photo_adjustment_changed', { adjustment: 'exposure', param: 'ev' }]]);
    onAdjustmentChanged('tone', 'highlights');
    vi.advanceTimersByTime(600);
    expect(rec.events.at(-1)).toEqual(['photo_adjustment_changed', { adjustment: 'tone', param: 'highlights' }]);
    for (const [, props] of rec.events) expect(Object.keys(props).sort()).toEqual(['adjustment', 'param']);
  });

  it('masks, compare and presets', () => {
    const rec = recorder();
    renderHook(() => usePhotoAnalytics({ track: rec.track }));
    onMaskAdded('radial');
    onMaskAdded('local');
    onMaskAdded('bogus');
    onCompareUsed('split');
    onCompareUsed('hold');
    onCompareUsed('weird');
    onPresetApplied('warm', true);
    onPresetApplied('my-own-look', false);
    expect(rec.events).toEqual([
      ['photo_mask_added', { mask_kind: 'radial' }],
      ['photo_mask_added', { mask_kind: 'brush' }],
      ['photo_compare_used', { mode: 'split' }],
      ['photo_compare_used', { mode: 'hold' }],
      ['photo_preset_applied', { preset_id: 'warm', builtin: true }],
      ['photo_preset_applied', { preset_id: 'custom', builtin: false }],
    ]);
  });

  it('AI mask and heal: requested, then completed or failed with ms bucket and a mapped reason', () => {
    const rec = recorder();
    renderHook(() => usePhotoAnalytics({ track: rec.track }));
    onAiMaskRequested();
    vi.advanceTimersByTime(2500);
    onAiMaskCompleted();
    onAiMaskRequested();
    vi.advanceTimersByTime(40);
    onAiMaskFailed('QuotaExceededError');
    onHealRequested(3);
    vi.advanceTimersByTime(45_000);
    onHealFailed('heal_timeout');
    onHealRequested(1);
    vi.advanceTimersByTime(6000);
    onHealCompleted();
    expect(rec.events).toEqual([
      ['photo_ai_mask_requested', {}],
      ['photo_ai_mask_completed', { ms: '1-5s' }],
      ['photo_ai_mask_requested', {}],
      ['photo_ai_mask_failed', { ms: '<100ms', reason: 'quota' }],
      ['photo_heal_requested', {}],
      ['photo_heal_failed', { ms: '30s-2m', reason: 'timeout' }],
      ['photo_heal_requested', {}],
      ['photo_heal_completed', { ms: '5-30s' }],
    ]);
  });

  it('batch started: photo_export_started with the dialog context and the batch bucket (nothing without it)', () => {
    const rec = recorder();
    renderHook(() => usePhotoAnalytics({ track: rec.track }));
    onBatchStarted(4);
    expect(rec.events).toEqual([]);
    setPhotoBatchContext({ format: 'webp', megapixels: 24, doc: newPhotoDoc(6000, 4000) });
    onBatchStarted(4);
    expect(rec.events).toEqual([['photo_export_started', { format: 'webp', megapixels_bucket: '<=32', layers: '0', masks: '0', batch_size: '2-5' }]]);
  });

  it('opened, created and saved come through the returned callbacks (buckets and enums only)', () => {
    const rec = recorder();
    const { result } = renderHook(() => usePhotoAnalytics({ track: rec.track }));
    act(() => {
      result.current.opened('tool_page', true);
      result.current.created({ name: 'IMG_0001.HEIC' }, { width: 4000, height: 3000 });
      result.current.saved(newPhotoDoc(4000, 3000));
    });
    expect(rec.events[0]).toEqual(['photo_editor_opened', { source: 'tool_page', local_decode: true }]);
    expect(rec.events[1]).toEqual(['photo_project_created', { source_format: 'heic', megapixels_bucket: '<=16', has_alpha: false }]);
    expect(rec.events[2]).toEqual(['photo_project_saved', { layers: '0', masks: '0', heals: '0', doc_bytes_bucket: '<10kb' }]);
  });

  it('unmount removes the listeners (no events after the editor closes)', () => {
    const rec = recorder();
    const { unmount } = renderHook(() => usePhotoAnalytics({ track: rec.track }));
    unmount();
    onMaskAdded('radial');
    onPresetApplied('warm', true);
    onAdjustmentChanged('exposure', 'ev');
    vi.advanceTimersByTime(1000);
    expect(rec.events).toEqual([]);
  });
});
