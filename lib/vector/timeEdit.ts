/**
 * Time-aware edits (ticket MM44 decision 4: autokey, keyed inspector state).
 *
 * The canvas and inspector show the document AT THE PLAYHEAD
 * (`sampleDoc(doc, t)`), so a drag or a field edit produces an edited copy of
 * that sampled document. `applyAtTime` folds it back into the stored (base)
 * document:
 *
 *   - an animated property (the layer has a track for it) that changed gets a
 *     keyframe at t with the new value; the base value stays as it was;
 *   - with autokey on, a changed un-animated editable property starts a track
 *     with one keyframe at t;
 *   - every other change (geometry, un-animated properties with autokey off,
 *     new layers, structure) is a plain static edit of the base document.
 *
 * Nothing changed → the base document itself is returned (same reference), so
 * `mutate` records no history entry. With no tracks and autokey off this is
 * exactly MM42's behaviour: the edited document IS the result.
 *
 * MM45 (`lib/vector/advanced.ts`):
 *   - `strokeDashoffset` and `d` fold like the MM44 layer properties (autokey
 *     never starts them; the animator panel does);
 *   - the sampled transform of a layer on a motion path includes the path
 *     offset, so it is taken off (`withoutMotion`) before folding: a drag of
 *     a moving layer shifts its own offset from the path;
 *   - an animated gradient stop field or blur `stdDeviation` edited in the
 *     sampled defs gets a keyframe on its track; the static value stays.
 */
import { motionExtras, motionPathData, motionPointAt, parseStopProperty, trackBlurFilter, trackGradient, withoutMotion } from '@/lib/vector/advanced';
import { renormalizeMorphTrack } from '@/lib/vector/animators';
import { resolveTransform } from '@/lib/vector/geometry';
import { findTrack, pruneTracks, upsertKeyframe } from '@/lib/vector/keyframes';
import {
  EDITABLE_PROPERTIES,
  SAMPLED_LAYER_PROPERTIES,
  baseValue,
  isTransformProperty,
  transformField,
  type AnimatableLayer,
  type SampledLayerProperty,
} from '@/lib/vector/properties';
import { sampleTrack } from '@/lib/vector/sampleTrack';
import { forEachLayer, type Layer, type VectorDefs, type VectorDoc, type VectorTransform } from '@/lib/vector/vectorTypes';

const sameValue = (a: number | string, b: number | string) => a === b;

function layerMap(doc: VectorDoc): Map<string, Layer> {
  const m = new Map<string, Layer>();
  forEachLayer(doc, (l) => m.set(l.id, l));
  return m;
}

/** Copy property `p` of `from` (the base layer) onto `to`, keeping "unset" unset. */
function restoreProp(to: AnimatableLayer, from: AnimatableLayer, p: SampledLayerProperty): AnimatableLayer {
  if (isTransformProperty(p)) {
    const field = transformField(p);
    const src = resolveTransform(from.transform);
    const cur = resolveTransform(to.transform);
    if (cur[field] === src[field]) return to;
    return { ...to, transform: { ...cur, [field]: src[field] } };
  }
  const rec = from as unknown as Record<string, unknown>;
  if ((to as unknown as Record<string, unknown>)[p] === rec[p]) return to;
  const out = { ...to } as Record<string, unknown>;
  if (rec[p] === undefined) delete out[p];
  else out[p] = rec[p];
  return out as unknown as AnimatableLayer;
}

const TRANSFORM_KEYS: Array<keyof VectorTransform> = ['x', 'y', 'scaleX', 'scaleY', 'rotation', 'skewX', 'skewY', 'anchorX', 'anchorY'];

function sameTransform(a: VectorTransform | undefined, b: VectorTransform | undefined): boolean {
  if (a === b) return true;
  const ra = resolveTransform(a);
  const rb = resolveTransform(b);
  return TRANSFORM_KEYS.every((k) => ra[k] === rb[k]);
}

/** Shallow structural equality, `transform` by value, `children` by element identity. */
function sameLayer(a: Layer, b: Layer): boolean {
  if (a === b) return true;
  const ka = Object.keys(a).filter((k) => (a as unknown as Record<string, unknown>)[k] !== undefined);
  const kb = Object.keys(b).filter((k) => (b as unknown as Record<string, unknown>)[k] !== undefined);
  const keys = new Set([...ka, ...kb]);
  for (const k of keys) {
    const va = (a as unknown as Record<string, unknown>)[k];
    const vb = (b as unknown as Record<string, unknown>)[k];
    if (k === 'transform') {
      if (!sameTransform(va as VectorTransform | undefined, vb as VectorTransform | undefined)) return false;
      // An explicit identity transform vs none is a real (canonical-form) difference only when both exist.
      if ((va === undefined) !== (vb === undefined)) return false;
      continue;
    }
    if (k === 'children') {
      const ca = va as Layer[];
      const cb = vb as Layer[];
      if (ca.length !== cb.length || ca.some((c, i) => c !== cb[i])) return false;
      continue;
    }
    if (va !== vb && JSON.stringify(va) !== JSON.stringify(vb)) return false;
  }
  return true;
}

