import { z } from 'zod';

// Shared content contract for the Double Raven partner portal — "dr-blocks/v1".
//
// This is the AUTHORITATIVE definition of the typed block array that documents
// are stored and transferred as. It is shared by three consumers:
//   1. the SQL seed (media_manipulator_api migration init_double_raven_docs),
//   2. the Go API, which treats content as opaque validated-at-seed JSONB, and
//   3. the React renderer (components/dr/doc-renderer.tsx).
// Author documents as a typed DrDocContent (see content/dr-docs/*.ts), then
// serialize the identical JSON into the migration seed. Zod parses every API
// response so malformed content fails fast instead of rendering garbage.

// A DrSpan is an inline run of text with optional emphasis. `link` is an
// absolute URL (rendered as an external anchor).
export const DrSpanSchema = z.object({
  text: z.string(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  code: z.boolean().optional(),
  link: z.string().url().optional(),
});
export type DrSpan = z.infer<typeof DrSpanSchema>;

// Convenience aliases for the nested span shapes the block schemas reuse:
//   spans → one line of inline text
//   lines / list items / table cells → arrays of spans
//   table rows → arrays of cells
const spans = z.array(DrSpanSchema); // DrSpan[]
const spanLines = z.array(spans); // DrSpan[][]  (blockquote lines, list items)
const tableRows = z.array(z.array(spans)); // DrSpan[][][] (rows → cells → spans)

export const DrHeadingBlockSchema = z.object({
  type: z.literal('heading'),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  text: z.string(),
  id: z.string(), // slugified anchor
});

export const DrParagraphBlockSchema = z.object({
  type: z.literal('paragraph'),
  spans,
});

export const DrBlockquoteBlockSchema = z.object({
  type: z.literal('blockquote'),
  lines: spanLines, // multi-line quote (doc meta header, notes)
});

export const DrCalloutBlockSchema = z.object({
  type: z.literal('callout'),
  variant: z.union([z.literal('info'), z.literal('warning')]),
  spans,
});

export const DrListBlockSchema = z.object({
  type: z.literal('list'),
  ordered: z.boolean(),
  items: spanLines,
});

export const DrTableBlockSchema = z.object({
  type: z.literal('table'),
  headerRow: z.boolean(),
  rows: tableRows,
});

export const DrCodeBlockSchema = z.object({
  type: z.literal('code'),
  language: z.string().nullable(),
  code: z.string(),
});

export const DrDividerBlockSchema = z.object({
  type: z.literal('divider'),
});

// Discriminated union on `type` so the renderer can exhaustively switch and a
// new block type fails typecheck loudly (see doc-renderer's `never` check).
export const DrBlockSchema = z.discriminatedUnion('type', [
  DrHeadingBlockSchema,
  DrParagraphBlockSchema,
  DrBlockquoteBlockSchema,
  DrCalloutBlockSchema,
  DrListBlockSchema,
  DrTableBlockSchema,
  DrCodeBlockSchema,
  DrDividerBlockSchema,
]);
export type DrBlock = z.infer<typeof DrBlockSchema>;

export const DrDocContentSchema = z.object({
  format: z.literal('dr-blocks/v1'),
  blocks: z.array(DrBlockSchema),
});
export type DrDocContent = z.infer<typeof DrDocContentSchema>;

// ---------------------------------------------------------------------------
// API DTOs (camelCase — mirror the Go models in internal/models/dr_docs.go).
// ---------------------------------------------------------------------------

export const DrDocStatusSchema = z.enum(['draft', 'published', 'archived']);
export type DrDocStatus = z.infer<typeof DrDocStatusSchema>;

export const DrDocSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  summary: z.string().nullable(),
  status: DrDocStatusSchema,
  createdAt: z.string(), // ISO 8601 UTC
  updatedAt: z.string(), // ISO 8601 UTC
});
export type DrDocSummary = z.infer<typeof DrDocSummarySchema>;

export const DrDocSchema = DrDocSummarySchema.extend({
  contentFormat: z.string(),
  content: DrDocContentSchema,
});
export type DrDoc = z.infer<typeof DrDocSchema>;

export const DrDocsListResponseSchema = z.object({
  docs: z.array(DrDocSummarySchema),
});
export type DrDocsListResponse = z.infer<typeof DrDocsListResponseSchema>;
