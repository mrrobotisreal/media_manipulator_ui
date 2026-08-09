import { notFound } from 'next/navigation';

/**
 * Catch-all inside the `[lang]` segment: any path that no page above claimed
 * is a 404, rendered by the sibling `not-found.tsx` inside the localized root
 * layout. This also catches unknown top-level paths — the proxy rewrites
 * `/no-such-page` to `/en/no-such-page`, which lands here — and unmatched
 * `/dr/**` / `/embed/**` leftovers that backtrack into the dynamic segment.
 */
export default function CatchAllNotFound(): never {
  notFound();
}
