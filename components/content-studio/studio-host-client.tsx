'use client';

import dynamic from 'next/dynamic';
import { PanelLoading } from '@/components/darkroom/panel-loading';

// The Content Studio editor is fully browser-only (canvas compositing, media
// playback, project state). It loads with ssr:false so it never runs during
// prerender; the page's guide content is server-rendered around it.
const StudioHost = dynamic(() => import('@/components/content-studio/studio-host'), {
  ssr: false,
  loading: () => <PanelLoading label="Loading Darkroom…" />,
});

export default function StudioHostClient() {
  // `embedded` — the surrounding ToolLandingPage already provides the width
  // cap, gutter, Panel surface and <h1>. See the prop's docblock in
  // studio-host.tsx (fixes B10, the 360px squeeze).
  return <StudioHost embedded />;
}
