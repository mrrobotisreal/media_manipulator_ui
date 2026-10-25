import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LINE_STYLE,
  DEFAULT_PATH_STYLE,
  DEFAULT_SHAPE_STYLE,
  DEFAULT_TEXT_STYLE,
  DRAW_TOOLS,
  ellipseTool,
  lineTool,
  penNodesToSegments,
  penTool,
  rectTool,
  setText,
  textTool,
  type ToolCommit,
  type ToolContext,
  type ToolMachine,
  type ToolModifiers,
  type ToolPoint,
} from './index';

const Z1: ToolContext = { zoom: 1 };
const NONE: ToolModifiers = {};

/** Runs a gesture through a machine and returns the last commit (if any). */
function drag<S>(
  t: ToolMachine<S>,
  a: ToolPoint,
  b: ToolPoint,
  m: ToolModifiers = NONE,
  ctx: ToolContext = Z1,
): { commit?: ToolCommit; state: S } {
  let s = t.pointerDown(t.initial, a, m, ctx).state;
  s = t.pointerMove(s, b, m, ctx).state;
  return t.pointerUp(s, b, m, ctx);
}

const rect = (x: number, y: number, width: number, height: number) => ({
  type: 'rect', id: '', x, y, width, height, ...DEFAULT_SHAPE_STYLE,
});
const ellipse = (cx: number, cy: number, rx: number, ry: number) => ({
  type: 'ellipse', id: '', cx, cy, rx, ry, ...DEFAULT_SHAPE_STYLE,
});

describe('rect tool', () => {
  it('normalises drags in every direction', () => {
    expect(drag(rectTool, { x: 10, y: 10 }, { x: 40, y: 30 }).commit).toEqual(rect(10, 10, 30, 20));
    expect(drag(rectTool, { x: 40, y: 30 }, { x: 10, y: 10 }).commit).toEqual(rect(10, 10, 30, 20));
    expect(drag(rectTool, { x: 40, y: 10 }, { x: 10, y: 30 }).commit).toEqual(rect(10, 10, 30, 20));
    expect(drag(rectTool, { x: 10, y: 30 }, { x: 40, y: 10 }).commit).toEqual(rect(10, 10, 30, 20));
  });
  it('shift makes a square keeping direction', () => {
    expect(drag(rectTool, { x: 50, y: 50 }, { x: 20, y: 40 }, { shift: true }).commit).toEqual(rect(20, 20, 30, 30));
  });
  it('alt draws from the centre', () => {
    expect(drag(rectTool, { x: 50, y: 50 }, { x: 60, y: 70 }, { alt: true }).commit).toEqual(rect(40, 30, 20, 40));
    expect(drag(rectTool, { x: 50, y: 50 }, { x: 60, y: 70 }, { alt: true, shift: true }).commit).toEqual(
      rect(30, 30, 40, 40),
    );
  });
  it('click makes a 100 square centred on the point; slop scales with zoom', () => {
    expect(drag(rectTool, { x: 100, y: 100 }, { x: 101, y: 100 }).commit).toEqual(rect(50, 50, 100, 100));
    // 1 unit at zoom 0.5 is 0.5px: still a click. 4 units at zoom 2 is 8px: a drag.
    expect(drag(rectTool, { x: 0, y: 0 }, { x: 4, y: 4 }, NONE, { zoom: 2 }).commit).toEqual(rect(0, 0, 4, 4));
  });
  it('commits nothing for zero-area drags', () => {
    expect(drag(rectTool, { x: 0, y: 0 }, { x: 50, y: 0 }).commit).toBeUndefined();
  });
  it('escape cancels and resets; commit returns to initial', () => {
    let s = rectTool.pointerDown(rectTool.initial, { x: 0, y: 0 }, NONE, Z1).state;
    s = rectTool.pointerMove(s, { x: 10, y: 10 }, NONE, Z1).state;
    expect(rectTool.busy(s)).toBe(true);
    expect(rectTool.preview(s)).toEqual({ ...rect(0, 0, 10, 10), id: 'tool-preview' });
    const esc = rectTool.key(s, 'Escape', NONE, Z1);
    expect(esc.commit).toBeUndefined();
    expect(esc.state).toEqual(rectTool.initial);
    expect(rectTool.busy(esc.state)).toBe(false);
    expect(drag(rectTool, { x: 0, y: 0 }, { x: 9, y: 9 }).state).toEqual(rectTool.initial);
  });
  it('uses the latest modifiers at release', () => {
    let s = rectTool.pointerDown(rectTool.initial, { x: 0, y: 0 }, { shift: true }, Z1).state;
    s = rectTool.pointerMove(s, { x: 10, y: 20 }, { shift: true }, Z1).state;
    expect(rectTool.pointerUp(s, { x: 10, y: 20 }, NONE, Z1).commit).toEqual(rect(0, 0, 10, 20));
  });
});

