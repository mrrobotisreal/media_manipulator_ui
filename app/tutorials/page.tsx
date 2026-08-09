import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import TutorialsPage from '@/views/tutorials';
import { getRequestLocale } from '@/lib/i18n/requestLocale';

export const metadata: Metadata = buildMetadata('/tutorials');

export default async function Tutorials() {
  const locale = await getRequestLocale();
  return (
    <>
      <JsonLd path="/tutorials" />
      <TutorialsPage locale={locale} />
    </>
  );
}
