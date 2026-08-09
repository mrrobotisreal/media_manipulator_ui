import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import HowItWorksPage from '@/views/how-it-works';
import { resolveLangParam } from '@/lib/i18n/routeLocale';

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata('/how-it-works', resolveLangParam(lang));
}

export default async function HowItWorks({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  return (
    <>
      <JsonLd path="/how-it-works" />
      <HowItWorksPage locale={locale} />
    </>
  );
}
