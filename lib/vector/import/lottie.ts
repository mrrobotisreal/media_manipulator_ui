/**
 * Lottie JSON → `VectorDoc` (ticket MM46 decision 3, design §3.3 rung 4 and
 * §3.6). Client-side only, no route. `importLottie(input) → { doc, warnings }`.
 *
 * UNTRUSTED INPUT. The order is fixed:
 *
 *   1. size cap   `LOTTIE_MAX_BYTES` (4 MB, the doc cap) on the raw text,
 *                 checked BEFORE the counting call so an oversize file never
 *                 spends an allowance (`checkLottieFile`);
 *   2. counting   the caller spends one `import_lottie` unit on
 *                 `POST /api/vector/exports` and parses only on `{ok:true}`
 *                 (`components/vector/lottie-import.ts`);
 *   3. shape      `JSON.parse`, then a Zod envelope (`fr`, `ip`, `op`, `w`,
 *                 `h`, `layers` array) and a walk with hard caps: 5000 Lottie
 *                 layers + shapes, nesting depth 32, 2000 keyframes per
 *                 property, 100 000 bezier vertices per shape;
 *   4. map        every value read through typed accessors (finite numbers,
 *                 arrays of numbers), never trusted structurally; strings
 *                 that reach the document are only layer NAMES (length-capped
 *                 to 200) and embedded `data:image/(png|jpeg|gif|webp|avif)`
 *                 URIs (checked against the model's `IMAGE_HREF_PATTERN`).
 *                 Ids are minted here (`l1`, `l2`…), never taken from the file;
 *   5. validate   the result goes through `parseVectorDoc` (the same Zod
 *                 schema and integrity rules as every document).
 *
 * Nothing is dropped silently: whatever cannot be mapped yields a warning
 * `{layerId, feature, reason}` from the shared list (`lottieSupport.ts`) and,
 * where structure would be lost, a labelled EMPTY GROUP placeholder (proposed
 * in the ticket; confirmed) so the layer order and names survive. The editor
 * shows the full list before the document opens.
 *
 * Mapping (the writer's inverse, `export/lottie.ts`):
 *
 *   shape layer (ty 4) / null (3) / solid (1) / image (2) / precomp (0, inlined)
 *                → group (or rect / image) with the layer transform; the
 *                  Lottie `parent` chain is resolved by nesting the child in
 *                  a group per ancestor transform (a parent's opacity does not
 *                  inherit in Lottie, so ancestor groups carry none);
 *   gr           → group with its `tr`, items reversed (Lottie draws the first on top);
 *   rc / el / sh / sr → rect / ellipse / path (polystars as outlines), one
 *                  layer per geometry, painted with the NEAREST fill and
 *                  stroke that follow it in the same group (or an enclosing
 *                  one), as Lottie does;
 *   fl / st / gf / gs → fill / stroke paints, gradients in `defs` (user space);
 *   tm           → draw-on: `strokeDasharray = [L]` + `strokeDashoffset`
 *                  keyframes (L = outline length), start 0 / offset 0 only;
 *   ks / tr      → transform fields (the writer's mapping inverted, skew axis
 *                  0 or 90 only), opacity;
 *   keyframes    → Motion keys at `round(1000·t/fr)` ms: `h: 1` → hold, bezier
 *                  handles → `{cubicBezier}`, (0,0,1,1) → linear; per-dimension
 *                  handles use the first dimension (Motion has one curve per track).
 *
 * The document's time origin is `ip`; `duration` = (op − ip)/fr; `fps` = fr
 * (Motion's preview cap is 120).
 */
import { z } from 'zod';

import { DEFAULT_BACKGROUND, IMAGE_HREF_PATTERN, VECTOR_ID_PATTERN, VECTOR_MAX_DEPTH, VECTOR_MAX_KEYFRAMES, VECTOR_MAX_LAYERS, parseVectorDoc, type Easing, type Gradient, type Keyframe, type Layer, type Track, type VectorDoc, type VectorTransform } from '@/lib/vector/vectorTypes';
import { layerOutline } from '@/lib/vector/advanced';
import { formatColor, parseColor } from '@/lib/vector/color';
import { canonicalTransform, IDENTITY_TRANSFORM } from '@/lib/vector/geometry';
import { bezierToCubicPath, bezierToPath, ellipseBezier, handleAt, hexFromLottie, r3, rectBezier, type LottieBezier, type Vec } from '@/lib/vector/lottieCommon';
import { morphCompatible } from '@/lib/vector/morph';
import { interpolate } from '@/lib/vector/sampleTrack';
import { EASE_IN_CURVE, EASE_OUT_CURVE } from '@/lib/vector/export/css';
import { normalizeMorphSet } from '@/lib/vector/morph';
import { pathLength } from '@/lib/vector/pathLength';
import { normalizePath } from '@/lib/vector/pathData';
import { LOTTIE_BACKGROUND_CLASS, LOTTIE_VIEWBOX_CLASS } from '@/lib/vector/export/lottie';
import type { LottieImportFeature, LottieWarning } from '@/lib/vector/export/lottieSupport';

// ---------------------------------------------------------------------------
// limits and errors
// ---------------------------------------------------------------------------

/** Raw JSON text cap (bytes of UTF-16 length, like the SVG import). */
export const LOTTIE_MAX_BYTES = 4 * 1024 * 1024;
/** Layers + shape items in the file (the doc's layer cap, MM43). */
export const LOTTIE_MAX_ITEMS = VECTOR_MAX_LAYERS;
export const LOTTIE_MAX_VERTICES = 100_000;

export type LottieImportErrorCode = 'too_large' | 'not_json' | 'not_lottie' | 'too_complex' | 'invalid';

export class LottieImportError extends Error {
  constructor(
    readonly code: LottieImportErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'LottieImportError';
  }
}

/** Step 1, before any counting call: refuse what can never import (no allowance spent). */
export function checkLottieFile(file: { size: number }): LottieImportErrorCode | null {
  return file.size > LOTTIE_MAX_BYTES ? 'too_large' : null;
}

/** The top-level envelope (everything else is read through the guarded accessors below). */
const envelopeSchema = z
  .object({
    fr: z.number().finite().positive().max(1000),
    ip: z.number().finite().min(-1e6).max(1e6),
    op: z.number().finite().min(-1e6).max(1e7),
    w: z.number().finite().positive().max(100_000),
    h: z.number().finite().positive().max(100_000),
    nm: z.unknown().optional(),
    layers: z.array(z.unknown()).max(LOTTIE_MAX_ITEMS),
    assets: z.array(z.unknown()).max(LOTTIE_MAX_ITEMS).optional(),
    ddd: z.unknown().optional(),
  })
  .passthrough()
  .refine((v) => v.op > v.ip, { message: 'op must be after ip' });

// ---------------------------------------------------------------------------
// guarded readers
// ---------------------------------------------------------------------------

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const fin = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const numOr = (v: unknown, d: number) => (fin(v) ? v : d);
const vecOf = (v: unknown, len: number, d: number[]): number[] => {
  if (fin(v)) return [v, ...d.slice(1)];
  if (!Array.isArray(v)) return d;
  return d.map((x, i) => (fin(v[i]) ? (v[i] as number) : x));
};
const nameOf = (v: unknown): string | undefined => (typeof v === 'string' && v.length > 0 ? v.slice(0, 200) : undefined);

/** A property's static value or keyframes (`{a, k}`), normalised. */
interface Prop {
  animated: boolean;
  /** Static value (or the first key's) per dimension. */
  value: number[];
  keys: PropKey[];
  expression: boolean;
}
interface PropKey {
  t: number;
  s: number[];
  hold: boolean;
  /** Easing handles of the segment starting at this key (per dimension when arrays). */
  o: Obj | null;
  i: Obj | null;
  /** Spatial tangents present (curved motion). */
  spatial: boolean;
}

interface Ctx {
  fr: number;
  ip: number;
  durationMs: number;
  warnings: LottieWarning[];
  warned: Set<string>;
  items: number;
  ids: number;
  tracks: Track[];
  gradients: Gradient[];
  assets: Map<string, Obj>;
  precompDepth: number;
  /** Ids already in the document. */
  used: Set<string>;
  /** `ln` ids in the file (minted ids avoid them so they can be kept). */
  reserved: Set<string>;
  /** Leaves made from a bare geometry item (no id of their own in the file): the only ones `collapse` merges. */
  leaves: Set<string>;
}

function warn(ctx: Ctx, layerId: string, feature: LottieImportFeature, reason: string): void {
  const key = `${layerId}\u0000${feature}`;
  if (ctx.warned.has(key)) return;
  ctx.warned.add(key);
  ctx.warnings.push({ layerId, feature, reason: reason.slice(0, 300) });
}

