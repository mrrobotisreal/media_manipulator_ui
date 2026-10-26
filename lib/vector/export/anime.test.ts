/**
 * MM45 acceptance 4, 5, 7: anime.js runtime exporter goldens, the runtime
 * constant (licence header, pinned version, size budget), the runtime
 * chooser table, and agreement with the preview sampler.
 *
 * Goldens: `__golden__/anime/<name>.json` → `<name>.svg`, byte-exact with
 * the runtime replaced by `/*ANIME_RUNTIME*\/` (ticket decision 10).
 * Regenerate after an intended change with
 *
 *     UPDATE_GOLDEN=1 npx vitest run lib/vector/export/anime.test.ts
 *
 * Agreement: the exported script is EXECUTED (the real bundled anime.js
 * runtime + the inlined player, `new Function`) against a fake SVG DOM, the
 * timeline is seeked every 5 ms (and ±1 ms around keys), and every attribute
 * it writes is compared with `sampleDoc` (what the editor preview shows).
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { findDocLayer, trackBlurFilter } from '@/lib/vector/advanced';
import { parseColor } from '@/lib/vector/color';
import { transformToMatrix, type Matrix } from '@/lib/vector/geometry';
import { morphCompatible } from '@/lib/vector/morph';
import { sampleDoc } from '@/lib/vector/sampleTrack';
import { parseVectorDoc, type Layer, type VectorDoc } from '@/lib/vector/vectorTypes';
import pkg from '@/package.json';

import {
  ANIME_RUNTIME_PLACEHOLDER,
  animeLicenseHeader,
  buildAnimeSpec,
  canExportAnime,
  docElementIds,
  exportAnimatedSvgAnime,
  specTargets,
} from './anime';
import { ANIME_LICENSE, ANIME_RUNTIME, ANIME_RUNTIME_EXPORTS, ANIME_VERSION } from './animeRuntime.generated';
import { ANIME_REASONS, BLUR_NEEDS_RUNTIME, chooseRuntime } from './chooseRuntime';
import { exportAnimatedSvgCss, generatedComment, MADE_WITH_COMMENT } from './css';

const DIR = join(__dirname, '__golden__', 'anime');
const CSS_DIR = join(__dirname, '__golden__', 'css');
const names = (dir: string) =>
  readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
    .sort();
const NAMES = names(DIR);
const UPDATE = process.env.UPDATE_GOLDEN === '1';

const loadFrom = (dir: string, name: string): VectorDoc => {
  const r = parseVectorDoc(readFileSync(join(dir, `${name}.json`), 'utf8'));
  if (!r.ok) throw new Error(`${name}: ${r.error}`);
  return r.doc;
};
const load = (name: string) => loadFrom(DIR, name);

// ---------------------------------------------------------------------------
// goldens
// ---------------------------------------------------------------------------

describe('anime goldens (byte-exact, runtime placeholder)', () => {
  it('has a golden per animator', () => {
    expect(NAMES).toEqual(['blur', 'draw-on', 'gradient-stop', 'mask-clip', 'morph', 'motion-path']);
  });

  it.each(NAMES)('%s.svg', (name) => {
    const out = exportAnimatedSvgAnime(load(name), { placeholderRuntime: true });
    const file = join(DIR, `${name}.svg`);
    if (UPDATE || !existsSync(file)) writeFileSync(file, out);
    expect(out).toBe(readFileSync(file, 'utf8'));
  });

  it.each(NAMES)('%s: starts with the MIT notice, exactly one <script>, the placeholder once', (name) => {
    const out = readFileSync(join(DIR, `${name}.svg`), 'utf8');
    expect(out.startsWith('<!--\nanime.js v')).toBe(true);
    expect(out.slice(0, 1600)).toContain('Copyright (c) 2025 Julian Garnier');
    expect(out.slice(0, 1600)).toContain('The MIT License');
    expect(out.match(/<script/g)).toHaveLength(1);
    expect(out.split(ANIME_RUNTIME_PLACEHOLDER)).toHaveLength(2);
    expect(out).not.toMatch(/\son[a-z]+=|javascript:/i);
  });

  it('the real export embeds the real runtime instead of the placeholder', () => {
    const out = exportAnimatedSvgAnime(load('morph'));
    expect(out).not.toContain(ANIME_RUNTIME_PLACEHOLDER);
    expect(out).toContain(ANIME_RUNTIME);
    expect(out.match(/<script/g)).toHaveLength(1);
    // The CDATA section is closed exactly once, at the end of the script.
    expect(out.match(/\]\]>/g)).toHaveLength(1);
  });

  it('header comment: licence first, then the brand comment (made-with only for anonymous)', () => {
    const doc = load('draw-on');
    const lines = exportAnimatedSvgAnime(doc, { placeholderRuntime: true }).split('\n');
    const after = lines.indexOf('-->') + 1;
    expect(lines[after]).toBe(generatedComment());
    const anon = exportAnimatedSvgAnime(doc, { placeholderRuntime: true, anonymous: true }).split('\n');
    expect(anon[after]).toBe(MADE_WITH_COMMENT);
  });

  it('every element the player addresses exists in the static markup', () => {
    for (const n of NAMES) {
      const doc = load(n);
      const ids = docElementIds(doc);
      for (const id of specTargets(buildAnimeSpec(doc))) expect(ids.has(id), `${n}: ${id}`).toBe(true);
    }
  });

  it('the morph golden really morphs (independent check: equal command sequences)', () => {
    const tr = load('morph').animations[0];
    const cmds = tr.keyframes.map((k) => String(k.value).replace(/[^A-Za-z]/g, ''));
    expect(new Set(cmds).size).toBe(1);
    expect(morphCompatible(String(tr.keyframes[0].value), String(tr.keyframes[1].value))).toBe(true);
  });

  it('refuses tracks inside symbols and unsafe path data', () => {
    const r = parseVectorDoc({
      version: 1,
      duration: 1000,
      layers: [{ type: 'use', id: 'u', ref: 'sym' }],
      defs: { symbols: [{ id: 'sym', layers: [{ type: 'rect', id: 'in-sym', x: 0, y: 0, width: 5, height: 5 }] }] },
      animations: [{ layerId: 'in-sym', property: 'opacity', keyframes: [{ t: 0, value: 1, easing: 'linear' }, { t: 1000, value: 0, easing: 'linear' }] }],
    });
    if (!r.ok) throw new Error(r.error);
    expect(canExportAnime(r.doc)).toEqual({ ok: false, issues: [{ code: 'defs_layer', layerId: 'in-sym', property: 'opacity' }] });
    const bad = { ...load('morph') };
    bad.animations = [{ ...bad.animations[0], keyframes: [{ t: 0, value: 'M0 0]]></script><script>x()', easing: 'linear' }] }];
    expect(canExportAnime(bad).ok).toBe(false);
    expect(() => exportAnimatedSvgAnime(bad)).toThrow(/cannot export/);
  });
});

// ---------------------------------------------------------------------------
// the runtime constant
// ---------------------------------------------------------------------------

describe('bundled anime.js runtime', () => {
  it('is the pinned version: package.json pins animejs exactly, and the runtime says so', () => {
    const pinned = (pkg as { dependencies: Record<string, string> }).dependencies.animejs;
    expect(pinned).toMatch(/^\d+\.\d+\.\d+$/);
    expect(ANIME_VERSION).toBe(pinned);
    expect(pinned.startsWith('4.')).toBe(true);
    expect(ANIME_RUNTIME.startsWith('/**\n * Anime.js')).toBe(true);
    expect(ANIME_RUNTIME.slice(0, 200)).toContain(`@version v${pinned}`);
    expect(ANIME_RUNTIME.slice(0, 200)).toContain('@license MIT');
    expect(ANIME_RUNTIME.slice(0, 200)).toContain('Julian Garnier');
  });

  it('carries the package LICENSE.md verbatim, and the export header contains it', () => {
    const license = readFileSync(join(__dirname, '..', '..', '..', 'node_modules', 'animejs', 'LICENSE.md'), 'utf8').trim();
    expect(ANIME_LICENSE).toBe(license);
    expect(ANIME_LICENSE).toContain('Copyright (c) 2025 Julian Garnier');
    expect(animeLicenseHeader()).toContain(ANIME_LICENSE);
  });

  it('is tree-shaken to the player’s API and under the 60 KB budget', () => {
    expect([...ANIME_RUNTIME_EXPORTS]).toEqual(['createTimeline', 'cubicBezier', 'steps']);
    expect(ANIME_RUNTIME.length).toBeLessThan(60 * 1024);
    const api = new Function(`${ANIME_RUNTIME}\nreturn __mmAnime;`)() as Record<string, unknown>;
    expect(Object.keys(api).sort()).toEqual(['createTimeline', 'cubicBezier', 'steps']);
  });

});

// ---------------------------------------------------------------------------
// chooseRuntime table (acceptance 4)
// ---------------------------------------------------------------------------

const ROW_DOC = (property: string, values: Array<number | string>, extra: Record<string, unknown> = {}, layerExtra: Record<string, unknown> = {}) => {
  const r = parseVectorDoc({
    version: 1,
    duration: 1000,
    layers: [
      { type: 'path', id: 'guide', d: 'M0 0L100 0' },
      { type: 'path', id: 'x', d: 'M0 0L10 0L10 10Z', fill: 'url(#g)', filter: 'b', ...layerExtra },
    ],
    defs: {
      gradients: [{ type: 'linear', id: 'g', x1: 0, y1: 0, x2: 1, y2: 0, stops: [{ offset: 0, color: '#000' }, { offset: 1, color: '#fff' }] }],
      filters: [{ type: 'blur', id: 'b', stdDeviation: 0 }],
    },
    animations: [
      { layerId: 'x', property, keyframes: values.map((value, i) => ({ t: i * 1000, value, easing: 'linear' })), ...extra },
      ...((extra.more as unknown[]) ?? []),
    ].map((tr) => {
      const { more: _more, ...rest } = tr as Record<string, unknown>;
      void _more;
      return rest;
    }),
  });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};

const ANCHORED = { transform: { x: -5, y: -5, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0, anchorX: 5, anchorY: 5 } };
const ROTATION = { layerId: 'x', property: 'transform.rotation', keyframes: [{ t: 0, value: 0, easing: 'linear' }, { t: 1000, value: 90, easing: 'linear' }] };

const TABLE: Array<[name: string, doc: () => VectorDoc, runtime: 'css' | 'anime', reasons: string[]]> = [
  ['transform.x', () => ROW_DOC('transform.x', [0, 10]), 'css', []],
  ['transform.rotation (anchored)', () => ROW_DOC('transform.rotation', [0, 90], {}, ANCHORED), 'css', []],
  ['transform.scaleX', () => ROW_DOC('transform.scaleX', [1, 2]), 'css', []],
  ['opacity', () => ROW_DOC('opacity', [1, 0]), 'css', []],
  ['fill', () => ROW_DOC('fill', ['#ff0000', '#0000ff']), 'css', []],
  ['stroke', () => ROW_DOC('stroke', ['#ff0000', '#0000ff']), 'css', []],
  ['strokeWidth', () => ROW_DOC('strokeWidth', [1, 4]), 'css', []],
  ['strokeDashoffset (draw-on)', () => ROW_DOC('strokeDashoffset', [30, 0]), 'css', []],
  ['motionPath (basic)', () => ROW_DOC('motionPath', [0, 1], { extras: { pathId: 'guide' } }), 'css', []],
  ['motionPath + autoOrient', () => ROW_DOC('motionPath', [0, 1], { extras: { pathId: 'guide', autoOrient: true } }, ANCHORED), 'css', []],
  ['motionPath + autoOrient + rotation, no anchor', () => ROW_DOC('motionPath', [0, 1], { extras: { pathId: 'guide', autoOrient: true }, more: [ROTATION] }), 'css', []],
  ['gradientStop[i].color', () => ROW_DOC('gradientStop[1].color', ['#ffffff', '#ff0000']), 'css', []],
  ['mask / clip track (no value)', () => ROW_DOC('mask', [0]), 'css', []],
  ['d (morph)', () => ROW_DOC('d', ['M0 0L10 0L10 10Z', 'M0 0L20 0L20 20Z']), 'anime', ['morph']],
  ['d that never changes', () => ROW_DOC('d', ['M0 0L10 0L10 10Z']), 'css', []],
  ['gradientStop[i].offset', () => ROW_DOC('gradientStop[1].offset', [1, 0.5]), 'anime', ['stopOffset']],
  ['filter.blur (SVG filter attribute; Safari has no CSS filter on SVG shapes)', () => ROW_DOC('filter.blur', [0, 6]), BLUR_NEEDS_RUNTIME ? 'anime' : 'css', BLUR_NEEDS_RUNTIME ? ['blur'] : []],
  [
    'motionPath offset-rotate edge case (autoOrient + rotation track + anchor)',
    () => ROW_DOC('motionPath', [0, 1], { extras: { pathId: 'guide', autoOrient: true }, more: [ROTATION] }, ANCHORED),
    'anime',
    ['motionRotate'],
  ],
];

describe('chooseRuntime table', () => {
  it.each(TABLE)('%s → %s', (_name, doc, runtime, reasons) => {
    const choice = chooseRuntime(doc());
    expect(choice).toEqual({ runtime, reasons });
    // reasons are non-empty exactly when the runtime is anime.
    expect(choice.reasons.length > 0).toBe(choice.runtime === 'anime');
  });

  it('covers every anime reason and every animatable property of the model', () => {
    const reasons = new Set(TABLE.flatMap(([, , , r]) => r));
    for (const r of ANIME_REASONS) expect(reasons.has(r), r).toBe(true);
    const covered = TABLE.map(([n]) => n).join('\n');
    for (const p of ['transform', 'opacity', 'fill', 'stroke', 'strokeWidth', 'strokeDashoffset', 'motionPath', 'gradientStop[i].color', 'gradientStop[i].offset', 'd', 'filter.blur', 'mask']) {
      expect(covered, p).toContain(p);
    }
  });

  it('several triggers list each reason once, in table order', () => {
    const doc = ROW_DOC('filter.blur', [0, 6], {
      more: [
        { layerId: 'x', property: 'd', keyframes: [{ t: 0, value: 'M0 0L10 0L10 10Z', easing: 'linear' }, { t: 1000, value: 'M0 0L20 0L20 20Z', easing: 'linear' }] },
        { layerId: 'x', property: 'gradientStop[0].offset', keyframes: [{ t: 0, value: 0, easing: 'linear' }, { t: 1000, value: 0.3, easing: 'linear' }] },
      ],
    });
    expect(chooseRuntime(doc).reasons).toEqual(['morph', 'stopOffset', 'blur']);
  });

  it('the user may force anime; CSS cannot be forced when it is impossible', () => {
    expect(chooseRuntime(ROW_DOC('opacity', [1, 0]), { forceAnime: true })).toEqual({ runtime: 'anime', reasons: [] });
    expect(chooseRuntime(ROW_DOC('d', ['M0 0L10 0L10 10Z', 'M0 0L20 0L20 20Z'])).runtime).toBe('anime');
  });

  it('every CSS golden chooses CSS except blur (Safari: BLUR_NEEDS_RUNTIME); anime goldens choose anime unless CSS-capable', () => {
    for (const n of names(CSS_DIR)) expect(chooseRuntime(loadFrom(CSS_DIR, n)).runtime, n).toBe(n === 'blur' ? 'anime' : 'css');
    const animeOnly = NAMES.filter((n) => chooseRuntime(load(n)).runtime === 'anime');
    expect(animeOnly).toEqual(['blur', 'gradient-stop', 'morph', 'motion-path']);
  });
});

// ---------------------------------------------------------------------------
// no script in CSS mode (security)
// ---------------------------------------------------------------------------

describe('CSS-runtime exports contain no script', () => {
  it.each(names(CSS_DIR))('%s: no <script>, no event handler, no javascript: URL', (name) => {
    const doc = loadFrom(CSS_DIR, name);
    for (const anonymous of [false, true]) {
      const out = exportAnimatedSvgCss(doc, { anonymous });
      expect(out).not.toMatch(/<script/i);
      expect(out).not.toMatch(/\son[a-z]+\s*=/i);
      expect(out).not.toMatch(/javascript:/i);
      expect(out).not.toContain('__mmAnime');
    }
  });
});

// ---------------------------------------------------------------------------
// agreement: run the real exported script against a fake DOM
// ---------------------------------------------------------------------------

class FakeEl {
  attrs = new Map<string, string>();
  children: FakeEl[] = [];
  constructor(readonly tag: string) {}
  setAttribute(n: string, v: string) {
    this.attrs.set(n, v);
  }
  getElementsByTagName(tag: string): FakeEl[] {
    const out: FakeEl[] = [];
    const walk = (e: FakeEl) => {
      for (const c of e.children) {
        if (c.tag === tag) out.push(c);
        walk(c);
      }
    };
    walk(this);
    return out;
  }
}

/** A fake document whose ids are the doc's layers, gradients (with stop children) and filters (with a blur child). */
function fakeDom(doc: VectorDoc) {
  const byId = new Map<string, FakeEl>();
  for (const id of docElementIds(doc)) byId.set(id, new FakeEl('g'));
  for (const g of doc.defs.gradients) byId.get(g.id)!.children = g.stops.map(() => new FakeEl('stop'));
  for (const f of doc.defs.filters) byId.get(f.id)!.children = [new FakeEl('feGaussianBlur')];
  return { root: { getElementById: (id: string) => byId.get(id) ?? null }, byId };
}

