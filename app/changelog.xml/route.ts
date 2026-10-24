import { buildChangelogRss } from '@/lib/changelogRss';

// RSS 2.0 feed of content/changelog.ts, built once at build time.
export const dynamic = 'force-static';

export function GET() {
  return new Response(buildChangelogRss(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
