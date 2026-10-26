/**
 * Keyframe sampling for Motion tracks (ticket MM44 decision 3).
 *
 * `sampleTrack(track, t)` is the ONE definition of a track's value at time t;
 * the preview renders from it and the CSS exporter is golden-tested to agree
 * with it. The maths is Darkroom's `valueAt` (`lib/studio/ease.ts`), extended
 * to cubic-bezier easing and colours:
 *
 *   - keyframes are sorted by t (ms); the store enforces it on write
 *     (`normalizeKeyframes`, `lib/vector/keyframes.ts`);
 *   - before the first keyframe the first value holds, after the last the
 *     last value holds;
 *   - segment [a, b) interpolates a.value → b.value with a's easing (the LEFT
 *     keyframe), and at exactly b.t the value is b's, so a `hold` jumps AT
 *     the next keyframe and not before;
 *   - numbers interpolate linearly through the eased progress (cubic-bezier
 *     overshoot extrapolates; the property clamps on write);
 *   - two plain colours interpolate in premultiplied sRGB (`lib/vector/color.ts`,
 *     what browsers do for CSS keyframe colours); anything else (`none`,
 *     `url(#…)`, a number vs a string) holds like a `hold` segment;
 *   - MM45: two path-data strings with the same command sequence (normalised
 *     morph keys, `lib/vector/morph.ts`) interpolate number by number; paths
 *     that do not match hold.
 *
 * MM45 also applies the advanced tracks (`lib/vector/advanced.ts`): dash
 * offset and `d` on the layer, gradient stops in `defs.gradients`, blur in
 * `defs.filters`, and the motion path folded into the layer transform.
 * Tracks on layers inside masks and clip paths apply like any other.
 */
import { easedProgress } from '@/lib/studio/ease';
import { solveCubicBezier } from '@/lib/vector/bezier';
import { formatColor, lerpColor, parseColor } from '@/lib/vector/color';
import {
  findDocLayer,
  motionExtras,
  motionPathData,
  motionPointAt,
  parseStopProperty,
  trackBlurFilter,
  trackGradient,
  withMotion,
} from '@/lib/vector/advanced';
import { interpolatePath, morphCompatible } from '@/lib/vector/morph';
import {
  isAnimatable,
  isSampledLayerProperty,
  withValue,
  type AnimatableLayer,
  type SampledLayerProperty,
} from '@/lib/vector/properties';
import { isSafeColor, type Easing, type Gradient, type Keyframe, type Layer, type Track, type VectorDoc, type VectorFilter } from '@/lib/vector/vectorTypes';

export type TrackValue = number | string;

/** Eased progress for linear progress f ∈ [0,1] through a keyframe easing. */
export function easingProgress(easing: Easing, f: number): number {
  if (typeof easing === 'string') return easedProgress(easing, f);
  return solveCubicBezier(easing.cubicBezier, f);
}

/** Whether a segment from `a` to `b` can interpolate (else it holds). */
export function interpolable(a: TrackValue, b: TrackValue): boolean {
  if (typeof a === 'number' && typeof b === 'number') return true;
  if (typeof a === 'string' && typeof b === 'string') {
    if (parseColor(a) !== null && parseColor(b) !== null) return true;
    return morphCompatible(a, b);
  }
  return false;
}

/** The value between keyframes a and b at eased progress `p` (a, b interpolable). */
export function interpolate(a: TrackValue, b: TrackValue, p: number): TrackValue {
  if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * p;
  const ca = parseColor(a);
  const cb = parseColor(b);
  if (ca && cb) return formatColor(lerpColor(ca, cb, p));
  if (typeof a === 'string' && typeof b === 'string' && morphCompatible(a, b)) return interpolatePath(a, b, p);
  return a;
}

/** Value of a keyframe list at time t (ms). Undefined for an empty list. */
export function sampleKeyframes(keyframes: readonly Keyframe[], t: number): TrackValue | undefined {
  if (keyframes.length === 0) return undefined;
  const first = keyframes[0];
  if (t <= first.t) return first.value;
  const last = keyframes[keyframes.length - 1];
  if (t >= last.t) return last.value;
  // Binary search for the first keyframe with b.t > t.
  let lo = 1;
  let hi = keyframes.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (keyframes[mid].t > t) hi = mid;
    else lo = mid + 1;
  }
  const a = keyframes[lo - 1];
  const b = keyframes[lo];
  const span = b.t - a.t;
  if (span <= 0) return b.value;
  if (!interpolable(a.value, b.value)) return a.value;
  return interpolate(a.value, b.value, easingProgress(a.easing, (t - a.t) / span));
}

/** `sampleTrack(track, t) → value` (decision 3). */
export function sampleTrack(track: Pick<Track, 'keyframes'>, t: number): TrackValue | undefined {
  return sampleKeyframes(track.keyframes, t);
}

/** Tracks the preview applies: every known property with at least one keyframe (mask / clip tracks carry no value). */
export function previewTracks(doc: VectorDoc): Track[] {
  return doc.animations.filter((tr) => tr.keyframes.length > 0 && tr.property !== 'mask' && tr.property !== 'clipPath');
}

/** Per-layer view of the sampled tracks. */
interface LayerSample {
  values: Array<{ property: SampledLayerProperty; value: TrackValue }>;
  /** Folded last, after every transform track. */
  motion?: { d: string; fraction: number; autoOrient: boolean };
}

/** Apply a layer's sampled values; the motion path goes on top of the sampled transform. */
function applyLayerSample(layer: AnimatableLayer, sample: LayerSample): AnimatableLayer {
  let out = layer;
  for (const v of sample.values) out = withValue(out, v.property, v.value);
  if (sample.motion) {
    const p = motionPointAt(sample.motion.d, sample.motion.fraction);
    if (p) out = { ...out, transform: withMotion(out.transform, p, sample.motion.autoOrient) };
  }
  return out;
}

