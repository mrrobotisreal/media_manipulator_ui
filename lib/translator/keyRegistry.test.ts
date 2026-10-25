import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { locales } from '@/i18n/locales';
import { MAX_MARKER_INDEX } from './markerCodec';
import {
  KeyRegistry,
  fnv1a32,
  leafKeys,
  localeSlot,
  markerIndex,
  pluralBase,
  shouldMarkKey,
  withPluralForms,
} from './keyRegistry';

const LOCALES_DIR = join(__dirname, '..', '..', 'i18n', 'locales');
const NAMESPACES = ['interface', 'error', 'accessibility'];

/** Union of every locale's shard keys, `ns:key`, plural forms expanded. */
function allShardKeys(): string[] {
  const all = new Set<string>();
  for (const dir of readdirSync(LOCALES_DIR)) {
    for (const ns of NAMESPACES) {
      for (const file of readdirSync(join(LOCALES_DIR, dir, ns))) {
        if (!file.endsWith('.json')) continue;
        const tree = JSON.parse(readFileSync(join(LOCALES_DIR, dir, ns, file), 'utf8'));
        for (const key of withPluralForms(leafKeys(tree))) all.add(`${ns}:${key}`);
      }
    }
  }
  return [...all];
}

describe('key registry index', () => {
  it('is collision-free over every shard key of every locale (bump HASH_SEED if this fails)', () => {
    const keys = allShardKeys();
    expect(keys.length).toBeGreaterThan(3000);
    const seen = new Map<number, string>();
    for (const k of keys) {
      const h = fnv1a32(k);
      const prev = seen.get(h);
      expect(prev, `hash collision between ${prev} and ${k}`).toBeUndefined();
      seen.set(h, k);
    }
  });

  it('packs the locale slot above a 32-bit hash and stays inside the codec range', () => {
    expect(localeSlot('en-US')).toBe(0);
    expect(localeSlot('ar-sa')).toBe(locales.findIndex((l) => l.code === 'ar-SA'));
    expect(localeSlot('xx-XX')).toBe(255);
    const i = markerIndex({ ns: 'interface', key: 'a.b', lng: 'xx-XX' });
    expect(i).toBeLessThanOrEqual(MAX_MARKER_INDEX);
    expect(Math.floor(i / 2 ** 32)).toBe(255);
  });

  it('is a pure function of (ns, resolved key, lng)', () => {
    const ref = { ns: 'interface', key: 'items_few', lng: 'ar-SA' };
    expect(markerIndex(ref)).toBe(markerIndex({ ...ref }));
    expect(markerIndex(ref)).not.toBe(markerIndex({ ...ref, key: 'items_other' }));
    expect(markerIndex(ref)).not.toBe(markerIndex({ ...ref, lng: 'he-IL' }));
    expect(markerIndex(ref)).not.toBe(markerIndex({ ...ref, ns: 'error' }));
  });

  it('resolves markers it did not mint from the seeded shard table', () => {
    const reg = new KeyRegistry();
    reg.seedFromResources('interface', { nav: { home: 'Home' }, items_one: 'x', items_other: 'y' });
    const idx = markerIndex({ ns: 'interface', key: 'items_many', lng: 'ar-SA' });
    expect(reg.resolve(idx)).toMatchObject({ ns: 'interface', key: 'items_many', lng: 'ar-SA' });
    expect(reg.resolve(markerIndex({ ns: 'interface', key: 'nav.home', lng: 'de-DE' }))?.key).toBe('nav.home');
    expect(reg.resolve(markerIndex({ ns: 'interface', key: 'nope', lng: 'de-DE' }))).toBeUndefined();
  });

  it('record() keeps the raw template and params and notifies once per new key', () => {
    const reg = new KeyRegistry();
    const seen: string[] = [];
    reg.subscribe((e) => seen.push(e.key));
    const ref = { ns: 'interface', key: 'greet', lng: 'de-DE' };
    reg.record(ref, { template: 'Hallo {{name}}', params: { name: 'A' } });
    reg.record(ref, { params: { name: 'B' } });
    expect(seen).toEqual(['greet']);
    expect(reg.get(ref)).toMatchObject({ template: 'Hallo {{name}}', params: { name: 'B' } });
  });

  it('helpers: plural base, plural expansion, identifier leaves', () => {
    expect(pluralBase('items_few')).toBe('items');
    expect(pluralBase('items_fewer')).toBe('items_fewer');
    expect(withPluralForms(['a_one'])).toEqual(
      expect.arrayContaining(['a_zero', 'a_one', 'a_two', 'a_few', 'a_many', 'a_other']),
    );
    expect(shouldMarkKey('privacyPolicy.sections.2.id')).toBe(false);
    expect(shouldMarkKey('privacyPolicy.sections.2.title')).toBe(true);
    // Machine-readable values (they end up in href="mailto:…" / href="…").
    expect(shouldMarkKey('privacyPolicy.sections.9.contactEmail', 'privacy@media-manipulator.com')).toBe(false);
    expect(shouldMarkKey('x.link', 'https://www.media-manipulator.com/pricing')).toBe(false);
    expect(shouldMarkKey('x.body', 'Write to support@media-manipulator.com any time')).toBe(true);
    expect(shouldMarkKey('x.unit', '/mo')).toBe(true);
    expect(leafKeys({ a: ['x', { b: 'y' }] })).toEqual(['a.0', 'a.1.b']);
  });
});
