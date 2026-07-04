'use client';

import dynamic from 'next/dynamic';

// The document-scan panel is browser-only (object URLs, EventSource, dnd-kit
// pointer drag, iframe PDF render) — ssr:false keeps it out of the server
// render, exactly like the image/video restoration host islands.
const DocumentScanPanel = dynamic(() => import('@/components/document-scan/document-scan-panel'), {
  ssr: false,
  loading: () => (
    <div className="my-6 rounded-lg border border-border bg-background/40 p-10 text-center text-sm text-muted-foreground">
      Loading AI Document Scan…
    </div>
  ),
});

export default function DocumentScanHostClient() {
  return <DocumentScanPanel enableReorder />;
}
