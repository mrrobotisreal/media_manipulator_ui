import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createFakeIndexedDb, type FakeIndexedDbOptions } from './testing/fakeIndexedDb';
import {
  createMemoryDraftStore,
  draftId,
  openDraftStore,
  type BaseMeta,
  type DraftStore,
} from './draftStore';

const FILE_A = 'i18n/locales/de-de/interface/pages.json';
const FILE_B = 'i18n/locales/de-de/interface/common.json';

const draft = (locale: string, file: string, key: string, value = 'neu') => ({
  locale,
  file,
  key,
  value,
  baseValue: 'alt',
});

describe('draftStore', () => {
  it('drafts survive a reload (fake IndexedDB re-open) with base SHAs retained', async () => {
    const fake = createFakeIndexedDb();
    const factory = fake.asFactory();
    const s1 = await openDraftStore({ indexedDB: factory, now: () => 1000 });
    expect(s1.persistent).toBe(true);
    expect(s1.reason).toBeNull();
    await s1.put(draft('de-DE', FILE_A, 'a.b', 'x'));
    await s1.put(draft('de-DE', FILE_B, 'c', 'y'));
    await s1.put(draft('fr-FR', FILE_A, 'a.b', 'z'));
    const meta: BaseMeta = { locale: 'de-DE', sha: 'abc123', files: { [FILE_A]: 'blob1', [FILE_B]: 'blob2' }, fetchedAt: 5 };
    await s1.putMeta(meta);
    const before = await s1.list('de-DE');
    s1.close();

    const s2 = await openDraftStore({ indexedDB: factory });
    expect(s2.persistent).toBe(true);
    expect(await s2.list('de-DE')).toEqual(before);
    expect(before).toHaveLength(2);
    expect(await s2.list('fr-FR')).toHaveLength(1);
    expect(await s2.getMeta('de-DE')).toEqual(meta);
    expect(await s2.getMeta('fr-FR')).toBeUndefined();
  });

  it('MM56: the submit modal draft survives a reload, per locale, and clears', async () => {
    const fake = createFakeIndexedDb();
    const factory = fake.asFactory();
    const s1 = await openDraftStore({ indexedDB: factory, now: () => 42 });
    const saved = await s1.putSubmitDraft({
      locale: 'de-DE',
      open: true,
      description: 'Fix the German home page',
      acknowledged: ['a.b#identical'],
      confirmedConflicts: [`${FILE_A}|a.b`],
    });
    expect(saved.updatedAt).toBe(42);
    s1.close();

    const s2 = await openDraftStore({ indexedDB: factory });
    expect(await s2.getSubmitDraft('de-DE')).toEqual(saved);
    expect(await s2.getSubmitDraft('fr-FR')).toBeUndefined();
    await s2.clearSubmitDraft('de-DE');
    s2.close();

    const s3 = await openDraftStore({ indexedDB: factory });
    expect(await s3.getSubmitDraft('de-DE')).toBeUndefined();
  });

  it('MM56: a v1 database (drafts + meta only) upgrades to v2 with its drafts kept', async () => {
    const fake = createFakeIndexedDb();
    // Build a v1 database by hand, as MM53/MM54 deployments left it.
    await new Promise<void>((resolve) => {
      const req = fake.open('mm-translator-drafts', 1) as unknown as {
        result: IDBDatabase;
        onupgradeneeded: (() => void) | null;
        onsuccess: (() => void) | null;
      };
      req.onupgradeneeded = () => {
        req.result.createObjectStore('drafts', { keyPath: 'id' });
        req.result.createObjectStore('meta', { keyPath: 'locale' });
      };
      req.onsuccess = () => {
        const tx = req.result.transaction(['drafts'], 'readwrite');
        tx.objectStore('drafts').put({ ...draft('de-DE', FILE_A, 'a.b', 'kept'), updatedAt: 1, id: `de-DE|${FILE_A}|a.b` });
        tx.oncomplete = () => {
          req.result.close();
          resolve();
        };
      };
    });
    const s = await openDraftStore({ indexedDB: fake.asFactory() });
    expect(s.persistent).toBe(true);
    expect((await s.list('de-DE')).map((d) => d.value)).toEqual(['kept']);
    await s.putSubmitDraft({ locale: 'de-DE', open: false, description: 'x', acknowledged: [], confirmedConflicts: [] });
    expect(s.persistent).toBe(true);
  });

  it('MM56: memory fallback keeps the submit draft for the page lifetime', async () => {
    const s = createMemoryDraftStore('unavailable');
    await s.putSubmitDraft({ locale: 'ar-SA', open: true, description: 'وصف', acknowledged: [], confirmedConflicts: [] });
    expect((await s.getSubmitDraft('ar-SA'))?.description).toBe('وصف');
  });

  it('put/get/remove behave and updatedAt uses the injected now()', async () => {
    const store = await openDraftStore({ indexedDB: createFakeIndexedDb().asFactory(), now: () => 4242 });
    const saved = await store.put(draft('de-DE', FILE_A, 'k'));
    expect(saved.updatedAt).toBe(4242);
    expect((await store.get('de-DE', FILE_A, 'k'))?.value).toBe('neu');
    const explicit = await store.put({ ...draft('de-DE', FILE_A, 'k', 'v2'), updatedAt: 7 });
    expect(explicit.updatedAt).toBe(7);
    expect((await store.get('de-DE', FILE_A, 'k'))?.value).toBe('v2');
    await store.remove('de-DE', FILE_A, 'k');
    expect(await store.get('de-DE', FILE_A, 'k')).toBeUndefined();
    expect(draftId('de-DE', FILE_A, 'k')).toBe(`de-DE|${FILE_A}|k`);
  });

  it('list is per-locale and sorted by file then key', async () => {
    const store = await openDraftStore({ indexedDB: createFakeIndexedDb().asFactory() });
    await store.put(draft('de-DE', FILE_A, 'z'));
    await store.put(draft('de-DE', FILE_A, 'a'));
    await store.put(draft('de-DE', FILE_B, 'm'));
    await store.put(draft('fr-FR', FILE_A, 'q'));
    const list = await store.list('de-DE');
    expect(list.map((d) => `${d.file}#${d.key}`)).toEqual([`${FILE_B}#m`, `${FILE_A}#a`, `${FILE_A}#z`]);
  });

  it('clear(locale) removes only that locale and clear(locale, keys) removes only those keys, persisted', async () => {
    const factory = createFakeIndexedDb().asFactory();
    const store = await openDraftStore({ indexedDB: factory });
    await store.put(draft('de-DE', FILE_A, 'a'));
    await store.put(draft('de-DE', FILE_A, 'b'));
    await store.put(draft('de-DE', FILE_B, 'c'));
    await store.put(draft('fr-FR', FILE_A, 'a'));
    await store.clear('de-DE', [{ file: FILE_A, key: 'a' }, { file: FILE_B, key: 'c' }]);
    expect((await store.list('de-DE')).map((d) => d.key)).toEqual(['b']);
    store.close();
    const again = await openDraftStore({ indexedDB: factory });
    expect((await again.list('de-DE')).map((d) => d.key)).toEqual(['b']);
    await again.clear('de-DE');
    expect(await again.list('de-DE')).toEqual([]);
    expect(await again.list('fr-FR')).toHaveLength(1);
    again.close();
    const third = await openDraftStore({ indexedDB: factory });
    expect(await third.list('de-DE')).toEqual([]);
    expect(await third.list('fr-FR')).toHaveLength(1);
  });

  async function expectMemoryFallback(store: DraftStore, reason: string) {
    expect(store.persistent).toBe(false);
    expect(store.reason).toBe(reason);
    await store.put(draft('de-DE', FILE_A, 'k', 'mem'));
    await store.putMeta({ locale: 'de-DE', sha: 's', files: {}, fetchedAt: 1 });
    expect((await store.get('de-DE', FILE_A, 'k'))?.value).toBe('mem');
    expect((await store.getMeta('de-DE'))?.sha).toBe('s');
    expect(await store.list('de-DE')).toHaveLength(1);
  }

  it('falls back to memory with reason unavailable when indexedDB is null', async () => {
    await expectMemoryFallback(await openDraftStore({ indexedDB: null }), 'unavailable');
  });

  it('falls back to memory with reason unavailable when indexedDB is undefined globally', async () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, 'indexedDB');
    Object.defineProperty(globalThis, 'indexedDB', { value: undefined, configurable: true, writable: true });
    try {
      await expectMemoryFallback(await openDraftStore(), 'unavailable');
    } finally {
      if (original) Object.defineProperty(globalThis, 'indexedDB', original);
      else delete (globalThis as { indexedDB?: unknown }).indexedDB;
    }
  });

  const failing: Array<[FakeIndexedDbOptions['failOpen'], string, string]> = [
    ['throw', 'open() throws', 'open_failed'],
    ['error', 'open fires error', 'open_failed'],
    ['blocked', 'open is blocked', 'blocked'],
    ['hang', 'open hangs past openTimeoutMs', 'open_timeout'],
  ];
  for (const [mode, label, reason] of failing) {
    it(`falls back to memory (persistent false, reason ${reason}) when ${label}`, async () => {
      const fake = createFakeIndexedDb({ failOpen: mode });
      const store = await openDraftStore({ indexedDB: fake.asFactory(), openTimeoutMs: 30 });
      await expectMemoryFallback(store, reason);
    });
  }

  it('a write failure after open flips persistent to false, notifies subscribers and keeps data in memory', async () => {
    const fake = createFakeIndexedDb();
    const store = await openDraftStore({ indexedDB: fake.asFactory() });
    await store.put(draft('de-DE', FILE_A, 'old', 'kept'));
    const events: Array<{ persistent: boolean; reason: string | null }> = [];
    const unsubscribe = store.subscribe((s) => events.push(s));
    fake.failWrites = true;
    const saved = await store.put(draft('de-DE', FILE_A, 'new', 'fresh'));
    expect(saved.value).toBe('fresh');
    expect(store.persistent).toBe(false);
    expect(store.reason).toBe('write_failed');
    expect(events).toEqual([{ persistent: false, reason: 'write_failed' }]);
    expect((await store.get('de-DE', FILE_A, 'new'))?.value).toBe('fresh');
    expect((await store.get('de-DE', FILE_A, 'old'))?.value).toBe('kept');
    await store.put(draft('de-DE', FILE_A, 'third'));
    expect(events).toHaveLength(1);
    unsubscribe();
  });

  it('unsubscribed listeners are not notified', async () => {
    const fake = createFakeIndexedDb();
    const store = await openDraftStore({ indexedDB: fake.asFactory() });
    let calls = 0;
    store.subscribe(() => calls++)();
    fake.failWrites = true;
    await store.put(draft('de-DE', FILE_A, 'k'));
    expect(calls).toBe(0);
  });

  it('stored values are copies: mutating returned records does not change the store', async () => {
    const store = await openDraftStore({ indexedDB: createFakeIndexedDb().asFactory() });
    const input = draft('de-DE', FILE_A, 'k', 'orig');
    const saved = await store.put(input);
    input.value = 'mutated-input';
    saved.value = 'mutated-saved';
    const got = await store.get('de-DE', FILE_A, 'k');
    expect(got?.value).toBe('orig');
    got!.value = 'mutated-got';
    (await store.list('de-DE'))[0].value = 'mutated-list';
    expect((await store.get('de-DE', FILE_A, 'k'))?.value).toBe('orig');

    const meta: BaseMeta = { locale: 'de-DE', sha: 's', files: { [FILE_A]: 'b' }, fetchedAt: 1 };
    await store.putMeta(meta);
    meta.files[FILE_A] = 'changed';
    const m = await store.getMeta('de-DE');
    expect(m?.files[FILE_A]).toBe('b');
    m!.files[FILE_A] = 'changed2';
    expect((await store.getMeta('de-DE'))?.files[FILE_A]).toBe('b');
  });

  it('createMemoryDraftStore reports the given reason and works', async () => {
    const store = createMemoryDraftStore('custom', () => 9);
    expect(store.persistent).toBe(false);
    expect(store.reason).toBe('custom');
    expect((await store.put(draft('de-DE', FILE_A, 'k'))).updatedAt).toBe(9);
  });

  it('the module source has no static import except import type', () => {
    const src = readFileSync(join(__dirname, 'draftStore.ts'), 'utf8');
    const imports = src.split('\n').filter((l) => /^\s*(import|export\s.*\sfrom)\b/.test(l));
    for (const line of imports) expect(line).toMatch(/^\s*import type\b/);
    expect(src).not.toMatch(/\brequire\(|\bimport\(/);
  });
});
