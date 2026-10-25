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
 */
import { resolveTransform } from '@/lib/vector/geometry';
import { findTrack, pruneTracks, upsertKeyframe } from '@/lib/vector/keyframes';
import {
  EDITABLE_PROPERTIES,
  baseValue,
  isTransformProperty,
  transformField,
  type AnimatableLayer,
  type EditableProperty,
} from '@/lib/vector/properties';
import { forEachLayer, type Layer, type VectorDoc, type VectorTransform } from '@/lib/vector/vectorTypes';

const sameValue = (a: number | string, b: number | string) => a === b;

function layerMap(doc: VectorDoc): Map<string, Layer> {
  const m = new Map<string, Layer>();
  forEachLayer(doc, (l) => m.set(l.id, l));
  return m;
}

/** Copy property `p` of `from` (the base layer) onto `to`, keeping "unset" unset. */
function restoreProp(to: AnimatableLayer, from: AnimatableLayer, p: EditableProperty): AnimatableLayer {
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

  const fold = (layers: Layer[]): Layer[] =>
    layers.map((l) => {
      let next: Layer = l.type === 'group' ? { ...l, children: fold(l.children) } : l;
      const b = baseLayers.get(l.id);
      const s = sampledLayers.get(l.id);
      if (!b || !s || b.type !== l.type || next.type === 'raw' || b.type === 'raw' || s.type === 'raw') return next;
      for (const p of EDITABLE_PROPERTIES) {
        const after = baseValue(next as AnimatableLayer, p);
        const before = baseValue(s as AnimatableLayer, p);
        const changed = !sameValue(after, before);
        if (keyed(l.id, p)) {
          if (changed) animations = upsertKeyframe(animations, l.id, p, t, after);
          next = restoreProp(next as AnimatableLayer, b as AnimatableLayer, p);
        } else if (autokey && changed) {
          animations = upsertKeyframe(animations, l.id, p, t, after);
          next = restoreProp(next as AnimatableLayer, b as AnimatableLayer, p);
        }
      }
      // An identity transform the restore produced on a layer that had none.
      if (b.transform === undefined && next.transform !== undefined && sameTransform(next.transform, undefined)) {
        const { transform: _drop, ...rest } = next;
        void _drop;
        next = rest as Layer;
      }
      return sameLayer(next, b) ? b : next;
    });

  const layers = fold(edited.layers);
  const mapDefs = <T extends { layers: Layer[] }>(items: T[], baseItems: T[]): T[] =>
    items.map((it, i) => {
      const ls = fold(it.layers);
      const bi = baseItems[i];
      const same = bi && ls.length === bi.layers.length && ls.every((l, j) => l === bi.layers[j]);
      return same && sameDefShell(it, bi) ? bi : { ...it, layers: ls };
    });
  const defs = {
    ...edited.defs,
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
