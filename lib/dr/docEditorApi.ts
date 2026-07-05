// Double Raven "Create Doc" editor API. Uses the shared transport (apiClient.ts)
// and the shared presign → PUT-to-S3 → complete handshake (s3Upload.ts). Every
// response is zod-parsed against schemas/drDocs.ts so a malformed response fails
// fast. The transport/auth/retry plumbing is NOT re-implemented here.

import {
  DrCreateDocResponseSchema,
  DrPresignAssetResponseSchema,
  DrPublishDocResponseSchema,
  DrUpdateDocResponseSchema,
  DR_DOC_ASSET_EXT,
  DR_DOC_ASSET_MAX_BYTES,
  type DrAssetKind,
  type DrDoc,
  type DrDocContent,
  type DrDocSummary,
  type DrPresignAssetResponse,
} from '@/schemas/drDocs';
import { drSend } from './apiClient';
import { putToS3 } from './s3Upload';

const enc = encodeURIComponent;

// ---- Document lifecycle ----------------------------------------------------

/** Create a new draft. Returns the full draft document (empty content). */
export const createDrDoc = async (title?: string): Promise<DrDoc> =>
  DrCreateDocResponseSchema.parse(await drSend('POST', '/dr/docs', title ? { title } : undefined));

export interface DrDocUpdate {
  title: string;
  summary: string | null;
  content: DrDocContent;
}

/** Autosave a draft's title/summary/content. */
export const updateDrDoc = async (id: string, body: DrDocUpdate): Promise<void> => {
  DrUpdateDocResponseSchema.parse(await drSend('PUT', `/dr/docs/${enc(id)}`, body));
};

/** Publish a draft; returns the published summary (client redirects via slug). */
export const publishDrDoc = async (id: string): Promise<DrDocSummary> =>
  DrPublishDocResponseSchema.parse(await drSend('POST', `/dr/docs/${enc(id)}/publish`));

// ---- Assets ----------------------------------------------------------------

export interface DrPresignAssetBody {
  fileName: string;
  contentType: string;
  sizeBytes: number;
  kind: DrAssetKind;
  width: number | null;
  height: number | null;
}

export const presignDrDocAsset = async (id: string, body: DrPresignAssetBody): Promise<DrPresignAssetResponse> =>
  DrPresignAssetResponseSchema.parse(await drSend('POST', `/dr/docs/${enc(id)}/assets`, body));

export const completeDrDocAsset = async (id: string, assetId: string): Promise<void> => {
  await drSend('POST', `/dr/docs/${enc(id)}/assets/${enc(assetId)}/complete`);
};

export const deleteDrDocAsset = async (id: string, assetId: string): Promise<void> => {
  await drSend('DELETE', `/dr/docs/${enc(id)}/assets/${enc(assetId)}`);
};

// Resolve a browser File's content type to one on the server allowlist for the
// given kind. Browsers sometimes leave File.type empty (notably .md/.csv), so we
// fall back to the extension via DR_DOC_ASSET_EXT. Returns '' when unsupported.
export function resolveDrAssetContentType(file: File, kind: DrAssetKind): string {
  const allow = DR_DOC_ASSET_EXT[kind];
  if (file.type && allow[file.type]) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  for (const [ct, e] of Object.entries(allow)) {
    if (e === ext) return ct;
  }
  return ''; // unsupported for this kind
}

/** Client-side size guard (mirrors the server caps) — returns true if oversize. */
export function isDrAssetOversize(sizeBytes: number, kind: DrAssetKind): boolean {
  return sizeBytes > DR_DOC_ASSET_MAX_BYTES[kind];
}

export interface UploadDrDocAssetParams {
  docId: string;
  file: File;
  kind: DrAssetKind;
  contentType: string;
  width?: number | null;
  height?: number | null;
  /** Called with the asset id as soon as it is minted (before upload finishes),
   *  so the caller can DELETE it if the user cancels. */
  onAssetId?: (assetId: string) => void;
  onProgress: (percent: number) => void;
  signal?: AbortSignal;
}

// Full handshake for one asset: presign → PUT (with progress + cancellation) →
// complete. Returns the asset id. On any failure/cancel, best-effort deletes the
// asset row + S3 object so a cancelled upload never survives to publish.
export async function uploadDrDocAsset(params: UploadDrDocAssetParams): Promise<string> {
  const { assetId, uploadUrl } = await presignDrDocAsset(params.docId, {
    fileName: params.file.name,
    contentType: params.contentType,
    sizeBytes: params.file.size,
    kind: params.kind,
    width: params.width ?? null,
    height: params.height ?? null,
  });
  params.onAssetId?.(assetId);
  try {
    await putToS3(uploadUrl, params.file, params.contentType, params.onProgress, params.signal);
    await completeDrDocAsset(params.docId, assetId);
    return assetId;
  } catch (err) {
    void deleteDrDocAsset(params.docId, assetId).catch(() => {});
    throw err;
  }
}

// Read an image's natural dimensions (same trick commentsApi uses) so the editor
// can pass width/height at presign time. Returns nulls on failure.
export async function readImageDimensions(file: File): Promise<{ width: number | null; height: number | null }> {
  try {
    const bitmap = await createImageBitmap(file);
    const dims = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dims;
  } catch {
    return { width: null, height: null };
  }
}
