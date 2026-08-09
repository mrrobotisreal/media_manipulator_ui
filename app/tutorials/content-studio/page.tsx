import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import ContentStudioTutorial from '@/views/tutorials/content-studio';
import { getRequestLocale } from '@/lib/i18n/requestLocale';

const PATH = '/tutorials/content-studio';
export const metadata: Metadata = buildMetadata(PATH);

export default async function Page() {
  const locale = await getRequestLocale();
  return (
    <>
      <JsonLd path={PATH} />
      <ContentStudioTutorial locale={locale} />
    </>
  );
}
