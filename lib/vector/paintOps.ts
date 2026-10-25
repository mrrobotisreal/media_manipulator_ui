/**
 * Pure gradient and mask / clip-path operations (MM42 S8). Gradients live in
 * `defs.gradients` and are referenced by `fill`/`stroke = url(#id)`; masks
 * and clip paths live in `defs.masks` / `defs.clipPaths` and are referenced
 * by a layer's `mask` / `clipPath` id. Animated stops and masks are MM45.
 */
import { roundNum } from '@/lib/vector/num';
import { decomposeMatrix, multiply, transformToMatrix, canonicalTransform } from '@/lib/vector/geometry';
import { docIds, findLayer, locateLayer, nextId, parentToDocMatrix, removeLayers, updateLayer } from '@/lib/vector/layerTree';
import {
  forEachLayer,
  paintRef,
  type Gradient,
  type GradientStop,
  type Layer,
  type LinearGradient,
  type RadialGradient,
  type VectorDoc,
} from '@/lib/vector/vectorTypes';

export type PaintKey = 'fill' | 'stroke';

/** The gradient a layer's paint references, if any. */
export function paintGradient(doc: VectorDoc, paint: string | undefined): Gradient | undefined {
  const ref = paintRef(paint);
  return ref ? doc.defs.gradients.find((g) => g.id === ref) : undefined;
}

/** Plain colour behind a paint (the fallback after `url(...)`, or the paint itself). */
export function solidOf(paint: string | undefined): string | undefined {
  if (!paint) return undefined;
  const ref = paintRef(paint);
  if (!ref) return paint;
  const m = /\)\s+(\S+)$/.exec(paint.trim());
  return m?.[1];
}

/** Linear gradient angle in degrees (bbox units: 0 = left→right, 90 = top→bottom). */
export function linearAngle(g: LinearGradient): number {
  return roundNum((Math.atan2(g.y2 - g.y1, g.x2 - g.x1) * 180) / Math.PI);
}

/** Endpoints for an angle, centred in the unit box. */
export function linearEndpoints(angle: number): Pick<LinearGradient, 'x1' | 'y1' | 'x2' | 'y2'> {
  const r = (angle * Math.PI) / 180;
  const dx = Math.cos(r) / 2;
  const dy = Math.sin(r) / 2;
  return { x1: roundNum(0.5 - dx), y1: roundNum(0.5 - dy), x2: roundNum(0.5 + dx), y2: roundNum(0.5 + dy) };
}

function updateGradient(doc: VectorDoc, id: string, fn: (g: Gradient) => Gradient): VectorDoc {
  let changed = false;
  const gradients = doc.defs.gradients.map((g) => {
    if (g.id !== id) return g;
    const next = fn(g);
    if (next !== g) changed = true;
    return next;
  });
  return changed ? { ...doc, defs: { ...doc.defs, gradients } } : doc;
}

function sortStops(stops: GradientStop[]): GradientStop[] {
  return [...stops].sort((a, b) => a.offset - b.offset);
}

/** Give the layer's paint a new gradient (seeded from its current solid colour). */
export function applyGradient(doc: VectorDoc, layerId: string, key: PaintKey, type: 'linear' | 'radial'): VectorDoc {
  const layer = findLayer(doc.layers, layerId);
  if (!layer || layer.type === 'raw') return doc;
  const current = paintGradient(doc, layer[key]);
  if (current && current.type === type) return doc;
  const base = solidOf(layer[key]);
  const from = base && base !== 'none' && base !== 'transparent' ? base : '#3b82f6';
  const stops: GradientStop[] = current?.stops.length ? current.stops : [
    { offset: 0, color: from },
    { offset: 1, color: '#0a0b0d' },
  ];
  const id = current?.id ?? nextId(docIds(doc), 'gradient');
  const g: Gradient =
    type === 'linear'
      ? ({ type: 'linear', id, ...linearEndpoints(0), stops } satisfies LinearGradient)
      : ({ type: 'radial', id, cx: 0.5, cy: 0.5, r: 0.5, stops } satisfies RadialGradient);
  const gradients = current ? doc.defs.gradients.map((x) => (x.id === id ? g : x)) : [...doc.defs.gradients, g];
  const layers = updateLayer(doc.layers, layerId, (l) => (l.type === 'raw' ? l : ({ ...l, [key]: `url(#${id})` } as Layer)));
  return { ...doc, layers, defs: { ...doc.defs, gradients } };
}

