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

export const studioMediaKindSchema = z.enum(['video', 'audio', 'lut']);
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

// ---------------------------------------------------------------------------
// EDL v2 — Motion / Crop / Blend / Effects / Audio keyframes (all optional and
// all defaulting to "no effect"). Parameter names + ranges are mirrored
// byte-for-byte by internal/models/studio.go and the WebGL/ffmpeg emitters; the
// canonical table lives in lib/studio/effectRegistry.ts.
// ---------------------------------------------------------------------------

/**
 * Per-clip 2D transform. x/y are normalized offsets of the clip center from the
 * frame center (fractions of project width/height). scale is uniform. rotation
 * is degrees clockwise.
 */
export const studioTransformSchema = z.object({
  x: z.number().min(-1).max(1).default(0),
  y: z.number().min(-1).max(1).default(0),
  scale: z.number().min(0.01).max(10).default(1),
  rotationDeg: z.number().min(-360).max(360).default(0),
});
export type StudioTransform = z.infer<typeof studioTransformSchema>;

/**
 * Normalized fractions cropped from each edge of the SOURCE frame. The refine
 * keeps a non-empty region; the Go side clamps identically.
 */
export const studioCropSchema = z
  .object({
    left: z.number().min(0).max(1).default(0),
    top: z.number().min(0).max(1).default(0),
    right: z.number().min(0).max(1).default(0),
    bottom: z.number().min(0).max(1).default(0),
  })
  .refine((c) => c.left + c.right < 1 && c.top + c.bottom < 1, {
    message: 'crop edges must leave a non-empty region',
  });
export type StudioCrop = z.infer<typeof studioCropSchema>;

/**
 * Layer blend modes. Exactly this set: every member exists in ffmpeg's
 * `blend=all_mode=` AND has a standard separable blend equation we implement in
 * the WebGL shader.
 */
export const studioBlendModeSchema = z.enum([
  'normal',
  'multiply',
  'screen',
  'overlay',
  'lighten',
  'darken',
  'addition',
  'difference',
]);
export type StudioBlendMode = z.infer<typeof studioBlendModeSchema>;

/** Lumetri-style primary color grade. */
export const studioLumetriEffectSchema = z.object({
  type: z.literal('lumetri'),
  id: z.string(),
  enabled: z.boolean().default(true),
  exposure: z.number().min(-3).max(3).default(0), // stops; gain = 2^exposure
  contrast: z.number().min(0).max(2).default(1),
  saturation: z.number().min(0).max(2).default(1),
  temperature: z.number().min(-100).max(100).default(0),
  tint: z.number().min(-100).max(100).default(0),
  vibrance: z.number().min(-2).max(2).default(0),
});
export type StudioLumetriEffect = z.infer<typeof studioLumetriEffectSchema>;

/** A 3D LUT (.cube) applied at `intensity` (0..1 mix with the ungraded pixel). */
export const studioLutEffectSchema = z.object({
  type: z.literal('lut'),
  id: z.string(),
  enabled: z.boolean().default(true),
  lutAssetId: z.string(),
  intensity: z.number().min(0).max(1).default(1),
});
export type StudioLutEffect = z.infer<typeof studioLutEffectSchema>;

/** Green/blue-screen chroma key (UV-distance, matching ffmpeg `chromakey`). */
export const studioChromaKeyEffectSchema = z.object({
  type: z.literal('chromakey'),
  id: z.string(),
  enabled: z.boolean().default(true),
  keyColor: z.string().default('#00FF00'), // #RRGGBB
  similarity: z.number().min(0.01).max(1).default(0.1),
  blend: z.number().min(0).max(1).default(0.1),
  despill: z.number().min(0).max(1).default(0.5),
});
export type StudioChromaKeyEffect = z.infer<typeof studioChromaKeyEffectSchema>;

/** An ordered, toggleable effect in a clip's effect stack. */
export const studioEffectSchema = z.discriminatedUnion('type', [
  studioLumetriEffectSchema,
  studioLutEffectSchema,
  studioChromaKeyEffectSchema,
]);
export type StudioEffect = z.infer<typeof studioEffectSchema>;
export type StudioEffectType = StudioEffect['type'];

/** A volume automation point. `t` is seconds from the clip's timeline start. */
export const studioVolumeKeyframeSchema = z.object({
  t: z.number().min(0),
  gain: z.number().min(0).max(2), // +6dB ceiling, like Premiere
});
export type StudioVolumeKeyframe = z.infer<typeof studioVolumeKeyframeSchema>;

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
  /** 0..2 for audio (default 1; >1 = boost, like Premiere). Overridden by volumeKeyframes when present. */
  volume: z.number().min(0).max(2).optional(),
  /** 0..1 for video (default 1) */
  opacity: z.number().min(0).max(1).optional(),
  /** cross-dissolve duration from the previous clip on the same track */
  transitionInSeconds: z.number().min(0).optional(),
  adjustments: studioAdjustmentsSchema.optional(),
  textOverlays: z.array(studioTextOverlaySchema).optional(),

  // --- EDL v2 (all optional; absent = no effect) ---
  /** 2D motion: position / scale / rotation within the project frame. */
  transform: studioTransformSchema.optional(),
  /** Edge crop of the source frame. */
  crop: studioCropSchema.optional(),
  /** Layer blend mode against the running composite (default 'normal'). */
  blendMode: studioBlendModeSchema.optional(),
  /** Ordered effect stack (lumetri / lut / chromakey). */
  effects: z.array(studioEffectSchema).optional(),
  /** Volume automation; when non-empty it overrides the flat `volume`. */
  volumeKeyframes: z.array(studioVolumeKeyframeSchema).optional(),
  /** Stereo balance −1 (L) .. 1 (R). */
  pan: z.number().min(-1).max(1).optional(),
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