/** `applyAtTime(base, sampled, edited, t, autokey)`; see the module comment. */
export function applyAtTime(base: VectorDoc, sampled: VectorDoc, edited: VectorDoc, t: number, autokey: boolean): VectorDoc {
  if (edited === sampled) return base;
  if (base.animations.length === 0 && !autokey) return pruneTracks(edited);

  const baseLayers = layerMap(base);
  const sampledLayers = layerMap(sampled);
  let animations = base;
  const keyed = (id: string, p: string) => findTrack(base, id, p) !== undefined;
  const autokeyable = new Set<string>(EDITABLE_PROPERTIES);
  const motion = motionOffsets(base, t);
  /** Layers whose morph track got an edited key (re-normalised after the fold). */
  const morphed = new Set<string>();

  const fold = (layers: Layer[]): Layer[] =>
    layers.map((l) => {
      let next: Layer = l.type === 'group' ? { ...l, children: fold(l.children) } : l;
      const b = baseLayers.get(l.id);
      let s = sampledLayers.get(l.id);
      if (!b || !s || b.type !== l.type || next.type === 'raw' || b.type === 'raw' || s.type === 'raw') return next;
      const mo = motion.get(l.id);
      if (mo) {
        // Compare and fold in the layer's own frame (the path offset taken off).
        next = { ...next, transform: withoutMotion(next.transform, mo.point, mo.autoOrient) } as Layer;
        s = { ...s, transform: withoutMotion(s.transform, mo.point, mo.autoOrient) } as Layer;
      }
      for (const p of SAMPLED_LAYER_PROPERTIES) {
        const after = baseValue(next as AnimatableLayer, p);
        const before = baseValue(s as AnimatableLayer, p);
        const changed = !sameValue(after, before) && !(typeof after === 'number' && typeof before === 'number' && Math.abs(after - before) < 1e-9);
        if (keyed(l.id, p)) {
          if (changed) {
            animations = upsertKeyframe(animations, l.id, p, t, after);
            if (p === 'd') morphed.add(l.id);
          }
          next = restoreProp(next as AnimatableLayer, b as AnimatableLayer, p);
        } else if (mo && isTransformProperty(p) && !changed) {
          // Unchanged by the edit: keep the base value exactly (no float drift from the round trip).
          next = restoreProp(next as AnimatableLayer, b as AnimatableLayer, p);
        } else if (autokey && changed && autokeyable.has(p)) {
          animations = upsertKeyframe(animations, l.id, p, t, after);
          next = restoreProp(next as AnimatableLayer, b as AnimatableLayer, p);
        }
      }
      // An identity transform the restore produced on a layer that had none.
      const nl = next as AnimatableLayer;
      if (b.transform === undefined && nl.transform !== undefined && sameTransform(nl.transform, undefined)) {
        const { transform: _drop, ...rest } = nl;
        void _drop;
        next = rest as Layer;
      }
      return sameLayer(next, b) ? b : next;
    });

  const layers = fold(edited.layers);
  for (const id of morphed) animations = renormalizeMorphTrack(animations, id);
  const mapDefs = <T extends { layers: Layer[] }>(items: T[], baseItems: T[]): T[] =>
    items.map((it, i) => {
      const ls = fold(it.layers);
      const bi = baseItems[i];
      const same = bi && ls.length === bi.layers.length && ls.every((l, j) => l === bi.layers[j]);
      return same && sameDefShell(it, bi) ? bi : { ...it, layers: ls };
    });
  const folded = foldDefs(base, sampled, edited.defs, t, animations);
  animations = folded.doc;
  const defs = {
    ...folded.defs,
    masks: mapDefs(edited.defs.masks, base.defs.masks),
    clipPaths: mapDefs(edited.defs.clipPaths, base.defs.clipPaths),
    symbols: mapDefs(edited.defs.symbols, base.defs.symbols),
  };
  const out = pruneTracks({ ...edited, layers, defs, animations: animations.animations });
  return docUnchanged(out, base) ? base : out;
}

function sameDefShell<T extends { layers: Layer[] }>(a: T, b: T): boolean {
  const { layers: _a, ...ra } = a;
  const { layers: _b, ...rb } = b;
  void _a;
  void _b;
  return JSON.stringify(ra) === JSON.stringify(rb);
}

