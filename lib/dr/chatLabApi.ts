// DR AI Chat Test Lab API. Uses the shared transport (apiClient.ts) and the
// shared presign → PUT-to-S3 → complete handshake (s3Upload.ts). Every response
// is zod-parsed against schemas/drChatLab.ts so a malformed response fails
// fast. The streaming send is NOT here — it lives in useChatStream.ts because
// it consumes an SSE body via fetch + ReadableStream.

import {
  CHATLAB_ATTACHMENT_EXT,
  ChatLabDeletedResponseSchema,
  ChatLabModelsResponseSchema,
  ChatLabPresignResponseSchema,
  ChatLabSessionDetailResponseSchema,
  ChatLabSessionSchema,
  ChatLabSessionsResponseSchema,
  chatLabMaxBytes,
  type ChatLabAttachmentKind,
  type ChatLabModel,
  type ChatLabPresignResponse,
  type ChatLabSession,
  type ChatLabSessionDetailResponse,
} from '@/schemas/drChatLab';
import { drGet, drSend } from './apiClient';
import { putToS3 } from './s3Upload';

const enc = encodeURIComponent;

// ---- Models ------------------------------------------------------------------

export const fetchChatLabModels = async (): Promise<ChatLabModel[]> =>
  ChatLabModelsResponseSchema.parse(await drGet('/dr/chatlab/models')).models;

// ---- Sessions ----------------------------------------------------------------

export const fetchChatLabSessions = async (): Promise<ChatLabSession[]> =>
  ChatLabSessionsResponseSchema.parse(await drGet('/dr/chatlab/sessions')).sessions;

export const createChatLabSession = async (): Promise<ChatLabSession> =>
  ChatLabSessionSchema.parse(await drSend('POST', '/dr/chatlab/sessions', {}));

export const fetchChatLabSession = async (sessionId: string): Promise<ChatLabSessionDetailResponse> =>
  ChatLabSessionDetailResponseSchema.parse(await drGet(`/dr/chatlab/sessions/${enc(sessionId)}`));

export const renameChatLabSession = async (sessionId: string, title: string): Promise<ChatLabSession> =>
  ChatLabSessionSchema.parse(await drSend('PUT', `/dr/chatlab/sessions/${enc(sessionId)}`, { title }));

export const deleteChatLabSession = async (sessionId: string): Promise<void> => {
  ChatLabDeletedResponseSchema.parse(await drSend('DELETE', `/dr/chatlab/sessions/${enc(sessionId)}`));
};

// ---- Attachments (compose-before-send) -----------------------------------------

export interface PresignChatLabAttachmentBody {
  fileName: string;
  contentType: string;
  sizeBytes: number;
  kind: ChatLabAttachmentKind;
  width: number | null;
  height: number | null;
}

export const presignChatLabAttachment = async (
  sessionId: string,
  body: PresignChatLabAttachmentBody,
): Promise<ChatLabPresignResponse> =>
  ChatLabPresignResponseSchema.parse(await drSend('POST', `/dr/chatlab/sessions/${enc(sessionId)}/attachments`, body));

export const completeChatLabAttachment = async (sessionId: string, attachmentId: string): Promise<void> => {
  await drSend('POST', `/dr/chatlab/sessions/${enc(sessionId)}/attachments/${enc(attachmentId)}/complete`);
};

export const deleteChatLabAttachment = async (sessionId: string, attachmentId: string): Promise<void> => {
  await drSend('DELETE', `/dr/chatlab/sessions/${enc(sessionId)}/attachments/${enc(attachmentId)}`);
};

// Resolve a browser File to (kind, server content type) on the CHAT-LAB
// allowlist. Browsers sometimes leave File.type empty (notably .md/.csv), so we
// fall back to the extension. Returns null when unsupported.
export function resolveChatLabAttachment(file: File): { kind: ChatLabAttachmentKind; contentType: string } | null {
  for (const kind of ['image', 'file'] as ChatLabAttachmentKind[]) {
    const allow = CHATLAB_ATTACHMENT_EXT[kind];
    if (file.type && allow[file.type]) return { kind, contentType: file.type };
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    for (const [ct, e] of Object.entries(allow)) {
      if (e === ext) return { kind, contentType: ct };
    }
  }
  return null;
}

/** Client-side size guard (mirrors the server caps) — true when oversize. */
export function isChatLabAttachmentOversize(sizeBytes: number, kind: ChatLabAttachmentKind, contentType: string): boolean {
  return sizeBytes > chatLabMaxBytes(kind, contentType);
}

export interface UploadChatLabAttachmentParams {
  sessionId: string;
  file: File;
  kind: ChatLabAttachmentKind;
  contentType: string;
  width?: number | null;
  height?: number | null;
  /** Called with the attachment id as soon as it is minted (before upload
   *  finishes), so the caller can DELETE it if the user cancels. */
  onAttachmentId?: (attachmentId: string) => void;
  onProgress: (percent: number) => void;
  signal?: AbortSignal;
}

// Full handshake for one attachment: presign → PUT (with progress +
// cancellation) → complete. Returns the attachment id. On any failure/cancel,
// best-effort deletes the (unbound) attachment row + S3 object so a cancelled
// upload never survives to send. Mirrors uploadFeedbackAttachment.
export async function uploadChatLabAttachment(params: UploadChatLabAttachmentParams): Promise<string> {
  const { attachmentId, uploadUrl } = await presignChatLabAttachment(params.sessionId, {
    fileName: params.file.name,
    contentType: params.contentType,
    sizeBytes: params.file.size,
    kind: params.kind,
    width: params.width ?? null,
    height: params.height ?? null,
  });
  params.onAttachmentId?.(attachmentId);
  try {
    await putToS3(uploadUrl, params.file, params.contentType, params.onProgress, params.signal);
    await completeChatLabAttachment(params.sessionId, attachmentId);
    return attachmentId;
  } catch (err) {
    void deleteChatLabAttachment(params.sessionId, attachmentId).catch(() => {});
    throw err;
  }
}

// Reuse the generic image-dimension helper unchanged (same trick as feedback).
export { readImageDimensions } from './docEditorApi';
