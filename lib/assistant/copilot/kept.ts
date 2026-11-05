/**
 * MM113: the "edit kept" ledger. An applied Medi edit that is still applied (not undone) when the
 * visitor exports, saves or leaves the editor is an implicit thumbs-up: `assistant_edit_kept
 * {surface, outcome}`, once per edit. Module-level on purpose: the copilot panel can be closed (and
 * unmounted) between the edit and the export, while the edit stays in the document.
 *
 * `useCopilot` records every applied edit and forgets it on undo; the editors call `flushKept` at
 * their own export/save success points and when they unmount; `pagehide` covers closing the tab.
 */
import * as React from 'react';

import { EVENTS } from '@/lib/analytics/events';
import type { AssistantKeptOutcome, AssistantSurfaceProp } from '@/lib/analytics/events';
import type { AssistantTrack } from '@/lib/assistant/useAssistantStream';

interface Entry {
  id: string;
  surface: AssistantSurfaceProp;
  track: AssistantTrack;
}

let ledger: Entry[] = [];
let listening = false;

function onPageHide(): void {
  flushKept('session_end');
}

function ensureListener(): void {
  if (listening || typeof window === 'undefined') return;
  listening = true;
  window.addEventListener('pagehide', onPageHide);
}

/** A Medi edit landed in the document. `id` is unique per edit (the stream's call id). */
export function noteKeptCandidate(id: string, surface: AssistantSurfaceProp, track: AssistantTrack): void {
  ledger = ledger.filter((e) => e.id !== id);
  ledger.push({ id, surface, track });
  ensureListener();
}

/** The edit was undone: it no longer counts as kept. */
export function noteUndone(id: string): void {
  ledger = ledger.filter((e) => e.id !== id);
}

/** How many edits are waiting (tests, and the editors' unmount guard). */
export function keptPending(surface?: AssistantSurfaceProp): number {
  return ledger.filter((e) => !surface || e.surface === surface).length;
}

/**
 * Report every waiting edit (of one surface, or all) as kept with `outcome` and forget it.
 * Safe to call when nothing is waiting.
 */
export function flushKept(outcome: AssistantKeptOutcome, surface?: AssistantSurfaceProp): void {
  if (ledger.length === 0) return;
  const mine = ledger.filter((e) => !surface || e.surface === surface);
  ledger = ledger.filter((e) => surface && e.surface !== surface);
  for (const e of mine) {
    try {
      e.track(EVENTS.ASSISTANT_EDIT_KEPT, { surface: e.surface, outcome });
    } catch {
      // analytics must never break an export or a save
    }
  }
}

/**
 * An editor calls this once: its unmount (leaving the editor) reports the surface's still-kept edits
 * as `session_end`; `pagehide` covers closing the tab.
 */
export function useKeptSessionEnd(surface: AssistantSurfaceProp): void {
  React.useEffect(() => () => flushKept('session_end', surface), [surface]);
}

/** Test helper. */
export function resetKept(): void {
  ledger = [];
}
