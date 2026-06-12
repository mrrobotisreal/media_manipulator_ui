'use client';

import dynamic from 'next/dynamic';

// The restoration panel is browser-only (object URLs, EventSource, pointer
// drag) — ssr:false keeps it out of the server render, exactly like the video
// restoration host island.
const ImageRestorePanel = dynamic(() => import('@/components/image-restore/image-restore-panel'), {
  ssr: false,
  loading: () => (
    <div className="my-6 rounded-lg border border-border bg-background/40 p-10 text-center text-sm text-muted-foreground">
      Loading AI Image Restoration…
    </div>
  ),
});

export default function ImageRestoreHostClient() {
  return <ImageRestorePanel />;
}
