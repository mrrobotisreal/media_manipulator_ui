'use client';

import dynamic from 'next/dynamic';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { withToolShards } from '@/lib/i18n/ensureShard';

// The restoration panel is browser-only (object URLs, EventSource, pointer
// drag) — ssr:false keeps it out of the server render, exactly like the
// Content Studio host island.
const VideoRestorePanel = dynamic(() => withToolShards(() => import('@/components/video-restore/video-restore-panel')), {
  ssr: false,
  loading: () => <PanelLoading label="Loading AI Video Restoration…" />,
});

export default function VideoRestoreHostClient() {
  return <VideoRestorePanel />;
}
