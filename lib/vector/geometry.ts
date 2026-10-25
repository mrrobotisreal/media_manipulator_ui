/**
 * Affine geometry for the Motion document: matrices, the `VectorTransform`
 * model (see `transformSchema` in `vectorTypes.ts` for the composition order),
 * SVG `transform=""` parsing/serialisation, per-layer bounds, and the pure
 * transform maths the canvas tools use (move, scale about a fixed point,
 * rotate about the anchor, re-anchor without moving).
 *
 * Matrices are SVG order `[a, b, c, d, e, f]`: x' = a·x + c·y + e,
 * y' = b·x + d·y + f.
 */
import { formatNumber, roundNum } from '@/lib/vector/num';
import { parsePath, pathBounds } from '@/lib/vector/pathData';
import type { Layer, VectorSymbol, VectorTransform } from '@/lib/vector/vectorTypes';

export type Matrix = readonly [number, number, number, number, number, number];
export type Pt = { x: number; y: number };
export type Box = { x: number; y: number; width: number; height: number };

export const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0];
const RAD = Math.PI / 180;

export const IDENTITY_TRANSFORM: VectorTransform = {
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  skewX: 0,
  skewY: 0,
  anchorX: 0,
  anchorY: 0,
};

// ---------------------------------------------------------------------------
// matrices
// ---------------------------------------------------------------------------

/** m1 · m2 (m2 applies first). */
export function multiply(m1: Matrix, m2: Matrix): Matrix {
  const [a1, b1, c1, d1, e1, f1] = m1;
  const [a2, b2, c2, d2, e2, f2] = m2;
  return [
    a1 * a2 + c1 * b2,
    b1 * a2 + d1 * b2,
    a1 * c2 + c1 * d2,
    b1 * c2 + d1 * d2,
    a1 * e2 + c1 * f2 + e1,
    b1 * e2 + d1 * f2 + f1,
  ];
}

export function invert(m: Matrix): Matrix {
  const [a, b, c, d, e, f] = m;
  const det = a * d - b * c;
  if (det === 0 || !Number.isFinite(det)) return IDENTITY;
  return [d / det, -b / det, -c / det, a / det, (c * f - d * e) / det, (b * e - a * f) / det];
}

export function apply(m: Matrix, p: Pt): Pt {
  return { x: m[0] * p.x + m[2] * p.y + m[4], y: m[1] * p.x + m[3] * p.y + m[5] };
}

/** Apply only the linear part (for deltas / directions). */
export function applyLinear(m: Matrix, p: Pt): Pt {
  return { x: m[0] * p.x + m[2] * p.y, y: m[1] * p.x + m[3] * p.y };
}

export const translation = (x: number, y: number): Matrix => [1, 0, 0, 1, x, y];
export const scaling = (sx: number, sy: number): Matrix => [sx, 0, 0, sy, 0, 0];
export function rotationM(deg: number): Matrix {
  const c = Math.cos(deg * RAD);
  const s = Math.sin(deg * RAD);
  return [c, s, -s, c, 0, 0];
}
export const skewXM = (deg: number): Matrix => [1, 0, Math.tan(deg * RAD), 1, 0, 0];
export const skewYM = (deg: number): Matrix => [1, Math.tan(deg * RAD), 0, 1, 0, 0];

// ---------------------------------------------------------------------------
// VectorTransform <-> matrix
// ---------------------------------------------------------------------------

export function resolveTransform(t: VectorTransform | undefined): VectorTransform {
  return t ? { ...IDENTITY_TRANSFORM, ...t } : IDENTITY_TRANSFORM;
}

/** The linear part R · SkX · SkY · S (no translation). */
function linearOf(t: VectorTransform): Matrix {
  return multiply(
    multiply(multiply(rotationM(t.rotation), skewXM(t.skewX)), skewYM(t.skewY)),
    scaling(t.scaleX, t.scaleY),
  );
}

/** translate(x+ax, y+ay) · R · SkX · SkY · S · translate(-ax, -ay). */
export function transformToMatrix(t: VectorTransform | undefined): Matrix {
  if (!t) return IDENTITY;
  const r = resolveTransform(t);
  const lin = linearOf(r);
  const pre = translation(-r.anchorX, -r.anchorY);
  return multiply(translation(r.x + r.anchorX, r.y + r.anchorY), multiply(lin, pre));
}

