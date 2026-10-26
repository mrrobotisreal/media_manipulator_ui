import { describe, expect, it } from 'vitest';

import { createFakeTranslatorApi } from './api';
import { clearTranslatorEvents, getTranslatorEvents } from './devEvents';
import { openDraftStore } from './draftStore';
import { SearchIndex, normalizeForSearch } from './search';
import { createFakeIndexedDb } from './testing/fakeIndexedDb';
import { makeModel, shard } from './testing/fixtures';

const en = { 'hero.title': 'Compress images', 'hero.body': 'Fast, private {{size}} compression', 'cafe': 'Café menu' };

describe('workbench model: drafts, revert, base SHAs', () => {
  it('a draft exists iff it differs from its base value; revert restores it and emits translator_reverted', async () => {
    clearTranslatorEvents();
    const model = await makeModel('de-DE', [shard('de-DE', 'interface/pages', en)]);
    const id = 'i18n/locales/de-de/interface/pages.json|hero.title';
    model.edit(id, 'Bilder komprimieren');
    expect(model.isModified(id)).toBe(true);
    expect(model.changes()).toEqual([
      expect.objectContaining({ file: 'i18n/locales/de-de/interface/pages.json', key: 'hero.title', value: 'Bilder komprimieren', baseValue: 'Compress images' }),
    ]);
    model.edit(id, 'Compress images');
    expect(model.isModified(id)).toBe(false);
    model.edit(id, 'Bilder');
    model.revert(id);
    expect(model.isModified(id)).toBe(false);
    expect(model.valueOf(id)).toBe('Compress images');
    expect(getTranslatorEvents().map((e) => e.name)).toEqual(['translator_key_edited', 'translator_reverted']);
  });

  it('validators run on every edit and never block it (warnings only)', async () => {
    const model = await makeModel('de-DE', [shard('de-DE', 'interface/pages', en)]);
    const id = 'i18n/locales/de-de/interface/pages.json|hero.body';
    model.edit(id, '');
    expect(model.valueOf(id)).toBe('');
    expect(model.warnings(id).map((w) => w.code)).toEqual(['empty']);
    model.edit(id, ' Schnelle Komprimierung');
    expect(model.valueOf(id)).toBe(' Schnelle Komprimierung');
    expect(model.warnings(id).map((w) => w.code).sort()).toEqual(['placeholder_missing', 'whitespace_drift']);
    expect(model.changes()[0].warnings).toHaveLength(2);
  });

  it('drafts and base SHAs survive a reload through the draft store (fake IndexedDB)', async () => {
    const idb = createFakeIndexedDb();
    const api = createFakeTranslatorApi({ base: { ok: true, base: { sha: 'abc1234def', files: { 'i18n/locales/ar-sa/interface/pages.json': 'blob1' } } } });
    const shards = [shard('ar-SA', 'interface/pages', en)];
    const store1 = await openDraftStore({ indexedDB: idb.asFactory() });
    const m1 = await makeModel('ar-SA', shards, { store: store1, api, getIdToken: async () => 'tok' });
    await m1.onPanelOpened();
    expect(api.calls.base).toEqual(['tok']);
    m1.edit('i18n/locales/ar-sa/interface/pages.json|hero.title', 'ضغط الصور');
    await m1.flush();
    store1.close();

    const store2 = await openDraftStore({ indexedDB: idb.asFactory() });
    const m2 = await makeModel('ar-SA', shards, { store: store2, api, getIdToken: async () => 'tok' });
    expect(m2.valueOf('i18n/locales/ar-sa/interface/pages.json|hero.title')).toBe('ضغط الصور');
    expect(m2.base).toMatchObject({ sha: 'abc1234def', files: { 'i18n/locales/ar-sa/interface/pages.json': 'blob1' } });
    // Pending drafts pin the stored base: the first open does not re-fetch it.
    await m2.onPanelOpened();
    expect(api.calls.base).toEqual(['tok']);
    await m2.refreshBase();
    expect(api.calls.base).toEqual(['tok', 'tok']);
    expect(m2.storage.persistent).toBe(true);
  });

  it('a draft whose deployed base moved is flagged "changed upstream"', async () => {
    const idb = createFakeIndexedDb();
    const s1 = await openDraftStore({ indexedDB: idb.asFactory() });
    const m1 = await makeModel('de-DE', [shard('de-DE', 'interface/pages', en)], { store: s1 });
    m1.edit('i18n/locales/de-de/interface/pages.json|hero.title', 'Bilder');
    await m1.flush();
    s1.close();
    const s2 = await openDraftStore({ indexedDB: idb.asFactory() });
    const m2 = await makeModel('de-DE', [shard('de-DE', 'interface/pages', en, { ...en, 'hero.title': 'Bilder verkleinern' })], { store: s2 });
    expect(m2.upstreamChanged('i18n/locales/de-de/interface/pages.json|hero.title')).toBe(true);
  });
});

describe('search (decision 3)', () => {
  it('matches key, English or translation, case- and diacritic-insensitively', async () => {
    const model = await makeModel('de-DE', [shard('de-DE', 'interface/pages', en)]);
    const ids = model.table.entries.map((e) => e.id);
    expect(model.search.filter(ids, 'HERO.TITLE')).toHaveLength(1);
    expect(model.search.filter(ids, 'cafe')).toEqual([expect.stringContaining('|cafe')]);
    expect(model.search.filter(ids, 'CAFÉ')).toHaveLength(1);
    model.edit(ids[0], 'Bilder verkleinern');
    expect(model.search.filter(ids, 'verkleinern')).toEqual([ids[0]]);
    expect(normalizeForSearch('Ünïcödé')).toBe('unicode');
  });

  it('builds a 5,000-key index and filters it well under 50 ms per keystroke', () => {
    const items = Array.from({ length: 5000 }, (_, i) => ({ id: `f|k${i}`, key: `k${i}`, english: `English text ${i}` }));
    const index = new SearchIndex(items, () => 'Übersetzung');
    const ids = items.map((i) => i.id);
    const t0 = performance.now();
    for (const q of ['e', 'en', 'eng', 'engl', 'text 4']) index.filter(ids, q);
    expect((performance.now() - t0) / 5).toBeLessThan(50);
  });
});
