/**
 * MM44 acceptance 4: CSS animated-SVG exporter goldens + agreement with the
 * preview sampler.
 *
 * Goldens: `lib/vector/export/__golden__/css/<name>.json` (input VectorDoc) →
 * `<name>.svg` (expected bytes). Byte-exact. Regenerate after an intended
 * change with
 *
 *     UPDATE_GOLDEN=1 npx vitest run lib/vector/export/css.test.ts
 *
 * and review the diff: the agreement test below must stay green, because it
 * evaluates the emitted keyframes with CSS timing semantics and compares them
 * with `sampleDoc` (what the editor preview shows) at every 5 ms.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { solveCubicBezier } from '@/lib/vector/bezier';
import { formatColor, lerpColor, parseColor } from '@/lib/vector/color';
import { resolveTransform } from '@/lib/vector/geometry';
import { findLayer } from '@/lib/vector/layerTree';
import { sampleDoc, type TrackValue } from '@/lib/vector/sampleTrack';
import { parseVectorDoc, type VectorDoc } from '@/lib/vector/vectorTypes';
import {
  HOLD_TIMING,
  MADE_WITH_COMMENT,
  buildCssAnimations,
  canExportCss,
  exportAnimatedSvgCss,
  generatedComment,
  type CssAnimation,
} from './css';

const DIR = join(__dirname, '__golden__', 'css');
const NAMES = readdirSync(DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  .sort();
const UPDATE = process.env.UPDATE_GOLDEN === '1';

const load = (name: string): VectorDoc => {
  const r = parseVectorDoc(readFileSync(join(DIR, `${name}.json`), 'utf8'));
  if (!r.ok) throw new Error(`${name}: ${r.error}`);
  return r.doc;
};

describe('CSS goldens (byte-exact)', () => {
  it('has a golden per ticket feature', () => {
    expect(NAMES).toEqual([
      'cubic-bezier',
      'fill-color',
      'hold',
      'id-collision',
      'multi-track',
      'opacity',
      'scale-rotate-anchor',
      'stroke-width',
      'translate',
    ]);
  });

  it.each(NAMES)('%s.svg', (name) => {
    const out = exportAnimatedSvgCss(load(name));
    const file = join(DIR, `${name}.svg`);
    if (UPDATE || !existsSync(file)) writeFileSync(file, out);
    expect(out).toBe(readFileSync(file, 'utf8'));
  });

  it.each(NAMES)('%s has exactly one <style>, no <script> and no event handlers', (name) => {
    const out = readFileSync(join(DIR, `${name}.svg`), 'utf8');
    expect(out.match(/<style>/g)).toHaveLength(1);
    expect(out).not.toMatch(/<script|\son[a-z]+=|javascript:/i);
  });

  it('a hold segment uses steps(1,end)', () => {
    const out = readFileSync(join(DIR, 'hold.svg'), 'utf8');
    expect(out).toContain(`animation-timing-function: ${HOLD_TIMING};`);
  });

  it('two layers with the same name get distinct keyframe names', () => {
    const doc = load('id-collision');
    const names = buildCssAnimations(doc).map((a) => a.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names).toEqual(['mm-card-transform', 'mm-card-transform-opacity', 'mm-card_transform-transform']);
  });

  it('sanitises keyframe names and de-duplicates them deterministically', () => {
    const doc = load('opacity');
    // Hand-built (not parsed) ids that sanitise to the same name.
    const raw = {
      ...doc,
      layers: [
        { ...doc.layers[0], id: 'a.b' },
        { ...doc.layers[0], id: 'a_b' },
        { ...doc.layers[0], id: '9z' },
      ],
      animations: ['a.b', 'a_b', '9z'].map((id) => ({ ...doc.animations[0], layerId: id })),
    } as VectorDoc;
    const names = buildCssAnimations(raw).map((a) => a.name);
    expect(names).toEqual(['mm-a_b-opacity', 'mm-a_b-opacity-2', 'mm-9z-opacity']);
    for (const n of names) expect(n).toMatch(/^[A-Za-z_][\w-]*$/);
  });

  it('header comment: made-with note only on anonymous exports', () => {
    const doc = load('translate');
    expect(exportAnimatedSvgCss(doc, { anonymous: true }).split('\n')[0]).toBe(MADE_WITH_COMMENT);
    expect(exportAnimatedSvgCss(doc).split('\n')[0]).toBe(generatedComment());
    expect(exportAnimatedSvgCss(doc)).not.toContain('made with');
  });

  it('loop flag maps to animation-iteration-count', () => {
    expect(exportAnimatedSvgCss(load('translate'))).toContain('animation-iteration-count: infinite;');
    expect(exportAnimatedSvgCss(load('opacity'))).toContain('animation-iteration-count: 1;');
  });
});

describe('canExportCss', () => {
  const base = load('translate');
  it('accepts MM44 properties', () => {
    for (const n of NAMES) expect(canExportCss(load(n)), n).toEqual({ ok: true });
  });

  it('refuses MM45 properties (stroke draw-on, morph, motion path, gradient stops) and defs layers', () => {
    const r = parseVectorDoc(readFileSync(join(__dirname, '..', 'fixtures', 'animated.json'), 'utf8'));
    if (!r.ok) throw new Error(r.error);
    const check = canExportCss(r.doc);
    expect(check.ok).toBe(false);
    if (!check.ok) {
      expect(check.issues.map((i) => i.property)).toEqual(['strokeDashoffset', 'gradientStop[1].color', 'motionPath']);
    }
    expect(() => exportAnimatedSvgCss(r.doc)).toThrow(/cannot express/);
  });

  it('refuses unsafe values even if a doc slipped past the schema', () => {
    const bad = { ...base, animations: [{ layerId: 'box', property: 'fill', keyframes: [{ t: 0, value: 'red;}*{x:y', easing: 'linear' }] }] } as VectorDoc;
    expect(canExportCss(bad).ok).toBe(false);
  });

  it('a document without tracks exports as frame 0 plus the header', () => {
    const still = { ...base, animations: [] };
    const out = exportAnimatedSvgCss(still);
    expect(out).not.toContain('<style>');
    expect(out.startsWith(`${generatedComment()}\n<svg`)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Agreement: evaluate the keyframes with CSS semantics, compare with sampleDoc.
// ---------------------------------------------------------------------------

function cssProgress(timing: string, p: number): number {
  if (timing === 'linear') return p;
  if (timing === HOLD_TIMING) return p < 1 ? 0 : 1;
  const m = /^cubic-bezier\(([^)]+)\)$/.exec(timing);
  if (!m) throw new Error(`unknown timing ${timing}`);
  return solveCubicBezier(m[1].split(',').map(Number), p);
}

function lerpValue(a: TrackValue, b: TrackValue, p: number): TrackValue {
  if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * p;
  const ca = parseColor(a as string);
  const cb = parseColor(b as string);
  if (ca && cb) return formatColor(lerpColor(ca, cb, p));
  return p < 0.5 ? a : b; // CSS discrete interpolation
}

/** Value of a CSS animation at time t (fill-mode both, one iteration). */
function evalCss(a: CssAnimation, t: number): Record<string, TrackValue> {
  const stops = a.stops;
  if (t <= stops[0].t) return stops[0].values;
  for (let i = 0; i + 1 < stops.length; i++) {
    const s0 = stops[i];
    const s1 = stops[i + 1];
    if (t < s1.t) {
      const p = cssProgress(s0.timing, (t - s0.t) / (s1.t - s0.t));
      const out: Record<string, TrackValue> = {};
      for (const k of Object.keys(s0.values)) out[k] = lerpValue(s0.values[k], s1.values[k], p);
      return out;
    }
  }
  return stops[stops.length - 1].values;
}