// ---------------------------------------------------------------------------
// Captions + audio ducking — project-level (not per-track). Persisted in the
// `captions` JSONB sidecar column so the autosave PUT and the caption-generate
// job don't clobber each other.
// ---------------------------------------------------------------------------

/** One caption cue rendered on the dedicated caption lane / burned at export. */
export const studioCaptionCueSchema = z.object({
  id: z.string(),
  startSeconds: z.number().min(0),
  endSeconds: z.number().min(0),
  text: z.string().max(500),
});
export type StudioCaptionCue = z.infer<typeof studioCaptionCueSchema>;

/** Project-wide caption appearance. fontSizePct is a % of project height. */
export const studioCaptionStyleSchema = z.object({
  fontSizePct: z.number().min(1).max(15).default(4.5),
  color: z.string().default('#FFFFFF'),
  backgroundColor: z.string().default('#000000'),
  backgroundOpacity: z.number().min(0).max(1).default(0.55),
  position: z.enum(['bottom', 'top']).default('bottom'),
  maxWidthPct: z.number().min(40).max(100).default(90),
});
export type StudioCaptionStyle = z.infer<typeof studioCaptionStyleSchema>;

/** Sensible default caption style so the UI always has one to render. */
export const DEFAULT_CAPTION_STYLE: StudioCaptionStyle = {
  fontSizePct: 4.5,
  color: '#FFFFFF',
  backgroundColor: '#000000',
  backgroundOpacity: 0.55,
  position: 'bottom',
  maxWidthPct: 90,
};

/** Sidechain auto-ducking: pull non-voice tracks down while a voice clip plays. */
export const studioAudioConfigSchema = z.object({
  duckingEnabled: z.boolean().default(false),
  duckVoiceTrackId: z.string().optional(),
  duckAmountDb: z.number().min(0).max(24).default(9),
  duckAttackMs: z.number().min(0).max(2000).default(120),
  duckReleaseMs: z.number().min(0).max(5000).default(400),
});
export type StudioAudioConfig = z.infer<typeof studioAudioConfigSchema>;

/** Current EDL schema version. v1 projects are upgraded by normalizeProject. */
export const STUDIO_SCHEMA_VERSION = 2;

/** The persisted editor document. */
export const studioProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** EDL schema version; written as 2 on save, normalized from v1 on load. */
  schemaVersion: z.number().int().default(1),
  /** timeline framerate (e.g. 30) */
  fps: z.number().positive(),
  /** timeline resolution */
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  /** computed = end of last clip */
  durationSeconds: z.number().min(0).default(0),
  tracks: z.array(studioTrackSchema).default([]),
  /** caption cues (project-level, rendered on a dedicated lane). */
  captions: z.array(studioCaptionCueSchema).default([]),
  captionStyle: studioCaptionStyleSchema.optional(),
  captionsEnabled: z.boolean().default(true),
  /** auto-ducking config. */
  audio: studioAudioConfigSchema.optional(),
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
  /** audio waveform peaks JSON (present once generated/backfilled) */
  s3KeyPeaks: z.string().optional(),
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
  schemaVersion: z.number().int().optional(),
  fps: z.number().positive().max(240),
  width: z.number().int().positive().max(7680),
  height: z.number().int().positive().max(4320),
  tracks: z.array(studioTrackSchema),
  // EDL v2 project-level fields persisted alongside tracks (transactionally).
  captions: z.array(studioCaptionCueSchema).optional(),
  captionStyle: studioCaptionStyleSchema.optional(),
  captionsEnabled: z.boolean().optional(),
  audio: studioAudioConfigSchema.optional(),
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

export const studioLoudnessPresetSchema = z.enum(['', 'streaming', 'podcast', 'broadcast']);
export type StudioLoudnessPreset = z.infer<typeof studioLoudnessPresetSchema>;

export const studioExportRequestSchema = z.object({
  fileName: z.string().optional(),
  preset: z.string().optional(),
  /** loudnorm target preset applied to the master audio (empty = off). */
  loudness: studioLoudnessPresetSchema.optional(),
});
export type StudioExportRequest = z.infer<typeof studioExportRequestSchema>;

// ---------------------------------------------------------------------------
// v1 → v2 normalizer. Called from loadProject. The EDL changes are purely
// additive (no field relocations), so this mostly stamps the version and fills
// the project-level caption/audio defaults the UI relies on. Idempotent.
// ---------------------------------------------------------------------------
export function normalizeProject(project: StudioProject): StudioProject {
  return {
    ...project,
    schemaVersion: STUDIO_SCHEMA_VERSION,
    captions: project.captions ?? [],
    captionStyle: project.captionStyle ?? { ...DEFAULT_CAPTION_STYLE },
    captionsEnabled: project.captionsEnabled ?? true,
    audio: project.audio,
  };
}
