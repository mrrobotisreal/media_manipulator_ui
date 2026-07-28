'use client';

import dynamic from 'next/dynamic';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import type { ComponentProps } from 'react';
import type EmbeddedToolPanel from '@/components/embedded-tool-panel';
import { withToolShards } from '@/lib/i18n/ensureShard';

// The embedded converter/editor panel is browser-only (file inputs, drag/drop,
// object URLs, media APIs). It is loaded with ssr:false so it never runs during
// prerender — the rich, crawlable tool copy around it is server-rendered.
// `withToolShards` merges the forms/panels translation shards first, so the
// panel never renders against missing keys.
const Panel = dynamic(() => withToolShards(() => import('@/components/embedded-tool-panel')), {
  ssr: false,
  loading: () => <PanelLoading label="Loading the tool…" />,
});

type Props = ComponentProps<typeof EmbeddedToolPanel>;

export default function EmbeddedToolPanelClient(props: Props) {
  return <Panel {...props} />;
}
