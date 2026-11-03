import type { HealStrokes } from '@/lib/photo/healOps';

/** The in-progress heal strokes (not part of the document). The tool overlay writes, the heal panel reads. */
export const healSession: { strokes: HealStrokes | null } = { strokes: null };
export const healStrokesRef = healSession;
export const getHealStrokes = (): HealStrokes | null => healSession.strokes;
export const setHealStrokes = (s: HealStrokes | null): void => {
  healSession.strokes = s;
};
