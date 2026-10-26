/**
 * The MM45 animators as pure document operations (ticket MM45 decisions
 * 2–7, 11). The animator panel calls them through the store's `mutate`, so
 * each one is ONE undo step. Every operation returns the document unchanged
 * (same reference) when it does not apply, which `mutate` records as no edit.
 *
 *   - Draw on: `stroke-dasharray = [L]` (L = the outline length) and a
 *     `strokeDashoffset` track from L at `start` to 0 at `end`. Works on any
 *     outline shape (path, line, polyline, polygon, rect, ellipse). A layer
 *     with no stroke gets one (current colour, 2 px) so the animation shows.
 *   - Motion path: a `motionPath` track 0 → 1 between `start` and `end`, on
 *     the path of a guide layer (`pathId`) or inline data (`d`, parent
 *     space). The layer's anchor goes to its centre and `x/y` to `-anchor`,
 *     so its centre rides the path; the old offset is dropped.
 *   - Morph: a `d` track from the path's own data to the target's outline
 *     (mapped into the path's local space), both NORMALISED to one command
 *     sequence (`normalizeMorphSet`); the static `d` becomes the normalised
 *     first key, so the frame-0 render is unchanged. Extra keys may be added
 *     later; `renormalizeMorphTrack` keeps the set compatible.
 *   - Gradient: `gradientStop[i].color` tracks for every stop of the layer's
 *     fill (or stroke) gradient, keyed at the playhead with their current
 *     colour (a gradient is created first when the layer has none).
 *   - Mask / clip: content layers are ordinary layers; the animator keys
 *     `opacity` (mask) or `transform.x` (clip) of the FIRST content layer at
 *     the playhead, so its track appears in the timeline like any other.
 *   - Blur: a blur filter (`defs.filters`, created when missing) and a
 *     `filter.blur` track from 0 to `amount`.
 */
import {
  findDocLayer,
  layerOutline,
  layerOutlineLength,
  layerScope,
  localToParentOf,
  mapPathData,
  stopProperty,
  trackGradient,
} from '@/lib/vector/advanced';
import { invert, multiply, resolveTransform, transformToMatrix, canonicalTransform, layerLocalBounds } from '@/lib/vector/geometry';
import { clampTime, findTrack, removeTrack, upsertKeyframe } from '@/lib/vector/keyframes';
import { docIds, findLayer, nextId, updateLayer } from '@/lib/vector/layerTree';
import { normalizeMorphSet } from '@/lib/vector/morph';
import { roundNum } from '@/lib/vector/num';
import { applyGradient } from '@/lib/vector/paintOps';
import { paintRef, type Easing, type Keyframe, type Layer, type Track, type VectorDoc } from '@/lib/vector/vectorTypes';

/** The animator panel's buttons; also the `onAnimatorUsed` seam's argument (MM49: `vector_animator_used`). */
export const ANIMATOR_IDS = ['drawOn', 'motionPath', 'morph', 'gradient', 'maskClip', 'blur'] as const;
export type AnimatorId = (typeof ANIMATOR_IDS)[number];

export interface AnimatorSpan {
  /** ms */
  start: number;
  /** ms */
  end: number;
  easing?: Easing;
}

/** Default span: the playhead to the end (or the whole composition when the playhead is at the end). */
export function defaultSpan(doc: VectorDoc, time: number): AnimatorSpan {
  const start = clampTime(time, doc.duration);
  return start < doc.duration ? { start, end: doc.duration } : { start: 0, end: doc.duration };
}

function setTrack(doc: VectorDoc, track: Track): VectorDoc {
  const others = doc.animations.filter((tr) => !(tr.layerId === track.layerId && tr.property === track.property));
  return { ...doc, animations: [...others, track] };
}

/** Keys for `from` at `start` (held from 0 when start > 0) easing to `to` at `end`. */
function spanKeys(sp: { start: number; end: number }, from: number | string, to: number | string, easing: Easing): Keyframe[] {
  const keys: Keyframe[] = [];
  if (sp.start > 0) keys.push({ t: 0, value: from, easing: 'hold' });
  keys.push({ t: sp.start, value: from, easing }, { t: sp.end, value: to, easing: 'linear' });
  return keys;
}

