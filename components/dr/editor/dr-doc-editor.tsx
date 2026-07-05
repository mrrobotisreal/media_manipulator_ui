'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { EditorContent, useEditor } from '@tiptap/react';
import type { Editor, JSONContent, Range } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import { Placeholder } from '@tiptap/extension-placeholder';

import { Button } from '@/components/ui/button';
import { DrDocContentSchema, type DrAssetKind, type DrDoc } from '@/schemas/drDocs';
import { blocksToTiptap } from '@/lib/dr/editor/blocksToTiptap';
import { tiptapToBlocks } from '@/lib/dr/editor/tiptapToBlocks';
import type { TiptapDoc } from '@/lib/dr/editor/tiptapDoc';
import { publishDrDoc, updateDrDoc } from '@/lib/dr/docEditorApi';
import { CalloutNode, DrFileNode, DrImageNode, DrVideoNode, NoListNesting } from './extensions/nodes';
import { createSlashCommand } from './slash-menu';
import BubbleToolbar from './bubble-toolbar';
import MediaInsertPopover from './media-insert-popover';

type SaveStatus = 'saved' | 'saving' | 'error';
const AUTOSAVE_DELAY = 1500;

interface MediaRequest {
  kind: DrAssetKind;
  range: Range;
  position: { top: number; left: number };
}

// Authoring surface for a DR document draft. Renders the title/summary inputs
// and a Tiptap editor (slash commands, bubble toolbar, media nodes) whose JSON
// is serialized back to dr-blocks/v1 on a debounced autosave and on publish.
export default function DrDocEditor({ draft }: { draft: DrDoc }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(draft.title === 'Untitled' ? '' : draft.title);
  const [summary, setSummary] = useState(draft.summary ?? '');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [pendingUploads, setPendingUploads] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [mediaRequest, setMediaRequest] = useState<MediaRequest | null>(null);

  // Refs so the stable save closure always reads current values.
  const titleRef = useRef(title);
  const summaryRef = useRef(summary);
  const pendingRef = useRef(0);
  const editorRef = useRef<Editor | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleSaveRef = useRef<() => void>(() => {});

  const onPendingChange = useCallback((delta: number) => {
    setPendingUploads((n) => Math.max(0, n + delta));
  }, []);

  // Slash-menu media items open the insert popover near the caret. The editor is
  // passed in by the slash command (it owns the live instance) so this closure
  // reads no refs.
  const onInsertMedia = useCallback((activeEditor: Editor, range: Range, kind: DrAssetKind) => {
    const coords = activeEditor.view.coordsAtPos(range.from);
    setMediaRequest({
      kind,
      range,
      position: { top: coords.bottom + window.scrollY + 6, left: coords.left + window.scrollX },
    });
  }, []);

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
          link: { openOnClick: false, autolink: false, HTMLAttributes: { rel: 'noopener noreferrer' } },
        }),
        Table.configure({ resizable: false }),
        TableRow,
        TableHeader,
        TableCell,
        Placeholder.configure({ placeholder: "Type '/' for commands…" }),
        NoListNesting,
        CalloutNode,
        DrImageNode.configure({ docId: draft.id, onPendingChange }),
        DrVideoNode.configure({ docId: draft.id, onPendingChange }),
        DrFileNode.configure({ docId: draft.id, onPendingChange }),
        createSlashCommand(onInsertMedia),
      ],
      content: blocksToTiptap(draft.content),
      editorProps: {
        attributes: { class: 'dr-editor-content focus:outline-none' },
        handleKeyDown: (_view, event) => {
          if ((event.metaKey || event.ctrlKey) && (event.key === 'k' || event.key === 'K')) {
            event.preventDefault();
            setLinkOpen(true);
            return true;
          }
          return false;
        },
      },
    },
    [draft.id],
  );

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Mirror the upload count into a ref so the stable save closure can read it
  // without depending on the state value.
  useEffect(() => {
    pendingRef.current = pendingUploads;
  }, [pendingUploads]);

  const performSave = useCallback(async () => {
    const activeEditor = editorRef.current;
    if (!activeEditor) return;
    if (pendingRef.current > 0) {
      // An upload is mid-flight — defer until it completes.
      scheduleSaveRef.current();
      return;
    }
    let content;
    try {
      content = tiptapToBlocks(activeEditor.getJSON() as unknown as TiptapDoc);
    } catch (err) {
      console.error('dr editor: failed to serialize content', err);
      setSaveStatus('error');
      return;
    }
    const parsed = DrDocContentSchema.safeParse(content);
    if (!parsed.success) {
      console.error('dr editor: serialized content failed schema validation', parsed.error.issues);
      setSaveStatus('error');
      return;
    }
    try {
      setSaveStatus('saving');
      await updateDrDoc(draft.id, {
        title: titleRef.current.trim() || 'Untitled',
        summary: summaryRef.current.trim() || null,
        content: parsed.data,
      });
      setSaveStatus('saved');
    } catch (err) {
      console.error('dr editor: autosave failed', err);
      setSaveStatus('error');
    }
  }, [draft.id]);

  const scheduleSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void performSave(), AUTOSAVE_DELAY);
  }, [performSave]);

  useEffect(() => {
    scheduleSaveRef.current = scheduleSave;
  }, [scheduleSave]);

  // Autosave on editor edits.
  useEffect(() => {
    if (!editor) return;
    const handler = () => scheduleSave();
    editor.on('update', handler);
    return () => {
      editor.off('update', handler);
    };
  }, [editor, scheduleSave]);

  // Best-effort flush when the tab is hidden.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') void performSave();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [performSave]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const onTitleChange = (value: string) => {
    setTitle(value);
    titleRef.current = value;
    setSaveStatus('saving');
    scheduleSave();
  };
  const onSummaryChange = (value: string) => {
    setSummary(value);
    summaryRef.current = value;
    setSaveStatus('saving');
    scheduleSave();
  };

  const insertMediaNode = (node: JSONContent) => {
    if (!editor || !mediaRequest) return;
    editor.chain().focus().deleteRange(mediaRequest.range).insertContent(node).run();
    setMediaRequest(null);
    scheduleSave();
  };

  const isEmpty = !editor || editor.isEmpty;
  const canPublish = !isEmpty && pendingUploads === 0 && !publishing;

  const onPublish = async () => {
    if (!editor || !canPublish) return;
    setPublishing(true);
    try {
      await performSave(); // flush a final save first
      const published = await publishDrDoc(draft.id);
      await queryClient.invalidateQueries({ queryKey: ['dr', 'docs'] });
      toast.success('Document published');
      router.push(`/dr/docs/${published.slug}`);
    } catch (err) {
      setPublishing(false);
      toast.error('Could not publish', { description: err instanceof Error ? err.message : undefined });
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <style>{EDITOR_CSS}</style>

      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/dr/docs"
          title="Your draft is autosaved"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Documentation
        </Link>
        <div className="flex items-center gap-3">
          <SaveChip status={saveStatus} onRetry={() => void performSave()} pendingUploads={pendingUploads} />
          <Button onClick={onPublish} disabled={!canPublish}>
            {publishing && <Loader2 className="size-4 animate-spin" />}
            Publish
          </Button>
        </div>
      </div>

      {!editor ? (
        <EditorSkeleton />
      ) : (
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)] lg:gap-8">
          <div className="min-w-0">
            <input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Untitled"
              className="w-full border-0 bg-transparent text-3xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/50"
            />
            <input
              value={summary}
              onChange={(e) => onSummaryChange(e.target.value)}
              placeholder="Add a summary (optional — derived from the first paragraph if left blank)"
              className="mt-2 w-full border-0 bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/50"
            />
            <div className="my-4 border-b border-border" />
            <EditorContent editor={editor} />
          </div>
        </div>
      )}

      {editor && <BubbleToolbar editor={editor} linkOpen={linkOpen} setLinkOpen={setLinkOpen} />}

      {mediaRequest && (
        <MediaInsertPopover
          kind={mediaRequest.kind}
          position={mediaRequest.position}
          onInsert={insertMediaNode}
          onClose={() => setMediaRequest(null)}
        />
      )}
    </div>
  );
}

