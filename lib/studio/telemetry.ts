/**
 * Content Studio session telemetry — the edit-summary aggregator and the
 * performance sampler (ADR ws/0003 classes 2 and 3).
 *
 * WHY AGGREGATE. A per-action discrete event for every split/trim/undo would
 * multiply ingestion volume enormously, and session aggregates answer the
 * questions actually asked of this data (most/least-used features, power-user
 * behaviour). So every editing action calls `editSummary.increment(...)`, and
 * the counter map is flushed as ONE `studio_edit_summary` event every ~2
 * minutes, on pagehide, and on editor unmount.
 *
 * THE STANDING RULE (roadmap rule 11): from part 10 on, EVERY new user action
 * added to the editor must increment this aggregator. Counters for features
 * that have not shipped yet (transitions, keyframes, titles, speed, markers,
 * mixer — parts 14–21) exist now and simply stay at zero; those parts only add
 * increment calls, never new plumbing.
 *
 * CONSENT. Everything funnels through `analytics.track`, whose consent gate
 * already handles all three states (granted → send, unset → memory-only
 * buffer, denied → drop). Nothing here duplicates that gate, and nothing here
 * ever throws into React.
 *
 * PRIVACY. Counters are bucketed before they leave (catalog law: no raw
 * counts), and nothing content-derived is ever recorded — no clip names, no
 * asset ids, no caption text.
 */

import { analytics, EVENTS } from '@/lib/analytics';
import {
  countBucket,
  droppedFrameRatioBucket,
  fpsBucket,
  latencyMsBucket,
  ratioBucket,
  sessionSecondsBucket,
  ttiMsBucket,
} from '@/lib/analytics/buckets';
import type { StudioEditSummaryProps, StudioHost, StudioPerfSampleProps } from '@/lib/analytics';
import { getActiveStudioBackend } from './studioBackend';

/** Flush cadence for both the edit summary and the perf sample. */
export const TELEMETRY_FLUSH_INTERVAL_MS = 120_000;

/**
 * The full counter taxonomy, shipped now (ADR ws/0003). Names match the
 * `studio_edit_summary` prop names 1:1 — the flush buckets each nonzero
 * counter under exactly this key.
 */
export type StudioEditCounter =
  | 'splits'
  | 'trimsRoll'
  | 'trimsSlip'
  | 'trimsSlide'
  | 'trimsRipple'
  | 'transitionsAdded'
  | 'keyframesAdded'
  | 'effectsAdded'
  | 'titlesAdded'
  | 'speedChanges'
  | 'markersAdded'
  | 'mixerAdjustments'
  | 'toolSwitches'
  | 'shortcutInvocations'
  | 'uiInvocations'
  | 'undoCount'
  | 'redoCount';

/** Counters that also keep a per-subkey breakdown map. */
const SUBKEY_MAPS: Partial<Record<StudioEditCounter, 'transitionsByType' | 'keyframesByProperty' | 'effectsByType'>> = {
  transitionsAdded: 'transitionsByType',
  keyframesAdded: 'keyframesByProperty',
  effectsAdded: 'effectsByType',
};

/** Cardinality guard for subkey maps: past this many distinct keys, overflow into 'other'. */
const MAX_SUBKEYS = 12;

/** Rolling perf window cap. At one sample per second this is ~10 minutes; older samples age out. */
const MAX_PERF_SAMPLES = 600;

interface PerfWindow {
  fps: number[];
  droppedFrameRatio: number[];
  seekLatencyMs: number[];
  saveRttMs: number[];
  webglFallback: boolean;
}

function emptyPerfWindow(): PerfWindow {
  return { fps: [], droppedFrameRatio: [], seekLatencyMs: [], saveRttMs: [], webglFallback: false };
}

// --- Module state -----------------------------------------------------------

let counters = new Map<StudioEditCounter, number>();
let subCounters = new Map<string, Map<string, number>>();
let perfWindow = emptyPerfWindow();
let ttiMs: number | null = null;
let ttiFlushed = false;

