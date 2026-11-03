import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { HANDOFF_MAX_AGE_MS, handoffHref, putHandoff, takeHandoff } from './handoff';
import { FakeIDBFactory, throwingIndexedDb } from '@/lib/vector/testing/fakeIndexedDb';

const original = globalThis.indexedDB;
const install = (f: unknown) => Object.defineProperty(globalThis, 'indexedDB', { value: f, configurable: true, writable: true });
const photo = () => new File([new Uint8Array([1, 2, 3, 4])], 'sunset.jpg', { type: 'image/jpeg' });

beforeEach(() => install(new FakeIDBFactory()));
afterEach(() => install(original));

describe('tool page -> editor hand-off (MM100)', () => {
  it('hands the file, panel and look over exactly once', async () => {
    expect(await putHandoff(photo(), 'hsl', 'color-pop-red', 1000)).toBe(true);
    const got = await takeHandoff(2000);
    expect(got?.file.name).toBe('sunset.jpg');
    expect(got?.file.type).toBe('image/jpeg');
    expect(got?.file.size).toBe(4);
    expect(got?.panel).toBe('hsl');
    expect(got?.preset).toBe('color-pop-red');
    expect(await takeHandoff(2001)).toBeNull();
  });

  it('ignores a stale record', async () => {
    await putHandoff(photo(), 'basic', null, 1000);
    expect(await takeHandoff(1000 + HANDOFF_MAX_AGE_MS + 1)).toBeNull();
  });

  it('drops an unknown panel and an unsafe look id instead of trusting them', async () => {
    await putHandoff(photo(), 'nope' as never, '../x', 1000);
    const got = await takeHandoff(1001);
    expect(got?.panel).toBeNull();
    expect(got?.preset).toBeNull();
  });

  it('reports failure (so the page falls back to the bare editor link) when storage is unavailable', async () => {
    install(throwingIndexedDb);
    expect(await putHandoff(photo(), 'basic', null)).toBe(false);
    expect(await takeHandoff()).toBeNull();
  });

  it('builds the unlocalized editor URL', () => {
    expect(handoffHref('hsl', 'color-pop-red')).toBe('/photo/new?handoff=1&panel=hsl&preset=color-pop-red');
    expect(handoffHref(null, null)).toBe('/photo/new?handoff=1');
  });
});
