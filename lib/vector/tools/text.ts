import { roundNum } from '@/lib/vector/num';
import type { TextLayer } from '@/lib/vector/vectorTypes';
import type { ToolMachine, ToolStep } from './machine';
import { DEFAULT_TEXT_STYLE, type ToolPoint } from './types';

export type TextState =
  | { phase: 'idle' }
  | { phase: 'pending'; at: ToolPoint }
  | { phase: 'editing'; at: ToolPoint; text: string };

const INITIAL: TextState = { phase: 'idle' };

/** Updates the text being edited (ignored unless editing). */
export function setText(s: TextState, text: string): TextState {
  return s.phase === 'editing' ? { ...s, text } : s;
}

function layer(at: ToolPoint, text: string): TextLayer {
  return { type: 'text', id: '', x: roundNum(at.x), y: roundNum(at.y), text, ...DEFAULT_TEXT_STYLE };
}

function commitEditing(s: TextState): ToolStep<TextState> {
  if (s.phase === 'editing' && s.text.trim() !== '') {
    return { state: INITIAL, commit: layer(s.at, s.text) };
  }
  return { state: INITIAL };
}

/** Text tool: click to place, type in the canvas overlay (`setText`), Enter/Escape commit. */
export const textTool: ToolMachine<TextState> = {
  id: 'text',
  initial: INITIAL,
  pointerDown(s, p) {
    const pending: TextState = { phase: 'pending', at: p };
    if (s.phase === 'editing') return { ...commitEditing(s), state: pending };
    return { state: pending };
  },
  pointerMove: (s) => ({ state: s }),
  pointerUp: (s) =>
    s.phase === 'pending' ? { state: { phase: 'editing', at: s.at, text: '' } } : { state: s },
  key(s, key) {
    if (s.phase === 'editing' && (key === 'Enter' || key === 'Escape')) return commitEditing(s);
    return { state: s };
  },
  preview(s) {
    if (s.phase !== 'editing' || s.text === '') return null;
    return { ...layer(s.at, s.text), id: 'tool-preview' };
  },
  busy: (s) => s.phase !== 'idle',
};
