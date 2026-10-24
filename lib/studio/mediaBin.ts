import type { StudioAsset, StudioMediaKind, StudioTrack } from '@/lib/studioTypes';

/**
 * Pure media-bin logic (part 21): labels, display names, search/sort/folder
 * views, the usage scan behind protected delete, and persisted view prefs.
 *
 * Bin organization (folder / label / displayName) is SERVER state on the asset
 * row, not part of the EDL, so none of it participates in undo.
 */

/** Fixed label palette. Mirrors `studioLabelPalette` in the Go handler. */
export const LABEL_COLORS = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink', 'gray'] as const;
export type LabelColor = (typeof LABEL_COLORS)[number];

/** Tailwind class for a label dot. Static strings so the JIT sees them. */
export const LABEL_DOT_CLASS: Record<LabelColor, string> = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-400',
  green: 'bg-green-500',
  teal: 'bg-teal-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  gray: 'bg-zinc-400',
};

export function isLabelColor(v: unknown): v is LabelColor {
  return typeof v === 'string' && (LABEL_COLORS as readonly string[]).includes(v);
}

/** What the bin shows for an asset: the rename if set, else the original filename. */
export function assetDisplayName(asset: Pick<StudioAsset, 'displayName' | 'originalFileName'>): string {
  const d = asset.displayName?.trim();
  return d ? d : asset.originalFileName;
}

// --- Search / sort / folder views -------------------------------------------

export type BinSort = 'name' | 'date' | 'duration' | 'kind';
export type BinLayout = 'grid' | 'list';

export const BIN_SORTS: readonly BinSort[] = ['name', 'date', 'duration', 'kind'];

const KIND_ORDER: Record<StudioMediaKind, number> = { video: 0, image: 1, audio: 2, lut: 3 };

/** Case-insensitive match on the display name and the original filename. */
export function matchesQuery(asset: StudioAsset, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return assetDisplayName(asset).toLowerCase().includes(q) || asset.originalFileName.toLowerCase().includes(q);
}

export function compareAssets(a: StudioAsset, b: StudioAsset, sort: BinSort): number {
  const byName = () =>
    assetDisplayName(a).localeCompare(assetDisplayName(b), undefined, { numeric: true, sensitivity: 'base' });
  switch (sort) {
    case 'date': {
      // Newest first.
      const d = Date.parse(b.createdAt) - Date.parse(a.createdAt);
      return Number.isFinite(d) && d !== 0 ? d : byName();
    }
    case 'duration': {
      // Longest first; stills (0s) sort last.
      const d = b.durationSeconds - a.durationSeconds;
      return d !== 0 ? d : byName();
    }
    case 'kind': {
      const d = KIND_ORDER[a.mediaKind] - KIND_ORDER[b.mediaKind];
      return d !== 0 ? d : byName();
    }
    default:
      return byName();
  }
}

/** Folder filter: `null` = everything, `''` = unfiled, otherwise one folder name. */
export type FolderFilter = string | null;

export interface BinViewOptions {
  query: string;
  sort: BinSort;
  folder: FolderFilter;
}

export function viewAssets(assets: StudioAsset[], opts: BinViewOptions): StudioAsset[] {
  return assets
    .filter((a) => {
      if (opts.folder !== null && (a.folder ?? '') !== opts.folder) return false;
      return matchesQuery(a, opts.query);
    })
    .sort((a, b) => compareAssets(a, b, opts.sort));
}

export interface FolderSummary {
  name: string;
  count: number;
}