let active = false;
let sessionStartedAt = 0;
let flushTimer: ReturnType<typeof setInterval> | null = null;

/** Which surface the editor is running on. The backend adapter already knows. */
export function studioHost(): StudioHost {
  try {
    return getActiveStudioBackend().ecosystem === 'creatv' ? 'creatv' : 'mm';
  } catch {
    return 'mm';
  }
}

/**
 * Restrict a subkey to a short, lowercase slug so a caller can never leak
 * free text (or explode cardinality) through the breakdown maps.
 */
function sanitizeSubkey(raw: string): string {
  const slug = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 24);
  return slug || 'other';
}

function ensureSession(): void {
  if (active || typeof window === 'undefined') return;
  active = true;
  sessionStartedAt = Date.now();
  flushTimer = setInterval(flushStudioTelemetry, TELEMETRY_FLUSH_INTERVAL_MS);
  window.addEventListener('pagehide', onPageHide);
}

function onPageHide(): void {
  // At teardown there is no second chance: flush the aggregates into the
  // queue, then push the queue out synchronously (beacon/keepalive). The
  // client's own pagehide flush may already have run — listener order isn't
  // guaranteed to favour us — so this explicit flushSync is what delivers.
  flushStudioTelemetry();
  analytics.flushSync();
}

// --- Public API -------------------------------------------------------------

export const editSummary = {
  /**
   * Count one user action. `subkey` feeds the counter's breakdown map when it
   * has one (e.g. increment('transitionsAdded', 'crossfade')).
   */
  increment(counter: StudioEditCounter, subkey?: string): void {
    try {
      ensureSession();
      counters.set(counter, (counters.get(counter) ?? 0) + 1);
      const mapName = SUBKEY_MAPS[counter];
      if (mapName && subkey) {
        let map = subCounters.get(mapName);
        if (!map) {
          map = new Map();
          subCounters.set(mapName, map);
        }
        let key = sanitizeSubkey(subkey);
        if (!map.has(key) && map.size >= MAX_SUBKEYS) key = 'other';
        map.set(key, (map.get(key) ?? 0) + 1);
      }
    } catch {
      // Telemetry must never break editing.
    }
  },
};

export const perf = {
  /** Record one performance observation into the rolling window. */
  sample(input: {
    fps?: number;
    droppedFrameRatio?: number;
    seekLatencyMs?: number;
    saveRttMs?: number;
    webglFallback?: boolean;
  }): void {
    try {
      ensureSession();
      const push = (arr: number[], value: number | undefined) => {
        if (typeof value !== 'number' || !Number.isFinite(value)) return;
        arr.push(value);
        if (arr.length > MAX_PERF_SAMPLES) arr.shift();
      };
      push(perfWindow.fps, input.fps);
      push(perfWindow.droppedFrameRatio, input.droppedFrameRatio);
      push(perfWindow.seekLatencyMs, input.seekLatencyMs);
      push(perfWindow.saveRttMs, input.saveRttMs);
      if (input.webglFallback) perfWindow.webglFallback = true;
    } catch {
      // ignore
    }
  },
};

/** Record editor time-to-interactive. First call per session wins. */
export function markTti(ms: number): void {
  try {
    if (ttiMs !== null || ttiFlushed || !Number.isFinite(ms) || ms < 0) return;
    ensureSession();
    ttiMs = ms;
  } catch {
    // ignore
  }
}

/**
 * Start a telemetry session for a mounted editor. Returns the stop function
 * for the effect cleanup — stopping flushes whatever accumulated, so closing
 * the editor never loses the tail of a session.
 */
export function startStudioTelemetrySession(): () => void {
  ensureSession();
  return endStudioTelemetrySession;
}

