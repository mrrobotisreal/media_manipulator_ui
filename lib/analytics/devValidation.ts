/**
 * Dev-only zod validation of event properties.
 *
 * DEVELOPMENT ONLY — this module must contribute ZERO bytes to the production
 * bundle. It is only ever reached through the dynamic `import('./devTools')` in
 * AnalyticsProvider, which sits behind a literal `process.env.NODE_ENV !==
 * 'production'` check that bundlers dead-code-eliminate. Do not import it from
 * production code paths.
 *
 * WHY VALIDATE AT ALL when the props are already typed: TypeScript checks the
 * call site's *declared* shape, not the runtime value. A `size_bytes` fed from
 * an `any`-typed API response, a NaN from a broken duration calculation, or an
 * unexpected extra key smuggled through a spread all satisfy the compiler and
 * still land malformed in the warehouse. This harness catches them in dev, at
 * the moment of tracking, with the event name attached.
 *
 * THE DRIFT GUARD IS THE MAPPED TYPE. `eventSchemas` is typed
 * `{ [E in keyof EventPropsMap]: z.ZodType<EventPropsMap[E]> }`, so adding an
 * event to EventPropsMap without adding a schema here is a `typecheck` failure
 * — the sync between the TS catalog and this file is enforced by the compiler,
 * not by discipline.
 *
 * HOUSE RULE STILL APPLIES: never throw, never mutate the event, never block
 * capture. Findings are warnings only.
 */

import { z } from 'zod';

import type { AnalyticsClient } from './client';
import { EVENTS, type EventPropsMap, type PropertyValue } from './events';
import type { QueuedEvent, WireContext } from './queue';

/** Recursive schema for the JSON-safe property value union. */
const propertyValue: z.ZodType<PropertyValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.undefined(),
    z.array(propertyValue),
    z.record(propertyValue),
  ]),
);

const mediaKind = z.enum(['image', 'video', 'audio', 'document', 'unknown']);
const tier = z.enum(['anonymous', 'free', 'premium']);
const authMethod = z.enum(['google', 'email', 'other']);
const transport = z.enum(['post', 'presigned_put']);

// Content Studio (part 10). Bucket values are checked as strings, not enums —
// the bucket vocabularies live in lib/analytics/buckets.ts and re-enumerating
// them here would create a second copy to drift.
const studioHostEnum = z.enum(['mm', 'creatv']);
const studioHostProps = z.object({ host: studioHostEnum.optional() }).strict();
const studioExportProps = z
  .object({
    preset: z.enum(['low', 'medium', 'high']),
    format: z.literal('mp4'),
    resolution: z.string(),
    durationRatioBucket: z.string().optional(),
    host: studioHostEnum.optional(),
  })
  .strict();

/**
 * One schema per catalog event.
 *
 * `.strict()` on every closed interface: an unexpected key is exactly what this
 * harness exists to catch (warn, don't drop), and `.passthrough()` would wave
 * it through silently. The two open shapes are `signout` (declared as free-form
 * EventProperties) and `web_vital` (an explicit index signature for
 * metric-specific extras) — those use `record`/`catchall` to mirror their
 * declared openness rather than inventing a stricter contract than the type.
 */