function span(doc: VectorDoc, s: AnimatorSpan): { start: number; end: number } | null {
  const start = clampTime(s.start, doc.duration);
  const end = clampTime(s.end, doc.duration);
  return end > start ? { start, end } : null;
}

const editable = (l: Layer | undefined): l is Exclude<Layer, { type: 'raw' }> => !!l && l.type !== 'raw';

// ---------------------------------------------------------------------------
// draw on
// ---------------------------------------------------------------------------

/** Whether Draw on applies (an outline with length). */
export const canDrawOn = (doc: VectorDoc, id: string) => {
  const l = findDocLayer(doc, id);
  return editable(l) && layerOutlineLength(l) > 0;
};

/**
 * Draw on. `length` is the measured length when the editor has one
 * (`getTotalLength()`), else the pure fallback `layerOutlineLength`.
 */
export function applyDrawOn(doc: VectorDoc, id: string, s: AnimatorSpan, length?: number): VectorDoc {
  const layer = findDocLayer(doc, id);
  const sp = span(doc, s);
  if (!editable(layer) || !sp) return doc;
  const L = roundNum(length && length > 0 ? length : layerOutlineLength(layer));
  if (L <= 0) return doc;
  const patch = (l: Layer): Layer => {
    if (l.type === 'raw') return l;
    const next = { ...l, strokeDasharray: [L], strokeDashoffset: L };
    if (!l.stroke || l.stroke === 'none') Object.assign(next, { stroke: 'currentColor', strokeWidth: l.strokeWidth ?? 2 });
    return next;
  };
  const out = mapAnyLayer(doc, id, patch);
  return setTrack(out, {
    layerId: id,
    property: 'strokeDashoffset',
    keyframes: spanKeys(sp, L, 0, s.easing ?? 'easeOut'),
  });
}

// ---------------------------------------------------------------------------
// motion path
// ---------------------------------------------------------------------------

/** Layers that can guide a motion path for `id`: tree layers with an outline, not `id` itself or its ancestors / descendants. */
export function motionGuides(doc: VectorDoc, id: string): Layer[] {
  const out: Layer[] = [];
  const self = findLayer(doc.layers, id);
  if (!self) return out;
  const walk = (ls: Layer[]) => {
    for (const l of ls) {
      if (l.id !== id && layerOutline(l) && !(self.type === 'group' && findLayer(self.children, l.id))) out.push(l);
      if (l.type === 'group' && l.id !== id) walk(l.children);
    }
  };
  walk(doc.layers);
  return out.filter((g) => !(g.type === 'group'));
}

export interface MotionPathOptions {
  pathId?: string;
  /** Inline path data in the layer's parent space (used when `pathId` is absent). */
  d?: string;
  autoOrient?: boolean;
}

export function applyMotionPath(doc: VectorDoc, id: string, s: AnimatorSpan, opts: MotionPathOptions): VectorDoc {
  const layer = findLayer(doc.layers, id);
  const sp = span(doc, s);
  if (!editable(layer) || !sp) return doc;
  let extras: Record<string, unknown>;
  if (opts.pathId) {
    const guide = findLayer(doc.layers, opts.pathId);
    if (!guide || opts.pathId === id || !layerOutline(guide) || !localToParentOf(doc, opts.pathId, id)) return doc;
    extras = { pathId: opts.pathId, autoOrient: opts.autoOrient === true };
  } else if (opts.d) {
    const d = mapPathData(opts.d, [1, 0, 0, 1, 0, 0]);
    if (!d) return doc;
    extras = { d, autoOrient: opts.autoOrient === true };
  } else return doc;
  // Centre rides the path: anchor = centre, x/y = -anchor (identity offset).
  const box = layerLocalBounds(layer, { symbols: doc.defs.symbols, findLayer: (x) => findLayer(doc.layers, x) });
  const tf = resolveTransform(layer.transform);
  const ax = box ? roundNum(box.x + box.width / 2) : tf.anchorX;
  const ay = box ? roundNum(box.y + box.height / 2) : tf.anchorY;
  const transform = canonicalTransform({ ...tf, anchorX: ax, anchorY: ay, x: -ax, y: -ay });
  let out: VectorDoc = { ...doc, layers: updateLayer(doc.layers, id, (l) => (l.type === 'raw' ? l : ({ ...l, transform } as Layer))) };
  // The path now positions the layer: x/y tracks would fight it.
  out = removeTrack(removeTrack(out, id, 'transform.x'), id, 'transform.y');
  return setTrack(out, {
    layerId: id,
    property: 'motionPath',
    keyframes: spanKeys(sp, 0, 1, s.easing ?? 'easeBoth'),
    extras,
  });
}

