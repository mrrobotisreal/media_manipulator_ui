import { ellipseTool } from './ellipse';
import { lineTool } from './line';
import type { ToolMachine } from './machine';
import { penTool } from './pen';
import { rectTool } from './rect';
import { textTool } from './text';
import type { DrawToolId } from './types';

/** Every draw tool's machine, keyed by tool id. */
export const DRAW_TOOLS = {
  rect: rectTool,
  ellipse: ellipseTool,
  line: lineTool,
  pen: penTool,
  text: textTool,
  // State types differ per tool; callers index by id and treat the state opaquely.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} satisfies Record<DrawToolId, ToolMachine<any>>;

export * from './types';
export * from './machine';
export * from './rect';
export * from './ellipse';
export * from './line';
export * from './pen';
export * from './text';
