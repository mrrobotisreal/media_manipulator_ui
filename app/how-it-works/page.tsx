import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import HowItWorksPage from '@/views/how-it-works';

export const metadata: Metadata = buildMetadata('/how-it-works');

export default function HowItWorks() {
  return (
    <>
      <JsonLd path="/how-it-works" />
      <HowItWorksPage />
    </>
  );
}