/** Toggle `autoOrient` on an existing motion track. */
export function setMotionAutoOrient(doc: VectorDoc, id: string, on: boolean): VectorDoc {
  const tr = findTrack(doc, id, 'motionPath');
  if (!tr || (tr.extras?.autoOrient === true) === on) return doc;
  return setTrack(doc, { ...tr, extras: { ...tr.extras, autoOrient: on } });
}

// ---------------------------------------------------------------------------
// morph
// ---------------------------------------------------------------------------

/** Morph targets for path `id`: other tree layers with an outline. */
export function morphTargets(doc: VectorDoc, id: string): Layer[] {
  const out: Layer[] = [];
  const walk = (ls: Layer[]) => {
    for (const l of ls) {
      if (l.id !== id && l.type !== 'group' && layerOutline(l)) out.push(l);
      if (l.type === 'group') walk(l.children);
    }
  };
  walk(doc.layers);
  return out;
}

export type MorphResult = { ok: true; doc: VectorDoc } | { ok: false; reason: 'not_path' | 'no_target' | 'unparsable' };

/**
 * Morph path `id` into the outline of `targetId` over the span. The target's
 * outline is mapped into the path's local space, both keys are normalised,
 * and the static `d` becomes the normalised first key.
 */
export function applyMorph(doc: VectorDoc, id: string, targetId: string, s: AnimatorSpan): MorphResult {
  const layer = findLayer(doc.layers, id);
  const target = findLayer(doc.layers, targetId);
  const sp = span(doc, s);
  if (!layer || layer.type !== 'path') return { ok: false, reason: 'not_path' };
  if (!target || targetId === id || !sp) return { ok: false, reason: 'no_target' };
  const outline = layerOutline(target);
  const fromTarget = localToParentOf(doc, targetId, id);
  if (!outline || !fromTarget) return { ok: false, reason: 'no_target' };
  // target local → path parent → path local.
  const toLocal = multiply(invert(transformToMatrix(layer.transform)), fromTarget);
  const targetD = mapPathData(outline, toLocal);
  if (!targetD) return { ok: false, reason: 'unparsable' };
  const norm = normalizeMorphSet([layer.d, targetD]);
  if (!norm.ok) return { ok: false, reason: 'unparsable' };
  const [from, to] = norm.paths;
  const out: VectorDoc = { ...doc, layers: updateLayer(doc.layers, id, (l) => (l.type === 'path' ? { ...l, d: from } : l)) };
  return {
    ok: true,
    doc: setTrack(out, {
      layerId: id,
      property: 'd',
      keyframes: spanKeys(sp, from, to, s.easing ?? 'easeBoth'),
    }),
  };
}

/**
 * Re-normalise every key of a `d` track (after a key was added or edited
 * with a path of a different shape), so all keys morph again.
 */
export function renormalizeMorphTrack(doc: VectorDoc, id: string): VectorDoc {
  const tr = findTrack(doc, id, 'd');
  if (!tr || tr.keyframes.some((k) => typeof k.value !== 'string')) return doc;
  const norm = normalizeMorphSet(tr.keyframes.map((k) => k.value as string));
  if (!norm.ok || norm.paths.every((p, i) => p === tr.keyframes[i].value)) return doc;
  return setTrack(doc, { ...tr, keyframes: tr.keyframes.map((k, i) => ({ ...k, value: norm.paths[i] })) });
}

// ---------------------------------------------------------------------------
// gradient stops
// ---------------------------------------------------------------------------

