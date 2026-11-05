/**
 * MM108: Aperture op vocabulary + apply engine. One test per op on fixture documents,
 * all-or-nothing, unknown ids, the strict-param errors the model reads, and the JSON Schema
 * the API validates with (identical bytes to the committed copies).
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { readFixture } from '@/lib/photo/fixtures/fixtures';
import { canonicalPhotoDoc, parsePhotoDoc, type PhotoDoc } from '@/lib/photo/photoTypes';
import type { Histogram } from '@/lib/photo/gl/histogram';

import { applyPhotoOps, greyExceptRanges, maskFromSpec } from './applyPhoto';
import { photoOpsJsonSchema, photoOpsProblems, PHOTO_OP_NAMES } from './photo';
import { API_OPS_SCHEMA_DIR, OPS_SCHEMA_DIR, buildOpsSchemaFiles } from './schemaFiles';

const doc = (name: string): PhotoDoc => {
  const r = parsePhotoDoc(readFixture('docs', name));
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};
const blank = () => doc('blank.json');
/** blank + one exposure layer `exp1` and one hsl layer `hsl1`. */
const twoLayers = (): PhotoDoc => {
  const r = applyPhotoOps(blank(), [
    { op: 'add_layer', type: 'exposure', params: { ev: 0.3 } },
    { op: 'add_layer', type: 'hsl' },
  ]);
  if (!r.ok) throw new Error(r.errors.join());
  return { ...r.doc, layers: r.doc.layers.map((l, i) => ({ ...l, id: i === 0 ? 'exp1' : 'hsl1' })) };
};
const ok = (d: PhotoDoc, ops: unknown, env = {}) => {
  const r = applyPhotoOps(d, ops, env);
  if (!r.ok) throw new Error(r.errors.join('; '));
  return r.doc;
};
const hist = (): Pick<Histogram, 'r' | 'g' | 'b' | 'luma'> => {
  const ch = () => {
    const a = new Uint32Array(256);
    for (let i = 30; i < 200; i += 1) a[i] = 10;
    return a;
  };
  return { r: ch(), g: ch(), b: ch(), luma: ch() };
};

