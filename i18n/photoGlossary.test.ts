/**
 * MM100 decision 8: one glossary per locale for the Aperture editor chrome. Mask, Layer, Preset,
 * Heal, Curves and Levels are each translated once and reused; no two of the six share a word
 * (Italian once used "Livelli" for both Layers and Levels), and the places that name the same
 * thing (the panel tab, its title, the layers tab) agree.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { locales } from '@/i18n/locales';

type Tree = { [k: string]: string | Tree };
const load = (code: string) =>
  (JSON.parse(readFileSync(join(__dirname, 'locales', code.toLowerCase(), 'interface', 'panels.json'), 'utf8')) as { photo: Tree }).photo;
const at = (t: Tree, path: string): string => {
  let cur: string | Tree = t;
  for (const k of path.split('.')) cur = (cur as Tree)[k];
  if (typeof cur !== 'string') throw new Error(`photo.${path} is not a string`);
  return cur;
};

const TERMS: Record<string, string> = {
  layer: 'layers.title',
  mask: 'masks.title',
  preset: 'panels.presets',
  heal: 'heal.title',
  curves: 'panels.curves',
  levels: 'panels.levels',
};

describe.each(locales.map((l) => [l.code]))('Aperture glossary (%s)', (code) => {
  const p = load(code);

  it('has the six glossary terms, all different', () => {
    const values = Object.values(TERMS).map((path) => at(p, path).trim().toLowerCase());
    for (const v of values) expect(v.length).toBeGreaterThan(0);
    expect(new Set(values).size).toBe(values.length);
  });

  it('names the same thing the same way in every place it appears', () => {
    expect(at(p, 'panels.layers')).toBe(at(p, 'layers.title'));
    expect(at(p, 'bar.layersTab')).toBe(at(p, 'layers.title'));
    expect(at(p, 'panels.heal')).toBe(at(p, 'heal.title'));
    expect(at(p, 'panels.curves')).toBe(at(p, 'layers.type.curves'));
    expect(at(p, 'panels.levels')).toBe(at(p, 'layers.type.levels'));
  });
});