function count(ctx: Ctx): void {
  ctx.items += 1;
  if (ctx.items > LOTTIE_MAX_ITEMS) throw new LottieImportError('too_complex', `more than ${LOTTIE_MAX_ITEMS} layers and shapes`);
}

function mint(ctx: Ctx, prefix = 'l'): string {
  let id = `${prefix}${++ctx.ids}`;
  while (ctx.used.has(id) || ctx.reserved.has(id)) id = `${prefix}${++ctx.ids}`;
  ctx.used.add(id);
  return id;
}

/** The file's own id (`ln`, what our writer stores the Motion id in) when it is a valid, unused id; else a minted one. */
function claimId(ctx: Ctx, preferred: unknown, prefix = 'l'): string {
  if (typeof preferred === 'string' && preferred.length <= 128 && VECTOR_ID_PATTERN.test(preferred) && !ctx.used.has(preferred)) {
    ctx.used.add(preferred);
    return preferred;
  }
  return mint(ctx, prefix);
}

/** Pre-scan the `ln` ids (bounded by the item cap). */
function reserveIds(ctx: Ctx, list: unknown, budget = { n: 0 }): void {
  if (!Array.isArray(list)) return;
  for (const item of list) {
    if (!isObj(item) || ++budget.n > LOTTIE_MAX_ITEMS * 2) return;
    if (typeof item.ln === 'string' && VECTOR_ID_PATTERN.test(item.ln)) ctx.reserved.add(item.ln);
    reserveIds(ctx, item.shapes, budget);
    reserveIds(ctx, item.it, budget);
  }
}

/** A layer's name: `nm` unless it only repeats the id (the writer writes `nm = name ?? id`). */
const nameFor = (raw: Obj, id: string) => {
  const n = nameOf(raw.nm);
  return n && n !== id ? n : undefined;
};

/**
 * A container holding exactly one plain leaf (no transform, opacity, name,
 * mask, tracks of its own on those) is that leaf: the writer emits every
 * Motion leaf as a layer or group around its geometry.
 */
function collapse(ctx: Ctx, group: Extract<Layer, { type: 'group' }>): Layer {
  if (group.children.length !== 1) return group;
  const leaf = group.children[0];
  if (leaf.type === 'group' || leaf.type === 'raw' || !ctx.leaves.has(leaf.id)) return group;
  if (leaf.transform || leaf.opacity !== undefined || leaf.name || leaf.hidden || leaf.mask || leaf.clipPath) return group;
  if (ctx.tracks.some((tr) => tr.layerId === leaf.id && (tr.property.startsWith('transform.') || tr.property === 'opacity'))) return group;
  for (const tr of ctx.tracks) if (tr.layerId === leaf.id) tr.layerId = group.id;
  for (const w of ctx.warnings) if (w.layerId === leaf.id) w.layerId = group.id;
  ctx.used.delete(leaf.id);
  ctx.leaves.delete(leaf.id);
  const { children: _children, type: _type, id, name, hidden, transform, opacity, mask, clipPath, ...rest } = group;
  void _children;
  void _type;
  void rest;
  return {
    ...leaf,
    id,
    ...(name ? { name } : {}),
    ...(hidden ? { hidden } : {}),
    ...(transform ? { transform } : {}),
    ...(opacity !== undefined ? { opacity } : {}),
    ...(mask ? { mask } : {}),
    ...(clipPath ? { clipPath } : {}),
  } as Layer;
}

/** Frame → ms. Motion keys are whole ms; the writer puts baked keys on exact frames, so this is its inverse. */
const msOf = (ctx: Ctx, frame: number) => Math.max(0, Math.round(((frame - ctx.ip) * 1000) / ctx.fr));

function readProp(ctx: Ctx, layerId: string, raw: unknown, dims: number, d: number[]): Prop {
  if (!isObj(raw)) return { animated: false, value: d, keys: [], expression: false };
  const expression = typeof raw.x === 'string' && raw.x.length > 0;
  if (expression) warn(ctx, layerId, 'expression', 'expression ignored; keyframed values used');
  const k = raw.k;
  const animated = Array.isArray(k) && k.length > 0 && isObj(k[0]) && 't' in (k[0] as Obj);
  if (!animated) return { animated: false, value: vecOf(k, dims, d), keys: [], expression };
  const list = (k as unknown[]).slice(0, VECTOR_MAX_KEYFRAMES);
  if ((k as unknown[]).length > VECTOR_MAX_KEYFRAMES) throw new LottieImportError('too_complex', 'too many keyframes');
  const keys: PropKey[] = [];
  let prevEnd: number[] | null = null;
  for (const item of list) {
    if (!isObj(item) || !fin(item.t)) continue;
    // Legacy files (Bodymovin < 5.5) put the end value in `e` of the previous key.
    const s: number[] = item.s !== undefined ? vecOf(item.s, dims, prevEnd ?? d) : (prevEnd ?? d);
    const o = isObj(item.o) ? item.o : null;
    const i = isObj(item.i) ? item.i : null;
    const spatial = (Array.isArray(item.to) && (item.to as unknown[]).some((v) => fin(v) && v !== 0)) || (Array.isArray(item.ti) && (item.ti as unknown[]).some((v) => fin(v) && v !== 0));
    keys.push({ t: item.t, s, hold: item.h === 1, o, i, spatial });
    prevEnd = item.e !== undefined ? vecOf(item.e, dims, s) : null;
    if (prevEnd && keys.length === list.length) keys.push({ t: item.t, s: prevEnd, hold: false, o: null, i: null, spatial: false });
  }
  if (keys.length === 0) return { animated: false, value: d, keys: [], expression };
  keys.sort((a, b) => a.t - b.t);
  const moves = keys.some((k) => k.s.some((v, i) => v !== keys[0].s[i]));
  return { animated: keys.length > 1 && moves, value: keys[0].s, keys, expression };
}

const near = (a: readonly number[], b: readonly number[]) => a.every((v, i) => Math.abs(v - b[i]) < 5e-4);

/**
 * The Motion easing of the segment starting at `k`, for dimension `dim`.
 * The writer's exact preset curves map back to the presets.
 */
function easingOf(k: PropKey, dim = 0): Easing {
  if (k.hold) return 'hold';
  if (!k.o || !k.i) return 'linear';
  const c = [handleAt(k.o.x as never, dim, 0), handleAt(k.o.y as never, dim, 0), handleAt(k.i.x as never, dim, 1), handleAt(k.i.y as never, dim, 1)].map((v) => Math.round(v * 10000) / 10000);
  const [x1, y1, x2, y2] = c;
  if (x1 === y1 && x2 === y2) return 'linear';
  if (near(c, EASE_IN_CURVE)) return 'easeIn';
  if (near(c, EASE_OUT_CURVE)) return 'easeOut';
  return { cubicBezier: [Math.min(1, Math.max(0, x1)), y1, Math.min(1, Math.max(0, x2)), y2] };
}

/** Motion keyframes of one dimension of a prop, mapped through `f`. Coincident ms keep the last. */
function keysOf(ctx: Ctx, p: Prop, f: (s: number[]) => number | string, dim: number): Keyframe[] {
  const out: Keyframe[] = [];
  const keys = [...p.keys].sort((a, b) => a.t - b.t);
  // A key on every frame (a baked property): keep the frame times at full precision, so writing the document
  // again lands on the same frames (whole-ms rounding would move them off the grid).
  const perFrame = keys.length > 2 && keys.every((k, i) => i === 0 || Math.abs(k.t - keys[i - 1].t - 1) < 1e-9);
  const timeOf = (frame: number) => (perFrame ? Math.max(0, Math.round((((frame - ctx.ip) * 1000) / ctx.fr) * 1e6) / 1e6) : msOf(ctx, frame));
  for (const k of keys) {
    const t = timeOf(k.t);
    const kf: Keyframe = { t, value: f(k.s), easing: easingOf(k, dim) };
    if (out.length > 0 && out[out.length - 1].t === t) out[out.length - 1] = kf;
    else out.push(kf);
  }
  // Keys after the end: the first one is kept (it shapes the last segment), the rest never play.
  const last = out.findIndex((k) => k.t > ctx.durationMs);
  return last < 0 ? out : out.slice(0, Math.max(1, last + 1));
}

/** One dimension of a per-dimension easing handle. */
function dimHandle(h: Obj | null, dim: number): Obj | null {
  if (!h) return null;
  return { x: handleAt(h.x as never, dim, 0), y: handleAt(h.y as never, dim, 0) };
}

