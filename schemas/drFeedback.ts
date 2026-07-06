import { z } from 'zod';
import {
  DrParagraphBlockSchema,
  DrCodeBlockSchema,
  DrListBlockSchema,
  DrBlockquoteBlockSchema,
} from './drDocs';

// Zod contracts for the Double Raven Communication/Feedback workspace
// (Slack-style messaging at /dr/feedback). Mirrors the Go DTOs in
// internal/models/dr_feedback.go (camelCase). Every API response is parsed
// against these so a malformed response fails fast rather than rendering garbage.

// ---------------------------------------------------------------------------
// Message content: the dr-blocks/v1 RESTRICTED subset (§3.3).
//
// Built from the SAME exported block schemas as the doc format — spans are NOT
// redefined here — so there is one canonical rich-text format across the whole
// portal. Messages allow only paragraph / code / list / blockquote (no
// headings/tables/callouts/dividers, and no media blocks — attachments are
// separate rows displayed under the message).
// ---------------------------------------------------------------------------

export const DrMessageBlockSchema = z.discriminatedUnion('type', [
  DrParagraphBlockSchema,
  DrCodeBlockSchema,
  DrListBlockSchema,
  DrBlockquoteBlockSchema,
]);
export type DrMessageBlock = z.infer<typeof DrMessageBlockSchema>;

export const DrMessageContentSchema = z.object({
  format: z.literal('dr-blocks/v1'),
  blocks: z.array(DrMessageBlockSchema),
});
export type DrMessageContent = z.infer<typeof DrMessageContentSchema>;

// ---------------------------------------------------------------------------
// Users (the DR_ALLOWED_EMAILS directory).
// ---------------------------------------------------------------------------

export const DrFeedbackUserSchema = z.object({
  email: z.string(),
  isMe: z.boolean(),
});
export type DrFeedbackUser = z.infer<typeof DrFeedbackUserSchema>;

export const DrFeedbackUsersResponseSchema = z.object({
  users: z.array(DrFeedbackUserSchema),
});

// ---------------------------------------------------------------------------
// Conversations (sidebar).
// ---------------------------------------------------------------------------

export const DrConversationKindSchema = z.enum(['channel', 'dm']);
export type DrConversationKind = z.infer<typeof DrConversationKindSchema>;

export const DrConversationSummarySchema = z.object({
  id: z.string(),
  kind: DrConversationKindSchema,
  name: z.string().nullable(), // channels only
  topic: z.string().nullable(), // channels only
  dmPartnerEmail: z.string().nullable(), // dms only (the OTHER participant)
  lastMessageAt: z.string().nullable(), // ISO 8601 UTC, null when empty
  lastMessageSnippet: z.string(),
  unreadCount: z.number(),
});
export type DrConversationSummary = z.infer<typeof DrConversationSummarySchema>;

export const DrConversationsResponseSchema = z.object({
  conversations: z.array(DrConversationSummarySchema),
});

// ---------------------------------------------------------------------------
// Messages + attachments.
// ---------------------------------------------------------------------------

export const DrMessageAttachmentSchema = z.object({
  id: z.string(),
  kind: z.enum(['image', 'video', 'file']),
  fileName: z.string(),
  contentType: z.string(),
  sizeBytes: z.number(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  viewUrl: z.string(), // presigned GET, inline — expiring; refetch keeps it fresh
  downloadUrl: z.string(), // presigned GET w/ Content-Disposition: attachment
});
export type DrMessageAttachment = z.infer<typeof DrMessageAttachmentSchema>;

export const DrMessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  parentId: z.string().nullable(), // null = top-level, set = a thread reply
  authorUid: z.string(),
  authorEmail: z.string(),
  isMine: z.boolean(), // SERVER-computed (author uid === caller)
  content: DrMessageContentSchema,
  createdAt: z.string(),
  attachments: z.array(DrMessageAttachmentSchema),
  replyCount: z.number(),
  lastReplyAt: z.string().nullable(),
});
export type DrMessage = z.infer<typeof DrMessageSchema>;

export const DrMessagesPageSchema = z.object({
  messages: z.array(DrMessageSchema), // oldest→newest within the page
  hasMore: z.boolean(),
});
export type DrMessagesPage = z.infer<typeof DrMessagesPageSchema>;

// ---------------------------------------------------------------------------
// Threads + replies.
// ---------------------------------------------------------------------------

export const DrRepliesResponseSchema = z.object({
  parent: DrMessageSchema,
  replies: z.array(DrMessageSchema), // chronological
});
export type DrRepliesResponse = z.infer<typeof DrRepliesResponseSchema>;

export const DrThreadListItemSchema = z.object({
  message: DrMessageSchema, // the parent (top-level) message
  conversationId: z.string(),
  conversationKind: DrConversationKindSchema,
  conversationName: z.string().nullable(),
  dmPartnerEmail: z.string().nullable(),
  lastReplyAt: z.string(),
  replyCount: z.number(),
  lastReplySnippet: z.string(),
});
export type DrThreadListItem = z.infer<typeof DrThreadListItemSchema>;

export const DrThreadsPageSchema = z.object({
  threads: z.array(DrThreadListItemSchema), // newest activity first
  hasMore: z.boolean(),
});
export type DrThreadsPage = z.infer<typeof DrThreadsPageSchema>;

// ---------------------------------------------------------------------------
// Mutation responses.
// ---------------------------------------------------------------------------

export const DrFeedbackPresignResponseSchema = z.object({
  attachmentId: z.string(),
  uploadUrl: z.string(),
});
export type DrFeedbackPresignResponse = z.infer<typeof DrFeedbackPresignResponseSchema>;

export const DrFeedbackOkResponseSchema = z.object({ ok: z.boolean() });

// ---------------------------------------------------------------------------
// Attachment allowlist / caps — the SAME rules as document assets by design, so
// re-export rather than redefine (attachment pickers share them 1:1).
// ---------------------------------------------------------------------------

export {
  DR_DOC_ASSET_EXT,
  DR_DOC_ASSET_MAX_BYTES,
  drAssetAccept,
} from './drDocs';
export type { DrAssetKind } from './drDocs';
