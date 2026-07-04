import { z } from 'zod';
import type { DrBlock, DrSpan } from './drDocs';

// ===========================================================================
// Canonical plain-text projection — THE offset model for text anchors.
// ===========================================================================
// A comment text anchor stores character offsets into a block's plain text.
// That plain text is defined ONCE here and mirrored everywhere offsets are
// computed (DOM selection math) or applied (highlight rendering) so they never
// drift.
//
// A block is a sequence of "units". Within a unit, span texts are concatenated
// directly (no separator). Units are joined with '\n'. Units are: the single
// text of a heading/paragraph/callout/code/media-caption; each list item; each
// table cell (row-major, header row first); each blockquote line. This makes
// list items / table cells / blockquote lines deterministically separable.
//
// The DOM selection walker computes a per-unit LOCAL offset (scoped TreeWalker
// inside the unit's container element) and adds the unit's base offset
// analytically via unitStartOffset(). The '\n' separators are therefore
// implicit — never present in the DOM — yet the two representations agree
// exactly, because unitStartOffset() accounts for one '\n' per preceding unit.

function spansText(spans: DrSpan[]): string {
  return spans.map((s) => s.text).join('');
}

/** Ordered plain-text of each unit in a block (NO separators). */
export function blockUnitTexts(block: DrBlock): string[] {
  switch (block.type) {
    case 'heading':
      return [block.text];
    case 'paragraph':
    case 'callout':
      return [spansText(block.spans)];
    case 'code':
      return [block.code];
    case 'blockquote':
      return block.lines.map(spansText);
    case 'list':
      return block.items.map(spansText);
    case 'table':
      return block.rows.flatMap((row) => row.map(spansText)); // row-major, header first
    case 'image':
    case 'video':
      return [block.caption ?? ''];
    case 'divider':
      return [];
    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

/** A block's full plain text: units joined by '\n'. Canonical for offsets. */
export function blockPlainText(block: DrBlock): string {
  return blockUnitTexts(block).join('\n');
}

/** Offset (into blockPlainText) at which unit `index` begins: the sum of prior
 *  unit lengths plus one '\n' per prior unit. */
export function unitStartOffset(units: string[], index: number): number {
  let off = 0;
  const n = Math.min(index, units.length);
  for (let i = 0; i < n; i++) off += units[i].length + 1; // +1 for the '\n' join
  return off;
}

/** True when the anchored text still matches the document (not orphaned). */
export function isTextAnchorLive(block: DrBlock | undefined, anchor: DrTextAnchor): boolean {
  if (!block) return false;
  return blockPlainText(block).slice(anchor.start, anchor.end) === anchor.quote;
}

// ===========================================================================
// Anchors
// ===========================================================================
export const DrTextAnchorSchema = z.object({
  type: z.literal('text'),
  blockIndex: z.number().int().nonnegative(),
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
  quote: z.string(),
});
export type DrTextAnchor = z.infer<typeof DrTextAnchorSchema>;

export const DrBlockAnchorSchema = z.object({
  type: z.literal('block'),
  blockIndex: z.number().int().nonnegative(),
});
export type DrBlockAnchor = z.infer<typeof DrBlockAnchorSchema>;

export const DrCommentAnchorSchema = z.discriminatedUnion('type', [
  DrTextAnchorSchema,
  DrBlockAnchorSchema,
]);
export type DrCommentAnchor = z.infer<typeof DrCommentAnchorSchema>;

// ===========================================================================
// API DTOs (camelCase — mirror internal/models/dr_comments.go).
// ===========================================================================
export const DrAttachmentSchema = z.object({
  id: z.string(),
  contentType: z.string(),
  sizeBytes: z.number(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  viewUrl: z.string(), // presigned GET — expiring; refetch keeps it fresh
  downloadUrl: z.string(), // presigned GET w/ Content-Disposition: attachment
});
export type DrAttachment = z.infer<typeof DrAttachmentSchema>;

export const DrReplySchema = z.object({
  id: z.string(),
  authorUid: z.string(),
  authorEmail: z.string(),
  body: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  attachments: z.array(DrAttachmentSchema),
});
export type DrReply = z.infer<typeof DrReplySchema>;

export const DrCommentSchema = z.object({
  id: z.string(),
  authorUid: z.string(),
  authorEmail: z.string(),
  anchor: DrCommentAnchorSchema,
  body: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  attachments: z.array(DrAttachmentSchema),
  replyCount: z.number(),
  replies: z.array(DrReplySchema),
});
export type DrComment = z.infer<typeof DrCommentSchema>;

export const DrCommentsListResponseSchema = z.object({
  comments: z.array(DrCommentSchema),
});
export type DrCommentsListResponse = z.infer<typeof DrCommentsListResponseSchema>;

export const DrCreateCommentResponseSchema = z.object({ commentId: z.string() });
export const DrCreateReplyResponseSchema = z.object({ replyId: z.string() });
export const DrPresignAttachmentResponseSchema = z.object({
  attachmentId: z.string(),
  s3Key: z.string(),
  uploadUrl: z.string(),
});
export type DrPresignAttachmentResponse = z.infer<typeof DrPresignAttachmentResponseSchema>;

// Allowed attachment content types → file extension (mirrors the Go allowlist).
export const DR_ATTACHMENT_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
export const DR_ATTACHMENT_ACCEPT = Object.keys(DR_ATTACHMENT_EXT).join(',');
export const DR_MAX_ATTACHMENTS = 6;
export const DR_MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024;
