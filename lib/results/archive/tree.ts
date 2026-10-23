import type { ArchiveEntry } from './types';

export interface TreeRow {
  path: string;
  name: string;
  depth: number;
  isDir: boolean;
  entry?: ArchiveEntry;
}

/**
 * Flattens entries into display rows. Folders are synthesized from file paths, so archives
 * without explicit directory records still group. `expanded` holds open folder paths; a search
 * query lists every matching file regardless (folders stay out of the way).
 */
export function buildRows(entries: readonly ArchiveEntry[], expanded: ReadonlySet<string>, query = ''): TreeRow[] {
  const q = query.trim().toLowerCase();
  const sorted = [...entries].sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }));
  if (q) {
    return sorted
      .filter((e) => !e.isDir && e.path.toLowerCase().includes(q))
      .map((entry) => ({ path: entry.path, name: entry.path, depth: 0, isDir: false, entry }));
  }
  const rows: TreeRow[] = [];
  const seen = new Set<string>();
  for (const entry of sorted) {
    const parts = entry.path.split('/');
    let visible = true;
    for (let i = 0; i < parts.length - 1; i++) {
      const dir = parts.slice(0, i + 1).join('/');
      if (!seen.has(dir)) {
        seen.add(dir);
        if (visible) rows.push({ path: dir, name: parts[i], depth: i, isDir: true });
      }
      if (!expanded.has(dir)) visible = false;
    }
    if (entry.isDir) {
      if (!seen.has(entry.path)) {
        seen.add(entry.path);
        if (visible) rows.push({ path: entry.path, name: parts[parts.length - 1], depth: parts.length - 1, isDir: true, entry });
      }
    } else if (visible) {
      rows.push({ path: entry.path, name: parts[parts.length - 1], depth: parts.length - 1, isDir: false, entry });
    }
  }
  return rows;
}

/** More than half of the files are images (and there is at least one). */
export function isGalleryArchive(entries: readonly ArchiveEntry[]): boolean {
  const files = entries.filter((e) => !e.isDir);
  if (!files.length) return false;
  const images = files.filter((e) => e.kind === 'image' || e.kind === 'gif').length;
  return images * 2 > files.length;
}
