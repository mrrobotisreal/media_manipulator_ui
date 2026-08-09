import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import HowItWorksPage from '@/views/how-it-works';
import { getRequestLocale } from '@/lib/i18n/requestLocale';

export const metadata: Metadata = buildMetadata('/how-it-works');

export default async function HowItWorks() {
  const locale = await getRequestLocale();
  return (
    <>
      <JsonLd path="/how-it-works" />
      <HowItWorksPage locale={locale} />
    </>
  );
}
