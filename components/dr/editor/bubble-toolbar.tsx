'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Editor } from '@tiptap/core';
import { Bold, Code, Italic, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mirrors drSpanLink in schemas/drDocs.ts: a span link is either an in-page
// #anchor or an absolute http(s) URL.
function isValidLink(value: string): boolean {
  return value.startsWith('#') || /^https?:\/\/.+/i.test(value);
}

interface BubbleToolbarProps {
  editor: Editor;
  linkOpen: boolean;
  setLinkOpen: (open: boolean) => void;
}

// A custom selection toolbar (no extra Tiptap menu package): Bold / Italic /
// Inline code / Link, positioned above the current text selection.
export default function BubbleToolbar({ editor, linkOpen, setLinkOpen }: BubbleToolbarProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [invalid, setInvalid] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const update = () => {
      const { state, view } = editor;
      const { from, to, empty } = state.selection;
      // Show only for a non-empty text selection; never over an atom media node.
      if (empty || !editor.isEditable || editor.isActive('drImage') || editor.isActive('drVideo') || editor.isActive('drFile')) {
        setPos(null);
        setLinkOpen(false);
        return;
      }
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);
      setPos({
        top: Math.min(start.top, end.top) + window.scrollY - 46,
        left: (start.left + end.left) / 2 + window.scrollX,
      });
    };
    editor.on('selectionUpdate', update);
    editor.on('transaction', update);
    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor, setLinkOpen]);

  if (!pos) return null;

  const existingHref = editor.getAttributes('link').href;
  const applyLink = () => {
    const value = (linkInputRef.current?.value ?? '').trim();
    if (!value) {
      editor.chain().focus().unsetLink().run();
      setLinkOpen(false);
      setInvalid(false);
      return;
    }
    if (!isValidLink(value)) {
      setInvalid(true); // keep the popover open on invalid input
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: value }).run();
    setLinkOpen(false);
    setInvalid(false);
  };

  return (
    <div
      style={{ position: 'absolute', top: pos.top, left: pos.left, transform: 'translateX(-50%)', zIndex: 60 }}
      className="flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-lg"
      // Keep the editor selection when interacting with the toolbar buttons.
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).tagName !== 'INPUT') e.preventDefault();
      }}
    >
      {linkOpen ? (
        <div className="flex items-center gap-1">
          <input
            ref={linkInputRef}
            autoFocus
            defaultValue={typeof existingHref === 'string' ? existingHref : ''}
            onChange={() => invalid && setInvalid(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyLink();
              } else if (e.key === 'Escape') {
                setLinkOpen(false);
                setInvalid(false);
              }
            }}
            placeholder="#anchor or https://…"
            className={cn('w-56 rounded bg-muted px-2 py-1 text-sm outline-none', invalid && 'ring-1 ring-destructive')}
          />
          <button type="button" onClick={applyLink} className="rounded px-2 py-1 text-sm font-medium text-primary hover:bg-accent">
            Apply
          </button>
        </div>
      ) : (
        <>
          <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} label="Bold (⌘B)">
            <Bold className="size-4" />
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic (⌘I)">
            <Italic className="size-4" />
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} label="Inline code (⌘E)">
            <Code className="size-4" />
          </ToolbarButton>
          <ToolbarButton active={editor.isActive('link')} onClick={() => setLinkOpen(true)} label="Link (⌘K)">
            <LinkIcon className="size-4" />
          </ToolbarButton>
        </>
      )}
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
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