/** Two values equal up to the writer's rounding (3-decimal numbers, 8-bit colours, path numbers). */
function closeValue(a: number | string, b: number | string): boolean {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 0.0015;
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ca = parseColor(a);
  const cb = parseColor(b);
  if (ca && cb) return Math.abs(ca.r - cb.r) <= 1 && Math.abs(ca.g - cb.g) <= 1 && Math.abs(ca.b - cb.b) <= 1 && Math.abs(ca.a - cb.a) <= 0.002;
  if (!morphCompatible(a, b)) return false;
  const na = a.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi) ?? [];
  const nb = b.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi) ?? [];
  return na.length === nb.length && na.every((x, i) => Math.abs(Number(x) - Number(nb[i])) <= 0.0015);
}

/**
 * The writer splits an `easeBoth` segment into an easeIn half and an easeOut
 * half with a key at the midpoint (exact: easeBoth IS those two halves). A key
 * pair easeIn → (midpoint, midpoint value) easeOut → next merges back into one
 * easeBoth key. Merging is lossless whatever wrote the file.
 */
function mergeEaseBoth(keys: Keyframe[]): Keyframe[] {
  const out: Keyframe[] = [];
  for (let i = 0; i < keys.length; i++) {
    const a = keys[i];
    const m = keys[i + 1];
    const b = keys[i + 2];
    if (a.easing === 'easeIn' && m?.easing === 'easeOut' && b && Math.abs(m.t - (a.t + b.t) / 2) <= 1 && closeValue(m.value, interpolate(a.value, b.value, 0.5))) {
      out.push({ ...a, easing: 'easeBoth' });
      i += 1; // skip the midpoint key
      continue;
    }
    out.push(a);
  }
  return out;
}

function addTrack(ctx: Ctx, layerId: string, property: string, p: Prop, f: (s: number[]) => number | string, dim = 0): void {
  if (!p.animated) return;
  const keyframes = mergeEaseBoth(keysOf(ctx, p, f, dim));
  if (keyframes.length < 2 || keyframes.every((k) => k.value === keyframes[0].value)) return;
  ctx.tracks.push({ layerId, property, keyframes });
}

// ---------------------------------------------------------------------------
// transforms
// ---------------------------------------------------------------------------

/** Lottie `ks` / `tr` → Motion transform + opacity (+ tracks on `layerId`). */
function readTransform(ctx: Ctx, layerId: string, ks: unknown, withOpacity: boolean): { transform?: VectorTransform; opacity?: number } {
  const t = isObj(ks) ? ks : {};
  const a = readProp(ctx, layerId, t.a, 2, [0, 0]);
  const s = readProp(ctx, layerId, t.s, 2, [100, 100]);
  const r = readProp(ctx, layerId, t.r ?? t.rz, 1, [0]);
  const o = readProp(ctx, layerId, t.o, 1, [100]);
  const sk = readProp(ctx, layerId, t.sk, 1, [0]);
  const sa = readProp(ctx, layerId, t.sa, 1, [0]);
  if (isObj(t.rx) || isObj(t.ry) || isObj(t.or)) warn(ctx, layerId, 'threeD', '3D rotation ignored');
  let px: Prop;
  let py: Prop;
  const p = isObj(t.p) ? t.p : undefined;
  if (p && p.s === true) {
    px = readProp(ctx, layerId, p.x, 1, [0]);
    py = readProp(ctx, layerId, p.y, 1, [0]);
  } else {
    const both = readProp(ctx, layerId, p, 2, [0, 0]);
    if (both.keys.some((k) => k.spatial)) warn(ctx, layerId, 'spatialTangents', 'curved motion path flattened to straight segments');
    px = { ...both, value: [both.value[0]], keys: both.keys.map((k) => ({ ...k, s: [k.s[0]] })) };
    // y eases with the second handle dimension.
    py = { ...both, value: [both.value[1]], keys: both.keys.map((k) => ({ ...k, s: [k.s[1]], o: dimHandle(k.o, 1), i: dimHandle(k.i, 1) })) };
  }
  const axis = sa.value[0];
  const skewAxis = Math.abs(axis) < 1e-6 ? 'x' : Math.abs(Math.abs(axis) - 90) < 1e-6 ? 'y' : null;
  if ((sk.animated || sk.value[0] !== 0) && !skewAxis) warn(ctx, layerId, 'skewAxis', `skew axis ${r3(axis)}°`);
  if (sa.animated) warn(ctx, layerId, 'skewAxis', 'animated skew axis');
  const ySign = Math.abs(axis + 90) < 1e-6 ? -1 : 1;

  const ax = a.value[0];
  const ay = a.value[1];
  // Animated anchors: x = p - a needs both on the same keys; tracks are written as separate fields.
  const tf: VectorTransform = {
    ...IDENTITY_TRANSFORM,
    anchorX: r3(ax),
    anchorY: r3(ay),
    x: r3(px.value[0] - ax),
    y: r3(py.value[0] - ay),
    scaleX: r3(s.value[0] / 100),
    scaleY: r3(s.value[1] / 100),
    rotation: r3(r.value[0]),
    skewX: skewAxis === 'x' ? r3(-sk.value[0]) : 0,
    skewY: skewAxis === 'y' ? r3(ySign * sk.value[0]) : 0,
  };
  addTrack(ctx, layerId, 'transform.anchorX', a, (v) => r3(v[0]));
  addTrack(ctx, layerId, 'transform.anchorY', a, (v) => r3(v[1]), 1);
  if (a.animated) {
    // x = p − a at every key of either.
    positionMinusAnchor(ctx, layerId, 'transform.x', px, a, 0);
    positionMinusAnchor(ctx, layerId, 'transform.y', py, a, 1);
  } else {
    addTrack(ctx, layerId, 'transform.x', px, (v) => r3(v[0] - ax));
    addTrack(ctx, layerId, 'transform.y', py, (v) => r3(v[0] - ay));
  }
  addTrack(ctx, layerId, 'transform.scaleX', s, (v) => r3(v[0] / 100));
  addTrack(ctx, layerId, 'transform.scaleY', s, (v) => r3(v[1] / 100), 1);
  addTrack(ctx, layerId, 'transform.rotation', r, (v) => r3(v[0]));
  if (skewAxis === 'x') addTrack(ctx, layerId, 'transform.skewX', sk, (v) => r3(-v[0]));
  if (skewAxis === 'y') addTrack(ctx, layerId, 'transform.skewY', sk, (v) => r3(ySign * v[0]));
  const out: { transform?: VectorTransform; opacity?: number } = {};
  const canon = canonicalTransform(tf);
  if (canon) out.transform = canon;
  if (withOpacity) {
    const op = Math.min(1, Math.max(0, o.value[0] / 100));
    if (op !== 1) out.opacity = r3(op);
    addTrack(ctx, layerId, 'opacity', o, (v) => r3(Math.min(1, Math.max(0, v[0] / 100))));
  }
  return out;
}

function positionMinusAnchor(ctx: Ctx, layerId: string, property: string, p: Prop, a: Prop, dim: number): void {
  const times = [...new Set([...p.keys, ...a.keys].map((k) => k.t))].sort((x, y) => x - y);
  if (times.length < 2) return;
  const valueAt = (pr: Prop, t: number, d: number) => {
    if (!pr.animated) return pr.value[d];
    const ks = pr.keys;
    if (t <= ks[0].t) return ks[0].s[d];
    for (let i = 0; i + 1 < ks.length; i++) {
      if (t < ks[i + 1].t) return ks[i].hold ? ks[i].s[d] : ks[i].s[d] + ((ks[i + 1].s[d] - ks[i].s[d]) * (t - ks[i].t)) / (ks[i + 1].t - ks[i].t);
    }
    return ks[ks.length - 1].s[d];
  };
  if (p.animated && a.animated) warn(ctx, layerId, 'spatialTangents', 'position and anchor both animated: eased in straight segments');
  const driver = p.animated ? p : a;
  const keyframes: Keyframe[] = times.map((t) => {
    const k = driver.keys.find((x) => x.t === t);
    return { t: msOf(ctx, t), value: r3(valueAt(p, t, 0) - valueAt(a, t, dim)), easing: k ? easingOf(k, driver === a ? dim : 0) : 'linear' };
  });
  const dedup = keyframes.filter((k, i) => i === 0 || k.t !== keyframes[i - 1].t);
  if (dedup.length >= 2 && dedup.some((k) => k.value !== dedup[0].value)) ctx.tracks.push({ layerId, property, keyframes: dedup });
}

// ---------------------------------------------------------------------------
// paints
// ---------------------------------------------------------------------------

