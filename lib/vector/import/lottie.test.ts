/**
 * MM46 acceptance 2–4: the Lottie reader, the round trip, the unsupported
 * list (import side) and hostile input.
 *
 *   - `fixtures/lottie/*.json` (Lottie files in the shape After Effects /
 *     LottieFiles write): Lottie → doc → Lottie → doc is stable (deep-equal)
 *     on the supported subset and yields no warning;
 *   - writer goldens (`export/__golden__/lottie/*.doc.json`): doc → Lottie →
 *     doc → Lottie is a fixed point (the second Lottie is byte-identical to
 *     the first), and the sampled document agrees with the original every
 *     frame;
 *   - `fixtures/lottie/unsupported-import/<feature>.json`: one per import-side
 *     feature, each must yield a warning with that feature and a layer id,
 *     and the expected warning list is snapshotted;
 *   - hostile input never reaches the document: ids are minted, names are
 *     capped strings, paints come only from numbers, images only as safe
 *     `data:image/*` URIs, and every limit is enforced.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { serializeSvg } from '@/lib/vector/exportSvg';
import { exportLottie, lottieText } from '@/lib/vector/export/lottie';
import { LOTTIE_IMPORT_UNSUPPORTED, LOTTIE_UNSUPPORTED } from '@/lib/vector/export/lottieSupport';
import { sampleDoc } from '@/lib/vector/sampleTrack';
import { forEachLayer, parseVectorDoc, rawMarkupIssues, type VectorDoc } from '@/lib/vector/vectorTypes';

import { LOTTIE_MAX_BYTES, LottieImportError, checkLottieFile, importLottie } from './lottie';

const FIX = join(__dirname, '..', 'fixtures', 'lottie');
const UNSUPPORTED = join(FIX, 'unsupported-import');
const GOLDEN = join(__dirname, '..', 'export', '__golden__', 'lottie');
const lottieFixtures = readdirSync(FIX).filter((f) => f.endsWith('.json')).sort();
const goldenDocs = readdirSync(GOLDEN).filter((f) => f.endsWith('.doc.json')).sort();

const read = (dir: string, f: string) => readFileSync(join(dir, f), 'utf8');
const loadDoc = (f: string): VectorDoc => {
  const r = parseVectorDoc(read(GOLDEN, f));
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};

/** What a static Lottie draws: the geometry, paints and composed transforms per drawable, ids and names stripped. */
function drawn(json: unknown): unknown {
  const strip = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(strip);
    if (v && typeof v === 'object') {
      const o: Record<string, unknown> = {};
      for (const [k, x] of Object.entries(v)) if (!['nm', 'ln', 'ind', 'parent', 'refId', 'id', 'mm'].includes(k)) o[k] = strip(x);
      return o;
    }
    return typeof v === 'number' ? Math.round(v * 100) / 100 : v;
  };
  // Flatten groups that only wrap one group (inlined `use`) so structure does not matter.
  const flat = (items: unknown): unknown => {
    if (!Array.isArray(items)) return items;
    // A fill or stroke at opacity 0 draws nothing (a `none` key becomes a transparent colour on the way back).
    const invisible = (it: unknown) => {
      const o = it as { ty?: string; o?: { a?: number; k?: unknown } };
      return (o.ty === 'fl' || o.ty === 'st') && o.o?.a === 0 && o.o.k === 0;
    };
    return items.filter((it) => !invisible(it)).map((it) => {
      if (it && typeof it === 'object' && (it as { ty?: string }).ty === 'gr') return { ...(it as object), it: flat((it as { it: unknown }).it) };
      return it;
    });
  };
  const j = json as { layers: Array<Record<string, unknown>>; assets: unknown };
  return strip({ assets: j.assets, layers: j.layers.map((l) => ({ ...l, shapes: flat(l.shapes) })) });
}