export function hasIdentityLinear(t: VectorTransform): boolean {
  return t.rotation === 0 && t.skewX === 0 && t.skewY === 0 && t.scaleX === 1 && t.scaleY === 1;
}

export function isIdentityTransform(t: VectorTransform | undefined): boolean {
  if (!t) return true;
  const r = resolveTransform(t);
  return hasIdentityLinear(r) && r.x === 0 && r.y === 0;
}

/** Round every field; identity (ignoring the anchor) collapses to undefined. */
export function canonicalTransform(t: VectorTransform | undefined): VectorTransform | undefined {
  if (!t) return undefined;
  const r = resolveTransform(t);
  const out: VectorTransform = {
    x: roundNum(r.x),
    y: roundNum(r.y),
    scaleX: roundNum(r.scaleX),
    scaleY: roundNum(r.scaleY),
    rotation: roundNum(r.rotation),
    skewX: roundNum(r.skewX),
    skewY: roundNum(r.skewY),
    anchorX: roundNum(r.anchorX),
    anchorY: roundNum(r.anchorY),
  };
  return isIdentityTransform(out) && out.anchorX === 0 && out.anchorY === 0 ? undefined : out;
}

/**
 * Decompose any affine matrix into translate · rotate · skewX · scale (anchor
 * 0, skewY 0). Exact up to rounding; a reflection shows up as negative scaleY.
 */
export function decomposeMatrix(m: Matrix): VectorTransform {
  const [a, b, c, d, e, f] = m;
  const sx = Math.hypot(a, b);
  const theta = sx === 0 ? 0 : Math.atan2(b, a);
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const cr = c * cos + d * sin; // column 2 rotated by -theta: (sy·tan k, sy)
  const sy = -c * sin + d * cos;
  const k = sy === 0 ? 0 : Math.atan(cr / sy) / RAD;
  return {
    ...IDENTITY_TRANSFORM,
    x: roundNum(e),
    y: roundNum(f),
    scaleX: roundNum(sx),
    scaleY: roundNum(sy),
    rotation: roundNum(theta / RAD),
    skewX: roundNum(k),
  };
}

// ---------------------------------------------------------------------------
// SVG transform attribute
// ---------------------------------------------------------------------------

type TransformOp = { type: 'matrix' | 'translate' | 'scale' | 'rotate' | 'skewX' | 'skewY'; args: number[] };

const OP_RE = /\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)\s*,?/y;

/** Parse an SVG transform list; null when malformed. */
export function parseTransformList(text: string): TransformOp[] | null {
  const ops: TransformOp[] = [];
  OP_RE.lastIndex = 0;
  const src = text.trim();
  let i = 0;
  while (i < src.length) {
    OP_RE.lastIndex = i;
    const m = OP_RE.exec(src);
    if (!m) return null;
    const args = m[2].trim() === '' ? [] : m[2].trim().split(/[\s,]+/).map(Number);
    if (args.some((n) => !Number.isFinite(n))) return null;
    const type = m[1] as TransformOp['type'];
    const arity: Record<TransformOp['type'], number[]> = {
      matrix: [6],
      translate: [1, 2],
      scale: [1, 2],
      rotate: [1, 3],
      skewX: [1],
      skewY: [1],
    };
    if (!arity[type].includes(args.length)) return null;
    ops.push({ type, args });
    i = OP_RE.lastIndex;
  }
  return ops;
}

function opMatrix(op: TransformOp): Matrix {
  const [p, q, r] = op.args;
  switch (op.type) {
    case 'matrix':
      return op.args as unknown as Matrix;
    case 'translate':
      return translation(p, q ?? 0);
    case 'scale':
      return scaling(p, q ?? p);
    case 'rotate':
      return op.args.length === 3
        ? multiply(translation(q, r), multiply(rotationM(p), translation(-q, -r)))
        : rotationM(p);
    case 'skewX':
      return skewXM(p);
    case 'skewY':
      return skewYM(p);
  }
}

