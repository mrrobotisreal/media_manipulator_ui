/**
 * Semantics of the MM45 "advanced" animation properties (design §3.2,
 * ticket MM45 decisions 1–7). The preview (`sampleDoc`), the time-aware edit
 * fold (`timeEdit.ts`), the CSS exporter and the anime.js exporter all resolve
 * tracks through these functions, so the four can never disagree on what a
 * track targets.
 *
 *   - `strokeDashoffset` (number) and `d` (path data, morph) are layer
 *     fields, like `opacity`. `d` keys are stored NORMALISED
 *     (`lib/vector/morph.ts`); two keys morph when their command sequences
 *     match (`morphCompatible`), else the segment holds.
 *   - `gradientStop[i].color` / `.offset` animate stop i of a gradient the
 *     layer paints with: `extras.gradientId` when it names the layer's fill
 *     or stroke gradient, else the fill gradient, else the stroke gradient.
 *     When several tracks target the same stop field, the first in document
 *     order wins (preview and both exporters).
 *   - `filter.blur` animates `stdDeviation` of the blur filter the layer
 *     references (`layer.filter` → a `defs.filters` blur entry).
 *   - `motionPath`: keyframe values are the distance along the path as a
 *     FRACTION of its length (CSS `offset-distance` in %, 1 = 100 %);
 *     `extras = {pathId?, d?, autoOrient?}`. The path is `extras.d` (in the
 *     layer's PARENT space) or the outline of layer `pathId` mapped into that
 *     space. At distance s the layer's matrix becomes
 *
 *         translate(P(s)) · rotate(θ(s) if autoOrient) · <own transform>
 *
 *     (P = point, θ = direction of travel), which is exactly CSS
 *     `offset-path` + `offset-rotate` composed with `transform` when the
 *     transform origin is the user-space origin. It folds into the
 *     `VectorTransform` exactly (`withMotion`), so the canvas and the
 *     inspector need no special case. The Motion path animator sets the
 *     layer's anchor to its centre and `x/y = -anchor`, so its centre rides
 *     the path.
 *   - `mask` / `clipPath` tracks carry no value: animating a mask means
 *     animating its content layers' own tracks (they are ordinary layers in
 *     `defs.masks` / `defs.clipPaths`).
 */
import { invert, multiply, resolveTransform, transformToMatrix, type Matrix } from '@/lib/vector/geometry';
import { findLayer, parentToDocMatrix } from '@/lib/vector/layerTree';
import { measurePath, type PathPoint } from '@/lib/vector/pathLength';
import { parsePath, serializePath, transformPath } from '@/lib/vector/pathData';
import { paintRef, type Gradient, type Layer, type Track, type VectorDoc, type VectorTransform } from '@/lib/vector/vectorTypes';

// ---------------------------------------------------------------------------
// property classification
// ---------------------------------------------------------------------------

export type StopField = 'color' | 'offset';
const STOP_PROPERTY = /^gradientStop\[(0|[1-9]\d{0,2})\]\.(color|offset)$/;

export function parseStopProperty(p: string): { index: number; field: StopField } | null {
  const m = STOP_PROPERTY.exec(p);
  return m ? { index: Number(m[1]), field: m[2] as StopField } : null;
}

export const stopProperty = (index: number, field: StopField) => `gradientStop[${index}].${field}`;

/** Layer fields animated like the MM44 scalars (on top of `EDITABLE_PROPERTIES`). */
export const LAYER_ADVANCED_PROPERTIES = ['strokeDashoffset', 'd'] as const;
export type LayerAdvancedProperty = (typeof LAYER_ADVANCED_PROPERTIES)[number];
export const isLayerAdvancedProperty = (p: string): p is LayerAdvancedProperty => p === 'strokeDashoffset' || p === 'd';

export type AdvancedKind = 'dash' | 'morph' | 'stopColor' | 'stopOffset' | 'blur' | 'motion' | 'container';

/** Which MM45 animator a property belongs to; null for the MM44 properties. */
export function advancedKind(p: string): AdvancedKind | null {
  if (p === 'strokeDashoffset') return 'dash';
  if (p === 'd') return 'morph';
  if (p === 'filter.blur') return 'blur';
  if (p === 'motionPath') return 'motion';
  if (p === 'mask' || p === 'clipPath') return 'container';
  const stop = parseStopProperty(p);
  if (stop) return stop.field === 'color' ? 'stopColor' : 'stopOffset';
  return null;
}

// ---------------------------------------------------------------------------
// lookups
// ---------------------------------------------------------------------------