describe('each op applies through the editor pure ops', () => {
  it('add_layer: a neutral layer with only the given params changed, mask and blend set', () => {
    const d = ok(blank(), [{ op: 'add_layer', type: 'tone', params: { shadows: 45 }, opacity: 0.8, blend: 'luminosity', name: 'Lift', mask: { components: [{ kind: 'radial', center: { x: 0.5, y: 0.4 }, rx: 0.3, ry: 0.3 }], feather: 10 } }]);
    const l = d.layers[0];
    expect(l.type).toBe('tone');
    expect(l.params).toEqual({ highlights: 0, shadows: 45, whites: 0, blacks: 0 });
    expect([l.opacity, l.blend, l.name]).toEqual([0.8, 'luminosity', 'Lift']);
    expect(l.mask && 'components' in l.mask && l.mask.components[0].kind).toBe('radial');
  });

  it('update_layer: params merge (nested too), flags and opacity patch, other layers untouched', () => {
    const base = twoLayers();
    const d = ok(base, [{ op: 'update_layer', layerId: 'exp1', params: { ev: -0.2 }, opacity: 0.5, enabled: false }]);
    expect(d.layers[0].params).toMatchObject({ ev: -0.2, offset: 0, gamma: 1 });
    expect([d.layers[0].opacity, d.layers[0].enabled]).toEqual([0.5, false]);
    expect(d.layers[1]).toEqual(base.layers[1]);
    const c = ok(ok(blank(), [{ op: 'add_layer', type: 'curves' }]), [{ op: 'update_layer', layerId: 'curves', params: { r: { points: [{ x: 0, y: 0.1 }, { x: 1, y: 1 }] } } }]);
    expect(c.layers[0].params).toMatchObject({ r: { points: [{ x: 0, y: 0.1 }, { x: 1, y: 1 }] }, master: { points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] } });
  });

  it('update_layer refuses params of another layer type', () => {
    const r = applyPhotoOps(twoLayers(), [{ op: 'update_layer', layerId: 'exp1', params: { shadows: 10 } }]);
    expect(r.ok).toBe(false);
    expect(!r.ok && r.errors.join()).toMatch(/not parameters of a exposure layer/);
  });

  it('remove_layer and move_layer', () => {
    expect(ok(twoLayers(), [{ op: 'remove_layer', layerId: 'exp1' }]).layers.map((l) => l.id)).toEqual(['hsl1']);
    expect(ok(twoLayers(), [{ op: 'move_layer', layerId: 'hsl1', toIndex: 0 }]).layers.map((l) => l.id)).toEqual(['hsl1', 'exp1']);
  });

  it('grey_except: everything grey except the reds (the HSL panel semantics), on a new or an existing HSL layer', () => {
    const d = ok(blank(), [{ op: 'grey_except', ranges: ['red'] }]);
    const sat = Object.fromEntries((d.layers[0].params as { ranges: { id: string; saturation: number }[] }).ranges.map((r) => [r.id, r.saturation]));
    expect(sat).toEqual({ reds: 0, yellows: -100, greens: -100, cyans: -100, blues: -100, magentas: -100 });
    // Matches the shared fixture's "grey except red" layer on the six default ranges.
    const fx = doc('hsl-grey-except-red.json').layers.find((l) => l.type === 'hsl');
    const fxSat = Object.fromEntries((fx?.params as { ranges: { id: string; saturation: number }[] }).ranges.filter((r) => r.id in sat).map((r) => [r.id, r.saturation]));
    expect(fxSat).toEqual(sat);
    const e = ok(twoLayers(), [{ op: 'grey_except', ranges: ['blue', 'orange'], layerId: 'hsl1' }]);
    expect(e.layers).toHaveLength(2);
    const ranges = (e.layers[1].params as { ranges: { id: string; center: number; saturation: number }[] }).ranges;
    expect(ranges.find((r) => r.id === 'blues')?.saturation).toBe(0);
    expect(ranges.find((r) => r.center === 30)).toMatchObject({ id: 'custom-1', saturation: 0 });
    expect(ranges.filter((r) => r.saturation === -100).map((r) => r.id)).toEqual(['reds', 'yellows', 'greens', 'cyans', 'magentas']);
  });

  it('grey_except on a non-HSL layer is refused', () => {
    expect(applyPhotoOps(twoLayers(), [{ op: 'grey_except', ranges: ['red'], layerId: 'exp1' }]).ok).toBe(false);
  });

  it('set_mask: replaces the layer mask; combine applies to every component after the first', () => {
    const d = ok(twoLayers(), [{ op: 'set_mask', layerId: 'exp1', components: [{ kind: 'gradient', from: { x: 0.5, y: 0.6 }, to: { x: 0.5, y: 0.1 } }, { kind: 'luminosity', lo: 0.6, hi: 1 }], combine: 'intersect', invert: true }]);
    const m = d.layers[0].mask as { components: { kind: string; mode: string }[]; invert: boolean };
    expect(m.components.map((c) => [c.kind, c.mode])).toEqual([['gradient', 'add'], ['luminosity', 'intersect']]);
    expect(m.invert).toBe(true);
  });

  it('apply_preset: appends the look as a group, intensity scales opacity', () => {
    const d = ok(blank(), [{ op: 'apply_preset', presetId: 'vintage', intensity: 0.5 }], { presetGroupName: () => 'Preset: Vintage' });
    expect(d.layers.map((l) => l.type)).toEqual(['photoFilter', 'vignette', 'grain']);
    expect(d.layers.every((l) => l.group === 'Preset: Vintage' && l.opacity === 0.5)).toBe(true);
  });

  it('auto_tone (and the auto preset) need the histogram', () => {
    expect(applyPhotoOps(blank(), [{ op: 'auto_tone' }]).ok).toBe(false);
    const d = ok(blank(), [{ op: 'auto_tone' }], { histogram: hist() });
    expect(d.layers.map((l) => l.type)).toEqual(['levels', 'whiteBalance']);
    expect(ok(blank(), [{ op: 'apply_preset', presetId: 'auto' }], { histogram: hist() }).layers).toHaveLength(2);
  });

  it('set_geometry: quarter turns, straighten (with auto-crop), flips, aspect crop and crop reset', () => {
    expect(ok(blank(), [{ op: 'set_geometry', rotate: 90 }]).geometry.rotate).toBe(90);
    const s = ok(blank(), [{ op: 'set_geometry', straighten: -2 }]).geometry;
    expect(s.rotate).toBe(-2);
    expect(s.crop).not.toBeNull();
    expect(ok(blank(), [{ op: 'set_geometry', flipH: true }]).geometry.flipH).toBe(true);
    const sq = ok(blank(), [{ op: 'set_geometry', crop: { aspect: '1:1' } }]).geometry.crop;
    expect(sq && Math.round((sq.width * 1200) / (sq.height * 800) * 1000) / 1000).toBe(1);
    expect(ok(ok(blank(), [{ op: 'set_geometry', crop: { aspect: '16:9' } }]), [{ op: 'set_geometry', crop: null }]).geometry.crop).toBeNull();
  });

  it('a crop with painted brush masks is refused (it needs the async re-bake in the panel)', () => {
    const r = applyPhotoOps(doc('masks-all-kinds.json'), [{ op: 'set_geometry', crop: { aspect: '1:1' } }]);
    expect(r.ok).toBe(false);
    expect(!r.ok && r.errors[0]).toMatch(/brush/);
  });

  it('covers every op name', () => {
    expect(PHOTO_OP_NAMES).toEqual(['add_layer', 'update_layer', 'remove_layer', 'move_layer', 'grey_except', 'set_mask', 'apply_preset', 'auto_tone', 'set_geometry']);
  });
});

