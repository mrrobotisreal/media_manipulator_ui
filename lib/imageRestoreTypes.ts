// TS mirrors of the AI Image Restoration & Upscaling API contract:
// GET  /image-restore/capabilities
// POST /image-restore/start                 (multipart: image + options JSON)
// GET  /image-restore/:jobId/results
// GET  /image-restore/:jobId/result/:resultId
// Job progress flows through the shared /job/:jobId machinery (see
// useTranscodeJobStatus). This is the still-image sibling of restoreTypes.ts.

export type ImageRestoreModelId =
  | 'fbcnn'
  | 'scunet'
  | 'nafnet'
  | 'realesrgan'
  | 'swinir'
  | 'hat'
  | 'gfpgan'
  | 'codeformer';

/**
 * Model kinds: pre-clean models remove degradation without synthesizing
 * content (always 1x); general models upscale; face models are generative
 * face priors.
 */
export type ImageRestoreModelKind = 'preclean' | 'general' | 'face';

export interface ImageRestoreModelInfo {
  id: ImageRestoreModelId;
  kind: ImageRestoreModelKind;
  displayName: string;
  scales: number[];
  available: boolean;
  /** User-safe reason when available is false. */
  reason?: string;
  estSecondsPerMegapixel: number;
}

export interface ImageRestoreCapabilities {
  enabled: boolean;
  maxSourceWidth: number;
  maxSourceHeight: number;
  maxUploadSizeBytes: number;
  maxOutputPixels: number;
  maxOutputs: number;
  chainSupported: boolean;
  models: ImageRestoreModelInfo[];
}

/** Normalized crop rect, each field in [0,1] of the original image. */
export interface NormalizedRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageRestoreOptions {
  /** nil/omitted = whole image. */
  crop?: NormalizedRect;
  preclean: ImageRestoreModelId[];
  models: ImageRestoreModelId[];
  faceModels: ImageRestoreModelId[];
  chain: boolean;
  /** 0 = auto (≤540px crop → 4x, else 2x), or explicit 2 / 4. */
  scale: number;
  /** CodeFormer fidelity weight 0..1 (default 0.7). */
  codeformerFidelity: number;
  /** FBCNN quality factor: 0 = blind/auto, else 1..100. */
  fbcnnQualityFactor: number;
  sessionId?: string;
}

export interface ImageRestoreStartResponse {
  jobId: string;
}

export interface ImageRestoreResultEntry {
  id: string;
  label: string;
  kind: ImageRestoreModelKind | '';
  baseModel?: string;
  width: number;
  height: number;
  fileName: string;
  sizeBytes: number;
  status: 'completed' | 'failed';
  error?: string;
  /** Set on face outputs — generative-reconstruction disclaimer. */
  generativeNote?: string;
  /** Set on pre-clean outputs — non-generative cleanup note. */
  fidelityNote?: string;
}

export interface ImageRestoreResultsResponse {
  jobId: string;
  original: ImageRestoreResultEntry;
  results: ImageRestoreResultEntry[];
}

export type ImageRestoreUploadPhase = 'idle' | 'uploading' | 'starting' | 'processing';
