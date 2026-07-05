'use client';

import { useRef, useState } from 'react';
import type { JSONContent } from '@tiptap/core';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NODE } from '@/lib/dr/editor/tiptapDoc';
import { DR_DOC_ASSET_MAX_BYTES, drAssetAccept, type DrAssetKind } from '@/schemas/drDocs';
import { isDrAssetOversize, resolveDrAssetContentType } from '@/lib/dr/docEditorApi';
import { stashUpload } from './uploadRegistry';

function isHttpUrl(value: string): boolean {
  return /^https?:\/\/.+/i.test(value.trim());
}

// Build the Tiptap node to insert. Upload path stashes the File (claimed by the
// node view) and sets a pendingKey; embed path sets an external src directly.
function buildUploadNode(kind: DrAssetKind, file: File, contentType: string): JSONContent {
  const pendingKey = stashUpload({ file, kind, contentType });
  const previewUrl = URL.createObjectURL(file);
  if (kind === 'image') return { type: NODE.drImage, attrs: { src: '', alt: '', caption: null, previewUrl, pendingKey } };
  if (kind === 'video') return { type: NODE.drVideo, attrs: { src: '', caption: null, previewUrl, pendingKey } };
  return {
    type: NODE.drFile,
    attrs: { src: '', name: file.name, sizeBytes: file.size, contentType, previewUrl, pendingKey },
  };
}

function buildUrlNode(kind: DrAssetKind, url: string): JSONContent {
  const src = url.trim();
  if (kind === 'video') return { type: NODE.drVideo, attrs: { src, caption: null, previewUrl: src } };
  return { type: NODE.drImage, attrs: { src, alt: '', caption: null, previewUrl: src } };
}

interface MediaInsertPopoverProps {
  kind: DrAssetKind;
  position: { top: number; left: number };
  onInsert: (node: JSONContent) => void;
  onClose: () => void;
}

// Slash-menu media inserter. Image/Video offer Upload | Embed URL; File is
// upload-only. Size + type are checked client-side (mirrors the server caps)
// before anything is stashed.
export default function MediaInsertPopover({ kind, position, onInsert, onClose }: MediaInsertPopoverProps) {
  const allowUrl = kind !== 'file';
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (isDrAssetOversize(file.size, kind)) {
      toast.error(`That ${kind} is too large (max ${Math.round(DR_DOC_ASSET_MAX_BYTES[kind] / (1024 * 1024))} MB).`);
      return;
    }
    const contentType = resolveDrAssetContentType(file, kind);
    if (!contentType) {
      toast.error(`Unsupported ${kind} type.`);
      return;
    }
    onInsert(buildUploadNode(kind, file, contentType));
  };

  const embed = () => {
    if (!isHttpUrl(url)) {
      toast.error('Enter a valid http(s) URL.');
      return;
    }
    onInsert(buildUrlNode(kind, url));
  };

  return (
    <>
      {/* click-away catcher */}
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden />
      <div
        style={{ position: 'absolute', top: position.top, left: position.left, zIndex: 50 }}
        className="w-72 rounded-lg border border-border bg-popover p-3 shadow-lg"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium capitalize">Insert {kind}</span>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        {allowUrl && (
          <div className="mb-2 flex gap-1 rounded-md bg-muted p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setTab('upload')}
              className={cn('flex-1 rounded px-2 py-1', tab === 'upload' ? 'bg-background shadow' : 'text-muted-foreground')}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => setTab('url')}
              className={cn('flex-1 rounded px-2 py-1', tab === 'url' ? 'bg-background shadow' : 'text-muted-foreground')}
            >
              Embed URL
            </button>
          </div>
        )}

        {!allowUrl || tab === 'upload' ? (
          <div>
            <input
              ref={inputRef}
              type="file"
              accept={drAssetAccept(kind)}
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border py-4 text-sm text-muted-foreground transition-colors hover:bg-accent/40"
            >
              <Upload className="size-4" /> Choose a {kind}…
            </button>
          </div>
        ) : (
          <div className="flex gap-1">
            <input
              autoFocus
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  embed();
                }
              }}
              placeholder="https://…"
              className="flex-1 rounded bg-muted px-2 py-1 text-sm outline-none"
            />
            <button type="button" onClick={embed} className="rounded bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">
              Embed
            </button>
          </div>
        )}
      </div>
    </>
  );
}
