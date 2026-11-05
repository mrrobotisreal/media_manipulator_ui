/**
 * MM109: bridges that let Medi's suggested-action buttons open Darkroom flows owned by other
 * components, the eyedropper pattern (`eyedropper.ts`): the owning component registers an opener
 * while mounted; the copilot adapter calls it only when the user clicks the button, so nothing
 * spends allowance until then.
 */
type Opener<A extends unknown[]> = ((...args: A) => void) | null;

function bridge<A extends unknown[]>() {
  let fn: Opener<A> = null;
  return {
    register(next: Opener<A>): void {
      fn = next;
    },
    /** True when a mounted component handled the request. */
    request(...args: A): boolean {
      if (!fn) return false;
      fn(...args);
      return true;
    },
  };
}

/** Caption lane: generate captions (optional language code; the lane confirms an overwrite). */
export const captionGenerateBridge = bridge<[language: string | null]>();
/** Media bin: open the Generate voiceover dialog, optionally prefilled. */
export const voiceoverBridge = bridge<[text: string | null]>();
/** Toolbar: open the export dialog. */
export const exportDialogBridge = bridge<[]>();
