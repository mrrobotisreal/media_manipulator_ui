/**
 * MM52's hand-off: markers in server-rendered HTML resolve only once the panel
 * seeds the registry from the locale's shards. The session does that before the
 * scanner's first pass.
 */
import { afterEach, describe, expect, it } from 'vitest';

import { createMemoryDraftStore } from './draftStore';
import { KeyRegistry, markerIndex } from './keyRegistry';
import { appendMarker } from './markerCodec';
import { loadTranslatorShards } from './shardSource';
import { startWorkbenchSession, type WorkbenchSession } from './workbenchSession';

let session: WorkbenchSession | null = null;
afterEach(() => {
  session?.dispose();
  session = null;
  document.body.innerHTML = '';
});

describe('workbench session', () => {
  it('seeds the registry from the real ar-SA shards so server markers (pages.json) resolve', async () => {
    const registry = new KeyRegistry();
    const index = markerIndex({ ns: 'interface', key: 'account.verify.title', lng: 'ar-SA' });
    document.body.innerHTML = `<h2 id="h">${appendMarker('Operator access is waiting on email verification', index)}</h2>`;
    expect(registry.resolve(index)).toBeUndefined();
    session = await startWorkbenchSession({
      locale: 'ar-SA',
      i18n: null,
      api: null,
      getIdToken: async () => null,
      shards: await loadTranslatorShards('ar-SA'),
      store: createMemoryDraftStore(null),
      registry,
      scanImmediately: true,
    });
    expect(session.model.pageKeys().map((p) => p.entryId)).toEqual(['i18n/locales/ar-sa/interface/pages.json|account.verify.title']);
    session.model.edit(session.model.pageKeys()[0].entryId, 'الوصول بانتظار التحقق');
    expect(document.getElementById('h')!.textContent).toBe('الوصول بانتظار التحقق');
  });

  it('markers from another page language are reported, not listed', async () => {
    const registry = new KeyRegistry();
    document.body.innerHTML = `<p>${appendMarker('Hello', markerIndex({ ns: 'interface', key: 'x.y', lng: 'en-US' }))}</p>`;
    session = await startWorkbenchSession({
      locale: 'ar-SA',
      i18n: null,
      api: null,
      getIdToken: async () => null,
      shards: [{ shard: 'interface/pages', ns: 'interface', file: 'f', englishFile: 'e', english: { 'x.y': 'Hello' }, values: { 'x.y': 'Hello' } }],
      store: createMemoryDraftStore(null),
      registry,
      scanImmediately: true,
    });
    expect(session.model.pageKeys()).toEqual([]);
    expect(session.model.pageForeignLanguages).toEqual(['en-US']);
  });
});
