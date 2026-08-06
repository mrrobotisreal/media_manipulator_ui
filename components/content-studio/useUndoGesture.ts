'use client';

import React from 'react';
import { useStudioStore } from '@/lib/studioStore';

/**
 * useUndoGesture — bridges continuous controls to the store's history gesture
 * API (ADR ui/0001) so a whole slider scrub or text-editing session collapses
 * into a single undo entry.
 *
 * Sliders (Radix): call `begin()` from `onValueChange` — idempotent, only the
 * first change opens the gesture — and `end()` from `onValueCommit`.
 * Text/number/color inputs: call `begin()` from `onFocus` and `end()` from
 * `onBlur`, so edits batch per focus session instead of per keystroke.
 *
 * A gesture left open (control unmounts mid-drag) is closed on unmount so
 * history capture is never left suspended.
 */
export function useUndoGesture(): { begin: () => void; end: () => void } {
  const active = React.useRef(false);
  const begin = React.useCallback(() => {
    if (active.current) return;
    active.current = true;
    useStudioStore.getState().beginGesture();
  }, []);
  const end = React.useCallback(() => {
    if (!active.current) return;
    active.current = false;
    useStudioStore.getState().endGesture();
  }, []);
  React.useEffect(() => end, [end]);
  return { begin, end };
}
