'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, Download, Folder, Loader2, Play, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useLocalization } from '@/i18n/useLocalization';
import { createEntryUrlStore, type EntryUrlStore } from '@/lib/results/archive/entryUrls';
import { isOverArchiveCap } from '@/lib/results/archive/limits';
import { buildRows, isGalleryArchive } from '@/lib/results/archive/tree';
import type { ArchiveEntry } from '@/lib/results/archive/types';
import { useOpenedArchive } from '@/lib/results/archive/useOpenedArchive';
import { mimeForFileName } from '@/lib/results/describe';
import { saveBlobToDisk } from '@/lib/results/save';
import { useResultBlob } from '@/lib/results/useResultBlob';
import { cn } from '@/lib/utils';
import { ImageViewer } from './image-viewer';
import type { ViewerProps } from './types';
import { KIND_ICONS, UnknownViewer } from './unknown-viewer';

/** A blob URL for one entry, acquired while mounted (and visible, when `when` is given). */
function useEntryUrl(store: EntryUrlStore, entry: ArchiveEntry, enabled: boolean): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    setUrl(store.acquire(entry));
    return () => {
      store.release(entry.path);
      setUrl(null);
    };
  }, [store, entry, enabled]);
  return url;
}

function GalleryCell({ entry, store, onOpen }: { entry: ArchiveEntry; store: EntryUrlStore; onOpen: (e: ArchiveEntry) => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver((records) => {
      for (const r of records) setVisible(r.isIntersecting);
    }, { rootMargin: '200px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const url = useEntryUrl(store, entry, visible);
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(entry)}
      className="group relative aspect-square overflow-hidden rounded-md border border-edge bg-surface-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      title={entry.path}
      data-testid="gallery-cell"
    >
      {url && <img src={url} alt={entry.path} loading="lazy" decoding="async" className="size-full object-cover" />}
      <span className="absolute inset-x-0 bottom-0 truncate bg-background/80 px-1.5 py-0.5 text-xs text-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {entry.path.split('/').pop()}
      </span>
    </button>
  );
}

function InlinePlayer({ entry, store }: { entry: ArchiveEntry; store: EntryUrlStore }) {
  const url = useEntryUrl(store, entry, true);
  if (!url) return null;
  return <video src={url} controls playsInline autoPlay className="max-h-80 max-w-full rounded-lg bg-surface-0" />;
}

/**
 * Archive viewer: reads a zip / tar.gz in the browser (fflate, imported on first open) and
 * lists its entries, with an image gallery when most files are images, a lightbox, inline
 * players for videos and per-entry download. Over the size cap it never reads the file and
 * shows the file card instead.
 */
export function ArchiveViewer(props: ViewerProps) {
  const { descriptor, fileName, onEntryOpen } = props;
  const { t, formatFileSize } = useLocalization('interface');
  const tooLarge = isOverArchiveCap(descriptor.sizeBytes);
  const blobState = useResultBlob(descriptor, { enabled: !tooLarge });
  const archiveState = useOpenedArchive(tooLarge ? null : blobState.blob, fileName);
  const store = useMemo(() => createEntryUrlStore(), []);
  useEffect(() => () => store.dispose(), [store]);

  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set());
  const [query, setQuery] = useState('');
  const [lightbox, setLightbox] = useState<{ entry: ArchiveEntry; url: string } | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  const archive = archiveState.status === 'ready' ? archiveState.archive : null;
  const entries = useMemo(() => archive?.entries ?? [], [archive]);
  const gallery = useMemo(() => isGalleryArchive(entries), [entries]);
  const images = useMemo(() => entries.filter((e) => !e.isDir && (e.kind === 'image' || e.kind === 'gif')), [entries]);
  const rows = useMemo(() => buildRows(entries, expanded, query), [entries, expanded, query]);
  const [view, setView] = useState<'gallery' | 'list'>('gallery');

  if (tooLarge || archiveState.status === 'error') {
    const reason =
      tooLarge || (archiveState.status === 'error' && archiveState.code === 'too-large')
        ? t('resultPanel.archive.tooLarge')
        : t('resultPanel.archive.unreadable');
    return (
      <div className="flex w-full flex-col items-center gap-3" data-testid="archive-fallback">
        <UnknownViewer {...props} />
        <p role="status" className="text-sm text-muted-foreground">
          {reason} {t('resultPanel.archive.noSingleEntry')}
        </p>
      </div>
    );
  }
  if (blobState.status === 'error') {
    return (
      <div role="alert" className="space-y-3 text-center">
        <p className="text-destructive">{blobState.error?.message ?? t('resultPanel.loadFailed')}</p>
        <button type="button" onClick={blobState.retry} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">
          {t('resultPanel.retry')}
        </button>
      </div>
    );
  }
  if (!archive) {
    return (
      <p role="status" className="flex items-center gap-2 text-muted-foreground">
        <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
        {t('resultPanel.loading')}
      </p>
    );
  }

  const files = entries.filter((e) => !e.isDir);
  const openImage = (entry: ArchiveEntry) => {
    const url = store.acquire(entry);
    if (!url) return;
    setLightbox((prev) => {
      if (prev) store.release(prev.entry.path);
      return { entry, url };
    });
    onEntryOpen?.(entry.kind);
  };
  const closeLightbox = () => {
    setLightbox((prev) => {
      if (prev) store.release(prev.entry.path);
      return null;
    });
  };
  const downloadEntry = (entry: ArchiveEntry) => {
    if (!entry.data) return;
    saveBlobToDisk(new Blob([entry.data() as BlobPart], { type: mimeForFileName(entry.path) }), entry.path.split('/').pop() || entry.path);
    onEntryOpen?.(entry.kind);
  };
  const toggleFolder = (path: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  const lightboxIndex = lightbox ? images.findIndex((e) => e.path === lightbox.entry.path) : -1;
  const step = (delta: number) => {
    if (!images.length || lightboxIndex < 0) return;
    openImage(images[(lightboxIndex + delta + images.length) % images.length]);
  };

  return (
    <div className="flex w-full flex-col gap-3" data-testid="archive-viewer">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {t('resultPanel.archive.summary', { count: files.length })}
          {archive.truncated && <span className="ml-2 text-destructive">{t('resultPanel.archive.truncated')}</span>}
        </p>
        <label className="relative">
          <span className="sr-only">{t('resultPanel.archive.search')}</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('resultPanel.archive.search')}
            className="min-h-9 rounded-md border border-edge bg-background py-1 pl-8 pr-2 text-sm"
          />
        </label>
      </div>

      {gallery && (
        <div className="flex gap-2" role="group" aria-label={t('resultPanel.archive.view')}>
          {(['gallery', 'list'] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={cn('rounded-md border px-3 py-1.5 text-sm', view === v ? 'border-primary text-foreground' : 'border-edge text-muted-foreground hover:text-foreground')}
            >
              {t(`resultPanel.archive.${v}`)}
            </button>
          ))}
        </div>
      )}

      {gallery && view === 'gallery' ? (
        <div className="grid max-h-[calc(100dvh-24rem)] grid-cols-3 gap-2 overflow-auto sm:grid-cols-4 md:grid-cols-6" data-testid="archive-gallery">
          {images
            .filter((e) => !query.trim() || e.path.toLowerCase().includes(query.trim().toLowerCase()))
            .map((entry) => (
              <GalleryCell key={entry.path} entry={entry} store={store} onOpen={openImage} />
            ))}
        </div>
      ) : (
        <ul className="max-h-[calc(100dvh-24rem)] divide-y divide-edge overflow-auto rounded-lg border border-edge" data-testid="archive-list">
          {rows.length === 0 && <li className="p-3 text-sm text-muted-foreground">{t('resultPanel.archive.noMatches')}</li>}
          {rows.map((row) => {
            const Icon = row.isDir ? Folder : KIND_ICONS[row.entry?.kind ?? 'unknown'];
            const open = expanded.has(row.path);
            return (
              <li key={row.path} className="flex flex-col">
                <div className="flex items-center gap-2 px-3 py-1.5 text-sm" style={{ paddingInlineStart: `${0.75 + row.depth * 1}rem` }}>
                  {row.isDir ? (
                    <button type="button" onClick={() => toggleFolder(row.path)} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                      {open ? <ChevronDown aria-hidden="true" className="size-4 shrink-0" /> : <ChevronRight aria-hidden="true" className="size-4 shrink-0" />}
                      <Icon aria-hidden={true} className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{row.name}</span>
                    </button>
                  ) : (
                    <>
                      <Icon aria-hidden={true} className="size-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1 truncate" title={row.entry!.path}>{row.name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{formatFileSize(row.entry!.size)}</span>
                      {row.entry!.kind === 'video' && (
                        <button
                          type="button"
                          onClick={() => {
                            setPlaying((p) => (p === row.entry!.path ? null : row.entry!.path));
                            onEntryOpen?.('video');
                          }}
                          aria-label={t('resultPanel.archive.play', { name: row.name })}
                          className="rounded p-1 text-muted-foreground hover:text-foreground"
                        >
                          <Play aria-hidden="true" className="size-4" />
                        </button>
                      )}
                      {(row.entry!.kind === 'image' || row.entry!.kind === 'gif') && (
                        <button type="button" onClick={() => openImage(row.entry!)} className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground">
                          {t('resultPanel.archive.open')}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => downloadEntry(row.entry!)}
                        aria-label={t('resultPanel.archive.downloadEntry', { name: row.name })}
                        className="rounded p-1 text-muted-foreground hover:text-foreground"
                      >
                        <Download aria-hidden="true" className="size-4" />
                      </button>
                    </>
                  )}
                </div>
                {playing === row.path && row.entry && (
                  <div className="px-3 pb-3">
                    <InlinePlayer entry={row.entry} store={store} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">{t('resultPanel.archive.noSingleEntry')}</p>

      <Dialog open={!!lightbox} onOpenChange={(o) => !o && closeLightbox()}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-4xl">
          <DialogTitle className="truncate pr-8">{lightbox?.entry.path}</DialogTitle>
          <DialogDescription className="sr-only">{t('resultPanel.archive.lightbox')}</DialogDescription>
          {lightbox && (
            <>
              <ImageViewer
                {...props}
                role="result"
                kind="image"
                src={lightbox.url}
                blob={null}
                fileName={lightbox.entry.path}
                mime={mimeForFileName(lightbox.entry.path)}
                sizeBytes={lightbox.entry.size}
              />
              <div className="flex gap-2">
                {images.length > 1 && (
                  <>
                    <button type="button" onClick={() => step(-1)} className="rounded-md border border-edge px-3 py-1.5 text-sm">{t('resultPanel.archive.previous')}</button>
                    <button type="button" onClick={() => step(1)} className="rounded-md border border-edge px-3 py-1.5 text-sm">{t('resultPanel.archive.next')}</button>
                  </>
                )}
                <button type="button" onClick={() => downloadEntry(lightbox.entry)} className="rounded-md border border-edge px-3 py-1.5 text-sm">
                  {t('resultPanel.archive.downloadEntry', { name: lightbox.entry.path.split('/').pop() ?? '' })}
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ArchiveViewer;
