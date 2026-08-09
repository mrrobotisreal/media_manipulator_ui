import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import TermsOfServicePage from '@/views/terms-of-service';
import { getRequestLocale } from '@/lib/i18n/requestLocale';

export const metadata: Metadata = buildMetadata('/terms-of-service');

export default async function TermsOfService() {
  const locale = await getRequestLocale();
  return (
    <>
      <JsonLd path="/terms-of-service" />
      <TermsOfServicePage locale={locale} />
    </>
  );
}
