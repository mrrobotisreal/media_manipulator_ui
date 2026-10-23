import type { ResultKind } from '@/lib/results/describe';
import { AudioCompare } from './audio-compare';
import { ImageCompare } from './image-compare';
import type { CompareEntry, CompareMode } from './types';
import { VideoCompareView } from './video-compare-view';

export type { CompareEntry, CompareMode, CompareSide, CompareViewProps } from './types';

/**
 * The compare registry: `ResultKind` -> synced compare view, mirroring the viewer registry.
 * A kind with no entry (and gif) falls back to the panel's Original/Result toggle. MM04 adds
 * `archive` (video restoration original vs model) by adding one entry here.
 */
export const RESULT_COMPARES: Partial<Record<ResultKind, CompareEntry>> = {
  image: {
    modes: ['wipe', 'side_by_side', 'toggle'],
    defaultMode: 'wipe',
    originals: ['image'],
    component: ImageCompare,
  },
  video: {
    modes: ['side_by_side', 'wipe', 'toggle'],
    defaultMode: 'side_by_side',
    originals: ['video'],
    component: VideoCompareView,
  },
  audio: {
    modes: ['ab'],
    defaultMode: 'ab',
    originals: ['audio', 'video'],
    component: AudioCompare,
  },
};

export function compareFor(kind: ResultKind): CompareEntry | undefined {
  return RESULT_COMPARES[kind];
}

const storageKey = (kind: ResultKind) => `mm.result.compareMode.${kind}`;

/** Remembered mode for a kind, if it is still one the entry offers. */
export function readCompareMode(kind: ResultKind, entry: CompareEntry): CompareMode {
  try {
    const stored = globalThis.sessionStorage?.getItem(storageKey(kind));
    if (stored && (entry.modes as string[]).includes(stored)) return stored as CompareMode;
  } catch {
    // storage blocked
  }
  return entry.defaultMode;
}

export function writeCompareMode(kind: ResultKind, mode: CompareMode): void {
  try {
    globalThis.sessionStorage?.setItem(storageKey(kind), mode);
  } catch {
    // storage blocked
  }
}