type Timeline = { seek: (t: number) => unknown; pause: () => unknown };

/** Execute the exported <script> body (runtime + player + call) against the fake DOM; nothing autoplays. */
function runExport(doc: VectorDoc) {
  const out = exportAnimatedSvgAnime(doc);
  const body = out.slice(out.indexOf('<![CDATA[') + 9, out.lastIndexOf(']]>'));
  const { root, byId } = fakeDom(doc);
  // The runtime keeps the real (jsdom) `document`; only the player's root is the fake DOM.
  const call = body.replace(/runPlayer\(__mmAnime, ([\s\S]*), document\);\s*$/, 'return runPlayer(__mmAnime, $1, __root);');
  if (call === body) throw new Error('player call not found');
  const handle = new Function('__root', call)(root) as { timeline: Timeline };
  handle.timeline.pause();
  return { tl: handle.timeline, byId };
}

const NUMS = /[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/gi;
const nums = (s: string) => (s.match(NUMS) ?? []).map(Number);

function matrixOf(attr: string): Matrix {
  // Evaluate the SVG transform list the player writes.
  let m: Matrix = [1, 0, 0, 1, 0, 0];
  const mul = (a: Matrix, b: Matrix): Matrix => [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5],
  ];
  for (const op of attr.matchAll(/(translate|rotate|skewX|skewY|scale)\(([^)]*)\)/g)) {
    const v = nums(op[2]);
    const r = (v[0] * Math.PI) / 180;
    const k: Matrix =
      op[1] === 'translate' ? [1, 0, 0, 1, v[0], v[1]]
      : op[1] === 'rotate' ? [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0]
      : op[1] === 'skewX' ? [1, 0, Math.tan(r), 1, 0, 0]
      : op[1] === 'skewY' ? [1, Math.tan(r), 0, 1, 0, 0]
      : [v[0], 0, 0, v[1], 0, 0];
    m = mul(m, k);
  }
  return m;
}

