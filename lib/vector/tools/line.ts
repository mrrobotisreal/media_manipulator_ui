import { roundNum } from '@/lib/vector/num';
import { isClick, snap45, type ToolMachine } from './machine';
import { DEFAULT_LINE_STYLE, type ToolModifiers, type ToolPoint } from './types';
import type { LineLayer } from '@/lib/vector/vectorTypes';

export type LineState =
  | { phase: 'idle' }
  | { phase: 'drag'; start: ToolPoint; cur: ToolPoint; mods: ToolModifiers };

const INITIAL: LineState = { phase: 'idle' };

function build(start: ToolPoint, cur: ToolPoint, m: ToolModifiers): LineLayer {
  const end = m.shift ? snap45(start, cur) : cur;
  return {
    type: 'line',
    id: '',
    x1: roundNum(start.x),
    y1: roundNum(start.y),
    x2: roundNum(end.x),
    y2: roundNum(end.y),
    ...DEFAULT_LINE_STYLE,
  };
}

/** Line tool: press-drag start to end (Shift snaps to 45°); a click commits nothing. */
export const lineTool: ToolMachine<LineState> = {
  id: 'line',
  initial: INITIAL,
  pointerDown: (_s, p, m) => ({ state: { phase: 'drag', start: p, cur: p, mods: m } }),
  pointerMove: (s, p, m) => (s.phase === 'drag' ? { state: { ...s, cur: p, mods: m } } : { state: s }),
  pointerUp(s, p, m, ctx) {
    if (s.phase !== 'drag') return { state: s };
    if (isClick(s.start, p, ctx.zoom)) return { state: INITIAL };
    return { state: INITIAL, commit: build(s.start, p, m) };
  },
  key: (s, key) => (key === 'Escape' ? { state: INITIAL } : { state: s }),
  preview(s) {
    if (s.phase !== 'drag' || (s.start.x === s.cur.x && s.start.y === s.cur.y)) return null;
    return { ...build(s.start, s.cur, s.mods), id: 'tool-preview' };
  },
  busy: (s) => s.phase === 'drag',
};
