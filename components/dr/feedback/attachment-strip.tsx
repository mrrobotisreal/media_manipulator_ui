'use client';

import { useState } from 'react';
import { Download, File as FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DrMessageAttachment } from '@/schemas/drFeedback';
import ImageViewerModal from '../comments/image-viewer-modal';
import { formatBytes } from './display';

// Renders a message's attachments beneath its text (Slack model): image
// thumbnails open a lightbox (the comments viewer, reused — DrMessageAttachment
// is structurally a DrAttachment), videos play inline, files are download cards
// mirroring the doc renderer's file block.
export default function AttachmentStrip({ attachments }: { attachments: DrMessageAttachment[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  if (attachments.length === 0) return null;

  const images = attachments.filter((a) => a.kind === 'image');
  const others = attachments.filter((a) => a.kind !== 'image');

  return (
    <div className="mt-1.5 space-y-2">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="overflow-hidden rounded-md border border-border bg-muted transition-opacity hover:opacity-90"
              aria-label={`Open ${a.fileName}`}
            >
              <img src={a.viewUrl} alt={a.fileName} className="h-32 w-auto max-w-[240px] object-cover" />
            </button>
          ))}
        </div>
      )}

      {others.map((a) =>
        a.kind === 'video' ? (
          <video
            key={a.id}
            src={a.viewUrl}
            controls
            className="max-h-72 max-w-full rounded-md border border-border"
          />
        ) : (
          <a
            key={a.id}
            href={a.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className={cn(
              'flex max-w-md items-center gap-3 rounded-lg border border-border p-3 no-underline transition-colors hover:bg-accent/40',
            )}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <FileIcon className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{a.fileName}</p>
              {a.sizeBytes > 0 && <p className="text-xs text-muted-foreground">{formatBytes(a.sizeBytes)}</p>}
            </div>
            <Download className="size-4 shrink-0 text-muted-foreground" />
          </a>
        ),
      )}

      <ImageViewerModal
        attachments={images}
        startIndex={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onOpenChange={(o) => {
          if (!o) setLightboxIndex(null);
        }}
      />
    </div>
  );
}
