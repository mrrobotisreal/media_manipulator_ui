'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import {
  Bold,
  Code,
  Code2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Paperclip,
  Quote,
  Send,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { NoListNesting } from '../editor/extensions/nodes';
import { tiptapToBlocks } from '@/lib/dr/editor/tiptapToBlocks';
import type { TiptapDoc } from '@/lib/dr/editor/tiptapDoc';
import {
  DrMessageContentSchema,
  drAssetAccept,
  DR_DOC_ASSET_MAX_BYTES,
  type DrAssetKind,
  type DrMessage,
} from '@/schemas/drFeedback';
import {
  deleteFeedbackAttachment,
  readImageDimensions,
  resolveDrAssetContentType,
  uploadFeedbackAttachment,
} from '@/lib/dr/feedbackApi';
import { useFeedbackActions } from '@/lib/dr/useDrFeedback';

interface PendingAttachment {
  localId: number;
  file: File;
  kind: DrAssetKind;
  contentType: string;
  previewUrl?: string; // object URL for image previews
  progress: number; // 0–100
  attachmentId?: string;
  status: 'uploading' | 'done' | 'error';
  controller: AbortController;
}

interface MessageComposerProps {
  conversationId: string;
  parentId?: string; // set → the message is a thread reply
  placeholder: string;
  autoFocus?: boolean;
  onSent?: (message: DrMessage) => void;
}

// A file's kind + server content-type, resolved via the image→video→file
// cascade (browsers sometimes leave File.type empty).
function inferKind(file: File): { kind: DrAssetKind; contentType: string } | null {
  for (const kind of ['image', 'video', 'file'] as DrAssetKind[]) {
    const contentType = resolveDrAssetContentType(file, kind);
    if (contentType) return { kind, contentType };
  }
  return null;
}