const eventSchemas: { [E in keyof EventPropsMap]: z.ZodType<EventPropsMap[E]> } = {
  page_view: z
    .object({ page_title: z.string().optional(), is_initial: z.boolean().optional() })
    .strict(),
  page_leave: z
    .object({
      active_ms: z.number(),
      visible_ms: z.number(),
      duration_ms: z.number(),
      max_scroll_pct: z.number(),
    })
    .strict(),
  session_start: z
    .object({
      entry_pathname: z.string().optional(),
      is_first_session_guess: z.boolean().optional(),
    })
    .strict(),

  tool_viewed: z
    .object({ entry_point: z.enum(['tool_page', 'homepage', 'embedded', 'other']).optional() })
    .strict(),
  file_selected: z
    .object({
      file_extension: z.string(),
      size_bytes: z.number(),
      file_size_mb: z.number().optional(),
      media_kind: mediaKind.optional(),
      source: z.enum(['picker', 'drop', 'paste']).optional(),
    })
    .strict(),
  file_rejected: z
    .object({
      reason: z.string(),
      file_extension: z.string().optional(),
      size_bytes: z.number().optional(),
      limit_bytes: z.number().optional(),
    })
    .strict(),
  upload_started: z
    .object({ size_bytes: z.number().optional(), transport: transport.optional() })
    .strict(),
  upload_completed: z
    .object({
      size_bytes: z.number().optional(),
      transport: transport.optional(),
      duration_ms: z.number().optional(),
    })
    .strict(),
  upload_failed: z
    .object({
      reason: z.string(),
      status: z.number().optional(),
      size_bytes: z.number().optional(),
      duration_ms: z.number().optional(),
      transport: transport.optional(),
    })
    .strict(),
  job_started: z
    .object({
      job_id: z.string(),
      options_hash: z.string().optional(),
      target_format: z.string().optional(),
      source_format: z.string().optional(),
    })
    .strict(),
  job_completed: z
    .object({
      job_id: z.string(),
      duration_ms: z.number().optional(),
      output_bytes: z.number().optional(),
      output_format: z.string().optional(),
    })
    .strict(),
  job_failed: z
    .object({
      job_id: z.string(),
      duration_ms: z.number().optional(),
      reason: z.string().optional(),
      stage: z.string().optional(),
    })
    .strict(),
  result_previewed: z
    .object({
      job_id: z.string().optional(),
      preview_kind: z.enum(['image', 'video', 'audio', 'text', 'other']).optional(),
    })
    .strict(),
  download_started: z
    .object({
      job_id: z.string().optional(),
      output_format: z.string().optional(),
      size_bytes: z.number().optional(),
    })
    .strict(),
  download_completed: z
    .object({
      job_id: z.string().optional(),
      output_format: z.string().optional(),
      size_bytes: z.number().optional(),
      duration_ms: z.number().optional(),
    })
    .strict(),
  download_failed: z
    .object({
      job_id: z.string().optional(),
      reason: z.string(),
      status: z.number().optional(),
    })
    .strict(),
  tool_reset: z.object({ after: z.enum(['success', 'failure', 'idle']).optional() }).strict(),
  options_changed: z.object({ option: z.string(), value: propertyValue.optional() }).strict(),

  auth_prompt_shown: z.object({ source: z.string() }).strict(),
  auth_modal_opened: z
    .object({ source: z.string().optional(), mode: z.enum(['signin', 'signup']).optional() })
    .strict(),
  auth_modal_closed: z
    .object({ completed: z.boolean(), mode: z.enum(['signin', 'signup']).optional() })
    .strict(),
  signup_started: z.object({ method: authMethod }).strict(),
  signup_completed: z.object({ method: authMethod }).strict(),
  signin_completed: z.object({ method: authMethod }).strict(),
  signout: z.record(propertyValue),
  auth_failed: z
    .object({
      method: authMethod,
      stage: z.string().optional(),
      reason: z.string().optional(),
    })
    .strict(),

  pricing_viewed: z.object({ placement: z.string().optional() }).strict(),
  upgrade_cta_clicked: z
    .object({
      placement: z.string(),
      cta_id: z.string().optional(),
      from_tier: tier.optional(),
    })
    .strict(),
  quota_warning_shown: z
    .object({
      limit: z.number().optional(),
      remaining: z.number().optional(),
      scope: z.string().optional(),
    })
    .strict(),
  quota_exceeded_shown: z
    .object({ limit: z.number().optional(), scope: z.string().optional() })
    .strict(),

  content_read_progress: z
    .object({
      pct: z.union([z.literal(25), z.literal(50), z.literal(75)]),
      slug: z.string().optional(),
      content_type: z.enum(['blog', 'tutorial']).optional(),
    })
    .strict(),
  content_read_completed: z
    .object({
      slug: z.string().optional(),
      content_type: z.enum(['blog', 'tutorial']).optional(),
      active_ms: z.number().optional(),
    })
    .strict(),
  cta_clicked: z
    .object({
      cta_id: z.string(),
      placement: z.string().optional(),
      href: z.string().optional(),
    })
    .strict(),
  feature_used: z
    .object({
      feature: z.string(),
      action: z.string(),
      value: propertyValue.optional(),
    })
    .strict(),
  scroll_depth: z
    .object({ pct: z.union([z.literal(25), z.literal(50), z.literal(75), z.literal(100)]) })
    .strict(),

  studio_project_created: studioHostProps,
  studio_project_opened: studioHostProps,
  studio_project_closed: z
    .object({
      durationBucket: z.string(),
      clipCountBucket: z.string(),
      trackCountBucket: z.string(),
      host: studioHostEnum.optional(),
    })
    .strict(),
  studio_media_imported: z
    .object({
      kind: z.enum(['video', 'audio', 'image', 'other']),
      sizeBucket: z.string(),
      batchBucket: z.string(),
      host: studioHostEnum.optional(),
    })
    .strict(),
  studio_derive_used: z.object({ op: z.string(), host: studioHostEnum.optional() }).strict(),
  studio_captions_generated: z
    .object({ cueCountBucket: z.string(), host: studioHostEnum.optional() })
    .strict(),
  studio_export_started: studioExportProps,
  studio_export_completed: studioExportProps,
  studio_export_failed: studioExportProps,
  studio_publish_requested: z
    .object({ embed: z.boolean(), host: studioHostEnum.optional() })
    .strict(),
  studio_recovery_offered: studioHostProps,
  studio_recovery_accepted: studioHostProps,
  studio_save_conflict: studioHostProps,
  studio_version_restored: studioHostProps,
  studio_edit_summary: z
    .object({
      splits: z.string().optional(),
      trimsRoll: z.string().optional(),
      trimsSlip: z.string().optional(),
      trimsSlide: z.string().optional(),
      trimsRipple: z.string().optional(),
      transitionsAdded: z.string().optional(),
      transitionsByType: z.record(z.string()).optional(),
      keyframesAdded: z.string().optional(),
      keyframesByProperty: z.record(z.string()).optional(),
      effectsAdded: z.string().optional(),
      effectsByType: z.record(z.string()).optional(),
      titlesAdded: z.string().optional(),
      speedChanges: z.string().optional(),
      markersAdded: z.string().optional(),
      mixerAdjustments: z.string().optional(),
      toolSwitches: z.string().optional(),
      shortcutInvocations: z.string().optional(),
      uiInvocations: z.string().optional(),
      undoCount: z.string().optional(),
      redoCount: z.string().optional(),
      sessionSecondsBucket: z.string(),
      host: studioHostEnum.optional(),
    })
    .strict(),
  studio_perf_sample: z
    .object({
      fpsBucket: z.string().optional(),
      droppedFrameRatioBucket: z.string().optional(),
      seekLatencyP95Bucket: z.string().optional(),
      saveRttBucket: z.string().optional(),
      webglFallback: z.boolean().optional(),
      ttiMsBucket: z.string().optional(),
      host: studioHostEnum.optional(),
    })
    .strict(),

  client_error: z
    .object({
      message: z.string(),
      stack_hash: z.string().optional(),
      source: z.enum(['window', 'promise', 'react', 'manual']).optional(),
      stage: z.string().optional(),
      error_type: z.string().optional(),
    })
    .strict(),
  web_vital: z
    .object({
      metric: z.enum(['LCP', 'INP', 'CLS', 'FCP', 'TTFB']),
      value: z.number(),
      rating: z.string().optional(),
      navigation_type: z.string().optional(),
    })
    .catchall(propertyValue),
};

