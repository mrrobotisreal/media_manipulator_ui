import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import AboutPage from '@/views/about';

export const metadata: Metadata = buildMetadata('/about');

export default function About() {
  return (
    <>
      <JsonLd path="/about" />
      <AboutPage />
    </>
  );
}