export function applyGradientStops(doc: VectorDoc, id: string, time: number): VectorDoc {
  let layer = findDocLayer(doc, id);
  if (!editable(layer) || layer.type === 'group') return doc;
  let out = doc;
  const key = paintRef(layer.fill) ? 'fill' : paintRef(layer.stroke) ? 'stroke' : layer.type === 'line' ? 'stroke' : 'fill';
  if (!paintRef(layer[key]) && layerScope(doc, id) === 'tree') {
    out = applyGradient(out, id, key, 'linear');
    layer = findDocLayer(out, id);
    if (!editable(layer)) return doc;
  }
  const g = trackGradient(out, { layerId: id, extras: undefined });
  if (!g) return doc;
  const t = clampTime(time, doc.duration);
  g.stops.forEach((stop, i) => {
    const property = stopProperty(i, 'color');
    if (!findTrack(out, id, property)) out = upsertKeyframe(out, id, property, t, stop.color);
  });
  return out;
}

// ---------------------------------------------------------------------------
// mask / clip
// ---------------------------------------------------------------------------

/** The first content layer of the mask or clip path a layer uses. */
export function maskContentLayer(doc: VectorDoc, id: string): { layer: Layer; kind: 'mask' | 'clip' } | null {
  const layer = findLayer(doc.layers, id);
  if (!editable(layer)) return null;
  const m = layer.mask ? doc.defs.masks.find((x) => x.id === layer.mask) : undefined;
  if (m?.layers[0] && m.layers[0].type !== 'raw') return { layer: m.layers[0], kind: 'mask' };
  const c = layer.clipPath ? doc.defs.clipPaths.find((x) => x.id === layer.clipPath) : undefined;
  if (c?.layers[0] && c.layers[0].type !== 'raw') return { layer: c.layers[0], kind: 'clip' };
  return null;
}

export function applyMaskClip(doc: VectorDoc, id: string, time: number): { doc: VectorDoc; contentId: string | null } {
  const hit = maskContentLayer(doc, id);
  if (!hit || hit.layer.type === 'raw') return { doc, contentId: null };
  const t = clampTime(time, doc.duration);
  const property = hit.kind === 'mask' ? 'opacity' : 'transform.x';
  if (findTrack(doc, hit.layer.id, property)) return { doc, contentId: hit.layer.id };
  const value = hit.kind === 'mask' ? (hit.layer.opacity ?? 1) : resolveTransform(hit.layer.transform).x;
  return { doc: upsertKeyframe(doc, hit.layer.id, property, t, value), contentId: hit.layer.id };
}

// ---------------------------------------------------------------------------
// blur
// ---------------------------------------------------------------------------

/** Default blur amount (stdDeviation, user units). */
export const DEFAULT_BLUR = 6;

export function applyBlur(doc: VectorDoc, id: string, s: AnimatorSpan, amount = DEFAULT_BLUR): VectorDoc {
  const layer = findDocLayer(doc, id);
  const sp = span(doc, s);
  if (!editable(layer) || !sp) return doc;
  let out = doc;
  let filterId = layer.filter && doc.defs.filters.some((f) => f.id === layer.filter && f.type === 'blur') ? layer.filter : undefined;
  if (!filterId) {
    // Raw-layer filters and missing refs are replaced by a fresh blur.
    filterId = nextId(docIds(doc), 'blur');
    const fid = filterId;
    out = {
      ...out,
      defs: { ...out.defs, filters: [...out.defs.filters, { type: 'blur', id: fid, stdDeviation: 0, x: '-50%', y: '-50%', width: '200%', height: '200%' }] },
    };
    out = mapAnyLayer(out, id, (l) => (l.type === 'raw' ? l : ({ ...l, filter: fid } as Layer)));
  }
  return setTrack(out, {
    layerId: id,
    property: 'filter.blur',
    keyframes: spanKeys(sp, 0, roundNum(Math.max(0, amount)), s.easing ?? 'easeOut'),
  });
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

/** Update a layer wherever it lives (tree, mask, clip path, symbol). */
export function mapAnyLayer(doc: VectorDoc, id: string, fn: (l: Layer) => Layer): VectorDoc {
  if (findLayer(doc.layers, id)) return { ...doc, layers: updateLayer(doc.layers, id, fn) };
  const inDefs = <T extends { layers: Layer[] }>(items: T[]) =>
    items.map((it) => (findLayer(it.layers, id) ? { ...it, layers: updateLayer(it.layers, id, fn) } : it));
  return { ...doc, defs: { ...doc.defs, masks: inDefs(doc.defs.masks), clipPaths: inDefs(doc.defs.clipPaths), symbols: inDefs(doc.defs.symbols) } };
}
