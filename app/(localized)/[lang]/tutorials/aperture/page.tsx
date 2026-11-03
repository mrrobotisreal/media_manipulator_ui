import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import ApertureTutorial from '@/views/tutorials/aperture';
import { resolveLangParam } from '@/lib/i18n/routeLocale';

const PATH = '/tutorials/aperture';

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
      <ApertureTutorial locale={locale} />
    </>
  );
}
