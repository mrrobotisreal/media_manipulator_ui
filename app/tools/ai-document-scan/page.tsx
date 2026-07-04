import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import ToolLandingPage from '@/components/tools/tool-landing-page';
import DocumentScanHostClient from '@/components/document-scan/document-scan-host-client';
import { TOOL_PAGES } from '@/content/toolPages';

// Dedicated static route for AI Document Scan: the SEO copy from the toolPages
// entry server-renders as usual, but the interactive panel is the custom
// document-scan island (multi-page upload, reorder, PDF viewer modal) instead of
// the generic embedded converter — exactly the ai-image-restoration pattern.
// app/tools/[slug]/page.tsx excludes this slug so this route owns the URL.
export const metadata: Metadata = buildMetadata('/tools/ai-document-scan');

export default function AiDocumentScanRoute() {
  const tool = TOOL_PAGES.find((t) => t.slug === 'ai-document-scan');
  if (!tool) notFound();

  return (
    <>
      <JsonLd path="/tools/ai-document-scan" />
      <ToolLandingPage tool={tool} panel={<DocumentScanHostClient />} />
    </>
  );
}
