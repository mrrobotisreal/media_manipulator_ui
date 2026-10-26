/**
 * MM46 acceptance 2: the Lottie writer.
 *
 * Goldens: `__golden__/lottie/<name>.doc.json` (input VectorDoc) →
 * `<name>.json` (expected Lottie, pretty-printed for review; the download is
 * the compact `lottieText`). Byte-exact. Regenerate after an intended change:
 *
 *     UPDATE_GOLDEN=1 npx vitest run lib/vector/export/lottie.test.ts
 *
 * Every writer-side feature in `LOTTIE_EXPORT_UNSUPPORTED` has a fixture in
 * `lib/vector/fixtures/lottie/unsupported-export/<feature>.json` that must
 * produce a warning with that feature and a layer id; supported goldens must
 * produce none (no silent success, no silent drop).
 *
 * The full JSON-Schema check against the Lottie 1.0.1 schema
 * (`lottie.schema.json`, draft 2020-12) needs Ajv 8, which the repo does not
 * carry; it was run on every golden during MM46 (log). This file checks the
 * schema's REQUIRED fields structurally, which is what players rely on.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { sampleDoc } from '@/lib/vector/sampleTrack';
import { parseVectorDoc, type VectorDoc } from '@/lib/vector/vectorTypes';
import { ellipseBezier, rectBezier, bezierToPath, pathToBeziers } from '@/lib/vector/lottieCommon';

import { LOTTIE_BACKGROUND_CLASS, exportLottie, lottieFileName, lottieGenerator, lottieText } from './lottie';
import { LOTTIE_EXPORT_UNSUPPORTED, LOTTIE_SPEC, LOTTIE_UNSUPPORTED } from './lottieSupport';

const DIR = join(__dirname, '__golden__', 'lottie');
const UNSUPPORTED = join(__dirname, '..', 'fixtures', 'lottie', 'unsupported-export');
const NAMES = readdirSync(DIR)
  .filter((f) => f.endsWith('.doc.json'))
  .map((f) => f.replace(/\.doc\.json$/, ''))
  .sort();
const UPDATE = process.env.UPDATE_GOLDEN === '1';

const loadDoc = (file: string): VectorDoc => {
  const r = parseVectorDoc(readFileSync(file, 'utf8'));
  if (!r.ok) throw new Error(`${file}: ${r.error}`);
  return r.doc;
};

type J = Record<string, unknown>;
const isObj = (v: unknown): v is J => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Required fields of the Lottie 1.0.1 schema, walked structurally. */
function schemaIssues(json: unknown): string[] {
  const issues: string[] = [];
  const need = (o: J, keys: string[], where: string) => {
    for (const k of keys) if (!(k in o)) issues.push(`${where}: missing ${k}`);
  };
  const prop = (p: unknown, where: string) => {
    if (!isObj(p)) return issues.push(`${where}: not a property`);
    if (p.s === true) {
      prop(p.x, `${where}.x`);
      prop(p.y, `${where}.y`);
      return;
    }
    if (p.a !== 0 && p.a !== 1) issues.push(`${where}: a must be 0 or 1`);
    if (p.a === 1) {
      if (!Array.isArray(p.k) || p.k.length === 0) issues.push(`${where}: animated without keyframes`);
      else
        (p.k as unknown[]).forEach((k, i) => {
          if (!isObj(k) || typeof k.t !== 'number' || !('s' in k)) issues.push(`${where}.k[${i}]: keyframe needs t and s`);
          else if (k.h !== 1 && i < (p.k as unknown[]).length - 1 && (!isObj(k.o) || !isObj(k.i))) issues.push(`${where}.k[${i}]: easing handles`);
        });
    }
  };
  const shapes = (list: unknown, where: string) => {
    if (!Array.isArray(list)) return issues.push(`${where}: shapes must be an array`);
    list.forEach((s, i) => {
      const w = `${where}[${i}]`;
      if (!isObj(s) || typeof s.ty !== 'string') return issues.push(`${w}: ty`);
      const req: Record<string, string[]> = { rc: ['s', 'p'], el: ['s', 'p'], sh: ['ks'], fl: ['c', 'o'], st: ['c', 'o', 'w'], gf: ['s', 'e', 'g', 't', 'o'], gs: ['s', 'e', 'g', 't', 'o', 'w'], tm: ['s', 'e', 'o'], gr: [], tr: [] };
      if (!(s.ty in req)) issues.push(`${w}: unexpected shape ${s.ty}`);
      need(s, req[s.ty] ?? [], w);
      // `r` is the fill rule (an integer) on fl / gf, a property elsewhere.
      const props = s.ty === 'fl' || s.ty === 'gf' ? ['s', 'p', 'c', 'o', 'w', 'e', 'ks'] : ['s', 'p', 'r', 'c', 'o', 'w', 'e', 'ks'];
      for (const k of props) if (k in s && s.ty !== 'gr' && !(s.ty === 'gf' && k === 'g')) prop(s[k], `${w}.${k}`);
      if ((s.ty === 'fl' || s.ty === 'gf') && 'r' in s && s.r !== 1 && s.r !== 2) issues.push(`${w}.r: fill rule`);
      if (s.ty === 'gr') shapes(s.it, `${w}.it`);
    });
  };
  if (!isObj(json)) return ['not an object'];
  need(json, ['w', 'h', 'fr', 'ip', 'op', 'layers'], 'animation');
  if (!Number.isInteger(json.w) || !Number.isInteger(json.h)) issues.push('w / h must be integers');
  if (typeof json.ver !== 'number' || json.ver < 10000) issues.push('ver');
  (json.layers as unknown[]).forEach((l, i) => {
    const w = `layers[${i}]`;
    if (!isObj(l)) return issues.push(`${w}: not an object`);
    need(l, ['ty', 'ip', 'op', 'ks'], w);
    if (isObj(l.ks)) for (const k of Object.keys(l.ks)) prop((l.ks as J)[k], `${w}.ks.${k}`);
    if (l.ty === 4) shapes(l.shapes, `${w}.shapes`);
    if (l.ty === 2 && typeof l.refId !== 'string') issues.push(`${w}: refId`);
  });
  return issues;
}

