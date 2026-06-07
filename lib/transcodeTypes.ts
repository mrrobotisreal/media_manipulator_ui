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
// BundleFormat picks the archive wrapping. targz is the default (smaller for
// text-heavy playlists and cross-platform); zip is friendlier for Windows
// users without 7-Zip handy.
export type BundleFormat = 'targz' | 'zip';

export interface TranscodeStartRequest {
  s3Key: string;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  protocol: TranscodeProtocol;
  dashCodec?: DashCodec;
  qualityRungs: string[];
  generateCaptions: boolean;
  /** BCP-47 codes for additional translated subtitle tracks (max 3). */
  captionLanguages?: string[];
  generateStoryboards: boolean;
  /** Archive format for the result download. Defaults to 'targz' if omitted. */
  bundleFormat?: BundleFormat;
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

// SupportedCaptionLanguage mirrors the catalog entries returned by the
// /api/video-transcode/capabilities endpoint. The UI uses these to populate
// the additional-translations picker.
export interface SupportedCaptionLanguage {
  code: string;
  displayName: string;
  localDisplayName: string;
}

// TranscodeCapabilities mirrors GET /api/video-transcode/capabilities.
export interface TranscodeCapabilities {
  hls: boolean;
  dash: boolean;
  av1Encoders: string[];
  selectedAv1Encoder: string;
  vp9: boolean;
  captions: boolean;
  captionTranslation: boolean;
  captionLanguages: SupportedCaptionLanguage[];
  maxAdditionalCaptionLangs: number;
  storyboards: boolean;
  premiumComingSoon: boolean;
}

// CAPTION_LANGUAGE_FALLBACK is a hard-coded mirror of the backend catalog so
// the picker still renders if the capabilities request hasn't returned yet.
// Keep in sync with services.SupportedCaptionLanguages() on the API side.
export const CAPTION_LANGUAGE_FALLBACK: SupportedCaptionLanguage[] = [
  { code: 'en', displayName: 'English', localDisplayName: 'English' },
  { code: 'es', displayName: 'Spanish', localDisplayName: 'Español' },
  { code: 'pt-BR', displayName: 'Portuguese (Brazil)', localDisplayName: 'Português (Brasil)' },
  { code: 'pt-PT', displayName: 'Portuguese (Portugal)', localDisplayName: 'Português (Portugal)' },
  { code: 'fr', displayName: 'French', localDisplayName: 'Français' },
  { code: 'de', displayName: 'German', localDisplayName: 'Deutsch' },
  { code: 'it', displayName: 'Italian', localDisplayName: 'Italiano' },
  { code: 'nl', displayName: 'Dutch', localDisplayName: 'Nederlands' },
  { code: 'sv', displayName: 'Swedish', localDisplayName: 'Svenska' },
  { code: 'fi', displayName: 'Finnish', localDisplayName: 'Suomi' },
  { code: 'no', displayName: 'Norwegian', localDisplayName: 'Norsk' },
  { code: 'da', displayName: 'Danish', localDisplayName: 'Dansk' },
  { code: 'pl', displayName: 'Polish', localDisplayName: 'Polski' },
  { code: 'cs', displayName: 'Czech', localDisplayName: 'Čeština' },
  { code: 'ru', displayName: 'Russian', localDisplayName: 'Русский' },
  { code: 'uk', displayName: 'Ukrainian', localDisplayName: 'Українська' },
  { code: 'tr', displayName: 'Turkish', localDisplayName: 'Türkçe' },
  { code: 'el', displayName: 'Greek', localDisplayName: 'Ελληνικά' },
  { code: 'ar', displayName: 'Arabic', localDisplayName: 'العربية' },
  { code: 'he', displayName: 'Hebrew', localDisplayName: 'עברית' },
  { code: 'fa', displayName: 'Persian (Farsi)', localDisplayName: 'فارسی' },
  { code: 'hi', displayName: 'Hindi', localDisplayName: 'हिन्दी' },
  { code: 'bn', displayName: 'Bengali', localDisplayName: 'বাংলা' },
  { code: 'ur', displayName: 'Urdu', localDisplayName: 'اردو' },
  { code: 'ta', displayName: 'Tamil', localDisplayName: 'தமிழ்' },
  { code: 'th', displayName: 'Thai', localDisplayName: 'ไทย' },
  { code: 'vi', displayName: 'Vietnamese', localDisplayName: 'Tiếng Việt' },
  { code: 'id', displayName: 'Indonesian', localDisplayName: 'Bahasa Indonesia' },
  { code: 'ms', displayName: 'Malay', localDisplayName: 'Bahasa Melayu' },
  { code: 'tl', displayName: 'Filipino (Tagalog)', localDisplayName: 'Filipino' },
  { code: 'ja', displayName: 'Japanese', localDisplayName: '日本語' },
  { code: 'ko', displayName: 'Korean', localDisplayName: '한국어' },
  { code: 'zh-Hans', displayName: 'Mandarin Chinese (Simplified)', localDisplayName: '简体中文' },
  { code: 'zh-Hant', displayName: 'Mandarin Chinese (Traditional)', localDisplayName: '繁體中文' },
  { code: 'yue', displayName: 'Cantonese', localDisplayName: '粵語' },
  { code: 'ro', displayName: 'Romanian', localDisplayName: 'Română' },
  { code: 'hu', displayName: 'Hungarian', localDisplayName: 'Magyar' },
];
