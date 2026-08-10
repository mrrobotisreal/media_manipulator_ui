/**
 * The typed event catalog — the TypeScript mirror of the analytics service's
 * `internal/catalog/catalog.go` and of `docs/EVENT_CATALOG.md` in that repo.
 *
 * WHY THIS FILE EXISTS AT ALL. The old tracking code passed event names as inline
 * string literals at ~60 call sites, in at least four different naming styles
 * ('Conversion Completed', 'conversion_completed', 'file_upload', 'web_vitals').
 * Nothing caught a typo, nothing caught a rename, and the server had no idea which
 * names were intentional. Every name in the app now comes from `EVENTS` below, and
 * every property shape is checked at the call site.
 *
 * THE RULE: no inline event-name string literals anywhere in the app. If you are
 * writing a quoted event name outside this file, something has gone wrong.
 *
 * A future eslint rule can enforce it mechanically:
 *
 *   'no-restricted-syntax': [
 *     'error',
 *     {
 *       selector: "CallExpression[callee.property.name='track'] > Literal:first-child",
 *       message: 'Use EVENTS.* from lib/analytics/events.ts, never an inline name.',
 *     },
 *   ]
 *
 * Priorities MUST match the Go registry. They drive flush ordering and outbox
 * eviction here, and the server re-stamps them from its own registry — so a
 * mismatch is not a data bug, but it does mean the client flushes something with
 * the wrong urgency.
 */

import { stripLocalePrefix } from '@/i18n/locales';

/** 0 critical · 1 high · 2 normal · 3 low. Lower is more important. */
export type Priority = 0 | 1 | 2 | 3;

export const PRIORITY_CRITICAL: Priority = 0;
export const PRIORITY_HIGH: Priority = 1;
export const PRIORITY_NORMAL: Priority = 2;
export const PRIORITY_LOW: Priority = 3;

