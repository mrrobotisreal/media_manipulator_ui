// Tiptap document JSON → dr-blocks/v1. Pure (no React, no Tiptap runtime): run
// on every autosave/publish to serialize the editor back to the canonical
// stored format. Inverse of blocksToTiptap.ts.
//
// Correctness anchor (Checkpoint 2): tiptapToBlocks(blocksToTiptap(seededDoc))
// must deep-equal the seeded backend-ai-infrastructure content — including the
// regenerated heading ids. The heading-id algorithm below is the spec, matched
// to the seeded document's existing ids.

import type { DrBlock, DrDocContent, DrSpan } from '@/schemas/drDocs';
import { MARK, NODE, type TiptapMark, type TiptapNode, type TiptapDoc } from './tiptapDoc';

// ---------------------------------------------------------------------------
// Heading ids
// ---------------------------------------------------------------------------

// Characters that act as word separators and collapse to a single '-'.
// Everything else that is not [a-z0-9] (apostrophes ' ’, parentheses, quotes,
// '+', '!', …) is DROPPED. This reproduces the seeded document's ids exactly,
// e.g. "5.6 GPU(s) — The Core AI Accelerator" → "5-6-gpus-the-core-ai-accelerator"
// (parens dropped, dot/em-dash → dash), "2.2 Why Your CPU Can't Keep Up" →
// "2-2-why-your-cpu-cant-keep-up" (apostrophe dropped), "9.1 On-Premises for:" →
// "9-1-on-premises-for" (trailing colon trimmed). Includes ASCII hyphen and the
// unicode dash block U+2010-U+2015 (en/em dash).
const HEADING_SEP = /[\s._:&,;~‐-―\/-]/;

function slugifyHeadingId(text: string): string {
  let out = '';
  let prevDash = false;
  for (const ch of text.toLowerCase()) {
    if (/[a-z0-9]/.test(ch)) {
      out += ch;
      prevDash = false;
    } else if (HEADING_SEP.test(ch)) {
      if (!prevDash) {
        out += '-';
        prevDash = true;
      }
    }
    // else: dropped
  }
  return out.replace(/^-+|-+$/g, '') || 'section';
}

// Assign deterministic anchor ids to heading blocks in document order, deduping
// collisions with a numeric suffix (-2, -3, …).
function assignHeadingIds(blocks: DrBlock[]): void {
  const counts = new Map<string, number>();
  for (const block of blocks) {
    if (block.type !== 'heading') continue;
    const base = slugifyHeadingId(block.text);
    const n = counts.get(base) ?? 0;
    counts.set(base, n + 1);
    block.id = n === 0 ? base : `${base}-${n + 1}`;
  }
}

// ---------------------------------------------------------------------------
// Spans
// ---------------------------------------------------------------------------

function hasMark(marks: TiptapMark[] | undefined, type: string): boolean {
  return (marks ?? []).some((m) => m.type === type);
}

function linkHref(marks: TiptapMark[] | undefined): string | undefined {
  const link = (marks ?? []).find((m) => m.type === MARK.link);
  const href = link?.attrs?.href;
  return typeof href === 'string' && href ? href : undefined;
}

function spanFromMarks(text: string, marks: TiptapMark[] | undefined): DrSpan {
  const span: DrSpan = { text };
  if (hasMark(marks, MARK.bold)) span.bold = true;
  if (hasMark(marks, MARK.italic)) span.italic = true;
  if (hasMark(marks, MARK.code)) span.code = true;
  const href = linkHref(marks);
  if (href) span.link = href;
  return span;
}

function sameEmphasis(a: DrSpan, b: DrSpan): boolean {
  return a.bold === b.bold && a.italic === b.italic && a.code === b.code && a.link === b.link;
}

// Text nodes → spans. Consecutive text nodes with an identical mark set merge
// into one span; empty and non-text nodes are ignored. Unsupported marks are
// dropped defensively (only bold/italic/code/link are recognized).
function nodesToSpans(content: TiptapNode[] | undefined): DrSpan[] {
  const spans: DrSpan[] = [];
  for (const node of content ?? []) {
    if (node.type !== NODE.text || !node.text) continue;
    const span = spanFromMarks(node.text, node.marks);
    const prev = spans[spans.length - 1];
    if (prev && sameEmphasis(prev, span)) prev.text += span.text;
    else spans.push(span);
  }
  return spans;
}

// Plain-text of a node's subtree (headings, code blocks).
function nodeText(node: TiptapNode): string {
  if (node.type === NODE.text) return node.text ?? '';
  return (node.content ?? []).map(nodeText).join('');
}

// A list item's spans: its paragraph(s), with any nested list flattened into
// the same item (single-level model — never crash on nesting).
function listItemSpans(item: TiptapNode): DrSpan[] {
  const spans: DrSpan[] = [];
  for (const child of item.content ?? []) {
    if (child.type === NODE.paragraph) {
      spans.push(...nodesToSpans(child.content));
    } else if (child.type === NODE.bulletList || child.type === NODE.orderedList) {
      for (const nested of child.content ?? []) {
        if (nested.type === NODE.listItem) spans.push(...listItemSpans(nested));
      }
    }
  }
  return spans;
}

