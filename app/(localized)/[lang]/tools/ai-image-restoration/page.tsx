import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildToolMetadata } from '@/lib/metadata';
import { ToolJsonLd } from '@/components/seo/tool-json-ld';
import ToolLandingPage from '@/components/tools/tool-landing-page';
import ImageRestoreHostClient from '@/components/image-restore/image-restore-host-client';
import { getLocalizedToolBySlug } from '@/i18n/toolPageContent';
import { resolveLangParam } from '@/lib/i18n/routeLocale';

type PageParams = { params: Promise<{ lang: string }> };

// Dedicated static route for AI Image Restoration: the SEO copy from the
// toolPages entry server-renders as usual, but the interactive panel is the
// custom restoration island instead of the generic embedded converter —
// exactly the ai-video-restoration pattern. app/tools/[slug]/page.tsx excludes
// this slug so this route owns the URL.
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return buildToolMetadata('ai-image-restoration', resolveLangParam(lang));
}

export default async function AiImageRestorationRoute({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  // MM86: the localized entry (English where the locale has no override).
  const tool = getLocalizedToolBySlug('ai-image-restoration', locale);
  if (!tool) notFound();

  return (
    <>
      <ToolJsonLd tool={tool} locale={locale} />
      <ToolLandingPage tool={tool} panel={<ImageRestoreHostClient />} locale={locale} />
    </>
  );
}