/** Back to a solid paint; drops the gradient when nothing else uses it. */
export function applySolid(doc: VectorDoc, layerId: string, key: PaintKey, color: string): VectorDoc {
  const layer = findLayer(doc.layers, layerId);
  if (!layer || layer.type === 'raw') return doc;
  const old = paintRef(layer[key]);
  const layers = updateLayer(doc.layers, layerId, (l) => (l.type === 'raw' ? l : ({ ...l, [key]: color } as Layer)));
  const next = { ...doc, layers };
  return old ? dropUnusedGradient(next, old) : next;
}

export function dropUnusedGradient(doc: VectorDoc, id: string): VectorDoc {
  let used = false;
  forEachLayer(doc, (l) => {
    if (l.type === 'raw') {
      if (l.markup.includes(`#${id}`)) used = true;
      return;
    }
    if (paintRef(l.fill) === id || paintRef(l.stroke) === id) used = true;
  });
  if (used) return doc;
  return { ...doc, defs: { ...doc.defs, gradients: doc.defs.gradients.filter((g) => g.id !== id) } };
}

export function setGradientAngle(doc: VectorDoc, id: string, angle: number): VectorDoc {
  return updateGradient(doc, id, (g) => (g.type === 'linear' ? { ...g, ...linearEndpoints(angle) } : g));
}

export function setRadial(doc: VectorDoc, id: string, patch: Partial<Pick<RadialGradient, 'cx' | 'cy' | 'r'>>): VectorDoc {
  return updateGradient(doc, id, (g) => (g.type === 'radial' ? { ...g, ...patch } : g));
}

export function setStop(doc: VectorDoc, id: string, index: number, patch: Partial<GradientStop>): VectorDoc {
  return updateGradient(doc, id, (g) => {
    if (!g.stops[index]) return g;
    const stops = g.stops.map((s, i) => (i === index ? { ...s, ...patch, ...(patch.offset !== undefined ? { offset: roundNum(Math.min(1, Math.max(0, patch.offset))) } : {}) } : s));
    return { ...g, stops: sortStops(stops) };
  });
}

/** Add a stop at `offset`, coloured like its left neighbour. */
export function addStop(doc: VectorDoc, id: string, offset: number): VectorDoc {
  return updateGradient(doc, id, (g) => {
    const o = roundNum(Math.min(1, Math.max(0, offset)));
    const left = [...g.stops].reverse().find((s) => s.offset <= o) ?? g.stops[0];
    const stop: GradientStop = { offset: o, color: left?.color ?? '#ffffff' };
    return { ...g, stops: sortStops([...g.stops, stop]) };
  });
}

export function removeStop(doc: VectorDoc, id: string, index: number): VectorDoc {
  return updateGradient(doc, id, (g) => (g.stops.length <= 2 ? g : { ...g, stops: g.stops.filter((_, i) => i !== index) }));
}

// ---------------------------------------------------------------------------
// masks and clip paths
// ---------------------------------------------------------------------------

export type MaskKind = 'mask' | 'clip';

/**
 * Turn `sourceId` into the mask (or clip path) of `targetId`: the source
 * layer leaves the tree, moves into a new `defs.masks` / `defs.clipPaths`
 * entry in the TARGET's local space (so it stays where it was on canvas), and
 * the target references it. Clip paths cannot hold groups, so a group source
 * cannot become a clip.
 */
