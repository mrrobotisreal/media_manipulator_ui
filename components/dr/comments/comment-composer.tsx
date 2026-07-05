'use client';

import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DR_ATTACHMENT_ACCEPT,
  DR_ATTACHMENT_EXT,
  DR_MAX_ATTACHMENTS,
  DR_MAX_ATTACHMENT_BYTES,
} from '@/schemas/drComments';

interface PendingAttachment {
  localId: string;
  previewUrl: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  attachmentId?: string;
}

interface CommentComposerProps {
  authorEmail: string;
  upload: (file: File, onProgress: (p: number) => void) => Promise<string>;
  deleteAttachment: (attachmentId: string) => Promise<void>;
  onPublish: (body: string) => Promise<void>;
  onCancel: () => Promise<void>;
  placeholder?: string;
  submitLabel?: string;
  compact?: boolean;
  // Optional: the parent supplies this to focus the textarea imperatively (with
  // preventScroll) once the composer is positioned. There is deliberately NO
  // autoFocus-on-mount: this composer is rendered inside an absolutely-positioned
  // sidebar card that mounts at top:0 before the alignment pass moves it down.
  // The browser scrolls a focused-on-commit textarea into view — which would be
  // at the top of the page — hijacking the viewport. Focus must therefore happen
  // imperatively AFTER positioning, with { preventScroll: true }.
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export default function CommentComposer({
  authorEmail,
  upload,
  deleteAttachment,
  onPublish,
  onCancel,
  placeholder = 'Add a comment…',
  submitLabel = 'Submit',
  compact = false,
  textareaRef: externalTextareaRef,
}: CommentComposerProps) {
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = externalTextareaRef ?? internalTextareaRef;
  const removedRef = useRef<Set<string>>(new Set());

  const trimmedName = authorEmail.split('@')[0] || authorEmail;
  const initial = (trimmedName[0] || '?').toUpperCase();

  // Keep a ref to the latest attachments so the unmount cleanup can revoke every
  // object URL without re-subscribing the effect.
  const attachmentsRef = useRef<PendingAttachment[]>([]);
  attachmentsRef.current = attachments;
  useEffect(() => {
    return () => {
      for (const a of attachmentsRef.current) URL.revokeObjectURL(a.previewUrl);
    };
  }, []);

  const uploadingCount = attachments.filter((a) => a.status === 'uploading').length;
  const doneCount = attachments.filter((a) => a.status === 'done').length;
  const canSubmit = (body.trim() !== '' || doneCount >= 1) && uploadingCount === 0 && !submitting && !cancelling;

  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setError(null);
    const remaining = DR_MAX_ATTACHMENTS - attachments.length;
    const chosen = Array.from(files).slice(0, Math.max(0, remaining));
    if (Array.from(files).length > chosen.length) {
      toast.error(`At most ${DR_MAX_ATTACHMENTS} images per comment`);
    }
    for (const file of chosen) {
      if (!DR_ATTACHMENT_EXT[file.type]) {
        toast.error(`${file.name}: unsupported image type`);
        continue;
      }
      if (file.size > DR_MAX_ATTACHMENT_BYTES) {
        toast.error(`${file.name}: image exceeds 15 MB`);
        continue;
      }
      const localId = crypto.randomUUID();
      const previewUrl = URL.createObjectURL(file);
      setAttachments((prev) => [...prev, { localId, previewUrl, progress: 0, status: 'uploading' }]);
      upload(file, (p) => {
        setAttachments((prev) => prev.map((a) => (a.localId === localId ? { ...a, progress: p } : a)));
      })
        .then((attachmentId) => {
          // If removed mid-upload, clean up the now-orphaned attachment.
          if (removedRef.current.has(localId)) {
            removedRef.current.delete(localId);
            void deleteAttachment(attachmentId).catch(() => {});
            return;
          }
          setAttachments((prev) =>
            prev.map((a) => (a.localId === localId ? { ...a, status: 'done', progress: 100, attachmentId } : a)),
          );
        })
        .catch(() => {
          setAttachments((prev) => prev.map((a) => (a.localId === localId ? { ...a, status: 'error' } : a)));
        });
    }
  };

  const removeAttachment = (localId: string) => {
    const entry = attachments.find((a) => a.localId === localId);
    if (!entry) return;
    if (entry.status === 'uploading') {
      // Mark for cleanup once the in-flight upload resolves.
      removedRef.current.add(localId);
    } else if (entry.status === 'done' && entry.attachmentId) {
      void deleteAttachment(entry.attachmentId).catch(() => {});
    }
    URL.revokeObjectURL(entry.previewUrl);
    setAttachments((prev) => prev.filter((a) => a.localId !== localId));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await onPublish(body);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to post comment';
      setError(message);
      toast.error('Could not post comment', { description: message });
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await onCancel();
    } catch {
      // The draft may already be gone; closing is what matters.
      setCancelling(false);
    }
  };

  return (
    <div className={cn('rounded-lg border border-border bg-card p-3', compact && 'p-2')}>
      <div className="mb-2 flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
          {initial}
        </span>
        <span className="truncate text-sm font-medium">{trimmedName}</span>
      </div>

      <textarea
        ref={textareaRef}
        value={body}
        placeholder={placeholder}
        onChange={(e) => {
          setBody(e.target.value);
          autoGrow();
        }}
        className="min-h-16 w-full resize-none rounded-md border border-input bg-background px-2 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      />

      {attachments.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {attachments.map((a) => (
            <div key={a.localId} className="relative size-16 overflow-hidden rounded-md border border-border">
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img src={a.previewUrl} alt="" className="size-full object-cover" />
              {a.status === 'uploading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white">
                  <Loader2 className="mr-1 size-3 animate-spin" />
                  {a.progress}%
                </div>
              )}
              {a.status === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center bg-destructive/70 text-[10px] text-white">
                  Failed
                </div>
              )}
              <button
                type="button"
                onClick={() => removeAttachment(a.localId)}
                aria-label="Remove image"
                className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <div className="mt-2 flex items-center justify-between gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={DR_ATTACHMENT_ACCEPT}
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={attachments.length >= DR_MAX_ATTACHMENTS}
          aria-label="Attach images"
        >
          <ImagePlus className="size-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleCancel} disabled={cancelling || submitting}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleSubmit} disabled={!canSubmit}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
