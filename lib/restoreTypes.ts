// TS mirrors of the AI Video Restoration API contract:
// GET /video-restore/capabilities + POST /video-restore/start. Job progress
// flows through the shared /job/:jobId machinery (see useTranscodeJobStatus).

export type RestoreModelId =
  | 'realesrgan'
  | 'swinir'
  | 'hat'
  | 'basicvsrpp'
  | 'rvrt'
  | 'vrt';

/**
 * Group A ('frame') enhancers process every extracted frame — their results
 * include both the enhanced frames (optional) and the stitched MP4. Group B
 * ('video') models operate on the sequence natively and produce MP4 only.
 */
export type RestoreModelGroup = 'frame' | 'video';

export interface RestoreModelInfo {
  id: RestoreModelId;
  group: RestoreModelGroup;
  displayName: string;
  scales: number[];
  available: boolean;
  /** User-safe reason when available is false. */
  reason?: string;
  estSecondsPerFrame: number;
}

export interface RestoreCapabilities {
  enabled: boolean;
  maxClipSeconds: number;
  recommendedClipSeconds: number;
  maxFrames: number;
  maxSourceWidth: number;
  maxSourceHeight: number;
  maxUploadSizeBytes: number;
  resultLinkTtlSeconds: number;
  models: RestoreModelInfo[];
}

export interface RestoreStartRequest {
  s3Key: string;
  fileName: string;
  fileSizeBytes: number;
  clipStartSeconds: number;
  clipEndSeconds: number;
  models: RestoreModelId[];
  /** 0 = auto (≤540p source → 4x, else 2x), or explicit 2 / 4. */
  scale: number;
  includeFrames: boolean;
  sessionId?: string;
}

export interface RestoreStartResponse {
  jobId: string;
}

export type RestoreUploadPhase =
  | 'idle'
  | 'requesting-url'
  | 'uploading-to-s3'
  | 'starting'
  | 'processing';