/** Flush and tear the session down. Idempotent. */
export function endStudioTelemetrySession(): void {
  if (!active) return;
  flushStudioTelemetry();
  if (flushTimer) clearInterval(flushTimer);
  flushTimer = null;
  if (typeof window !== 'undefined') window.removeEventListener('pagehide', onPageHide);
  active = false;
  sessionStartedAt = 0;
  ttiMs = null;
  ttiFlushed = false;
}

/**
 * Flush both aggregates now. Exposed for the interval, pagehide, unmount —
 * and tests. Empty aggregates flush nothing: a summary of zeros says only
 * "the tab was open", which the lifecycle events already say.
 */
export function flushStudioTelemetry(): void {
  try {
    flushEditSummary();
    flushPerfSample();
  } catch {
    // ignore
  }
}

function flushEditSummary(): void {
  if (counters.size === 0) return;
  const props: Record<string, string | Record<string, string>> = {
    sessionSecondsBucket: sessionSecondsBucket((Date.now() - sessionStartedAt) / 1000),
    host: studioHost(),
  };
  for (const [counter, count] of counters) {
    if (count > 0) props[counter] = countBucket(count);
  }
  for (const [mapName, map] of subCounters) {
    const out: Record<string, string> = {};
    for (const [key, count] of map) {
      if (count > 0) out[key] = countBucket(count);
    }
    if (Object.keys(out).length > 0) props[mapName] = out;
  }
  counters = new Map();
  subCounters = new Map();
  analytics.track(EVENTS.STUDIO_EDIT_SUMMARY, props as unknown as StudioEditSummaryProps, {
    feature: 'studio',
  });
}

function flushPerfSample(): void {
  const w = perfWindow;
  const hasSamples =
    w.fps.length > 0 || w.droppedFrameRatio.length > 0 || w.seekLatencyMs.length > 0 || w.saveRttMs.length > 0;
  const pendingTti = ttiMs !== null && !ttiFlushed;
  if (!hasSamples && !pendingTti && !w.webglFallback) return;

  const props: StudioPerfSampleProps = { host: studioHost() };
  if (w.fps.length > 0) props.fpsBucket = fpsBucket(percentile(w.fps, 50));
  if (w.droppedFrameRatio.length > 0)
    props.droppedFrameRatioBucket = droppedFrameRatioBucket(percentile(w.droppedFrameRatio, 50));
  if (w.seekLatencyMs.length > 0) props.seekLatencyP95Bucket = latencyMsBucket(percentile(w.seekLatencyMs, 95));
  if (w.saveRttMs.length > 0) props.saveRttBucket = latencyMsBucket(percentile(w.saveRttMs, 95));
  if (w.webglFallback) props.webglFallback = true;
  if (pendingTti && ttiMs !== null) {
    props.ttiMsBucket = ttiMsBucket(ttiMs);
    ttiFlushed = true;
  }
  perfWindow = emptyPerfWindow();
  analytics.track(EVENTS.STUDIO_PERF_SAMPLE, props, { feature: 'studio' });
}

/** Nearest-rank percentile over a copy (sampling order is not sorted order). */
function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[rank];
}

/**
 * Convenience for export telemetry: client-observed render-vs-timeline ratio,
 * or undefined when either side is unusable (a reload mid-render loses the
 * start time; reporting nothing beats reporting a wrong bucket).
 */
export function exportDurationRatioBucket(
  renderMs: number | undefined,
  timelineSeconds: number,
): string | undefined {
  if (typeof renderMs !== 'number' || !Number.isFinite(renderMs) || renderMs < 0) return undefined;
  if (!Number.isFinite(timelineSeconds) || timelineSeconds <= 0) return undefined;
  return ratioBucket(renderMs / 1000 / timelineSeconds);
}

/** For tests. */
export function resetStudioTelemetryForTests(): void {
  endStudioTelemetrySession();
  counters = new Map();
  subCounters = new Map();
  perfWindow = emptyPerfWindow();
  ttiMs = null;
  ttiFlushed = false;
}
