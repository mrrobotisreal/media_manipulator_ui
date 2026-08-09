import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import ToolLandingPage from '@/components/tools/tool-landing-page';
import DocumentScanHostClient from '@/components/document-scan/document-scan-host-client';
import { TOOL_PAGES } from '@/content/toolPages';
import { resolveLangParam } from '@/lib/i18n/routeLocale';

type PageParams = { params: Promise<{ lang: string }> };

// Dedicated static route for AI Document Scan: the SEO copy from the toolPages
// entry server-renders as usual, but the interactive panel is the custom
// document-scan island (multi-page upload, reorder, PDF viewer modal) instead of
// the generic embedded converter — exactly the ai-image-restoration pattern.
// app/tools/[slug]/page.tsx excludes this slug so this route owns the URL.
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata('/tools/ai-document-scan', resolveLangParam(lang));
}

export default async function AiDocumentScanRoute({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  const tool = TOOL_PAGES.find((t) => t.slug === 'ai-document-scan');
  if (!tool) notFound();

  return (
    <>
      <JsonLd path="/tools/ai-document-scan" />
      <ToolLandingPage tool={tool} panel={<DocumentScanHostClient />} locale={locale} />
    </>
  );
}
