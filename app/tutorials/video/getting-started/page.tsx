import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import VideoGettingStartedTutorial from '@/views/tutorials/video-getting-started';

const PATH = '/tutorials/video/getting-started';
export const metadata: Metadata = buildMetadata(PATH);

export default function Page() {
  return (
    <>
      <JsonLd path={PATH} />
      <VideoGettingStartedTutorial />
    </>
  );
}