interface Paint {
  kind: 'fill' | 'stroke';
  /** Static paint string. */
  paint: string;
  opacity: number;
  /** Fill rule (fill only). */
  evenodd?: boolean;
  width?: number;
  linecap?: 'butt' | 'round' | 'square';
  linejoin?: 'miter' | 'round' | 'bevel';
  miter?: number;
  dash?: number[];
  dashOffset?: number;
  /** Source props, applied as tracks on every layer that uses the paint. */
  colorProp?: Prop;
  opacityProp?: Prop;
  widthProp?: Prop;
  dashOffsetProp?: Prop;
  gradientStops?: { prop: Prop; count: number };
}

const CAPS = { 1: 'butt', 2: 'round', 3: 'square' } as const;
const JOINS = { 1: 'miter', 2: 'round', 3: 'bevel' } as const;

function readColorPaint(ctx: Ctx, id: string, item: Obj, kind: 'fill' | 'stroke'): Paint {
  const c = readProp(ctx, id, item.c, 4, [0, 0, 0, 1]);
  const o = readProp(ctx, id, item.o, 1, [100]);
  const paint: Paint = { kind, paint: hexFromLottie(c.value), opacity: Math.min(1, Math.max(0, o.value[0] / 100)) };
  if (c.animated) paint.colorProp = c;
  if (o.animated) paint.opacityProp = o;
  if (kind === 'fill') paint.evenodd = item.r === 2;
  return paint;
}

function readStrokeFields(ctx: Ctx, id: string, item: Obj, paint: Paint): void {
  const w = readProp(ctx, id, item.w, 1, [1]);
  paint.width = Math.max(0, w.value[0]);
  if (w.animated) paint.widthProp = w;
  paint.linecap = CAPS[item.lc as 1 | 2 | 3] ?? 'round';
  paint.linejoin = JOINS[item.lj as 1 | 2 | 3] ?? 'round';
  paint.miter = Math.max(1, numOr(item.ml, 4));
  if (Array.isArray(item.d)) {
    const dash: number[] = [];
    for (const d of item.d as unknown[]) {
      if (!isObj(d)) continue;
      const v = readProp(ctx, id, d.v, 1, [0]);
      if (d.n === 'o') {
        paint.dashOffset = v.value[0];
        if (v.animated) paint.dashOffsetProp = v;
      } else {
        dash.push(Math.max(0, v.value[0]));
        if (v.animated) warn(ctx, id, 'trimComplex', 'animated dash lengths: the first value is used');
      }
    }
    if (dash.length > 0) paint.dash = dash.slice(0, 64);
  }
}

function readGradientPaint(ctx: Ctx, id: string, item: Obj, kind: 'fill' | 'stroke'): Paint | null {
  const g = isObj(item.g) ? item.g : {};
  const count = Math.min(256, Math.max(0, Math.floor(numOr(g.p, 0))));
  if (count < 1) return null;
  // The flat array is colour stops then (optionally) alpha stops: keep up to 256 alpha pairs.
  const sample = isObj(g.k) ? (Array.isArray(g.k.k) && isObj(g.k.k[0]) ? (g.k.k[0] as Obj).s : g.k.k) : undefined;
  const len = Array.isArray(sample) ? Math.min(sample.length, count * 4 + 512) : count * 4;
  const k = readProp(ctx, id, g.k, len, new Array(Math.max(len, count * 4)).fill(0));
  const sp = readProp(ctx, id, item.s, 2, [0, 0]);
  const ep = readProp(ctx, id, item.e, 2, [100, 0]);
  if (sp.animated || ep.animated) warn(ctx, id, 'gradientAnimation', 'animated gradient points: the first frame is used');
  if (k.animated && kind === 'stroke') warn(ctx, id, 'gradientAnimation', 'animated stroke gradient: the first frame is used');
  const o = readProp(ctx, id, item.o, 1, [100]);
  const stops = stopsAt(k.value, count);
  const gid = claimId(ctx, item.nm, 'g');
  const radial = item.t === 2;
  const [sx, sy] = sp.value;
  const [ex, ey] = ep.value;
  let grad: Gradient;
  if (radial) {
    const r = Math.hypot(ex - sx, ey - sy);
    const h = readProp(ctx, id, item.h, 1, [0]).value[0];
    const a = readProp(ctx, id, item.a, 1, [0]).value[0];
    const base = Math.atan2(ey - sy, ex - sx);
    const dist = (Math.min(99, Math.max(-99, h)) / 100) * r;
    const ang = base + (a * Math.PI) / 180;
    const fx = r3(sx + Math.cos(ang) * dist);
    const fy = r3(sy + Math.sin(ang) * dist);
    grad = { type: 'radial', id: gid, units: 'userSpaceOnUse', cx: r3(sx), cy: r3(sy), r: r3(r), ...(dist !== 0 ? { fx, fy } : {}), stops };
  } else {
    grad = { type: 'linear', id: gid, units: 'userSpaceOnUse', x1: r3(sx), y1: r3(sy), x2: r3(ex), y2: r3(ey), stops };
  }
  ctx.gradients.push(grad);
  const paint: Paint = { kind, paint: `url(#${gid})`, opacity: Math.min(1, Math.max(0, o.value[0] / 100)) };
  if (o.animated) paint.opacityProp = o;
  if (k.animated && kind === 'fill') paint.gradientStops = { prop: k, count };
  if (kind === 'fill') paint.evenodd = item.r === 2;
  return paint;
}

/** `#rrggbb`, or `rgba()` when `v[3]` (alpha) is below 1. */
function colorString(v: number[]): string {
  const a = v[3] ?? 1;
  if (a >= 1) return hexFromLottie(v);
  return formatColor({ r: Math.round(Math.min(1, Math.max(0, v[0] ?? 0)) * 255), g: Math.round(Math.min(1, Math.max(0, v[1] ?? 0)) * 255), b: Math.round(Math.min(1, Math.max(0, v[2] ?? 0)) * 255), a: Math.max(0, a) });
}

const rgbOfPaint = (hex: string): number[] => {
  const c = parseColor(hex);
  return c ? [c.r / 255, c.g / 255, c.b / 255] : [0, 0, 0];
};

/** Gradient stops from Lottie's flat `[o, r, g, b]… [o, a]…` array. */
function stopsAt(values: number[], count: number): Gradient['stops'] {
  const alphaPart = values.slice(count * 4);
  const alphaAt = (offset: number): number => {
    if (alphaPart.length < 2) return 1;
    const pts: Array<[number, number]> = [];
    for (let i = 0; i + 1 < alphaPart.length; i += 2) pts.push([alphaPart[i], alphaPart[i + 1]]);
    if (offset <= pts[0][0]) return pts[0][1];
    for (let i = 0; i + 1 < pts.length; i++) {
      if (offset <= pts[i + 1][0]) {
        const span = pts[i + 1][0] - pts[i][0];
        return span > 0 ? pts[i][1] + ((pts[i + 1][1] - pts[i][1]) * (offset - pts[i][0])) / span : pts[i + 1][1];
      }
    }
    return pts[pts.length - 1][1];
  };
  const out: Gradient['stops'] = [];
  let prev = 0;
  for (let i = 0; i < count; i++) {
    const offset = Math.max(prev, Math.min(1, Math.max(0, values[i * 4] ?? 0)));
    prev = offset;
    const alpha = Math.min(1, Math.max(0, alphaAt(offset)));
    out.push({ offset: Math.round(offset * 10000) / 10000, color: hexFromLottie([values[i * 4 + 1] ?? 0, values[i * 4 + 2] ?? 0, values[i * 4 + 3] ?? 0]), ...(alpha < 1 ? { opacity: Math.round(alpha * 10000) / 10000 } : {}) });
  }
  return out;
}

