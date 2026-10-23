'use client';

import { VideoCompare } from './video-compare';
import type { CompareViewProps } from './types';

/** Registry adapter: CompareViewProps -> VideoCompare's plain-URL API. */
export function VideoCompareView({ mode, original, result, targetFps }: CompareViewProps) {
  const m = mode === 'wipe' || mode === 'toggle' ? mode : 'side_by_side';
  return <VideoCompare mode={m} originalSrc={original.src} resultSrc={result.src} targetFps={targetFps} />;
}
