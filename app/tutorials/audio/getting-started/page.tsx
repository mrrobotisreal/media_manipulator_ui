import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import AudioGettingStartedTutorial from '@/views/tutorials/audio-getting-started';

const PATH = '/tutorials/audio/getting-started';
export const metadata: Metadata = buildMetadata(PATH);

export default function Page() {
  return (
    <>
      <JsonLd path={PATH} />
      <AudioGettingStartedTutorial />
    </>
  );
}
