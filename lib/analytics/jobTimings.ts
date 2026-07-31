/**
 * Job start times, keyed by job id.
 *
 * WHY A MODULE MAP AND NOT COMPONENT STATE. The old code kept a `conversionStartTime` in
 * React state on `file-converter-app.tsx`, which broke in three ways that all show up as
 * missing or wrong durations in the data:
 *
 *   1. A re-render between start and completion could reset it.
 *   2. Only one job could be timed at a time, so a second conversion started while the
 *      first was still running overwrote the first one's start.
 *   3. The component that STARTS a job is often not the component that observes it
 *      finishing — the status poll lives in a hook — so the two had no shared place to
 *      put the number.
 *
 * A module-level Map keyed by the API's own `jobId` fixes all three: it survives
 * renders, it holds many concurrent jobs, and any module can read it.
 *
 * Entries are removed on completion and swept after an hour, so a job that never reports
 * a terminal state cannot leak.
 */

export interface JobTiming {
  startedAt: number;
  toolSlug: string | null;
  mediaKind?: string;
}

/** An hour is comfortably longer than the slowest job (AI video restoration) and short
 *  enough that an abandoned entry does not outlive the tab's usefulness. */
const MAX_AGE_MS = 60 * 60 * 1000;

const timings = new Map<string, JobTiming>();

/** Record the start of a job. */
export function markJobStarted(jobId: string, toolSlug: string | null, mediaKind?: string): void {
  if (!jobId) return;
  sweep();
  timings.set(jobId, { startedAt: Date.now(), toolSlug, mediaKind });
}

/**
 * Read a job's elapsed time WITHOUT consuming the entry.
 *
 * Used by intermediate events (a progress tick, a `result_previewed`) that want the
 * elapsed time but must not stop the clock.
 */
export function peekJobDuration(jobId: string): number | undefined {
  const timing = timings.get(jobId);
  if (!timing) return undefined;
  return Date.now() - timing.startedAt;
}

/**
 * Read and CONSUME a job's timing. Call this on the terminal event.
 *
 * Returns undefined when the job was never marked — which happens legitimately: a page
 * reloaded mid-job loses the in-memory start, and reporting no duration is far better
 * than reporting one measured from the reload.
 */
export function takeJobTiming(jobId: string): JobTiming | undefined {
  if (!jobId) return undefined;
  const timing = timings.get(jobId);
  if (!timing) return undefined;
  timings.delete(jobId);
  return timing;
}

/** Duration in ms for a terminal event, consuming the entry. */
export function takeJobDuration(jobId: string): number | undefined {
  const timing = takeJobTiming(jobId);
  if (!timing) return undefined;
  return Date.now() - timing.startedAt;
}

/** The tool slug a job was started under, without consuming it. */
export function peekJobToolSlug(jobId: string): string | null | undefined {
  return timings.get(jobId)?.toolSlug;
}

export function forgetJob(jobId: string): void {
  timings.delete(jobId);
}

/** Drop entries older than MAX_AGE_MS. Called on every insert, so it needs no timer. */
function sweep(): void {
  if (timings.size === 0) return;
  const cutoff = Date.now() - MAX_AGE_MS;
  for (const [jobId, timing] of timings) {
    if (timing.startedAt < cutoff) timings.delete(jobId);
  }
}

/** For tests. */
export function resetJobTimingsForTests(): void {
  timings.clear();
}