function SaveChip({
  status,
  onRetry,
  pendingUploads,
}: {
  status: SaveStatus;
  onRetry: () => void;
  pendingUploads: number;
}) {
  if (pendingUploads > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        Uploading…
      </span>
    );
  }
  if (status === 'saving') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        Saving…
      </span>
    );
  }
  if (status === 'error') {
    return (
      <button type="button" onClick={onRetry} className="inline-flex items-center gap-1.5 text-sm text-destructive">
        <AlertCircle className="size-3.5" />
        Save failed — Retry
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Check className="size-3.5 text-primary" />
      Saved
    </span>
  );
}

function EditorSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-9 w-2/3 animate-pulse rounded bg-muted" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
      <div className="mt-6 space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}

// Editor content typography — approximates the read-side renderer so authoring ≈
// reading. Scoped to .dr-editor-content (ProseMirror's root); uses the app's
// theme CSS variables.
const EDITOR_CSS = `
.dr-editor-content { line-height: 1.75; color: var(--foreground); }
.dr-editor-content:focus { outline: none; }
.dr-editor-content > * + * { margin-top: 0.25rem; }
.dr-editor-content h2 { font-size: 1.5rem; font-weight: 600; letter-spacing: -0.01em; margin: 2rem 0 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
.dr-editor-content h3 { font-size: 1.25rem; font-weight: 600; margin: 1.75rem 0 0.75rem; }
.dr-editor-content h4 { font-size: 1.125rem; font-weight: 600; margin: 1.5rem 0 0.5rem; }
.dr-editor-content p { margin: 0.75rem 0; }
.dr-editor-content ul { list-style: disc; margin: 0.75rem 0; padding-left: 1.5rem; }
.dr-editor-content ol { list-style: decimal; margin: 0.75rem 0; padding-left: 1.5rem; }
.dr-editor-content li { margin: 0.15rem 0; }
.dr-editor-content blockquote { border-left: 2px solid color-mix(in oklab, var(--primary) 40%, transparent); padding-left: 1rem; margin: 1.25rem 0; color: color-mix(in oklab, var(--foreground) 80%, transparent); }
.dr-editor-content pre { background: color-mix(in oklab, var(--muted) 40%, transparent); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1rem; overflow-x: auto; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.8rem; line-height: 1.4; }
.dr-editor-content pre code { background: none; padding: 0; font-size: inherit; }
.dr-editor-content code { background: var(--muted); border-radius: 0.25rem; padding: 0.1rem 0.35rem; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.85em; }
.dr-editor-content table { border-collapse: collapse; width: 100%; margin: 1.25rem 0; font-size: 0.875rem; }
.dr-editor-content th, .dr-editor-content td { border: 1px solid var(--border); padding: 0.5rem 0.75rem; text-align: left; vertical-align: top; }
.dr-editor-content th { background: color-mix(in oklab, var(--muted) 50%, transparent); font-weight: 600; }
.dr-editor-content hr { margin: 2rem 0; border: 0; border-top: 1px solid var(--border); }
.dr-editor-content p.is-editor-empty:first-child::before,
.dr-editor-content .is-empty::before { content: attr(data-placeholder); color: var(--muted-foreground); float: left; height: 0; pointer-events: none; }
`;
