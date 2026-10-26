'use client';

import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import {
  Film,
  ImageIcon,
  Music,
  Plus,
  UploadCloud,
  Loader2,
  AlertCircle,
  Palette,
  Sparkles,
  Search,
  LayoutGrid,
  List,
  FolderPlus,
  Folder,
  MoreHorizontal,
  Trash2,
  Pencil,
  CheckSquare,
  RotateCcw,
  RefreshCw,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore, type StudioAssetEntry } from '@/lib/studioStore';
import {
  useUploadStudioAsset,
  useDeriveStudioAsset,
  useStudioAssetOrganization,
  useDeleteStudioAssets,
  useRebuildStudioProxies,
  retryStudioUpload,
  type StudioDeriveOperation,
} from '@/lib/useStudioAsset';
import { useStudioJobProgress } from '@/lib/useStudioJob';
import { analytics, EVENTS, batchBucket, fileSizeBucket } from '@/lib/analytics';
import type { StudioImportKind } from '@/lib/analytics';
import { editSummary, studioHost } from '@/lib/studio/telemetry';
import { studioSpriteUrl } from '@/lib/studio/previewEngine';
import {
  LABEL_COLORS,
  LABEL_DOT_CLASS,
  BIN_SORTS,
  assetDisplayName,
  assetIdsInFolder,
  cleanFolderName,
  findAssetUsage,
  isLabelColor,
  listFolders,
  loadBinPrefs,
  saveBinPrefs,
  usageTrackSummary,
  viewAssets,
  DEFAULT_BIN_PREFS,
  MAX_NAME_LENGTH,
  type BinLayout,
  type BinSort,
  type FolderFilter,
} from '@/lib/studio/mediaBin';
import { FOLDER_DROP_PREFIX, UNFILED_DROP_ID, setBinFolderDropHandler } from '@/lib/studio/binDrop';
import { studioUploadQueue, type UploadItem } from '@/lib/studio/uploadQueue';
import { isProxyRebuildCandidate, proxyRebuildCandidates } from '@/lib/studio/proxyRebuild';
import VoiceoverRecorder from './voiceover-recorder';

/** MIME type → the closed import-kind vocabulary. Never the filename. */
function importKind(file: File): StudioImportKind {
  const mime = (file.type || '').toLowerCase();
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.startsWith('image/')) return 'image';
  return 'other';
}

const SORT_KEY: Record<BinSort, string> = {
  name: 'sortName',
  date: 'sortDate',
  duration: 'sortDuration',
  kind: 'sortKind',
};

const labelKey = (c: string) => `label${c[0].toUpperCase()}${c.slice(1)}`;

/** Pending delete: the assets and the clips that would go with them. */
interface PendingDelete {
  ids: string[];
  clipCount: number;
  trackSummary: string;
}

/**
 * Media bin — search/sort/layout, single-level folders, color labels, inline
 * rename, usage-protected delete, batch upload with per-file progress, and
 * voiceover recording. Bin organization is server state on the asset row (not
 * the EDL), so none of it is undoable. Folder/label/rename/delete are hidden
 * where the backend has no such routes (embedded CreaTV).
 */