// The compact message composer: a small, self-contained Tiptap instance (NOT the
// doc editor). StarterKit with heading + horizontalRule disabled, plus the
// shared NoListNesting extension. Markdown input rules (**bold**, `code`, ```
// code block, > quote, - / 1. lists) come free from StarterKit. Enter sends,
// Shift+Enter inserts a newline, Cmd/Ctrl+Enter always sends; inside a code
// block Enter inserts a newline and Cmd/Ctrl+Enter sends.
export default function MessageComposer({ conversationId, parentId, placeholder, autoFocus, onSent }: MessageComposerProps) {
  const { sendMessage } = useFeedbackActions();
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [sending, setSending] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [, forceUpdate] = useState(0);

  const editorRef = useRef<Editor | null>(null);
  const sendRef = useRef<() => void>(() => {});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const localIdRef = useRef(0);
  const attachmentsRef = useRef<PendingAttachment[]>([]);
  useEffect(() => {
    // Mirror the committed attachments into a ref so the stable send closure +
    // unmount cleanup can read the latest without re-creating on every change.
    attachmentsRef.current = attachments;
  }, [attachments]);

  const uploading = attachments.some((a) => a.status === 'uploading');
  const doneAttachments = attachments.filter((a) => a.status === 'done' && a.attachmentId);

  const editor = useEditor(
    {
      immediatelyRender: false,
      autofocus: autoFocus ? 'end' : false,
      extensions: [
        StarterKit.configure({
          heading: false,
          horizontalRule: false,
          link: { openOnClick: false, autolink: false, HTMLAttributes: { rel: 'noopener noreferrer' } },
        }),
        NoListNesting,
        Placeholder.configure({ placeholder }),
      ],
      editorProps: {
        attributes: { class: 'dr-editor-content focus:outline-none min-h-[2.5rem] max-h-64 overflow-y-auto' },
        handleKeyDown: (_view, event) => {
          if (event.key !== 'Enter') return false;
          const mod = event.metaKey || event.ctrlKey;
          if (mod) {
            event.preventDefault();
            sendRef.current();
            return true;
          }
          // Inside a code block, plain/Shift Enter insert a newline (default).
          if (editorRef.current?.isActive('codeBlock')) return false;
          if (event.shiftKey) {
            event.preventDefault();
            editorRef.current?.chain().focus().splitBlock().run();
            return true;
          }
          event.preventDefault();
          sendRef.current();
          return true;
        },
      },
    },
    [conversationId, parentId, placeholder],
  );

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Re-render the toolbar's active states on selection/content changes.
  useEffect(() => {
    if (!editor) return;
    const rerender = () => forceUpdate((n) => n + 1);
    editor.on('selectionUpdate', rerender);
    editor.on('transaction', rerender);
    return () => {
      editor.off('selectionUpdate', rerender);
      editor.off('transaction', rerender);
    };
  }, [editor]);

  // Clean up in-flight uploads + object URLs on unmount.
  useEffect(
    () => () => {
      for (const a of attachmentsRef.current) {
        a.controller.abort();
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
      }
    },
    [],
  );

  const startUpload = useCallback(
    async (file: File) => {
      const inferred = inferKind(file);
      if (!inferred) {
        toast.error(`Unsupported file type: ${file.name}`);
        return;
      }
      const { kind, contentType } = inferred;
      if (file.size > DR_DOC_ASSET_MAX_BYTES[kind]) {
        toast.error(`${file.name} exceeds the ${Math.round(DR_DOC_ASSET_MAX_BYTES[kind] / (1024 * 1024))} MB ${kind} limit`);
        return;
      }
      const localId = ++localIdRef.current;
      const controller = new AbortController();
      const previewUrl = kind === 'image' ? URL.createObjectURL(file) : undefined;
      const pending: PendingAttachment = { localId, file, kind, contentType, previewUrl, progress: 0, status: 'uploading', controller };
      setAttachments((prev) => [...prev, pending]);

      let dims: { width: number | null; height: number | null } = { width: null, height: null };
      if (kind === 'image') dims = await readImageDimensions(file);

      try {
        const attachmentId = await uploadFeedbackAttachment({
          conversationId,
          file,
          kind,
          contentType,
          width: dims.width,
          height: dims.height,
          signal: controller.signal,
          onAssetId: (id) => setAttachments((prev) => prev.map((a) => (a.localId === localId ? { ...a, attachmentId: id } : a))),
          onProgress: (p) => setAttachments((prev) => prev.map((a) => (a.localId === localId ? { ...a, progress: p } : a))),
        });
        setAttachments((prev) => prev.map((a) => (a.localId === localId ? { ...a, attachmentId, progress: 100, status: 'done' } : a)));
      } catch (err) {
        if ((err as { name?: string })?.name === 'AbortError') return; // user cancelled — row already removed
        setAttachments((prev) => prev.map((a) => (a.localId === localId ? { ...a, status: 'error' } : a)));
        toast.error(`Upload failed: ${file.name}`);
      }
    },
    [conversationId],
  );

  const onPickFiles = (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) void startUpload(file);
  };

  const cancelAttachment = (localId: number) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.localId === localId);
      if (target) {
        target.controller.abort();
        // A completed-but-unbound upload must be deleted server-side too.
        if (target.status === 'done' && target.attachmentId) {
          void deleteFeedbackAttachment(conversationId, target.attachmentId).catch(() => {});
        }
        if (target.previewUrl) URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((a) => a.localId !== localId);
    });
  };

  const handleSend = useCallback(async () => {
    const ed = editorRef.current;
    if (!ed || sending) return;
    if (attachmentsRef.current.some((a) => a.status === 'uploading')) {
      toast('Please wait for uploads to finish');
      return;
    }
    let content;
    try {
      content = tiptapToBlocks(ed.getJSON() as unknown as TiptapDoc);
    } catch {
      toast.error('Could not read the message');
      return;
    }
    const parsed = DrMessageContentSchema.safeParse(content);
    if (!parsed.success) {
      toast.error('Message contains unsupported formatting');
      return;
    }
    const ready = attachmentsRef.current.filter((a) => a.status === 'done' && a.attachmentId).map((a) => a.attachmentId as string);
    if (parsed.data.blocks.length === 0 && ready.length === 0) return; // nothing to send

    setSending(true);
    try {
      const msg = await sendMessage(conversationId, { content: parsed.data, attachmentIds: ready, parentId });
      // Clear the draft, keep focus, and drop the (now-bound) attachment chips.
      ed.commands.clearContent();
      ed.commands.focus();
      for (const a of attachmentsRef.current) {
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
      }
      setAttachments([]);
      onSent?.(msg);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message');
      // Leave the draft + attachments intact so nothing is lost.
    } finally {
      setSending(false);
    }
  }, [conversationId, parentId, sending, sendMessage, onSent]);

  useEffect(() => {
    sendRef.current = () => void handleSend();
  }, [handleSend]);

  const applyLink = () => {
    const ed = editorRef.current;
    if (!ed) return;
    const value = (linkInputRef.current?.value ?? '').trim();
    if (!value) {
      ed.chain().focus().unsetLink().run();
    } else if (value.startsWith('#') || /^https?:\/\/.+/i.test(value)) {
      ed.chain().focus().extendMarkRange('link').setLink({ href: value }).run();
    } else {
      toast.error('Link must be an #anchor or an http(s) URL');
      return;
    }
    setLinkOpen(false);
  };

  const isEmpty = !editor || (editor.isEmpty && doneAttachments.length === 0);
  const canSend = !!editor && !sending && !uploading && !isEmpty;

  const accept = `${drAssetAccept('image')},${drAssetAccept('video')},${drAssetAccept('file')}`;

  return (
    <div className="rounded-xl border border-border bg-background focus-within:border-primary/50">
      {/* Pending attachment chips */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b border-border p-2">
          {attachments.map((a) => (
            <div key={a.localId} className="relative flex w-40 flex-col gap-1 rounded-md border border-border bg-muted/40 p-2">
              <div className="flex items-center gap-2">
                {a.previewUrl ? (
                  <img src={a.previewUrl} alt={a.file.name} className="size-8 shrink-0 rounded object-cover" />
                ) : (
                  <Paperclip className="size-4 shrink-0 text-muted-foreground" />
                )}
                <span className="min-w-0 flex-1 truncate text-xs" title={a.file.name}>
                  {a.file.name}
                </span>
                <button
                  type="button"
                  onClick={() => cancelAttachment(a.localId)}
                  className="shrink-0 rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label="Remove attachment"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              {a.status === 'uploading' && (
                <div className="h-1 w-full overflow-hidden rounded-full bg-border">
                  <div className="h-full bg-primary transition-all" style={{ width: `${a.progress}%` }} />
                </div>
              )}
              {a.status === 'error' && <span className="text-[10px] text-destructive">Upload failed</span>}
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b border-border px-1.5 py-1">
        {linkOpen ? (
          <div className="flex w-full items-center gap-1">
            <input
              ref={linkInputRef}
              autoFocus
              defaultValue={typeof editor?.getAttributes('link').href === 'string' ? editor?.getAttributes('link').href : ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  applyLink();
                } else if (e.key === 'Escape') {
                  setLinkOpen(false);
                }
              }}
              placeholder="#anchor or https://…"
              className="w-full rounded bg-muted px-2 py-1 text-sm outline-none"
            />
            <button type="button" onClick={applyLink} className="rounded px-2 py-1 text-sm font-medium text-primary hover:bg-accent">
              Apply
            </button>
          </div>
        ) : (
          <>
            <TB active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()} label="Bold (⌘B)">
              <Bold className="size-4" />
            </TB>
            <TB active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()} label="Italic (⌘I)">
              <Italic className="size-4" />
            </TB>
            <TB active={editor?.isActive('code')} onClick={() => editor?.chain().focus().toggleCode().run()} label="Inline code (⌘E)">
              <Code className="size-4" />
            </TB>
            <TB active={editor?.isActive('link')} onClick={() => setLinkOpen(true)} label="Link">
              <LinkIcon className="size-4" />
            </TB>
            <span className="mx-0.5 h-5 w-px bg-border" />
            <TB active={editor?.isActive('codeBlock')} onClick={() => editor?.chain().focus().toggleCodeBlock().run()} label="Code block">
              <Code2 className="size-4" />
            </TB>
            <TB active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()} label="Bulleted list">
              <List className="size-4" />
            </TB>
            <TB active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()} label="Numbered list">
              <ListOrdered className="size-4" />
            </TB>
            <TB active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()} label="Quote">
              <Quote className="size-4" />
            </TB>
            <span className="mx-0.5 h-5 w-px bg-border" />
            <TB active={false} onClick={() => fileInputRef.current?.click()} label="Attach a file">
              <Paperclip className="size-4" />
            </TB>
          </>
        )}
      </div>

      {/* Editor + send */}
      <div className="flex items-end gap-2 p-2">
        <div className="min-w-0 flex-1 px-1 text-sm">
          <EditorContent editor={editor} />
        </div>
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={!canSend}
          aria-label="Send message"
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors',
            canSend ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground',
          )}
        >
          {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(e) => {
          onPickFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}

function TB({
  active,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'flex size-8 items-center justify-center rounded transition-colors hover:bg-accent',
        active ? 'bg-accent text-primary' : 'text-foreground',
      )}
    >
      {children}
    </button>
  );
}