/** Apply a paint (and its tracks) to a leaf layer. */
function applyPaint(ctx: Ctx, layer: Exclude<Layer, { type: 'raw' | 'group' }>, paint: Paint | undefined, kind: 'fill' | 'stroke'): void {
  const rec = layer as unknown as Record<string, unknown>;
  if (!paint) {
    // No stroke is the SVG default; no fill must be said (the default fill is black).
    if (kind === 'fill') rec.fill = 'none';
    return;
  }
  rec[kind] = paint.paint;
  if (paint.opacity !== 1) rec[kind === 'fill' ? 'fillOpacity' : 'strokeOpacity'] = r3(paint.opacity);
  if (kind === 'fill' && paint.evenodd) rec.fillRule = 'evenodd';
  if (kind === 'stroke') {
    if (paint.width !== undefined) rec.strokeWidth = r3(paint.width);
    if (paint.linecap && paint.linecap !== 'butt') rec.strokeLinecap = paint.linecap;
    if (paint.linejoin && paint.linejoin !== 'miter') rec.strokeLinejoin = paint.linejoin;
    if (paint.miter !== undefined && paint.miter !== 4) rec.strokeMiterlimit = r3(paint.miter);
    if (paint.dash) rec.strokeDasharray = paint.dash.map(r3);
    if (paint.dashOffset) rec.strokeDashoffset = r3(paint.dashOffset);
  }
  const id = layer.id;
  const isColor = !paint.paint.startsWith('url(');
  if (isColor && (paint.colorProp || paint.opacityProp)) {
    // Colour and style opacity fold into one colour track (rgba when translucent): exactly fill / stroke
    // opacity × colour, on this paint only. A track needs both on the same keys to stay exact.
    const c = paint.colorProp ?? { animated: false, value: rgbOfPaint(paint.paint), keys: [], expression: false };
    const o = paint.opacityProp ?? { animated: false, value: [paint.opacity * 100], keys: [], expression: false };
    const both = paint.colorProp && paint.opacityProp;
    if (both && (c.keys.length !== o.keys.length || c.keys.some((k, i) => k.t !== o.keys[i].t))) {
      warn(ctx, id, 'styleOpacity', `${kind} colour and opacity animate on different keys: eased together`);
    }
    const driver = paint.colorProp ?? paint.opacityProp!;
    const times = [...new Set([...c.keys, ...o.keys].map((k) => k.t))].sort((x, y) => x - y);
    const keys: PropKey[] = times.map((t) => {
      const k = driver.keys.find((x) => x.t === t) ?? c.keys.find((x) => x.t === t) ?? o.keys.find((x) => x.t === t)!;
      return { ...k, t, s: [...at(c, t, 3), Math.min(1, Math.max(0, at(o, t, 1)[0] / 100))] };
    });
    delete rec[kind === 'fill' ? 'fillOpacity' : 'strokeOpacity'];
    rec[kind] = colorString(keys[0].s);
    addTrack(ctx, id, kind, { animated: true, value: keys[0].s, keys, expression: false }, colorString);
  } else if (paint.opacityProp) {
    // A gradient's opacity has no Motion property: it moves to the layer's opacity.
    if (ctx.tracks.some((tr) => tr.layerId === id && tr.property === 'opacity')) warn(ctx, id, 'styleOpacity', `animated ${kind} opacity dropped (the layer opacity is animated already)`);
    else {
      warn(ctx, id, 'styleOpacity', `animated gradient ${kind} opacity is applied to the whole shape`);
      delete rec[kind === 'fill' ? 'fillOpacity' : 'strokeOpacity'];
      if (paint.opacity !== 1) rec.opacity = r3(paint.opacity);
      addTrack(ctx, id, 'opacity', paint.opacityProp, (v) => r3(Math.min(1, Math.max(0, v[0] / 100))));
    }
  }
  if (paint.widthProp) addTrack(ctx, id, 'strokeWidth', paint.widthProp, (v) => r3(Math.max(0, v[0])));
  if (paint.dashOffsetProp) addTrack(ctx, id, 'strokeDashoffset', paint.dashOffsetProp, (v) => r3(v[0]));
  if (paint.gradientStops) {
    const { prop, count } = paint.gradientStops;
    for (let i = 0; i < count; i++) {
      addTrack(ctx, id, `gradientStop[${i}].offset`, prop, (v) => Math.round(Math.min(1, Math.max(0, v[i * 4] ?? 0)) * 10000) / 10000);
      addTrack(ctx, id, `gradientStop[${i}].color`, prop, (v) => hexFromLottie([v[i * 4 + 1] ?? 0, v[i * 4 + 2] ?? 0, v[i * 4 + 3] ?? 0]));
    }
  }
}

// ---------------------------------------------------------------------------
// shapes
// ---------------------------------------------------------------------------

interface Trim {
  /** End keyframes (0..100). */
  end: Prop;
  start: Prop;
}

interface Scope {
  fill?: Paint;
  stroke?: Paint;
  trim?: Trim;
}

const MODIFIERS = new Set(['rp', 'rd', 'mm', 'op', 'pb', 'tw', 'zz']);
const KNOWN = new Set(['gr', 'rc', 'el', 'sh', 'sr', 'fl', 'st', 'gf', 'gs', 'tm', 'tr', ...MODIFIERS]);

function readBezier(raw: unknown): LottieBezier | null {
  if (!isObj(raw)) return null;
  const pts = (v: unknown): Vec[] => (Array.isArray(v) ? (v as unknown[]).slice(0, LOTTIE_MAX_VERTICES).map((p) => vecOf(p, 2, [0, 0])) : []);
  if (Array.isArray(raw.v) && (raw.v as unknown[]).length > LOTTIE_MAX_VERTICES) throw new LottieImportError('too_complex', 'a shape has too many vertices');
  const v = pts(raw.v);
  if (v.length === 0) return null;
  const i = pts(raw.i);
  const o = pts(raw.o);
  return { c: raw.c === true, v, i: v.map((_, k) => i[k] ?? [0, 0]), o: v.map((_, k) => o[k] ?? [0, 0]) };
}

/** Bezier keyframes: `k` is either a bezier, `[bezier]`, or keyframes whose `s` is `[bezier]`. */
function readShapeProp(ctx: Ctx, id: string, raw: unknown): { value: LottieBezier | null; keys: Array<{ t: number; s: LottieBezier | null; key: PropKey }> } {
  if (!isObj(raw)) return { value: null, keys: [] };
  if (typeof raw.x === 'string' && raw.x) warn(ctx, id, 'expression', 'shape expression ignored');
  const k = raw.k;
  const first = Array.isArray(k) ? k[0] : k;
  if (Array.isArray(k) && isObj(first) && 't' in first) {
    if (k.length > VECTOR_MAX_KEYFRAMES) throw new LottieImportError('too_complex', 'too many keyframes');
    const keys: Array<{ t: number; s: LottieBezier | null; key: PropKey }> = [];
    let prevEnd: LottieBezier | null = null;
    for (const item of k as unknown[]) {
      if (!isObj(item) || !fin(item.t)) continue;
      const sv = Array.isArray(item.s) ? item.s[0] : item.s;
      const s = sv !== undefined ? readBezier(sv) : prevEnd;
      const o = isObj(item.o) ? item.o : null;
      const i = isObj(item.i) ? item.i : null;
      keys.push({ t: item.t, s, key: { t: item.t, s: [], hold: item.h === 1, o, i, spatial: false } });
      const ev = Array.isArray(item.e) ? item.e[0] : item.e;
      prevEnd = ev !== undefined ? readBezier(ev) : null;
    }
    if (prevEnd && keys.length > 0) keys.push({ t: keys[keys.length - 1].t, s: prevEnd, key: { t: keys[keys.length - 1].t, s: [], hold: false, o: null, i: null, spatial: false } });
    return { value: keys[0]?.s ?? null, keys };
  }
  return { value: readBezier(first), keys: [] };
}

/** One Lottie geometry item → a leaf layer (or null + warning). */
function geometryLayer(ctx: Ctx, item: Obj): Exclude<Layer, { type: 'raw' | 'group' }> | null {
  const id = mint(ctx);
  ctx.leaves.add(id);
  const name = nameOf(item.nm);
  const head = { id, ...(name ? { name } : {}), ...(item.hd === true ? { hidden: true } : {}) };
  switch (item.ty) {
    case 'rc': {
      const p = readProp(ctx, id, item.p, 2, [0, 0]);
      const s = readProp(ctx, id, item.s, 2, [0, 0]);
      const r = readProp(ctx, id, item.r, 1, [0]);
      if (p.animated || s.animated || r.animated) {
        // Animated rectangles become shape keys (morph) on a path.
        return animatedPrimitive(ctx, head, (t) => rectBezier(at(p, t, 2), at(s, t, 2), at(r, t, 1)[0], 1), [p, s, r]);
      }
      const [w, h] = [Math.max(0, s.value[0]), Math.max(0, s.value[1])];
      const rr = Math.min(Math.max(0, r.value[0]), w / 2, h / 2);
      return { type: 'rect', ...head, x: r3(p.value[0] - w / 2), y: r3(p.value[1] - h / 2), width: r3(w), height: r3(h), ...(rr > 0 ? { rx: r3(rr) } : {}) };
    }
    case 'el': {
      const p = readProp(ctx, id, item.p, 2, [0, 0]);
      const s = readProp(ctx, id, item.s, 2, [0, 0]);
      if (p.animated || s.animated) return animatedPrimitive(ctx, head, (t) => ellipseBezier(at(p, t, 2), at(s, t, 2), 1), [p, s]);
      return { type: 'ellipse', ...head, cx: r3(p.value[0]), cy: r3(p.value[1]), rx: r3(Math.max(0, s.value[0] / 2)), ry: r3(Math.max(0, s.value[1] / 2)) };
    }
    case 'sh': {
      const sp = readShapeProp(ctx, id, item.ks);
      if (!sp.value) return null;
      if (sp.keys.length > 1) return morphLayer(ctx, head, sp.keys);
      const d = safePath(bezierToPath(sp.value));
      return d ? { type: 'path', ...head, d } : null;
    }
    case 'sr': {
      const star = polystarBezier(ctx, id, item);
      if (!star) return null;
      const d = safePath(bezierToPath(star));
      return d ? { type: 'path', ...head, d } : null;
    }
    default:
      return null;
  }
}

