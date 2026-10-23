'use client';

import type { ViewerProps } from './types';

/** Video: the native controls on whichever URL the panel resolved (blob or inline). */
export function VideoViewer({ src, role, descriptor }: ViewerProps) {
  if (!src) return null;
  return (
    <video
      key={`${descriptor.jobId}-${role}`}
      src={src}
      controls
      playsInline
      preload="metadata"
      className="max-h-[calc(100dvh-20rem)] max-w-full rounded-lg bg-surface-0"
    />
  );
}

export default VideoViewer;
