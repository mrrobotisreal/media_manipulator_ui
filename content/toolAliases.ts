/**
 * MM84 decision 3: duplicate-intent tool slugs consolidated under one primary.
 *
 * An alias page keeps its URL, its H1, a short intro of its own and its panel
 * (same form, same locks), but sets `canonical` to the primary, is
 * `noindex, follow` in every mode (the full-index flag does not change that),
 * and is never listed on /tools, in the sitemap or in llms.txt. Search on
 * /tools finds the primary under the alias's name instead.
 *
 * This map is the single source of truth: content/toolPages.ts stamps
 * `aliasOf` on the entries from it, and scripts/audit-adsense.mjs reads it to
 * fail a build that links an alias. Kept tiny and dependency-free so the
 * client-safe helpers in content/reviewAllowlist.ts can import it.
 */
export const TOOL_ALIAS_OF = {
  'mp4-trimmer': 'video-trimmer',
  'video-cutter': 'video-trimmer',
  'cut-video-online': 'video-trimmer',
  'video-to-gif': 'convert-video-to-animated-gif',
  'mp4-to-gif': 'convert-video-to-animated-gif',
  // The ticket listed gif-converter under image-converter, but its form is the
  // video-to-GIF form (category video); its intent is "make a GIF from a clip".
  'gif-converter': 'convert-video-to-animated-gif',
  'jpg-converter': 'image-converter',
  'png-converter': 'image-converter',
  'svg-converter': 'image-converter',
  'video-compressor': 'compress-video',
  'compress-mp4': 'compress-video',
  // The ticket made video-to-mp3 the primary for mp4-to-mp3; both are the
  // extract-audio flow with MP3 preselected, so both point at the indexed page.
  'video-to-mp3': 'extract-audio-from-video',
  'mp4-to-mp3': 'extract-audio-from-video',
  // Found in the catalog check: MP4 is the video converter's default output.
  'mp4-converter': 'video-converter',
} as const satisfies Record<string, string>;

export type ToolAliasSlug = keyof typeof TOOL_ALIAS_OF;

/** The primary slug of an alias, or undefined for a page that is not an alias. */
export function aliasTargetOf(slug: string): string | undefined {
  return (TOOL_ALIAS_OF as Record<string, string>)[slug];
}

export function isToolAliasSlug(slug: string): boolean {
  return aliasTargetOf(slug) !== undefined;
}

/** Alias slugs grouped by primary, e.g. video-trimmer -> [mp4-trimmer, ...]. */
export function aliasesOf(primary: string): string[] {
  return Object.entries(TOOL_ALIAS_OF)
    .filter(([, target]) => target === primary)
    .map(([alias]) => alias);
}
