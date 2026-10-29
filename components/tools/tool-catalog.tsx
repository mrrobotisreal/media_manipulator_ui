'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, Star } from 'lucide-react';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { analytics, EVENTS } from '@/lib/analytics';
import {
  CATALOG_CATEGORY_ORDER,
  CATALOG_GROUP_ORDER,
  type CatalogCategory,
  type CatalogGroup,
  type CatalogTool,
} from '@/components/tools/tool-catalog-data';

export type { CatalogCategory, CatalogGroup, CatalogTool } from '@/components/tools/tool-catalog-data';

/**
 * Every string the catalog renders, resolved by the SERVER page from the
 * `toolsIndex.*` keys. Those keys live in the server-only `pages` shard, which
 * never reaches the client i18next instance, so this client component cannot
 * call `t()` for them itself. Templates keep their `{{count}}` / `{{total}}` /
 * `{{query}}` placeholders and are filled in here.
 */
export interface ToolCatalogLabels {
  categories: Record<CatalogCategory, string>;
  groups: Record<CatalogGroup, string>;
  searchPlaceholder: string;
  searchAriaLabel: string;
  /** Template with {{count}} and {{total}}. */
  showingCount: string;
  categoriesAriaLabel: string;
  allCategories: string;
  /** Template with {{query}}. */
  noResults: string;
  popular: string;
  /**
   * MM84 review mode: summary of the collapsed list of a category's remaining
   * tools. Template with {{count}} and {{category}}.
   */
  moreTools: string;
}

interface ToolCatalogProps {
  tools: CatalogTool[];
  labels: ToolCatalogLabels;
}

const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k: string) => String(vars[k] ?? ''));

/**
 * The /tools catalog body: a search box, category tabs, and every tool grouped
 * by category and then by Convert / Edit / AI / Privacy, with the review
 * allowlisted ("popular") tools first in each group and marked with a star.
 *
 * Client component because search and tab state are interactive; the data is
 * prepared by the server page so the localised names come from
 * getLocalizedToolPages, never from English baked into a module.
 */
