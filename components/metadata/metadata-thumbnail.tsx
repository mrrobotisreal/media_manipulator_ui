'use client';

import { useState } from 'react';
import { Download, Eye, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/i18n/useLocalization';
import { formatBytes } from '@/lib/metadata/format';
import { binaryBytes, type MetadataEntry } from '@/lib/metadata/types';

export const THUMBNAIL_TAGS = ['ThumbnailImage', 'PreviewImage', 'JpgFromRaw', 'OtherImage'] as const;

export function thumbnailEntries(entries: readonly MetadataEntry[]): MetadataEntry[] {
  return entries.filter((e) => e.binary && (THUMBNAIL_TAGS as readonly string[]).includes(e.tag));
}

export interface MetadataThumbnailProps {
  entries: readonly MetadataEntry[];
  /** Resolves the download URL for a binary entry; null before a job exists (home inspector). */
  resolveBinaryUrl?: (entry: MetadataEntry) => string | null;
  onDownload?: (entryId: string) => void;
}

function ThumbnailRow({ entry, url, onDownload }: { entry: MetadataEntry; url: string | null; onDownload?: (id: string) => void }) {
  const { t } = useLocalization('interface');
  const [previewing, setPreviewing] = useState(false);
  const bytes = binaryBytes(entry);
  return (
    <li className="space-y-2" data-entry-id={entry.id}>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-mono text-xs">{entry.tag}</span>
        {bytes !== undefined ? (
          <span className="num text-xs text-muted-foreground">{t('metadata.thumbnail.size', { size: formatBytes(bytes) })}</span>
        ) : null}
        {url ? (
          <>
            <Button type="button" variant="outline" size="sm" onClick={() => setPreviewing((p) => !p)}>
              <Eye aria-hidden="true" />
              {t('metadata.thumbnail.preview', { tag: entry.tag })}
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={url} download onClick={() => onDownload?.(entry.id)}>
                <Download aria-hidden="true" />
                {t('metadata.thumbnail.download', { tag: entry.tag })}
              </a>
            </Button>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">{t('metadata.thumbnail.unavailable')}</span>
        )}
      </div>
      {/* The image is requested from our own API only after an explicit click. */}
      {url && previewing ? (
        <img src={url} alt={entry.tag} className="max-h-48 rounded-md border border-edge" />
      ) : null}
    </li>
  );
}

/** Embedded thumbnails with the warning that they can outlive edits. */
export function MetadataThumbnail({ entries, resolveBinaryUrl, onDownload }: MetadataThumbnailProps) {
  const { t } = useLocalization('interface');
  const thumbs = thumbnailEntries(entries);
  if (!thumbs.length) return null;
  return (
    <div data-testid="metadata-thumbnail" className="mb-4 space-y-3 rounded-md border border-edge bg-surface-2 p-3">
      <p className="flex items-start gap-2 text-sm text-foreground">
        <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-premium" />
        {t('metadata.thumbnail.warning')}
      </p>
      <ul className="space-y-3">
        {thumbs.map((e) => (
          <ThumbnailRow key={e.id} entry={e} url={resolveBinaryUrl?.(e) ?? null} onDownload={onDownload} />
        ))}
      </ul>
    </div>
  );
}
