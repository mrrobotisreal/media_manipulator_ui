import { z } from 'zod';

// Zod contracts for the DR AI Chat Test Lab (/dr/demos/chat-lab). Mirrors the
// Go DTOs in internal/models/dr_chatlab.go (camelCase). Every API response is
// parsed against these so a malformed response fails fast rather than
// rendering garbage. Assistant message content is plain markdown text (model
// output) — NOT dr-blocks.

// ---------------------------------------------------------------------------
// Model catalog (GET /dr/chatlab/models).
// ---------------------------------------------------------------------------

export const ChatLabEffortSchema = z.enum(['minimal', 'low', 'medium', 'high', 'xhigh']);
export type ChatLabEffort = z.infer<typeof ChatLabEffortSchema>;

/** '' means reasoning off — the value sent on the wire for "Off". */
export const ChatLabEffortOrOffSchema = z.union([z.literal(''), ChatLabEffortSchema]);
export type ChatLabEffortOrOff = z.infer<typeof ChatLabEffortOrOffSchema>;

export const ChatLabModelPricingSchema = z.object({
  promptUsdPerMTok: z.number(),
  completionUsdPerMTok: z.number(),
});

export const ChatLabModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  provider: z.string(),
  contextLength: z.number(),
  supportsImages: z.boolean(),
  supportsReasoning: z.boolean(),
  supportedEfforts: z.array(ChatLabEffortSchema).nullable(),
  pricing: ChatLabModelPricingSchema,
  created: z.number(),
});
export type ChatLabModel = z.infer<typeof ChatLabModelSchema>;

export const ChatLabModelsResponseSchema = z.object({
  models: z.array(ChatLabModelSchema),
});

// ---------------------------------------------------------------------------
// Sessions.
// ---------------------------------------------------------------------------

export const ChatLabSessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  titleSource: z.enum(['default', 'derived', 'generated', 'manual']),
  createdByEmail: z.string(),
  isMine: z.boolean(), // SERVER-computed; rename/delete are creator-only
  lastModel: z.string().nullable(),
  lastReasoningEffort: z.string().nullable(),
  createdAt: z.string(), // ISO 8601 UTC
  updatedAt: z.string(), // bumped on every message → recency grouping
});
export type ChatLabSession = z.infer<typeof ChatLabSessionSchema>;

export const ChatLabSessionsResponseSchema = z.object({
  sessions: z.array(ChatLabSessionSchema),
});

// ---------------------------------------------------------------------------
// Messages + attachments.
// ---------------------------------------------------------------------------

export const ChatLabAttachmentKindSchema = z.enum(['image', 'file']);
export type ChatLabAttachmentKind = z.infer<typeof ChatLabAttachmentKindSchema>;

export const ChatLabAttachmentSchema = z.object({
  id: z.string(),
  kind: ChatLabAttachmentKindSchema,
  fileName: z.string(),
  contentType: z.string(),
  sizeBytes: z.number(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  viewUrl: z.string(), // presigned GET, inline — expiring; refetch keeps it fresh
  downloadUrl: z.string(), // presigned GET w/ Content-Disposition: attachment
});
export type ChatLabAttachment = z.infer<typeof ChatLabAttachmentSchema>;

export const ChatLabMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant']),
  authorEmail: z.string().nullable(), // user messages only
  content: z.string(), // plain text (user) / markdown (assistant)
  reasoning: z.string().nullable(), // assistant only
  model: z.string().nullable(),
  reasoningEffort: z.string().nullable(),
  status: z.enum(['complete', 'interrupted', 'error']),
  errorMessage: z.string().nullable(),
  promptTokens: z.number().nullable(),
  completionTokens: z.number().nullable(),
  reasoningTokens: z.number().nullable(),
  totalCostUsd: z.number().nullable(),
  createdAt: z.string(),
  attachments: z.array(ChatLabAttachmentSchema),
});
export type ChatLabMessage = z.infer<typeof ChatLabMessageSchema>;

export const ChatLabSessionDetailResponseSchema = z.object({
  session: ChatLabSessionSchema,
  messages: z.array(ChatLabMessageSchema), // ordered (created_at, seq)
});
export type ChatLabSessionDetailResponse = z.infer<typeof ChatLabSessionDetailResponseSchema>;

// ---------------------------------------------------------------------------
// Mutation responses.
// ---------------------------------------------------------------------------

export const ChatLabPresignResponseSchema = z.object({
  attachmentId: z.string(),
  uploadUrl: z.string(),
  key: z.string(),
});
export type ChatLabPresignResponse = z.infer<typeof ChatLabPresignResponseSchema>;

export const ChatLabDeletedResponseSchema = z.object({ deleted: z.boolean() });
export const ChatLabOkResponseSchema = z.object({ ok: z.boolean() });

// ---------------------------------------------------------------------------
// Stream events (the send endpoint's SSE frames — see dr_chatlab_stream.go).
// ---------------------------------------------------------------------------

export const ChatLabStreamEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('meta'),
    userMessageId: z.string(),
    assistantMessageId: z.string(),
  }),
  z.object({ type: z.literal('reasoning'), text: z.string() }),
  z.object({ type: z.literal('delta'), text: z.string() }),
  z.object({
    type: z.literal('usage'),
    promptTokens: z.number(),
    completionTokens: z.number(),
    reasoningTokens: z.number(),
    costUsd: z.number(),
  }),
  z.object({ type: z.literal('done'), status: z.string() }),
  z.object({ type: z.literal('error'), message: z.string() }),
]);
export type ChatLabStreamEvent = z.infer<typeof ChatLabStreamEventSchema>;

export type ChatLabUsage = Extract<ChatLabStreamEvent, { type: 'usage' }>;

// ---------------------------------------------------------------------------
// Attachment allowlist / caps — the chat-lab-specific rules (mirrors the
// server's chatLabAttachmentExt; deliberately NOT the doc-asset allowlist).
// Images become multimodal model input; PDFs go through OpenRouter's file
// parser; text files are inlined into the prompt (hence the small caps).
// ---------------------------------------------------------------------------

export const CHATLAB_ATTACHMENT_EXT: Record<ChatLabAttachmentKind, Record<string, string>> = {
  image: {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
  },
  file: {
    'application/pdf': 'pdf',
    'text/plain': 'txt',
    'text/csv': 'csv',
    'text/markdown': 'md',
    'application/json': 'json',
  },
};

const MiB = 1024 * 1024;

/** Per-contentType byte caps (PDFs are larger than inlined text files). */
export function chatLabMaxBytes(kind: ChatLabAttachmentKind, contentType: string): number {
  if (kind === 'image') return 10 * MiB;
  if (contentType === 'application/pdf') return 25 * MiB;
  return 2 * MiB;
}

export const CHATLAB_MAX_ATTACHMENTS = 5;

/** The composer's file-input accept attribute. */
export function chatLabAccept(): string {
  return [...Object.keys(CHATLAB_ATTACHMENT_EXT.image), '.pdf', '.txt', '.csv', '.md', '.json'].join(',');
}