/** Distinct folders (empty folders vanish naturally), sorted by name. Unfiled assets are excluded. */
export function listFolders(assets: StudioAsset[]): FolderSummary[] {
  const counts = new Map<string, number>();
  for (const a of assets) {
    const f = (a.folder ?? '').trim();
    if (f) counts.set(f, (counts.get(f) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
}

/** Ids to bulk-PATCH when a folder is renamed (a folder is just a string on assets). */
export function assetIdsInFolder(assets: StudioAsset[], folder: string): string[] {
  return assets.filter((a) => (a.folder ?? '') === folder).map((a) => a.id);
}

/** Mirror of the server's folder sanitizer, so the UI shows what will be stored. */
export const MAX_FOLDER_LENGTH = 40;
export const MAX_NAME_LENGTH = 120;
export function cleanFolderName(raw: string): string {
  return raw
    .replace(/[\\/]/g, ' ')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_FOLDER_LENGTH)
    .trim();
}

// --- Usage scan (protected delete) ------------------------------------------

export interface AssetUsage {
  clipId: string;
  trackId: string;
  /** "V1", "A2" — the label the timeline shows. */
  trackLabel: string;
  assetId: string;
}

/** Same labelling as the timeline lanes: 1-based index within the track's kind. */
export function trackLabel(track: Pick<StudioTrack, 'kind' | 'index'>): string {
  return `${track.kind === 'video' ? 'V' : 'A'}${track.index + 1}`;
}

/** Every clip in `tracks` that references one of `assetIds`. Pure. */
export function findAssetUsage(tracks: StudioTrack[], assetIds: Iterable<string>): AssetUsage[] {
  const wanted = new Set(assetIds);
  const out: AssetUsage[] = [];
  if (wanted.size === 0) return out;
  for (const track of tracks) {
    for (const clip of track.clips) {
      if (clip.assetId && wanted.has(clip.assetId)) {
        out.push({ clipId: clip.id, trackId: track.id, trackLabel: trackLabel(track), assetId: clip.assetId });
      }
    }
  }
  return out;
}

/** "V1, A2" — distinct track labels in timeline order, for the confirm dialog. */
export function usageTrackSummary(usage: AssetUsage[]): string {
  const seen: string[] = [];
  for (const u of usage) if (!seen.includes(u.trackLabel)) seen.push(u.trackLabel);
  return seen.join(', ');
}

/**
 * A clip is "offline" when it references an asset that is no longer in the bin
 * (deleted, then the removal undone). Title clips are assetless and never offline.
 * `assetsLoaded` guards the window before the bin has been seeded.
 */
export function isClipOffline(
  clip: { assetId: string; title?: unknown },
  assets: Record<string, unknown>,
  assetsLoaded: boolean,
): boolean {
  if (!assetsLoaded || clip.title || !clip.assetId) return false;
  return !(clip.assetId in assets);
}

// --- Persisted view prefs (per-viewer convenience) --------------------------

export interface BinViewPrefs {
  sort: BinSort;
  layout: BinLayout;
}

export const DEFAULT_BIN_PREFS: BinViewPrefs = { sort: 'date', layout: 'list' };
export const BIN_PREFS_KEY = 'mm.studio.binView.v1';

export function parseBinPrefs(raw: string | null | undefined): BinViewPrefs {
  if (!raw) return DEFAULT_BIN_PREFS;
  try {
    const j = JSON.parse(raw) as Partial<BinViewPrefs>;
    return {
      sort: BIN_SORTS.includes(j.sort as BinSort) ? (j.sort as BinSort) : DEFAULT_BIN_PREFS.sort,
      layout: j.layout === 'grid' || j.layout === 'list' ? j.layout : DEFAULT_BIN_PREFS.layout,
    };
  } catch {
    return DEFAULT_BIN_PREFS;
  }
}

export function loadBinPrefs(): BinViewPrefs {
  try {
    return parseBinPrefs(window.localStorage.getItem(BIN_PREFS_KEY));
  } catch {
    return DEFAULT_BIN_PREFS;
  }
}

export function saveBinPrefs(prefs: BinViewPrefs): void {
  try {
    window.localStorage.setItem(BIN_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Private mode / blocked storage: the bin still works, it just forgets.
  }
}

/** Next "Voiceover N" given the names already in the bin. */
export function nextVoiceoverName(assets: StudioAsset[]): string {
  let max = 0;
  for (const a of assets) {
    const m = /^Voiceover (\d+)(?:\.\w+)?$/i.exec(assetDisplayName(a)) ?? /^Voiceover (\d+)(?:\.\w+)?$/i.exec(a.originalFileName);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `Voiceover ${max + 1}`;
}
