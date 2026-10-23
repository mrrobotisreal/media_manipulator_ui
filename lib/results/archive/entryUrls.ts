import { mimeForFileName } from '@/lib/results/describe';
import type { ArchiveEntry } from './types';

/**
 * Blob URLs for archive entries, made on demand and ref-counted per path. Release drops a
 * reference; the URL is revoked at zero. `dispose()` revokes everything (viewer unmount).
 */
export function createEntryUrlStore() {
  const urls = new Map<string, { url: string; refs: number }>();
  return {
    acquire(entry: ArchiveEntry): string | null {
      const existing = urls.get(entry.path);
      if (existing) {
        existing.refs += 1;
        return existing.url;
      }
      if (!entry.data) return null;
      const bytes = entry.data();
      const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: mimeForFileName(entry.path) }));
      urls.set(entry.path, { url, refs: 1 });
      return url;
    },
    release(path: string): void {
      const existing = urls.get(path);
      if (!existing) return;
      existing.refs -= 1;
      if (existing.refs <= 0) {
        URL.revokeObjectURL(existing.url);
        urls.delete(path);
      }
    },
    dispose(): void {
      for (const { url } of urls.values()) URL.revokeObjectURL(url);
      urls.clear();
    },
    get size(): number {
      return urls.size;
    },
  };
}

export type EntryUrlStore = ReturnType<typeof createEntryUrlStore>;
