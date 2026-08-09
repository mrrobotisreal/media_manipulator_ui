import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import PrivacyPolicyPage from '@/views/privacy-policy';
import { getRequestLocale } from '@/lib/i18n/requestLocale';

export const metadata: Metadata = buildMetadata('/privacy-policy');

export default async function PrivacyPolicy() {
  const locale = await getRequestLocale();
  return (
    <>
      <JsonLd path="/privacy-policy" />
      <PrivacyPolicyPage locale={locale} />
    </>
  );
}
