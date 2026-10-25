/**
 * Document-level transform operations used by the canvas, the keyboard and
 * the inspector. All pure `(doc, …) → doc`; deltas and pivots are in
 * DOCUMENT (canvas user-unit) space and are converted into each layer's
 * parent space here, so nested and rotated groups behave.
 *
 * Locked layers (or layers inside a locked group) are never transformed.
 */
import {
  apply,
  applyLinear,
  decomposeMatrix,
  invert,
  layerBoundsInParent,
  layerLocalBounds,
  multiply,
  resolveTransform,
  rotationM,
  scaleAboutLocalPoint,
  scaling,
  setAnchor,
  transformToMatrix,
  translateTransform,
  translation,
  unionBoxes,
  transformBox,
  canonicalTransform,
  rotateAboutAnchor,
  type Box,
  type Matrix,
  type Pt,
} from '@/lib/vector/geometry';
import { findLayer, locateLayer, orderedIds, parentToDocMatrix, updateLayer } from '@/lib/vector/layerTree';
import type { Layer, VectorDoc, VectorTransform } from '@/lib/vector/vectorTypes';

/** The layer or one of its ancestors is locked. */
export function isLocked(layers: Layer[], id: string): boolean {
  const loc = locateLayer(layers, id);
  if (!loc) return false;
  const self = findLayer(layers, id);
  if (self && self.type !== 'raw' && self.locked) return true;
  return loc.ancestors.some((a) => {
    const g = findLayer(layers, a);
    return g?.type === 'group' && g.locked === true;
  });
}

/** Selected ids that may be transformed: top-level of the selection, not locked, not raw. */
export function transformableIds(doc: VectorDoc, ids: Iterable<string>): string[] {
  return orderedIds(doc.layers, ids).filter((id) => {
    const l = findLayer(doc.layers, id);
    return l && l.type !== 'raw' && !isLocked(doc.layers, id);
  });
}

function boundsCtx(doc: VectorDoc) {
  return { symbols: doc.defs.symbols, findLayer: (id: string) => findLayer(doc.layers, id) };
}

/** Axis-aligned document-space bounds of a layer. */
export function layerDocBounds(doc: VectorDoc, id: string): Box | null {
  const layer = findLayer(doc.layers, id);
  if (!layer) return null;
  const b = layerBoundsInParent(layer, boundsCtx(doc));
  return b ? transformBox(b, parentToDocMatrix(doc.layers, id)) : null;
}

/** Union of the selection's document bounds. */
export function selectionBounds(doc: VectorDoc, ids: Iterable<string>): Box | null {
  return unionBoxes(orderedIds(doc.layers, ids).map((id) => layerDocBounds(doc, id)));
}

/** Local (pre-transform) bounds plus the local→doc matrix, for oriented handles. */
export function layerFrame(doc: VectorDoc, id: string): { box: Box; toDoc: Matrix } | null {
  const layer = findLayer(doc.layers, id);
  if (!layer || layer.type === 'raw') return null;
  const box = layerLocalBounds(layer, boundsCtx(doc));
  if (!box) return null;
  return { box, toDoc: multiply(parentToDocMatrix(doc.layers, id), transformToMatrix(layer.transform)) };
}

function withTransform(layer: Layer, t: VectorTransform | undefined): Layer {
  if (layer.type === 'raw') return layer;
  const next = { ...layer } as Exclude<Layer, { type: 'raw' }>;
  const c = canonicalTransform(t);
  if (c) next.transform = c;
  else delete next.transform;
  return next;
}

function mapIds(doc: VectorDoc, ids: string[], fn: (layer: Layer, parentToDoc: Matrix) => Layer): VectorDoc {
  let layers = doc.layers;
  for (const id of ids) {
    const p2d = parentToDocMatrix(layers, id);
    layers = updateLayer(layers, id, (l) => fn(l, p2d));
  }
  return layers === doc.layers ? doc : { ...doc, layers };
}

/** Move the layers by a document-space delta. */
export function translateLayers(doc: VectorDoc, ids: Iterable<string>, dx: number, dy: number): VectorDoc {
  if (dx === 0 && dy === 0) return doc;
  return mapIds(doc, transformableIds(doc, ids), (layer, p2d) => {
    if (layer.type === 'raw') return layer;
    const d = applyLinear(invert(p2d), { x: dx, y: dy });
    return withTransform(layer, translateTransform(layer.transform, d.x, d.y));
  });
}

/**
 * Single-layer handle scale: multiply scaleX/scaleY (local axes) keeping the
 * local point `fixed` where it is. Rotation is untouched.
 */
export function scaleLayerLocal(doc: VectorDoc, id: string, fx: number, fy: number, fixed: Pt): VectorDoc {
  if (!transformableIds(doc, [id]).includes(id)) return doc;
  return mapIds(doc, [id], (layer) =>
    layer.type === 'raw' ? layer : withTransform(layer, scaleAboutLocalPoint(layer.transform, fx, fy, fixed)),
  );
}

