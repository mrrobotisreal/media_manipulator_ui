/**
 * `file_selected` / `file_rejected`: the entry to the tool funnel, in one place.
 *
 * WHY SHARED. Three surfaces let a visitor choose a file — the homepage converter, the
 * embedded tool panel, and the specialized tool shell — and each has a picker path and a
 * drop path. That is six call sites for one funnel step. They had already drifted once
 * (the homepage's two paths disagreed about which properties they sent), and
 * `file_rejected` had zero producers anywhere despite being in the catalog since Part 1.
 *
 * THE TWO EVENTS ARE MUTUALLY EXCLUSIVE FOR AN UNSUPPORTED TYPE, AND NOT FOR SIZE. That
 * asymmetry is deliberate and reflects what the UI actually does:
 *
 *   - Unsupported type: the surface renders "unsupported file" and offers no form. The file
 *     never enters the funnel, so counting it as a selection would depress every downstream
 *     conversion rate while hiding the more interesting fact — that someone wanted a format
 *     we do not support, which is the single best "what should we build next" signal the
 *     site produces.
 *   - Over the tier's file-size ceiling: nothing is blocked client-side. The visitor can
 *     press convert and the API answers 413. So the selection really happened, and the
 *     rejection is an ADDITIONAL fact about it — the moment a visitor met the paywall,
 *     which is a monetization signal, not a taxonomy signal.
 *
 * NO FILENAMES, EVER. `safeFileExtension` is the only thing derived from `file.name`. On a
 * media site a filename is personal data ("passport scan.jpg", "Q3 layoffs.docx") and the
 * extension answers every question we actually have.
 */

import { EVENTS, normalizeMediaKind, safeFileExtension, sizeInMb, type EventName, type MediaKind, type PropsFor, type TrackOptions } from './events';

/** The tool-scoped `track` from `useToolAnalytics()`. */
type TrackFn = <E extends EventName>(name: E, props?: PropsFor<E>, options?: TrackOptions) => void;

export interface FileChoiceOptions {
  /** Which gesture chose the file. Drag-and-drop vs click is a real UX signal here. */
  source?: 'picker' | 'drop';
  /**
   * True when the surface will refuse to offer a conversion for this file. Passed in
   * rather than computed, because "supported" means something different per surface — the
   * homepage handles four media kinds, a locked tool page handles one.
   */
  unsupported?: boolean;
  /**
   * The caller's tier file-size ceiling, when known. Omit while the tier is still
   * resolving: guessing a limit would invent rejections that never happened.
   */
  limitBytes?: number;
}

/**
 * Emit the right funnel event for a chosen file, and report whether it was accepted.
 *
 * Returns false only for the unsupported-type rejection, so a caller can `return` early
 * if it wants to skip its own selection bookkeeping. Callers that still want to select the
 * file may ignore the result — the events are correct either way.
 */
export function trackFileChoice(
  track: TrackFn,
  file: File,
  fileKind: string | null | undefined,
  options: FileChoiceOptions = {},
): boolean {
  const mediaKind: MediaKind | undefined = normalizeMediaKind(fileKind);
  const extension = safeFileExtension(file.name);

  if (options.unsupported) {
    track(
      EVENTS.FILE_REJECTED,
      { reason: 'unsupported_type', file_extension: extension, size_bytes: file.size },
      { media_kind: mediaKind },
    );
    return false;
  }

  track(
    EVENTS.FILE_SELECTED,
    {
      file_extension: extension,
      size_bytes: file.size,
      file_size_mb: sizeInMb(file.size),
      media_kind: mediaKind,
      ...(options.source ? { source: options.source } : {}),
    },
    { media_kind: mediaKind },
  );

  if (options.limitBytes && file.size > options.limitBytes) {
    track(
      EVENTS.FILE_REJECTED,
      {
        reason: 'too_large',
        file_extension: extension,
        size_bytes: file.size,
        limit_bytes: options.limitBytes,
      },
      { media_kind: mediaKind },
    );
  }

  return true;
}
