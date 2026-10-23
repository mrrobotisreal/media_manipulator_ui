import type { ComponentType } from 'react';
import type { ResultDescriptor, ResultKind } from '@/lib/results/describe';

/** Original-vs-result view modes. `ab` is audio's gapless A/B; `toggle` is one side at a time. */
export type CompareMode = 'wipe' | 'side_by_side' | 'toggle' | 'ab';

export interface CompareSide {
  /** Object URL or inline URL; the compare views never fetch. */
  src: string;
  fileName: string;
  mime: string;
  sizeBytes?: number;
}

export interface CompareViewProps {
  mode: CompareMode;
  original: CompareSide;
  result: CompareSide;
  descriptor: ResultDescriptor;
  /** Known target frame rate of the result (interpolation tool); shown as "target". */
  targetFps?: number | null;
}

export interface CompareEntry {
  /** Offered modes in display order. */
  modes: CompareMode[];
  defaultMode: CompareMode;
  /** Original kinds this view can compare against (audio also takes a video's soundtrack). */
  originals: ResultKind[];
  component: ComponentType<CompareViewProps>;
}
