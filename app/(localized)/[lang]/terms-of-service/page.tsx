import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import TermsOfServicePage from '@/views/terms-of-service';
import { resolveLangParam } from '@/lib/i18n/routeLocale';

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata('/terms-of-service', resolveLangParam(lang));
}

export default async function TermsOfService({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  return (
    <>
      <JsonLd path="/terms-of-service" />
      <TermsOfServicePage locale={locale} />
    </>
  );
}
