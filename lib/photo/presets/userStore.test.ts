import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { FakeIDBFactory, throwingIndexedDb } from '@/lib/vector/testing/fakeIndexedDb';
import { upsertAdjustment } from '@/lib/photo/layerOps';
import { newPhotoDoc } from '@/lib/photo/photoTypes';
import {
  deleteUserPreset,
  exportUserPresets,
  importUserPresets,
  listUserPresets,
  parseUserPresetsJson,
  renameUserPreset,
  saveUserPreset,
  sanitizeUserPreset,
} from './userStore';

const original = globalThis.indexedDB;
const layers = () => upsertAdjustment(upsertAdjustment(newPhotoDoc(10, 10), 'exposure', (p) => ({ ...p, ev: 0.5 })).doc, 'clarity', (p) => ({ ...p, amount: 20 })).doc.layers;

beforeEach(() => {
  (globalThis as { indexedDB: unknown }).indexedDB = new FakeIDBFactory();
});
afterEach(() => {
  (globalThis as { indexedDB: unknown }).indexedDB = original;
});

describe('user presets (browser-local IndexedDB)', () => {
  it('save, list newest first, rename, delete', async () => {
    const a = await saveUserPreset({ name: 'Moody', layers: layers(), createdAt: '2026-01-01T00:00:00.000Z' });
    const b = await saveUserPreset({ name: 'Bright', layers: layers(), category: 'color', createdAt: '2026-02-01T00:00:00.000Z' });
    expect(a && b).toBeTruthy();
    expect((await listUserPresets()).map((p) => p.name)).toEqual(['Bright', 'Moody']);
    // columns mirror MM103 photo_presets: name, category, layers, createdAt
    expect(Object.keys((await listUserPresets())[0]).sort()).toEqual(['category', 'createdAt', 'id', 'layers', 'name']);
    expect(await renameUserPreset(a!.id, '  Moody 2 ')).toBe(true);
    expect((await listUserPresets()).find((p) => p.id === a!.id)!.name).toBe('Moody 2');
    expect(await renameUserPreset(a!.id, '')).toBe(false);
    expect(await deleteUserPreset(a!.id)).toBe(true);
    expect((await listUserPresets()).map((p) => p.name)).toEqual(['Bright']);
  });

  it('export JSON then import JSON round-trips (fresh ids, same name/category/layers)', async () => {
    await saveUserPreset({ name: 'One', layers: layers(), category: 'film' });
    const exported = exportUserPresets(await listUserPresets());
    await deleteUserPreset((await listUserPresets())[0].id);
    expect(await listUserPresets()).toHaveLength(0);
    const r = await importUserPresets(exported);
    expect(r.ok).toBe(true);
    const back = await listUserPresets();
    expect(back).toHaveLength(1);
    expect(back[0].name).toBe('One');
    expect(back[0].category).toBe('film');
    expect(back[0].layers).toEqual(layers());
    // exported again == the same payload modulo id
    expect(JSON.parse(exportUserPresets(back)).presets[0].layers).toEqual(JSON.parse(exported).presets[0].layers);
  });

  it('refuses invalid imports', () => {
    expect(parseUserPresetsJson('not json')).toEqual({ ok: false, reason: 'json' });
    expect(parseUserPresetsJson('{"format":"other","version":1,"presets":[]}')).toEqual({ ok: false, reason: 'format' });
    expect(parseUserPresetsJson('{"format":"aperture-presets","version":1,"presets":[]}')).toEqual({ ok: false, reason: 'empty' });
    const bad = JSON.stringify({ format: 'aperture-presets', version: 1, presets: [{ id: 'a', name: 'x', category: 'custom', layers: [{ id: 'l', type: 'nope' }], createdAt: '2026-01-01T00:00:00Z' }] });
    expect(parseUserPresetsJson(bad)).toEqual({ ok: false, reason: 'invalid' });
    expect(sanitizeUserPreset({ id: 'a', name: 'n'.repeat(61), category: null, layers: layers() })).toBeNull();
    expect(sanitizeUserPreset({ id: 'a', name: 'n', category: 'bogus', layers: layers() })).toBeNull();
  });

  it('without IndexedDB everything degrades to empty/false and never throws', async () => {
    (globalThis as { indexedDB: unknown }).indexedDB = throwingIndexedDb;
    expect(await listUserPresets()).toEqual([]);
    expect(await saveUserPreset({ name: 'x', layers: layers() })).toBeNull();
    expect(await deleteUserPreset('x')).toBe(false);
  });
});