describe('ellipse tool', () => {
  it('drags the bounding box', () => {
    expect(drag(ellipseTool, { x: 40, y: 30 }, { x: 10, y: 10 }).commit).toEqual(ellipse(25, 20, 15, 10));
  });
  it('shift makes a circle, alt draws from centre', () => {
    expect(drag(ellipseTool, { x: 0, y: 0 }, { x: 40, y: 20 }, { shift: true }).commit).toEqual(ellipse(20, 20, 20, 20));
    expect(drag(ellipseTool, { x: 50, y: 50 }, { x: 60, y: 70 }, { alt: true }).commit).toEqual(ellipse(50, 50, 10, 20));
  });
  it('click makes a 100x100 ellipse', () => {
    expect(drag(ellipseTool, { x: 10, y: 10 }, { x: 10, y: 10 }).commit).toEqual(ellipse(10, 10, 50, 50));
  });
  it('zero-area and escape commit nothing', () => {
    expect(drag(ellipseTool, { x: 0, y: 0 }, { x: 0, y: 30 }).commit).toBeUndefined();
    const s = ellipseTool.pointerDown(ellipseTool.initial, { x: 0, y: 0 }, NONE, Z1).state;
    expect(ellipseTool.key(s, 'Escape', NONE, Z1)).toEqual({ state: ellipseTool.initial });
  });
});

describe('line tool', () => {
  const line = (x1: number, y1: number, x2: number, y2: number) => ({
    type: 'line', id: '', x1, y1, x2, y2, ...DEFAULT_LINE_STYLE,
  });
  it('draws start to end', () => {
    expect(drag(lineTool, { x: 1, y: 2 }, { x: 11, y: 9 }).commit).toEqual(line(1, 2, 11, 9));
  });
  it('shift snaps to horizontal', () => {
    expect(drag(lineTool, { x: 0, y: 0 }, { x: 10, y: 3 }, { shift: true }).commit).toMatchObject({
      x2: expect.closeTo(Math.hypot(10, 3), 2),
      y2: 0,
    });
  });
  it('shift snaps to a diagonal keeping length', () => {
    const c = drag(lineTool, { x: 0, y: 0 }, { x: 10, y: 9 }, { shift: true }).commit as ReturnType<typeof line>;
    const len = Math.hypot(10, 9);
    expect(c.x2).toBeCloseTo(len / Math.SQRT2, 2);
    expect(c.y2).toBeCloseTo(len / Math.SQRT2, 2);
    expect(c.x2).toBe(c.y2);
  });
  it('click commits nothing', () => {
    const r = drag(lineTool, { x: 5, y: 5 }, { x: 6, y: 5 });
    expect(r.commit).toBeUndefined();
    expect(r.state).toEqual(lineTool.initial);
  });
});