function closeNum(a: number, b: number, tol: number) {
  return Math.abs(a - b) <= tol;
}

function closeColor(a: string, b: string) {
  const ca = parseColor(a);
  const cb = parseColor(b);
  if (!ca || !cb) return a === b;
  return Math.abs(ca.r - cb.r) <= 1.5 && Math.abs(ca.g - cb.g) <= 1.5 && Math.abs(ca.b - cb.b) <= 1.5 && Math.abs(ca.a - cb.a) < 0.01;
}

/** Compare everything the player wrote with the preview at t. Returns a mismatch description or null. */
function compare(doc: VectorDoc, byId: Map<string, FakeEl>, t: number): string | null {
  const at = sampleDoc(doc, t);
  const spec = buildAnimeSpec(doc);
  for (const tf of spec.transforms) {
    const got = byId.get(tf.el)!.attrs.get('transform');
    const layer = findDocLayer(at, tf.el) as Exclude<Layer, { type: 'raw' }>;
    const want = transformToMatrix(layer.transform);
    const g = got ? matrixOf(got) : ([1, 0, 0, 1, 0, 0] as Matrix);
    // Linear part to 1e-3, translation to 0.05 user units (path sampling + 3-decimal output).
    for (let i = 0; i < 6; i++) if (!closeNum(g[i], want[i], i < 4 ? 2e-3 : 0.05)) return `${tf.el} transform[${i}] ${g[i]} vs ${want[i]} @${t}`;
  }
  for (const ch of spec.channels) {
    if (!('attr' in ch.to)) continue;
    const el = ch.sub ? byId.get(ch.el)!.getElementsByTagName(ch.sub[0])[ch.sub[1]] : byId.get(ch.el)!;
    const got = el.attrs.get(ch.to.attr)!;
    let want: string | number;
    if (ch.sub?.[0] === 'stop') {
      const s = at.defs.gradients.find((g) => g.id === ch.el)!.stops[ch.sub[1]];
      want = ch.to.attr === 'stop-color' ? s.color : s.offset;
    } else if (ch.sub?.[0] === 'feGaussianBlur') {
      want = at.defs.filters.find((f) => f.id === ch.el)!.stdDeviation;
    } else {
      const layer = findDocLayer(at, ch.el) as unknown as Record<string, unknown>;
      const key = { opacity: 'opacity', fill: 'fill', stroke: 'stroke', 'stroke-width': 'strokeWidth', 'stroke-dashoffset': 'strokeDashoffset', d: 'd' }[ch.to.attr]!;
      want = layer[key] as string | number;
    }
    if (ch.kind === 'color') {
      if (!closeColor(got, String(want))) return `${ch.el} ${ch.to.attr} ${got} vs ${want} @${t}`;
    } else if (ch.kind === 'path') {
      const a = nums(got);
      const b = nums(String(want));
      if (a.length !== b.length || a.some((v, i) => !closeNum(v, b[i], 0.01))) return `${ch.el} d ${got} vs ${want} @${t}`;
    } else if (!closeNum(Number(got), Number(want), 1e-3 * Math.max(1, Math.abs(Number(want))))) return `${ch.el} ${ch.to.attr} ${got} vs ${want} @${t}`;
  }
  return null;
}