function expected(doc: VectorDoc, a: CssAnimation, t: number): Record<string, TrackValue> {
  const layer = findLayer(sampleDoc(doc, t).layers, a.layerId)!;
  if (layer.type === 'raw') throw new Error('raw');
  if (a.property === 'transform') return { ...resolveTransform(layer.transform) };
  const rec = layer as unknown as Record<string, TrackValue>;
  return { [a.property]: rec[a.property] };
}

function close(a: TrackValue, b: TrackValue): boolean {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) < 0.05;
  const ca = parseColor(String(a));
  const cb = parseColor(String(b));
  if (ca && cb) return Math.abs(ca.r - cb.r) <= 1.5 && Math.abs(ca.g - cb.g) <= 1.5 && Math.abs(ca.b - cb.b) <= 1.5 && Math.abs(ca.a - cb.a) < 0.01;
  return a === b;
}

describe('CSS keyframes agree with the preview sampler', () => {
  it.each(NAMES)('%s (every 5 ms, and 1 ms around every keyframe)', (name) => {
    const doc = load(name);
    const times = new Set<number>();
    for (let t = 0; t <= doc.duration; t += 5) times.add(t);
    for (const tr of doc.animations) for (const k of tr.keyframes) for (const d of [-1, 0, 1]) times.add(Math.min(doc.duration, Math.max(0, k.t + d)));
    for (const a of buildCssAnimations(doc)) {
      for (const t of [...times].sort((x, y) => x - y)) {
        const got = evalCss(a, t);
        const want = expected(doc, a, t);
        for (const k of Object.keys(got)) {
          if (!close(got[k], want[k])) throw new Error(`${name} ${a.name} ${k} @${t}ms: css ${String(got[k])} vs preview ${String(want[k])}`);
        }
      }
    }
  });

  it('a hold jumps at the next key (not before) in the CSS too', () => {
    const doc = load('hold');
    const a = buildCssAnimations(doc).find((x) => x.property === 'transform')!;
    expect(evalCss(a, 999).x).toBe(0);
    expect(evalCss(a, 1000).x).toBe(100);
  });
});