/** Re-express `full` (layer → parent) keeping the layer's anchor, so the pivot survives decomposition. */
function fromMatrixKeepingAnchor(full: Matrix, previous: VectorTransform | undefined): VectorTransform {
  const r = resolveTransform(previous);
  return setAnchor(decomposeMatrix(full), { x: r.anchorX, y: r.anchorY });
}

/** Multi-selection scale along DOCUMENT axes about a document-space point. */
export function scaleLayersDoc(doc: VectorDoc, ids: Iterable<string>, fx: number, fy: number, pivot: Pt): VectorDoc {
  const s = multiply(translation(pivot.x, pivot.y), multiply(scaling(fx, fy), translation(-pivot.x, -pivot.y)));
  return mapIds(doc, transformableIds(doc, ids), (layer, p2d) => {
    if (layer.type === 'raw') return layer;
    const full = multiply(invert(p2d), multiply(s, multiply(p2d, transformToMatrix(layer.transform))));
    return withTransform(layer, fromMatrixKeepingAnchor(full, layer.transform));
  });
}

/** Anchor at the layer's local bounds centre when it has none yet (so rotation pivots sensibly). */
export function ensureAnchor(doc: VectorDoc, id: string): VectorDoc {
  const layer = findLayer(doc.layers, id);
  if (!layer || layer.type === 'raw') return doc;
  const r = resolveTransform(layer.transform);
  if (r.anchorX !== 0 || r.anchorY !== 0) return doc;
  const box = layerLocalBounds(layer, boundsCtx(doc));
  if (!box) return doc;
  return mapIds(doc, [id], (l) =>
    withTransform(l, setAnchor((l as Exclude<Layer, { type: 'raw' }>).transform, { x: box.x + box.width / 2, y: box.y + box.height / 2 })),
  );
}

/**
 * Rotate by `delta` degrees. One layer: about its own anchor (set to its
 * centre first when unset). Several: about the document-space `pivot`.
 */
export function rotateLayers(doc: VectorDoc, ids: Iterable<string>, delta: number, pivot?: Pt): VectorDoc {
  const list = transformableIds(doc, ids);
  if (list.length === 0 || delta === 0) return doc;
  if (list.length === 1 && !pivot) {
    const anchored = ensureAnchor(doc, list[0]);
    return mapIds(anchored, list, (layer) =>
      layer.type === 'raw' ? layer : withTransform(layer, rotateAboutAnchor(layer.transform, delta)),
    );
  }
  const c = pivot ?? centreOf(selectionBounds(doc, list));
  const r = multiply(translation(c.x, c.y), multiply(rotationM(delta), translation(-c.x, -c.y)));
  return mapIds(doc, list, (layer, p2d) => {
    if (layer.type === 'raw') return layer;
    const full = multiply(invert(p2d), multiply(r, multiply(p2d, transformToMatrix(layer.transform))));
    return withTransform(layer, fromMatrixKeepingAnchor(full, layer.transform));
  });
}

/** Move the pivot to a DOCUMENT-space point without moving the layer. */
export function setLayerAnchorDoc(doc: VectorDoc, id: string, docPoint: Pt): VectorDoc {
  if (!transformableIds(doc, [id]).includes(id)) return doc;
  const layer = findLayer(doc.layers, id);
  if (!layer || layer.type === 'raw') return doc;
  const toLocal = invert(multiply(parentToDocMatrix(doc.layers, id), transformToMatrix(layer.transform)));
  const local = apply(toLocal, docPoint);
  return mapIds(doc, [id], (l) => withTransform(l, setAnchor((l as Exclude<Layer, { type: 'raw' }>).transform, local)));
}

/** Replace a layer's transform (inspector edits). */
export function setLayerTransform(doc: VectorDoc, id: string, t: VectorTransform | undefined): VectorDoc {
  return mapIds(doc, [id], (l) => withTransform(l, t));
}

/** The document position of a layer's anchor (where the pivot marker is drawn). */
export function anchorDocPoint(doc: VectorDoc, id: string): Pt | null {
  const layer = findLayer(doc.layers, id);
  if (!layer || layer.type === 'raw') return null;
  const r = resolveTransform(layer.transform);
  const box = layerLocalBounds(layer, boundsCtx(doc));
  const local = r.anchorX === 0 && r.anchorY === 0 && box ? { x: box.x + box.width / 2, y: box.y + box.height / 2 } : { x: r.anchorX, y: r.anchorY };
  return apply(multiply(parentToDocMatrix(doc.layers, id), transformToMatrix(layer.transform)), local);
}

export function centreOf(b: Box | null): Pt {
  return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : { x: 0, y: 0 };
}
