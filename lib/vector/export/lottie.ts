/**
 * `VectorDoc` → Lottie JSON (ticket MM46 decisions 1–2, design §3.3 rung 4).
 * Pure and deterministic: `exportLottie(doc) → { json, warnings }`.
 *
 * Target: the Lottie Animation Community specification **1.0.1** (tagged
 * 2025-06-26, `LOTTIE_SPEC` in `./lottieSupport.ts`; `ver: 10001`), with
 * lottie-web 5.x as the reference player where the spec is silent (`v:
 * 5.12.0`, so players apply no legacy fixes). Fidelity target: the
 * LottieFiles "Basic" feature set; everything else is listed in
 * `lottieSupport.ts` and produces a `{layerId, feature, reason}` warning.
 * Nothing is dropped silently.
 *
 * Mapping (§3.3.4):
 *
 *   document   `fr` = doc.fps, `ip` 0, `op` = duration in frames, `w`/`h` the
 *              canvas (rounded); a viewBox that is not `0 0 w h` becomes a
 *              parent null layer carrying the viewBox transform (SVG
 *              `xMidYMid meet`); an opaque background is a bottom rectangle
 *              layer marked `cl: "mm-background"` (the reader restores it).
 *   layers     one Lottie layer per top-level layer (`ln` = the Motion id, so
 *              lottie-web's SVG renderer and our reader keep it), nested
 *              layers as groups `gr` (`ln` = id). Lottie draws the FIRST item
 *              on top, SVG the last, so every list is reversed.
 *   geometry   rect → `rc` (both radii equal) or `sh`, ellipse → `el`, path /
 *              line / polyline / polygon → `sh` (one per subpath; arcs and
 *              quadratics as cubics). `use` is inlined (a copy of what it
 *              references). Inherited group fills / strokes are resolved.
 *   styles     fill `fl` (colour, `o` = fill-opacity × colour alpha, rule),
 *              stroke `st` (width, caps, joins, miter limit, dashes), linear
 *              / radial gradients `gf` / `gs` (bounding-box units resolved,
 *              stops `[o, r, g, b]…` + alpha stops), stroke drawn above fill.
 *   transform  `ks` / `tr`: anchor `a` = (anchorX, anchorY), position `p` =
 *              (x + anchorX, y + anchorY), scale ×100, rotation, opacity
 *              ×100, skewX k → `sk` = −k (`sa` 0), skewY k → `sk` = k (`sa`
 *              90). That is exactly lottie-web's `translate(p) · rotate ·
 *              skew · scale · translate(−a)` against Motion's model matrix.
 *   animation  every keyframe becomes a Lottie keyframe at `t·fr/1000`:
 *              linear / easeIn / easeOut / cubic-bezier → `o`/`i` handles,
 *              easeBoth → two exact cubic halves with a key at the midpoint,
 *              hold → `h: 1`. Draw-on (dasharray = outline length) → trim
 *              path `tm` end 0→100 %; other dash-offset animation → the
 *              stroke dash `o`; path morph → shape keyframes (keys are stored
 *              normalised by MM45, so vertex counts match); gradient stop
 *              colour / position → gradient keyframes; motion path →
 *              position (and, with auto-orient, rotation) keyframes sampled
 *              at every frame. Where several Motion tracks feed one Lottie
 *              property and their keys or curves do not line up, the
 *              property is sampled at every frame with linear keys (holds
 *              kept as `h: 1`).
 */
import { findDocLayer, motionPathData, parseStopProperty, trackGradient } from '@/lib/vector/advanced';
import { MOTION_BRAND } from '@/lib/vector/brand';
import { parseColor } from '@/lib/vector/color';
import { layerLocalBounds, resolveTransform, transformToMatrix, apply as applyMatrix, type Matrix } from '@/lib/vector/geometry';
import { layerOutline, layerOutlineLength } from '@/lib/vector/advanced';
import { findLayer } from '@/lib/vector/layerTree';
import {
  LINEAR_IN,
  LINEAR_OUT,
  lottieColor,
  pathToBeziers,
  r3,
  r4,
  type EaseHandle,
  type LottieBezier,
  type LottieKeyframe,
  type LottieLayer,
  type LottieShape,
  type Vec,
} from '@/lib/vector/lottieCommon';
import { morphCompatible } from '@/lib/vector/morph';
import { measurePath } from '@/lib/vector/pathLength';
import { interpolable, interpolate, sampleKeyframes, sampledLayer, type TrackValue } from '@/lib/vector/sampleTrack';
import { EASE_IN_CURVE, EASE_OUT_CURVE } from '@/lib/vector/export/css';
import {
  docLoops,
  forEachLayer,
  paintRef,
  type Easing,
  type Gradient,
  type Keyframe,
  type Layer,
  type Track,
  type VectorDoc,
} from '@/lib/vector/vectorTypes';

import { LOTTIE_BODYMOVIN_VERSION, LOTTIE_SPEC, type LottieExportFeature, type LottieWarning } from './lottieSupport';

// ---------------------------------------------------------------------------
// result
// ---------------------------------------------------------------------------

export interface LottieAnimation {
  v: string;
  ver: number;
  meta: { g: string };
  nm?: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  ddd: 0;
  assets: Array<Record<string, unknown>>;
  layers: LottieLayer[];
  markers: [];
}

export interface LottieExport {
  json: LottieAnimation;
  warnings: LottieWarning[];
}

export interface LottieExportOptions {
  /** Project name (`nm`). */
  name?: string;
}

/** Class marking the background rectangle layer (the reader turns it back into `canvas.background`). */
export const LOTTIE_BACKGROUND_CLASS = 'mm-background';
/** Class marking the viewBox null layer. */
export const LOTTIE_VIEWBOX_CLASS = 'mm-viewbox';
/** Generator string (`meta.g`). */
export const lottieGenerator = () => `Media Manipulator ${MOTION_BRAND}`;

/** Attributes in `attrs` that change rendering in ways Lottie cannot carry. */
const CSS_ONLY_ATTRS = ['mix-blend-mode', 'isolation', 'paint-order', 'vector-effect', 'marker-start', 'marker-mid', 'marker-end', 'visibility', 'pathLength'];

// ---------------------------------------------------------------------------
// context
// ---------------------------------------------------------------------------

interface Ctx {
  doc: VectorDoc;
  fr: number;
  /** Track per `layerId\0property` (first one wins, like the exporters). */
  tracks: Map<string, Track>;
  warnings: LottieWarning[];
  warned: Set<string>;
  assets: Array<Record<string, unknown>>;
  /** Gradient id → its stop tracks, by `index.field`. */
  stopTracks: Map<string, Map<string, Track>>;
}

function warn(ctx: Ctx, layerId: string, feature: LottieExportFeature, reason: string): void {
  const key = `${layerId}\u0000${feature}`;
  if (ctx.warned.has(key)) return;
  ctx.warned.add(key);
  ctx.warnings.push({ layerId, feature, reason });
}

const changes = (tr: Track | undefined): tr is Track =>
  !!tr && tr.keyframes.length > 1 && tr.keyframes.some((k) => k.value !== tr.keyframes[0].value);

function trackOf(ctx: Ctx, layerId: string, property: string): Track | undefined {
  return ctx.tracks.get(`${layerId}\u0000${property}`);
}

const frames = (ctx: Ctx, ms: number) => r4((ms * ctx.fr) / 1000);

