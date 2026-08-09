import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import PrivacyPolicyPage from '@/views/privacy-policy';
import { resolveLangParam } from '@/lib/i18n/routeLocale';

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return buildMetadata('/privacy-policy', resolveLangParam(lang));
}

export default async function PrivacyPolicy({ params }: PageParams) {
  const { lang } = await params;
  const locale = resolveLangParam(lang);
  return (
    <>
      <JsonLd path="/privacy-policy" />
      <PrivacyPolicyPage locale={locale} />
    </>
  );
}
