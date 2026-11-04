import { z } from 'zod';

// Zod contracts for Medi (code name `assistant`, MM104 API, MM107 web client).
// Mirrors media_manipulator_api internal/assistant/events.go and
// internal/handlers/assistant.go (camelCase). Every frame and response is
// parsed here, so a malformed one is dropped instead of rendered. Answer text is
// model-written markdown: render it only through components/assistant/markdown.tsx.

export const AssistantSurfaceSchema = z.enum(['guide', 'studio', 'vector', 'photo']);
export type AssistantSurface = z.infer<typeof AssistantSurfaceSchema>;

export const AssistantActionKindSchema = z.enum([
  'navigate',
  'open_tool',
  'generate_captions',
  'subject_mask',
  'heal',
  'voiceover',
  'derive_audio',
  'export',
]);
export type AssistantActionKind = z.infer<typeof AssistantActionKindSchema>;

// ---------------------------------------------------------------------------
// SSE events of POST /api/assistant/chat:
//   meta → (delta | tool)* → [edits | action | ask]* → usage → done
//   meta → … → error
// ---------------------------------------------------------------------------

export const AssistantStreamEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('meta'), conversationId: z.string().nullable(), turnId: z.string(), model: z.string() }),
  z.object({ type: z.literal('delta'), text: z.string() }),
  z.object({ type: z.literal('tool'), name: z.string(), status: z.string() }),
  z.object({ type: z.literal('edits'), callId: z.string(), summary: z.string(), ops: z.unknown() }),
  z.object({
    type: z.literal('action'),
    callId: z.string(),
    kind: AssistantActionKindSchema,
    label: z.string(),
    params: z.record(z.string(), z.unknown()).nullish(),
  }),
  z.object({ type: z.literal('ask'), callId: z.string(), question: z.string(), choices: z.array(z.string()).max(4).nullish() }),
  z.object({
    type: z.literal('usage'),
    inputTokens: z.number(),
    outputTokens: z.number(),
    cachedTokens: z.number(),
    costUsd: z.number(),
  }),
  z.object({ type: z.literal('limit'), metric: z.string(), limit: z.number(), upgradePath: z.string() }),
  z.object({
    type: z.literal('done'),
    awaiting: z.literal('edit_result').optional(),
    messageId: z.string().optional(),
    // "static" (the spend-cap answer) | "out_of_scope" (the guide's scope gate); absent for a model answer.
    outcome: z.enum(['static', 'out_of_scope']).optional(),
  }),
  z.object({ type: z.literal('error'), code: z.string(), message: z.string() }),
]);
export type AssistantStreamEvent = z.infer<typeof AssistantStreamEventSchema>;
export type AssistantActionEvent = Extract<AssistantStreamEvent, { type: 'action' }>;
export type AssistantAskEvent = Extract<AssistantStreamEvent, { type: 'ask' }>;
export type AssistantEditsEvent = Extract<AssistantStreamEvent, { type: 'edits' }>;

// ---------------------------------------------------------------------------
// GET /api/assistant/capabilities
// ---------------------------------------------------------------------------

export const AssistantCapabilitiesSchema = z.union([
  z.object({
    enabled: z.literal(true),
    guide: z.object({ enabled: z.boolean() }),
    copilot: z.object({
      enabled: z.boolean(),
      surfaces: z.array(z.string()),
      signedInOnly: z.boolean(),
      editSurfaces: z.array(z.string()).nullish(),
    }),
    turns: z.object({ limit: z.number(), remaining: z.number(), resetsAt: z.string() }),
    frames: z.boolean(),
    maxFrameBytes: z.number(),
    maxMessageChars: z.number(),
    spendCapReached: z.boolean(),
  }),
  z.object({ enabled: z.literal(false) }),
]);
export type AssistantCapabilities = z.infer<typeof AssistantCapabilitiesSchema>;

// ---------------------------------------------------------------------------
// Conversations (signed-in, owner only)
// ---------------------------------------------------------------------------

export const AssistantConversationSchema = z.object({
  id: z.string(),
  surface: z.string(),
  projectKind: z.string().nullish(),
  projectId: z.string().nullish(),
  title: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type AssistantConversation = z.infer<typeof AssistantConversationSchema>;

export const AssistantConversationListSchema = z.object({ conversations: z.array(AssistantConversationSchema) });

/** A stored message's content jsonb (the fields a client may render). */
export const AssistantStoredContentSchema = z
  .object({
    text: z.string().optional(),
    actions: z.array(z.object({ callId: z.string(), kind: z.string(), summary: z.string().optional() })).optional(),
    error: z.string().optional(),
  })
  .passthrough();

export const AssistantStoredMessageSchema = z.object({
  id: z.string(),
  seq: z.number(),
  turnId: z.string(),
  role: z.enum(['user', 'assistant', 'tool']),
  status: z.string(),
  content: AssistantStoredContentSchema,
  createdAt: z.string(),
});
export type AssistantStoredMessage = z.infer<typeof AssistantStoredMessageSchema>;

export const AssistantConversationDetailSchema = z.object({
  conversation: AssistantConversationSchema,
  messages: z.array(AssistantStoredMessageSchema),
});
export type AssistantConversationDetail = z.infer<typeof AssistantConversationDetailSchema>;
