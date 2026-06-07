import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import ImageGettingStartedTutorial from '@/views/tutorials/image-getting-started';

const PATH = '/tutorials/image/getting-started';
export const metadata: Metadata = buildMetadata(PATH);

export default function Page() {
  return (
    <>
      <JsonLd path={PATH} />
      <ImageGettingStartedTutorial />
    </>
  );
}