export function opsToMatrix(ops: TransformOp[]): Matrix {
  return ops.reduce<Matrix>((acc, op) => multiply(acc, opMatrix(op)), IDENTITY);
}

const CANONICAL_ORDER = ['rotate', 'skewX', 'skewY', 'scale'] as const;

/**
 * Map a transform list onto the model. The exporter's own canonical form
 * (`translate rotate skewX skewY scale translate`, any part optional) and
 * `rotate(a cx cy)` map exactly, keeping the anchor; anything else goes
 * through `decomposeMatrix`. Returns undefined for identity.
 */
export function transformFromAttr(text: string | null | undefined): VectorTransform | undefined {
  if (!text || !text.trim()) return undefined;
  const parsed = parseTransformList(text);
  if (!parsed) return undefined;
  // rotate(a cx cy) ≡ translate(cx cy) rotate(a) translate(-cx -cy)
  const expanded: TransformOp[] = [];
  for (const op of parsed) {
    if (op.type === 'rotate' && op.args.length === 3) {
      const [a, cx, cy] = op.args;
      expanded.push({ type: 'translate', args: [cx, cy] }, { type: 'rotate', args: [a] }, { type: 'translate', args: [-cx, -cy] });
    } else expanded.push(op);
  }
  const merged: TransformOp[] = [];
  for (const op of expanded) {
    const prev = merged[merged.length - 1];
    if (op.type === 'translate' && prev?.type === 'translate') {
      merged[merged.length - 1] = {
        type: 'translate',
        args: [prev.args[0] + op.args[0], (prev.args[1] ?? 0) + (op.args[1] ?? 0)],
      };
    } else merged.push(op);
  }
  const t = { ...IDENTITY_TRANSFORM };
  let idx = 0;
  let first: TransformOp | undefined;
  if (merged[0]?.type === 'translate') first = merged[idx++];
  let rank = 0;
  let canonical = true;
  while (idx < merged.length) {
    const op = merged[idx];
    if (op.type === 'translate' && idx === merged.length - 1 && idx > 0) break;
    const at = CANONICAL_ORDER.indexOf(op.type as (typeof CANONICAL_ORDER)[number]);
    if (at < rank || at === -1) {
      canonical = false;
      break;
    }
    rank = at + 1;
    if (op.type === 'rotate') t.rotation = op.args[0];
    else if (op.type === 'skewX') t.skewX = op.args[0];
    else if (op.type === 'skewY') t.skewY = op.args[0];
    else if (op.type === 'scale') {
      t.scaleX = op.args[0];
      t.scaleY = op.args[1] ?? op.args[0];
    }
    idx++;
  }
  if (!canonical) return canonicalTransform(decomposeMatrix(opsToMatrix(parsed)));
  const last = idx < merged.length ? merged[idx] : undefined;
  const fx = first?.args[0] ?? 0;
  const fy = first?.args[1] ?? 0;
  const gx = last?.args[0] ?? 0;
  const gy = last?.args[1] ?? 0;
  t.anchorX = -gx;
  t.anchorY = -gy;
  t.x = fx + gx;
  t.y = fy + gy;
  return canonicalTransform(t);
}

/** Canonical `transform=""` text, or null for identity. */
export function transformToAttr(t: VectorTransform | undefined): string | null {
  if (!t) return null;
  const r = resolveTransform(t);
  const parts: string[] = [];
  const f = formatNumber;
  if (hasIdentityLinear(r)) {
    if (roundNum(r.x) === 0 && roundNum(r.y) === 0) return null;
    return `translate(${f(r.x)} ${f(r.y)})`;
  }
  const tx = roundNum(r.x + r.anchorX);
  const ty = roundNum(r.y + r.anchorY);
  if (tx !== 0 || ty !== 0) parts.push(`translate(${f(tx)} ${f(ty)})`);
  if (roundNum(r.rotation) !== 0) parts.push(`rotate(${f(r.rotation)})`);
  if (roundNum(r.skewX) !== 0) parts.push(`skewX(${f(r.skewX)})`);
  if (roundNum(r.skewY) !== 0) parts.push(`skewY(${f(r.skewY)})`);
  if (roundNum(r.scaleX) !== 1 || roundNum(r.scaleY) !== 1) parts.push(`scale(${f(r.scaleX)} ${f(r.scaleY)})`);
  if (roundNum(r.anchorX) !== 0 || roundNum(r.anchorY) !== 0) {
    parts.push(`translate(${f(-r.anchorX)} ${f(-r.anchorY)})`);
  }
  return parts.length ? parts.join(' ') : null;
}

