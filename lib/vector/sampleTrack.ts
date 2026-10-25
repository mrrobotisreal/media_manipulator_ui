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
 *     `url(#…)`, a number vs a string) holds like a `hold` segment.
 */
import { easedProgress } from '@/lib/studio/ease';
import { solveCubicBezier } from '@/lib/vector/bezier';
import { formatColor, lerpColor, parseColor } from '@/lib/vector/color';
import { findLayer } from '@/lib/vector/layerTree';
import { isAnimatable, isEditableProperty, withValue, type AnimatableLayer, type EditableProperty } from '@/lib/vector/properties';
import type { Easing, Keyframe, Layer, Track, VectorDoc } from '@/lib/vector/vectorTypes';

export type TrackValue = number | string;

/** Eased progress for linear progress f ∈ [0,1] through a keyframe easing. */
export function easingProgress(easing: Easing, f: number): number {
  if (typeof easing === 'string') return easedProgress(easing, f);
  return solveCubicBezier(easing.cubicBezier, f);
}

/** Whether a segment from `a` to `b` can interpolate (else it holds). */
export function interpolable(a: TrackValue, b: TrackValue): boolean {
  if (typeof a === 'number' && typeof b === 'number') return true;
  if (typeof a === 'string' && typeof b === 'string') return parseColor(a) !== null && parseColor(b) !== null;
  return false;
}

/** The value between keyframes a and b at eased progress `p` (a, b interpolable). */
export function interpolate(a: TrackValue, b: TrackValue, p: number): TrackValue {
  if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * p;
  const ca = parseColor(a);
  const cb = parseColor(b);
  if (!ca || !cb) return a;
  return formatColor(lerpColor(ca, cb, p));
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

/** Tracks the MM44 preview applies: editable properties with at least one keyframe. */
export function previewTracks(doc: VectorDoc): Track[] {
  return doc.animations.filter((tr) => tr.keyframes.length > 0 && isEditableProperty(tr.property));
}

/** Apply every editable track of `layer` at time t (tracks already grouped by layer). */
function applyLayerTracks(layer: AnimatableLayer, tracks: Track[], t: number): AnimatableLayer {
  let out = layer;
  for (const tr of tracks) {
    const v = sampleTrack(tr, t);
    if (v !== undefined) out = withValue(out, tr.property as EditableProperty, v);
  }
  return out;
}

function mapTree(layers: Layer[], byLayer: Map<string, Track[]>, t: number): Layer[] {
  let changed = false;
  const out = layers.map((l) => {
    let next: Layer = l;
    if (l.type === 'group') {
      const children = mapTree(l.children, byLayer, t);
      if (children !== l.children) next = { ...l, children };
    }
    const tracks = byLayer.get(l.id);
    if (tracks && isAnimatable(next)) next = applyLayerTracks(next, tracks, t);
    if (next !== l) changed = true;
    return next;
  });
  return changed ? out : layers;
}

/**
 * The document as it looks at time t (decision 6): every editable track
 * sampled into a transient copy, structurally shared (unanimated layers keep
 * their identity, so memoised renders skip them). `t` is capped to
 * `[0, doc.duration]`. Returns `doc` itself when nothing is animated.
 */
export function sampleDoc(doc: VectorDoc, t: number): VectorDoc {
  const tracks = previewTracks(doc);
  if (tracks.length === 0) return doc;
  const time = Math.min(Math.max(0, t), doc.duration);
  const byLayer = new Map<string, Track[]>();
  for (const tr of tracks) {
    const list = byLayer.get(tr.layerId);
    if (list) list.push(tr);
    else byLayer.set(tr.layerId, [tr]);
  }
  const layers = mapTree(doc.layers, byLayer, time);
  const masks = doc.defs.masks.map((m) => {
    const ls = mapTree(m.layers, byLayer, time);
    return ls === m.layers ? m : { ...m, layers: ls };
  });
  const clipPaths = doc.defs.clipPaths.map((c) => {
    const ls = mapTree(c.layers, byLayer, time);
    return ls === c.layers ? c : { ...c, layers: ls };
  });
  const symbols = doc.defs.symbols.map((s) => {
    const ls = mapTree(s.layers, byLayer, time);
    return ls === s.layers ? s : { ...s, layers: ls };
  });
  const defsChanged =
    masks.some((m, i) => m !== doc.defs.masks[i]) ||
    clipPaths.some((c, i) => c !== doc.defs.clipPaths[i]) ||
    symbols.some((s, i) => s !== doc.defs.symbols[i]);
  if (layers === doc.layers && !defsChanged) return doc;
  return { ...doc, layers, defs: defsChanged ? { ...doc.defs, masks, clipPaths, symbols } : doc.defs };
}

/** The sampled layer `id` at time t (undefined when missing). */
export function sampledLayer(doc: VectorDoc, id: string, t: number): Layer | undefined {
  return findLayer(sampleDoc(doc, t).layers, id);
}
