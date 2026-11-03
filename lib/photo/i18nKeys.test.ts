/**
 * Every `t('photo.…')` key the editor uses exists in the en-US `panels` shard
 * (the parity suite then guarantees every other locale has it), no locale ships
 * a `TODO(i18n)` or untranslated English under `panels.photo.*`, and the brand
 * is only ever interpolated.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import panels from '@/i18n/locales/en-us/interface/panels.json';
import { locales } from '@/i18n/locales';
import { LAYER_TYPES } from './photoTypes';

const ROOT = join(__dirname, '..', '..');
const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((e) => {
    const full = join(dir, e);
    return statSync(full).isDirectory() ? files(full) : /\.tsx?$/.test(e) && !/\.test\./.test(e) ? [full] : [];
  });

const has = (key: string, tree: unknown = panels): boolean => {
  let node: unknown = tree;
  for (const part of key.split('.')) {
    if (typeof node !== 'object' || node === null) return false;
    const obj = node as Record<string, unknown>;
    node = part in obj ? obj[part] : obj[`${part}_other`] !== undefined ? obj[`${part}_other`] : undefined;
  }
  return typeof node === 'string';
};

const leaves = (o: unknown, path = ''): Array<[string, string]> =>
  typeof o === 'string' ? [[path, o]] : o && typeof o === 'object' ? Object.entries(o).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k)) : [];

describe('photo i18n keys', () => {
  const src = [...files(join(ROOT, 'components/photo')), ...files(join(ROOT, 'lib/photo'))].map((f) => readFileSync(f, 'utf8')).join('\n');
  const literal = Array.from(src.matchAll(/t\(\s*['"`](photo\.[A-Za-z0-9_.]+)['"`]/g), (m) => m[1]);

  it('finds the editor keys', () => expect(literal.length).toBeGreaterThan(80));
  it.each(Array.from(new Set(literal)).map((k) => [k]))('%s exists in en-US panels.json', (key) => expect(has(key)).toBe(true));

  it('covers the dynamic keys (panel tabs, layer types, blend modes, ranges, params)', () => {
    for (const p of ['basic', 'curves', 'levels', 'hsl', 'colorBalance', 'blackWhite', 'channelMixer', 'photoFilter', 'splitTone', 'lut', 'effects', 'layers']) expect(has(`photo.panels.${p}`), p).toBe(true);
    for (const t of LAYER_TYPES) expect(has(`photo.layers.type.${t}`), t).toBe(true);
    for (const m of ['normal', 'luminosity', 'color']) expect(has(`photo.layers.blendMode.${m}`), m).toBe(true);
    for (const r of ['reds', 'yellows', 'greens', 'cyans', 'blues', 'magentas']) expect(has(`photo.hsl.range.${r}`), r).toBe(true);
    for (const c of ['master', 'r', 'g', 'b']) {
      expect(has(`photo.curves.channel.${c}`), c).toBe(true);
      expect(has(`photo.levels.channel.${c}`), c).toBe(true);
    }
    for (const f of ['warming', 'cooling', 'sepia', 'red', 'green', 'blue']) expect(has(`photo.photoFilter.${f}`), f).toBe(true);
  });

  it('en-US carries the beta label', () => expect(has('photo.beta')).toBe(true));
});

describe('photo copy in every locale (zero English, zero TODO)', () => {
  for (const l of locales.filter((x) => x.code !== 'en-US')) {
    it(`${l.code}: no TODO(i18n) and no untranslated string under photo.*`, () => {
      const dir = l.code.toLowerCase();
      const loc = JSON.parse(readFileSync(join(ROOT, 'i18n/locales', dir, 'interface/panels.json'), 'utf8')).photo;
      const en = leaves(panels.photo);
      const got = new Map(leaves(loc));
      expect(JSON.stringify(loc)).not.toContain('TODO(i18n)');
      const same = en.filter(([k, v]) => got.get(k) === v && /[A-Za-z]{4,}/.test(v.replace(/\{\{\s*\w+\s*\}\}/g, '')));
      // Genuine cognates / loanwords that are spelled the same in the Latin-script locales
      // (reviewed: "Beta", "Gamma", "Sepia", "Normal", "Original", "Format", "Magentas", ...).
      // CJK, Cyrillic, Arabic, Hebrew and Hindi never match, so any hit there is a real miss.
      const COGNATE_KEYS = /(^|\.)(beta|gamma|sepia|balance|normal|original|format|vignette|texture|grain|color|hsl|vibrance|saturation|cyans|magentas|monochrome|point|offset|type\.(hsl|gamma|texture|grain|vignette|vibranceSaturation)|(params\.)?vibranceSaturation\.(title|vibrance|saturation))$/;
      const CJK_OR_NON_LATIN = /^(ar-SA|he-IL|hi-IN|ja-JP|ko-KR|ru-RU|uk-UA|zh-CN|zh-TW)$/;
      const bad = same.filter(([k]) => CJK_OR_NON_LATIN.test(l.code) || !COGNATE_KEYS.test(k)).map(([k]) => k);
      expect(bad).toEqual([]);
      const comps = JSON.parse(readFileSync(join(ROOT, 'i18n/locales', dir, 'interface/components.json'), 'utf8'));
      expect(String(comps.resultPanel.openInPhoto)).toContain('{{brand}}');
    });
  }
});
