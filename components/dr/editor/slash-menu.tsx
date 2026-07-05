'use client';

import { forwardRef, useEffect, useImperativeHandle, useState, type ComponentType } from 'react';
import { Extension, type Editor, type Range } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion, { type SuggestionKeyDownProps, type SuggestionProps } from '@tiptap/suggestion';
import {
  AlertTriangle,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Info,
  List,
  ListOrdered,
  Minus,
  Paperclip,
  Quote,
  Table as TableIcon,
  Type,
  Video,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DrAssetKind } from '@/schemas/drDocs';
import { NODE } from '@/lib/dr/editor/tiptapDoc';

type IconType = ComponentType<{ className?: string }>;

export interface SlashItem {
  title: string;
  icon: IconType;
  keywords: string[];
  run: (editor: Editor, range: Range) => void;
}

// The command palette. Media items delegate to onInsertMedia (the editor root
// opens the upload / embed-URL popover); everything else runs a Tiptap command
// after deleting the "/query" range.
function buildItems(onInsertMedia: (editor: Editor, range: Range, kind: DrAssetKind) => void): SlashItem[] {
  return [
    { title: 'Text', icon: Type, keywords: ['paragraph', 'plain'], run: (e, r) => e.chain().focus().deleteRange(r).setParagraph().run() },
    { title: 'Heading 1', icon: Heading1, keywords: ['h1', 'title'], run: (e, r) => e.chain().focus().deleteRange(r).setNode(NODE.heading, { level: 1 }).run() },
    { title: 'Heading 2', icon: Heading2, keywords: ['h2'], run: (e, r) => e.chain().focus().deleteRange(r).setNode(NODE.heading, { level: 2 }).run() },
    { title: 'Heading 3', icon: Heading3, keywords: ['h3'], run: (e, r) => e.chain().focus().deleteRange(r).setNode(NODE.heading, { level: 3 }).run() },
    { title: 'Bullet List', icon: List, keywords: ['unordered', 'ul'], run: (e, r) => e.chain().focus().deleteRange(r).toggleBulletList().run() },
    { title: 'Numbered List', icon: ListOrdered, keywords: ['ordered', 'ol'], run: (e, r) => e.chain().focus().deleteRange(r).toggleOrderedList().run() },
    { title: 'Quote', icon: Quote, keywords: ['blockquote'], run: (e, r) => e.chain().focus().deleteRange(r).toggleBlockquote().run() },
    { title: 'Callout (Info)', icon: Info, keywords: ['note', 'info'], run: (e, r) => e.chain().focus().deleteRange(r).setNode(NODE.callout, { variant: 'info' }).run() },
    { title: 'Callout (Warning)', icon: AlertTriangle, keywords: ['warning', 'caution'], run: (e, r) => e.chain().focus().deleteRange(r).setNode(NODE.callout, { variant: 'warning' }).run() },
    { title: 'Table', icon: TableIcon, keywords: ['grid'], run: (e, r) => e.chain().focus().deleteRange(r).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
    { title: 'Code Block', icon: Code, keywords: ['pre', 'snippet'], run: (e, r) => e.chain().focus().deleteRange(r).toggleCodeBlock().run() },
    { title: 'Divider', icon: Minus, keywords: ['hr', 'rule', 'separator'], run: (e, r) => e.chain().focus().deleteRange(r).setHorizontalRule().run() },
    { title: 'Image', icon: ImageIcon, keywords: ['picture', 'photo'], run: (e, r) => onInsertMedia(e, r, 'image') },
    { title: 'Video', icon: Video, keywords: ['movie', 'clip'], run: (e, r) => onInsertMedia(e, r, 'video') },
    { title: 'File', icon: Paperclip, keywords: ['attachment', 'document', 'pdf'], run: (e, r) => onInsertMedia(e, r, 'file') },
  ];
}

function filterItems(items: SlashItem[], query: string): SlashItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) => item.title.toLowerCase().includes(q) || item.keywords.some((k) => k.includes(q)),
  );
}

interface SlashMenuListProps {
  items: SlashItem[];
  command: (item: SlashItem) => void;
}

export interface SlashMenuListRef {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

const SlashMenuList = forwardRef<SlashMenuListRef, SlashMenuListProps>(function SlashMenuList(
  { items, command },
  ref,
) {
  const [selected, setSelected] = useState(0);
  useEffect(() => setSelected(0), [items]);

  useImperativeHandle(
    ref,
    () => ({
      onKeyDown: (event) => {
        if (!items.length) return false;
        if (event.key === 'ArrowDown') {
          setSelected((i) => (i + 1) % items.length);
          return true;
        }
        if (event.key === 'ArrowUp') {
          setSelected((i) => (i - 1 + items.length) % items.length);
          return true;
        }
        if (event.key === 'Enter') {
          const item = items[selected];
          if (item) command(item);
          return true;
        }
        return false;
      },
    }),
    [items, selected, command],
  );

  if (!items.length) {
    return (
      <div className="w-64 rounded-lg border border-border bg-popover p-2 text-sm text-muted-foreground shadow-lg">
        No matching blocks
      </div>
    );
  }

  return (
    <div className="max-h-72 w-64 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg">
      {items.map((item, i) => (
        <button
          key={item.title}
          type="button"
          onMouseEnter={() => setSelected(i)}
          onClick={() => command(item)}
          className={cn(
            'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
            i === selected ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent/50',
          )}
        >
          <item.icon className="size-4 shrink-0 text-muted-foreground" />
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  );
});

function positionMenu(element: HTMLElement, clientRect?: (() => DOMRect | null) | null): void {
  const rect = clientRect?.();
  if (!rect) return;
  element.style.position = 'absolute';
  element.style.top = `${rect.bottom + window.scrollY + 6}px`;
  element.style.left = `${rect.left + window.scrollX}px`;
  element.style.zIndex = '60';
}

/** The `/` slash-command extension. onInsertMedia is invoked for the Image /
 *  Video / File items so the editor root can open the corresponding popover. */
export function createSlashCommand(
  onInsertMedia: (editor: Editor, range: Range, kind: DrAssetKind) => void,
): Extension {
  const allItems = buildItems(onInsertMedia);

  return Extension.create({
    name: 'drSlashCommand',
    addProseMirrorPlugins() {
      return [
        Suggestion<SlashItem>({
          editor: this.editor,
          char: '/',
          startOfLine: false,
          items: ({ query }) => filterItems(allItems, query),
          command: ({ editor, range, props }) => props.run(editor, range),
          render: () => {
            let renderer: ReactRenderer<SlashMenuListRef, SlashMenuListProps> | null = null;

            return {
              onStart: (props: SuggestionProps<SlashItem>) => {
                renderer = new ReactRenderer(SlashMenuList, {
                  editor: props.editor,
                  props: { items: props.items, command: props.command },
                });
                const el = renderer.element as HTMLElement;
                document.body.appendChild(el);
                positionMenu(el, props.clientRect);
              },
              onUpdate: (props: SuggestionProps<SlashItem>) => {
                renderer?.updateProps({ items: props.items, command: props.command });
                if (renderer) positionMenu(renderer.element as HTMLElement, props.clientRect);
              },
              onKeyDown: (props: SuggestionKeyDownProps) => {
                if (props.event.key === 'Escape') return true;
                return renderer?.ref?.onKeyDown(props.event) ?? false;
              },
              onExit: () => {
                renderer?.element.remove();
                renderer?.destroy();
                renderer = null;
              },
            };
          },
        }),
      ];
    },
  });
}