function safePath(d: string): string | null {
  try {
    return normalizePath(d);
  } catch {
    return null;
  }
}

/** The value of a prop at frame t (linear between keys; the easing goes into tracks elsewhere). */
function at(p: Prop, t: number, dims: number): number[] {
  if (!p.animated) return p.value.slice(0, dims);
  return atAll(p, t).slice(0, dims);
}

function atAll(p: Prop, t: number): number[] {
  const ks = p.keys;
  if (t <= ks[0].t) return ks[0].s;
  for (let i = 0; i + 1 < ks.length; i++) {
    const a = ks[i];
    const b = ks[i + 1];
    if (t >= b.t) continue;
    if (a.hold || b.t <= a.t) return a.s;
    const f = (t - a.t) / (b.t - a.t);
    return a.s.map((v, d) => v + ((b.s[d] ?? v) - v) * f);
  }
  return ks[ks.length - 1].s;
}

/** An animated rc / el: shape keys at the union of its props' key times (morph track). */
function animatedPrimitive(ctx: Ctx, head: { id: string }, build: (t: number) => LottieBezier, props: Prop[]): Exclude<Layer, { type: 'raw' | 'group' }> | null {
  const times = [...new Set(props.flatMap((p) => p.keys.map((k) => k.t)))].sort((a, b) => a - b);
  const driver = props.find((p) => p.animated)!;
  const keys = times.map((t) => ({ t, s: build(t), key: driver.keys.find((k) => k.t === t) ?? { t, s: [], hold: false, o: null, i: null, spatial: false } }));
  if (props.filter((p) => p.animated).length > 1) warn(ctx, head.id, 'spatialTangents', 'several animated rectangle / ellipse properties eased together');
  return morphLayer(ctx, head, keys);
}

/** Shape keyframes → a path with a normalised `d` morph track. */
function morphLayer(ctx: Ctx, head: { id: string }, keys: Array<{ t: number; s: LottieBezier | null; key: PropKey }>): Exclude<Layer, { type: 'raw' | 'group' }> | null {
  const valid = keys.filter((k) => k.s);
  if (valid.length === 0) return null;
  const paths = valid.map((k) => safePath(bezierToCubicPath(k.s!)) ?? '');
  // Keys that already share one command sequence stay as they are (vertex for vertex, like the Lottie player);
  // others are normalised so they can morph at all (the Lottie player cannot morph them faithfully either).
  const compatible = paths.every((p) => morphCompatible(paths[0], p));
  const norm = compatible ? null : normalizeMorphSet(paths);
  if (!compatible) warn(ctx, head.id, 'morphCounts', 'shape keys with different vertex counts were matched up');
  const ds = norm && norm.ok ? norm.paths : paths;
  const keyframes: Keyframe[] = [];
  valid.forEach((k, i) => {
    const t = msOf(ctx, k.t);
    const kf: Keyframe = { t, value: ds[i], easing: easingOf(k.key) };
    if (keyframes.length > 0 && keyframes[keyframes.length - 1].t === t) keyframes[keyframes.length - 1] = kf;
    else keyframes.push(kf);
  });
  const merged = mergeEaseBoth(keyframes);
  if (merged.length >= 2 && merged.some((k) => k.value !== merged[0].value)) ctx.tracks.push({ layerId: head.id, property: 'd', keyframes: merged });
  return { type: 'path', ...head, d: ds[0] };
}

function polystarBezier(ctx: Ctx, id: string, item: Obj): LottieBezier | null {
  const props = ['p', 'or', 'ir', 'pt', 'r', 'os', 'is'].map((k) => readProp(ctx, id, item[k], k === 'p' ? 2 : 1, k === 'p' ? [0, 0] : [0]));
  if (props.some((p) => p.animated)) warn(ctx, id, 'polystar', 'animated polystar: the first frame is used');
  const [p, or, ir, pt, rot, os, is] = props.map((x) => x.value);
  if ((os[0] ?? 0) !== 0 || (is[0] ?? 0) !== 0) warn(ctx, id, 'polystar', 'polystar roundness ignored');
  const n = Math.min(1000, Math.max(3, Math.floor(pt[0] ?? 5)));
  const star = item.sy !== 2;
  const v: Vec[] = [];
  const total = star ? n * 2 : n;
  for (let k = 0; k < total; k++) {
    const rad = star && k % 2 === 1 ? ir[0] ?? 0 : or[0] ?? 0;
    const a = ((rot[0] ?? 0) - 90) * (Math.PI / 180) + (k * 2 * Math.PI) / total;
    v.push([r3(p[0] + Math.cos(a) * rad), r3(p[1] + Math.sin(a) * rad)]);
  }
  const reversed = item.d === 3 ? [v[0], ...v.slice(1).reverse()] : v;
  return { c: true, v: reversed, i: reversed.map(() => [0, 0]), o: reversed.map(() => [0, 0]) };
}

/**
 * A shape list → Motion layers in SVG order (bottom first). Each geometry is
 * painted with the nearest fill / stroke that follows it in its own list, else
 * the enclosing scope's (Lottie applies a style to every path above it).
 */
function readShapes(ctx: Ctx, items: unknown[], scope: Scope, depth: number, ownerId: string): Layer[] {
  if (depth > VECTOR_MAX_DEPTH - 2) throw new LottieImportError('too_complex', 'shapes nest too deep');
  const list = items.filter(isObj);
  const out: Layer[] = []; // Lottie order (top first)
  // Styles and trims below each index apply to the geometry above them: one backward pass, the nearest wins.
  const scopes: Scope[] = new Array(list.length);
  {
    const cur: Scope = { ...scope };
    for (let j = list.length - 1; j >= 0; j--) {
      scopes[j] = { ...cur };
      const it = list[j];
      if (it.hd === true) continue;
      if (it.ty === 'fl') cur.fill = readColorPaint(ctx, ownerId, it, 'fill');
      else if (it.ty === 'gf') cur.fill = readGradientPaint(ctx, ownerId, it, 'fill') ?? cur.fill;
      else if (it.ty === 'st') {
        const p = readColorPaint(ctx, ownerId, it, 'stroke');
        readStrokeFields(ctx, ownerId, it, p);
        cur.stroke = p;
      } else if (it.ty === 'gs') {
        const p = readGradientPaint(ctx, ownerId, it, 'stroke');
        if (p) {
          readStrokeFields(ctx, ownerId, it, p);
          cur.stroke = p;
        }
      } else if (it.ty === 'tm') cur.trim = { start: readProp(ctx, ownerId, it.s, 1, [0]), end: readProp(ctx, ownerId, it.e, 1, [100]) };
    }
  }
  const styleAfter = (index: number): Scope => scopes[index];
  const styleCount = { fill: 0, stroke: 0 };
  for (const it of list) {
    if (it.ty === 'fl' || it.ty === 'gf') styleCount.fill += 1;
    if (it.ty === 'st' || it.ty === 'gs') styleCount.stroke += 1;
  }
  if (styleCount.fill > 1 || styleCount.stroke > 1) warn(ctx, ownerId, 'multipleStyles', 'several fills or strokes in one group');

  list.forEach((it, index) => {
    count(ctx);
    const ty = typeof it.ty === 'string' ? it.ty : '';
    if (MODIFIERS.has(ty)) {
      warn(ctx, ownerId, 'modifier', `shape modifier "${ty}" ignored`);
      return;
    }
    if (!KNOWN.has(ty)) {
      warn(ctx, ownerId, 'unknownShape', `shape type "${ty.slice(0, 20)}"`);
      return;
    }
    if (ty === 'tm') {
      const start = readProp(ctx, ownerId, it.s, 1, [0]);
      const offset = readProp(ctx, ownerId, it.o, 1, [0]);
      const end = readProp(ctx, ownerId, it.e, 1, [100]);
      const startOn = start.animated || start.value[0] !== 0;
      const endOn = end.animated || end.value[0] !== 100;
      if ((startOn && endOn) || offset.animated || offset.value[0] !== 0) warn(ctx, ownerId, 'trimComplex', 'trim with both ends or an offset moving is not imported (draw on or erase only)');
      if (it.m === 2) warn(ctx, ownerId, 'trimComplex', 'sequential trim treated as parallel');
      return;
    }
    if (ty === 'gr') {
      const id = claimId(ctx, it.ln);
      const name = nameFor(it, id);
      const children = Array.isArray(it.it) ? (it.it as unknown[]) : [];
      if (children.length > LOTTIE_MAX_ITEMS) throw new LottieImportError('too_complex', 'too many shapes');
      const tr = children.filter(isObj).find((c) => c.ty === 'tr');
      const kids = readShapes(ctx, children, styleAfter(index), depth + 1, id);
      const group: Extract<Layer, { type: 'group' }> = { type: 'group', id, ...(name ? { name } : {}), ...(it.hd === true ? { hidden: true } : {}), ...readTransform(ctx, id, tr, true), children: kids };
      out.push(collapse(ctx, group));
      return;
    }
    if (ty === 'rc' || ty === 'el' || ty === 'sh' || ty === 'sr') {
      if (it.hd === true) return;
      const layer = geometryLayer(ctx, it);
      if (!layer) return;
      const st = styleAfter(index);
      applyPaint(ctx, layer, st.fill, 'fill');
      applyPaint(ctx, layer, st.stroke, 'stroke');
      if (!st.fill && !st.stroke) layer.fill = 'none';
      if (st.trim) applyTrim(ctx, layer, st.trim);
      out.push(layer);
    }
  });
  return out.reverse();
}