function mapTree(layers: Layer[], byLayer: Map<string, LayerSample>): Layer[] {
  let changed = false;
  const out = layers.map((l) => {
    let next: Layer = l;
    if (l.type === 'group') {
      const children = mapTree(l.children, byLayer);
      if (children !== l.children) next = { ...l, children };
    }
    const sample = byLayer.get(l.id);
    if (sample && isAnimatable(next)) next = applyLayerSample(next, sample);
    if (next !== l) changed = true;
    return next;
  });
  return changed ? out : layers;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Gradients with stop tracks applied (first track per stop field wins). */
function sampleGradients(doc: VectorDoc, tracks: Track[], t: number): Gradient[] {
  const patches = new Map<string, Map<string, TrackValue>>();
  for (const tr of tracks) {
    const stop = parseStopProperty(tr.property);
    if (!stop) continue;
    const g = trackGradient(doc, tr);
    if (!g || stop.index >= g.stops.length) continue;
    const v = sampleTrack(tr, t);
    if (v === undefined) continue;
    let m = patches.get(g.id);
    if (!m) patches.set(g.id, (m = new Map()));
    const key = `${stop.index}.${stop.field}`;
    if (!m.has(key)) m.set(key, v);
  }
  if (patches.size === 0) return doc.defs.gradients;
  return doc.defs.gradients.map((g) => {
    const m = patches.get(g.id);
    if (!m) return g;
    const stops = g.stops.map((s, i) => {
      let next = s;
      const color = m.get(`${i}.color`);
      if (typeof color === 'string' && isSafeColor(color) && color !== s.color) next = { ...next, color };
      const offset = m.get(`${i}.offset`);
      if (typeof offset === 'number' && Number.isFinite(offset) && clamp01(offset) !== s.offset) next = { ...next, offset: clamp01(offset) };
      return next;
    });
    return stops.some((s, i) => s !== g.stops[i]) ? { ...g, stops } : g;
  });
}

/** Filters with `filter.blur` tracks applied (first track per filter wins). */
function sampleFilters(doc: VectorDoc, tracks: Track[], t: number): VectorFilter[] {
  const values = new Map<string, number>();
  for (const tr of tracks) {
    if (tr.property !== 'filter.blur') continue;
    const id = trackBlurFilter(doc, tr.layerId);
    const v = sampleTrack(tr, t);
    if (!id || typeof v !== 'number' || !Number.isFinite(v) || values.has(id)) continue;
    values.set(id, Math.max(0, v));
  }
  if (values.size === 0) return doc.defs.filters;
  return doc.defs.filters.map((f) => {
    const v = values.get(f.id);
    return v === undefined || v === f.stdDeviation ? f : { ...f, stdDeviation: v };
  });
}

/**
 * The document as it looks at time t (decision 6): every track sampled into
 * a transient copy, structurally shared (unanimated layers keep their
 * identity, so memoised renders skip them). `t` is capped to
 * `[0, doc.duration]`. Returns `doc` itself when nothing is animated.
 */
export function sampleDoc(doc: VectorDoc, t: number): VectorDoc {
  const tracks = previewTracks(doc);
  if (tracks.length === 0) return doc;
  const time = Math.min(Math.max(0, t), doc.duration);
  const byLayer = new Map<string, LayerSample>();
  const entry = (id: string) => {
    let e = byLayer.get(id);
    if (!e) byLayer.set(id, (e = { values: [] }));
    return e;
  };
  for (const tr of tracks) {
    if (isSampledLayerProperty(tr.property)) {
      const v = sampleTrack(tr, time);
      if (v !== undefined) entry(tr.layerId).values.push({ property: tr.property, value: v });
    } else if (tr.property === 'motionPath') {
      const e = entry(tr.layerId);
      if (e.motion) continue;
      const d = motionPathData(doc, tr);
      const v = sampleTrack(tr, time);
      if (d && typeof v === 'number') e.motion = { d, fraction: v, autoOrient: motionExtras(tr).autoOrient === true };
    }
  }
  const layers = mapTree(doc.layers, byLayer);
  const masks = doc.defs.masks.map((m) => {
    const ls = mapTree(m.layers, byLayer);
    return ls === m.layers ? m : { ...m, layers: ls };
  });
  const clipPaths = doc.defs.clipPaths.map((c) => {
    const ls = mapTree(c.layers, byLayer);
    return ls === c.layers ? c : { ...c, layers: ls };
  });
  const symbols = doc.defs.symbols.map((s) => {
    const ls = mapTree(s.layers, byLayer);
    return ls === s.layers ? s : { ...s, layers: ls };
  });
  const gradients = sampleGradients(doc, tracks, time);
  const filters = sampleFilters(doc, tracks, time);
  const defsChanged =
    gradients !== doc.defs.gradients ||
    filters !== doc.defs.filters ||
    masks.some((m, i) => m !== doc.defs.masks[i]) ||
    clipPaths.some((c, i) => c !== doc.defs.clipPaths[i]) ||
    symbols.some((s, i) => s !== doc.defs.symbols[i]);
  if (layers === doc.layers && !defsChanged) return doc;
  return { ...doc, layers, defs: defsChanged ? { ...doc.defs, gradients, filters, masks, clipPaths, symbols } : doc.defs };
}

/** The sampled layer `id` at time t, anywhere in the document (undefined when missing). */
export function sampledLayer(doc: VectorDoc, id: string, t: number): Layer | undefined {
  return findDocLayer(sampleDoc(doc, t), id);
}