describe('pen tool', () => {
  const click = (s: ReturnType<typeof penTool.pointerDown>['state'], p: ToolPoint, ctx = Z1) => {
    const d = penTool.pointerDown(s, p, NONE, ctx);
    return penTool.pointerUp(d.state, p, NONE, ctx);
  };
  const path = (d: string, closed = false) => ({
    type: 'path', id: '', d, ...DEFAULT_PATH_STYLE, ...(closed ? { fill: DEFAULT_SHAPE_STYLE.fill } : {}),
  });

  it('two corner clicks + Enter makes M L', () => {
    let s = click(penTool.initial, { x: 0, y: 0 }).state;
    s = click(s, { x: 10, y: 20 }).state;
    expect(penTool.busy(s)).toBe(true);
    const r = penTool.key(s, 'Enter', NONE, Z1);
    expect(r.commit).toEqual(path('M0 0L10 20'));
    expect(r.state).toEqual(penTool.initial);
  });

  it('dragging creates mirrored handles and C segments', () => {
    let s = click(penTool.initial, { x: 0, y: 0 }).state;
    s = penTool.pointerDown(s, { x: 100, y: 0 }, NONE, Z1).state;
    s = penTool.pointerMove(s, { x: 120, y: 30 }, NONE, Z1).state;
    s = penTool.pointerUp(s, { x: 120, y: 30 }, NONE, Z1).state;
    expect(s.nodes[1]).toEqual({ x: 100, y: 0, out: { x: 120, y: 30 }, in: { x: 80, y: -30 } });
    expect(penTool.key(s, 'Enter', NONE, Z1).commit).toEqual(path('M0 0C0 0 80 -30 100 0'));
  });

  it('shift constrains the handle angle', () => {
    let s = penTool.pointerDown(penTool.initial, { x: 0, y: 0 }, NONE, Z1).state;
    s = penTool.pointerMove(s, { x: 10, y: 3 }, { shift: true }, Z1).state;
    expect(s.nodes[0].out?.y).toBeCloseTo(0, 6);
    expect(s.nodes[0].in?.y).toBeCloseTo(0, 6);
  });

  it('closes by clicking the first node', () => {
    let s = click(penTool.initial, { x: 0, y: 0 }).state;
    s = click(s, { x: 100, y: 0 }).state;
    s = click(s, { x: 100, y: 100 }).state;
    const r = click(s, { x: 2, y: 2 });
    expect(r.commit).toEqual(path('M0 0L100 0L100 100L0 0Z', true));
    expect(r.state).toEqual(penTool.initial);
  });

  it('dragging on the close click adjusts the first node symmetrically', () => {
    let s = click(penTool.initial, { x: 0, y: 0 }).state;
    s = click(s, { x: 100, y: 0 }).state;
    s = click(s, { x: 100, y: 100 }).state;
    s = penTool.pointerDown(s, { x: 0, y: 0 }, NONE, Z1).state;
    s = penTool.pointerMove(s, { x: -20, y: 10 }, NONE, Z1).state;
    const r = penTool.pointerUp(s, { x: -20, y: 10 }, NONE, Z1);
    expect(r.commit).toEqual(path('M0 0C-20 10 100 0 100 0L100 100C100 100 20 -10 0 0Z', true));
  });

  it('close radius is in screen pixels', () => {
    const build = (ctx: ToolContext) => {
      let s = click(penTool.initial, { x: 0, y: 0 }, ctx).state;
      s = click(s, { x: 100, y: 0 }, ctx).state;
      return click(s, { x: 4, y: 0 }, ctx);
    };
    expect(build({ zoom: 1 }).commit).toBeDefined(); // 4px < 8px
    const far = build({ zoom: 4 }); // 16px > 8px: adds a node
    expect(far.commit).toBeUndefined();
    expect(far.state.nodes).toHaveLength(3);
  });

  it('does not close with fewer than 2 nodes', () => {
    const s = click(penTool.initial, { x: 0, y: 0 }).state;
    expect(click(s, { x: 1, y: 1 }).state.nodes).toHaveLength(2);
  });

  it('Backspace removes the last node, then discards', () => {
    let s = click(penTool.initial, { x: 0, y: 0 }).state;
    s = click(s, { x: 10, y: 10 }).state;
    s = penTool.key(s, 'Backspace', NONE, Z1).state;
    expect(s.nodes).toEqual([{ x: 0, y: 0 }]);
    expect(penTool.key(s, 'Backspace', NONE, Z1)).toEqual({ state: penTool.initial });
  });

  it('Escape with one node discards; unknown keys are ignored', () => {
    const s = click(penTool.initial, { x: 0, y: 0 }).state;
    expect(penTool.key(s, 'x', NONE, Z1).state).toBe(s);
    expect(penTool.key(s, 'Escape', NONE, Z1)).toEqual({ state: penTool.initial });
  });

  it('previews the path with a rubber band', () => {
    let s = click(penTool.initial, { x: 0, y: 0 }).state;
    expect(penTool.preview(s)).toBeNull();
    s = penTool.pointerMove(s, { x: 30, y: 40 }, NONE, Z1).state;
    expect(penTool.preview(s)).toEqual({ ...path('M0 0L30 40'), id: 'tool-preview' });
  });

  it('penNodesToSegments handles one-sided handles and closing', () => {
    expect(
      penNodesToSegments([{ x: 0, y: 0, out: { x: 5, y: 0 } }, { x: 10, y: 10 }], false),
    ).toEqual([
      { cmd: 'M', x: 0, y: 0 },
      { cmd: 'C', x1: 5, y1: 0, x2: 10, y2: 10, x: 10, y: 10 },
    ]);
    expect(penNodesToSegments([], true)).toEqual([]);
  });
});

