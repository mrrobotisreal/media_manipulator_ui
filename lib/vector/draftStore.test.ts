import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  VECTOR_DRAFT_DEBOUNCE_MS,
  createDraftWriter,
  deleteVectorDraft,
  draftKey,
  getVectorDraft,
  listVectorDrafts,
  pruneVectorDrafts,
  putVectorDraft,
  type VectorDraft,
} from './draftStore';
import { evaluateVectorDraft, summarizeVectorDraft } from './draftRecovery';
import { createVectorStore } from './vectorStore';
import { parseVectorDoc, type VectorDoc } from './vectorTypes';
import { FakeIDBFactory, failingIndexedDb, throwingIndexedDb } from './testing/fakeIndexedDb';

const blank = (): VectorDoc => {
  const r = parseVectorDoc({ version: 1 });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};
const withRect = (): VectorDoc => ({
  ...blank(),
  layers: [{ type: 'rect', id: 'r1', x: 0, y: 0, width: 10, height: 10 }],
});
const draft = (projectId: string, over: Partial<VectorDraft> = {}): VectorDraft => ({
  projectId,
  name: 'Logo',
  savedAt: 1_000,
  baseRevision: null,
  document: withRect(),
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
const install = (factory: unknown) =>
  Object.defineProperty(globalThis, 'indexedDB', { value: factory, configurable: true, writable: true });

describe('vector draftStore with a fake IndexedDB', () => {
  beforeEach(() => install(new FakeIDBFactory()));

  it('uses the vector-draft:<projectId> key', () => {
    expect(draftKey('abc')).toBe('vector-draft:abc');
  });

  it('writes and recovers a draft', async () => {
    expect(await putVectorDraft(draft('p1'))).toBe(true);
    const got = await getVectorDraft('p1');
    expect(got).toMatchObject({ projectId: 'p1', name: 'Logo', savedAt: 1_000, baseRevision: null });
    expect(got?.document.layers[0]).toMatchObject({ id: 'r1' });
  });

  it('returns null for a missing draft and deletes drafts', async () => {
    expect(await getVectorDraft('nope')).toBeNull();
    await putVectorDraft(draft('p2'));
    expect(await deleteVectorDraft('p2')).toBe(true);
    expect(await getVectorDraft('p2')).toBeNull();
  });

  it('discards a corrupt draft instead of returning it', async () => {
    await putVectorDraft({ ...draft('p3'), document: { version: 99 } as unknown as VectorDoc });
    expect(await getVectorDraft('p3')).toBeNull();
    expect(await listVectorDrafts()).toEqual([]);
  });

  it('lists drafts newest first and prunes old ones', async () => {
    await putVectorDraft(draft('a', { savedAt: 10 }));
    await putVectorDraft(draft('b', { savedAt: 30 }));
    await putVectorDraft(draft('c', { savedAt: 20 }));
    expect((await listVectorDrafts()).map((d) => d.projectId)).toEqual(['b', 'c', 'a']);
    expect(await pruneVectorDrafts(2, 365, 40)).toBe(1);
    expect((await listVectorDrafts()).map((d) => d.projectId)).toEqual(['b', 'c']);
  });
});

describe('IndexedDB unavailable', () => {
  it.each([
    ['open() throws', throwingIndexedDb],
    ['open() fails', failingIndexedDb],
    ['indexedDB missing', undefined],
  ])('%s: every call resolves to "no draft" and the editor stays usable', async (_label, factory) => {
    install(factory);
    expect(await putVectorDraft(draft('x'))).toBe(false);
    expect(await getVectorDraft('x')).toBeNull();
    expect(await deleteVectorDraft('x')).toBe(false);
    expect(await listVectorDrafts()).toEqual([]);
    expect(await pruneVectorDrafts()).toBe(0);

    // The editor keeps working: edits, undo and the debounced writer still run.
    const store = createVectorStore();
    store.getState().load('x', blank());
    const writer = createDraftWriter(() => void putVectorDraft(draft('x')), 5);
    store.getState().addLayers([{ type: 'rect', id: 'r', x: 0, y: 0, width: 1, height: 1 }], 'Draw rect');
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

  it('debounces 2 s after the last change', () => {
    expect(VECTOR_DRAFT_DEBOUNCE_MS).toBe(2000);
    const write = vi.fn();
    const w = createDraftWriter(write);
    w.notifyChange();
    vi.advanceTimersByTime(1500);
    w.notifyChange();
    vi.advanceTimersByTime(1500);
    expect(write).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(write).toHaveBeenCalledTimes(1);
  });

  it('flushes a pending write immediately and is a no-op when clean', () => {
    const write = vi.fn();
    const w = createDraftWriter(write);
    w.flush();
    expect(write).not.toHaveBeenCalled();
    w.notifyChange();
    w.flush();
    expect(write).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(5000);
    expect(write).toHaveBeenCalledTimes(1);
  });

  it('never writes after dispose', () => {
    const write = vi.fn();
    const w = createDraftWriter(write);
    w.notifyChange();
    w.dispose();
    vi.advanceTimersByTime(5000);
    w.flush();
    expect(write).not.toHaveBeenCalled();
  });
});

describe('evaluateVectorDraft', () => {
  it('decides none / discard / recover', () => {
    expect(evaluateVectorDraft(null, blank())).toBe('none');
    expect(evaluateVectorDraft(draft('p', { document: blank() }), blank())).toBe('discard');
    expect(evaluateVectorDraft(draft('p'), blank())).toBe('recover');
    expect(evaluateVectorDraft(draft('p'), null)).toBe('recover');
    expect(evaluateVectorDraft(draft('p', { savedAt: 5 }), blank(), 10)).toBe('discard');
  });

  it('summarises nested layers', () => {
    const doc: VectorDoc = {
      ...blank(),
      layers: [{ type: 'group', id: 'g', children: [{ type: 'rect', id: 'r', x: 0, y: 0, width: 1, height: 1 }] }],
    };
    expect(summarizeVectorDraft(doc)).toEqual({ layers: 1, totalLayers: 2 });
  });
});
