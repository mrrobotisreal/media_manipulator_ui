import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import ToolLandingPage from '@/components/tools/tool-landing-page';
import ImageRestoreHostClient from '@/components/image-restore/image-restore-host-client';
import { TOOL_PAGES } from '@/content/toolPages';

// Dedicated static route for AI Image Restoration: the SEO copy from the
// toolPages entry server-renders as usual, but the interactive panel is the
// custom restoration island instead of the generic embedded converter —
// exactly the ai-video-restoration pattern. app/tools/[slug]/page.tsx excludes
// this slug so this route owns the URL.
export const metadata: Metadata = buildMetadata('/tools/ai-image-restoration');

export default function AiImageRestorationRoute() {
  const tool = TOOL_PAGES.find((t) => t.slug === 'ai-image-restoration');
  if (!tool) notFound();

  return (
    <>
      <JsonLd path="/tools/ai-image-restoration" />
      <ToolLandingPage tool={tool} panel={<ImageRestoreHostClient />} />
    </>
  );
}
