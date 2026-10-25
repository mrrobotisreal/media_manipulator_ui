import { roundNum } from '@/lib/vector/num';
import { serializePath, type PathSegment } from '@/lib/vector/pathData';
import type { PathLayer } from '@/lib/vector/vectorTypes';
import { CLICK_SLOP_PX, CLOSE_RADIUS_PX, snap45, type ToolMachine, type ToolStep } from './machine';
import { DEFAULT_PATH_STYLE, DEFAULT_SHAPE_STYLE, type ToolPoint } from './types';

/** A pen anchor with optional bezier handles (absolute document coordinates). */
export type PenNode = { x: number; y: number; in?: ToolPoint; out?: ToolPoint };

export interface PenState {
  nodes: PenNode[];
  /** Active press: the node being dragged out; `closing` when it started on the first node. */
  drag: { index: number; origin: ToolPoint; closing: boolean } | null;
  /** Last pointer position, for the rubber band. */
  hover: ToolPoint | null;
}

const INITIAL: PenState = { nodes: [], drag: null, hover: null };

const r = roundNum;

function segTo(a: PenNode, b: PenNode): PathSegment {
  const c1 = a.out;
  const c2 = b.in;
  if (c1 || c2) {
    const p1 = c1 ?? a;
    const p2 = c2 ?? b;
    return { cmd: 'C', x1: r(p1.x), y1: r(p1.y), x2: r(p2.x), y2: r(p2.y), x: r(b.x), y: r(b.y) };
  }
  return { cmd: 'L', x: r(b.x), y: r(b.y) };
}

/** Converts nodes to path segments (M, then C/L per pair; closed adds the closing segment and Z). */
export function penNodesToSegments(nodes: PenNode[], closed: boolean): PathSegment[] {
  if (nodes.length === 0) return [];
  const segs: PathSegment[] = [{ cmd: 'M', x: r(nodes[0].x), y: r(nodes[0].y) }];
  for (let i = 1; i < nodes.length; i++) segs.push(segTo(nodes[i - 1], nodes[i]));
  if (closed) {
    segs.push(segTo(nodes[nodes.length - 1], nodes[0]));
    segs.push({ cmd: 'Z' });
  }
  return segs;
}

function buildLayer(segs: PathSegment[], closed: boolean): PathLayer {
  return {
    type: 'path',
    id: '',
    d: serializePath(segs),
    ...DEFAULT_PATH_STYLE,
    ...(closed ? { fill: DEFAULT_SHAPE_STYLE.fill } : {}),
  };
}

function finishOpen(s: PenState): ToolStep<PenState> {
  if (s.nodes.length >= 2) {
    return { state: INITIAL, commit: buildLayer(penNodesToSegments(s.nodes, false), false) };
  }
  return { state: INITIAL };
}

function setHandles(node: PenNode, handle: ToolPoint): PenNode {
  return {
    ...node,
    out: { x: handle.x, y: handle.y },
    in: { x: 2 * node.x - handle.x, y: 2 * node.y - handle.y },
  };
}

/** Bezier pen: click for corners, drag for smooth nodes, click the first node to close. */
export const penTool: ToolMachine<PenState> = {
  id: 'pen',
  initial: INITIAL,
  pointerDown(s, p, _m, ctx) {
    if (s.nodes.length >= 2) {
      const f = s.nodes[0];
      if (Math.hypot(p.x - f.x, p.y - f.y) <= CLOSE_RADIUS_PX / ctx.zoom) {
        return { state: { ...s, drag: { index: 0, origin: f, closing: true }, hover: p } };
      }
    }
    const nodes = [...s.nodes, { x: p.x, y: p.y }];
    return { state: { nodes, drag: { index: nodes.length - 1, origin: p, closing: false }, hover: p } };
  },
  pointerMove(s, p, m, ctx) {
    const d = s.drag;
    if (!d) return { state: { ...s, hover: p } };
    if (Math.hypot(p.x - d.origin.x, p.y - d.origin.y) < CLICK_SLOP_PX / ctx.zoom) {
      return { state: { ...s, hover: p } };
    }
    const node = s.nodes[d.index];
    const handle = m.shift ? snap45(node, p) : p;
    const nodes = s.nodes.map((n, i) => (i === d.index ? setHandles(n, handle) : n));
    return { state: { ...s, nodes, hover: p } };
  },
  pointerUp(s, p, m, ctx) {
    const d = s.drag;
    if (!d) return { state: s };
    const moved = penTool.pointerMove(s, p, m, ctx).state;
    if (d.closing) {
      return { state: INITIAL, commit: buildLayer(penNodesToSegments(moved.nodes, true), true) };
    }
    return { state: { ...moved, drag: null, hover: p } };
  },
  key(s, key) {
    if (key === 'Enter' || key === 'Escape') return finishOpen(s);
    if (key === 'Backspace') {
      const nodes = s.nodes.slice(0, -1);
      if (nodes.length === 0) return { state: INITIAL };
      return { state: { ...s, nodes, drag: null } };
    }
    return { state: s };
  },
  preview(s) {
    if (s.nodes.length === 0) return null;
    const closing = s.drag?.closing === true;
    let segs = penNodesToSegments(s.nodes, closing);
    const last = s.nodes[s.nodes.length - 1];
    if (!closing && !s.drag && s.hover && (s.hover.x !== last.x || s.hover.y !== last.y)) {
      segs = [...segs, segTo(last, { x: s.hover.x, y: s.hover.y })];
    }
    if (segs.length < 2) return null;
    return { ...buildLayer(segs, closing), id: 'tool-preview' };
  },
  busy: (s) => s.nodes.length > 0,
};