export function makeMask(doc: VectorDoc, sourceId: string, targetId: string, kind: MaskKind): VectorDoc {
  if (sourceId === targetId) return doc;
  const source = findLayer(doc.layers, sourceId);
  const target = findLayer(doc.layers, targetId);
  if (!source || !target || source.type === 'raw' || target.type === 'raw') return doc;
  if (kind === 'clip' && source.type === 'group') return doc;
  if (target.type === 'group' && findLayer(target.children, sourceId)) return doc;
  // Mask content is in the target's user space (the space its transform maps from).
  const targetLocal = multiply(parentToDocMatrix(doc.layers, targetId), transformToMatrix(target.transform));
  const sourceToDoc = multiply(parentToDocMatrix(doc.layers, sourceId), transformToMatrix(source.transform));
  const inv = invertSafe(targetLocal);
  const rel = multiply(inv, sourceToDoc);
  const moved = { ...source, transform: canonicalTransform(decomposeMatrix(rel)) } as Layer;
  if (moved.type !== 'raw' && !moved.transform) delete (moved as { transform?: unknown }).transform;
  // A mask uses luminance: un-hide and keep the source's own style.
  const taken = docIds(doc);
  const id = nextId(taken, kind === 'mask' ? 'mask' : 'clip');
  let layers = removeLayers(doc.layers, new Set([sourceId]));
  layers = updateLayer(layers, targetId, (l) => (l.type === 'raw' ? l : ({ ...l, [kind === 'mask' ? 'mask' : 'clipPath']: id } as Layer)));
  const defs =
    kind === 'mask'
      ? { ...doc.defs, masks: [...doc.defs.masks, { id, contentUnits: undefined, layers: [moved] }].map(stripUndefined) }
      : { ...doc.defs, clipPaths: [...doc.defs.clipPaths, { id, layers: [moved] }] };
  return { ...doc, layers, defs: defs as VectorDoc['defs'] };
}

/** Remove a layer's mask / clip and put its content back into the tree above the layer. */
export function releaseMask(doc: VectorDoc, targetId: string, kind: MaskKind): VectorDoc {
  const target = findLayer(doc.layers, targetId);
  if (!target || target.type === 'raw') return doc;
  const refKey = kind === 'mask' ? 'mask' : 'clipPath';
  const ref = target[refKey];
  if (!ref) return doc;
  const list = kind === 'mask' ? doc.defs.masks : doc.defs.clipPaths;
  const def = list.find((m) => m.id === ref);
  const loc = locateLayer(doc.layers, targetId);
  let layers = updateLayer(doc.layers, targetId, (l) => {
    const next = { ...l } as Record<string, unknown>;
    delete next[refKey];
    return next as unknown as Layer;
  });
  let defs = doc.defs;
  // Only release content no other layer still references.
  let stillUsed = false;
  forEachLayer({ layers, defs }, (l) => {
    if (l.type !== 'raw' && l[refKey] === ref) stillUsed = true;
  });
  if (def && !stillUsed && loc) {
    const tm = transformToMatrix(target.transform);
    const restored = def.layers.map((l) =>
      l.type === 'raw' ? l : ({ ...l, transform: canonicalTransform(decomposeMatrix(multiply(tm, transformToMatrix(l.transform)))) } as Layer),
    );
    for (const l of restored) if (l.type !== 'raw' && !l.transform) delete (l as { transform?: unknown }).transform;
    defs =
      kind === 'mask'
        ? { ...defs, masks: defs.masks.filter((m) => m.id !== ref) }
        : { ...defs, clipPaths: defs.clipPaths.filter((m) => m.id !== ref) };
    const parentList = loc.parentId === null ? layers : (findLayer(layers, loc.parentId) as Extract<Layer, { type: 'group' }>).children;
    const at = parentList.findIndex((l) => l.id === targetId) + 1;
    layers =
      loc.parentId === null
        ? [...layers.slice(0, at), ...restored, ...layers.slice(at)]
        : updateLayer(layers, loc.parentId, (g) => (g.type === 'group' ? { ...g, children: [...g.children.slice(0, at), ...restored, ...g.children.slice(at)] } : g));
  }
  return { ...doc, layers, defs };
}

function invertSafe(m: readonly [number, number, number, number, number, number]) {
  const [a, b, c, d, e, f] = m;
  const det = a * d - b * c;
  if (!det) return [1, 0, 0, 1, 0, 0] as const;
  return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det] as const;
}

function stripUndefined<T extends object>(o: T): T {
  const out = { ...o } as Record<string, unknown>;
  for (const k of Object.keys(out)) if (out[k] === undefined) delete out[k];
  return out as T;
}
