import { roundNum } from '@/lib/vector/num';
import { createBoxTool, type BoxState, type ToolMachine } from './machine';
import { DEFAULT_SHAPE_STYLE } from './types';

export type RectState = BoxState;

/** Rectangle tool: press-drag corner to corner (Shift square, Alt from centre). */
export const rectTool: ToolMachine<RectState> = createBoxTool('rect', (b) => ({
  type: 'rect',
  id: '',
  x: roundNum(b.x),
  y: roundNum(b.y),
  width: roundNum(b.width),
  height: roundNum(b.height),
  ...DEFAULT_SHAPE_STYLE,
}));