export default function ToolCatalog({ tools, labels }: ToolCatalogProps) {
  const categoryLabels = labels.categories;
  const localized = useLocalizedHref();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CatalogCategory | 'all'>('all');

  const normalizedQuery = query.trim().toLowerCase();
  const visible = useMemo(() => {
    const words = normalizedQuery.split(/\s+/).filter(Boolean);
    return tools.filter((tool) => {
      if (category !== 'all' && tool.category !== category) return false;
      return words.every((w) => tool.search.includes(w));
    });
  }, [tools, category, normalizedQuery]);

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: tools.length };
    for (const tool of tools) out[tool.category] = (out[tool.category] ?? 0) + 1;
    return out;
  }, [tools]);

  const sections = useMemo(() => {
    const byCategory = new Map<CatalogCategory, Map<CatalogGroup, CatalogTool[]>>();
    for (const tool of visible) {
      if (tool.category === 'contentStudio' || tool.category === 'motion') continue;
      const cat = tool.category;
      if (!byCategory.has(cat)) byCategory.set(cat, new Map());
      const groups = byCategory.get(cat)!;
      if (!groups.has(tool.group)) groups.set(tool.group, []);
      groups.get(tool.group)!.push(tool);
    }
    return CATALOG_CATEGORY_ORDER.filter((cat) => byCategory.has(cat)).map((cat) => ({
      category: cat,
      groups: CATALOG_GROUP_ORDER.filter((g) => byCategory.get(cat)!.get(g)?.some((t) => t.listed)).map((g) => ({
        group: g,
        tools: byCategory.get(cat)!.get(g)!.filter((t) => t.listed).sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name)),
      })),
      // MM84 review mode: the category's other tools, collapsed and nofollow.
      more: [...byCategory.get(cat)!.values()].flat().filter((t) => !t.listed).sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }, [visible]);

  const onSearch = (next: string) => {
    setQuery(next);
    if (next.trim().length === 3 || (next.trim().length > 3 && next.trim().length % 4 === 0)) {
      analytics.track(EVENTS.FEATURE_USED, { feature: 'tool_catalog', action: 'search', value: next.trim().length });
    }
  };
  const onCategory = (next: CatalogCategory | 'all') => {
    setCategory(next);
    analytics.track(EVENTS.FEATURE_USED, { feature: 'tool_catalog', action: 'filter', value: next });
  };

  const tabClass = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-sm transition-colors ${
      active ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-card-foreground hover:bg-muted'
    }`;

  return (
    <div data-testid="tool-catalog">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full md:max-w-md">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            aria-label={labels.searchAriaLabel}
            data-testid="tool-catalog-search"
            className="w-full rounded-lg border border-input bg-input py-2 pl-9 pr-3 text-sm text-card-foreground focus:ring-2 focus:ring-ring"
          />
        </label>
        <p className="text-sm text-muted-foreground" data-testid="tool-catalog-count" aria-live="polite">
          {fill(labels.showingCount, { count: visible.length, total: tools.length })}
        </p>
      </div>

      <nav aria-label={labels.categoriesAriaLabel} className="mb-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => onCategory('all')} className={tabClass(category === 'all')} aria-pressed={category === 'all'}>
          {labels.allCategories} <span className="opacity-70">{counts.all}</span>
        </button>
        {CATALOG_CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategory(cat)}
            className={tabClass(category === cat)}
            aria-pressed={category === cat}
            data-testid={`tool-catalog-tab-${cat}`}
          >
            {categoryLabels[cat]} <span className="opacity-70">{counts[cat] ?? 0}</span>
          </button>
        ))}
      </nav>

      {sections.length === 0 ? (
        <p className="rounded-lg border border-border bg-background/40 p-6 text-center text-sm text-muted-foreground" data-testid="tool-catalog-empty">
          {fill(labels.noResults, { query })}
        </p>
      ) : (
        sections.map(({ category: cat, groups, more }) => (
          <section key={cat} className="my-8" aria-label={categoryLabels[cat]} data-testid={`tool-catalog-section-${cat}`}>
            <h2 className="mb-3 text-2xl font-semibold text-card-foreground">{categoryLabels[cat]}</h2>
            {groups.map(({ group, tools: groupTools }) => (
              <div key={group} className="mb-5">
                {groups.length > 1 && (
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {labels.groups[group]}
                  </h3>
                )}
                <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {groupTools.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={localized(`/tools/${tool.slug}`)}
                        className="block h-full rounded-lg border border-border bg-background/40 p-4 transition-colors hover:bg-muted/40"
                        data-testid={`tool-card-${tool.slug}`}
                      >
                        <span className="flex items-start gap-2">
                          <span className="font-medium text-card-foreground">{tool.name}</span>
                          {tool.featured && (
                            <Star aria-label={labels.popular} className="mt-1 size-3.5 shrink-0 fill-premium text-premium" />
                          )}
                        </span>
                        <span className="mt-1 block text-sm text-muted-foreground">{tool.tagline}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {more.length > 0 && (
              // MM84: closed by default and server-rendered, so the list works
              // without JS; a search opens it so matches are never hidden.
              <details
                key={normalizedQuery ? 'search' : 'browse'}
                open={normalizedQuery.length > 0}
                className="group rounded-lg border border-border bg-background/40"
                data-testid={`tool-catalog-more-${cat}`}
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2 text-sm font-medium text-card-foreground [&::-webkit-details-marker]:hidden">
                  <span>{fill(labels.moreTools, { count: more.length, category: categoryLabels[cat] })}</span>
                  <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <ul className="grid gap-x-4 gap-y-1 border-t border-border px-4 py-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  {more.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={localized(`/tools/${tool.slug}`)}
                        rel="nofollow"
                        className="inline-flex min-h-11 items-center text-muted-foreground underline-offset-4 hover:text-card-foreground hover:underline"
                        data-testid={`tool-link-${tool.slug}`}
                        title={tool.tagline}
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        ))
      )}
    </div>
  );
}
