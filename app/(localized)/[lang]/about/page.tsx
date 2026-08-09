import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import AboutPage from '@/views/about';
import { resolveLangParam } from '@/lib/i18n/routeLocale';

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata('/about', resolveLangParam(lang));
}

export default async function About({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  return (
    <>
      <JsonLd path="/about" />
      <AboutPage locale={locale} />
    </>
  );
}
