/**
 * Workbench search (MM53 decision 3): key, English or translation; case- and
 * diacritic-insensitive. Pure. The index is one normalised haystack per entry,
 * built once per locale and patched per edited key, on the main thread (decision
 * 12: a Web Worker only if profiling shows >50 ms per keystroke; a 5,000-key
 * substring scan is a few ms).
 */
/** Lower-cased, NFD-decomposed, combining marks removed (é -> e, ü -> u, Arabic harakat dropped). */
export function normalizeForSearch(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

export interface Searchable {
  id: string;
  key: string;
  english: string | undefined;
}

export class SearchIndex {
  private hay = new Map<string, string>();

  constructor(items: Iterable<Searchable>, translationOf: (id: string) => string | undefined) {
    for (const it of items) this.hay.set(it.id, this.build(it, translationOf(it.id)));
    this.items = new Map([...items].map((i) => [i.id, i]));
  }

  private items: Map<string, Searchable>;

  private build(it: Searchable, translation: string | undefined): string {
    return normalizeForSearch(`${it.key}\u0000${it.english ?? ''}\u0000${translation ?? ''}`);
  }

  /** Re-index one entry after its translation changed. */
  update(id: string, translation: string | undefined): void {
    const it = this.items.get(id);
    if (it) this.hay.set(id, this.build(it, translation));
  }

  matches(id: string, query: string): boolean {
    const q = normalizeForSearch(query.trim());
    if (!q) return true;
    return this.hay.get(id)?.includes(q) ?? false;
  }

  /** Ids matching `query`, in `ids` order. */
  filter<T extends string>(ids: readonly T[], query: string): T[] {
    const q = normalizeForSearch(query.trim());
    if (!q) return [...ids];
    return ids.filter((id) => this.hay.get(id)?.includes(q));
  }
}
