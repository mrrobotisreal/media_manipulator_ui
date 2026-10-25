import { roundNum } from '@/lib/vector/num';
import { createBoxTool, type BoxState, type ToolMachine } from './machine';
import { DEFAULT_SHAPE_STYLE } from './types';

export type EllipseState = BoxState;

/** Ellipse tool: drag the bounding box (Shift circle, Alt from centre). */
export const ellipseTool: ToolMachine<EllipseState> = createBoxTool('ellipse', (b) => ({
  type: 'ellipse',
  id: '',
  cx: roundNum(b.x + b.width / 2),
  cy: roundNum(b.y + b.height / 2),
  rx: roundNum(b.width / 2),
  ry: roundNum(b.height / 2),
  ...DEFAULT_SHAPE_STYLE,
}));