/** Trim path end 0→100 % → the draw-on animator's representation. */
function applyTrim(ctx: Ctx, layer: Exclude<Layer, { type: 'raw' | 'group' }>, trim: Trim): void {
  const outline = layerOutline(layer);
  const L = outline ? r3(pathLength(outline)) : 0;
  if (L <= 0) return;
  const clampPct = (v: number) => Math.min(100, Math.max(0, v));
  const startOn = trim.start.animated || trim.start.value[0] !== 0;
  const endOn = trim.end.animated || trim.end.value[0] < 100;
  if (startOn && endOn) return; // both ends move: warned at the tm item
  if (!startOn && !endOn) return;
  layer.strokeDasharray = [L];
  if (endOn) {
    // Draw on: visible [0, e] = offset L·(1 − e).
    layer.strokeDashoffset = r3(L * (1 - clampPct(trim.end.value[0]) / 100));
    addTrack(ctx, layer.id, 'strokeDashoffset', trim.end, (v) => r3(L * (1 - clampPct(v[0]) / 100)));
  } else {
    // Erase: visible [s, 1] = offset −L·s.
    layer.strokeDashoffset = r3(-L * (clampPct(trim.start.value[0]) / 100));
    addTrack(ctx, layer.id, 'strokeDashoffset', trim.start, (v) => r3(-L * (clampPct(v[0]) / 100)));
  }
}

// ---------------------------------------------------------------------------
// layers
// ---------------------------------------------------------------------------

/** Unmappable layer → labelled empty group, so the structure survives (decision 3). */
function placeholder(ctx: Ctx, raw: Obj, label: string): Layer {
  const id = mint(ctx);
  const name = nameOf(raw.nm);
  return { type: 'group', id, name: `${label}${name ? `: ${name}` : ''}`.slice(0, 200), children: [] };
}

function layerFeatures(ctx: Ctx, id: string, raw: Obj): void {
  if (raw.ddd === 1) warn(ctx, id, 'threeD', '3D layer drawn flat');
  if (fin(raw.bm) && raw.bm !== 0) warn(ctx, id, 'blendMode', `blend mode ${raw.bm}`);
  if (Array.isArray(raw.ef) && raw.ef.length > 0) warn(ctx, id, 'effect', `${raw.ef.length} effect(s) ignored`);
  if (fin(raw.tt) && raw.tt !== 0) warn(ctx, id, 'matte', 'track matte ignored');
  if (raw.td === 1) warn(ctx, id, 'matte', 'matte source layer drawn as a normal layer');
  if (raw.ao === 1) warn(ctx, id, 'autoOrient', 'auto-orient ignored');
  if (isObj(raw.tm)) warn(ctx, id, 'timeRemap', 'time remapping ignored');
}

/** Lottie masks on a layer → a clip path (add only) or a luminance mask (add / subtract). */
function readMasks(ctx: Ctx, id: string, raw: Obj, defs: { masks: VectorDoc['defs']['masks']; clipPaths: VectorDoc['defs']['clipPaths'] }): { mask?: string; clipPath?: string } {
  if (!Array.isArray(raw.masksProperties) || raw.masksProperties.length === 0) return {};
  const shapes: Array<{ d: string; mode: 'a' | 's'; name?: string; ln?: unknown }> = [];
  for (const m of raw.masksProperties as unknown[]) {
    if (!isObj(m)) continue;
    const mode = m.mode === 's' ? 's' : m.mode === 'a' || m.mode === undefined ? 'a' : null;
    if (m.mode === 'n') continue;
    const o = readProp(ctx, id, m.o, 1, [100]);
    const x = readProp(ctx, id, m.x, 1, [0]);
    const pt = readShapeProp(ctx, id, m.pt);
    if (!mode || m.inv === true || o.animated || o.value[0] !== 100 || x.animated || x.value[0] !== 0 || pt.keys.length > 1 || !pt.value) {
      warn(ctx, id, 'maskMode', `mask mode "${String(m.mode ?? 'a').slice(0, 4)}"${m.inv === true ? ' inverted' : ''} ignored`);
      continue;
    }
    const d = safePath(bezierToPath(pt.value));
    if (d) shapes.push({ d, mode, name: nameOf(m.nm), ln: m.ln });
  }
  if (shapes.length === 0) return {};
  // Lottie mask paths are in the layer's own space; SVG clip / mask content is in the user space of the element.
  if (shapes.every((s) => s.mode === 'a')) {
    const cid = mint(ctx, 'c');
    defs.clipPaths.push({ id: cid, layers: shapes.map((s) => maskShape(ctx, s)) });
    return { clipPath: cid };
  }
  const mid = mint(ctx, 'm');
  defs.masks.push({
    id: mid,
    units: 'userSpaceOnUse',
    x: -100000,
    y: -100000,
    width: 200000,
    height: 200000,
    layers: shapes.map((s) => ({ ...maskShape(ctx, s), fill: s.mode === 'a' ? '#ffffff' : '#000000' })),
  });
  return { mask: mid };
}

function maskShape(ctx: Ctx, s: { d: string; name?: string; ln?: unknown }): Extract<Layer, { type: 'path' }> {
  const id = claimId(ctx, s.ln);
  const name = s.name && s.name !== id ? s.name : undefined;
  return { type: 'path', id, ...(name ? { name } : {}), d: s.d };
}

interface Built {
  ind: number | undefined;
  parent: number | undefined;
  /** The layer itself (with its transform). */
  layer: Layer;
  /** The parent-chain wrapper: a transform-only group around the layer, built lazily. */
  raw: Obj;
}

function readLayer(ctx: Ctx, raw: Obj, defs: { masks: VectorDoc['defs']['masks']; clipPaths: VectorDoc['defs']['clipPaths'] }, depth: number): Layer {
  count(ctx);
  const ty = raw.ty;
  if (ty === 5) {
    const ph = placeholder(ctx, raw, 'Text');
    warn(ctx, ph.id, 'textLayer', 'text layer kept as an empty group');
    return ph;
  }
  if (ty !== 0 && ty !== 1 && ty !== 2 && ty !== 3 && ty !== 4) {
    const ph = placeholder(ctx, raw, 'Layer');
    warn(ctx, ph.id, 'unknownLayer', `layer type ${String(ty).slice(0, 10)}`);
    return ph;
  }
  const id = claimId(ctx, raw.ln);
  const name = nameFor(raw, id);
  layerFeatures(ctx, id, raw);
  const head = { id, ...(name ? { name } : {}), ...(raw.hd === true ? { hidden: true } : {}) };
  const tf = readTransform(ctx, id, raw.ks, true);
  let children: Layer[] = [];
  if (ty === 4) {
    children = readShapes(ctx, Array.isArray(raw.shapes) ? (raw.shapes as unknown[]) : [], {}, depth + 1, id);
  } else if (ty === 1) {
    const sc = typeof raw.sc === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(raw.sc) ? raw.sc : '#000000';
    children = [{ type: 'rect', id: mint(ctx), x: 0, y: 0, width: r3(Math.max(0, numOr(raw.sw, 0))), height: r3(Math.max(0, numOr(raw.sh, 0))), fill: sc.toLowerCase() }];
  } else if (ty === 2) {
    const asset = typeof raw.refId === 'string' ? ctx.assets.get(raw.refId) : undefined;
    const href = asset && typeof asset.p === 'string' ? asset.p : '';
    if (asset && asset.e === 1 && IMAGE_HREF_PATTERN.test(href) && href.startsWith('data:') && href.length <= LOTTIE_MAX_BYTES) {
      const imageId = mint(ctx);
      ctx.leaves.add(imageId);
      children = [{ type: 'image', id: imageId, x: 0, y: 0, width: r3(Math.max(0, numOr(asset.w, 0))), height: r3(Math.max(0, numOr(asset.h, 0))), href }];
    } else {
      warn(ctx, id, 'imageExternal', 'image is not embedded in the file');
    }
  } else if (ty === 0) {
    const asset = typeof raw.refId === 'string' ? ctx.assets.get(raw.refId) : undefined;
    const sr = numOr(raw.sr, 1);
    const st = numOr(raw.st, 0);
    if (sr !== 1 || st !== 0) warn(ctx, id, 'layerTiming', 'precomposition start time / stretch ignored');
    if (!asset || !Array.isArray(asset.layers) || ctx.precompDepth >= 8) warn(ctx, id, 'unknownLayer', 'missing or too deeply nested precomposition');
    else {
      ctx.precompDepth += 1;
      children = readLayerList(ctx, asset.layers as unknown[], defs, depth + 1);
      ctx.precompDepth -= 1;
    }
  }
  // Lottie mask paths are in the layer's own space, like SVG clip / mask content (user space of the element, its transform included).
  const masks = readMasks(ctx, id, raw, defs);
  return collapse(ctx, { type: 'group', ...head, ...tf, ...masks, children });
}

