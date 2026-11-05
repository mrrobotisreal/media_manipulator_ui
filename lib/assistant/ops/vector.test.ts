/**
 * MM110: Motion's op vocabulary and engine (ticket decisions 1 + 3, acceptance 2). One test per
 * op on a fixture document, all-or-nothing, unknown ids, invalid properties and times, the
 * sanitising SVG import, and the schema file byte-identity in both repos.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { findLayer } from '@/lib/vector/layerTree';
import { docIntegrityIssues, layerSchema, parseVectorDoc, serializeVectorDoc, type Layer, type VectorDoc } from '@/lib/vector/vectorTypes';

import { applyVectorOps } from './applyVector';
import { API_OPS_SCHEMA_DIR, OPS_SCHEMA_DIR, buildOpsSchemaFiles } from './schemaFiles';
import { VECTOR_LAYER_PROPS, VECTOR_OP_NAMES, vectorOpsJsonSchema, vectorOpsProblems } from './vector';

const fixture = (): VectorDoc => {
  const r = parseVectorDoc(JSON.parse(readFileSync(join(process.cwd(), 'lib/vector/fixtures/shapes.json'), 'utf8')));
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};
const blank = (extra: Record<string, unknown> = {}): VectorDoc => {
  const r = parseVectorDoc({ version: 1, layers: [{ type: 'text', id: 'headline', x: 256, y: 256, text: 'Launch day', fontSize: 48, textAnchor: 'middle', fill: '#ffffff' }, { type: 'path', id: 'logo', d: 'M10 10L110 10L60 90Z', fill: 'none', stroke: '#ff5a36', strokeWidth: 4 }], ...extra });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};
const ok = (doc: VectorDoc, ops: unknown[]) => {
  const r = applyVectorOps(doc, ops);
  if (!r.ok) throw new Error(r.errors.join('; '));
  expect(docIntegrityIssues(r.doc)).toEqual([]);
  return r;
};
const layer = (doc: VectorDoc, id: string) => findLayer(doc.layers, id) as Layer & Record<string, unknown>;
const k = (t: number, value: number | string, easing = 'linear') => ({ t, value, easing });

describe('Motion ops (one per op)', () => {
  it('add_layer: a rect with style and transform, inside a group too', () => {
    const r = ok(blank(), [
      { op: 'add_layer', type: 'group', props: { name: 'Card' } },
      { op: 'add_layer', type: 'rect', props: { x: 10, y: 400, width: 300, height: 60, rx: 8, fill: '#ff5a36', transform: { rotation: 5 } } },
    ]);
    const rect = r.doc.layers.at(-1)!;
    expect(rect).toMatchObject({ type: 'rect', x: 10, y: 400, width: 300, rx: 8, fill: '#ff5a36' });
    expect((rect as { transform: { rotation: number } }).transform.rotation).toBe(5);
    const nested = ok(r.doc, [{ op: 'add_layer', type: 'ellipse', props: { cx: 5, cy: 5, rx: 2, ry: 2 }, parentId: 'group-1' }]);
    expect((layer(nested.doc, 'group-1') as unknown as { children: Layer[] }).children.map((c) => c.type)).toEqual(['ellipse']);
  });

  it('add_text: a baseline text with font, size, fill and anchor', () => {
    const r = ok(blank(), [{ op: 'add_text', text: 'Jo Park', x: 40, y: 450, size: 32, weight: '700', fill: '#ffffff', anchor: 'start' }]);
    expect(r.doc.layers.at(-1)).toMatchObject({ type: 'text', text: 'Jo Park', x: 40, y: 450, fontSize: 32, fontWeight: '700', textAnchor: 'start' });
  });

  it('import_svg: through the sanitising importer; <script> and handlers are stripped, ids never collide', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><script>alert(1)</script><path id="logo" d="M0 0L100 100" stroke="red" onclick="steal()"/><image href="https://evil.example/x.png" width="10" height="10"/></svg>';
    const r = ok(blank(), [{ op: 'import_svg', markup: svg, name: 'Brand' }]);
    const text = serializeVectorDoc(r.doc);
    expect(text).not.toMatch(/script|onclick|steal|evil\.example/);
    const g = r.doc.layers.at(-1)!;
    expect(g).toMatchObject({ type: 'group', name: 'Brand' });
    expect(layer(r.doc, 'logo')).toMatchObject({ type: 'path', stroke: '#ff5a36' }); // the user's logo is untouched
    expect(JSON.stringify(g)).toContain('"id":"logo-1"');
  });

  it('import_svg refuses markup that is not SVG', () => {
    expect(applyVectorOps(blank(), [{ op: 'import_svg', markup: '<html><body>hello</body></html>' }])).toMatchObject({ ok: false, reason: 'validation' });
  });

  it('update_layer: patches fields the layer type has, merges the transform', () => {
    const r = ok(blank(), [{ op: 'update_layer', layerId: 'headline', patch: { fill: 'orange', fontSize: 64, transform: { y: -20 } } }]);
    expect(layer(r.doc, 'headline')).toMatchObject({ fill: 'orange', fontSize: 64 });
    expect((layer(r.doc, 'headline').transform as { y: number }).y).toBe(-20);
    expect(applyVectorOps(blank(), [{ op: 'update_layer', layerId: 'logo', patch: { fontSize: 10 } }])).toMatchObject({ ok: false, errors: [expect.stringMatching(/a path layer has no fontSize/)] });
  });

  it('delete_layer: removes the layer and its tracks', () => {
    const anim = ok(blank(), [{ op: 'animate', layerId: 'logo', property: 'opacity', keyframes: [k(0, 0), k(500, 1)] }]);
    const r = ok(anim.doc, [{ op: 'delete_layer', layerId: 'logo' }]);
    expect(layer(r.doc, 'logo')).toBeUndefined();
    expect(r.doc.animations).toEqual([]);
  });

  it('animate: writes exactly the keyframes given (no playhead folding), easing per segment', () => {
    const r = ok(blank(), [{ op: 'animate', layerId: 'headline', property: 'transform.scaleX', keyframes: [k(0, 0, 'easeOut'), k(280, 1.1, 'easeBoth'), k(420, 1)] }]);
    expect(r.doc.animations).toEqual([{ layerId: 'headline', property: 'transform.scaleX', keyframes: [k(0, 0, 'easeOut'), k(280, 1.1, 'easeBoth'), k(420, 1)] }]);
  });

  it('animate refuses an unknown property, a time after the end, wrong value kinds and decreasing times', () => {
    const base = blank();
    expect(vectorOpsProblems([{ op: 'animate', layerId: 'headline', property: 'transform.zoom', keyframes: [k(0, 0), k(1, 1)] }]).join()).toMatch(/property/);
    expect(applyVectorOps(base, [{ op: 'animate', layerId: 'headline', property: 'opacity', keyframes: [k(0, 0), k(9000, 1)] }])).toMatchObject({ ok: false, errors: [expect.stringMatching(/after the end \(3000 ms\); add set_duration/)] });
    expect(applyVectorOps(base, [{ op: 'animate', layerId: 'headline', property: 'fill', keyframes: [k(0, 1), k(500, 2)] }])).toMatchObject({ ok: false, errors: [expect.stringMatching(/colours/)] });
    expect(applyVectorOps(base, [{ op: 'animate', layerId: 'headline', property: 'opacity', keyframes: [k(500, 0), k(100, 1)] }])).toMatchObject({ ok: false, errors: [expect.stringMatching(/increasing time/)] });
    expect(applyVectorOps(base, [{ op: 'animate', layerId: 'headline', property: 'opacity', keyframes: [k(0, 0), k(100, 2)] }])).toMatchObject({ ok: false, errors: [expect.stringMatching(/0\.\.1/)] });
  });

  it('set_duration runs first, so one call may lengthen the composition and key into it', () => {
    const r = ok(blank(), [{ op: 'animate', layerId: 'headline', property: 'opacity', keyframes: [k(0, 0), k(5000, 1)] }, { op: 'set_duration', ms: 6000 }]);
    expect(r.doc.duration).toBe(6000);
    expect(r.doc.animations[0].keyframes.at(-1)!.t).toBe(5000);
  });

  it('apply_animator: drawOn on an outline, blur, gradient; refuses drawOn on text and a span past the end', () => {
    const r = ok(blank(), [{ op: 'apply_animator', layerIds: ['logo'], animator: 'drawOn', span: { start: 0, end: 1400, easing: 'easeBoth' } }]);
    expect(r.doc.animations.map((a) => a.property)).toEqual(['strokeDashoffset']);
    const b = ok(blank(), [{ op: 'apply_animator', layerIds: ['headline'], animator: 'blur', span: { start: 0, end: 500 }, options: { amount: 8 } }]);
    expect(b.doc.defs.filters).toHaveLength(1);
    const g = ok(blank(), [{ op: 'apply_animator', layerIds: ['headline'], animator: 'gradient', span: { start: 0, end: 1600 } }]);
    expect(g.doc.animations.some((a) => a.property.startsWith('gradientStop['))).toBe(true);
    expect(applyVectorOps(blank(), [{ op: 'apply_animator', layerIds: ['headline'], animator: 'drawOn', span: { start: 0, end: 500 } }])).toMatchObject({ ok: false });
    expect(applyVectorOps(blank(), [{ op: 'apply_animator', layerIds: ['logo'], animator: 'drawOn', span: { start: 0, end: 9000 } }])).toMatchObject({ ok: false, errors: [expect.stringMatching(/after the end/)] });
  });

  it('apply_animator: motionPath along a guide and morph into another shape', () => {
    const doc = ok(blank(), [{ op: 'add_layer', type: 'path', props: { d: 'M0 300C100 200 300 400 500 300' } }]).doc;
    const m = ok(doc, [{ op: 'apply_animator', layerIds: ['headline'], animator: 'motionPath', span: { start: 0, end: 2000 }, options: { pathId: 'path-1', autoOrient: true } }]);
    expect(m.doc.animations.find((a) => a.property === 'motionPath')?.extras).toEqual({ pathId: 'path-1', autoOrient: true });
    const shapes = ok(blank(), [{ op: 'add_layer', type: 'ellipse', props: { cx: 60, cy: 50, rx: 40, ry: 40 } }]).doc;
    const morph = ok(shapes, [{ op: 'apply_animator', layerIds: ['logo'], animator: 'morph', span: { start: 0, end: 600 }, options: { targetId: 'ellipse-1' } }]);
    expect(morph.doc.animations.find((a) => a.property === 'd')?.keyframes).toHaveLength(2);
  });

  it('template: runs lib/vector/templates.ts and lengthens the composition when it needs to', () => {
    const r = ok(blank({ duration: 1000 }), [{ op: 'template', kind: 'lowerThird', text: ['Jo Park', 'Producer'], colors: ['#ff5a36'] }]);
    expect(r.doc.duration).toBeGreaterThan(1000);
    expect(r.touched).toEqual(['lower-third-1']);
  });

  it('set_canvas: size (viewBox follows), background and fps', () => {
    const r = ok(blank(), [{ op: 'set_canvas', width: 1080, height: 1920, background: '#000000', fps: 30 }]);
    expect(r.doc.canvas).toEqual({ width: 1080, height: 1920, viewBox: { x: 0, y: 0, width: 1080, height: 1920 }, background: '#000000' });
    expect(r.doc.fps).toBe(30);
  });

  it('set_loop: canonical form (absent = loops)', () => {
    const off = ok(blank(), [{ op: 'set_loop', loop: false }]);
    expect(off.doc.loop).toBe(false);
    const on = ok(off.doc, [{ op: 'set_loop', loop: true }]);
    expect('loop' in on.doc).toBe(false);
  });
});

describe('Motion ops: all-or-nothing and refusals', () => {
  it('a failing op later in the list changes nothing', () => {
    const doc = blank();
    const r = applyVectorOps(doc, [{ op: 'update_layer', layerId: 'headline', patch: { fill: 'red' } }, { op: 'delete_layer', layerId: 'ghost' }]);
    expect(r).toMatchObject({ ok: false, reason: 'unknown_id', errors: [expect.stringMatching(/ops\[1\]: no layer "ghost"/)] });
    expect(layer(doc, 'headline').fill).toBe('#ffffff');
  });

  it('a locked layer is refused', () => {
    const doc = blank();
    const locked = { ...doc, layers: doc.layers.map((l) => (l.id === 'logo' ? { ...l, locked: true } : l)) } as VectorDoc;
    expect(applyVectorOps(locked, [{ op: 'update_layer', layerId: 'logo', patch: { stroke: 'blue' } }])).toMatchObject({ ok: false, reason: 'locked' });
  });

  it('props a model must never write are not in the vocabulary', () => {
    for (const bad of [
      { op: 'add_layer', type: 'rect', props: { x: 0, y: 0, width: 1, height: 1, id: 'x' } },
      { op: 'add_layer', type: 'rect', props: { x: 0, y: 0, width: 1, height: 1, fill: 'url(#evil)' } },
      { op: 'add_layer', type: 'rect', props: { x: 0, y: 0, width: 1, height: 1, mask: 'm' } },
      { op: 'add_layer', type: 'image', props: { x: 0, y: 0, width: 1, height: 1, href: 'data:image/png;base64,' } },
      { op: 'add_layer', type: 'raw', props: { markup: '<g/>' } },
      { op: 'update_layer', layerId: 'logo', patch: { attrs: { onclick: 'x' } } },
    ]) {
      expect(vectorOpsProblems([bad]), JSON.stringify(bad)).not.toEqual([]);
    }
  });

  it('every new-layer prop exists on that document layer type', () => {
    const shapes = (layerSchema as unknown as { _def: { optionsMap: Map<string, { _def: { shape: () => Record<string, unknown> } }> } })._def.optionsMap;
    for (const [type, schema] of Object.entries(VECTOR_LAYER_PROPS)) {
      const docShape = shapes.get(type)!._def.shape();
      for (const key of Object.keys((schema as unknown as { shape: Record<string, unknown> }).shape)) expect(key in docShape, `${type}.${key}`).toBe(true);
    }
  });

  it('the op list and schema are bounded', () => {
    expect(VECTOR_OP_NAMES).toHaveLength(11);
    expect(vectorOpsProblems([])).not.toEqual([]);
    expect(vectorOpsProblems(Array.from({ length: 25 }, () => ({ op: 'set_loop', loop: true })))).not.toEqual([]);
    const text = JSON.stringify(vectorOpsJsonSchema());
    expect(text).not.toMatch(/\(\?[=!<]/); // RE2 (the API's Go validator) has no look-around
    expect(text.length).toBeLessThan(40_000);
  });

  it('an edit of a shared fixture document stays integrity-clean and canonical', () => {
    const r = ok(fixture(), [{ op: 'set_loop', loop: false }, { op: 'template', kind: 'titlePop', text: 'Hi' }]);
    const again = parseVectorDoc(r.doc);
    expect(again.ok && serializeVectorDoc(again.doc)).toBe(serializeVectorDoc(r.doc));
  });
});

describe('vector schema file: generated, committed, byte-identical in both repos', () => {
  const body = buildOpsSchemaFiles()['vector.json'];
  it('the UI copy matches a fresh export (run `npm run export:ops` if this fails)', () => {
    expect(readFileSync(join(process.cwd(), OPS_SCHEMA_DIR, 'vector.json'), 'utf8') === body).toBe(true);
  });
  const apiDir = resolve(process.cwd(), process.env.MEDI_API_OPS_SCHEMA_DIR ?? API_OPS_SCHEMA_DIR);
  it.skipIf(!existsSync(join(apiDir, 'vector.json')))(`the API copy (${API_OPS_SCHEMA_DIR}/vector.json) is byte-identical`, () => {
    expect(readFileSync(join(apiDir, 'vector.json'), 'utf8') === body).toBe(true);
  });
});