const MediaBin: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { t } = useLocalization('interface');
  const assets = useStudioStore((s) => s.assets);
  const addClipFromAsset = useStudioStore((s) => s.addClipFromAsset);
  const { upload, queue } = useUploadStudioAsset(projectId);
  const { available: manage, patchOne, patchMany } = useStudioAssetOrganization();
  const deleteAssets = useDeleteStudioAssets();
  const { available: canRebuild, rebuild: rebuildProxies } = useRebuildStudioProxies();
  const [rebuildAllOpen, setRebuildAllOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);

  const [prefs, setPrefs] = React.useState(DEFAULT_BIN_PREFS);
  React.useEffect(() => {
    // localStorage is per-viewer only; read after mount to keep SSR markup stable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefs(loadBinPrefs());
  }, []);
  const updatePrefs = (next: Partial<{ sort: BinSort; layout: BinLayout }>) => {
    const merged = { ...prefs, ...next };
    setPrefs(merged);
    saveBinPrefs(merged);
  };

  const [query, setQuery] = React.useState('');
  const [folder, setFolder] = React.useState<FolderFilter>(null);
  const [draftFolders, setDraftFolders] = React.useState<string[]>([]);
  const [newFolderOpen, setNewFolderOpen] = React.useState(false);
  const [selectMode, setSelectMode] = React.useState(false);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [pendingDelete, setPendingDelete] = React.useState<PendingDelete | null>(null);

  const entries = Object.values(assets);
  const allAssets = React.useMemo(() => entries.map((e) => e.asset), [entries]);
  const mediaAssets = allAssets.filter((a) => a.mediaKind !== 'lut');
  const lutEntries = entries.filter((e) => e.asset.mediaKind === 'lut');
  const folders = React.useMemo(() => {
    const real = listFolders(mediaAssets);
    const names = new Set(real.map((f) => f.name));
    const drafts = draftFolders.filter((d) => !names.has(d)).map((name) => ({ name, count: 0 }));
    return [...real, ...drafts];
  }, [mediaAssets, draftFolders]);

  // A folder that emptied out (or was renamed away) vanishes; fall back to All.
  React.useEffect(() => {
    if (folder && folder !== '' && !folders.some((f) => f.name === folder)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFolder(null);
    }
  }, [folder, folders]);

  const visible = viewAssets(mediaAssets, { query, sort: prefs.sort, folder });

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const batch = Array.from(files);
    batch.forEach((file) => {
      // Part 10 (ADR ws/0003): one studio_media_imported per file — kind and
      // size bucketed, batch size bucketed on each so multi-file drops are
      // recognizable. Never a filename.
      analytics.track(
        EVENTS.STUDIO_MEDIA_IMPORTED,
        {
          kind: importKind(file),
          sizeBucket: fileSizeBucket(file.size),
          batchBucket: batchBucket(batch.length),
          host: studioHost(),
        },
        { feature: 'studio' },
      );
      upload(file);
    });
  };

  const toggleSelected = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const exitSelect = () => {
    setSelectMode(false);
    setSelected(new Set());
  };

  // --- organization actions ---
  const moveToFolder = React.useCallback(
    async (ids: string[], name: string) => {
      const clean = cleanFolderName(name);
      editSummary.increment('binOrganizations');
      editSummary.increment('uiInvocations');
      await patchMany(ids, { folder: clean });
    },
    [patchMany],
  );
  const setLabel = async (ids: string[], label: string) => {
    editSummary.increment('binOrganizations');
    editSummary.increment('uiInvocations');
    await patchMany(ids, { label });
  };
  const rename = async (id: string, name: string) => {
    const clean = name.trim().slice(0, MAX_NAME_LENGTH);
    const current = assets[id]?.asset;
    if (!current || clean === assetDisplayName(current)) return;
    editSummary.increment('binOrganizations');
    editSummary.increment('uiInvocations');
    // Typing the original filename back clears the override.
    await patchOne(id, { displayName: clean === current.originalFileName ? '' : clean });
  };
  const renameFolder = async (from: string, to: string) => {
    const clean = cleanFolderName(to);
    if (!clean || clean === from) return;
    editSummary.increment('binOrganizations');
    editSummary.increment('uiInvocations');
    const ids = assetIdsInFolder(mediaAssets, from);
    setDraftFolders((d) => d.map((x) => (x === from ? clean : x)));
    await patchMany(ids, { folder: clean });
    setFolder((f) => (f === from ? clean : f));
  };

  // Folder-chip drops (the editor's DndContext offers them to us).
  React.useEffect(() => {
    setBinFolderDropHandler((assetId, name) => {
      const ids = selected.has(assetId) ? [...selected] : [assetId];
      void moveToFolder(ids, name);
    });
    return () => setBinFolderDropHandler(null);
  }, [selected, moveToFolder]);

  // --- delete (usage-protected) ---
  const requestDelete = (ids: string[]) => {
    const project = useStudioStore.getState().project;
    const usage = findAssetUsage(project?.tracks ?? [], ids);
    setPendingDelete({ ids, clipCount: usage.length, trackSummary: usageTrackSummary(usage) });
  };
  const confirmDelete = async () => {
    const p = pendingDelete;
    setPendingDelete(null);
    if (!p) return;
    // Clips first, as ONE undo entry; the asset delete itself is server state.
    if (p.clipCount > 0) useStudioStore.getState().removeClipsForAssets(p.ids);
    const deleted = await deleteAssets(p.ids);
    if (deleted.length > 0) {
      editSummary.increment('assetsDeleted');
      editSummary.increment('uiInvocations');
    }
    setSelected((prev) => new Set([...prev].filter((id) => !deleted.includes(id))));
  };

  // MM71: proxies built before the 1 s keyframe cadence (generation 0).
  const rebuildIds = canRebuild ? proxyRebuildCandidates(entries) : [];
  const rebuild = (ids: string[]) => {
    editSummary.increment('uiInvocations');
    void rebuildProxies(ids);
  };

  const retry = (id: string) => {
    editSummary.increment('uploadRetries');
    retryStudioUpload(id);
  };

  const hasMedia = mediaAssets.length > 0;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="mb-2 flex items-center gap-2">
        <Film className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-card-foreground">{t('contentStudio.slots.mediaBin.title')}</h2>
        <div className="ml-auto flex items-center gap-0.5">
          <VoiceoverRecorder projectId={projectId} />
          {manage && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2"
                onClick={() => setNewFolderOpen((o) => !o)}
                title={t('contentStudio.mediaBin.newFolder')}
                aria-label={t('contentStudio.mediaBin.newFolder')}
              >
                <FolderPlus className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={selectMode ? 'secondary' : 'ghost'}
                className="h-7 px-2"
                onClick={() => (selectMode ? exitSelect() : setSelectMode(true))}
                title={t('contentStudio.mediaBin.selectMode')}
                aria-label={t('contentStudio.mediaBin.selectMode')}
                aria-pressed={selectMode}
              >
                <CheckSquare className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2"
            onClick={() => updatePrefs({ layout: prefs.layout === 'grid' ? 'list' : 'grid' })}
            title={prefs.layout === 'grid' ? t('contentStudio.mediaBin.layoutList') : t('contentStudio.mediaBin.layoutGrid')}
            aria-label={prefs.layout === 'grid' ? t('contentStudio.mediaBin.layoutList') : t('contentStudio.mediaBin.layoutGrid')}
          >
            {prefs.layout === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="mb-2 flex items-center gap-1.5">
        <div className="relative flex-1 min-w-0">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('contentStudio.mediaBin.search')}
            aria-label={t('contentStudio.mediaBin.search')}
            className="h-8 pl-7 text-xs"
          />
        </div>
        <select
          value={prefs.sort}
          onChange={(e) => updatePrefs({ sort: e.target.value as BinSort })}
          aria-label={t('contentStudio.mediaBin.sort')}
          className="h-8 rounded-md border border-input bg-transparent px-1.5 text-xs text-card-foreground"
        >
          {BIN_SORTS.map((s) => (
            <option key={s} value={s} className="bg-popover text-popover-foreground">
              {t(`contentStudio.mediaBin.${SORT_KEY[s]}`)}
            </option>
          ))}
        </select>
      </div>

      {manage && (newFolderOpen || folders.length > 0) && (
        <FolderChips
          folders={folders}
          current={folder}
          onSelect={setFolder}
          onRename={renameFolder}
          showUnfiled={folders.length > 0}
          newFolderOpen={newFolderOpen}
          onCreate={(name) => {
            const clean = cleanFolderName(name);
            setNewFolderOpen(false);
            if (!clean) return;
            setDraftFolders((d) => (d.includes(clean) ? d : [...d, clean]));
            setFolder(clean);
          }}
          onCancelCreate={() => setNewFolderOpen(false)}
        />
      )}

      {selectMode && manage && (
        <div className="mb-2 flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-background/60 px-2 py-1">
          <span className="text-[11px] text-muted-foreground">
            {t('contentStudio.mediaBin.selectedCount', { count: selected.size })}
          </span>
          <div className="ml-auto flex items-center gap-1">
            <MoveMenu
              folders={folders}
              disabled={selected.size === 0}
              onMove={(name) => void moveToFolder([...selected], name)}
              triggerClassName="h-6 px-1.5 text-[11px]"
              showLabel
            />
            <LabelMenu disabled={selected.size === 0} onPick={(c) => void setLabel([...selected], c)} showLabel />
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-1.5 text-[11px] text-destructive"
              disabled={selected.size === 0}
              onClick={() => requestDelete([...selected])}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              {t('contentStudio.mediaBin.delete')}
            </Button>
            <Button size="sm" variant="ghost" className="h-6 px-1.5 text-[11px]" onClick={exitSelect}>
              {t('contentStudio.mediaBin.clearSelection')}
            </Button>
          </div>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-lg border border-dashed p-2.5 text-center transition-colors ${
          dragOver ? 'border-primary bg-primary/10' : 'border-border bg-background/40'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <UploadCloud className="w-4 h-4 text-muted-foreground shrink-0" />
          <p className="text-[11px] text-muted-foreground">{t('contentStudio.mediaBin.dropHint')}</p>
          <Button size="sm" variant="outline" className="h-6 px-2 text-[11px]" onClick={() => inputRef.current?.click()}>
            {t('contentStudio.mediaBin.choose')}
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="video/*,audio/*,image/*,.cube,.heic,.heif,.avif"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      <UploadRows items={queue} onRetry={retry} />

      {rebuildIds.length > 0 && (
        <div className="mt-2 flex items-center gap-2 rounded-md border border-border bg-background/60 px-2 py-1">
          <p className="min-w-0 flex-1 text-[11px] text-muted-foreground">
            {t('contentStudio.mediaBin.rebuildOldHint', { count: rebuildIds.length })}
          </p>
          <Button size="sm" variant="outline" className="h-6 shrink-0 px-2 text-[11px]" onClick={() => setRebuildAllOpen(true)}>
            <RefreshCw className="w-3 h-3 mr-1" />
            {t('contentStudio.mediaBin.rebuildAll')}
          </Button>
        </div>
      )}

      <div className="mt-2 flex-1 min-h-0 overflow-y-auto">
        {entries.length === 0 ? (
          <p className="text-xs text-muted-foreground px-1">{t('contentStudio.mediaBin.empty')}</p>
        ) : visible.length === 0 && hasMedia ? (
          <p className="text-xs text-muted-foreground px-1">
            {query ? t('contentStudio.mediaBin.noMatches') : t('contentStudio.mediaBin.folderEmpty')}
          </p>
        ) : (
          <div className={prefs.layout === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-2'}>
            {visible.map((asset) => {
              const entry = assets[asset.id];
              return (
                <MediaTile
                  key={asset.id}
                  entry={entry}
                  layout={prefs.layout}
                  manage={manage}
                  folders={folders}
                  selectMode={selectMode}
                  selected={selected.has(asset.id)}
                  onToggleSelect={() => toggleSelected(asset.id)}
                  onAdd={() => addClipFromAsset(asset.id)}
                  onRename={(name) => void rename(asset.id, name)}
                  onLabel={(c) => void setLabel([asset.id], c)}
                  onMove={(name) => void moveToFolder([asset.id], name)}
                  onDelete={() => requestDelete([asset.id])}
                  onRebuild={canRebuild ? () => rebuild([asset.id]) : undefined}
                />
              );
            })}
          </div>
        )}
        {lutEntries.length > 0 && !query && folder === null && (
          <>
            <p className="text-[11px] font-semibold text-muted-foreground px-1 pt-3 pb-1 flex items-center gap-1">
              <Palette className="w-3 h-3 text-primary" />
              {t('contentStudio.mediaBin.luts')}
            </p>
            <div className="space-y-2">
              {lutEntries.map((entry) => (
                <LutTile key={entry.asset.id} entry={entry} manage={manage} onDelete={() => requestDelete([entry.asset.id])} />
              ))}
            </div>
          </>
        )}
      </div>

      <AlertDialog open={rebuildAllOpen} onOpenChange={setRebuildAllOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('contentStudio.mediaBin.rebuildAllTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('contentStudio.mediaBin.rebuildAllBody', { count: rebuildIds.length })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('contentStudio.mediaBin.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setRebuildAllOpen(false);
                rebuild(rebuildIds);
              }}
            >
              {t('contentStudio.mediaBin.rebuildAllConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingDelete && pendingDelete.clipCount > 0
                ? t('contentStudio.mediaBin.deleteTitleUsed')
                : t('contentStudio.mediaBin.deleteTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete && pendingDelete.clipCount > 0
                ? t('contentStudio.mediaBin.deleteUsed', {
                    clips: pendingDelete.clipCount,
                    tracks: pendingDelete.trackSummary,
                  })
                : t('contentStudio.mediaBin.deleteUnused', { count: pendingDelete?.ids.length ?? 0 })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('contentStudio.mediaBin.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDelete()}>{t('contentStudio.mediaBin.deleteConfirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// --- folder chips -----------------------------------------------------------

const FolderChip: React.FC<{
  id: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  onDoubleClick?: () => void;
}> = ({ id, active, onClick, children, onDoubleClick }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] transition-colors ${
        active ? 'border-primary bg-primary/15 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'
      } ${isOver ? 'ring-1 ring-primary bg-primary/20' : ''}`}
    >
      {children}
    </button>
  );
};

const FolderChips: React.FC<{
  folders: { name: string; count: number }[];
  current: FolderFilter;
  onSelect: (f: FolderFilter) => void;
  onRename: (from: string, to: string) => void;
  showUnfiled: boolean;
  newFolderOpen: boolean;
  onCreate: (name: string) => void;
  onCancelCreate: () => void;
}> = ({ folders, current, onSelect, onRename, showUnfiled, newFolderOpen, onCreate, onCancelCreate }) => {
  const { t } = useLocalization('interface');
  const [renaming, setRenaming] = React.useState<string | null>(null);
  return (
    <div className="mb-2 flex items-center gap-1 overflow-x-auto pb-0.5">
      <FolderChip id={`${FOLDER_DROP_PREFIX}__all`} active={current === null} onClick={() => onSelect(null)}>
        {t('contentStudio.mediaBin.allMedia')}
      </FolderChip>
      {showUnfiled && (
        <FolderChip id={UNFILED_DROP_ID} active={current === ''} onClick={() => onSelect('')}>
          {t('contentStudio.mediaBin.unfiled')}
        </FolderChip>
      )}
      {folders.map((f) =>
        renaming === f.name ? (
          <InlineName
            key={f.name}
            initial={f.name}
            label={t('contentStudio.mediaBin.renameFolder')}
            onDone={(v) => {
              setRenaming(null);
              if (v !== null) onRename(f.name, v);
            }}
          />
        ) : (
          <FolderChip
            key={f.name}
            id={`${FOLDER_DROP_PREFIX}${f.name}`}
            active={current === f.name}
            onClick={() => onSelect(f.name)}
            onDoubleClick={() => setRenaming(f.name)}
          >
            <Folder className="w-3 h-3" />
            <span className="max-w-[7rem] truncate">{f.name}</span>
            <span className="text-muted-foreground">{f.count}</span>
            {current === f.name && (
              <span
                role="button"
                tabIndex={0}
                aria-label={t('contentStudio.mediaBin.renameFolder')}
                title={t('contentStudio.mediaBin.renameFolder')}
                onClick={(e) => {
                  e.stopPropagation();
                  setRenaming(f.name);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setRenaming(f.name);
                }}
              >
                <Pencil className="w-3 h-3" />
              </span>
            )}
          </FolderChip>
        ),
      )}
      {newFolderOpen && (
        <InlineName
          initial=""
          label={t('contentStudio.mediaBin.folderNamePrompt')}
          onDone={(v) => (v === null ? onCancelCreate() : onCreate(v))}
        />
      )}
    </div>
  );
};

/** Small autofocused text input: Enter commits, Escape/blur-empty cancels (null). */
const InlineName: React.FC<{
  initial: string;
  label: string;
  onDone: (value: string | null) => void;
  className?: string;
}> = ({ initial, label, onDone, className }) => {
  const [value, setValue] = React.useState(initial);
  const doneRef = React.useRef(false);
  const finish = (v: string | null) => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone(v);
  };
  return (
    <input
      autoFocus
      value={value}
      aria-label={label}
      placeholder={label}
      onChange={(e) => setValue(e.target.value)}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === 'Enter') finish(value);
        else if (e.key === 'Escape') finish(null);
      }}
      onBlur={() => finish(value.trim() ? value : null)}
      className={`h-6 w-28 rounded-md border border-primary bg-background px-1.5 text-[11px] text-card-foreground outline-none ${className ?? ''}`}
    />
  );
};

// --- menus ------------------------------------------------------------------

const MoveMenu: React.FC<{
  folders: { name: string; count: number }[];
  onMove: (name: string) => void;
  disabled?: boolean;
  triggerClassName?: string;
  showLabel?: boolean;
}> = ({ folders, onMove, disabled, triggerClassName, showLabel }) => {
  const { t } = useLocalization('interface');
  const [naming, setNaming] = React.useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" className={triggerClassName ?? 'h-7 px-2'} disabled={disabled} title={t('contentStudio.mediaBin.moveToFolder')}>
            <Folder className="w-3.5 h-3.5" />
            {showLabel && <span className="ml-1">{t('contentStudio.mediaBin.moveToFolder')}</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {folders.map((f) => (
            <DropdownMenuItem key={f.name} onClick={() => onMove(f.name)}>
              <Folder className="w-3.5 h-3.5" />
              {f.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={() => setNaming(true)}>
            <FolderPlus className="w-3.5 h-3.5" />
            {t('contentStudio.mediaBin.newFolder')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onMove('')}>{t('contentStudio.mediaBin.removeFromFolder')}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {naming && (
        <InlineName
          initial=""
          label={t('contentStudio.mediaBin.folderNamePrompt')}
          onDone={(v) => {
            setNaming(false);
            if (v !== null && v.trim()) onMove(v);
          }}
        />
      )}
    </>
  );
};

const LabelDot: React.FC<{ color?: string; className?: string }> = ({ color, className }) => (
  <span
    aria-hidden
    className={`inline-block h-2.5 w-2.5 rounded-full ${
      isLabelColor(color) ? LABEL_DOT_CLASS[color] : 'border border-muted-foreground/50'
    } ${className ?? ''}`}
  />
);

const LabelMenu: React.FC<{ onPick: (color: string) => void; disabled?: boolean; showLabel?: boolean; current?: string }> = ({
  onPick,
  disabled,
  showLabel,
  current,
}) => {
  const { t } = useLocalization('interface');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className={showLabel ? 'h-6 px-1.5 text-[11px]' : 'h-5 w-5 p-0'}
          disabled={disabled}
          onPointerDown={(e) => e.stopPropagation()}
          title={t('contentStudio.mediaBin.label')}
          aria-label={t('contentStudio.mediaBin.label')}
        >
          <LabelDot color={current} />
          {showLabel && <span className="ml-1">{t('contentStudio.mediaBin.label')}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LABEL_COLORS.map((c) => (
          <DropdownMenuItem key={c} onClick={() => onPick(c)}>
            <LabelDot color={c} />
            {t(`contentStudio.mediaBin.${labelKey(c)}`)}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onPick('')}>{t('contentStudio.mediaBin.labelNone')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// --- upload rows ------------------------------------------------------------

const UploadRows: React.FC<{ items: readonly UploadItem[]; onRetry: (id: string) => void }> = ({ items, onRetry }) => {
  const { t } = useLocalization('interface');
  if (items.length === 0) return null;
  const anyDone = items.some((i) => i.status === 'done');
  return (
    <div className="mt-2 space-y-1" aria-label={t('contentStudio.mediaBin.queueTitle')}>
      {items.map((item) => (
        <div key={item.id} className="rounded-md border border-border bg-background/60 px-2 py-1">
          <div className="flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-[11px] text-card-foreground" title={item.name}>
              {item.name}
            </p>
            <span className={`shrink-0 text-[10px] ${item.status === 'failed' ? 'text-destructive' : 'text-muted-foreground'}`}>
              {item.status === 'queued' && t('contentStudio.mediaBin.queueQueued')}
              {item.status === 'uploading' && `${item.progress}%`}
              {item.status === 'processing' && t('contentStudio.mediaBin.queueProcessing')}
              {item.status === 'done' && t('contentStudio.mediaBin.queueDone')}
              {item.status === 'failed' && t('contentStudio.mediaBin.queueFailed')}
            </span>
            {item.status === 'failed' && (
              <Button size="sm" variant="ghost" className="h-5 px-1" onClick={() => onRetry(item.id)} title={t('contentStudio.mediaBin.retry')} aria-label={t('contentStudio.mediaBin.retry')}>
                <RotateCcw className="w-3 h-3" />
              </Button>
            )}
            {(item.status === 'failed' || item.status === 'done') && (
              <Button size="sm" variant="ghost" className="h-5 px-1" onClick={() => studioUploadQueue.dismiss(item.id)} title={t('contentStudio.mediaBin.dismiss')} aria-label={t('contentStudio.mediaBin.dismiss')}>
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          {(item.status === 'uploading' || item.status === 'queued' || item.status === 'processing') && (
            <div className="mt-1 h-1 rounded bg-muted overflow-hidden" role="progressbar" aria-valuenow={item.progress} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full bg-primary transition-[width]" style={{ width: `${item.progress}%` }} />
            </div>
          )}
          {item.status === 'failed' && item.error && (
            <p className="mt-0.5 truncate text-[10px] text-destructive" title={item.error}>
              {item.error}
            </p>
          )}
        </div>
      ))}
      {anyDone && (
        <button type="button" className="text-[10px] text-muted-foreground hover:text-foreground" onClick={() => studioUploadQueue.clearDone()}>
          {t('contentStudio.mediaBin.clearDone')}
        </button>
      )}
    </div>
  );
};

// --- tiles ------------------------------------------------------------------

const MediaTile: React.FC<{
  entry: StudioAssetEntry;
  layout: BinLayout;
  manage: boolean;
  folders: { name: string; count: number }[];
  selectMode: boolean;
  selected: boolean;
  onToggleSelect: () => void;
  onAdd: () => void;
  onRename: (name: string) => void;
  onLabel: (color: string) => void;
  onMove: (folder: string) => void;
  onDelete: () => void;
  /** MM71: present only where the backend can rebuild proxies (and not on translator deployments). */
  onRebuild?: () => void;
}> = ({ entry, layout, manage, folders, selectMode, selected, onToggleSelect, onAdd, onRename, onLabel, onMove, onDelete, onRebuild }) => {
  const { t, formatReadableDuration } = useLocalization('interface');
  const { asset, status } = entry;
  const isAudio = asset.mediaKind === 'audio';
  const isImage = asset.mediaKind === 'image';
  const ready = status === 'ready';
  const name = assetDisplayName(asset);
  const rebuildState = entry.proxyRebuild;
  const showRebuild = !!onRebuild && isProxyRebuildCandidate(entry);
  const [editing, setEditing] = React.useState(false);
  const { derive, isDeriving } = useDeriveStudioAsset();
  // Part 10: AI derives are a lifecycle event — `op` is the server's closed
  // operation vocabulary, and nothing about the asset goes along.
  const deriveTracked = (assetId: string, op: StudioDeriveOperation) => {
    analytics.track(EVENTS.STUDIO_DERIVE_USED, { op, host: studioHost() }, { feature: 'studio' });
    derive(assetId, op);
  };
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `asset:${asset.id}`,
    data: { type: 'asset', assetId: asset.id, kind: asset.mediaKind, label: name },
    disabled: !ready || editing || selectMode,
  });

  const grid = layout === 'grid';
  const detail = isImage
    ? asset.width && asset.height
      ? `${asset.width}×${asset.height}`
      : '—'
    : asset.durationSeconds > 0
      ? formatReadableDuration(asset.durationSeconds)
      : '—';

  const thumb = (
    <div className={`shrink-0 rounded bg-muted flex items-center justify-center ${grid ? 'w-full h-14' : 'w-12 h-9'}`}>
      {isImage ? (
        <div className="relative w-full h-full overflow-hidden rounded">
          {/* Thumbnail sprite is empty when the server-side thumbnail failed; the badge below remains. */}
          <img
            src={studioSpriteUrl(asset.id)}
            alt=""
            draggable={false}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <ImageIcon className="absolute bottom-0.5 right-0.5 w-3 h-3 text-primary drop-shadow" aria-hidden />
        </div>
      ) : isAudio ? (
        <Music className="w-4 h-4 text-primary" />
      ) : (
        <Film className="w-4 h-4 text-primary" />
      )}
    </div>
  );

  const nameBlock = (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1.5">
        {manage && asset.label && <LabelDot color={asset.label} />}
        {editing ? (
          <InlineName
            initial={name}
            label={t('contentStudio.mediaBin.rename')}
            className="w-full"
            onDone={(v) => {
              setEditing(false);
              if (v !== null && v.trim()) onRename(v);
            }}
          />
        ) : (
          <p
            className="text-xs font-medium text-card-foreground truncate"
            title={name === asset.originalFileName ? name : `${name} (${asset.originalFileName})`}
            onDoubleClick={manage ? () => setEditing(true) : undefined}
          >
            {name}
          </p>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground">
        {detail}
        {manage && asset.folder && <span className="ml-1 opacity-70">· {asset.folder}</span>}
        {status === 'processing' && (
          <span className="ml-1 inline-flex items-center gap-1 text-premium">
            <Loader2 className="w-3 h-3 animate-spin" />
            {t('contentStudio.mediaBin.building')}
          </span>
        )}
        {status === 'failed' && (
          <span className="ml-1 inline-flex items-center gap-1 text-destructive">
            <AlertCircle className="w-3 h-3" />
            {t('contentStudio.mediaBin.failed')}
          </span>
        )}
        {ready && rebuildState?.state === 'processing' && (
          <span className="ml-1 inline-flex items-center gap-1 text-premium" role="status">
            <Loader2 className="w-3 h-3 animate-spin" />
            {t('contentStudio.mediaBin.rebuilding', { percent: rebuildState.progress ?? 0 })}
          </span>
        )}
      </p>
    </div>
  );

  const actions = (
    <div className="flex items-center shrink-0">
      {(manage || (ready && asset.hasAudio) || showRebuild) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-1.5"
              disabled={isDeriving}
              onPointerDown={(e) => e.stopPropagation()}
              title={t('contentStudio.mediaBin.moreActions')}
              aria-label={t('contentStudio.mediaBin.moreActions')}
            >
              {isDeriving ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreHorizontal className="w-4 h-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {manage && (
              <>
                <DropdownMenuItem onClick={() => setEditing(true)}>
                  <Pencil className="w-3.5 h-3.5" />
                  {t('contentStudio.mediaBin.rename')}
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>{t('contentStudio.mediaBin.label')}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {LABEL_COLORS.map((c) => (
                      <DropdownMenuItem key={c} onClick={() => onLabel(c)}>
                        <LabelDot color={c} />
                        {t(`contentStudio.mediaBin.${labelKey(c)}`)}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onLabel('')}>{t('contentStudio.mediaBin.labelNone')}</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>{t('contentStudio.mediaBin.moveToFolder')}</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {folders.map((f) => (
                      <DropdownMenuItem key={f.name} onClick={() => onMove(f.name)}>
                        <Folder className="w-3.5 h-3.5" />
                        {f.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onClick={() => onMove('')}>{t('contentStudio.mediaBin.removeFromFolder')}</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </>
            )}
            {ready && asset.hasAudio && (
              <>
                {manage && <DropdownMenuSeparator />}
                <DropdownMenuItem onClick={() => deriveTracked(asset.id, 'voice_clean')}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('contentStudio.mediaBin.aiCleanVoice')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => deriveTracked(asset.id, 'split_vocals')}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('contentStudio.mediaBin.aiIsolateVocals')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => deriveTracked(asset.id, 'split_instrumental')}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('contentStudio.mediaBin.aiIsolateMusic')}
                </DropdownMenuItem>
              </>
            )}
            {showRebuild && (
              <>
                {(manage || (ready && asset.hasAudio)) && <DropdownMenuSeparator />}
                <DropdownMenuItem onClick={onRebuild} title={t('contentStudio.mediaBin.rebuildPreviewHint')}>
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t('contentStudio.mediaBin.rebuildPreview')}
                </DropdownMenuItem>
              </>
            )}
            {manage && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                  {t('contentStudio.mediaBin.delete')}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="h-7 px-1.5"
        disabled={status !== 'ready'}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onAdd}
        title={t('contentStudio.mediaBin.addToTimeline')}
        aria-label={t('contentStudio.mediaBin.addToTimeline')}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...(editing || selectMode ? {} : listeners)}
      onClick={selectMode ? onToggleSelect : undefined}
      className={`rounded-md border bg-background/60 p-2 ${grid ? 'flex flex-col gap-1.5' : 'flex items-center gap-2'} ${
        selected ? 'border-primary ring-1 ring-primary' : 'border-border'
      } ${ready && !selectMode ? 'cursor-grab active:cursor-grabbing' : ''} ${isDragging ? 'opacity-40' : ''}`}
      title={ready && !selectMode ? t('contentStudio.mediaBin.dragHint') : undefined}
    >
      {selectMode && (
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          onClick={(e) => e.stopPropagation()}
          aria-label={name}
          className="shrink-0"
        />
      )}
      {thumb}
      {grid ? (
        <div className="flex items-start gap-1">
          {nameBlock}
          {actions}
        </div>
      ) : (
        <>
          {nameBlock}
          {actions}
        </>
      )}
      {status === 'processing' && entry.jobId ? <IngestWatcher assetId={asset.id} jobId={entry.jobId} /> : null}
    </div>
  );
};

// LutTile renders a .cube LUT asset — no timeline placement; it's selected from
// a clip's LUT effect in the inspector.
const LutTile: React.FC<{ entry: StudioAssetEntry; manage: boolean; onDelete: () => void }> = ({ entry, manage, onDelete }) => {
  const { t } = useLocalization('interface');
  const name = assetDisplayName(entry.asset);
  return (
    <div className="rounded-md border border-border bg-background/60 p-2 flex items-center gap-2" title={t('contentStudio.mediaBin.lutHint')}>
      <div className="shrink-0 w-12 h-9 rounded bg-muted flex items-center justify-center">
        <Palette className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-card-foreground truncate" title={name}>
          {name}
        </p>
        <p className="text-[11px] text-muted-foreground truncate">{t('contentStudio.mediaBin.lutHint')}</p>
      </div>
      {manage && (
        <Button size="sm" variant="ghost" className="h-7 px-1.5" onClick={onDelete} title={t('contentStudio.mediaBin.delete')} aria-label={t('contentStudio.mediaBin.delete')}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
};

// IngestWatcher subscribes to the asset's ingest job and flips the store status
// when the proxy is ready (or the job fails). Renders nothing.
const IngestWatcher: React.FC<{ assetId: string; jobId: string }> = ({ assetId, jobId }) => {
  const setAssetStatus = useStudioStore((s) => s.setAssetStatus);
  useStudioJobProgress(jobId, {
    onComplete: () => setAssetStatus(assetId, 'ready'),
    onError: (msg) => setAssetStatus(assetId, 'failed', msg),
  });
  return null;
};

export default MediaBin;