// ---------------------------------------------------------------------------
// channels: one Lottie property from Motion tracks
// ---------------------------------------------------------------------------

/** value = coef · pick(track(t) or base) */
interface Term {
  track?: Track;
  base: TrackValue;
  pick: (v: TrackValue) => number;
  coef?: number;
}
/** One dimension of a Lottie property: `add + Σ terms`, clamped. */
interface Dim {
  add?: number;
  terms: Term[];
  min?: number;
  max?: number;
  /** Rounding (coordinates r3, colours / percentages r4). */
  round?: (n: number) => number;
}

const num = (v: TrackValue) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

function dimValue(d: Dim, at: (term: Term) => TrackValue): number {
  let v = d.add ?? 0;
  for (const t of d.terms) v += (t.coef ?? 1) * t.pick(at(t));
  if (d.min !== undefined) v = Math.max(d.min, v);
  if (d.max !== undefined) v = Math.min(d.max, v);
  return (d.round ?? r3)(v);
}

const sortedKeys = (tr: Track) => [...tr.keyframes].sort((a, b) => a.t - b.t);

type Curve = readonly [number, number, number, number];
/** A segment's timing: a curve, or a hold. */
type SegTiming = { hold: true } | { hold: false; curve: Curve };

const LINEAR: Curve = [0, 0, 1, 1];

function curveOf(e: Easing): Curve | 'hold' | 'easeBoth' {
  if (typeof e === 'object') return e.cubicBezier;
  switch (e) {
    case 'hold':
      return 'hold';
    case 'easeIn':
      return EASE_IN_CURVE;
    case 'easeOut':
      return EASE_OUT_CURVE;
    case 'easeBoth':
      return 'easeBoth';
    default:
      return LINEAR;
  }
}

function handles(curves: Curve[]): { o: EaseHandle; i: EaseHandle } {
  const same = curves.every((c) => c.every((v, i) => v === curves[0][i]));
  if (same) {
    const c = curves[0];
    if (c === LINEAR || (c[0] === 0 && c[1] === 0 && c[2] === 1 && c[3] === 1)) return { o: LINEAR_OUT, i: LINEAR_IN };
    return { o: { x: r4(c[0]), y: r4(c[1]) }, i: { x: r4(c[2]), y: r4(c[3]) } };
  }
  return {
    o: { x: curves.map((c) => r4(c[0])), y: curves.map((c) => r4(c[1])) },
    i: { x: curves.map((c) => r4(c[2])), y: curves.map((c) => r4(c[3])) },
  };
}

type Prop = { a: 0; k: number | number[] } | { a: 1; k: LottieKeyframe[] };

/**
 * Keyframes for a Lottie property whose dimensions are `dims`
 * (`scalar` → `k`/`s` hold a single number / `[n]`). Direct key mapping when
 * every dimension has at most one changing track and all changing tracks
 * share their key times and compatible curves; else sampled at every frame.
 */
function channel(ctx: Ctx, dims: Dim[], scalar: boolean, extraTimes: number[] = []): Prop {
  const animated = new Set<Track>();
  for (const d of dims) for (const t of d.terms) if (changes(t.track)) animated.add(t.track);
  const staticAt = (term: Term) => (term.track && term.track.keyframes.length > 0 ? sortedKeys(term.track)[0].value : term.base);
  if (animated.size === 0) {
    const v = dims.map((d) => dimValue(d, staticAt));
    return { a: 0, k: scalar ? v[0] : v };
  }
  // Tracks whose picked value never changes (a stop colour's alpha, one channel of a colour) do not drive anything.
  for (const tr of [...animated]) {
    const varies = dims.some((d) => d.terms.some((t) => t.track === tr && sortedKeys(tr).some((k) => dimValue({ ...d, terms: [t] }, () => k.value) !== dimValue({ ...d, terms: [t] }, () => sortedKeys(tr)[0].value))));
    if (!varies) animated.delete(tr);
  }
  if (animated.size === 0) {
    const v = dims.map((d) => dimValue(d, staticAt));
    return { a: 0, k: scalar ? v[0] : v };
  }
  const direct = directKeys(ctx, dims, [...animated], scalar);
  if (direct) return { a: 1, k: direct };
  return { a: 1, k: bakeKeys(ctx, dims, [...animated], scalar, extraTimes) };
}

function directKeys(ctx: Ctx, dims: Dim[], animated: Track[], scalar: boolean): LottieKeyframe[] | null {
  // At most one changing track per dimension.
  const owner: Array<Track | null> = dims.map((d) => {
    const ts = d.terms.filter((t) => t.track && animated.includes(t.track)).map((t) => t.track!);
    return ts.length === 0 ? null : new Set(ts).size === 1 ? ts[0] : (undefined as unknown as Track);
  });
  if (owner.some((o) => o === undefined)) return null;
  const lists = animated.map(sortedKeys);
  const times = lists[0].map((k) => k.t);
  if (lists.some((l) => l.length !== times.length || l.some((k, i) => k.t !== times[i]))) return null;
  const keyAt = (tr: Track, i: number) => sortedKeys(tr)[i];
  const out: LottieKeyframe[] = [];
  const valueAtKey = (i: number, mid?: number) =>
    dims.map((d) =>
      dimValue(d, (term) => {
        if (!term.track || !animated.includes(term.track)) return staticOf(term);
        const a = keyAt(term.track, i);
        if (mid === undefined) return a.value;
        const b = keyAt(term.track, i + 1);
        return interpolable(a.value, b.value) ? interpolate(a.value, b.value, 0.5) : a.value;
      }),
    );
  for (let i = 0; i < times.length; i++) {
    const last = i === times.length - 1;
    // Per-dimension timing of the segment starting at key i.
    const raw: Array<SegTiming | 'easeBoth' | 'constHold' | null> = owner.map((tr) => {
      if (!tr) return null;
      const a = keyAt(tr, i);
      if (last) {
        const c = curveOf(a.easing);
        return c === 'easeBoth' ? { hold: false, curve: LINEAR } : c === 'hold' ? { hold: true } : { hold: false, curve: c };
      }
      const b = keyAt(tr, i + 1);
      if (a.value === b.value) return a.easing === 'hold' ? 'constHold' : null; // constant segment: any curve
      if (!interpolable(a.value, b.value)) return { hold: true };
      const c = curveOf(a.easing);
      if (c === 'hold') return { hold: true };
      if (c === 'easeBoth') return 'easeBoth';
      return { hold: false, curve: c };
    });
    // A constant segment keyed as a hold stays a hold when nothing else moves (it plays the same either way).
    const constHold = raw.some((x) => x === 'constHold');
    const segs: Array<SegTiming | 'easeBoth' | null> = raw.map((x) => (x === 'constHold' ? null : x));
    const active = segs.filter((s): s is SegTiming | 'easeBoth' => s !== null);
    if (active.length === 0 && constHold && !last) {
      const v = valueAtKey(i);
      out.push({ t: frames(ctx, times[i]), s: scalar ? [v[0]] : v, h: 1 });
      continue;
    }
    const holds = active.filter((s) => s !== 'easeBoth' && s.hold).length;
    const boths = active.filter((s) => s === 'easeBoth').length;
    if (holds > 0 && holds < active.length) return null;
    if (boths > 0) {
      // easeBoth halves are exact only if the other changing dimensions are linear (a straight line splits into two).
      const others = active.filter((s) => s !== 'easeBoth') as SegTiming[];
      if (others.some((s) => s.hold || !isLinear(s.curve))) return null;
    }
    const v = valueAtKey(i);
    const s = scalar ? [v[0]] : v;
    const t = frames(ctx, times[i]);
    if (holds > 0) {
      out.push({ t, s, h: 1 });
      continue;
    }
    if (boths > 0 && !last) {
      const firstCurves = segs.map((x) => (x === 'easeBoth' ? EASE_IN_CURVE : LINEAR));
      const secondCurves = segs.map((x) => (x === 'easeBoth' ? EASE_OUT_CURVE : LINEAR));
      out.push({ t, s, ...handles(scalar ? [firstCurves[0]] : firstCurves) });
      const mv = valueAtKey(i, 0.5);
      out.push({ t: frames(ctx, (times[i] + times[i + 1]) / 2), s: scalar ? [mv[0]] : mv, ...handles(scalar ? [secondCurves[0]] : secondCurves) });
      continue;
    }
    const curves = segs.map((x) => (x && x !== 'easeBoth' && !x.hold ? x.curve : LINEAR));
    const driving = active.length > 0 ? (active[0] as { curve: Curve }).curve : LINEAR;
    const perDim = scalar ? [curves[0]] : curves.map((c, d) => (segs[d] === null ? driving : c));
    out.push({ t, s, ...handles(perDim) });
  }
  return out;
}

