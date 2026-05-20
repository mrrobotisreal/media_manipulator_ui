// Types shared by useVideoTranscodeProbe and useStartVideoTranscode.

export type TranscodeUploadPhase =
  | 'idle'
  | 'requesting-url'
  | 'uploading-to-s3'
  | 'probing'
  | 'ready'
  | 'starting'
  | 'processing';

export interface TranscodeUploadTarget {
  uploadUrl: string;
  s3Key: string;
  bucket: string;
  expiresAt: string;
}

export interface TranscodeQualityRung {
  label: string;
  height: number;
  bitrateKbps: number;
  audioBitrateKbps: number;
  selected: boolean;
  enabled: boolean;
  disabledReason?: string;
  premiumOnly?: boolean;
  sourceTooSmall?: boolean;
}

export interface FFProbeStreamInfo {
  index: number;
  codecType: string;
  codecName?: string;
  width?: number;
  height?: number;
  frameRate?: number;
  bitrateBps?: number;
  sampleRate?: string;
  channels?: number;
  duration?: number;
}

export interface TranscodeProbeResponse {
  s3Key: string;
  bucket: string;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  width: number;
  height: number;
  maxQualityLabel: string;
  durationSeconds: number;
  fps: number;
  frameRate?: string;
  hasAudio: boolean;
  videoCodec?: string;
  audioCodec?: string;
  videoBitrateBps?: number;
  audioBitrateBps?: number;
  formatName?: string;
  containerFormat?: string;
  streams?: FFProbeStreamInfo[];
  selectableRungs: TranscodeQualityRung[];
  disabledRungs: TranscodeQualityRung[];
  warnings?: string[];
  sourceTooSmall?: boolean;
}

export type TranscodeProtocol = 'hls' | 'dash';
export type DashCodec = 'av1' | 'vp9';

export interface TranscodeStartRequest {
  s3Key: string;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  protocol: TranscodeProtocol;
  dashCodec?: DashCodec;
  qualityRungs: string[];
  generateCaptions: boolean;
  generateStoryboards: boolean;
  sessionId?: string;
}

export interface TranscodeStartResponse {
  jobId: string;
  probe?: TranscodeProbeResponse;
  selectedRungs?: TranscodeQualityRung[];
  message?: string;
}

export interface TranscodeJobStage {
  key: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'skipped' | 'failed';
  progress: number;
  qualityLabel?: string;
  message?: string;
}

// TranscodeCapabilities mirrors GET /api/video-transcode/capabilities.
export interface TranscodeCapabilities {
  hls: boolean;
  dash: boolean;
  av1Encoders: string[];
  selectedAv1Encoder: string;
  vp9: boolean;
  captions: boolean;
  storyboards: boolean;
  premiumComingSoon: boolean;
}