/** Any layer by id: the tree, mask / clip contents and symbols. */
export function findDocLayer(doc: Pick<VectorDoc, 'layers' | 'defs'>, id: string): Layer | undefined {
  return (
    findLayer(doc.layers, id) ??
    doc.defs.masks.map((m) => findLayer(m.layers, id)).find(Boolean) ??
    doc.defs.clipPaths.map((c) => findLayer(c.layers, id)).find(Boolean) ??
    doc.defs.symbols.map((s) => findLayer(s.layers, id)).find(Boolean)
  );
}

/** Where a layer lives. */
export function layerScope(doc: Pick<VectorDoc, 'layers' | 'defs'>, id: string): 'tree' | 'mask' | 'clip' | 'symbol' | null {
  if (findLayer(doc.layers, id)) return 'tree';
  if (doc.defs.masks.some((m) => findLayer(m.layers, id))) return 'mask';
  if (doc.defs.clipPaths.some((c) => findLayer(c.layers, id))) return 'clip';
  if (doc.defs.symbols.some((s) => findLayer(s.layers, id))) return 'symbol';
  return null;
}

/** The gradient a stop track animates (module comment), or undefined. */
export function trackGradient(doc: VectorDoc, track: Pick<Track, 'layerId' | 'extras'>): Gradient | undefined {
  const layer = findDocLayer(doc, track.layerId);
  if (!layer || layer.type === 'raw') return undefined;
  const fill = paintRef(layer.fill);
  const stroke = paintRef(layer.stroke);
  const wanted = typeof track.extras?.gradientId === 'string' ? track.extras.gradientId : undefined;
  const ids = wanted && (wanted === fill || wanted === stroke) ? [wanted] : [fill, stroke];
  for (const id of ids) {
    const g = id ? doc.defs.gradients.find((x) => x.id === id) : undefined;
    if (g) return g;
  }
  return undefined;
}

/** The blur filter id a `filter.blur` track animates, or undefined. */
export function trackBlurFilter(doc: VectorDoc, layerId: string): string | undefined {
  const layer = findDocLayer(doc, layerId);
  if (!layer || layer.type === 'raw' || !layer.filter) return undefined;
  return doc.defs.filters.some((f) => f.id === layer.filter && f.type === 'blur') ? layer.filter : undefined;
}

// ---------------------------------------------------------------------------
// outlines (draw-on length, motion paths, morph targets)
// ---------------------------------------------------------------------------

const f = (n: number) => String(Math.round(n * 1000) / 1000);

/** The layer's geometry as path data in its own local space; null for text, images, groups… */
export function layerOutline(layer: Layer): string | null {
  switch (layer.type) {
    case 'path':
      return layer.d;
    case 'line':
      return `M${f(layer.x1)} ${f(layer.y1)}L${f(layer.x2)} ${f(layer.y2)}`;
    case 'polyline':
    case 'polygon': {
      const p = layer.points;
      if (p.length < 4) return null;
      let d = `M${f(p[0])} ${f(p[1])}`;
      for (let i = 2; i + 1 < p.length; i += 2) d += `L${f(p[i])} ${f(p[i + 1])}`;
      return layer.type === 'polygon' ? `${d}Z` : d;
    }
    case 'rect': {
      const { x, y, width: w, height: h } = layer;
      if (w <= 0 || h <= 0) return null;
      const rx = Math.min(layer.rx ?? layer.ry ?? 0, w / 2);
      const ry = Math.min(layer.ry ?? layer.rx ?? 0, h / 2);
      if (rx <= 0 || ry <= 0) return `M${f(x)} ${f(y)}L${f(x + w)} ${f(y)}L${f(x + w)} ${f(y + h)}L${f(x)} ${f(y + h)}Z`;
      const a = (ex: number, ey: number) => `A${f(rx)} ${f(ry)} 0 0 1 ${f(ex)} ${f(ey)}`;
      return (
        `M${f(x + rx)} ${f(y)}L${f(x + w - rx)} ${f(y)}${a(x + w, y + ry)}L${f(x + w)} ${f(y + h - ry)}${a(x + w - rx, y + h)}` +
        `L${f(x + rx)} ${f(y + h)}${a(x, y + h - ry)}L${f(x)} ${f(y + ry)}${a(x + rx, y)}Z`
      );
    }
    case 'ellipse': {
      const { cx, cy, rx, ry } = layer;
      if (rx <= 0 || ry <= 0) return null;
      const a = (ex: number, ey: number) => `A${f(rx)} ${f(ry)} 0 0 1 ${f(ex)} ${f(ey)}`;
      return `M${f(cx + rx)} ${f(cy)}${a(cx - rx, cy)}${a(cx + rx, cy)}Z`;
    }
    default:
      return null;
  }
}

