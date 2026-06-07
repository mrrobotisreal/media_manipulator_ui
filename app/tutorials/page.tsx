import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import TutorialsPage from '@/views/tutorials';

export const metadata: Metadata = buildMetadata('/tutorials');

export default function Tutorials() {
  return (
    <>
      <JsonLd path="/tutorials" />
      <TutorialsPage />
    </>
  );
}
