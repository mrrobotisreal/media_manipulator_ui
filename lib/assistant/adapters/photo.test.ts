/**
 * MM108: the Aperture adapter against a real store. One undo entry per apply, Undo restores the
 * previous document byte for byte, `replaceDoc` is never used, the History label is "Medi: …",
 * the undo token never undoes the user's own later work, and the "what I changed" lines are
 * templated keys.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import { resolveLabel } from '@/lib/photo/history';
import { createPhotoStore } from '@/lib/photo/photoStore';
import { canonicalPhotoDoc, newPhotoDoc } from '@/lib/photo/photoTypes';

import { createPhotoAdapter, describePhotoOps, mediLabel } from './photo';

const t = (key: string, vars?: Record<string, unknown>) => (vars ? `${key}${JSON.stringify(vars)}` : key);

function setup() {
  const store = createPhotoStore();
  store.getState().load('p1', newPhotoDoc(1200, 800), 'Test');
  const spies = { onSubjectMask: vi.fn(), onHeal: vi.fn(), onExport: vi.fn(), onOpenTool: vi.fn() };
  const adapter = createPhotoAdapter({ store, t, histogram: () => null, previewSize: () => ({ width: 1200, height: 800 }), captureFrame: async () => null, projectId: () => 'p1', ...spies });
  return { store, adapter, spies };
}

describe('Aperture adapter', () => {
  it('applies as exactly one undo entry labelled "Medi|<summary>"; Undo restores the prior doc byte for byte', () => {
    const { store, adapter } = setup();
    store.getState().mutate('Exposure', (d) => ({ ...d, layers: [] }));
    const before = canonicalPhotoDoc(store.getState().doc!);
    const pastBefore = store.getState().past.length;
    const r = adapter.apply('Grey except red', [{ op: 'grey_except', ranges: ['red'] }, { op: 'add_layer', type: 'vignette', params: { amount: -20 } }]);
    expect(r.ok).toBe(true);
    const s = store.getState();
    expect(s.past.length).toBe(pastBefore + 1);
    expect(s.past.at(-1)?.label).toBe('Medi|Grey except red');
    expect(s.doc!.layers.map((l) => l.type)).toEqual(['hsl', 'vignette']);
    expect(s.selection).toBe(s.doc!.layers[1].id);
    if (!r.ok) return;
    expect(r.opCount).toBe(2);
    expect(r.opKinds).toEqual(['grey_except', 'add_layer']);
    expect(adapter.canUndo(r.token)).toBe(true);
    expect(adapter.undo(r.token)).toBe(true);
    expect(canonicalPhotoDoc(store.getState().doc!)).toBe(before);
    expect(store.getState().past.length).toBe(pastBefore);
    expect(adapter.undo(r.token)).toBe(false);
  });

  it('a rejected edit changes nothing and records no history', () => {
    const { store, adapter } = setup();
    const doc = store.getState().doc;
    const r = adapter.apply('x', [{ op: 'add_layer', type: 'vignette' }, { op: 'remove_layer', layerId: 'ghost' }]);
    expect(r).toMatchObject({ ok: false, reason: 'unknown_id' });
    expect(store.getState().doc).toBe(doc);
    expect(store.getState().past).toHaveLength(0);
  });

  it('a no-op edit is refused (nothing to undo)', () => {
    const { store, adapter } = setup();
    expect(adapter.apply('x', [{ op: 'set_geometry', flipH: false }])).toMatchObject({ ok: false, reason: 'validation' });
    expect(store.getState().past).toHaveLength(0);
  });

  it('refuses while a slider gesture is open (locked)', () => {
    const { store, adapter } = setup();
    store.getState().beginGesture('exposure.ev');
    expect(adapter.apply('x', [{ op: 'auto_tone' }])).toMatchObject({ ok: false, reason: 'locked' });
    store.getState().endGesture();
  });

  it('the undo token never undoes the user\'s own later edit', () => {
    const { store, adapter } = setup();
    const r = adapter.apply('Warm', [{ op: 'add_layer', type: 'whiteBalance', params: { temperature: 20 } }]);
    if (!r.ok) throw new Error('apply failed');
    store.getState().mutate('Flip', (d) => ({ ...d, geometry: { ...d.geometry, flipH: true } }));
    expect(adapter.canUndo(r.token)).toBe(false);
    expect(adapter.undo(r.token)).toBe(false);
    expect(store.getState().doc!.geometry.flipH).toBe(true);
    expect(store.getState().doc!.layers).toHaveLength(1);
  });

  it('never calls replaceDoc, load or clearHistory (they wipe the undo history)', () => {
    const { store, adapter } = setup();
    const spy = { replaceDoc: vi.spyOn(store.getState(), 'replaceDoc'), load: vi.spyOn(store.getState(), 'load'), clearHistory: vi.spyOn(store.getState(), 'clearHistory') };
    const r = adapter.apply('B&W', [{ op: 'apply_preset', presetId: 'bw-film' }]);
    if (r.ok) adapter.undo(r.token);
    for (const s of Object.values(spy)) expect(s).not.toHaveBeenCalled();
    // Code, not comments: strip /* */ and // before looking for the forbidden calls.
    const code = ['adapters/photo.ts', 'ops/applyPhoto.ts', 'copilot/useCopilot.ts']
      .map((f) => readFileSync(join(__dirname, '..', f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, ''))
      .join('\n');
    expect(code).not.toMatch(/replaceDoc|restoreDraft|clearHistory|\.load\(/);
  });

  it('History shows the Medi label', () => {
    expect(resolveLabel(mediLabel('Grey except red'))).toEqual({ medi: 'Grey except red' });
    expect(mediLabel(`  ${'x'.repeat(80)}`)).toBe(`Medi|${'x'.repeat(60)}`);
  });

  it('suggested actions call the editor only when invoked', async () => {
    const { adapter, spies } = setup();
    expect(Object.keys(adapter.suggest).sort()).toEqual(['export', 'heal', 'open_tool', 'subject_mask']);
    for (const f of Object.values(spies)) expect(f).not.toHaveBeenCalled();
    await adapter.suggest.subject_mask?.({ layerId: 'a' });
    expect(spies.onSubjectMask).toHaveBeenCalledWith('a');
  });

  it('the digest describes the live document', () => {
    const { adapter } = setup();
    adapter.apply('x', [{ op: 'add_layer', type: 'exposure', params: { ev: 0.5 } }]);
    expect(adapter.digest()).toMatch(/0 · exposure · exposure · ev=0\.5/);
  });
});

describe('describePhotoOps (what I changed)', () => {
  it('is built from templated keys, never model text', () => {
    const before = newPhotoDoc(10, 10);
    const lines = describePhotoOps(
      [
        { op: 'grey_except', ranges: ['red', { hue: 185 }] },
        { op: 'add_layer', type: 'tone', mask: { components: [{ kind: 'radial' }] } },
        { op: 'apply_preset', presetId: 'vintage' },
        { op: 'set_geometry', straighten: -2, crop: { aspect: '4:5' } },
        { op: 'auto_tone' },
      ],
      before,
      t,
    );
    expect(lines).toEqual([
      'assistant.copilot.change.greyExcept{"colors":"assistant.copilot.colors.red, assistant.copilot.colors.custom"}',
      'assistant.copilot.change.addLayerMasked{"layer":"photo.layers.type.tone"}',
      'assistant.copilot.change.applyPreset{"preset":"photo.presets.name.vintage"}',
      'assistant.copilot.change.straighten{"degrees":-2}',
      'assistant.copilot.change.cropAspect{"aspect":"4:5"}',
      'assistant.copilot.change.autoTone',
    ]);
  });
});
