'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Film, Music, Plus, UploadCloud, Loader2, AlertCircle, Palette, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore, type StudioAssetEntry } from '@/lib/studioStore';
import { useUploadStudioAsset, useDeriveStudioAsset } from '@/lib/useStudioAsset';
import { useStudioJobProgress } from '@/lib/useStudioJob';

/**
 * Media bin — drag/drop or pick source files, watch ingest progress, and add
 * ready clips to the timeline. Phase 1 adds clips by click ("Add"); drag from
 * the bin onto a track lands with @dnd-kit in Phase 2.
 */
const MediaBin: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { t } = useLocalization('interface');
  const assets = useStudioStore((s) => s.assets);
  const addClipFromAsset = useStudioStore((s) => s.addClipFromAsset);
  const { upload, isUploading } = useUploadStudioAsset(projectId);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => upload(file));
  };

  const entries = Object.values(assets);
  const mediaEntries = entries.filter((e) => e.asset.mediaKind !== 'lut');
  const lutEntries = entries.filter((e) => e.asset.mediaKind === 'lut');

  return (
    <div className="flex flex-col h-full min-h-0">
      <h2 className="text-sm font-semibold text-card-foreground mb-2 flex items-center gap-2">
        <Film className="w-4 h-4 text-blue-500" />
        {t('contentStudio.slots.mediaBin.title')}
      </h2>

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
        className={`rounded-lg border border-dashed p-4 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-border bg-background/40'
        }`}
      >
        <UploadCloud className="w-6 h-6 mx-auto text-muted-foreground" />
        <p className="text-xs text-muted-foreground mt-2">{t('contentStudio.mediaBin.dropHint')}</p>
        <Button
          size="sm"
          variant="outline"
          className="mt-3"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {t('contentStudio.mediaBin.choose')}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="video/*,audio/*,.cube"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      <div className="mt-3 flex-1 min-h-0 overflow-y-auto space-y-2">
        {entries.length === 0 ? (
          <p className="text-xs text-muted-foreground px-1">{t('contentStudio.mediaBin.empty')}</p>
        ) : (
          mediaEntries.map((entry) => (
            <MediaTile key={entry.asset.id} entry={entry} onAdd={() => addClipFromAsset(entry.asset.id)} />
          ))
        )}
        {lutEntries.length > 0 && (
          <>
            <p className="text-[11px] font-semibold text-muted-foreground px-1 pt-2 flex items-center gap-1">
              <Palette className="w-3 h-3 text-blue-500" />
              {t('contentStudio.mediaBin.luts')}
            </p>
            {lutEntries.map((entry) => (
              <LutTile key={entry.asset.id} entry={entry} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

const MediaTile: React.FC<{ entry: StudioAssetEntry; onAdd: () => void }> = ({ entry, onAdd }) => {
  const { t, formatReadableDuration } = useLocalization('interface');
  const { asset, status } = entry;
  const isAudio = asset.mediaKind === 'audio';
  const ready = status === 'ready';
  const { derive, isDeriving } = useDeriveStudioAsset();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `asset:${asset.id}`,
    data: { type: 'asset', assetId: asset.id, kind: asset.mediaKind, label: asset.originalFileName },
    disabled: !ready,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`rounded-md border border-border bg-background/60 p-2 flex items-center gap-2 ${
        ready ? 'cursor-grab active:cursor-grabbing' : ''
      } ${isDragging ? 'opacity-40' : ''}`}
      title={ready ? t('contentStudio.mediaBin.dragHint') : undefined}
    >
      <div className="shrink-0 w-12 h-9 rounded bg-muted flex items-center justify-center">
        {isAudio ? <Music className="w-4 h-4 text-blue-500" /> : <Film className="w-4 h-4 text-blue-500" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-card-foreground truncate" title={asset.originalFileName}>
          {asset.originalFileName}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {asset.durationSeconds > 0 ? formatReadableDuration(asset.durationSeconds) : '—'}
          {status === 'processing' && (
            <span className="ml-1 inline-flex items-center gap-1 text-amber-500">
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
        </p>
      </div>
      {ready && asset.hasAudio && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="shrink-0 h-7 px-2"
              disabled={isDeriving}
              onPointerDown={(e) => e.stopPropagation()}
              title={t('contentStudio.mediaBin.aiActions')}
            >
              {isDeriving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => derive(asset.id, 'voice_clean')}>
              {t('contentStudio.mediaBin.aiCleanVoice')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => derive(asset.id, 'split_vocals')}>
              {t('contentStudio.mediaBin.aiIsolateVocals')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => derive(asset.id, 'split_instrumental')}>
              {t('contentStudio.mediaBin.aiIsolateMusic')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="shrink-0 h-7 px-2"
        disabled={status !== 'ready'}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onAdd}
        title={t('contentStudio.mediaBin.addToTimeline')}
      >
        <Plus className="w-4 h-4" />
      </Button>
      {status === 'processing' && entry.jobId ? <IngestWatcher assetId={asset.id} jobId={entry.jobId} /> : null}
    </div>
  );
};

// LutTile renders a .cube LUT asset — no timeline placement; it's selected from
// a clip's LUT effect in the inspector.
const LutTile: React.FC<{ entry: StudioAssetEntry }> = ({ entry }) => {
  const { t } = useLocalization('interface');
  return (
    <div className="rounded-md border border-border bg-background/60 p-2 flex items-center gap-2" title={t('contentStudio.mediaBin.lutHint')}>
      <div className="shrink-0 w-12 h-9 rounded bg-muted flex items-center justify-center">
        <Palette className="w-4 h-4 text-blue-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-card-foreground truncate" title={entry.asset.originalFileName}>
          {entry.asset.originalFileName}
        </p>
        <p className="text-[11px] text-muted-foreground truncate">{t('contentStudio.mediaBin.lutHint')}</p>
      </div>
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
