// TS mirrors of the MM74 video summary API contract (media_manipulator_api
// internal/handlers/video_summary.go + internal/models/video_summary.go):
//
//   GET  /summarize/capabilities
//   POST /summarize/start            multipart `file` + `options` JSON, or JSON
//                                    {s3Key, fileName, fileSizeBytes, options}
//                                    after /video-upload/presign; 202 {jobId}
//   GET  /summarize/:jobId/result?format=md|json
//
// Progress flows through the shared /job/:jobId machinery: mode "summarize",
// stages[] keyed probe/audio/frames/vision/synthesis/render. The result JSON
// shape is design/VIDEO_SUMMARY.md §2 (+ §9 deviations).

/** The six pipeline stages, in the order the API reports them. */
export const SUMMARY_STAGE_KEYS = ['probe', 'audio', 'frames', 'vision', 'synthesis', 'render'] as const;
export type SummaryStageKey = (typeof SUMMARY_STAGE_KEYS)[number];

export type SummaryDepth = 'standard' | 'deep';

/** `auto` (the speech's language) or one of the 18 registered locale codes. */
export type SummaryOutputLanguage = string;

export interface SummarizeCapabilities {
  /** SUMMARY_ENABLED and the Ollama daemon answering. */
  enabled: boolean;
  vlmModel: string;
  summaryModel: string;
  deepModel?: string;
  /** Deep synthesis configured AND its daemon answering. */
  deep: boolean;
  /** Tiers allowed to ask for depth "deep" (["pro"] today). */
  deepTiers: string[];
  /** Frame budget per public tier; 0 means the tier cannot summarize. */
  maxFramesByTier: Partial<Record<'anonymous' | 'free' | 'premium' | 'pro', number>>;
  /** "auto" followed by the locale codes. */
  outputLanguages: string[];
}

export interface SummarizeOptions {
  outputLanguage: SummaryOutputLanguage;
  depth: SummaryDepth;
}

export interface SummarizeStartResponse {
  jobId: string;
}

/** `options` the API records on a summary job (GET /job/:id). */
export interface SummaryJobOptions {
  mode?: string;
  outputLanguage?: string;
  /** The EFFECTIVE depth (deep for a non-pro caller is recorded as standard). */
  depth?: SummaryDepth | string;
  maxFrames?: number;
  /** Present only when the request asked for a depth that was downgraded. */
  requestedDepth?: string;
}

export interface SummaryChapter {
  start: number;
  end: number;
  title: string;
  description: string;
}

export interface SummaryOnScreenText {
  text: string;
  firstSeen: number;
}

/** summary.json. Every field is normalised by parseSummary(); none is trusted raw. */
export interface VideoSummary {
  title: string;
  summary: string;
  chapters: SummaryChapter[];
  topics: string[];
  onScreenText: SummaryOnScreenText[];
  visual: string;
  speech: string;
  language: string;
  caveats: string[];
}

/** Error codes the start route answers with (`error` in the JSON body). */
export type SummarizeErrorCode =
  | 'signin_required'
  | 'summary_not_in_plan'
  | 'summary_unavailable'
  | 'unreadable_media'
  | 'no_audio_or_video'
  | 'file_too_large'
  | 'upload_not_found'
  | 'quota_exceeded'
  | 'invalid_request'
  | 'unknown';