function docUnchanged(a: VectorDoc, b: VectorDoc): boolean {
  if (a.animations !== b.animations && JSON.stringify(a.animations) !== JSON.stringify(b.animations)) return false;
  if (a.layers.length !== b.layers.length || a.layers.some((l, i) => l !== b.layers[i])) return false;
  const d = (x: VectorDoc) => [x.defs.masks, x.defs.clipPaths, x.defs.symbols];
  const [am, ac, as] = d(a);
  const [bm, bc, bs] = d(b);
  const sameArr = <T>(p: T[], q: T[]) => p.length === q.length && p.every((v, i) => v === q[i]);
  if (!sameArr(am, bm) || !sameArr(ac, bc) || !sameArr(as, bs)) return false;
  if (a.defs.gradients !== b.defs.gradients || a.defs.filters !== b.defs.filters) return false;
  const { layers: _1, defs: _2, animations: _3, ...ra } = a;
  const { layers: _4, defs: _5, animations: _6, ...rb } = b;
  void [_1, _2, _3, _4, _5, _6];
  return JSON.stringify(ra) === JSON.stringify(rb);
}

/** Motion-path offset at t for every layer with a motion track (first track per layer). */
function motionOffsets(base: VectorDoc, t: number) {
  const out = new Map<string, { point: { x: number; y: number; angle: number }; autoOrient: boolean }>();
  for (const tr of base.animations) {
    if (tr.property !== 'motionPath' || tr.keyframes.length === 0 || out.has(tr.layerId)) continue;
    const d = motionPathData(base, tr);
    const v = sampleTrack(tr, Math.min(Math.max(0, t), base.duration));
    const point = d && typeof v === 'number' ? motionPointAt(d, v) : null;
    if (point) out.set(tr.layerId, { point, autoOrient: motionExtras(tr).autoOrient === true });
  }
  return out;
}

/**
 * Animated defs fields (gradient stop colour / offset, blur stdDeviation):
 * an edit of the sampled value becomes a keyframe at t on its track, and the
 * stored (static) value stays as in `base`.
 */
function foldDefs(base: VectorDoc, sampled: VectorDoc, editedDefs: VectorDefs, t: number, docIn: VectorDoc): { defs: VectorDefs; doc: VectorDoc } {
  let doc = docIn;
  let gradients = editedDefs.gradients;
  let filters = editedDefs.filters;
  const seen = new Set<string>();
  for (const tr of base.animations) {
    if (tr.keyframes.length === 0) continue;
    const stop = parseStopProperty(tr.property);
    if (stop) {
      const g = trackGradient(base, tr);
      if (!g) continue;
      const key = `${g.id}\u0000${tr.property}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const e = gradients.find((x) => x.id === g.id)?.stops[stop.index];
      const smp = sampled.defs.gradients.find((x) => x.id === g.id)?.stops[stop.index];
      const orig = g.stops[stop.index];
      if (!e || !smp || !orig) continue;
      const after = e[stop.field];
      if (after !== smp[stop.field]) doc = upsertKeyframe(doc, tr.layerId, tr.property, t, after);
      if (after !== orig[stop.field]) {
        gradients = gradients.map((x) =>
          x.id === g.id ? { ...x, stops: x.stops.map((st, i) => (i === stop.index ? { ...st, [stop.field]: orig[stop.field] } : st)) } : x,
        );
      }
      continue;
    }
    if (tr.property === 'filter.blur') {
      const id = trackBlurFilter(base, tr.layerId);
      if (!id || seen.has(`f\u0000${id}`)) continue;
      seen.add(`f\u0000${id}`);
      const e = filters.find((x) => x.id === id);
      const smp = sampled.defs.filters.find((x) => x.id === id);
      const orig = base.defs.filters.find((x) => x.id === id);
      if (!e || !smp || !orig) continue;
      if (e.stdDeviation !== smp.stdDeviation) doc = upsertKeyframe(doc, tr.layerId, tr.property, t, e.stdDeviation);
      if (e.stdDeviation !== orig.stdDeviation) filters = filters.map((x) => (x.id === id ? { ...x, stdDeviation: orig.stdDeviation } : x));
    }
  }
  const same = <T>(a: T[], b: T[]) => a.length === b.length && a.every((v, i) => v === b[i] || JSON.stringify(v) === JSON.stringify(b[i]));
  return {
    doc,
    defs: {
      ...editedDefs,
      gradients: same(gradients, base.defs.gradients) ? base.defs.gradients : gradients,
      filters: same(filters, base.defs.filters) ? base.defs.filters : filters,
    },
  };
}