/**
 * Tool-funnel events must carry `tool_slug` — in the event's own context or the
 * batch context. This is the exact instrumentation gap Phase 6C existed to
 * close (the four `panel={}` pages emitted funnel events with no slug at all),
 * so the harness watches for its return.
 */
const TOOL_FUNNEL_EVENTS: ReadonlySet<string> = new Set<string>([
  EVENTS.TOOL_VIEWED,
  EVENTS.FILE_SELECTED,
  EVENTS.FILE_REJECTED,
  EVENTS.UPLOAD_STARTED,
  EVENTS.UPLOAD_COMPLETED,
  EVENTS.UPLOAD_FAILED,
  EVENTS.JOB_STARTED,
  EVENTS.JOB_COMPLETED,
  EVENTS.JOB_FAILED,
  EVENTS.RESULT_PREVIEWED,
  EVENTS.DOWNLOAD_STARTED,
  EVENTS.DOWNLOAD_COMPLETED,
  EVENTS.DOWNLOAD_FAILED,
  EVENTS.TOOL_RESET,
  EVENTS.OPTIONS_CHANGED,
]);

/**
 * The sanitizer denylist, mirrored from the SDK/server scrub rules. Catching
 * PII in DEV — with a warning naming the event — beats the server silently
 * scrubbing it in prod, because the server scrub hides the bug that put it
 * there.
 */
