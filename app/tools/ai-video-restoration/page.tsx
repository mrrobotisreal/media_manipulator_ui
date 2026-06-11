import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import ToolLandingPage from '@/components/tools/tool-landing-page';
import VideoRestoreHostClient from '@/components/video-restore/video-restore-host-client';
import { TOOL_PAGES } from '@/content/toolPages';

// Dedicated static route for AI Video Restoration: the SEO copy from the
// toolPages entry server-renders as usual, but the interactive panel is the
// custom restoration island instead of the generic embedded converter —
// exactly the content-studio pattern. app/tools/[slug]/page.tsx excludes this
// slug so this route owns the URL.
export const metadata: Metadata = buildMetadata('/tools/ai-video-restoration');

export default function AiVideoRestorationRoute() {
  const tool = TOOL_PAGES.find((t) => t.slug === 'ai-video-restoration');
  if (!tool) notFound();

  return (
    <>
      <JsonLd path="/tools/ai-video-restoration" />
      <ToolLandingPage tool={tool} panel={<VideoRestoreHostClient />} />
    </>
  );
}