describe('Lottie round trip (supported subset)', () => {
  it('has the ticket fixture set', () => {
    expect(lottieFixtures).toEqual(['basic-shapes.json', 'easing.json', 'fill-stroke.json', 'gradient.json', 'hold.json', 'morph.json', 'transform-keys.json', 'trim.json']);
  });

  it.each(lottieFixtures)('%s: Lottie → doc → Lottie → doc is stable, with no warnings', (f) => {
    const a = importLottie(read(FIX, f));
    expect(a.warnings).toEqual([]);
    const out = exportLottie(a.doc);
    expect(out.warnings).toEqual([]);
    const b = importLottie(lottieText(out.json));
    expect(b.warnings).toEqual([]);
    expect(b.doc).toEqual(a.doc);
  });

  it.each(goldenDocs)('%s: doc → Lottie → doc → Lottie is a fixed point', (f) => {
    let first = exportLottie(loadDoc(f));
    let back = importLottie(lottieText(first.json));
    expect(back.warnings).toEqual([]);
    if (f === 'use-image.doc.json') {
      // Lottie has no `use`: the copy is inlined, and its groups get ids on the way back. One more lap is stable.
      first = exportLottie(back.doc);
      back = importLottie(lottieText(first.json));
    }
    const second = exportLottie(back.doc);
    expect(lottieText(second.json)).toBe(lottieText(first.json));
  });

  it.each(goldenDocs)('%s: the imported document draws the same frames as the original (every 125 ms)', (f) => {
    const doc = loadDoc(f);
    const back = importLottie(lottieText(exportLottie(doc).json)).doc;
    expect(back.duration).toBe(doc.duration);
    expect(back.fps).toBe(doc.fps);
    // Same picture, different structure (groups, inlined uses): compare the sampled frames through a second Lottie
    // export, which is a pure function of what is drawn. Equal Lottie frames ⇒ equal pictures.
    for (let t = 0; t <= doc.duration; t += 125) {
      const a = exportLottie({ ...sampleDoc(doc, t), animations: [] }).json;
      const b = exportLottie({ ...sampleDoc(back, t), animations: [] }).json;
      expect(drawn(b), `${f} @${t}ms`).toEqual(drawn(a));
    }
  });

  it('keeps Motion ids and names written by the Lottie writer', () => {
    const doc = loadDoc('basic-shapes.doc.json');
    const back = importLottie(lottieText(exportLottie(doc).json)).doc;
    expect(back.layers.map((l) => l.id)).toEqual(doc.layers.map((l) => l.id));
    expect(back.layers[0].name).toBe('Card');
  });

  it('reads the background and viewBox markers back', () => {
    const doc = loadDoc('viewbox-background.doc.json');
    const back = importLottie(lottieText(exportLottie(doc).json)).doc;
    expect(back.canvas.background).toBe('#fafafa');
    expect(back.canvas.viewBox).toEqual(doc.canvas.viewBox);
  });

  it('easing: presets and custom curves map back; holds stay holds', () => {
    const doc = importLottie(read(FIX, 'easing.json')).doc;
    const x = doc.animations.find((t) => t.property === 'transform.x')!;
    expect(x.keyframes.map((k) => k.easing)).toEqual([{ cubicBezier: [0.42, 0, 0.58, 1] }, { cubicBezier: [0.25, 0.1, 0.25, 1] }, 'linear', { cubicBezier: [0.333, 0, 0.667, 1] }]);
    const y = doc.animations.find((t) => t.property === 'transform.y')!;
    expect(y.keyframes[0].easing).toEqual({ cubicBezier: [0.68, -0.6, 0.32, 1.6] });
    const hold = importLottie(read(FIX, 'hold.json')).doc;
    expect(hold.animations.every((t) => t.keyframes.slice(0, -1).every((k) => k.easing === 'hold'))).toBe(true);
  });

  it('trim end 0→100 % becomes the draw-on animator (dasharray = length, offset L → 0)', () => {
    const doc = importLottie(read(FIX, 'trim.json')).doc;
    const tr = doc.animations.find((t) => t.property === 'strokeDashoffset')!;
    let L = 0;
    forEachLayer(doc, (l) => {
      if (l.type === 'path') L = l.strokeDasharray?.[0] ?? 0;
    });
    expect(L).toBeGreaterThan(300);
    expect(tr.keyframes[0].value).toBe(L);
    expect(tr.keyframes[tr.keyframes.length - 1].value).toBe(0);
  });

  it('shape keys become a d morph with one command sequence', () => {
    const doc = importLottie(read(FIX, 'morph.json')).doc;
    const d = doc.animations.find((t) => t.property === 'd')!;
    const shape = (v: string | number) => String(v).replace(/-?\d+(\.\d+)?/g, '#');
    expect(new Set(d.keyframes.map((k) => shape(k.value))).size).toBe(1);
  });
});