const DENYLIST_KEYS = ['filename', 'file_name', 'email', 'name'] as const;

/**
 * Validate one tracked event. Pure and throw-free: returns human-readable
 * issue strings (empty array = clean). Used by the console warner below AND by
 * the dev inspector, which attaches the same issues to its buffer rows — the
 * validator and the inspector are one harness.
 */
export function validateDevEvent(
  name: string,
  event: QueuedEvent,
  batchContext: WireContext,
): string[] {
  const issues: string[] = [];
  try {
    const schema = (eventSchemas as Record<string, z.ZodType<unknown>>)[name];
    if (schema) {
      const parsed = schema.safeParse(event.properties ?? {});
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const path = issue.path.length > 0 ? issue.path.join('.') : '(props)';
          issues.push(`${path}: ${issue.message}`);
        }
      }
    }
    // Names outside the catalog are NOT flagged here: the server accepts and
    // stores unknown names by design (forward compatibility), and the lint
    // rule already blocks inline literals at the call site.

    // Cross-cutting invariant 1: tool-funnel events need a tool_slug — except on
    // the home page. The homepage converter deliberately provides `slug={null}`
    // (see views/file-converter-app.tsx: a made-up slug would merge its numbers
    // with /tools/image-converter in every per-tool report), so its slug-less
    // funnel is correct-by-design, attributed via page_type and pathname instead.
    if (TOOL_FUNNEL_EVENTS.has(name)) {
      const slug = event.context?.tool_slug ?? batchContext.tool_slug;
      const pageType = event.context?.page_type ?? batchContext.page_type;
      if (!slug && pageType !== 'home') {
        issues.push(
          'tool_slug missing: tool-funnel events must carry tool_slug in event or batch context (thread it via ToolAnalyticsProvider)',
        );
      }
    }

    // Cross-cutting invariant 2: the sanitizer denylist. The server would
    // scrub these in prod; in dev we want the call site fixed instead.
    const props = event.properties ?? {};
    for (const key of Object.keys(props)) {
      const lower = key.toLowerCase();
      if ((DENYLIST_KEYS as readonly string[]).includes(lower)) {
        issues.push(`property key "${key}" is on the PII denylist and will be scrubbed server-side`);
      }
      if (lower === 'path' && typeof props[key] === 'string') {
        issues.push('string-valued "path" property is on the PII denylist (paths contain filenames)');
      }
    }
  } catch {
    // House rule: the harness itself must never throw into the SDK.
  }
  return issues;
}

/**
 * Subscribe to the client and warn (once per event-name + issue-signature per
 * page load) about anything malformed. Deduped so a loop emitting the same
 * broken event cannot flood the console; per page load rather than
 * per-storage-session because a dev iterating on a fix wants the warning back
 * after a reload.
 */
export function initDevValidation(client: AnalyticsClient): () => void {
  const warned = new Set<string>();
  return client.subscribe((name, event) => {
    try {
      const issues = validateDevEvent(name, event, client.debugContext());
      if (issues.length === 0) return;
      const signature = `${name}|${issues.join('|')}`;
      if (warned.has(signature)) return;
      warned.add(signature);
      // One structured warning, never a throw, never a mutation.
      console.warn('[mm-analytics]', name, issues);
    } catch {
      // Never let the harness affect capture.
    }
  });
}
