import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import HomeContent from '@/components/home/home-content';
import FileConverterApp from '@/views/file-converter-app';
import { resolveLangParam } from '@/lib/i18n/routeLocale';

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata('/', resolveLangParam(lang));
}

export default async function HomePage({ params }: PageParams) {
  const { lang } = await params;
  resolveLangParam(lang);
  return (
    <>
      <JsonLd path="/" />
      <FileConverterApp />
      {/* Server-rendered, so this prose is in the crawlable HTML rather than
          behind the client island above. */}
      <HomeContent />
    </>
  );
}
