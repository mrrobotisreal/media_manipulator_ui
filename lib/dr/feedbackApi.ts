// Double Raven Communication/Feedback API. Uses the shared transport
// (apiClient.ts) and the shared presign → PUT-to-S3 → complete handshake
// (s3Upload.ts). Every response is zod-parsed against schemas/drFeedback.ts so a
// malformed response fails fast. The transport/auth/retry plumbing is NOT
// re-implemented here.

import {
  DrConversationSummarySchema,
  DrConversationsResponseSchema,
  DrFeedbackOkResponseSchema,
  DrFeedbackPresignResponseSchema,
  DrFeedbackUsersResponseSchema,
  DrMessageSchema,
  DrMessagesPageSchema,
  DrRepliesResponseSchema,
  DrThreadsPageSchema,
  type DrConversationKind,
  type DrConversationSummary,
  type DrFeedbackPresignResponse,
  type DrFeedbackUser,
  type DrMessage,
  type DrMessageContent,
  type DrMessagesPage,
  type DrRepliesResponse,
  type DrThreadsPage,
  type DrAssetKind,
} from '@/schemas/drFeedback';
import { drGet, drSend } from './apiClient';
import { putToS3 } from './s3Upload';

const enc = encodeURIComponent;

// Reuse the generic asset helpers (content-type resolution + image dimensions +
// oversize guard) unchanged — they apply identically to message attachments.
export { resolveDrAssetContentType, readImageDimensions, isDrAssetOversize } from './docEditorApi';

// ---- Users -----------------------------------------------------------------

export const fetchFeedbackUsers = async (): Promise<DrFeedbackUser[]> =>
  DrFeedbackUsersResponseSchema.parse(await drGet('/dr/feedback/users')).users;

// ---- Conversations ---------------------------------------------------------

export const fetchConversations = async (): Promise<DrConversationSummary[]> =>
  DrConversationsResponseSchema.parse(await drGet('/dr/feedback/conversations')).conversations;

export interface CreateConversationBody {
  kind: DrConversationKind;
  name?: string;
  topic?: string;
  participantEmail?: string;
}

/** Create a channel or DM. Returns the created (201) or existing (200 for a
 *  duplicate DM) conversation summary — the caller navigates using its id. */
export const createConversation = async (body: CreateConversationBody): Promise<DrConversationSummary> =>
  DrConversationSummarySchema.parse(await drSend('POST', '/dr/feedback/conversations', body));

export const markConversationRead = async (conversationId: string): Promise<void> => {
  DrFeedbackOkResponseSchema.parse(await drSend('POST', `/dr/feedback/conversations/${enc(conversationId)}/read`));
};

// ---- Messages --------------------------------------------------------------

/** A page of top-level messages, oldest→newest. `before` is a message id cursor
 *  (fetch strictly older). */
export const fetchMessages = async (conversationId: string, before?: string, limit = 50): Promise<DrMessagesPage> => {
  const params = new URLSearchParams({ limit: String(limit) });
  if (before) params.set('before', before);
  return DrMessagesPageSchema.parse(
    await drGet(`/dr/feedback/conversations/${enc(conversationId)}/messages?${params.toString()}`),
  );
};

export interface SendMessageBody {
  content: DrMessageContent;
  attachmentIds: string[];
  parentId?: string;
}

export const sendMessage = async (conversationId: string, body: SendMessageBody): Promise<DrMessage> =>
  DrMessageSchema.parse(await drSend('POST', `/dr/feedback/conversations/${enc(conversationId)}/messages`, body));

// ---- Threads ---------------------------------------------------------------

export const fetchReplies = async (messageId: string): Promise<DrRepliesResponse> =>
  DrRepliesResponseSchema.parse(await drGet(`/dr/feedback/messages/${enc(messageId)}/replies`));

export const fetchThreads = async (before?: string, limit = 30): Promise<DrThreadsPage> => {
  const params = new URLSearchParams({ limit: String(limit) });
  if (before) params.set('before', before);
  return DrThreadsPageSchema.parse(await drGet(`/dr/feedback/threads?${params.toString()}`));
};

// ---- Attachments (compose-before-send) -------------------------------------

export interface PresignFeedbackAttachmentBody {
  fileName: string;
  contentType: string;
  sizeBytes: number;
  kind: DrAssetKind;
  width: number | null;
  height: number | null;
}

export const presignFeedbackAttachment = async (
  conversationId: string,
  body: PresignFeedbackAttachmentBody,
): Promise<DrFeedbackPresignResponse> =>
  DrFeedbackPresignResponseSchema.parse(
    await drSend('POST', `/dr/feedback/conversations/${enc(conversationId)}/attachments`, body),
  );

export const completeFeedbackAttachment = async (conversationId: string, attachmentId: string): Promise<void> => {
  await drSend('POST', `/dr/feedback/conversations/${enc(conversationId)}/attachments/${enc(attachmentId)}/complete`);
};

export const deleteFeedbackAttachment = async (conversationId: string, attachmentId: string): Promise<void> => {
  await drSend('DELETE', `/dr/feedback/conversations/${enc(conversationId)}/attachments/${enc(attachmentId)}`);
};

export interface UploadFeedbackAttachmentParams {
  conversationId: string;
  file: File;
  kind: DrAssetKind;
  contentType: string;
  width?: number | null;
  height?: number | null;
  /** Called with the attachment id as soon as it is minted (before upload
   *  finishes), so the caller can DELETE it if the user cancels. */
  onAssetId?: (attachmentId: string) => void;
  onProgress: (percent: number) => void;
  signal?: AbortSignal;
}

// Full handshake for one attachment: presign → PUT (with progress +
// cancellation) → complete. Returns the attachment id. On any failure/cancel,
// best-effort deletes the (unbound) attachment row + S3 object so a cancelled
// upload never survives to send. Mirrors uploadDrDocAsset.
export async function uploadFeedbackAttachment(params: UploadFeedbackAttachmentParams): Promise<string> {
  const { attachmentId, uploadUrl } = await presignFeedbackAttachment(params.conversationId, {
    fileName: params.file.name,
    contentType: params.contentType,
    sizeBytes: params.file.size,
    kind: params.kind,
    width: params.width ?? null,
    height: params.height ?? null,
  });
  params.onAssetId?.(attachmentId);
  try {
    await putToS3(uploadUrl, params.file, params.contentType, params.onProgress, params.signal);
    await completeFeedbackAttachment(params.conversationId, attachmentId);
    return attachmentId;
  } catch (err) {
    void deleteFeedbackAttachment(params.conversationId, attachmentId).catch(() => {});
    throw err;
  }
}
