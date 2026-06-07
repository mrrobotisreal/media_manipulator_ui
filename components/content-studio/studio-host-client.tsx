'use client';

import dynamic from 'next/dynamic';

// The Content Studio editor is fully browser-only (canvas compositing, media
// playback, project state). It loads with ssr:false so it never runs during
// prerender; the page's guide content is server-rendered around it.
const StudioHost = dynamic(() => import('@/components/content-studio/studio-host'), {
  ssr: false,
  loading: () => (
    <div className="my-6 rounded-lg border border-border bg-background/40 p-10 text-center text-sm text-muted-foreground">
      Loading Content Studio…
    </div>
  ),
});

export default function StudioHostClient() {
  return <StudioHost />;
}
