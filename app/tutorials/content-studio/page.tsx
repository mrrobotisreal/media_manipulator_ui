import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import ContentStudioTutorial from '@/views/tutorials/content-studio';

const PATH = '/tutorials/content-studio';
export const metadata: Metadata = buildMetadata(PATH);

export default function Page() {
  return (
    <>
      <JsonLd path={PATH} />
      <ContentStudioTutorial />
    </>
  );
}