describe('Lottie reader unsupported list (never silent)', () => {
  const files = readdirSync(UNSUPPORTED).filter((f) => f.endsWith('.json')).sort();

  it('has one fixture per import-side unsupported feature', () => {
    expect(files.map((f) => f.replace(/\.json$/, '')).sort()).toEqual([...LOTTIE_IMPORT_UNSUPPORTED].sort());
  });

  it.each(LOTTIE_IMPORT_UNSUPPORTED.map((f) => [f]))('%s yields a warning with that feature and a layer id', (feature) => {
    const { doc, warnings } = importLottie(read(UNSUPPORTED, `${feature}.json`));
    const hit = warnings.find((w) => w.feature === feature);
    expect(hit, JSON.stringify(warnings)).toBeDefined();
    const ids = new Set<string>();
    forEachLayer(doc, (l) => ids.add(l.id));
    expect(ids.has(hit!.layerId), `${hit!.layerId} in ${[...ids].join(',')}`).toBe(true);
  });

  it('the expected warning lists (snapshot)', () => {
    const all = Object.fromEntries(files.map((f) => [f.replace(/\.json$/, ''), importLottie(read(UNSUPPORTED, f)).warnings.map((w) => `${w.feature}@${w.layerId}`)]));
    expect(all).toMatchSnapshot();
  });

  it('every warning names a feature from the shared list', () => {
    for (const f of files) for (const w of importLottie(read(UNSUPPORTED, f)).warnings) expect(LOTTIE_UNSUPPORTED).toContain(w.feature);
  });

  it('a text layer survives as a labelled empty group (structure kept)', () => {
    const { doc } = importLottie(read(UNSUPPORTED, 'textLayer.json'));
    expect(doc.layers).toHaveLength(1);
    expect(doc.layers[0]).toMatchObject({ type: 'group', name: 'Text: Layer 1', children: [] });
  });

  it('an unknown layer type survives as a labelled empty group', () => {
    const { doc } = importLottie(read(UNSUPPORTED, 'unknownLayer.json'));
    expect(doc.layers[0]).toMatchObject({ type: 'group', children: [] });
  });
});

// ---------------------------------------------------------------------------
// hostile input
// ---------------------------------------------------------------------------

const st = (k: unknown) => ({ a: 0, k });
const base = (layers: unknown[], extra: Record<string, unknown> = {}) => ({ v: '5.7.4', fr: 30, ip: 0, op: 30, w: 100, h: 100, layers, ...extra });
const shapeLayer = (shapes: unknown[], extra: Record<string, unknown> = {}) => ({ ty: 4, ind: 1, ip: 0, op: 30, st: 0, ks: {}, shapes, ...extra });
const HOSTILE = ['"><script>alert(1)</script>', "'; drop table --", '`${process.exit()}`', '*/ evil() /*', 'a\nb\r\nc', '</script>', 'javascript:alert(1)', '  ', 'url(https://e.example/x)'];

