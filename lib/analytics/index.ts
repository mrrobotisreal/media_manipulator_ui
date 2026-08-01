/**
 * MM Analytics — the public surface.
 *
 * Import from `@/lib/analytics` rather than from a submodule. The submodules are
 * implementation detail and one of them (`client.ts`) owns a singleton whose construction
 * order matters.
 *
 * WHAT REPLACED WHAT:
 *
 *   lib/firstPartyAnalytics.ts  → this SDK (batching, outbox, priorities, real context)
 *   lib/analytics.ts            → this SDK (typed catalog instead of 12 bespoke helpers)
 *   lib/mixpanel.ts             → deleted. Mixpanel is removed.
 *   lib/webVitals.ts            → ./webVitals
 *   lib/indexedIdentity.ts      → ./identity (localStorage, synchronous, no IndexedDB race)
 *   lib/gtag.ts                 → ./ga4 (three events, not everything)
 *   lib/studio/telemetry.ts     → `feature_used` via useAnalytics
 *
 * Typical usage:
 *
 *   // In a component
 *   const { track } = useAnalytics();
 *   track(EVENTS.CTA_CLICKED, { cta_id: 'hero_convert', placement: 'home_hero' });
 *
 *   // In a tool subtree
 *   const { track } = useToolAnalytics();   // tool_slug + media_kind are automatic
 *   track(EVENTS.JOB_COMPLETED, { job_id: id, duration_ms: takeJobDuration(id) });
 *
 *   // Outside React (a hook, a module)
 *   import { analytics, EVENTS } from '@/lib/analytics';
 *   analytics.track(EVENTS.UPLOAD_FAILED, { reason: 'network' }, { tool_slug: slug });
 */

export { analytics, AnalyticsClient, SDK_VERSION } from './client';

export {
  EVENTS,
  EVENT_PRIORITY,
  PRIORITY_CRITICAL,
  PRIORITY_HIGH,
  PRIORITY_NORMAL,
  PRIORITY_LOW,
  normalizeMediaKind,
  pageTypeFromPathname,
  safeFileExtension,
  sizeInMb,
} from './events';

export type {
  EventName,
  EventProperties,
  EventPropsMap,
  MediaKind,
  PageType,
  Priority,
  PropertyValue,
  PropsFor,
  Tier,
  TrackOptions,
  // Per-event prop shapes, exported so a helper function in a hook can declare the exact
  // shape it builds rather than falling back to a loose record.
  AuthFailedProps,
  AuthMethod,
  AuthMethodProps,
  ClientErrorProps,
  DownloadCompletedProps,
  DownloadFailedProps,
  DownloadStartedProps,
  FeatureUsedProps,
  FileRejectedProps,
  FileSelectedProps,
  JobCompletedProps,
  JobFailedProps,
  JobStartedProps,
  UploadCompletedProps,
  UploadFailedProps,
  UploadStartedProps,
} from './events';

/**
 * Identity. Exported because non-analytics code genuinely needs these — `authedFetch`
 * puts the session id on every API call, and the presign bodies carry it. Both are
 * synchronous and always return a usable string.
 *
 * These IDs exist regardless of analytics consent: the main API needs them for quota and
 * abuse prevention, a strictly-necessary basis. Consent gates event CAPTURE, not the
 * existence of the identifier.
 */
export { getVisitorId, getTabId, isSelfExcluded } from './identity';
export { getSessionId, getSessionRecord, touchSession, SESSION_IDLE_MS } from './session';
export { forgetIdentity } from './forget';

export { analyticsBaseUrl, analyticsWriteKey } from './baseUrl';
export { setContext, getTier, getToolSlug } from './context';
export type { ContextPatch } from './context';

export {
  markJobStarted,
  peekJobDuration,
  peekJobToolSlug,
  takeJobDuration,
  takeJobTiming,
  forgetJob,
} from './jobTimings';

export { reportError, sanitizeErrorMessage } from './errors';

export { trackUploadStarted } from './uploads';
export type { UploadTracker, UploadTransport } from './uploads';

export { trackFileChoice } from './fileChoice';
export type { FileChoiceOptions } from './fileChoice';

export { useAnalytics } from './useAnalytics';
export type { UseAnalytics } from './useAnalytics';

export { AnalyticsProvider } from './AnalyticsProvider';
export { EngagementTracker } from './engagement';
export {
  ToolAnalyticsProvider,
  useToolAnalytics,
  type ToolAnalyticsValue,
  type ToolViewEntryPoint,
} from './ToolAnalyticsContext';
