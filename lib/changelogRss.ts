import { CHANGELOG, type ChangelogEntry } from '@/content/changelog';
import { SITE_NAME, SITE_ORIGIN } from '@/lib/seo';

// RSS 2.0 for /changelog.xml (MM34). Pure string building so it is unit-tested
// without a server. Absolute URLs, RFC-822 dates, newest first, XML-escaped.

export const CHANGELOG_FEED_PATH = '/changelog.xml';

const escapeXml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/** ISO date (YYYY-MM-DD) -> RFC-822, pinned to 12:00 UTC so it never shifts day. */
export function toRfc822(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  return d.toUTCString();
}

const entryUrl = (e: ChangelogEntry): string => `${SITE_ORIGIN}/changelog#${e.id}`;

export function buildChangelogRss(entries: ChangelogEntry[] = CHANGELOG): string {
  const sorted = [...entries].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const items = sorted
    .map(
      (e) =>
        `    <item>
      <title>${escapeXml(e.title)}</title>
      <link>${escapeXml(entryUrl(e))}</link>
      <guid isPermaLink="true">${escapeXml(entryUrl(e))}</guid>
      <pubDate>${toRfc822(e.date)}</pubDate>
      <description>${escapeXml(e.body)}</description>
${e.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join('\n')}
    </item>`,
    )
    .join('\n');
  const last = sorted[0] ? toRfc822(sorted[0].date) : new Date(0).toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} changelog</title>
    <link>${SITE_ORIGIN}/changelog</link>
    <atom:link href="${SITE_ORIGIN}${CHANGELOG_FEED_PATH}" rel="self" type="application/rss+xml" />
    <description>Release notes for ${escapeXml(SITE_NAME)}: new tools, account features and fixes.</description>
    <language>en-us</language>
    <lastBuildDate>${last}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}
