// Double Raven comments API. Reuses the shared transport (apiClient.ts) and
// mirrors the presign → PUT-to-S3 (XHR w/ progress) → complete handshake from
// lib/useStudioAsset.ts. Responses are zod-parsed against schemas/drComments.ts.

import {
  DrCommentsListResponseSchema,
  DrCreateCommentResponseSchema,
  DrCreateReplyResponseSchema,
  DrPresignAttachmentResponseSchema,
  DR_ATTACHMENT_EXT,
  type DrComment,
  type DrCommentAnchor,
  type DrPresignAttachmentResponse,
} from '@/schemas/drComments';
import { drGet, drSend } from './apiClient';

const enc = encodeURIComponent;

// ---- Reads -----------------------------------------------------------------
export const fetchDrComments = async (slug: string): Promise<DrComment[]> =>
  DrCommentsListResponseSchema.parse(await drGet(`/dr/docs/${enc(slug)}/comments`)).comments;

// ---- Comment lifecycle -----------------------------------------------------
export const createDraftComment = async (slug: string, anchor: DrCommentAnchor): Promise<string> =>
  DrCreateCommentResponseSchema.parse(await drSend('POST', `/dr/docs/${enc(slug)}/comments`, { anchor })).commentId;

export const publishComment = async (commentId: string, body: string): Promise<void> => {
  await drSend('POST', `/dr/comments/${enc(commentId)}/publish`, { body });
};

export const cancelDraftComment = async (commentId: string): Promise<void> => {
  await drSend('DELETE', `/dr/comments/${enc(commentId)}`);
};

// ---- Reply lifecycle -------------------------------------------------------
export const createDraftReply = async (commentId: string): Promise<string> =>
  DrCreateReplyResponseSchema.parse(await drSend('POST', `/dr/comments/${enc(commentId)}/replies`)).replyId;

export const publishReply = async (replyId: string, body: string): Promise<void> => {
  await drSend('POST', `/dr/replies/${enc(replyId)}/publish`, { body });
};

export const cancelDraftReply = async (replyId: string): Promise<void> => {
  await drSend('DELETE', `/dr/replies/${enc(replyId)}`);
};

// ---- Attachment presign / complete ----------------------------------------
interface PresignBody {
  fileName: string;
  contentType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
}

const presignCommentAttachment = async (commentId: string, body: PresignBody): Promise<DrPresignAttachmentResponse> =>
  DrPresignAttachmentResponseSchema.parse(await drSend('POST', `/dr/comments/${enc(commentId)}/attachments`, body));

const presignReplyAttachment = async (replyId: string, body: PresignBody): Promise<DrPresignAttachmentResponse> =>
  DrPresignAttachmentResponseSchema.parse(await drSend('POST', `/dr/replies/${enc(replyId)}/attachments`, body));

const completeAttachment = async (attachmentId: string): Promise<void> => {
  await drSend('POST', `/dr/attachments/${enc(attachmentId)}/complete`);
};

// Remove a single attachment (author-only). Used by the composer's per-thumbnail
// remove ✕ so a completed upload the user drops doesn't survive to publish.
export const deleteAttachment = async (attachmentId: string): Promise<void> => {
  await drSend('DELETE', `/dr/attachments/${enc(attachmentId)}`);
};

// The browser usually sets File.type for images; fall back to the extension.
function imageContentType(file: File): string {
  if (file.type && DR_ATTACHMENT_EXT[file.type]) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const byExt: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
  };
  return byExt[ext] ?? file.type ?? '';
}

async function readImageDimensions(file: File): Promise<{ width: number | null; height: number | null }> {
  try {
    const bitmap = await createImageBitmap(file);
    const dims = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dims;
  } catch {
    return { width: null, height: null };
  }
}

function putToS3(uploadUrl: string, file: File, contentType: string, onProgress: (p: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && e.total > 0) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error(`Image upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => reject(new Error('Image upload failed'));
    xhr.onabort = () => reject(new Error('Image upload was cancelled'));
    xhr.send(file);
  });
}

// Full upload handshake for one image; returns the attachment id once completed.
async function uploadAttachment(
  presign: (body: PresignBody) => Promise<DrPresignAttachmentResponse>,
  file: File,
  onProgress: (p: number) => void,
): Promise<string> {
  const contentType = imageContentType(file);
  const { width, height } = await readImageDimensions(file);
  const target = await presign({ fileName: file.name, contentType, sizeBytes: file.size, width, height });
  await putToS3(target.uploadUrl, file, contentType, onProgress);
  await completeAttachment(target.attachmentId);
  return target.attachmentId;
}

export const uploadCommentAttachment = (commentId: string, file: File, onProgress: (p: number) => void): Promise<string> =>
  uploadAttachment((body) => presignCommentAttachment(commentId, body), file, onProgress);

export const uploadReplyAttachment = (replyId: string, file: File, onProgress: (p: number) => void): Promise<string> =>
  uploadAttachment((body) => presignReplyAttachment(replyId, body), file, onProgress);