export const EVENTS = {
  // --- Lifecycle ------------------------------------------------------------
  PAGE_VIEW: 'page_view',
  PAGE_LEAVE: 'page_leave',
  SESSION_START: 'session_start',

  // --- Tool funnel — the heart of the product -------------------------------
  TOOL_VIEWED: 'tool_viewed',
  FILE_SELECTED: 'file_selected',
  FILE_REJECTED: 'file_rejected',
  UPLOAD_STARTED: 'upload_started',
  UPLOAD_COMPLETED: 'upload_completed',
  UPLOAD_FAILED: 'upload_failed',
  JOB_STARTED: 'job_started',
  JOB_COMPLETED: 'job_completed',
  JOB_FAILED: 'job_failed',
  RESULT_PREVIEWED: 'result_previewed',
  DOWNLOAD_STARTED: 'download_started',
  DOWNLOAD_COMPLETED: 'download_completed',
  DOWNLOAD_FAILED: 'download_failed',
  TOOL_RESET: 'tool_reset',
  OPTIONS_CHANGED: 'options_changed',

  // --- Auth funnel ----------------------------------------------------------
  AUTH_PROMPT_SHOWN: 'auth_prompt_shown',
  AUTH_MODAL_OPENED: 'auth_modal_opened',
  AUTH_MODAL_CLOSED: 'auth_modal_closed',
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  SIGNIN_COMPLETED: 'signin_completed',
  SIGNOUT: 'signout',
  AUTH_FAILED: 'auth_failed',

  // --- Monetization ---------------------------------------------------------
  PRICING_VIEWED: 'pricing_viewed',
  UPGRADE_CTA_CLICKED: 'upgrade_cta_clicked',
  QUOTA_WARNING_SHOWN: 'quota_warning_shown',
  QUOTA_EXCEEDED_SHOWN: 'quota_exceeded_shown',

  // --- Engagement / content -------------------------------------------------
  CONTENT_READ_PROGRESS: 'content_read_progress',
  CONTENT_READ_COMPLETED: 'content_read_completed',
  CTA_CLICKED: 'cta_clicked',
  FEATURE_USED: 'feature_used',
  SCROLL_DEPTH: 'scroll_depth',

  // --- Content Studio (Darkroom) --------------------------------------------
  // First-class `studio_*` events per ADR ws/0003 — the editor no longer
  // overloads FEATURE_USED. Server-side render telemetry (`studio_render_*`)
  // is emitted by the API and lives only in the Go catalogs, like `server_*`.
  STUDIO_PROJECT_CREATED: 'studio_project_created',
  STUDIO_PROJECT_OPENED: 'studio_project_opened',
  STUDIO_PROJECT_CLOSED: 'studio_project_closed',
  STUDIO_MEDIA_IMPORTED: 'studio_media_imported',
  STUDIO_DERIVE_USED: 'studio_derive_used',
  STUDIO_CAPTIONS_GENERATED: 'studio_captions_generated',
  STUDIO_EXPORT_STARTED: 'studio_export_started',
  STUDIO_EXPORT_COMPLETED: 'studio_export_completed',
  STUDIO_EXPORT_FAILED: 'studio_export_failed',
  STUDIO_PUBLISH_REQUESTED: 'studio_publish_requested',
  STUDIO_RECOVERY_OFFERED: 'studio_recovery_offered',
  STUDIO_RECOVERY_ACCEPTED: 'studio_recovery_accepted',
  STUDIO_SAVE_CONFLICT: 'studio_save_conflict',
  STUDIO_VERSION_RESTORED: 'studio_version_restored',
  STUDIO_EDIT_SUMMARY: 'studio_edit_summary',
  STUDIO_PERF_SAMPLE: 'studio_perf_sample',

  // --- Quality --------------------------------------------------------------
  CLIENT_ERROR: 'client_error',
  WEB_VITAL: 'web_vital',
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

/**
 * Priority per event. Must match `internal/catalog/catalog.go`.
 *
 * `Record<EventName, Priority>` rather than a partial map on purpose: adding an
 * event to EVENTS without giving it a priority is then a compile error, not a
 * silent default.
 */
export const EVENT_PRIORITY: Record<EventName, Priority> = {
  // Lifecycle
  page_view: PRIORITY_NORMAL,
  page_leave: PRIORITY_HIGH,
  session_start: PRIORITY_NORMAL,

  // Tool funnel
  tool_viewed: PRIORITY_HIGH,
  file_selected: PRIORITY_HIGH,
  file_rejected: PRIORITY_HIGH,
  upload_started: PRIORITY_HIGH,
  upload_completed: PRIORITY_HIGH,
  upload_failed: PRIORITY_CRITICAL,
  job_started: PRIORITY_CRITICAL,
  job_completed: PRIORITY_CRITICAL,
  job_failed: PRIORITY_CRITICAL,
  result_previewed: PRIORITY_NORMAL,
  download_started: PRIORITY_CRITICAL,
  download_completed: PRIORITY_CRITICAL,
  download_failed: PRIORITY_CRITICAL,
  tool_reset: PRIORITY_NORMAL,
  options_changed: PRIORITY_LOW,

  // Auth
  auth_prompt_shown: PRIORITY_HIGH,
  auth_modal_opened: PRIORITY_NORMAL,
  auth_modal_closed: PRIORITY_NORMAL,
  signup_started: PRIORITY_HIGH,
  signup_completed: PRIORITY_CRITICAL,
  signin_completed: PRIORITY_HIGH,
  signout: PRIORITY_NORMAL,
  auth_failed: PRIORITY_HIGH,

  // Monetization
  pricing_viewed: PRIORITY_HIGH,
  upgrade_cta_clicked: PRIORITY_CRITICAL,
  quota_warning_shown: PRIORITY_HIGH,
  quota_exceeded_shown: PRIORITY_CRITICAL,

  // Engagement
  content_read_progress: PRIORITY_LOW,
  content_read_completed: PRIORITY_NORMAL,
  cta_clicked: PRIORITY_HIGH,
  feature_used: PRIORITY_NORMAL,
  scroll_depth: PRIORITY_LOW,

  // Content Studio (Darkroom)
  studio_project_created: PRIORITY_HIGH,
  studio_project_opened: PRIORITY_HIGH,
  studio_project_closed: PRIORITY_HIGH,
  studio_media_imported: PRIORITY_HIGH,
  studio_derive_used: PRIORITY_NORMAL,
  studio_captions_generated: PRIORITY_NORMAL,
  studio_export_started: PRIORITY_CRITICAL,
  studio_export_completed: PRIORITY_CRITICAL,
  studio_export_failed: PRIORITY_CRITICAL,
  studio_publish_requested: PRIORITY_CRITICAL,
  studio_recovery_offered: PRIORITY_HIGH,
  studio_recovery_accepted: PRIORITY_HIGH,
  studio_save_conflict: PRIORITY_HIGH,
  studio_version_restored: PRIORITY_NORMAL,
  // High, not normal: a summary carries ~2 minutes of edit telemetry and is
  // frequently emitted at page teardown, where anything slower may never flush.
  studio_edit_summary: PRIORITY_HIGH,
  studio_perf_sample: PRIORITY_LOW,

  // Quality
  client_error: PRIORITY_HIGH,
  web_vital: PRIORITY_LOW,
};

/** Media kinds the server accepts. `pdf` is normalized to `document` server-side. */
export type MediaKind = 'image' | 'video' | 'audio' | 'document' | 'unknown';

/** Route families. Derived from the pathname; see `pageTypeFromPathname`. */
export type PageType =
  | 'tool'
  | 'home'
  | 'pricing'
  | 'blog'
  | 'tutorial'
  | 'about'
  | 'how_it_works'
  | 'account'
  | 'legal'
  | 'other';

export type Tier = 'anonymous' | 'free' | 'premium';

/**
 * Values a property may hold. Deliberately narrow — no functions, no Dates, no
 * class instances — because everything here has to survive `JSON.stringify` into
 * localStorage and back out again on outbox recovery.
 */
export type PropertyValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | PropertyValue[]
  | { [key: string]: PropertyValue };

export type EventProperties = Record<string, PropertyValue>;

/* ---------------------------------------------------------------------------
 * Per-event property shapes.
 *
 * Required members are the ones an event is meaningless without: a job event with
 * no job_id cannot be correlated with the API, and a client_error with no message
 * cannot be triaged. Everything else is optional so a call site can send what it
 * actually knows instead of inventing filler.
 * ------------------------------------------------------------------------- */

export interface PageViewProps {
  page_title?: string;
  is_initial?: boolean;
}

export interface PageLeaveProps {
  /** Visible AND focused AND recently interacted-with. The engagement number. */
  active_ms: number;
  visible_ms: number;
  duration_ms: number;
  max_scroll_pct: number;
}

export interface SessionStartProps {
  entry_pathname?: string;
  /** The client's guess; the server decides authoritatively on session close. */
  is_first_session_guess?: boolean;
}

export interface ToolViewedProps {
  entry_point?: 'tool_page' | 'homepage' | 'embedded' | 'other';
}

export interface FileSelectedProps {
  /** Safe extension ONLY. Never a filename — see `safeFileExtension`. */
  file_extension: string;
  size_bytes: number;
  file_size_mb?: number;
  media_kind?: MediaKind;
  source?: 'picker' | 'drop' | 'paste';
}

export interface FileRejectedProps {
  reason: string;
  file_extension?: string;
  size_bytes?: number;
  limit_bytes?: number;
}

export interface UploadStartedProps {
  size_bytes?: number;
  transport?: 'post' | 'presigned_put';
}

export interface UploadCompletedProps extends UploadStartedProps {
  duration_ms?: number;
}

export interface UploadFailedProps {
  reason: string;
  status?: number;
  size_bytes?: number;
  duration_ms?: number;
  transport?: 'post' | 'presigned_put';
}

export interface JobStartedProps {
  job_id: string;
  /** A stable hash of the option set, so popular configurations are countable. */
  options_hash?: string;
  target_format?: string;
  source_format?: string;
}

export interface JobCompletedProps {
  job_id: string;
  /** From lib/analytics/jobTimings, never from component state. */
  duration_ms?: number;
  output_bytes?: number;
  output_format?: string;
}

export interface JobFailedProps {
  job_id: string;
  duration_ms?: number;
  reason?: string;
  stage?: string;
}

export interface ResultPreviewedProps {
  job_id?: string;
  preview_kind?: 'image' | 'video' | 'audio' | 'text' | 'other';
}

export interface DownloadStartedProps {
  job_id?: string;
  output_format?: string;
  size_bytes?: number;
}

export interface DownloadCompletedProps extends DownloadStartedProps {
  duration_ms?: number;
}

export interface DownloadFailedProps {
  job_id?: string;
  reason: string;
  status?: number;
}

export interface ToolResetProps {
  /** What preceded the reset. A retry after failure means something very different from a fresh start after a download. */
  after?: 'success' | 'failure' | 'idle';
}

export interface OptionsChangedProps {
  option: string;
  value?: PropertyValue;
}

export type AuthMethod = 'google' | 'email' | 'other';

export interface AuthPromptShownProps {
  source: string;
}

export interface AuthModalOpenedProps {
  source?: string;
  mode?: 'signin' | 'signup';
}

export interface AuthModalClosedProps {
  /** Whether it closed because auth succeeded, or because it was abandoned. */
  completed: boolean;
  mode?: 'signin' | 'signup';
}

export interface AuthMethodProps {
  method: AuthMethod;
}

export interface AuthFailedProps {
  method: AuthMethod;
  stage?: string;
  reason?: string;
}

export interface PricingViewedProps {
  placement?: string;
}

export interface UpgradeCTAClickedProps {
  placement: string;
  cta_id?: string;
  from_tier?: Tier;
}

export interface QuotaWarningShownProps {
  limit?: number;
  remaining?: number;
  scope?: string;
}

export interface QuotaExceededShownProps {
  limit?: number;
  scope?: string;
}

export interface ContentReadProgressProps {
  pct: 25 | 50 | 75;
  slug?: string;
  content_type?: 'blog' | 'tutorial';
}

export interface ContentReadCompletedProps {
  slug?: string;
  content_type?: 'blog' | 'tutorial';
  active_ms?: number;
}

export interface CTAClickedProps {
  cta_id: string;
  placement?: string;
  href?: string;
}

export interface FeatureUsedProps {
  feature: string;
  action: string;
  value?: PropertyValue;
}

export interface ScrollDepthProps {
  pct: 25 | 50 | 75 | 100;
}

/* ---------------------------------------------------------------------------
 * Content Studio (Darkroom) — ADR ws/0003.
 *
 * Studio props are camelCase (matching the editor's EDL vocabulary rather than
 * the wire funnel's snake_case) and are WITHOUT EXCEPTION enums or buckets from
 * `lib/analytics/buckets.ts`. Raw counts, filenames, project names, and caption
 * text are forbidden. `host` says which surface the editor ran on — the MM site
 * or CreaTV's embedded Darkroom.
 * ------------------------------------------------------------------------- */

export type StudioHost = 'mm' | 'creatv';

/** Media kind vocabulary for the media bin (narrower than MediaKind — no documents). */
export type StudioImportKind = 'video' | 'audio' | 'image' | 'other';

export interface StudioHostProp {
  host?: StudioHost;
}

export type StudioProjectCreatedProps = StudioHostProp;

export type StudioProjectOpenedProps = StudioHostProp;

export interface StudioProjectClosedProps extends StudioHostProp {
  /** Timeline duration bucket, NOT wall-clock (that is sessionSecondsBucket on the edit summary). */
  durationBucket: string;
  clipCountBucket: string;
  trackCountBucket: string;
}

export interface StudioMediaImportedProps extends StudioHostProp {
  kind: StudioImportKind;
  sizeBucket: string;
  /** Size of the import gesture this file arrived in (multi-file drop → one bucket on each). */
  batchBucket: string;
}

export interface StudioDeriveUsedProps extends StudioHostProp {
  /** Server derive operation — a closed vocabulary ('voice_clean', 'split_vocals', …). */
  op: string;
}

export interface StudioCaptionsGeneratedProps extends StudioHostProp {
  cueCountBucket: string;
}

export interface StudioExportStartedProps extends StudioHostProp {
  preset: 'low' | 'medium' | 'high';
  format: 'mp4';
  /** Project canvas, e.g. '1920x1080'. Bounded by the resolution picker's options. */
  resolution: string;
}

export interface StudioExportCompletedProps extends StudioExportStartedProps {
  /** Client-observed render seconds / timeline seconds. */
  durationRatioBucket?: string;
}

export interface StudioExportFailedProps extends StudioExportStartedProps {
  durationRatioBucket?: string;
}

export interface StudioPublishRequestedProps extends StudioHostProp {
  /** Always true today — publish only exists inside the CreaTV embed. */
  embed: boolean;
}

export type StudioRecoveryOfferedProps = StudioHostProp;
export type StudioRecoveryAcceptedProps = StudioHostProp;
export type StudioSaveConflictProps = StudioHostProp;
export type StudioVersionRestoredProps = StudioHostProp;

/**
 * The session-aggregated edit summary (ADR ws/0003 class 2).
 *
 * Every value is a countBucket STRING, not a number, and counters sit at zero
 * until their feature ships (parts 14–21) — the taxonomy is complete now so
 * later parts only add increment calls. Built exclusively by
 * `lib/studio/telemetry.ts`; nothing else should construct one.
 */
export interface StudioEditSummaryProps extends StudioHostProp {
  splits?: string;
  trimsRoll?: string;
  trimsSlip?: string;
  trimsSlide?: string;
  trimsRipple?: string;
  transitionsAdded?: string;
  /** Per-type breakdown, bucketed values keyed by transition type. */
  transitionsByType?: Record<string, string>;
  keyframesAdded?: string;
  keyframesByProperty?: Record<string, string>;
  effectsAdded?: string;
  effectsByType?: Record<string, string>;
  titlesAdded?: string;
  speedChanges?: string;
  markersAdded?: string;
  mixerAdjustments?: string;
  toolSwitches?: string;
  shortcutInvocations?: string;
  uiInvocations?: string;
  undoCount?: string;
  redoCount?: string;
  sessionSecondsBucket: string;
}

/** Periodic editor performance sample (ADR ws/0003 class 3). Buckets only. */
export interface StudioPerfSampleProps extends StudioHostProp {
  fpsBucket?: string;
  droppedFrameRatioBucket?: string;
  seekLatencyP95Bucket?: string;
  saveRttBucket?: string;
  webglFallback?: boolean;
  /** Present on at most one sample per editor session. */
  ttiMsBucket?: string;
  /** Preview render quality in effect at flush ('full' | 'half' | 'quarter'), part 11. */
  qualityLevel?: string;
  /** Bucketed count of auto-degrade step-downs in the window, part 11. */
  degradeActivations?: string;
}

export interface ClientErrorProps {
  message: string;
  /** Hash of message+stack, used to dedupe an error loop down to one event. */
  stack_hash?: string;
  source?: 'window' | 'promise' | 'react' | 'manual';
  stage?: string;
  error_type?: string;
}

export interface WebVitalProps {
  metric: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB';
  value: number;
  rating?: string;
  navigation_type?: string;
  [key: string]: PropertyValue;
}

/** The name → props mapping. */
export interface EventPropsMap {
  page_view: PageViewProps;
  page_leave: PageLeaveProps;
  session_start: SessionStartProps;

  tool_viewed: ToolViewedProps;
  file_selected: FileSelectedProps;
  file_rejected: FileRejectedProps;
  upload_started: UploadStartedProps;
  upload_completed: UploadCompletedProps;
  upload_failed: UploadFailedProps;
  job_started: JobStartedProps;
  job_completed: JobCompletedProps;
  job_failed: JobFailedProps;
  result_previewed: ResultPreviewedProps;
  download_started: DownloadStartedProps;
  download_completed: DownloadCompletedProps;
  download_failed: DownloadFailedProps;
  tool_reset: ToolResetProps;
  options_changed: OptionsChangedProps;

  auth_prompt_shown: AuthPromptShownProps;
  auth_modal_opened: AuthModalOpenedProps;
  auth_modal_closed: AuthModalClosedProps;
  signup_started: AuthMethodProps;
  signup_completed: AuthMethodProps;
  signin_completed: AuthMethodProps;
  signout: EventProperties;
  auth_failed: AuthFailedProps;

  pricing_viewed: PricingViewedProps;
  upgrade_cta_clicked: UpgradeCTAClickedProps;
  quota_warning_shown: QuotaWarningShownProps;
  quota_exceeded_shown: QuotaExceededShownProps;

  content_read_progress: ContentReadProgressProps;
  content_read_completed: ContentReadCompletedProps;
  cta_clicked: CTAClickedProps;
  feature_used: FeatureUsedProps;
  scroll_depth: ScrollDepthProps;

  studio_project_created: StudioProjectCreatedProps;
  studio_project_opened: StudioProjectOpenedProps;
  studio_project_closed: StudioProjectClosedProps;
  studio_media_imported: StudioMediaImportedProps;
  studio_derive_used: StudioDeriveUsedProps;
  studio_captions_generated: StudioCaptionsGeneratedProps;
  studio_export_started: StudioExportStartedProps;
  studio_export_completed: StudioExportCompletedProps;
  studio_export_failed: StudioExportFailedProps;
  studio_publish_requested: StudioPublishRequestedProps;
  studio_recovery_offered: StudioRecoveryOfferedProps;
  studio_recovery_accepted: StudioRecoveryAcceptedProps;
  studio_save_conflict: StudioSaveConflictProps;
  studio_version_restored: StudioVersionRestoredProps;
  studio_edit_summary: StudioEditSummaryProps;
  studio_perf_sample: StudioPerfSampleProps;

  client_error: ClientErrorProps;
  web_vital: WebVitalProps;
}

/** Props type for a given event name. */
export type PropsFor<E extends EventName> = E extends keyof EventPropsMap
  ? EventPropsMap[E]
  : EventProperties;

/**
 * Per-event context overrides. Anything here belongs to the CONTEXT block on the
 * wire, not to properties — the server has typed columns for these, and putting
 * them in properties would bury them in jsonb where no index reaches them.
 */
export interface TrackOptions {
  tool_slug?: string | null;
  media_kind?: MediaKind;
  job_id?: string;
  feature?: string;
  /** Overrides the derived page_type. Rarely needed. */
  page_type?: PageType;
}

/**
 * Return a lowercase file extension that is safe to send.
 *
 * NEVER returns the full file name. Filenames are personal data on a media site —
 * "Q3 layoffs draft.docx", "passport scan.jpg" — and there is no analytical
 * question that the extension does not answer just as well.
 *
 * Ported unchanged from the old `lib/analytics.ts` because the logic was correct:
 * strip to alphanumerics, cap the length to keep cardinality bounded, and fall
 * back to 'unknown' rather than to something guessable.
 */
export function safeFileExtension(fileName: string): string {
  if (!fileName) return 'unknown';
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1 || lastDot === fileName.length - 1) return 'unknown';
  const ext = fileName
    .slice(lastDot + 1)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  if (!ext) return 'unknown';
  return ext.slice(0, 12);
}

