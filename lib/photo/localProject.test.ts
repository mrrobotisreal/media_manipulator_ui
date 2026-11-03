import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  clearLocalProject,
  decideOpen,
  decideUploadOffer,
  docForUpload,
  getLocalProject,
  putLocalProject,
  setLocalBase,
  updateLocalDoc,
  type LocalProject,
} from './localProject';
import { newPhotoDoc } from './photoTypes';
import { upsertAdjustment } from './layerOps';
import { FakeIDBFactory, throwingIndexedDb } from '@/lib/vector/testing/fakeIndexedDb';

const original = globalThis.indexedDB;
const install = (f: unknown) => Object.defineProperty(globalThis, 'indexedDB', { value: f, configurable: true, writable: true });
const proj = (over: Partial<LocalProject> = {}): LocalProject => ({
  name: 'Sunset',
  fileName: 'sunset.jpg',
  original: null,
  base: null,
  doc: newPhotoDoc(100, 100),
  savedAt: 1,
  ...over,
});

beforeEach(() => {
  install(new FakeIDBFactory());
  localStorage.clear();
});
afterEach(() => install(original));

describe('the one browser-local project', () => {
  it('stores one project; a second put replaces it (after the prompt)', async () => {
    expect(await getLocalProject()).toBeNull();
    await putLocalProject(proj({ name: 'First' }));
    expect(decideOpen(await getLocalProject())).toBe('confirm-replace');
    await putLocalProject(proj({ name: 'Second' }));
    expect((await getLocalProject())?.name).toBe('Second');
    await clearLocalProject();
    expect(await getLocalProject()).toBeNull();
    expect(decideOpen(null)).toBe('open');
  });

  it('keeps edits across reloads (doc updates), original untouched', async () => {
    await putLocalProject(proj());
    const edited = upsertAdjustment(newPhotoDoc(100, 100), 'exposure', (p) => ({ ...p, ev: 1 })).doc;
    expect(await updateLocalDoc(edited)).toBe(true);
    const back = await getLocalProject();
    expect(back?.doc.layers[0]).toMatchObject({ type: 'exposure' });
    expect(back?.name).toBe('Sunset');
  });

  it('falls back to the localStorage doc when IndexedDB throws', async () => {
    install(throwingIndexedDb);
    await putLocalProject(proj({ name: 'Fallback' }));
    const back = await getLocalProject();
    expect(back?.name).toBe('Fallback');
    expect(back?.original).toBeNull();
  });

  it('stores a healed base without touching the doc', async () => {
    await putLocalProject(proj());
    expect(await setLocalBase(new Blob(['x']))).toBe(true);
  });

  it('offers the upload after sign-in only with pixels and a free slot; heals are emptied for the base-healed upload', () => {
    const withPixels = proj({ original: new Blob(['x']) });
    expect(decideUploadOffer(null, 0, 5)).toEqual({ offer: false, reason: 'no-local' });
    expect(decideUploadOffer(proj(), 0, 5)).toEqual({ offer: false, reason: 'no-pixels' });
    expect(decideUploadOffer(withPixels, 5, 5)).toEqual({ offer: false, reason: 'cap-reached' });
    expect(decideUploadOffer(withPixels, 4, 5)).toEqual({ offer: true, reason: 'ok' });
    expect(decideUploadOffer(withPixels, 99, -1)).toEqual({ offer: true, reason: 'ok' });
    const healed = proj({ base: new Blob(['b']), doc: { ...newPhotoDoc(10, 10), heals: [{ id: 'h1', maskRef: 'masks/h1.png' }] } });
    expect(docForUpload(healed).heals).toEqual([]);
    expect(docForUpload(proj()).heals).toEqual([]);
  });
});
