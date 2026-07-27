import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import HomeContent from '@/components/home/home-content';
import FileConverterApp from '@/views/file-converter-app';

export const metadata: Metadata = buildMetadata('/');

export default function HomePage() {
  return (
    <>
      <JsonLd path="/" />
      <FileConverterApp />
      {/* Server-rendered, so this prose is in the crawlable HTML rather than
          behind the client island above. */}
      <HomeContent />
    </>
  );
}
