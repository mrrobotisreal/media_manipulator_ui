import { z } from 'zod';

/**
 * Content Studio EDL (Edit Decision List) — the shared contract between the
 * React editor and the Go API. Field names are camelCase and MUST stay
 * identical to the Go structs in internal/models/studio.go. The browser
 * previews from this list (Option A: pooled <video> elements + Web Audio); the
 * server only re-reads it at export time to build the ffmpeg filter_complex
 * graph.
 *
 * Zod is the single source of truth here: TS types are inferred from the
 * schemas so a drift between the two is impossible.
 */

export const studioMediaKindSchema = z.enum(['video', 'audio']);
export type StudioMediaKind = z.infer<typeof studioMediaKindSchema>;

export const studioTrackKindSchema = z.enum(['video', 'audio']);
export type StudioTrackKind = z.infer<typeof studioTrackKindSchema>;

/** Per-clip color adjustments (ffmpeg `eq` / CSS filters). */
export const studioAdjustmentsSchema = z.object({
  brightness: z.number().min(-1).max(1), // 0 = none
  contrast: z.number().min(0).max(2), // 1 = none
  saturation: z.number().min(0).max(2), // 1 = none
});
export type StudioAdjustments = z.infer<typeof studioAdjustmentsSchema>;

/** A text/location label drawn over a clip (e.g. on drone footage). */
export const studioTextOverlaySchema = z.object({
  id: z.string(),
  text: z.string().max(200),
  x: z.number().min(0).max(1), // normalized position within the frame
  y: z.number().min(0).max(1),
  fontSize: z.number().positive(), // project-resolution pixels
  color: z.string(), // #RRGGBB
});
export type StudioTextOverlay = z.infer<typeof studioTextOverlaySchema>;

/** A placement of a source asset's stream on the timeline. */
export const studioClipSchema = z.object({
  id: z.string(),
  assetId: z.string(),
  /** which source stream (usually 0 video / 0 audio) */
  streamIndex: z.number().int().min(0).default(0),
  /** seconds on the timeline */
  timelineStart: z.number().min(0),
  /** in-point within the source media (seconds) */
  sourceIn: z.number().min(0),
  /** out-point within the source media (seconds); effective duration = sourceOut - sourceIn */
  sourceOut: z.number().min(0),
  /** 0..1 for audio (default 1) */
  volume: z.number().min(0).max(1).optional(),
  /** 0..1 for video (default 1) */
  opacity: z.number().min(0).max(1).optional(),
  /** cross-dissolve duration from the previous clip on the same track */
  transitionInSeconds: z.number().min(0).optional(),
  adjustments: studioAdjustmentsSchema.optional(),
  textOverlays: z.array(studioTextOverlaySchema).optional(),
});
export type StudioClip = z.infer<typeof studioClipSchema>;

/** One timeline lane. */
export const studioTrackSchema = z.object({
  id: z.string(),
  kind: studioTrackKindSchema,
  /** V1=0,V2=1… / A1=0,A2=1… */
  index: z.number().int().min(0),
  muted: z.boolean().default(false),
  clips: z.array(studioClipSchema).default([]),
});
export type StudioTrack = z.infer<typeof studioTrackSchema>;

/** The persisted editor document. */
export const studioProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** timeline framerate (e.g. 30) */
  fps: z.number().positive(),
  /** timeline resolution */
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  /** computed = end of last clip */
  durationSeconds: z.number().min(0).default(0),
  tracks: z.array(studioTrackSchema).default([]),
  /** RFC3339 */
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type StudioProject = z.infer<typeof studioProjectSchema>;

/** An ingested source file plus its derived proxy + filmstrip + probe data. */
export const studioAssetSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  originalFileName: z.string(),
  s3KeyOriginal: z.string(),
  s3KeyProxy: z.string().optional(),
  /** filmstrip sprite */
  thumbnailSpriteUrl: z.string().optional(),
  mediaKind: studioMediaKindSchema,
  durationSeconds: z.number().min(0),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  fps: z.number().optional(),
  videoCodec: z.string().optional(),
  audioCodec: z.string().optional(),
  hasAudio: z.boolean(),
  sampleRate: z.number().int().optional(),
  channels: z.number().int().optional(),
  /** full ffprobe payload for debugging */
  probeJson: z.unknown(),
  createdAt: z.string(),
});
export type StudioAsset = z.infer<typeof studioAssetSchema>;

// ---------------------------------------------------------------------------
// Request / response schemas for the /api/studio/* endpoints.
// ---------------------------------------------------------------------------

export const studioCreateProjectRequestSchema = z.object({
  name: z.string().min(1).max(200),
  fps: z.number().positive().max(240),
  width: z.number().int().positive().max(7680),
  height: z.number().int().positive().max(4320),
});
export type StudioCreateProjectRequest = z.infer<typeof studioCreateProjectRequestSchema>;

export const studioSaveProjectRequestSchema = z.object({
  name: z.string().min(1).max(200),
  fps: z.number().positive().max(240),
  width: z.number().int().positive().max(7680),
  height: z.number().int().positive().max(4320),
  tracks: z.array(studioTrackSchema),
});
export type StudioSaveProjectRequest = z.infer<typeof studioSaveProjectRequestSchema>;

export const studioAssetPresignRequestSchema = z.object({
  projectId: z.string(),
  fileName: z.string(),
  contentType: z.string(),
  fileSizeBytes: z.number().int().positive(),
  sessionId: z.string().optional(),
});
export type StudioAssetPresignRequest = z.infer<typeof studioAssetPresignRequestSchema>;

export const studioAssetPresignResponseSchema = z.object({
  uploadUrl: z.string(),
  s3Key: z.string(),
  bucket: z.string(),
  expiresAt: z.string(),
});
export type StudioAssetPresignResponse = z.infer<typeof studioAssetPresignResponseSchema>;

export const studioAssetCompleteRequestSchema = z.object({
  projectId: z.string(),
  s3Key: z.string(),
  fileName: z.string(),
  contentType: z.string().optional(),
  fileSizeBytes: z.number().int().optional(),
});
export type StudioAssetCompleteRequest = z.infer<typeof studioAssetCompleteRequestSchema>;

export const studioAssetCompleteResponseSchema = z.object({
  asset: studioAssetSchema,
  jobId: z.string(),
});
export type StudioAssetCompleteResponse = z.infer<typeof studioAssetCompleteResponseSchema>;

export const studioExportRequestSchema = z.object({
  fileName: z.string().optional(),
  preset: z.string().optional(),
});
export type StudioExportRequest = z.infer<typeof studioExportRequestSchema>;
