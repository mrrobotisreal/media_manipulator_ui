'use client';

import dynamic from 'next/dynamic';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { withToolShards } from '@/lib/i18n/ensureShard';

// The restoration panel is browser-only (object URLs, EventSource, pointer
// drag) — ssr:false keeps it out of the server render, exactly like the video
// restoration host island.
const ImageRestorePanel = dynamic(() => withToolShards(() => import('@/components/image-restore/image-restore-panel')), {
  ssr: false,
  loading: () => <PanelLoading label="Loading AI Image Restoration…" />,
});

export default function ImageRestoreHostClient() {
  return <ImageRestorePanel />;
}
