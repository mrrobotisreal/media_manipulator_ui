import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import ContentStudioTutorial from '@/views/tutorials/content-studio';
import { resolveLangParam } from '@/lib/i18n/routeLocale';

const PATH = '/tutorials/content-studio';

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata(PATH, resolveLangParam(lang));
}

export default async function Page({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  return (
    <>
      <JsonLd path={PATH} />
      <ContentStudioTutorial locale={locale} />
    </>
  );
}