const isLinear = (c: Curve) => c[0] === c[1] && c[2] === c[3];

function staticOf(term: Term): TrackValue {
  return term.track && term.track.keyframes.length > 0 ? sortedKeys(term.track)[0].value : term.base;
}

/** Sampling grid: every frame (at most 2000 samples) plus every key time. */
function bakeTimes(ctx: Ctx, keyTimes: number[]): number[] {
  const duration = ctx.doc.duration;
  const every = Math.max(1, Math.ceil((duration * ctx.fr) / 1000 / 2000));
  const set = new Set<number>();
  // Exact frame times (frame n at n·1000/fr ms), so the keys land on whole frames.
  for (let n = 0; (n * 1000) / ctx.fr < duration; n += every) set.add((n * 1000) / ctx.fr);
  set.add(duration);
  for (const t of keyTimes) if (t >= 0 && t <= duration) set.add(t);
  return [...set].sort((a, b) => a - b);
}

/** Holds of a track: the times where it jumps (end of a hold or non-interpolable segment). */
function jumpTimes(tr: Track): number[] {
  const keys = sortedKeys(tr);
  const out: number[] = [];
  for (let i = 0; i + 1 < keys.length; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (a.value !== b.value && (a.easing === 'hold' || !interpolable(a.value, b.value))) out.push(b.t);
  }
  return out;
}

function bakeKeys(ctx: Ctx, dims: Dim[], animated: Track[], scalar: boolean, extraTimes: number[]): LottieKeyframe[] {
  const keyTimes = animated.flatMap((tr) => tr.keyframes.map((k) => k.t)).concat(extraTimes);
  const jumps = new Set(animated.flatMap(jumpTimes));
  const times = bakeTimes(ctx, keyTimes);
  return times.map((t, i) => {
    const v = dims.map((d) => dimValue(d, (term) => (term.track && term.track.keyframes.length > 0 ? sampleKeyframes(sortedKeys(term.track), t)! : term.base)));
    const next = times[i + 1];
    const s = scalar ? [v[0]] : v;
    if (next !== undefined && jumps.has(next)) return { t: frames(ctx, t), s, h: 1 as const };
    return { t: frames(ctx, t), s, o: LINEAR_OUT, i: LINEAR_IN };
  });
}

/** A property sampled from an arbitrary function of time (motion paths): every frame, linear keys. */
function sampledProp(ctx: Ctx, keyTimes: number[], jumps: Set<number>, f: (t: number) => number[], scalar: boolean): Prop {
  const times = bakeTimes(ctx, keyTimes);
  const values = times.map(f);
  if (values.every((v) => v.every((x, i) => x === values[0][i]))) return { a: 0, k: scalar ? values[0][0] : values[0] };
  return {
    a: 1,
    k: times.map((t, i) => {
      const s = scalar ? [values[i][0]] : values[i];
      const next = times[i + 1];
      if (next !== undefined && jumps.has(next)) return { t: frames(ctx, t), s, h: 1 as const };
      return { t: frames(ctx, t), s, o: LINEAR_OUT, i: LINEAR_IN };
    }),
  };
}

// ---------------------------------------------------------------------------
// transform
// ---------------------------------------------------------------------------

const TF = ['x', 'y', 'scaleX', 'scaleY', 'rotation', 'skewX', 'skewY', 'anchorX', 'anchorY'] as const;

function transformProps(ctx: Ctx, layer: Exclude<Layer, { type: 'raw' }>, anchorOffset: [number, number] = [0, 0]): Record<string, unknown> {
  const base = resolveTransform(layer.transform);
  const tr = (f: (typeof TF)[number]) => trackOf(ctx, layer.id, `transform.${f}`);
  const term = (f: (typeof TF)[number], coef = 1): Term => ({ track: tr(f), base: base[f], pick: num, coef });
  const skewX = changes(tr('skewX')) || base.skewX !== 0;
  const skewY = changes(tr('skewY')) || base.skewY !== 0;
  if (skewX && skewY) warn(ctx, layer.id, 'skew', 'skewX and skewY together; skewY is dropped');
  const motion = trackOf(ctx, layer.id, 'motionPath');
  const out: Record<string, unknown> = {};
  if (motion && motion.keyframes.length > 0 && motionPathData(ctx.doc, motion)) {
    // Motion path: the full transform (path offset folded in) sampled at every frame.
    const keyTimes = [...TF.flatMap((f) => tr(f)?.keyframes.map((k) => k.t) ?? []), ...motion.keyframes.map((k) => k.t)];
    const jumps = new Set([...TF.flatMap((f) => (tr(f) ? jumpTimes(tr(f)!) : [])), ...jumpTimes(motion)]);
    const at = (t: number) => {
      const l = sampledLayer(ctx.doc, layer.id, t);
      return resolveTransform(l && l.type !== 'raw' ? l.transform : undefined);
    };
    out.a = sampledProp(ctx, keyTimes, jumps, (t) => [r3(at(t).anchorX - anchorOffset[0]), r3(at(t).anchorY - anchorOffset[1])], false);
    const px = sampledProp(ctx, keyTimes, jumps, (t) => [r3(at(t).x + at(t).anchorX)], true);
    const py = sampledProp(ctx, keyTimes, jumps, (t) => [r3(at(t).y + at(t).anchorY)], true);
    out.p = px.a === 0 && py.a === 0 ? { a: 0, k: [px.k, py.k] } : { s: true, x: px, y: py };
    out.s = sampledProp(ctx, keyTimes, jumps, (t) => [r3(at(t).scaleX * 100), r3(at(t).scaleY * 100)], false);
    out.r = sampledProp(ctx, keyTimes, jumps, (t) => [r3(at(t).rotation)], true);
    if (skewX || skewY) {
      out.sk = sampledProp(ctx, keyTimes, jumps, (t) => [r3(skewX ? -at(t).skewX : at(t).skewY)], true);
      out.sa = { a: 0, k: skewX ? 0 : 90 };
    }
  } else {
    out.a = channel(ctx, [
      { add: -anchorOffset[0], terms: [term('anchorX')] },
      { add: -anchorOffset[1], terms: [term('anchorY')] },
    ], false);
    const px = channel(ctx, [{ terms: [term('x'), term('anchorX')] }], true);
    const py = channel(ctx, [{ terms: [term('y'), term('anchorY')] }], true);
    out.p = px.a === 0 && py.a === 0 ? { a: 0, k: [px.k, py.k] } : { s: true, x: px, y: py };
    out.s = channel(ctx, [{ terms: [term('scaleX', 100)] }, { terms: [term('scaleY', 100)] }], false);
    out.r = channel(ctx, [{ terms: [term('rotation')] }], true);
    if (skewX || skewY) {
      out.sk = skewX ? channel(ctx, [{ terms: [term('skewX', -1)] }], true) : channel(ctx, [{ terms: [term('skewY')] }], true);
      out.sa = { a: 0, k: skewX ? 0 : 90 };
    }
  }
  out.o = channel(ctx, [{ terms: [{ track: trackOf(ctx, layer.id, 'opacity'), base: layer.opacity ?? 1, pick: num, coef: 100 }], min: 0, max: 100 }], true);
  return out;
}