describe('Lottie writer goldens (byte-exact)', () => {
  it('has a golden per ticket feature', () => {
    expect(NAMES).toEqual([
      'basic-shapes',
      'cubic-bezier',
      'easing',
      'fill-color',
      'fill-stroke',
      'gradient-stop',
      'hold',
      'id-collision',
      'mask-basic',
      'morph',
      'motion-path',
      'nested-groups',
      'radial-gradient',
      'skew',
      'stroke-width',
      'transform',
      'translate',
      'trim',
      'use-image',
      'viewbox-background',
    ]);
  });

  it.each(NAMES)('%s.json', (name) => {
    const { json, warnings } = exportLottie(loadDoc(join(DIR, `${name}.doc.json`)));
    const out = `${JSON.stringify({ json, warnings }, null, 2)}\n`;
    const file = join(DIR, `${name}.json`);
    if (UPDATE || !existsSync(file)) writeFileSync(file, out);
    expect(out).toBe(readFileSync(file, 'utf8'));
  });

  it.each(NAMES)('%s: supported features export without warnings, and the output has the schema-required fields', (name) => {
    const { json, warnings } = exportLottie(loadDoc(join(DIR, `${name}.doc.json`)));
    expect(warnings).toEqual([]);
    expect(schemaIssues(json)).toEqual([]);
  });

  it.each(NAMES)('%s: deterministic (two runs identical)', (name) => {
    const doc = loadDoc(join(DIR, `${name}.doc.json`));
    expect(lottieText(exportLottie(doc).json)).toBe(lottieText(exportLottie(doc).json));
  });
});

describe('Lottie writer header', () => {
  const doc = loadDoc(join(DIR, 'transform.doc.json'));
  const { json } = exportLottie(doc, { name: 'Bounce' });

  it(`targets Lottie spec ${LOTTIE_SPEC.revision} (ver ${LOTTIE_SPEC.ver}), fr = doc fps, ip/op from duration`, () => {
    expect(json.ver).toBe(10001);
    expect(json.v).toBe('5.12.0');
    expect(json.fr).toBe(doc.fps);
    expect(json.ip).toBe(0);
    expect(json.op).toBe((doc.duration * doc.fps) / 1000);
    expect(json.w).toBe(200);
    expect(json.nm).toBe('Bounce');
    expect(json.meta.g).toBe(lottieGenerator());
  });

  it('keeps Motion ids in ln and draws the first layer on top (reversed order)', () => {
    const d = loadDoc(join(DIR, 'basic-shapes.doc.json'));
    const { json: j } = exportLottie(d);
    expect(j.layers.map((l) => l.ln)).toEqual(d.layers.map((l) => l.id).reverse());
  });

  it('writes the background as a marked bottom layer and the viewBox as a parent null', () => {
    const { json: j } = exportLottie(loadDoc(join(DIR, 'viewbox-background.doc.json')));
    expect(j.layers[j.layers.length - 1].cl).toBe(LOTTIE_BACKGROUND_CLASS);
    expect(j.layers[0].ty).toBe(3);
    expect(j.layers[1].parent).toBe(j.layers[0].ind);
  });

  it('file name', () => {
    expect(lottieFileName('My "anim"/1')).toBe('My -anim-1.json');
    expect(lottieFileName('')).toBe('animation.json');
  });
});