describe('Lottie reader: hostile input', () => {
  it('rejects oversize text before parsing and an oversize file before counting', () => {
    expect(checkLottieFile({ size: LOTTIE_MAX_BYTES + 1 })).toBe('too_large');
    expect(checkLottieFile({ size: 1024 })).toBeNull();
    expect(() => importLottie(' '.repeat(LOTTIE_MAX_BYTES + 1))).toThrow(LottieImportError);
  });

  it.each([
    ['not JSON', '{', 'not_json'],
    ['a JSON array', '[]', 'not_lottie'],
    ['missing fr', JSON.stringify({ ip: 0, op: 1, w: 1, h: 1, layers: [] }), 'not_lottie'],
    ['op before ip', JSON.stringify({ fr: 30, ip: 10, op: 5, w: 1, h: 1, layers: [] }), 'not_lottie'],
    ['infinite size', '{"fr":30,"ip":0,"op":1,"w":1e400,"h":1,"layers":[]}', 'not_lottie'],
    ['layers not an array', JSON.stringify({ fr: 30, ip: 0, op: 1, w: 1, h: 1, layers: {} }), 'not_lottie'],
  ])('%s → %s', (_label, text, code) => {
    try {
      importLottie(text);
      throw new Error('should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(LottieImportError);
      expect((e as LottieImportError).code).toBe(code);
    }
  });

  it('caps the layer count (5000) and the nesting depth', () => {
    const many = base(Array.from({ length: 5001 }, (_, i) => ({ ty: 3, ind: i + 1, ip: 0, op: 30, ks: {} })));
    expect(() => importLottie(JSON.stringify(many))).toThrow(LottieImportError);
    let deep: unknown = { ty: 'rc', s: st([1, 1]), p: st([0, 0]) };
    for (let i = 0; i < 40; i++) deep = { ty: 'gr', it: [deep] };
    expect(() => importLottie(JSON.stringify(base([shapeLayer([deep])])))).toThrow(LottieImportError);
  });

  it('caps keyframes per property and vertices per shape', () => {
    const keys = Array.from({ length: 2001 }, (_, i) => ({ t: i, s: [i] }));
    expect(() => importLottie(JSON.stringify(base([{ ty: 3, ind: 1, ip: 0, op: 30, ks: { r: { a: 1, k: keys } } }])))).toThrow(LottieImportError);
    const v = Array.from({ length: 100_001 }, () => [0, 0]);
    expect(() => importLottie(JSON.stringify(base([shapeLayer([{ ty: 'sh', ks: st({ c: false, v, i: [], o: [] }) }])])))).toThrow(LottieImportError);
  });

  it.each(HOSTILE)('a hostile name never becomes an id, and stays a plain capped name: %s', (name) => {
    const json = base([shapeLayer([{ ty: 'gr', nm: name, ln: name, it: [{ ty: 'rc', nm: name, s: st([10, 10]), p: st([5, 5]) }, { ty: 'fl', nm: name, c: st([1, 0, 0, 1]), o: st(100) }] }], { nm: name, ln: name })]);
    const { doc } = importLottie(JSON.stringify(json));
    forEachLayer(doc, (l) => {
      expect(l.id).toMatch(/^[A-Za-z_][\w-]*$/);
      if (l.name !== undefined) expect(l.name.length).toBeLessThanOrEqual(200);
    });
    // Names only ever reach the SVG as escaped attribute values.
    const svg = serializeSvg(doc);
    expect(svg).not.toContain('<script');
    expect(svg).not.toMatch(/data-name="[^"]*"[^ />]/);
  });

  it('paints come only from numbers: a hostile colour string is ignored', () => {
    const json = base([shapeLayer([{ ty: 'rc', s: st([10, 10]), p: st([5, 5]) }, { ty: 'fl', c: st('red;}</style><script>x()</script>'), o: st(100) }, { ty: 'st', c: st(['url(x)', 1, 1]), o: st(100), w: st(1) }])]);
    const { doc } = importLottie(JSON.stringify(json));
    const svg = serializeSvg(doc);
    expect(svg).not.toMatch(/script|url\(x\)/);
    forEachLayer(doc, (l) => {
      if (l.type !== 'raw' && l.fill) expect(l.fill).toMatch(/^(#[0-9a-f]{6}|none|rgba\([\d., ]+\))$/);
    });
  });

  it('images: only embedded data:image URIs; other hrefs warn and are dropped', () => {
    const bad = ['javascript:alert(1)', 'https://e.example/x.png', 'data:text/html,<script>x()</script>', 'data:image/svg+xml;base64,PHN2Zy8+'];
    for (const p of bad) {
      const json = base([{ ty: 2, ind: 1, ip: 0, op: 30, ks: {}, refId: 'i' }], { assets: [{ id: 'i', w: 1, h: 1, p, e: 1 }] });
      const { doc, warnings } = importLottie(JSON.stringify(json));
      expect(serializeSvg(doc)).not.toContain(p.slice(0, 12));
      expect(warnings.map((w) => w.feature)).toContain('imageExternal');
    }
    const ok = 'data:image/png;base64,iVBORw0KGgo=';
    const { doc } = importLottie(JSON.stringify(base([{ ty: 2, ind: 1, ip: 0, op: 30, ks: {}, refId: 'i' }], { assets: [{ id: 'i', w: 1, h: 1, p: ok, e: 1 }] })));
    expect(serializeSvg(doc)).toContain(ok);
  });

  it('the result never carries raw markup and always passes the document schema', () => {
    for (const f of [...lottieFixtures.map((x) => join(FIX, x)), ...readdirSync(UNSUPPORTED).map((x) => join(UNSUPPORTED, x))]) {
      const { doc } = importLottie(readFileSync(f, 'utf8'));
      forEachLayer(doc, (l) => {
        expect(l.type).not.toBe('raw');
        if (l.type === 'raw') expect(rawMarkupIssues(l.markup)).toEqual([]);
      });
      expect(parseVectorDoc(doc).ok).toBe(true);
    }
  });

  it('parent cycles and missing parents do not loop', () => {
    const json = base([
      { ty: 3, ind: 1, parent: 2, ip: 0, op: 30, ks: {} },
      { ty: 3, ind: 2, parent: 1, ip: 0, op: 30, ks: {} },
      { ty: 3, ind: 3, parent: 99, ip: 0, op: 30, ks: {} },
    ]);
    expect(() => importLottie(JSON.stringify(json))).not.toThrow();
  });

  it('precomp recursion is bounded', () => {
    const json = base([{ ty: 0, ind: 1, ip: 0, op: 30, ks: {}, refId: 'a' }], { assets: [{ id: 'a', layers: [{ ty: 0, ind: 1, ip: 0, op: 30, ks: {}, refId: 'a' }] }] });
    const { warnings } = importLottie(JSON.stringify(json));
    expect(warnings.map((w) => w.feature)).toContain('unknownLayer');
  });
});
