import type { ComponentType } from 'react';
import type { Cue } from '@/lib/results/captions';
import type { ResultDescriptor, ResultKind } from '@/lib/results/describe';

/**
 * What the panel hands a viewer.
 *
 * `kind`, `fileName`, `mime` and `sizeBytes` describe the side being shown, which is the
 * result or, in the Original/Result toggle, the original. `descriptor` is always the
 * RESULT's descriptor so a viewer that needs sidecars or the job id (MM03/MM04) has them
 * on either side.
 */
export interface ViewerProps {
  role: 'original' | 'result';
  kind: ResultKind;
  /** Object URL or inline URL; null when the registry entry has `needsBlob: false`. */
  src: string | null;
  /** The bytes behind `src` when they were fetched (null for inline streaming). */
  blob: Blob | null;
  fileName: string;
  mime: string;
  sizeBytes?: number;
  descriptor: ResultDescriptor;
  /** Archive viewer: the visitor opened/played/downloaded an entry of this kind . */
  onEntryOpen?: (entryKind: ResultKind) => void;
  /** Stream viewer: the visitor picked a quality rung ('auto' or a height such as '720p'). */
  onRungSelect?: (rung: string) => void;
  /** Transcript/captions viewers: a cue timestamp moved the original media. */
  onSeek?: (cue: Cue) => void;
}

export interface ViewerEntry {
  component: ComponentType<ViewerProps>;
  /**
   * True when the viewer plays/draws the bytes, so the panel loads them through
   * `useResultBlob`. False for viewers that need no bytes up front (file cards, and later
   * archive/stream viewers that fetch for themselves).
   */
  needsBlob: boolean;
}
