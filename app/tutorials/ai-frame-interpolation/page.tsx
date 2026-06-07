import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import AIFrameInterpolationTutorial from '@/views/tutorials/ai-frame-interpolation';

const PATH = '/tutorials/ai-frame-interpolation';
export const metadata: Metadata = buildMetadata(PATH);

export default function Page() {
  return (
    <>
      <JsonLd path={PATH} />
      <AIFrameInterpolationTutorial />
    </>
  );
}
