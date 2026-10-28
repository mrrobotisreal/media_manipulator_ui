/**
 * Server-safe half of the /tools catalog: the shape the client component
 * renders, the grouping rule, and the projection from a ToolPageContent.
 *
 * Kept out of tool-catalog.tsx because that file is `'use client'`, and a
 * server component (the /tools page) cannot call a function exported from a
 * client module; it can only render it. The page builds CatalogTool[] here and
 * passes it as props.
 */
import type { ToolPageContent } from '@/content/toolPages';

/** The fields the catalog needs from a tool page; the server page strips the rest before serialising. */
export interface CatalogTool {
  slug: string;
  name: string;
  tagline: string;
  category: ToolPageContent['category'];
  /** Review-allowlisted: shown first in its group with a star, and in the home grid. */
  featured: boolean;
  /**
   * MM84 review mode: false for a tool that renders in the collapsed "All
   * tools" list of its category with rel="nofollow" (flag off, not one of the
   * 24 copy-bar tools). Always true with NEXT_PUBLIC_SEO_FULL_INDEX on.
   */
  listed: boolean;
  /** Secondary groupings inside a category, e.g. "Convert", "Edit". */
  group: CatalogGroup;
  /** Lowercased haystack for the search box: name, tagline, keywords. */
  search: string;
}

export type CatalogGroup = 'convert' | 'edit' | 'ai' | 'privacy' | 'editor';

export type CatalogCategory = Exclude<ToolPageContent['category'], 'contentStudio' | 'motion'>;

export const CATALOG_CATEGORY_ORDER: CatalogCategory[] = ['image', 'video', 'audio', 'ai', 'metadata'];
export const CATALOG_GROUP_ORDER: CatalogGroup[] = ['edit', 'convert', 'ai', 'privacy', 'editor'];

/**
 * Which secondary group a tool belongs to inside its category. The split is
 * what makes a 100-tool list readable: "Convert" is format pairs, "Edit" is
 * everything that changes the content, "AI" is GPU work, "Privacy" is metadata.
 */
export function catalogGroupFor(tool: Pick<ToolPageContent, 'slug' | 'category' | 'embed'>): CatalogGroup {
  if (tool.category === 'contentStudio' || tool.category === 'motion') return 'editor';
  if (tool.category === 'ai') return 'ai';
  if (tool.category === 'metadata') return 'privacy';
  const task = tool.embed.defaultTask;
  const slug = tool.slug;
  const isConvert =
    /converter$|^convert-|-to-(jpg|png|webp|pdf|mp4|mp3|webm|gif|wav|ico|svg|flac|ogg|m4a|opus|hevc)$|^(mp4|video|pdf|png|jpg|webp|heic|avif|svg|image|audio)-to-|^png-to-ico$|^image-to-pdf$|^transcode-to-/.test(slug) ||
    /_converter$|_to_[a-z0-9]+$|^transcode_/.test(task);
  return isConvert ? 'convert' : 'edit';
}

/**
 * Project a tool page for the catalog. MM84: `aliases` are the alias pages of
 * this tool (content/toolAliases.ts); they are never listed themselves, so
 * their names, slugs and keywords join the primary's search haystack and the
 * primary's tagline gains one "Also: …" line naming them.
 */
export function toCatalogTool(
  tool: ToolPageContent,
  featured: boolean,
  options: { listed?: boolean; aliases?: ReadonlyArray<Pick<ToolPageContent, 'slug' | 'name' | 'primaryKeyword' | 'secondaryKeywords'>> } = {},
): CatalogTool {
  const aliases = options.aliases ?? [];
  const aliasNames = aliases.map((a) => a.name);
  return {
    slug: tool.slug,
    name: tool.name,
    tagline: aliasNames.length ? `${tool.tagline} Also: ${aliasNames.join(', ')}.` : tool.tagline,
    category: tool.category,
    featured,
    listed: options.listed ?? true,
    group: catalogGroupFor(tool),
    search: [
      tool.name,
      tool.tagline,
      tool.primaryKeyword,
      ...tool.secondaryKeywords,
      tool.slug.replace(/-/g, ' '),
      ...aliases.flatMap((a) => [a.name, a.primaryKeyword, ...a.secondaryKeywords, a.slug.replace(/-/g, ' ')]),
    ]
      .join(' ')
      .toLowerCase(),
  };
}

/**
 * MM84 decision 4: the catalog list for the /tools page. Aliases are dropped
 * (and folded into their primary's search), allowlisted tools are featured,
 * and while the full-index flag is off only `listedSlugs` (the 24 copy-bar
 * tools) are full cards; the rest are collapsed and nofollow.
 */
export function buildCatalogTools(
  pages: readonly ToolPageContent[],
  opts: { featuredSlugs: ReadonlySet<string>; listedSlugs: ReadonlySet<string>; fullIndex: boolean },
): CatalogTool[] {
  const aliasesByPrimary = new Map<string, ToolPageContent[]>();
  for (const page of pages) {
    if (!page.aliasOf) continue;
    aliasesByPrimary.set(page.aliasOf, [...(aliasesByPrimary.get(page.aliasOf) ?? []), page]);
  }
  return pages
    .filter((tool) => !tool.aliasOf && tool.category !== 'contentStudio' && tool.category !== 'motion')
    .map((tool) =>
      toCatalogTool(tool, opts.featuredSlugs.has(tool.slug), {
        listed: opts.fullIndex || opts.listedSlugs.has(tool.slug),
        aliases: aliasesByPrimary.get(tool.slug),
      }),
    );
}
