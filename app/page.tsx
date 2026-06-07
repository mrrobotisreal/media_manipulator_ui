import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import FileConverterApp from '@/views/file-converter-app';

export const metadata: Metadata = buildMetadata('/');

export default function HomePage() {
  return (
    <>
      <JsonLd path="/" />
      <FileConverterApp />
    </>
  );
}
