import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import enPanels from '@/i18n/locales/en-us/interface/panels.json';
import { historySteps, labelSlug, resolveLabel, useSnapshotStore } from './history';
import { upsertAdjustment } from './layerOps';
import { createPhotoStore } from './photoStore';
import { newPhotoDoc } from './photoTypes';

const ROOT = join(__dirname, '..', '..');
const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((e) => {
    const full = join(dir, e);
    return statSync(full).isDirectory() ? files(full) : /\.tsx?$/.test(e) && !/\.test\./.test(e) ? [full] : [];
  });
const labels = enPanels.photo.history.labels as Record<string, string>;

function storeWithEdits() {
  const s = createPhotoStore();
  s.getState().load('p', newPhotoDoc(10, 10));
  const edit = (label: string, ev: number) => s.getState().mutate(label, (d) => upsertAdjustment(d, 'exposure', (p) => ({ ...p, ev })).doc);
  edit('Exposure', 1);
  edit('Exposure', 2);
  edit('Exposure', 3);
  return s;
}

describe('history panel model', () => {
  it('label coverage: every literal mutate/update/beginGesture label in the editor resolves to a translated history key', () => {
    const src = [...files(join(ROOT, 'components/photo')), ...files(join(ROOT, 'lib/photo'))].map((f) => readFileSync(f, 'utf8')).join('\n');
    const found = new Set(Array.from(src.matchAll(/(?:mutate|update|beginGesture)\(\s*'([^'|]+)'/g), (m) => m[1]));
    // labels the registry knows as structured forms
    for (const x of ['Preset', 'Snapshot', 'Delete group']) found.add(x);
    expect(found.size).toBeGreaterThan(50);
    const missing: string[] = [];
    for (const label of found) {
      if (label === 'Preset') continue;
      const r = resolveLabel(label);
      if ('key' in r) {
        const k = r.key.replace('photo.history.labels.', '');
        if (typeof labels[k] !== 'string') missing.push(`${label} -> ${k}`);
      } else if ('layerType' in r) expect(typeof (enPanels.photo.layers.type as Record<string, string>)[r.layerType]).toBe('string');
    }
    expect(missing).toEqual([]);
  });

  it('gesture labels (<type>.<param>) resolve to the layer type or a gesture key', () => {
    expect(resolveLabel('exposure.ev')).toEqual({ layerType: 'exposure' });
    expect(resolveLabel('sharpen.amount')).toEqual({ layerType: 'sharpen' });
    expect(resolveLabel('mask.opacity')).toEqual({ key: 'photo.history.labels.maskGesture' });
    expect(resolveLabel('brush.size')).toEqual({ key: 'photo.history.labels.brushGesture' });
    expect(resolveLabel('Preset|builtin:vivid')).toEqual({ presetBuiltin: 'vivid' });
    expect(resolveLabel('Preset|user:My look')).toEqual({ presetUser: 'My look' });
    expect(labelSlug('Black & white')).toBe('blackWhite');
    expect(labelSlug('LUT')).toBe('lut');
    expect(labelSlug('Add local adjustment')).toBe('addLocalAdjustment');
  });

  it('lists the undo stack plus redo entries and marks the current step', () => {
    const s = storeWithEdits();
    s.getState().undo();
    const steps = historySteps(s.getState().past, s.getState().future);
    expect(steps.map((x) => [x.index, x.applied, x.current])).toEqual([[1, true, false], [2, true, true], [3, false, false]]);
  });

  it('jump to a step moves the document (undo/redo to that point), jump to 0 is the original', () => {
    const s = storeWithEdits();
    const ev = () => (s.getState().doc!.layers[0]?.params as { ev: number } | undefined)?.ev;
    expect(ev()).toBe(3);
    s.getState().jumpTo(1);
    expect(ev()).toBe(1);
    expect(s.getState().future).toHaveLength(2);
    s.getState().jumpTo(3);
    expect(ev()).toBe(3);
    s.getState().jumpTo(0);
    expect(s.getState().doc!.layers).toHaveLength(0);
    expect(s.getState().past).toHaveLength(0);
    s.getState().jumpTo(99);
    expect(ev()).toBe(3);
  });

  it('snapshot bookmark: jumping to it is itself an undoable step', () => {
    const s = storeWithEdits();
    const snap = useSnapshotStore.getState().add('Before', s.getState().doc!);
    s.getState().mutate('Exposure', (d) => upsertAdjustment(d, 'exposure', (p) => ({ ...p, ev: -2 })).doc);
    const pastBefore = s.getState().past.length;
    s.getState().mutate('Snapshot', () => snap.doc);
    expect(s.getState().past).toHaveLength(pastBefore + 1);
    expect((s.getState().doc!.layers[0].params as { ev: number }).ev).toBe(3);
    s.getState().undo();
    expect((s.getState().doc!.layers[0].params as { ev: number }).ev).toBe(-2);
    useSnapshotStore.getState().clear();
    expect(useSnapshotStore.getState().snapshots).toHaveLength(0);
  });

  it('clear history keeps the document and drops past and future', () => {
    const s = storeWithEdits();
    s.getState().undo();
    const doc = s.getState().doc;
    s.getState().clearHistory();
    expect(s.getState().past).toHaveLength(0);
    expect(s.getState().future).toHaveLength(0);
    expect(s.getState().doc).toBe(doc);
  });
});
