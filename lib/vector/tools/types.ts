/**
 * Canvas tools. Each draw tool is a small state machine with pure reducers
 * (`rect.ts`, `ellipse.ts`, `line.ts`, `pen.ts`, `text.ts`); the canvas feeds
 * them pointer events in DOCUMENT coordinates and commits the layer they
 * produce. Analytics are not emitted here: the editor exposes a single
 * `onToolUsed(tool)` seam that MM49 wires to `vector_tool_used`.
 */
export const TOOL_IDS = ['select', 'node', 'rect', 'ellipse', 'line', 'pen', 'text', 'hand'] as const;
export type ToolId = (typeof TOOL_IDS)[number];

/** Tools that create a layer (the `onToolUsed` seam fires when one commits). */
export type DrawToolId = Extract<ToolId, 'rect' | 'ellipse' | 'line' | 'pen' | 'text'>;

/** Keyboard shortcuts (single keys, no modifier). */
export const TOOL_SHORTCUTS: Record<ToolId, string> = {
  select: 'v',
  node: 'a',
  rect: 'r',
  ellipse: 'o',
  line: 'l',
  pen: 'p',
  text: 't',
  hand: 'h',
};

export interface ToolPoint {
  x: number;
  y: number;
}

/** Modifier state at a pointer event. */
export interface ToolModifiers {
  shift?: boolean;
  alt?: boolean;
}

/** Default style a freshly drawn layer gets (the inspector edits it afterwards). */
export const DEFAULT_SHAPE_STYLE = { fill: '#3b82f6', stroke: '#1e3a8a', strokeWidth: 2 } as const;
export const DEFAULT_LINE_STYLE = { stroke: '#e5e7eb', strokeWidth: 2, strokeLinecap: 'round' } as const;
export const DEFAULT_PATH_STYLE = { fill: 'none', stroke: '#e5e7eb', strokeWidth: 2 } as const;
export const DEFAULT_TEXT_STYLE = { fill: '#e5e7eb', fontFamily: 'Inter, sans-serif', fontSize: 32 } as const;
