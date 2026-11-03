import { describe, expect, it } from 'vitest';

import { canonicalPhotoDoc, newPhotoDoc, parsePhotoDoc } from './photoTypes';
import { docFixtures, inputFixtures, invalidFixtures, readFixture } from './fixtures/fixtures';

/** Input → expected canonical fixture (README "Files and copy rule"). */
const INPUT_TO_DOC: Record<string, string> = {
  'minimal.json': 'blank.json',
  'defaults.json': 'defaults.json',
  'clamp.json': 'clamped.json',
};

describe('PhotoDoc fixtures (shared contract with the Go sanitizer)', () => {
  it('has the 13 valid fixtures', () => {
    expect(docFixtures()).toHaveLength(13);
    expect(invalidFixtures()).toHaveLength(4);
  });

  it.each(docFixtures())('%s parses and its canonical JSON equals the committed bytes', (f) => {
    const text = readFixture('docs', f);
    const r = parsePhotoDoc(text);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(`${canonicalPhotoDoc(r.doc)}\n`).toBe(text);
    // idempotent
    const again = parsePhotoDoc(canonicalPhotoDoc(r.doc));
    expect(again.ok && canonicalPhotoDoc(again.doc)).toBe(canonicalPhotoDoc(r.doc));
  });

  it.each(invalidFixtures())('%s is refused', (f) => {
    expect(parsePhotoDoc(readFixture('docs', f)).ok).toBe(false);
  });

  it.each(inputFixtures())('input %s canonicalizes to its fixture', (f) => {
    const r = parsePhotoDoc(readFixture('inputs', f));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(`${canonicalPhotoDoc(r.doc)}\n`).toBe(readFixture('docs', INPUT_TO_DOC[f]));
  });

  it('unknown keys survive parse → canonical at every depth', () => {
    const r = parsePhotoDoc(readFixture('docs', 'unknown-fields.json'));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const json = canonicalPhotoDoc(r.doc);
    for (const k of ['futureTop', 'cameraHint', 'futureLayerKey', 'futureParam', 'softness', '"tag"', '"make"']) {
      expect(json).toContain(k);
    }
    expect(r.warnings).toContain('unknown key kept: futureTop');
  });

  it('refuses unknown versions, bad ids and duplicate layer ids', () => {
    expect(parsePhotoDoc({ version: 2, source: { width: 1, height: 1 } }).ok).toBe(false);
    expect(parsePhotoDoc({ version: 1, source: { width: 1, height: 1 }, layers: [{ id: 'a b', type: 'invert' }] }).ok).toBe(false);
    expect(
      parsePhotoDoc({ version: 1, source: { width: 1, height: 1 }, layers: [{ id: 'a', type: 'invert' }, { id: 'a', type: 'invert' }] }).ok,
    ).toBe(false);
  });

  it('writes -0 as 0 and sorts keys by code point', () => {
    const d = newPhotoDoc(2, 2);
    d.geometry.rotate = -0;
    const json = canonicalPhotoDoc(d);
    expect(json).toContain('"rotate":0');
    expect(json.startsWith('{"geometry"')).toBe(true);
  });
});