// A table cell's spans: its paragraph content (concatenated if multiple).
function cellSpans(cell: TiptapNode): DrSpan[] {
  const spans: DrSpan[] = [];
  for (const child of cell.content ?? []) {
    if (child.type === NODE.paragraph) spans.push(...nodesToSpans(child.content));
  }
  return spans;
}

function clampLevel(raw: unknown): 1 | 2 | 3 {
  const n = Number(raw);
  return n === 2 ? 2 : n === 3 ? 3 : 1;
}

function warnUnknown(type: string): void {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`tiptapToBlocks: skipping unsupported node type "${type}"`);
  }
}

function tableToBlock(node: TiptapNode): DrBlock {
  const rows = (node.content ?? []).filter((r) => r.type === NODE.tableRow);
  const firstRowCells = rows[0]?.content ?? [];
  const headerRow = firstRowCells.length > 0 && firstRowCells.every((c) => c.type === NODE.tableHeader);
  return {
    type: 'table',
    headerRow,
    rows: rows.map((row) =>
      (row.content ?? [])
        .filter((c) => c.type === NODE.tableHeader || c.type === NODE.tableCell)
        .map(cellSpans),
    ),
  };
}

function nodeToBlock(node: TiptapNode): DrBlock | null {
  switch (node.type) {
    case NODE.heading:
      // id is assigned in a post-pass (assignHeadingIds).
      return { type: 'heading', level: clampLevel(node.attrs?.level), text: nodeText(node), id: '' };

    case NODE.paragraph:
      return { type: 'paragraph', spans: nodesToSpans(node.content) };

    case NODE.blockquote:
      return {
        type: 'blockquote',
        lines: (node.content ?? [])
          .filter((c) => c.type === NODE.paragraph)
          .map((p) => nodesToSpans(p.content)),
      };

    case NODE.callout:
      return {
        type: 'callout',
        variant: node.attrs?.variant === 'warning' ? 'warning' : 'info',
        spans: nodesToSpans(node.content),
      };

    case NODE.bulletList:
    case NODE.orderedList:
      return {
        type: 'list',
        ordered: node.type === NODE.orderedList,
        items: (node.content ?? []).filter((c) => c.type === NODE.listItem).map(listItemSpans),
      };

    case NODE.table:
      return tableToBlock(node);

    case NODE.codeBlock:
      return {
        type: 'code',
        language: typeof node.attrs?.language === 'string' ? node.attrs.language : null,
        code: nodeText(node),
      };

    case NODE.horizontalRule:
      return { type: 'divider' };

    case NODE.drImage: {
      const block: Extract<DrBlock, { type: 'image' }> = {
        type: 'image',
        src: String(node.attrs?.src ?? ''),
        alt: String(node.attrs?.alt ?? ''),
      };
      const caption = node.attrs?.caption;
      if (typeof caption === 'string' && caption) block.caption = caption;
      return block;
    }

    case NODE.drVideo: {
      const block: Extract<DrBlock, { type: 'video' }> = {
        type: 'video',
        src: String(node.attrs?.src ?? ''),
      };
      const caption = node.attrs?.caption;
      if (typeof caption === 'string' && caption) block.caption = caption;
      return block;
    }

    case NODE.drFile: {
      const block: Extract<DrBlock, { type: 'file' }> = {
        type: 'file',
        src: String(node.attrs?.src ?? ''),
        name: String(node.attrs?.name ?? ''),
      };
      const sizeBytes = node.attrs?.sizeBytes;
      if (typeof sizeBytes === 'number' && Number.isFinite(sizeBytes) && sizeBytes >= 0) {
        block.sizeBytes = sizeBytes;
      }
      const contentType = node.attrs?.contentType;
      if (typeof contentType === 'string' && contentType) block.contentType = contentType;
      return block;
    }

    default:
      warnUnknown(node.type);
      return null;
  }
}

/** Convert Tiptap document JSON into a stored dr-blocks/v1 document. */
export function tiptapToBlocks(doc: TiptapDoc): DrDocContent {
  const blocks: DrBlock[] = [];
  for (const node of doc.content ?? []) {
    const block = nodeToBlock(node);
    if (block) blocks.push(block);
  }
  // Drop trailing empty paragraphs (ProseMirror keeps a trailing empty
  // paragraph at the document tail; the canonical format shouldn't).
  while (blocks.length > 0) {
    const last = blocks[blocks.length - 1];
    if (last.type === 'paragraph' && last.spans.length === 0) blocks.pop();
    else break;
  }
  assignHeadingIds(blocks);
  return { format: 'dr-blocks/v1', blocks };
}
