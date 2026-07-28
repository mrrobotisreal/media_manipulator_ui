'use client';

import ReactDOM from 'react-dom';

interface ResourceHintsProps {
  /** Origins to open a full connection to (DNS + TCP + TLS) ahead of use. */
  preconnect?: Array<{ href: string; crossOrigin?: 'anonymous' | 'use-credentials' }>;
  /** Origins to resolve DNS for only — cheaper, for less certain third parties. */
  dnsPrefetch?: string[];
}

/**
 * Emits `<link rel="preconnect">` / `<link rel="dns-prefetch">` into the head.
 *
 * The Metadata API has no field for resource hints; Next 16 documents the
 * `ReactDOM` float methods as the supported way to insert them
 * (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`,
 * "Resource hints"). They deduplicate, so mounting this on a route as well as
 * in the root layout is safe.
 *
 * Keep the list short. A preconnect holds a socket open for ~10s; more than a
 * handful of them competes with the connections the page actually needs, and
 * Lighthouse flags unused ones.
 */
export function ResourceHints({ preconnect = [], dnsPrefetch = [] }: ResourceHintsProps) {
  for (const { href, crossOrigin } of preconnect) {
    ReactDOM.preconnect(href, crossOrigin ? { crossOrigin } : undefined);
  }
  for (const href of dnsPrefetch) {
    ReactDOM.prefetchDNS(href);
  }
  return null;
}

export default ResourceHints;
