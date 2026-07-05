'use client';

import { useEffect, useRef, useState } from 'react';
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { Download, File as FileIcon, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { readImageDimensions, uploadDrDocAsset } from '@/lib/dr/docEditorApi';
import { takeUpload } from '../uploadRegistry';
import { mediaKindOf, type DrMediaNodeOptions } from '../extensions/nodes';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

// Shared node view for drImage / drVideo / drFile. Handles the upload lifecycle
// (presign → PUT with progress → complete), an optional caption input for
// image/video, and cancel/remove. The transient File is claimed once from the
// upload registry via the node's pendingKey; on success the node's src becomes
// the canonical dr-asset://<id> reference while previewUrl keeps the object URL
// for display.
export default function MediaNodeView({ node, updateAttributes, deleteNode, selected, extension }: NodeViewProps) {
  const kind = mediaKindOf(node.type.name);
  const options = extension.options as DrMediaNodeOptions;

  const src = String(node.attrs.src ?? '');
  const previewUrl = (node.attrs.previewUrl as string | null) ?? null;
  const caption = (node.attrs.caption as string | null) ?? '';
  const name = String(node.attrs.name ?? '');
  const sizeBytes = typeof node.attrs.sizeBytes === 'number' ? node.attrs.sizeBytes : null;
  const pendingKey = (node.attrs.pendingKey as string | null) ?? null;

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!pendingKey || startedRef.current) return;
    const stashed = takeUpload(pendingKey);
    if (!stashed) return;
    startedRef.current = true;
    const controller = new AbortController();
    abortRef.current = controller;
    void (async () => {
      setUploading(true);
      options.onPendingChange(1);
      try {
        let width: number | null = null;
        let height: number | null = null;
        if (stashed.kind === 'image') {
          const dims = await readImageDimensions(stashed.file);
          width = dims.width;
          height = dims.height;
        }
        const assetId = await uploadDrDocAsset({
          docId: options.docId,
          file: stashed.file,
          kind: stashed.kind,
          contentType: stashed.contentType,
          width,
          height,
          onProgress: setProgress,
          signal: controller.signal,
        });
        updateAttributes({ src: `dr-asset://${assetId}`, pendingKey: null });
      } catch (err) {
        if ((err as { name?: string }).name !== 'AbortError') {
          toast.error('Upload failed', { description: err instanceof Error ? err.message : undefined });
          deleteNode();
        }
      } finally {
        setUploading(false);
        options.onPendingChange(-1);
      }
    })();
    // Only re-run if the pending key changes (it never does for a given node).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingKey]);

  const cancelUpload = () => {
    abortRef.current?.abort();
    deleteNode();
  };

  // dr-asset:// srcs are not directly displayable; previewUrl (object URL or the
  // API-hydrated presigned URL) is. External URLs are displayable directly.
  const displaySrc = previewUrl || (src.startsWith('dr-asset://') ? '' : src);

  const wrapperCls = cn(
    'group my-6',
    kind === 'file' ? 'max-w-md' : 'w-fit max-w-full',
    selected && 'rounded-lg outline outline-2 outline-primary/60',
  );

  if (uploading || (pendingKey && !displaySrc)) {
    return (
      <NodeViewWrapper className={wrapperCls}>
        <div contentEditable={false} className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <Loader2 className="size-5 shrink-0 animate-spin text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-foreground">Uploading {kind}…</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-muted">
              <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <button
            type="button"
            onClick={cancelUpload}
            aria-label="Cancel upload"
            className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
          >
            <X className="size-4" />
          </button>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className={wrapperCls}>
      <figure contentEditable={false} className="relative m-0">
        {kind === 'image' &&
          (displaySrc ? (
            <img src={displaySrc} alt={String(node.attrs.alt ?? '')} className="max-w-full rounded-lg border border-border" />
          ) : (
            <MediaUnavailable label="Image unavailable" />
          ))}
        {kind === 'video' &&
          (displaySrc ? (
            <video src={displaySrc} controls className="max-w-full rounded-lg border border-border" />
          ) : (
            <MediaUnavailable label="Video unavailable" />
          ))}
        {kind === 'file' && (
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <FileIcon className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{name || 'File'}</p>
              {sizeBytes != null && <p className="text-xs text-muted-foreground">{formatBytes(sizeBytes)}</p>}
            </div>
            <Download className="size-4 shrink-0 text-muted-foreground" />
          </div>
        )}

        {(kind === 'image' || kind === 'video') && (
          <input
            type="text"
            value={caption}
            onChange={(e) => updateAttributes({ caption: e.target.value || null })}
            placeholder="Add a caption (optional)"
            className="mt-2 w-full border-0 bg-transparent text-center text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/60"
          />
        )}

        <button
          type="button"
          onClick={() => deleteNode()}
          aria-label="Remove"
          className="absolute -right-2 -top-2 rounded-full border border-border bg-background p-1 text-muted-foreground opacity-0 shadow transition-opacity hover:text-destructive group-hover:opacity-100"
        >
          <X className="size-3" />
        </button>
      </figure>
    </NodeViewWrapper>
  );
}

function MediaUnavailable({ label }: { label: string }) {
  return (
    <div className="flex h-32 w-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
      {label}
    </div>
  );
}