describe('anime.js runtime agrees with the preview sampler', () => {
  const docs = [...NAMES.map((n) => [n, () => load(n)] as const), ...names(CSS_DIR).map((n) => [`css/${n}`, () => loadFrom(CSS_DIR, n)] as const)];

  it.each(docs)('%s (every 5 ms, and 1 ms around every keyframe)', (name, get) => {
    const doc = get();
    const { tl, byId } = runExport(doc);
    const times = new Set<number>();
    for (let t = 0; t <= doc.duration; t += 5) times.add(t);
    for (const tr of doc.animations) for (const k of tr.keyframes) for (const d of [-1, 0, 1]) times.add(Math.min(doc.duration, Math.max(0, k.t + d)));
    // Seek forwards (playback order); the end is checked separately (a loop wraps to 0 there).
    for (const t of [...times].filter((x) => x < doc.duration).sort((a, b) => a - b)) {
      tl.seek(t);
      const bad = compare(doc, byId, t);
      if (bad) throw new Error(`${name}: ${bad}`);
    }
  });

  it('the end of a non-looping composition holds the last frame', () => {
    const doc = load('motion-path');
    expect(doc.loop).toBe(false);
    const { tl, byId } = runExport(doc);
    tl.seek(doc.duration);
    expect(compare(doc, byId, doc.duration)).toBeNull();
  });

  it('seeking backwards (a loop restart) gives the same frame as seeking forwards', () => {
    const doc = load('morph');
    const { tl, byId } = runExport(doc);
    tl.seek(1700);
    tl.seek(300);
    expect(compare(doc, byId, 300)).toBeNull();
  });

  it('the blur golden animates the filter element, not a CSS filter', () => {
    const doc = load('blur');
    const spec = buildAnimeSpec(doc);
    expect(spec.channels[0]).toMatchObject({ el: trackBlurFilter(doc, 'glow'), sub: ['feGaussianBlur', 0], to: { attr: 'stdDeviation' } });
  });
});
