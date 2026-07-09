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

// A span link is EITHER an in-page anchor ('#heading-id', smooth-scrolled by the
// renderer) OR an absolute http(s) URL (opened in a new tab). Kept permissive
// enough for both while still rejecting junk. Relaxed from a strict .url() in v2
// so the Table of Contents entries can link to section anchors.
const drSpanLink = z
  .string()
  .refine((v) => v.startsWith('#') || /^https?:\/\/.+/i.test(v), {
    message: 'link must be an in-page #anchor or an absolute http(s) URL',
  });

// A DrSpan is an inline run of text with optional emphasis and an optional link.
export const DrSpanSchema = z.object({
  text: z.string(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  code: z.boolean().optional(),
  link: drSpanLink.optional(),
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

// Media blocks (v2). These are the right-click ("block" anchor) comment targets.
// `src` is the CANONICAL reference stored in the document: either a stable
// 'dr-asset://<uuid>' asset reference (uploaded via the Create Doc editor) or a
// plain external http(s) URL the author pasted. It is rendered directly, never
// via innerHTML.
//
// `assetRef` (v1 additive extension, backward compatible) is emitted by the API
// on READ alongside a hydrated presigned `src`: GetDoc replaces a
// 'dr-asset://<uuid>' src with a short-lived presigned URL and puts the original
// canonical reference here so the editor's draft-reload path never loses it.
// tiptapToBlocks writes the canonical reference back into `src` and omits
// `assetRef` when serializing, so the stored format is unchanged.
export const DrImageBlockSchema = z.object({
  type: z.literal('image'),
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  assetRef: z.string().optional(),
});

export const DrVideoBlockSchema = z.object({
  type: z.literal('video'),
  src: z.string(),
  caption: z.string().optional(),
  assetRef: z.string().optional(),
});

// File block (v1 additive extension). A downloadable attachment (PDF, zip, doc,
// …). Like image/video, `src` is the canonical 'dr-asset://<uuid>' reference the
// API hydrates to a presigned download URL (Content-Disposition: attachment) on
// read; `name` is the display filename, `sizeBytes`/`contentType` optional
// metadata. File blocks are also block-anchor comment targets.
export const DrFileBlockSchema = z.object({
  type: z.literal('file'),
  src: z.string(), // dr-asset://{uuid} canonical; hydrated to a URL by the API
  name: z.string(), // display file name
  sizeBytes: z.number().int().nonnegative().optional(),
  contentType: z.string().optional(),
  assetRef: z.string().optional(),
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
  DrImageBlockSchema,
  DrVideoBlockSchema,
  DrFileBlockSchema,
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
  createdBy: z.string(), // author email (or "seed:migration" for the seed)
  canDelete: z.boolean(), // SERVER-computed: caller is the creator (creator-only delete)
  hasEditSession: z.boolean(), // an edit session exists → "Resume editing" + restore confirm
  folderId: z.string().nullish(), // docs-explorer placement; null/absent = root
  createdAt: z.string(), // ISO 8601 UTC
  updatedAt: z.string(), // ISO 8601 UTC
});
export type DrDocSummary = z.infer<typeof DrDocSummarySchema>;

// ---------------------------------------------------------------------------
// Documentation filesystem (folders). GET /dr/doc-folders returns the FLAT
// list; the client assembles the tree (lib/dr/docTree.ts).
// ---------------------------------------------------------------------------

export const DrDocFolderSchema = z.object({
  id: z.string(),
  parentId: z.string().nullable(), // null = root-level folder
  name: z.string(),
  createdByEmail: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type DrDocFolder = z.infer<typeof DrDocFolderSchema>;

export const DrDocFoldersResponseSchema = z.object({
  folders: z.array(DrDocFolderSchema),
});

export const DrDocSchema = DrDocSummarySchema.extend({
  contentFormat: z.string(),
  content: DrDocContentSchema,
});
export type DrDoc = z.infer<typeof DrDocSchema>;

export const DrDocsListResponseSchema = z.object({
  docs: z.array(DrDocSummarySchema),
});
export type DrDocsListResponse = z.infer<typeof DrDocsListResponseSchema>;

// ---------------------------------------------------------------------------
// "Create Doc" editor DTOs (mirror internal/models/dr_docs.go + the endpoints
// in internal/handlers/dr_docs_editor.go). Every editor API response is parsed
// against these so malformed responses fail fast.
// ---------------------------------------------------------------------------

// POST /dr/docs (create) and GET a draft both return the full document.
export const DrCreateDocResponseSchema = DrDocSchema;

// PUT /dr/docs/:id (autosave) ack.
export const DrUpdateDocResponseSchema = z.object({ ok: z.boolean() });

// POST /dr/docs/:id/assets (presign) → asset id + presigned PUT URL.
export const DrPresignAssetResponseSchema = z.object({
  assetId: z.string(),
  uploadUrl: z.string(),
});
export type DrPresignAssetResponse = z.infer<typeof DrPresignAssetResponseSchema>;

// POST /dr/docs/:id/publish → the published document's summary (client redirects
// using `slug`). Reuses DrDocSummarySchema.
export const DrPublishDocResponseSchema = DrDocSummarySchema;

// ---------------------------------------------------------------------------
// Edit sessions, version history, soft delete DTOs (mirror the Go models +
// internal/handlers/dr_docs_editing.go).
// ---------------------------------------------------------------------------

// The staged edit session for a published document (content hydrated read-time).
export const DrEditSessionSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  summary: z.string().nullable(),
  content: DrDocContentSchema,
  createdBy: z.string(),
  updatedBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type DrEditSession = z.infer<typeof DrEditSessionSchema>;

// One version-history row (metadata only, never content).
export const DrRevisionSummarySchema = z.object({
  revisionNumber: z.number().int(),
  title: z.string(),
  createdBy: z.string().nullable(),
  createdAt: z.string(),
  isCurrent: z.boolean(),
});
export type DrRevisionSummary = z.infer<typeof DrRevisionSummarySchema>;

// A full version snapshot (summary + hydrated content).
export const DrRevisionSchema = DrRevisionSummarySchema.extend({
  contentFormat: z.string(),
  content: DrDocContentSchema,
});
export type DrRevision = z.infer<typeof DrRevisionSchema>;

export const DrRevisionsListResponseSchema = z.object({
  revisions: z.array(DrRevisionSummarySchema),
});
export type DrRevisionsListResponse = z.infer<typeof DrRevisionsListResponseSchema>;

// Shared ok-ack for edit-session mutations (autosave / discard / publish-changes
// reuses DrPublishDocResponseSchema for its summary).
export const DrOkResponseSchema = z.object({ ok: z.boolean() });

// Asset kinds + client-side allowlist / caps (mirror docAssetExt + the size caps
// in internal/handlers/dr_docs_editor.go so the editor can fail fast before
// presigning). Keyed content-type → extension, per kind.
export type DrAssetKind = 'image' | 'video' | 'file';

export const DR_DOC_ASSET_EXT: Record<DrAssetKind, Record<string, string>> = {
  image: {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
  },
  video: {
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
  },
  file: {
    'application/pdf': 'pdf',
    'application/zip': 'zip',
    'text/plain': 'txt',
    'text/csv': 'csv',
    'application/json': 'json',
    'text/markdown': 'md',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  },
};

export const DR_DOC_ASSET_MAX_BYTES: Record<DrAssetKind, number> = {
  image: 10 * 1024 * 1024,
  video: 200 * 1024 * 1024,
  file: 25 * 1024 * 1024,
};

export const DR_DOC_MAX_ASSETS = 50;

/** Comma-separated accept string for a file picker of the given kind. */
export const drAssetAccept = (kind: DrAssetKind): string => Object.keys(DR_DOC_ASSET_EXT[kind]).join(',');