/** Outline length in local units (pure fallback for `getTotalLength`); 0 when there is none. */
export function layerOutlineLength(layer: Layer): number {
  const d = layerOutline(layer);
  return d ? (measurePath(d)?.length ?? 0) : 0;
}

/** `d` mapped through an affine matrix (canonical form); null when it does not parse. */
export function mapPathData(d: string, m: Matrix): string | null {
  try {
    return serializePath(transformPath(parsePath(d), m));
  } catch {
    return null;
  }
}

/** Matrix from layer `fromId`'s local space to layer `toId`'s PARENT space (both in the tree). */
export function localToParentOf(doc: VectorDoc, fromId: string, toId: string): Matrix | null {
  const from = findLayer(doc.layers, fromId);
  if (!from || !findLayer(doc.layers, toId)) return null;
  const fromToDoc = multiply(parentToDocMatrix(doc.layers, fromId), transformToMatrix(from.type === 'raw' ? undefined : from.transform));
  return multiply(invert(parentToDocMatrix(doc.layers, toId)), fromToDoc);
}

// ---------------------------------------------------------------------------
// motion path
// ---------------------------------------------------------------------------

export interface MotionExtras {
  pathId?: string;
  d?: string;
  autoOrient?: boolean;
}

export function motionExtras(track: Pick<Track, 'extras'>): MotionExtras {
  const e = track.extras ?? {};
  return {
    pathId: typeof e.pathId === 'string' ? e.pathId : undefined,
    d: typeof e.d === 'string' ? e.d : undefined,
    autoOrient: e.autoOrient === true,
  };
}

const motionCache = new WeakMap<object, Map<string, string | null>>();

/**
 * The motion path of a track, as path data in the moving layer's PARENT
 * space, or null (no path, a dangling `pathId`, unparsable data). Resolved
 * from the stored (unsampled) document: a guide path's own animation does not
 * move the motion.
 */
export function motionPathData(doc: VectorDoc, track: Pick<Track, 'layerId' | 'extras'>): string | null {
  const ex = motionExtras(track);
  if (ex.d !== undefined) return mapPathData(ex.d, [1, 0, 0, 1, 0, 0]);
  if (!ex.pathId || ex.pathId === track.layerId) return null;
  let cache = motionCache.get(doc.layers);
  if (!cache) {
    cache = new Map();
    motionCache.set(doc.layers, cache);
  }
  const key = `${track.layerId}\u0000${ex.pathId}`;
  if (cache.has(key)) return cache.get(key)!;
  const guide = findLayer(doc.layers, ex.pathId);
  const outline = guide ? layerOutline(guide) : null;
  const m = outline ? localToParentOf(doc, ex.pathId, track.layerId) : null;
  const d = outline && m ? mapPathData(outline, m) : null;
  cache.set(key, d);
  return d;
}

/** Point and direction at a progress fraction (value of the motion track). */
export function motionPointAt(d: string, fraction: number): PathPoint | null {
  const m = measurePath(d);
  if (!m || !Number.isFinite(fraction)) return null;
  return m.at(fraction * m.length);
}

const RAD = Math.PI / 180;

/**
 * Fold `translate(P) · rotate(θ)` in front of a transform (module comment):
 * exact, because rotation composes with the transform's own rotation and the
 * translation part absorbs the rest.
 */
export function withMotion(t: VectorTransform | undefined, p: PathPoint, autoOrient: boolean): VectorTransform {
  const r = resolveTransform(t);
  const th = autoOrient ? p.angle : 0;
  const c = Math.cos(th * RAD);
  const s = Math.sin(th * RAD);
  const ux = r.x + r.anchorX;
  const uy = r.y + r.anchorY;
  return {
    ...r,
    x: p.x + c * ux - s * uy - r.anchorX,
    y: p.y + s * ux + c * uy - r.anchorY,
    rotation: r.rotation + th,
  };
}

/** Inverse of `withMotion` (edits made on the canvas at the playhead fold back through it). */
export function withoutMotion(t: VectorTransform | undefined, p: PathPoint, autoOrient: boolean): VectorTransform {
  const r = resolveTransform(t);
  const th = autoOrient ? p.angle : 0;
  const c = Math.cos(th * RAD);
  const s = Math.sin(th * RAD);
  const vx = r.x + r.anchorX - p.x;
  const vy = r.y + r.anchorY - p.y;
  return {
    ...r,
    x: c * vx + s * vy - r.anchorX,
    y: -s * vx + c * vy - r.anchorY,
    rotation: r.rotation - th,
  };
}