// ---------------------------------------------------------------------------
// styles (with group inheritance)
// ---------------------------------------------------------------------------

/** Inheritable style: a static value plus the track that animates it (from the layer that set it). */
interface Inherit {
  fill?: { value: string; track?: Track };
  stroke?: { value: string; track?: Track };
  strokeWidth?: { value: number; track?: Track };
  strokeDashoffset?: { value: number; track?: Track };
  fillOpacity?: number;
  strokeOpacity?: number;
  fillRule?: 'nonzero' | 'evenodd';
  strokeLinecap?: string;
  strokeLinejoin?: string;
  strokeMiterlimit?: number;
  strokeDasharray?: number[];
}

function inheritFrom(ctx: Ctx, layer: Exclude<Layer, { type: 'raw' }>, parent: Inherit): Inherit {
  const own = <T,>(prop: 'fill' | 'stroke' | 'strokeWidth' | 'strokeDashoffset', value: T | undefined, prev: { value: T; track?: Track } | undefined) => {
    const track = trackOf(ctx, layer.id, prop);
    if (track && track.keyframes.length > 0) return { value: (value ?? prev?.value ?? track.keyframes[0].value) as T, track };
    if (value !== undefined) return { value };
    return prev;
  };
  return {
    fill: own('fill', layer.fill, parent.fill),
    stroke: own('stroke', layer.stroke, parent.stroke),
    strokeWidth: own('strokeWidth', layer.strokeWidth, parent.strokeWidth),
    strokeDashoffset: own('strokeDashoffset', layer.strokeDashoffset, parent.strokeDashoffset),
    fillOpacity: layer.fillOpacity ?? parent.fillOpacity,
    strokeOpacity: layer.strokeOpacity ?? parent.strokeOpacity,
    fillRule: layer.fillRule ?? parent.fillRule,
    strokeLinecap: layer.strokeLinecap ?? parent.strokeLinecap,
    strokeLinejoin: layer.strokeLinejoin ?? parent.strokeLinejoin,
    strokeMiterlimit: layer.strokeMiterlimit ?? parent.strokeMiterlimit,
    strokeDasharray: layer.strokeDasharray ?? parent.strokeDasharray,
  };
}

const isNone = (p: TrackValue) => typeof p === 'string' && p.trim().toLowerCase() === 'none';

/** Colour + opacity channels of a paint (plain colours and `none` only). */
function colorChannels(ctx: Ctx, layerId: string, paint: { value: string; track?: Track }, opacity: number): { c: Prop; o: Prop } | null {
  const track = paint.track && paint.track.keyframes.length > 0 ? paint.track : undefined;
  const values = track ? track.keyframes.map((k) => k.value) : [paint.value];
  if (values.every(isNone)) return null;
  if (values.some((v) => typeof v !== 'string' || (!isNone(v) && !parseColor(v)))) {
    warn(ctx, layerId, 'paint', 'paint is not a plain colour or gradient');
    return null;
  }
  // `none` keys take the nearest colour and opacity 0 (they hold: not interpolable).
  const firstColor = values.find((v) => !isNone(v)) as string;
  const colorOf = (v: TrackValue) => (isNone(v) ? firstColor : (v as string));
  const rgb = (i: number) => (v: TrackValue) => lottieColor(colorOf(v))!.rgb[i];
  const alpha = (v: TrackValue) => (isNone(v) ? 0 : lottieColor(colorOf(v))!.alpha);
  const term = (pick: (v: TrackValue) => number, coef = 1): Term => ({ track, base: paint.value, pick, coef });
  const c = channel(ctx, [0, 1, 2].map((i) => ({ terms: [term(rgb(i))], round: r4 })), false);
  const o = channel(ctx, [{ terms: [term(alpha, opacity * 100)], min: 0, max: 100 }], true);
  return { c, o };
}

const LINECAP: Record<string, number> = { butt: 1, round: 2, square: 3 };
const LINEJOIN: Record<string, number> = { miter: 1, round: 2, bevel: 3 };

/** Local bounding box for objectBoundingBox gradients. */
function bboxOf(ctx: Ctx, layer: Layer) {
  return layerLocalBounds(layer, { symbols: ctx.doc.defs.symbols, findLayer: (id) => findDocLayer(ctx.doc, id) });
}

