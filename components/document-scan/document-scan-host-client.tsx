'use client';

import dynamic from 'next/dynamic';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { withToolShards } from '@/lib/i18n/ensureShard';

// The document-scan panel is browser-only (object URLs, EventSource, dnd-kit
// pointer drag, iframe PDF render) — ssr:false keeps it out of the server
// render, exactly like the image/video restoration host islands.
const DocumentScanPanel = dynamic(() => withToolShards(() => import('@/components/document-scan/document-scan-panel')), {
  ssr: false,
  loading: () => <PanelLoading label="Loading AI Document Scan…" />,
});

export default function DocumentScanHostClient() {
  return <DocumentScanPanel enableReorder />;
}
