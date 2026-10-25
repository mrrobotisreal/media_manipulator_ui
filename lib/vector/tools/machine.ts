import type { ShapeLayer } from '@/lib/vector/vectorTypes';
import type { DrawToolId, ToolModifiers, ToolPoint } from './types';

/** Per-event context: zoom = screen px per document unit (thresholds are screen-px / zoom). */
export interface ToolContext {
  zoom: number;
}

/** A finished layer. `id` is '' — the canvas assigns a real id before inserting it. */
export type ToolCommit = ShapeLayer;

export interface ToolStep<S> {
  state: S;
  commit?: ToolCommit;
}

export interface ToolMachine<S> {
  id: DrawToolId;
  initial: S;
  pointerDown(s: S, p: ToolPoint, m: ToolModifiers, ctx: ToolContext): ToolStep<S>;
  pointerMove(s: S, p: ToolPoint, m: ToolModifiers, ctx: ToolContext): ToolStep<S>;
  pointerUp(s: S, p: ToolPoint, m: ToolModifiers, ctx: ToolContext): ToolStep<S>;
  /** Keys: 'Enter' | 'Escape' | 'Backspace'. Unknown keys return the state unchanged. */
  key(s: S, key: string, m: ToolModifiers, ctx: ToolContext): ToolStep<S>;
  /** Live preview layer while drawing (id 'tool-preview'), or null. */
  preview(s: S): ShapeLayer | null;
  /** True while the tool holds an unfinished drawing (so the canvas keeps routing keys to it). */
  busy(s: S): boolean;
}

/** Screen-px thresholds. */
/** A down/up closer than this is a click, not a drag. */
export const CLICK_SLOP_PX = 3;
/** Pen: clicking within this of the first node closes the path. */
export const CLOSE_RADIUS_PX = 8;
/** Rect/ellipse: a click (no drag) creates a square of this size centred on the point. */
export const DEFAULT_CLICK_SIZE = 100;

/** Axis-aligned box in document units. */
export interface DragBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** True when `a` and `b` are closer than the click slop at this zoom. */
export function isClick(a: ToolPoint, b: ToolPoint, zoom: number): boolean {
  return Math.hypot(b.x - a.x, b.y - a.y) < CLICK_SLOP_PX / zoom;
}

/**
 * Box for a corner-to-corner drag. Shift squares it (side = max(|dx|,|dy|),
 * keeping the drag direction); Alt treats `start` as the centre.
 */
export function dragBox(start: ToolPoint, cur: ToolPoint, m: ToolModifiers): DragBox {
  let dx = cur.x - start.x;
  let dy = cur.y - start.y;
  if (m.shift) {
    const side = Math.max(Math.abs(dx), Math.abs(dy));
    dx = (dx < 0 ? -1 : 1) * side;
    dy = (dy < 0 ? -1 : 1) * side;
  }
  if (m.alt) {
    const w = Math.abs(dx);
    const h = Math.abs(dy);
    return { x: start.x - w, y: start.y - h, width: w * 2, height: h * 2 };
  }
  return {
    x: Math.min(start.x, start.x + dx),
    y: Math.min(start.y, start.y + dy),
    width: Math.abs(dx),
    height: Math.abs(dy),
  };
}

/** Square of DEFAULT_CLICK_SIZE centred on `p`. */
export function clickBox(p: ToolPoint): DragBox {
  const h = DEFAULT_CLICK_SIZE / 2;
  return { x: p.x - h, y: p.y - h, width: DEFAULT_CLICK_SIZE, height: DEFAULT_CLICK_SIZE };
}

/** `end` with its angle from `origin` snapped to the nearest 45°, keeping the length. */
export function snap45(origin: ToolPoint, end: ToolPoint): ToolPoint {
  const dx = end.x - origin.x;
  const dy = end.y - origin.y;
  const len = Math.hypot(dx, dy);
  const step = Math.PI / 4;
  const a = Math.round(Math.atan2(dy, dx) / step) * step;
  return { x: origin.x + len * Math.cos(a), y: origin.y + len * Math.sin(a) };
}

/** State shared by the two-corner box tools (rect, ellipse). */
export type BoxState =
  | { phase: 'idle' }
  | { phase: 'drag'; start: ToolPoint; cur: ToolPoint; mods: ToolModifiers };

export const BOX_INITIAL: BoxState = { phase: 'idle' };

/** Builds a tool machine for a box-gesture shape; `make` turns a rounded-later box into a layer. */
export function createBoxTool(
  id: DrawToolId,
  make: (box: DragBox) => ShapeLayer,
): ToolMachine<BoxState> {
  const finish = (s: BoxState, p: ToolPoint, m: ToolModifiers, zoom: number): ToolStep<BoxState> => {
    if (s.phase !== 'drag') return { state: s };
    const box = isClick(s.start, p, zoom) ? clickBox(s.start) : dragBox(s.start, p, m);
    if (box.width > 0 && box.height > 0) return { state: BOX_INITIAL, commit: make(box) };
    return { state: BOX_INITIAL };
  };
  return {
    id,
    initial: BOX_INITIAL,
    pointerDown: (_s, p, m) => ({ state: { phase: 'drag', start: p, cur: p, mods: m } }),
    pointerMove: (s, p, m) => (s.phase === 'drag' ? { state: { ...s, cur: p, mods: m } } : { state: s }),
    pointerUp: (s, p, m, ctx) => finish(s, p, m, ctx.zoom),
    key: (s, key) => (key === 'Escape' ? { state: BOX_INITIAL } : { state: s }),
    preview(s) {
      if (s.phase !== 'drag') return null;
      const box = dragBox(s.start, s.cur, s.mods);
      if (!(box.width > 0 && box.height > 0)) return null;
      return { ...make(box), id: 'tool-preview' };
    },
    busy: (s) => s.phase === 'drag',
  };
}