function gradientItem(ctx: Ctx, layer: Layer, g: Gradient, kind: 'fill' | 'stroke', opacity: number): LottieShape | null {
  const userSpace = g.units === 'userSpaceOnUse';
  let m: Matrix = [1, 0, 0, 1, 0, 0];
  if (!userSpace) {
    const b = bboxOf(ctx, layer);
    if (!b || b.width === 0 || b.height === 0) {
      warn(ctx, layer.id, 'gradientShape', `gradient "${g.id}" on a shape without a box`);
      return null;
    }
    m = [b.width, 0, 0, b.height, b.x, b.y];
    if (g.type === 'radial' && Math.abs(b.width - b.height) > 1e-6) warn(ctx, layer.id, 'gradientShape', `radial gradient "${g.id}" is stretched into an ellipse`);
  }
  if (g.gradientTransform) {
    const [a, b, c, d] = g.gradientTransform;
    // Similarity (rotation + uniform scale) keeps gradient lines perpendicular and circles round.
    if (Math.abs(a - d) > 1e-6 || Math.abs(b + c) > 1e-6) warn(ctx, layer.id, 'gradientShape', `gradient "${g.id}" has a skewing or stretching transform`);
    const gt = g.gradientTransform;
    m = [m[0] * gt[0] + m[2] * gt[1], m[1] * gt[0] + m[3] * gt[1], m[0] * gt[2] + m[2] * gt[3], m[1] * gt[2] + m[3] * gt[3], m[0] * gt[4] + m[2] * gt[5] + m[4], m[1] * gt[4] + m[3] * gt[5] + m[5]];
  }
  if (g.spreadMethod && g.spreadMethod !== 'pad') warn(ctx, layer.id, 'gradientShape', `spreadMethod ${g.spreadMethod}`);
  const pt = (x: number, y: number) => {
    const p = applyMatrix(m, { x, y });
    return [r3(p.x), r3(p.y)];
  };
  let s: number[];
  let e: number[];
  const extra: Record<string, unknown> = {};
  if (g.type === 'linear') {
    s = pt(g.x1, g.y1);
    e = pt(g.x2, g.y2);
  } else {
    s = pt(g.cx, g.cy);
    e = pt(g.cx + g.r, g.cy);
    if (g.fr) warn(ctx, layer.id, 'gradientShape', `radial gradient "${g.id}" has a focal radius`);
    const fx = g.fx ?? g.cx;
    const fy = g.fy ?? g.cy;
    if (fx !== g.cx || fy !== g.cy) {
      const f = pt(fx, fy);
      const rad = Math.hypot(e[0] - s[0], e[1] - s[1]);
      const dist = Math.hypot(f[0] - s[0], f[1] - s[1]);
      const base = Math.atan2(e[1] - s[1], e[0] - s[0]);
      extra.h = { a: 0, k: r3(Math.min(99, rad > 0 ? (dist / rad) * 100 : 0)) };
      extra.a = { a: 0, k: r3(((Math.atan2(f[1] - s[1], f[0] - s[0]) - base) * 180) / Math.PI) };
    }
  }
  const stops = g.stops;
  const animated = ctx.stopTracks.get(g.id);
  if (animated && animated.size > 0 && kind === 'stroke') warn(ctx, layer.id, 'strokeGradientAnimation', `stop animation of "${g.id}" on a stroke`);
  const useTracks = kind === 'fill' ? animated : undefined;
  const colorTerm = (i: number, ch: number): Term => {
    const tr = useTracks?.get(`${i}.color`);
    return { track: tr, base: stops[i].color, pick: (v) => lottieColor(typeof v === 'string' ? v : stops[i].color)?.rgb[ch] ?? 0 };
  };
  const offsetTerm = (i: number): Term => ({ track: useTracks?.get(`${i}.offset`), base: stops[i].offset, pick: (v) => Math.min(1, Math.max(0, num(v))) });
  const alphaTerm = (i: number): Term => {
    const tr = useTracks?.get(`${i}.color`);
    return { track: tr, base: stops[i].color, pick: (v) => (lottieColor(typeof v === 'string' ? v : stops[i].color)?.alpha ?? 1) * (stops[i].opacity ?? 1) };
  };
  const hasAlpha =
    stops.some((st) => (st.opacity ?? 1) < 1 || (lottieColor(st.color)?.alpha ?? 1) < 1) ||
    [...(useTracks?.values() ?? [])].some((tr) => tr.keyframes.some((k) => typeof k.value === 'string' && (lottieColor(k.value)?.alpha ?? 1) < 1));
  const dims: Dim[] = [];
  stops.forEach((_, i) => {
    dims.push({ terms: [offsetTerm(i)], round: r4 });
    for (let ch = 0; ch < 3; ch++) dims.push({ terms: [colorTerm(i, ch)], round: r4 });
  });
  if (hasAlpha) {
    stops.forEach((_, i) => {
      dims.push({ terms: [offsetTerm(i)], round: r4 });
      dims.push({ terms: [alphaTerm(i)], round: r4 });
    });
  }
  const k = channel(ctx, dims, false);
  return {
    ty: kind === 'fill' ? 'gf' : 'gs',
    nm: g.id,
    o: { a: 0, k: r3(opacity * 100) },
    s: { a: 0, k: s },
    e: { a: 0, k: e },
    t: g.type === 'linear' ? 1 : 2,
    ...extra,
    g: { p: stops.length, k },
  };
}

// ---------------------------------------------------------------------------
// geometry
// ---------------------------------------------------------------------------

function bezierItems(ctx: Ctx, layerId: string, d: string, track: Track | undefined): LottieShape[] {
  if (track && changes(track)) return morphItems(ctx, layerId, track);
  const bs = pathToBeziers(d);
  if (!bs) {
    warn(ctx, layerId, 'morph', 'path data does not parse');
    return [];
  }
  return bs.map((b) => ({ ty: 'sh', ks: { a: 0, k: b } }));
}

const POINT_BEZIER: LottieBezier = { c: false, v: [[0, 0]], i: [[0, 0]], o: [[0, 0]] };

/** Path morph: shape keyframes per subpath (keys are normalised, so counts match; others hold). */
function morphItems(ctx: Ctx, layerId: string, track: Track): LottieShape[] {
  const keys = sortedKeys(track);
  const parsed = keys.map((k) => (typeof k.value === 'string' ? pathToBeziers(k.value, { exact: true }) : null));
  if (parsed.some((p) => p === null)) {
    warn(ctx, layerId, 'morph', 'a shape key does not parse');
    return [];
  }
  const shapes = parsed as LottieBezier[][];
  const nSub = Math.max(...shapes.map((s) => s.length));
  if (shapes.some((s) => s.length !== nSub)) warn(ctx, layerId, 'morph', 'shape keys change their number of subpaths; those keys hold');
  const items: LottieShape[] = [];
  for (let j = 0; j < nSub; j++) {
    const kf: Array<LottieKeyframe<LottieBezier[]>> = [];
    keys.forEach((key, i) => {
      const s = [shapes[i][j] ?? POINT_BEZIER];
      const next = keys[i + 1];
      const t = frames(ctx, key.t);
      const holds = !next || key.easing === 'hold' || (typeof next.value === 'string' && typeof key.value === 'string' && key.value !== next.value && !morphCompatible(key.value, next.value)) || shapes[i].length !== shapes[i + 1]?.length;
      if (next && ((holds && key.value !== next.value) || key.easing === 'hold')) {
        kf.push({ t, s, h: 1 });
        return;
      }
      const c = curveOf(key.easing);
      if (c === 'easeBoth' && next) {
        kf.push({ t, s, ...handles([EASE_IN_CURVE]) });
        const mid = interpolate(key.value, next.value, 0.5) as string;
        const mb = pathToBeziers(mid, { exact: true });
        kf.push({ t: frames(ctx, (key.t + next.t) / 2), s: [mb?.[j] ?? POINT_BEZIER], ...handles([EASE_OUT_CURVE]) });
        return;
      }
      kf.push({ t, s, ...handles([c === 'hold' || c === 'easeBoth' ? LINEAR : c]) });
    });
    items.push({ ty: 'sh', ks: { a: 1, k: kf } });
  }
  return items;
}

function rectNeedsPath(l: Extract<Layer, { type: 'rect' }>): boolean {
  return l.rx !== undefined && l.ry !== undefined && l.rx !== l.ry;
}