describe('all or nothing', () => {
  it('a failing op later in the list changes nothing (the input document is untouched)', () => {
    const base = twoLayers();
    const before = canonicalPhotoDoc(base);
    const r = applyPhotoOps(base, [{ op: 'add_layer', type: 'vignette', params: { amount: -20 } }, { op: 'remove_layer', layerId: 'nope' }]);
    expect(r.ok).toBe(false);
    expect(!r.ok && r.reason).toBe('unknown_id');
    expect(canonicalPhotoDoc(base)).toBe(before);
  });

  it('an unknown id is rejected with the reason the client reports', () => {
    for (const op of [
      { op: 'update_layer', layerId: 'ghost', opacity: 0.5 },
      { op: 'remove_layer', layerId: 'ghost' },
      { op: 'move_layer', layerId: 'ghost', toIndex: 0 },
      { op: 'set_mask', layerId: 'ghost', components: [{ kind: 'radial' }] },
    ]) {
      const r = applyPhotoOps(blank(), [op]);
      expect(r.ok ? 'ok' : r.reason, op.op).toBe('unknown_id');
    }
  });

  it('every applied result parses as a valid PhotoDoc', () => {
    const d = ok(twoLayers(), [
      { op: 'add_layer', type: 'splitTone', params: { shadows: { hue: 210, saturation: 20 } } },
      { op: 'grey_except', ranges: [{ hue: 185, width: 40 }] },
      { op: 'set_geometry', straighten: 1.5, flipV: true },
    ]);
    expect(parsePhotoDoc(JSON.parse(canonicalPhotoDoc(d))).ok).toBe(true);
  });
});

describe('the op schema (strict; what the model reads)', () => {
  it.each([
    [[{ op: 'make_cinematic' }], /unknown op "make_cinematic"/],
    [[{ op: 'add_layer', type: 'exposure', params: { ev: 9 } }], /ops\[0\]\.params\.ev: 9 > max 5/],
    [[{ op: 'add_layer', type: 'tone', params: { brightness: 10 } }], /params\.brightness: unknown parameter/],
    [[{ op: 'add_layer', type: 'blah' }], /unknown layer type "blah"/],
    [[{ op: 'apply_preset', presetId: 'teal-orange' }], /not one of color-pop-red/],
    [[{ op: 'set_mask', layerId: 'a', components: [{ kind: 'brush' }] }], /suggested actions/],
    [[{ op: 'add_layer', type: 'lut', params: { cube: 'LUT_3D_SIZE 2' } }], /params\.cube: unknown parameter/],
    [[{ op: 'set_geometry' }], /needs at least one field/],
    [[{ op: 'set_geometry', rotate: 45 }], /multiple of 90/],
    [[{ op: 'grey_except', ranges: [{ hue: 400 }] }], /ranges\[0\]\.hue: 400 > max 360/],
    [[], /< min 1/],
  ])('%j → %s', (ops, msg) => {
    expect(photoOpsProblems(ops).join('\n')).toMatch(msg);
  });

  it('values inside the ranges pass', () => {
    expect(photoOpsProblems([{ op: 'add_layer', type: 'vignette', params: { amount: -30, midpoint: 45, feather: 60 } }])).toEqual([]);
  });

  it('the exported JSON Schema is draft 2020-12, strict, and keeps real `id` properties', () => {
    const s = photoOpsJsonSchema() as { $schema: string; $defs: Record<string, Record<string, unknown>>; maxItems: number };
    expect(s.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
    expect(s.maxItems).toBe(24);
    for (const [k, d] of Object.entries(s.$defs)) expect(d.id, k).toBeUndefined();
    const ranges = (s.$defs.params_hsl.properties as Record<string, { items: { required: string[] } }>).ranges.items;
    expect(ranges.required).toContain('id');
    const text = JSON.stringify(s);
    expect(text).not.toContain('"cube"');
    expect(text).toContain('"minProperties":2');
  });
});

describe('schema files: generated, committed, byte-identical in both repos', () => {
  const files = buildOpsSchemaFiles();
  it('the UI copy matches a fresh export (run `npm run export:ops` if this fails)', () => {
    for (const [name, body] of Object.entries(files)) expect(readFileSync(join(process.cwd(), OPS_SCHEMA_DIR, name), 'utf8') === body, name).toBe(true);
  });
  const apiDir = resolve(process.cwd(), process.env.MEDI_API_OPS_SCHEMA_DIR ?? API_OPS_SCHEMA_DIR);
  it.skipIf(!existsSync(apiDir))(`the API copy (${API_OPS_SCHEMA_DIR}) is byte-identical`, () => {
    for (const [name, body] of Object.entries(files)) expect(readFileSync(join(apiDir, name), 'utf8') === body, name).toBe(true);
  });
});

describe('helpers', () => {
  it('maskFromSpec defaults', () => {
    expect(maskFromSpec({ components: [{ kind: 'radial' }] })).toEqual({ components: [{ kind: 'radial', mode: 'add' }], feather: 0, invert: false, opacity: 1 });
  });
  it('greyExceptRanges maps names onto the default ranges', () => {
    const r = greyExceptRanges([], ['green']);
    expect(r.find((x) => x.id === 'greens')?.saturation).toBe(0);
    expect(r).toHaveLength(6);
  });
});