describe('Lottie writer unsupported list (never silent)', () => {
  const files = readdirSync(UNSUPPORTED).filter((f) => f.endsWith('.json')).sort();

  it('has one fixture per writer-side unsupported feature', () => {
    expect(files.map((f) => f.replace(/\.json$/, '')).sort()).toEqual([...LOTTIE_EXPORT_UNSUPPORTED].sort());
  });

  it.each(LOTTIE_EXPORT_UNSUPPORTED.map((f) => [f]))('%s yields a warning with that feature and a layer id', (feature) => {
    const doc = loadDoc(join(UNSUPPORTED, `${feature}.json`));
    const { warnings } = exportLottie(doc);
    const hit = warnings.find((w) => w.feature === feature);
    expect(hit, JSON.stringify(warnings)).toBeDefined();
    expect(typeof hit!.layerId).toBe('string');
    if (feature !== 'playOnce') expect(doc.layers.map((l) => l.id)).toContain(hit!.layerId);
    expect(hit!.reason.length).toBeGreaterThan(0);
  });

  it('every warning names a feature from the shared list', () => {
    for (const f of files) {
      for (const w of exportLottie(loadDoc(join(UNSUPPORTED, f))).warnings) expect(LOTTIE_UNSUPPORTED).toContain(w.feature);
    }
  });

  it('a document of only unsupported content still exports (empty layers), with the warnings', () => {
    const { json, warnings } = exportLottie(loadDoc(join(UNSUPPORTED, 'text.json')));
    expect(json.layers).toEqual([]);
    expect(warnings.map((w) => w.feature)).toEqual(['text']);
  });
});

describe('Lottie geometry helpers', () => {
  it('rect / ellipse beziers start where lottie-web starts (trim paths depend on it)', () => {
    const r = rectBezier([0, 0], [20, 10], 0, 1);
    expect(r.v[0]).toEqual([10, -5]);
    expect(r.v).toHaveLength(4);
    const e = ellipseBezier([0, 0], [20, 10], 1);
    expect(e.v[0]).toEqual([0, -5]);
    expect(e.v[1]).toEqual([10, 0]);
  });

  it('path data → bezier → path data is a fixed point for lines and curves', () => {
    for (const d of ['M0 0L10 0L10 10Z', 'M0 0C10 0 20 10 20 20', 'M-40 0C-40 -22 -22 -40 0 -40C22 -40 40 -22 40 0Z']) {
      const b = pathToBeziers(d)!;
      expect(b.map(bezierToPath).join('')).toBe(d);
    }
  });

  it('a morph track is written as shape keyframes with equal vertex counts', () => {
    const { json } = exportLottie(loadDoc(join(DIR, 'morph.doc.json')));
    const sh = JSON.stringify(json).match(/"ty":"sh","ks":\{"a":1,"k":(\[.*?\])\}\}/);
    expect(sh).toBeTruthy();
    const keys = JSON.parse(sh![1]) as Array<{ s: Array<{ v: number[][] }> }>;
    expect(new Set(keys.map((k) => k.s[0].v.length)).size).toBe(1);
  });

  it('the frame-0 Lottie values equal the frame-0 document (transform golden)', () => {
    const doc = loadDoc(join(DIR, 'transform.doc.json'));
    const first = sampleDoc(doc, 0).layers[0];
    const { json } = exportLottie(doc);
    const ks = json.layers[0].ks as J;
    const at0 = (p: unknown) => (isObj(p) && p.a === 1 ? (p.k as Array<{ s: number[] }>)[0].s : (p as { k: number | number[] }).k);
    if (first.type === 'raw' || !first.transform) throw new Error('fixture');
    expect(at0(ks.r)).toEqual([first.transform.rotation]);
    expect(at0(ks.s)).toEqual([first.transform.scaleX * 100, first.transform.scaleY * 100]);
  });
});