describe('text tool', () => {
  const text = (x: number, y: number, t: string) => ({
    type: 'text', id: '', x, y, text: t, ...DEFAULT_TEXT_STYLE,
  });
  const place = (s: ReturnType<typeof textTool.pointerDown>['state'], p: ToolPoint) => {
    const d = textTool.pointerDown(s, p, NONE, Z1);
    return textTool.pointerUp(d.state, p, NONE, Z1);
  };

  it('places, types, and Enter commits', () => {
    let s = place(textTool.initial, { x: 10, y: 20 }).state;
    expect(s).toEqual({ phase: 'editing', at: { x: 10, y: 20 }, text: '' });
    expect(textTool.preview(s)).toBeNull();
    s = setText(s, 'Hello');
    expect(textTool.preview(s)).toEqual({ ...text(10, 20, 'Hello'), id: 'tool-preview' });
    const r = textTool.key(s, 'Enter', NONE, Z1);
    expect(r.commit).toEqual(text(10, 20, 'Hello'));
    expect(r.state).toEqual(textTool.initial);
  });

  it('Escape commits non-empty text; empty is discarded', () => {
    const s = setText(place(textTool.initial, { x: 1, y: 2 }).state, 'x');
    expect(textTool.key(s, 'Escape', NONE, Z1).commit).toEqual(text(1, 2, 'x'));
    const e = setText(place(textTool.initial, { x: 1, y: 2 }).state, '   ');
    expect(textTool.key(e, 'Enter', NONE, Z1)).toEqual({ state: textTool.initial });
  });

  it('click elsewhere commits and restarts', () => {
    const s = setText(place(textTool.initial, { x: 1, y: 2 }).state, 'one');
    const d = textTool.pointerDown(s, { x: 50, y: 60 }, NONE, Z1);
    expect(d.commit).toEqual(text(1, 2, 'one'));
    expect(d.state).toEqual({ phase: 'pending', at: { x: 50, y: 60 } });
    expect(textTool.pointerUp(d.state, { x: 50, y: 60 }, NONE, Z1).state).toEqual({
      phase: 'editing', at: { x: 50, y: 60 }, text: '',
    });
  });

  it('click elsewhere with empty text just restarts; setText is ignored when idle', () => {
    const s = place(textTool.initial, { x: 1, y: 2 }).state;
    expect(textTool.pointerDown(s, { x: 5, y: 5 }, NONE, Z1).commit).toBeUndefined();
    expect(setText(textTool.initial, 'z')).toBe(textTool.initial);
  });
});

describe('DRAW_TOOLS', () => {
  it('maps every draw tool id to its machine', () => {
    for (const [id, t] of Object.entries(DRAW_TOOLS)) expect(t.id).toBe(id);
  });
});