/** `matrix(a b c d e f)` text for gradient / clipPath transforms. */
export function matrixToAttr(m: readonly number[]): string {
  return `matrix(${m.map(formatNumber).join(' ')})`;
}

// ---------------------------------------------------------------------------
// bounds
// ---------------------------------------------------------------------------

export function unionBoxes(boxes: Array<Box | null>): Box | null {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const b of boxes) {
    if (!b) continue;
    x0 = Math.min(x0, b.x);
    y0 = Math.min(y0, b.y);
    x1 = Math.max(x1, b.x + b.width);
    y1 = Math.max(y1, b.y + b.height);
  }
  return x0 === Infinity ? null : { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

/** Axis-aligned box of `box` after `m`. */
export function transformBox(box: Box, m: Matrix): Box {
  const pts = boxCorners(box).map((p) => apply(m, p));
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

export function boxCorners(b: Box): Pt[] {
  return [
    { x: b.x, y: b.y },
    { x: b.x + b.width, y: b.y },
    { x: b.x + b.width, y: b.y + b.height },
    { x: b.x, y: b.y + b.height },
  ];
}

export interface BoundsContext {
  symbols?: VectorSymbol[];
  /** Resolve a `use` that points at a layer id. */
  findLayer?: (id: string) => Layer | undefined;
}

/** Text has no layout engine here: an em-box estimate good enough for handles. */
const TEXT_ADVANCE = 0.6;
const TEXT_ASCENT = 0.8;

/**
 * Bounds of a layer's own geometry, in its local (pre-transform) space.
 * Groups union their children's transformed bounds. Raw layers have none.
 */
export function layerLocalBounds(layer: Layer, ctx: BoundsContext = {}, depth = 0): Box | null {
  if (depth > 32) return null;
  switch (layer.type) {
    case 'rect':
    case 'image':
      return { x: layer.x, y: layer.y, width: layer.width, height: layer.height };
    case 'ellipse':
      return { x: layer.cx - layer.rx, y: layer.cy - layer.ry, width: layer.rx * 2, height: layer.ry * 2 };
    case 'line':
      return {
        x: Math.min(layer.x1, layer.x2),
        y: Math.min(layer.y1, layer.y2),
        width: Math.abs(layer.x2 - layer.x1),
        height: Math.abs(layer.y2 - layer.y1),
      };
    case 'polyline':
    case 'polygon': {
      if (layer.points.length < 2) return null;
      const xs = layer.points.filter((_, i) => i % 2 === 0);
      const ys = layer.points.filter((_, i) => i % 2 === 1);
      const x = Math.min(...xs);
      const y = Math.min(...ys);
      return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
    }
    case 'path': {
      try {
        return pathBounds(parsePath(layer.d));
      } catch {
        return null;
      }
    }
    case 'text': {
      const size = layer.fontSize ?? 16;
      const width = Math.max(1, layer.text.length) * size * TEXT_ADVANCE;
      const shift = layer.textAnchor === 'middle' ? width / 2 : layer.textAnchor === 'end' ? width : 0;
      return { x: layer.x - shift, y: layer.y - size * TEXT_ASCENT, width, height: size };
    }
    case 'use': {
      const ox = layer.x ?? 0;
      const oy = layer.y ?? 0;
      if (layer.width !== undefined && layer.height !== undefined) {
        return { x: ox, y: oy, width: layer.width, height: layer.height };
      }
      const symbol = ctx.symbols?.find((s) => s.id === layer.ref);
      if (symbol) {
        if (symbol.viewBox) return { x: ox, y: oy, width: symbol.viewBox.width, height: symbol.viewBox.height };
        const inner = unionBoxes(symbol.layers.map((l) => layerBoundsInParent(l, ctx, depth + 1)));
        return inner ? { ...inner, x: inner.x + ox, y: inner.y + oy } : null;
      }
      const target = ctx.findLayer?.(layer.ref);
      const inner = target ? layerBoundsInParent(target, ctx, depth + 1) : null;
      return inner ? { ...inner, x: inner.x + ox, y: inner.y + oy } : null;
    }
    case 'group':
      return unionBoxes(layer.children.map((c) => layerBoundsInParent(c, ctx, depth + 1)));
    case 'raw':
      return null;
  }
}

/** Axis-aligned bounds of the layer in its parent's space. */
export function layerBoundsInParent(layer: Layer, ctx: BoundsContext = {}, depth = 0): Box | null {
  const local = layerLocalBounds(layer, ctx, depth);
  if (!local) return null;
  return layer.type === 'raw' ? local : transformBox(local, transformToMatrix(layer.transform));
}

export function layerMatrix(layer: Layer): Matrix {
  return layer.type === 'raw' ? IDENTITY : transformToMatrix(layer.transform);
}

// ---------------------------------------------------------------------------
// transform operations (pure; the canvas converts pointer deltas into the
// layer's PARENT space before calling these)
// ---------------------------------------------------------------------------

/** Offset the layer by a parent-space delta. */
export function translateTransform(t: VectorTransform | undefined, dx: number, dy: number): VectorTransform {
  const r = resolveTransform(t);
  return { ...r, x: r.x + dx, y: r.y + dy };
}

/**
 * Move the anchor (pivot) to `anchor` (local units) without moving the layer
 * on screen: x' = x + (I − L)(a − a′).
 */
export function setAnchor(t: VectorTransform | undefined, anchor: Pt): VectorTransform {
  const r = resolveTransform(t);
  const lin = linearOf(r);
  const da = { x: r.anchorX - anchor.x, y: r.anchorY - anchor.y };
  const lda = applyLinear(lin, da);
  return { ...r, x: r.x + da.x - lda.x, y: r.y + da.y - lda.y, anchorX: anchor.x, anchorY: anchor.y };
}

/** Rotate by `delta` degrees about the layer's own anchor (the anchor stays put). */
export function rotateAboutAnchor(t: VectorTransform | undefined, delta: number): VectorTransform {
  const r = resolveTransform(t);
  return { ...r, rotation: normalizeAngle(r.rotation + delta) };
}

/**
 * Rotate by `delta` about an arbitrary parent-space centre (multi-selection):
 * the anchor's parent position orbits the centre and the layer turns with it.
 */
export function rotateAboutPoint(t: VectorTransform | undefined, delta: number, centre: Pt): VectorTransform {
  const r = resolveTransform(t);
  const p = { x: r.x + r.anchorX, y: r.y + r.anchorY };
  const q = apply(rotationM(delta), { x: p.x - centre.x, y: p.y - centre.y });
  return {
    ...r,
    rotation: normalizeAngle(r.rotation + delta),
    x: centre.x + q.x - r.anchorX,
    y: centre.y + q.y - r.anchorY,
  };
}

/** Into (-180, 180]. */
export function normalizeAngle(deg: number): number {
  let a = deg % 360;
  if (a <= -180) a += 360;
  if (a > 180) a -= 360;
  return a;
}

/**
 * Multiply the layer's scale by (fx, fy) along its LOCAL axes while the local
 * point `fixed` keeps its parent-space position (the opposite handle).
 */
export function scaleAboutLocalPoint(t: VectorTransform | undefined, fx: number, fy: number, fixed: Pt): VectorTransform {
  const r = resolveTransform(t);
  const before = apply(transformToMatrix(r), fixed);
  const next = { ...r, scaleX: r.scaleX * fx, scaleY: r.scaleY * fy };
  const after = apply(transformToMatrix(next), fixed);
  return { ...next, x: next.x + before.x - after.x, y: next.y + before.y - after.y };
}

/**
 * Scale factors for dragging a handle of the local box `box` from the fixed
 * opposite point to `pointer` (both local). `axes` says which axes the handle
 * drives; `uniform` (shift) locks the aspect ratio to the larger factor.
 */
export function handleScaleFactors(
  box: Box,
  handle: HandleId,
  pointerLocal: Pt,
  uniform: boolean,
): { fx: number; fy: number; fixed: Pt } {
  const spec = HANDLE_SPECS[handle];
  const fixed = { x: box.x + box.width * (1 - spec.u), y: box.y + box.height * (1 - spec.v) };
  const grab = { x: box.x + box.width * spec.u, y: box.y + box.height * spec.v };
  // Edge handles pivot on the opposite edge's midpoint.
  if (spec.u === 0.5) fixed.x = box.x + box.width / 2;
  if (spec.v === 0.5) fixed.y = box.y + box.height / 2;
  const spanX = grab.x - fixed.x;
  const spanY = grab.y - fixed.y;
  let fx = spec.u !== 0.5 && spanX !== 0 ? (pointerLocal.x - fixed.x) / spanX : 1;
  let fy = spec.v !== 0.5 && spanY !== 0 ? (pointerLocal.y - fixed.y) / spanY : 1;
  if (uniform) {
    if (spec.u === 0.5) fx = fy;
    else if (spec.v === 0.5) fy = fx;
    else {
      const m = Math.abs(fx) >= Math.abs(fy) ? fx : fy;
      fx = m;
      fy = m;
    }
  }
  const clamp = (f: number) => (Math.abs(f) < 1e-3 ? (f < 0 ? -1e-3 : 1e-3) : f);
  return { fx: clamp(fx), fy: clamp(fy), fixed };
}

export type HandleId = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
/** u/v: the handle's position as a fraction of the box (0 = left/top). */
export const HANDLE_SPECS: Record<HandleId, { u: number; v: number }> = {
  nw: { u: 0, v: 0 },
  n: { u: 0.5, v: 0 },
  ne: { u: 1, v: 0 },
  e: { u: 1, v: 0.5 },
  se: { u: 1, v: 1 },
  s: { u: 0.5, v: 1 },
  sw: { u: 0, v: 1 },
  w: { u: 0, v: 0.5 },
};
export const HANDLE_IDS = Object.keys(HANDLE_SPECS) as HandleId[];

// ---------------------------------------------------------------------------
// snapping
// ---------------------------------------------------------------------------

/** Proposed (ticket decision 8): snap when within 6 screen px. */
export const SNAP_THRESHOLD_PX = 6;

export interface SnapResult {
  dx: number;
  dy: number;
  /** Canvas-space guide lines to draw (x = vertical line, y = horizontal). */
  guides: { x?: number; y?: number };
}

/**
 * Snap a box being moved by (dx, dy) so its left/centre/right (top/middle/
 * bottom) lands on the canvas edges or centre when within `threshold` canvas
 * units (the caller divides the screen threshold by the zoom). Guides are
 * document coordinates.
 */
export function snapMove(
  box: Box,
  dx: number,
  dy: number,
  canvas: { x?: number; y?: number; width: number; height: number },
  threshold: number,
): SnapResult {
  const pick = (start: number, size: number, d: number, origin: number, extent: number) => {
    const targets = [origin, origin + extent / 2, origin + extent];
    const probes = [start + d, start + d + size / 2, start + d + size];
    let best: { delta: number; at: number } | null = null;
    for (const p of probes) {
      for (const t of targets) {
        const delta = t - p;
        if (Math.abs(delta) <= threshold && (!best || Math.abs(delta) < Math.abs(best.delta))) best = { delta, at: t };
      }
    }
    return best;
  };
  const sx = pick(box.x, box.width, dx, canvas.x ?? 0, canvas.width);
  const sy = pick(box.y, box.height, dy, canvas.y ?? 0, canvas.height);
  return {
    dx: dx + (sx?.delta ?? 0),
    dy: dy + (sy?.delta ?? 0),
    guides: { x: sx?.at, y: sy?.at },
  };
}

export function boxesIntersect(a: Box, b: Box): boolean {
  return a.x <= b.x + b.width && b.x <= a.x + a.width && a.y <= b.y + b.height && b.y <= a.y + a.height;
}

/** Normalised box from two drag corners. */
export function boxFromPoints(p: Pt, q: Pt): Box {
  return { x: Math.min(p.x, q.x), y: Math.min(p.y, q.y), width: Math.abs(q.x - p.x), height: Math.abs(q.y - p.y) };
}
