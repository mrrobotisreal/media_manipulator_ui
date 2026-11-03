import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  PHOTO_DRAFT_DEBOUNCE_MS,
  createDraftWriter,
  deletePhotoDraft,
  getPhotoDraft,
  listPhotoDrafts,
  photoDraftKey,
  prunePhotoDrafts,
  putPhotoDraft,
  shouldOfferRecovery,
  type PhotoDraft,
} from './draftStore';
import { createPhotoStore } from './photoStore';
import { newPhotoDoc, type PhotoDoc } from './photoTypes';
import { upsertAdjustment } from './layerOps';
import { FakeIDBFactory, failingIndexedDb, throwingIndexedDb } from '@/lib/vector/testing/fakeIndexedDb';

const edited = (): PhotoDoc => upsertAdjustment(newPhotoDoc(10, 10), 'exposure', (p) => ({ ...p, ev: 1 })).doc;
const draft = (projectId: string, over: Partial<PhotoDraft> = {}): PhotoDraft => ({
  projectId,
  name: 'Beach',
  savedAt: 1_000,
  baseRevision: null,
  document: edited(),
  ...over,
});

const original = globalThis.indexedDB;
let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  Object.defineProperty(globalThis, 'indexedDB', { value: original, configurable: true, writable: true });
  warn.mockRestore();
});
const install = (factory: unknown) => Object.defineProperty(globalThis, 'indexedDB', { value: factory, configurable: true, writable: true });

describe('photo draftStore with a fake IndexedDB', () => {
  beforeEach(() => install(new FakeIDBFactory()));

  it('uses the photo-draft:<projectId> key', () => expect(photoDraftKey('abc')).toBe('photo-draft:abc'));

  it('writes and recovers a draft', async () => {
    expect(await putPhotoDraft(draft('p1'))).toBe(true);
    const got = await getPhotoDraft('p1');
    expect(got).toMatchObject({ projectId: 'p1', name: 'Beach', savedAt: 1_000, baseRevision: null });
    expect(got?.document.layers[0]).toMatchObject({ id: 'exposure' });
  });

  it('missing, delete, corrupt, list and prune', async () => {
    expect(await getPhotoDraft('nope')).toBeNull();
    await putPhotoDraft(draft('p2'));
    expect(await deletePhotoDraft('p2')).toBe(true);
    expect(await getPhotoDraft('p2')).toBeNull();
    await putPhotoDraft({ ...draft('p3'), document: { version: 99 } as unknown as PhotoDoc });
    expect(await getPhotoDraft('p3')).toBeNull();
    await putPhotoDraft(draft('a', { savedAt: 10 }));
    await putPhotoDraft(draft('b', { savedAt: 30 }));
    await putPhotoDraft(draft('c', { savedAt: 20 }));
    expect((await listPhotoDrafts()).map((d) => d.projectId)).toEqual(['b', 'c', 'a']);
    expect(await prunePhotoDrafts(2, 365, 40)).toBe(1);
  });

  it('offers recovery only for a newer, different draft', () => {
    const doc = newPhotoDoc(10, 10);
    expect(shouldOfferRecovery(null, doc, 0)).toBe(false);
    expect(shouldOfferRecovery(draft('x', { document: doc }), doc, 0)).toBe(false);
    expect(shouldOfferRecovery(draft('x', { savedAt: 5000 }), doc, 1000)).toBe(true);
    expect(shouldOfferRecovery(draft('x', { savedAt: 500 }), doc, 1000)).toBe(false);
    expect(shouldOfferRecovery(draft('x', { savedAt: 500 }), doc, null)).toBe(true);
  });
});

describe('IndexedDB unavailable', () => {
  it.each([
    ['open() throws', throwingIndexedDb],
    ['open() fails', failingIndexedDb],
    ['indexedDB missing', undefined],
  ])('%s: every call resolves to "no draft" and the editor stays usable', async (_l, factory) => {
    install(factory);
    expect(await putPhotoDraft(draft('x'))).toBe(false);
    expect(await getPhotoDraft('x')).toBeNull();
    expect(await deletePhotoDraft('x')).toBe(false);
    expect(await listPhotoDrafts()).toEqual([]);
    expect(await prunePhotoDrafts()).toBe(0);
    const store = createPhotoStore();
    store.getState().load('x', newPhotoDoc(10, 10));
    const writer = createDraftWriter(() => void putPhotoDraft(draft('x')), 5);
    store.getState().mutate('e', () => edited());
    writer.notifyChange();
    writer.flush();
    expect(store.getState().doc?.layers).toHaveLength(1);
    store.getState().undo();
    expect(store.getState().doc?.layers).toHaveLength(0);
    writer.dispose();
  });
});

describe('createDraftWriter', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  it('debounces 2 s after the last change; flush writes now', () => {
    expect(PHOTO_DRAFT_DEBOUNCE_MS).toBe(2000);
    const write = vi.fn();
    const w = createDraftWriter(write);
    w.notifyChange();
    vi.advanceTimersByTime(1500);
    w.notifyChange();
    vi.advanceTimersByTime(1500);
    expect(write).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(write).toHaveBeenCalledTimes(1);
    w.notifyChange();
    w.flush();
    expect(write).toHaveBeenCalledTimes(2);
  });
});
