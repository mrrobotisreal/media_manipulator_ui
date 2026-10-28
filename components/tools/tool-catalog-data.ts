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

export function toCatalogTool(tool: ToolPageContent, featured: boolean): CatalogTool {
  return {
    slug: tool.slug,
    name: tool.name,
    tagline: tool.tagline,
    category: tool.category,
    featured,
    group: catalogGroupFor(tool),
    search: [tool.name, tool.tagline, tool.primaryKeyword, ...tool.secondaryKeywords, tool.slug.replace(/-/g, ' ')]
      .join(' ')
      .toLowerCase(),
  };
}