/** Bytes → MB, two decimals. Kept because several dashboards want the MB figure. */
export function sizeInMb(bytes: number): number {
  return Math.round((bytes / 1024 / 1024) * 100) / 100;
}

/**
 * Normalize whatever a tool calls its media kind onto the server vocabulary.
 *
 * `pdf → document` is the important one. The analytics schema's CHECK constraint
 * accepts `document`, not `pdf`, and a mismatch used to poison the ingest queue.
 * The server normalizes too — this is belt and braces at the source.
 */
export function normalizeMediaKind(kind: string | null | undefined): MediaKind | undefined {
  if (!kind) return undefined;
  switch (kind.toLowerCase().trim()) {
    case 'image':
    case 'img':
    case 'photo':
      return 'image';
    case 'video':
      return 'video';
    case 'audio':
    case 'sound':
      return 'audio';
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'document':
      return 'document';
    default:
      return 'unknown';
  }
}

/**
 * Derive the route family from a pathname.
 *
 * Order matters: the most specific prefixes first, and `/` last because it would
 * otherwise match everything. `/embed` and `/dr` are absent deliberately — those
 * surfaces never load the SDK at all (see app/providers.tsx), so a page_type for
 * them would be dead code that implies otherwise.
 */
export function pageTypeFromPathname(pathname: string): PageType {
  if (!pathname) return 'other';
  // Locale-prefixed URLs (/es/tools/…, /ru/pricing) classify identically to
  // their unprefixed twins: page_type answers "which surface", and the locale
  // already rides on `pathname`/`url` in the same context block.
  const path = stripLocalePrefix(pathname.toLowerCase());
  if (path.startsWith('/tools')) return 'tool';
  if (path.startsWith('/pricing')) return 'pricing';
  if (path.startsWith('/blog')) return 'blog';
  if (path.startsWith('/tutorials') || path.startsWith('/tutorial')) return 'tutorial';
  if (path.startsWith('/how-it-works')) return 'how_it_works';
  if (path.startsWith('/about')) return 'about';
  if (path.startsWith('/account')) return 'account';
  if (
    path.startsWith('/privacy-policy') ||
    path.startsWith('/terms') ||
    path.startsWith('/cookie') ||
    path.startsWith('/dmca') ||
    path.startsWith('/legal')
  ) {
    return 'legal';
  }
  if (path === '/' || path === '') return 'home';
  return 'other';
}
