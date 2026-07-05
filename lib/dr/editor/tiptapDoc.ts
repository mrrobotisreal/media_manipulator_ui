// Minimal, dependency-light ProseMirror/Tiptap document JSON types shared by the
// two converters (blocksToTiptap / tiptapToBlocks). Deliberately NOT imported
// from @tiptap/* so the converters stay pure (no editor runtime) and the
// round-trip verification script can run under a bare TS runner. Tiptap's
// editor.getJSON() / setContent() produce and accept exactly this shape.

export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

export interface TiptapDoc {
  type: 'doc';
  content: TiptapNode[];
}

// Node/mark type names. Built-ins come from StarterKit + the table extensions;
// the dr* nodes + callout are the custom extensions defined in
// components/dr/editor/extensions. Kept here so both converters and the editor
// reference one source of truth.
export const NODE = {
  doc: 'doc',
  paragraph: 'paragraph',
  text: 'text',
  heading: 'heading',
  blockquote: 'blockquote',
  bulletList: 'bulletList',
  orderedList: 'orderedList',
  listItem: 'listItem',
  codeBlock: 'codeBlock',
  horizontalRule: 'horizontalRule',
  table: 'table',
  tableRow: 'tableRow',
  tableHeader: 'tableHeader',
  tableCell: 'tableCell',
  callout: 'callout',
  drImage: 'drImage',
  drVideo: 'drVideo',
  drFile: 'drFile',
} as const;

export const MARK = {
  bold: 'bold',
  italic: 'italic',
  code: 'code',
  link: 'link',
} as const;