/** Geometry items of a leaf, or null when it has none Lottie can draw. `outlineOrder`: draw as `sh` in SVG outline order (trim paths must start where SVG dashes start). */
function geometryItems(ctx: Ctx, layer: Layer, outlineOrder: boolean): LottieShape[] | null {
  switch (layer.type) {
    case 'rect': {
      if (outlineOrder || rectNeedsPath(layer)) {
        const d = layerOutline(layer);
        return d ? bezierItems(ctx, layer.id, d, undefined) : [];
      }
      return [{ ty: 'rc', d: 1, p: { a: 0, k: [r3(layer.x + layer.width / 2), r3(layer.y + layer.height / 2)] }, s: { a: 0, k: [r3(layer.width), r3(layer.height)] }, r: { a: 0, k: r3(layer.rx ?? layer.ry ?? 0) } }];
    }
    case 'ellipse': {
      if (outlineOrder) {
        const d = layerOutline(layer);
        return d ? bezierItems(ctx, layer.id, d, undefined) : [];
      }
      return [{ ty: 'el', d: 1, p: { a: 0, k: [r3(layer.cx), r3(layer.cy)] }, s: { a: 0, k: [r3(layer.rx * 2), r3(layer.ry * 2)] } }];
    }
    case 'path':
      return bezierItems(ctx, layer.id, layer.d, trackOf(ctx, layer.id, 'd'));
    case 'line':
    case 'polyline':
    case 'polygon': {
      const d = layerOutline(layer);
      return d ? bezierItems(ctx, layer.id, d, undefined) : [];
    }
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// layers
// ---------------------------------------------------------------------------

function cssOnlyCheck(ctx: Ctx, layer: Exclude<Layer, { type: 'raw' }>): void {
  const found = Object.keys(layer.attrs ?? {}).filter((k) => CSS_ONLY_ATTRS.includes(k) && !(k === 'paint-order' && fillOnTop(layer)));
  if (found.length > 0) warn(ctx, layer.id, 'cssOnly', found.join(', '));
  if (layer.strokeLinejoin === 'arcs' || layer.strokeLinejoin === 'miter-clip') warn(ctx, layer.id, 'cssOnly', `stroke-linejoin ${layer.strokeLinejoin}`);
  if (layer.filter || trackOf(ctx, layer.id, 'filter.blur')) warn(ctx, layer.id, 'filter', `filter "${layer.filter ?? ''}"`);
}

interface Walk {
  /** A copy made for a `use` (no `ln`: ids stay unique). */
  copy: boolean;
  /** Recursion guard for `use`. */
  depth: number;
}

/** Content items of a layer (without its own transform). Empty when nothing drawable. */
function contentItems(ctx: Ctx, layer: Layer, inherit: Inherit, w: Walk): LottieShape[] {
  if (layer.type === 'raw') {
    warn(ctx, layer.id, 'raw', 'opaque SVG markup is not exported');
    return [];
  }
  cssOnlyCheck(ctx, layer);
  const style = inheritFrom(ctx, layer, inherit);
  switch (layer.type) {
    case 'group':
      return [...layer.children].reverse().flatMap((c) => nestedItem(ctx, c, style, w));
    case 'text':
      warn(ctx, layer.id, 'text', 'text needs font outlines; the layer is omitted');
      return [];
    case 'image':
      warn(ctx, layer.id, 'image', 'images can only be top-level layers');
      return [];
    case 'use':
      return instanceItems(ctx, layer, style, w);
    default:
      return leafItems(ctx, layer, style);
  }
}

function instanceItems(ctx: Ctx, layer: Extract<Layer, { type: 'use' }>, style: Inherit, w: Walk): LottieShape[] {
  const symbol = ctx.doc.defs.symbols.find((s) => s.id === layer.ref);
  const target = symbol ? null : findLayer(ctx.doc.layers, layer.ref) ?? findDocLayer(ctx.doc, layer.ref);
  if ((symbol && (symbol.viewBox || layer.width !== undefined || layer.height !== undefined)) || (!symbol && (!target || target.type === 'raw')) || w.depth > 8) {
    warn(ctx, layer.id, 'useComplex', `use of "${layer.ref}" is omitted`);
    return [];
  }
  const children = symbol ? symbol.layers : [target!];
  const it = [...children].reverse().flatMap((c) => nestedItem(ctx, c, style, { copy: true, depth: w.depth + 1 }));
  if (it.length === 0) return [];
  // `use` x / y is a translation in front of the copy.
  return [{ ty: 'gr', nm: layer.ref, it: [...it, plainTr(layer.x ?? 0, layer.y ?? 0)] }];
}

const plainTr = (x = 0, y = 0): LottieShape => ({
  ty: 'tr',
  a: { a: 0, k: [0, 0] },
  p: { a: 0, k: [r3(x), r3(y)] },
  s: { a: 0, k: [100, 100] },
  r: { a: 0, k: 0 },
  o: { a: 0, k: 100 },
});

function nestedItem(ctx: Ctx, layer: Layer, inherit: Inherit, w: Walk): LottieShape[] {
  const it = contentItems(ctx, layer, inherit, w);
  if (it.length === 0 || layer.type === 'raw') return [];
  const head: Record<string, unknown> = { nm: layer.name ?? layer.id };
  if (!w.copy) head.ln = layer.id;
  if (layer.hidden) head.hd = true;
  if (layer.mask || layer.clipPath) warn(ctx, layer.id, 'maskAdvanced', 'masks and clip paths only on top-level layers');
  return [{ ...head, ty: 'gr', it: [...it, { ty: 'tr', ...transformProps(ctx, layer) }] }];
}

function leafItems(ctx: Ctx, layer: Exclude<Layer, { type: 'raw' | 'group' | 'text' | 'image' | 'use' }>, style: Inherit): LottieShape[] {
  const fillValue = style.fill ?? { value: layer.type === 'line' ? 'none' : '#000000' };
  const strokeValue = style.stroke ?? { value: 'none' };
  const width = style.strokeWidth ?? { value: 1 };
  // Draw-on: dasharray = [L] with L ≈ outline length and an animated offset → a trim path.
  const dash = style.strokeDasharray && style.strokeDasharray.length > 0 ? style.strokeDasharray : undefined;
  const offset = style.strokeDashoffset;
  const outlineLength = layerOutlineLength(layer);
  const drawOn =
    !!dash && dash.length === 1 && outlineLength > 0 && Math.abs(dash[0] - outlineLength) <= Math.max(0.5, outlineLength * 0.005) && changes(offset?.track) && layer.type !== 'path'
      ? true
      : !!dash && dash.length === 1 && layer.type === 'path' && changes(offset?.track) && pathDrawOnLength(layer.d, dash[0]);
  const geometry = geometryItems(ctx, layer, drawOn);
  if (!geometry || geometry.length === 0) return [];

  const styles: { fill: LottieShape[]; stroke: LottieShape[] } = { fill: [], stroke: [] };
  const paintItems = (kind: 'fill' | 'stroke', paint: { value: string; track?: Track }, opacity: number): LottieShape[] => {
    const animatedRef = paint.track?.keyframes.some((k) => typeof k.value === 'string' && /url\(/i.test(k.value));
    if (animatedRef) {
      warn(ctx, layer.id, 'paint', `${kind} animates a gradient reference`);
      return [];
    }
    const ref = paintRef(paint.value);
    if (ref) {
      const g = ctx.doc.defs.gradients.find((x) => x.id === ref);
      if (!g) {
        warn(ctx, layer.id, 'paint', `${kind} references "${ref}", which is not a gradient`);
        return [];
      }
      const item = gradientItem(ctx, layer, g, kind, opacity);
      if (!item) return [];
      if (kind === 'stroke') return [{ ...item, ...strokeFields(ctx, layer.id, style, width) }];
      return [{ ...item, r: style.fillRule === 'evenodd' ? 2 : 1 }];
    }
    const ch = colorChannels(ctx, layer.id, paint, opacity);
    if (!ch) return [];
    if (kind === 'fill') return [{ ty: 'fl', nm: 'Fill', o: ch.o, c: ch.c, r: style.fillRule === 'evenodd' ? 2 : 1 }];
    return [{ ty: 'st', nm: 'Stroke', o: ch.o, c: ch.c, ...strokeFields(ctx, layer.id, style, width, drawOn ? undefined : { dash, offset }) }];
  };
  styles.fill = paintItems('fill', fillValue, style.fillOpacity ?? 1);
  styles.stroke = paintItems('stroke', strokeValue, style.strokeOpacity ?? 1);

  if (drawOn && styles.stroke.length > 0) {
    const L = dash![0];
    const trim: LottieShape = {
      ty: 'tm',
      nm: 'Draw on',
      // offset o in [-L, L]: visible from max(0, -o) to min(L, L - o) along the outline.
      s: offset!.track!.keyframes.some((k) => num(k.value) < 0)
        ? channel(ctx, [{ terms: [{ track: offset!.track, base: offset!.value, pick: num, coef: -100 / L }], min: 0, max: 100 }], true)
        : { a: 0, k: 0 },
      e: channel(ctx, [{ add: 100, terms: [{ track: offset!.track, base: offset!.value, pick: num, coef: -100 / L }], min: 0, max: 100 }], true),
      o: { a: 0, k: 0 },
      m: 1,
    };
    if (styles.fill.length === 0) return [...geometry, trim, ...styles.stroke];
    // The fill must stay whole: stroke and fill in two groups (stroke on top).
    return [
      { ty: 'gr', nm: 'Stroke', it: [...geometry, trim, ...styles.stroke, plainTr()] },
      { ty: 'gr', nm: 'Fill', it: [...geometry, ...styles.fill, plainTr()] },
    ];
  }
  // Lottie draws the first item on top: stroke above fill, unless `paint-order: stroke` puts the fill on top.
  return fillOnTop(layer) ? [...geometry, ...styles.fill, ...styles.stroke] : [...geometry, ...styles.stroke, ...styles.fill];
}

/** `paint-order: stroke …` (the stroke is painted first, so the fill covers it). */
export function fillOnTop(layer: Exclude<Layer, { type: 'raw' }>): boolean {
  return /^\s*stroke(\s+fill)?(\s+markers)?\s*$/.test(layer.attrs?.['paint-order'] ?? '');
}

/** Whether a path's own dash [L] is its full length (draw-on), measured like the editor's fallback. */
function pathDrawOnLength(d: string, L: number): boolean {
  const m = measurePath(d);
  return !!m && m.length > 0 && Math.abs(L - m.length) <= Math.max(0.5, m.length * 0.005);
}

function strokeFields(
  ctx: Ctx,
  layerId: string,
  style: Inherit,
  width: { value: number; track?: Track },
  dashing?: { dash?: number[]; offset?: { value: number; track?: Track } },
): Record<string, unknown> {
  const out: Record<string, unknown> = {
    w: channel(ctx, [{ terms: [{ track: width.track, base: width.value, pick: num }], min: 0 }], true),
    lc: LINECAP[style.strokeLinecap ?? 'butt'] ?? 1,
    lj: LINEJOIN[style.strokeLinejoin ?? 'miter'] ?? 1,
    ml: r3(style.strokeMiterlimit ?? 4),
  };
  const dash = dashing?.dash;
  if (dash && dash.length > 0 && dash.some((v) => v > 0)) {
    const list = dash.length % 2 === 1 ? [...dash, ...dash] : dash;
    const d: Array<Record<string, unknown>> = list.map((v, i) => ({ n: i % 2 === 0 ? 'd' : 'g', nm: i % 2 === 0 ? 'dash' : 'gap', v: { a: 0, k: r3(v) } }));
    const off = dashing?.offset ?? { value: 0 };
    d.push({ n: 'o', nm: 'offset', v: channel(ctx, [{ terms: [{ track: off.track, base: off.value, pick: num }] }], true) });
    out.d = d;
  }
  return out;
}

const layerBase = (ctx: Ctx, ind: number): Record<string, unknown> => ({ ddd: 0, ind, ip: 0, op: frames(ctx, ctx.doc.duration), st: 0, sr: 1, ao: 0, bm: 0 });

/** Basic masks (add / subtract) of a top-level layer from its mask or clip path; null + warning otherwise. */
function masksOf(ctx: Ctx, layer: Exclude<Layer, { type: 'raw' }>): Array<Record<string, unknown>> | null {
  const out: Array<Record<string, unknown>> = [];
  const shapeBeziers = (l: Layer, extra: Matrix | null): LottieBezier[] | null => {
    if (l.type === 'raw' || l.type === 'group' || l.type === 'text' || l.type === 'image' || l.type === 'use') return null;
    const d = layerOutline(l);
    if (!d) return null;
    const bs = pathToBeziers(d);
    if (!bs) return null;
    let m = transformToMatrix(l.transform);
    if (extra) m = [extra[0] * m[0] + extra[2] * m[1], extra[1] * m[0] + extra[3] * m[1], extra[0] * m[2] + extra[2] * m[3], extra[1] * m[2] + extra[3] * m[3], extra[0] * m[4] + extra[2] * m[5] + extra[4], extra[1] * m[4] + extra[3] * m[5] + extra[5]];
    const map = (p: Vec) => {
      const q = applyMatrix(m, { x: p[0], y: p[1] });
      return [r3(q.x), r3(q.y)];
    };
    const lin = (p: Vec) => [r3(m[0] * p[0] + m[2] * p[1]), r3(m[1] * p[0] + m[3] * p[1])];
    return bs.map((b) => ({ c: b.c, v: b.v.map(map), i: b.i.map(lin), o: b.o.map(lin) }));
  };
  const animatedInside = (ls: Layer[]) => {
    let any = false;
    const ids = new Set<string>();
    const walk = (xs: Layer[]) => xs.forEach((x) => (ids.add(x.id), x.type === 'group' && walk(x.children)));
    walk(ls);
    for (const tr of ctx.doc.animations) if (ids.has(tr.layerId) && changes(tr)) any = true;
    return any;
  };
  if (layer.clipPath) {
    const c = ctx.doc.defs.clipPaths.find((x) => x.id === layer.clipPath);
    if (!c || c.units === 'objectBoundingBox' || animatedInside(c.layers)) return null;
    for (const l of c.layers) {
      const bs = shapeBeziers(l, c.transform ?? null);
      if (!bs) return null;
      for (const b of bs) out.push({ inv: false, mode: 'a', pt: { a: 0, k: b }, o: { a: 0, k: 100 }, x: { a: 0, k: 0 }, nm: l.name ?? l.id, ln: l.id });
    }
  }
  if (layer.mask) {
    const m = ctx.doc.defs.masks.find((x) => x.id === layer.mask);
    if (!m || m.contentUnits === 'objectBoundingBox' || animatedInside(m.layers)) return null;
    const adds: Array<Record<string, unknown>> = [];
    const subs: Array<Record<string, unknown>> = [];
    for (const l of m.layers) {
      if (l.type === 'raw') return null;
      const c = parseColor(l.fill ?? '#000000');
      const white = c && c.r === 255 && c.g === 255 && c.b === 255 && c.a === 1;
      const black = c && c.r === 0 && c.g === 0 && c.b === 0 && c.a === 1;
      if ((!white && !black) || (l.opacity ?? 1) !== 1 || (l.fillOpacity ?? 1) !== 1 || (l.stroke && l.stroke !== 'none')) return null;
      const bs = shapeBeziers(l, null);
      if (!bs) return null;
      for (const b of bs) (white ? adds : subs).push({ inv: false, mode: white ? 'a' : 's', pt: { a: 0, k: b }, o: { a: 0, k: 100 }, x: { a: 0, k: 0 }, nm: l.name ?? l.id, ln: l.id });
    }
    if (adds.length === 0) return null;
    out.push(...adds, ...subs);
  }
  return out;
}

function topLayer(ctx: Ctx, layer: Layer, ind: number, parent: number | undefined): LottieLayer | null {
  if (layer.type === 'raw') {
    warn(ctx, layer.id, 'raw', 'opaque SVG markup is not exported');
    return null;
  }
  const head: Record<string, unknown> = { ...layerBase(ctx, ind), nm: layer.name ?? layer.id, ln: layer.id };
  if (parent !== undefined) head.parent = parent;
  if (layer.hidden) head.hd = true;
  if (layer.type === 'image') {
    cssOnlyCheck(ctx, layer);
    if (!layer.href.startsWith('data:')) {
      warn(ctx, layer.id, 'image', 'image pixels are not embedded (asset reference)');
      return null;
    }
    const id = `image_${ctx.assets.length}`;
    ctx.assets.push({ id, w: r3(layer.width), h: r3(layer.height), u: '', p: layer.href.replace(/\s+/g, ''), e: 1 });
    return { ...head, ty: 2, refId: id, ks: transformProps(ctx, layer, [layer.x, layer.y]) } as LottieLayer;
  }
  const shapes = contentItems(ctx, layer, {}, { copy: false, depth: 0 });
  if (shapes.length === 0) return null;
  const out: Record<string, unknown> = { ...head, ty: 4, ks: transformProps(ctx, layer), shapes };
  if (layer.mask || layer.clipPath) {
    const masks = masksOf(ctx, layer);
    if (masks && masks.length > 0) {
      out.hasMask = true;
      out.masksProperties = masks;
    } else warn(ctx, layer.id, 'maskAdvanced', `${layer.mask ? `mask "${layer.mask}"` : `clip path "${layer.clipPath}"`} is not a basic add / subtract shape mask`);
  }
  return out as LottieLayer;
}

// ---------------------------------------------------------------------------
// document
// ---------------------------------------------------------------------------

/** The viewBox → canvas matrix (`xMidYMid meet`), or null when it is the identity. */
function viewBoxMatrix(doc: VectorDoc, w: number, h: number): Matrix | null {
  const vb = doc.canvas.viewBox;
  const s = Math.min(w / vb.width, h / vb.height);
  const tx = (w - vb.width * s) / 2 - vb.x * s;
  const ty = (h - vb.height * s) / 2 - vb.y * s;
  if (Math.abs(s - 1) < 1e-9 && Math.abs(tx) < 1e-9 && Math.abs(ty) < 1e-9) return null;
  return [s, 0, 0, s, tx, ty];
}

/** `exportLottie(doc) → { json, warnings }` (module comment). */
export function exportLottie(doc: VectorDoc, opts: LottieExportOptions = {}): LottieExport {
  const fr = doc.fps > 0 ? doc.fps : 24;
  const tracks = new Map<string, Track>();
  for (const tr of doc.animations) {
    if (tr.keyframes.length === 0 || tr.property === 'mask' || tr.property === 'clipPath') continue;
    const key = `${tr.layerId}\u0000${tr.property}`;
    if (!tracks.has(key)) tracks.set(key, tr);
  }
  const stopTracks = new Map<string, Map<string, Track>>();
  for (const tr of doc.animations) {
    const stop = parseStopProperty(tr.property);
    if (!stop || tr.keyframes.length === 0) continue;
    const g = trackGradient(doc, tr);
    if (!g || stop.index >= g.stops.length) continue;
    let m = stopTracks.get(g.id);
    if (!m) stopTracks.set(g.id, (m = new Map()));
    const k = `${stop.index}.${stop.field}`;
    if (!m.has(k)) m.set(k, tr);
  }
  const ctx: Ctx = { doc, fr, tracks, warnings: [], warned: new Set(), assets: [], stopTracks };

  // Features of tracks the walk never reaches (layers inside symbols are reached through `use`).
  forEachLayer(doc, (l) => {
    if (l.type !== 'raw' && trackOf(ctx, l.id, 'filter.blur')) warn(ctx, l.id, 'filter', 'animated blur');
  });
  if (!docLoops(doc)) warn(ctx, '', 'playOnce', 'Lottie files have no loop setting; players loop unless told otherwise');

  const w = Math.max(1, Math.round(doc.canvas.width));
  const h = Math.max(1, Math.round(doc.canvas.height));
  const vbm = viewBoxMatrix(doc, w, h);
  const layers: LottieLayer[] = [];
  let ind = 1;
  let parent: number | undefined;
  if (vbm) {
    parent = ind++;
    layers.push({
      ...layerBase(ctx, parent),
      ty: 3,
      nm: 'viewBox',
      cl: LOTTIE_VIEWBOX_CLASS,
      // The exact viewBox for our reader (players ignore unknown keys; the transform below is what they draw).
      mm: { viewBox: [doc.canvas.viewBox.x, doc.canvas.viewBox.y, doc.canvas.viewBox.width, doc.canvas.viewBox.height].map(r3) },
      ks: {
        a: { a: 0, k: [0, 0] },
        p: { a: 0, k: [r3(vbm[4]), r3(vbm[5])] },
        s: { a: 0, k: [r3(vbm[0] * 100), r3(vbm[3] * 100)] },
        r: { a: 0, k: 0 },
        o: { a: 0, k: 100 },
      },
    } as LottieLayer);
  }
  for (const layer of [...doc.layers].reverse()) {
    const l = topLayer(ctx, layer, ind, parent);
    if (l) {
      layers.push(l);
      ind += 1;
    }
  }
  const bg = lottieColor(doc.canvas.background);
  if (bg && bg.alpha > 0) {
    layers.push({
      ...layerBase(ctx, ind),
      ty: 4,
      nm: 'Background',
      cl: LOTTIE_BACKGROUND_CLASS,
      ks: { a: { a: 0, k: [0, 0] }, p: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
      shapes: [
        { ty: 'rc', d: 1, p: { a: 0, k: [r3(w / 2), r3(h / 2)] }, s: { a: 0, k: [w, h] }, r: { a: 0, k: 0 } },
        { ty: 'fl', nm: 'Fill', o: { a: 0, k: r3(bg.alpha * 100) }, c: { a: 0, k: bg.rgb }, r: 1 },
      ],
    } as LottieLayer);
  }

  const json: LottieAnimation = {
    v: LOTTIE_BODYMOVIN_VERSION,
    ver: LOTTIE_SPEC.ver,
    meta: { g: lottieGenerator() },
    ...(opts.name ? { nm: opts.name } : {}),
    fr,
    ip: 0,
    op: frames(ctx, doc.duration),
    w,
    h,
    ddd: 0,
    assets: ctx.assets,
    layers,
    markers: [],
  };
  return { json, warnings: ctx.warnings };
}

/** The downloaded file text (compact JSON, as players expect). */
export const lottieText = (json: LottieAnimation) => JSON.stringify(json);

/** Suggested download name: `<name>.json`, filesystem-safe. */
export function lottieFileName(name: string | undefined): string {
  const base = (name ?? '').trim().replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '-').slice(0, 80) || 'animation';
  return `${base}.json`;
}

// Re-exported for the tests.
export type { Keyframe };
