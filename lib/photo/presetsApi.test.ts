import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FakeIDBFactory } from '@/lib/vector/testing/fakeIndexedDb';
import { upsertAdjustment } from '@/lib/photo/layerOps';
import { newPhotoDoc } from '@/lib/photo/photoTypes';
import { listUserPresets, saveUserPreset } from '@/lib/photo/presets/userStore';
import {
  PRESET_MIGRATION_FLAG,
  createServerPreset,
  deleteServerPreset,
  isPresetLimit,
  listServerPresets,
  migrateLocalPresets,
  migrationDeclined,
  renameServerPreset,
  setMigrationDeclined,
  shouldOfferMigration,
  uploadPresetThumbnail,
} from './presetsApi';

const original = globalThis.indexedDB;
const layers = () => upsertAdjustment(newPhotoDoc(10, 10), 'exposure', (p) => ({ ...p, ev: 0.5 })).doc.layers;
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const wire = (id: string, name: string, extra: Record<string, unknown> = {}) => ({ id, name, category: 'custom', revision: 1, hasThumbnail: false, layers: layers(), createdAt: '2026-11-03T00:00:00Z', updatedAt: '2026-11-03T00:00:00Z', ...extra });

beforeEach(() => {
  (globalThis as { indexedDB: unknown }).indexedDB = new FakeIDBFactory();
  localStorage.clear();
});
afterEach(() => {
  (globalThis as { indexedDB: unknown }).indexedDB = original;
});

describe('presets API client (signed in)', () => {
  it('lists with ?full=1 and parses layers, cap and use', async () => {
    const f = vi.fn(async (_u: string, _i?: RequestInit) => json(200, { presets: [wire('a', 'Warm')], limit: 10, used: 1 }));
    const r = await listServerPresets(f);
    expect(String(f.mock.calls[0][0])).toMatch(/\/photo\/presets\?full=1$/);
    expect(r.limit).toBe(10);
    expect(r.presets[0]).toMatchObject({ id: 'a', name: 'Warm', category: 'custom', revision: 1 });
    expect(r.presets[0].layers).toHaveLength(1);
  });

  it('create POSTs {name, category, layers}; rename PUTs with If-Match; delete DELETEs', async () => {
    const f = vi.fn(async (_u: string, init?: RequestInit) => json(init?.method === 'POST' ? 201 : 200, wire('a', 'Cool', { revision: init?.method === 'PUT' ? 2 : 1 })));
    await createServerPreset({ name: ' Cool ', layers: layers() }, f);
    const post = f.mock.calls[0][1] as RequestInit;
    expect(post.method).toBe('POST');
    expect(JSON.parse(String(post.body))).toMatchObject({ name: 'Cool', category: 'custom' });
    const renamed = await renameServerPreset('a', 1, 'Cooler', f);
    const put = f.mock.calls[1][1] as RequestInit;
    expect((put.headers as Record<string, string>)['If-Match']).toBe('1');
    expect(JSON.parse(String(put.body))).toEqual({ name: 'Cooler' });
    expect(renamed.revision).toBe(2);
    await deleteServerPreset('a', f);
    expect((f.mock.calls[2][1] as RequestInit).method).toBe('DELETE');
  });

  it('a 403 photo_presets_limit is recognised', async () => {
    const f = vi.fn(async () => json(403, { error: 'photo_presets_limit', limit: 10, used: 10, upgradePath: 'premium' }));
    await expect(createServerPreset({ name: 'x', layers: layers() }, f)).rejects.toSatisfy(isPresetLimit);
  });

  it('a thumbnail failure never throws', async () => {
    const f = vi.fn(async () => json(415, { error: 'photo_preset_thumbnail_invalid' }));
    expect(await uploadPresetThumbnail('a', new Blob(['x']), f)).toBe(false);
    expect(await uploadPresetThumbnail('a', new Blob(['x']), vi.fn(async () => json(200, wire('a', 'x'))))).toBe(true);
  });
});

describe('one-time migration of browser presets', () => {
  it('offers only when the account has none, the browser has some, and it was not declined', async () => {
    const a = await saveUserPreset({ name: 'One', layers: layers() });
    const local = [a!];
    expect(shouldOfferMigration(0, local)).toBe(true);
    expect(shouldOfferMigration(1, local)).toBe(false);
    expect(shouldOfferMigration(0, [])).toBe(false);
    setMigrationDeclined();
    expect(localStorage.getItem(PRESET_MIGRATION_FLAG)).toBe('declined');
    expect(migrationDeclined()).toBe(true);
    expect(shouldOfferMigration(0, local)).toBe(false);
  });

  it('uploads oldest first up to the cap, clears what moved, keeps the rest local', async () => {
    for (const [i, n] of ['P1', 'P2', 'P3'].entries()) await saveUserPreset({ name: n, layers: layers(), createdAt: `2026-0${i + 1}-01T00:00:00.000Z` });
    const local = await listUserPresets();
    expect(local).toHaveLength(3);
    let created = 0;
    const f = vi.fn(async (_u: string, _i?: RequestInit) => {
      created += 1;
      return created <= 2 ? json(201, wire(`s${created}`, `P${created}`)) : json(403, { error: 'photo_presets_limit', limit: 2, used: 2, upgradePath: 'premium' });
    });
    const r = await migrateLocalPresets(local, f);
    expect(r).toEqual({ uploaded: 2, remaining: 1, capped: true });
    const uploadedNames = f.mock.calls.slice(0, 2).map((c) => JSON.parse(String((c[1] as RequestInit).body)).name);
    expect(uploadedNames).toEqual(['P1', 'P2']);
    expect((await listUserPresets()).map((p) => p.name)).toEqual(['P3']);
  });

  it('migrates everything and empties the browser store when the cap allows', async () => {
    await saveUserPreset({ name: 'A', layers: layers() });
    await saveUserPreset({ name: 'B', layers: layers() });
    const f = vi.fn(async (_u: string, _i?: RequestInit) => json(201, wire('s', 'x')));
    const r = await migrateLocalPresets(await listUserPresets(), f);
    expect(r).toEqual({ uploaded: 2, remaining: 0, capped: false });
    expect(await listUserPresets()).toEqual([]);
  });

  it('a network failure stops the run and loses nothing', async () => {
    await saveUserPreset({ name: 'A', layers: layers() });
    const r = await migrateLocalPresets(await listUserPresets(), vi.fn(async () => { throw new Error('offline'); }));
    expect(r.uploaded).toBe(0);
    expect(r.remaining).toBe(1);
  });
});
