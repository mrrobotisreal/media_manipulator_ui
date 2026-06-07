// Renders the JSON-LD structured-data blocks for a route as <script> tags in
// the page body. This is a Server Component (no "use client"), so the markup
// is part of the prerendered HTML that crawlers read directly — mirroring the
// behavior the Vite prerender script produced.

import { getSeoForPath, type JsonLd as JsonLdBlock } from '@/lib/seo';

/** Render an explicit array of JSON-LD blocks as <script> tags. */
export function JsonLdBlocks({ blocks }: { blocks: JsonLdBlock[] }) {
  if (!blocks.length) return null;
  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}

/** Render the JSON-LD blocks for a known route (from lib/seo.ts). */
export function JsonLd({ path }: { path: string }) {
  return <JsonLdBlocks blocks={getSeoForPath(path).jsonLd} />;
}

export default JsonLd;