/** A layer list (composition or precomp) → Motion layers in SVG order, `parent` chains nested. */
function readLayerList(ctx: Ctx, list: unknown[], defs: { masks: VectorDoc['defs']['masks']; clipPaths: VectorDoc['defs']['clipPaths'] }, depth: number): Layer[] {
  if (depth > VECTOR_MAX_DEPTH - 4) throw new LottieImportError('too_complex', 'layers nest too deep');
  const raws = list.filter(isObj);
  const byInd = new Map<number, Obj>();
  for (const r of raws) if (fin(r.ind)) byInd.set(r.ind, r);
  const built: Layer[] = [];
  for (const raw of raws) {
    let layer = readLayer(ctx, raw, defs, depth);
    timing(ctx, layer, raw);
    // Parent chain (transform only; Lottie parents do not pass opacity on).
    const seen = new Set<number>();
    let p = fin(raw.parent) ? byInd.get(raw.parent) : undefined;
    let levels = 0;
    while (p && !seen.has(numOr(p.ind, -1)) && levels < 16) {
      seen.add(numOr(p.ind, -1));
      count(ctx);
      const gid = mint(ctx);
      const tf = readTransform(ctx, gid, p.ks, false);
      layer = { type: 'group', id: gid, name: `${nameOf(p.nm) ?? 'parent'} (parent)`.slice(0, 200), ...tf, children: [layer] };
      p = fin(p.parent) ? byInd.get(p.parent) : undefined;
      levels += 1;
    }
    built.push(layer);
  }
  return built.reverse();
}

/** In / out points inside the composition → opacity holds on the layer (or a warning when opacity is animated). */
function timing(ctx: Ctx, layer: Layer, raw: Obj): void {
  if (layer.type === 'raw') return;
  const ip = numOr(raw.ip, ctx.ip);
  const op = numOr(raw.op, Infinity);
  const startMs = msOf(ctx, ip);
  const endMs = op === Infinity ? Infinity : msOf(ctx, op);
  if (startMs <= 0 && endMs >= ctx.durationMs) return;
  if (ctx.tracks.some((tr) => tr.layerId === layer.id && tr.property === 'opacity')) {
    warn(ctx, layer.id, 'layerTiming', 'in / out points with animated opacity: the layer is always visible');
    return;
  }
  const o = layer.opacity ?? 1;
  const keyframes: Keyframe[] = [];
  if (startMs > 0) keyframes.push({ t: 0, value: 0, easing: 'hold' });
  keyframes.push({ t: Math.max(0, startMs), value: o, easing: 'hold' });
  if (endMs < ctx.durationMs) keyframes.push({ t: Math.max(startMs + 1, endMs), value: 0, easing: 'hold' });
  const dedup = keyframes.filter((k, i) => i === 0 || k.t > keyframes[i - 1].t);
  if (dedup.length >= 2) ctx.tracks.push({ layerId: layer.id, property: 'opacity', keyframes: dedup });
}

// ---------------------------------------------------------------------------
// entry
// ---------------------------------------------------------------------------

export interface LottieImport {
  doc: VectorDoc;
  warnings: LottieWarning[];
}

/**
 * `importLottie(json) → { doc, warnings }`. `input` is the file text (or an
 * already parsed value). Throws `LottieImportError` for input that cannot
 * become a document at all; everything partial is a warning.
 */
export function importLottie(input: string | unknown): LottieImport {
  let value: unknown = input;
  if (typeof input === 'string') {
    if (input.length > LOTTIE_MAX_BYTES) throw new LottieImportError('too_large', 'file larger than 4 MB');
    try {
      value = JSON.parse(input);
    } catch {
      throw new LottieImportError('not_json', 'not JSON');
    }
  }
  const env = envelopeSchema.safeParse(value);
  if (!env.success) throw new LottieImportError('not_lottie', env.error.issues[0]?.message ?? 'not a Lottie animation');
  const root = env.data;
  const fr = root.fr;
  const durationMs = Math.min(3_600_000, Math.max(1, Math.round(((root.op - root.ip) * 1000) / fr)));
  const ctx: Ctx = { fr, ip: root.ip, durationMs, warnings: [], warned: new Set(), items: 0, ids: 0, tracks: [], gradients: [], assets: new Map(), precompDepth: 0, used: new Set(), reserved: new Set(), leaves: new Set() };
  reserveIds(ctx, root.layers);
  for (const a of root.assets ?? []) if (isObj(a) && typeof a.id === 'string') ctx.assets.set(a.id, a);
  if (root.ddd === 1) warn(ctx, '', 'threeD', '3D composition drawn flat');

  const defs = { masks: [] as VectorDoc['defs']['masks'], clipPaths: [] as VectorDoc['defs']['clipPaths'] };
  // Writer markers: the background layer and the viewBox null.
  let background = DEFAULT_BACKGROUND;
  let viewBox: { x: number; y: number; width: number; height: number } | undefined;
  const layers = (root.layers as unknown[]).filter((l) => {
    if (!isObj(l)) return false;
    if (l.cl === LOTTIE_BACKGROUND_CLASS && l.ty === 4 && Array.isArray(l.shapes)) {
      const fill = (l.shapes as unknown[]).find((s) => isObj(s) && s.ty === 'fl') as Obj | undefined;
      const c = fill && isObj(fill.c) ? vecOf(fill.c.k, 3, [0, 0, 0]) : null;
      if (c) background = hexFromLottie(c);
      return false;
    }
    return true;
  });
  const vbLayer = layers.find((l) => isObj(l) && l.cl === LOTTIE_VIEWBOX_CLASS && l.ty === 3) as Obj | undefined;
  if (vbLayer && isObj(vbLayer.mm) && Array.isArray(vbLayer.mm.viewBox)) {
    const [x, y, w, h] = vecOf(vbLayer.mm.viewBox, 4, [0, 0, 0, 0]);
    // Only when every other layer hangs off the null (what our writer emits); else it is an ordinary null.
    const orphan = layers.some((l) => isObj(l) && l !== vbLayer && fin(l.parent) && l.parent !== vbLayer.ind);
    if (w > 0 && h > 0 && w <= 1e6 && h <= 1e6 && Math.abs(x) <= 1e6 && Math.abs(y) <= 1e6 && !orphan) viewBox = { x: r3(x), y: r3(y), width: r3(w), height: r3(h) };
  }
  const content = viewBox ? layers.filter((l) => l !== vbLayer).map((l) => (isObj(l) && l.parent === vbLayer!.ind ? { ...l, parent: undefined } : l)) : layers;
  const mapped = readLayerList(ctx, content, defs, 1);

  const doc = {
    version: 1,
    canvas: { width: Math.max(1, Math.round(root.w)), height: Math.max(1, Math.round(root.h)), ...(viewBox ? { viewBox } : {}), background },
    duration: durationMs,
    fps: Math.min(120, Math.max(1, Math.round(fr * 1000) / 1000)),
    layers: mapped,
    defs: { gradients: ctx.gradients, masks: defs.masks, clipPaths: defs.clipPaths, filters: [], symbols: [] },
    animations: ctx.tracks,
  };
  const parsed = parseVectorDoc(doc);
  if (!parsed.ok) throw new LottieImportError('invalid', parsed.error);
  return { doc: parsed.doc, warnings: ctx.warnings };
}

export type { Built };
