import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import AboutPage from '@/views/about';
import { getRequestLocale } from '@/lib/i18n/requestLocale';

export const metadata: Metadata = buildMetadata('/about');

export default async function About() {
  const locale = await getRequestLocale();
  return (
    <>
      <JsonLd path="/about" />
      <AboutPage locale={locale} />
    </>
  );
}
