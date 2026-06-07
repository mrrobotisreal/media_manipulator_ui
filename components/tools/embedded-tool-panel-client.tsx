'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type EmbeddedToolPanel from '@/components/embedded-tool-panel';

// The embedded converter/editor panel is browser-only (file inputs, drag/drop,
// object URLs, media APIs). It is loaded with ssr:false so it never runs during
// prerender — the rich, crawlable tool copy around it is server-rendered.
const Panel = dynamic(() => import('@/components/embedded-tool-panel'), {
  ssr: false,
  loading: () => (
    <div className="my-6 rounded-lg border border-border bg-background/40 p-8 text-center text-sm text-muted-foreground">
      Loading tool…
    </div>
  ),
});

type Props = ComponentProps<typeof EmbeddedToolPanel>;

export default function EmbeddedToolPanelClient(props: Props) {
  return <Panel {...props} />;
}
