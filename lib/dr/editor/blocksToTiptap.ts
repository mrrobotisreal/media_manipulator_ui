// dr-blocks/v1 → Tiptap document JSON. Pure (no React, no Tiptap runtime): it
// maps the canonical stored block array onto the editor's document shape so a
// draft can be loaded after a refresh (and, later, so a published doc can be
// re-opened for editing). Its inverse is tiptapToBlocks.ts; the round-trip
// tiptapToBlocks(blocksToTiptap(doc)) must equal `doc` for the seeded document
// (see scripts/dr-editor-roundtrip.ts).

import type { DrBlock, DrDocContent, DrSpan } from '@/schemas/drDocs';
import { MARK, NODE, type TiptapDoc, type TiptapMark, type TiptapNode } from './tiptapDoc';

// A DrSpan's emphasis becomes Tiptap marks in a stable order (bold, italic,
// code, link). Returns undefined for an unstyled span so the text node carries
// no `marks` key.
function marksFromSpan(span: DrSpan): TiptapMark[] | undefined {
  const marks: TiptapMark[] = [];
  if (span.bold) marks.push({ type: MARK.bold });
  if (span.italic) marks.push({ type: MARK.italic });
  if (span.code) marks.push({ type: MARK.code });
  if (span.link) marks.push({ type: MARK.link, attrs: { href: span.link } });
  return marks.length ? marks : undefined;
}

// Spans → Tiptap text nodes. Empty-text spans are dropped: ProseMirror cannot
// represent an empty text node, and dr-blocks never authors one.
function spansToNodes(spans: DrSpan[]): TiptapNode[] {
  const nodes: TiptapNode[] = [];
  for (const span of spans) {
    if (!span.text) continue;
    const node: TiptapNode = { type: NODE.text, text: span.text };
    const marks = marksFromSpan(span);
    if (marks) node.marks = marks;
    nodes.push(node);
  }
  return nodes;
}

// A single flat paragraph wrapping the given spans (used by list items and
// table cells, which each hold exactly one paragraph in this single-level
// model).
function paragraph(spans: DrSpan[]): TiptapNode {
  return { type: NODE.paragraph, content: spansToNodes(spans) };
}

function blockToNode(block: DrBlock): TiptapNode {
  switch (block.type) {
    case 'heading':
      // dr-blocks headings are plain text; the anchor `id` is regenerated on
      // serialize and therefore not carried into the editor.
      return {
        type: NODE.heading,
        attrs: { level: block.level },
        content: block.text ? [{ type: NODE.text, text: block.text }] : [],
      };

    case 'paragraph':
      return paragraph(block.spans);

    case 'blockquote':
      // Each quote line becomes one child paragraph (empty line → empty
      // paragraph); the renderer preserves the empty line, so we must too.
      return {
        type: NODE.blockquote,
        content: block.lines.map((line) => paragraph(line)),
      };

    case 'callout':
      return { type: NODE.callout, attrs: { variant: block.variant }, content: spansToNodes(block.spans) };

    case 'list':
      return {
        type: block.ordered ? NODE.orderedList : NODE.bulletList,
        content: block.items.map((item) => ({
          type: NODE.listItem,
          content: [paragraph(item)],
        })),
      };

    case 'table':
      return {
        type: NODE.table,
        content: block.rows.map((row, rowIndex) => ({
          type: NODE.tableRow,
          content: row.map((cell) => ({
            type: block.headerRow && rowIndex === 0 ? NODE.tableHeader : NODE.tableCell,
            attrs: { colspan: 1, rowspan: 1, colwidth: null },
            content: [paragraph(cell)],
          })),
        })),
      };

    case 'code':
      // Preserve newlines exactly: the whole code string is one text node.
      return {
        type: NODE.codeBlock,
        attrs: { language: block.language },
        content: block.code ? [{ type: NODE.text, text: block.code }] : [],
      };

    case 'divider':
      return { type: NODE.horizontalRule };

    case 'image':
      // The persisted src attr stays canonical: prefer assetRef (the
      // 'dr-asset://…' reference the API emits alongside a hydrated URL) so
      // tiptapToBlocks writes the stable reference back. previewUrl is the
      // display URL (hydrated presigned URL or external URL) and is never
      // serialized.
      return {
        type: NODE.drImage,
        attrs: {
          src: block.assetRef ?? block.src,
          alt: block.alt,
          caption: block.caption ?? null,
          previewUrl: block.src,
        },
      };

    case 'video':
      return {
        type: NODE.drVideo,
        attrs: {
          src: block.assetRef ?? block.src,
          caption: block.caption ?? null,
          previewUrl: block.src,
        },
      };

    case 'file':
      return {
        type: NODE.drFile,
        attrs: {
          src: block.assetRef ?? block.src,
          name: block.name,
          sizeBytes: block.sizeBytes ?? null,
          contentType: block.contentType ?? null,
          previewUrl: block.src,
        },
      };

    default: {
      // Exhaustiveness guard: a new block type must be handled here.
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

/** Convert a stored dr-blocks/v1 document into Tiptap document JSON. */
export function blocksToTiptap(content: DrDocContent): TiptapDoc {
  return { type: 'doc', content: content.blocks.map(blockToNode) };
}
