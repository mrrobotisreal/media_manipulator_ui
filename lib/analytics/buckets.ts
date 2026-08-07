/**
 * Shared bucket helpers for event properties.
 *
 * CATALOG LAW (ADR ws/0003): properties are enums or buckets, never raw
 * measurements. A raw value is a cardinality bomb in the event store's jsonb —
 * and, for anything derived from a user's media, close to a fingerprint of that
 * specific file. Every boundary below is chosen so the bucket answers the
 * question people actually ask ("was that export slow?", "do people import big
 * files?") and nothing more.
 *
 * These are the ONE definition of each bucket. Call sites must not inline their
 * own boundaries — a second copy that drifts by one boundary makes two events
 * incomparable forever, because the stored strings never heal.
 */

/** Generic small-count bucket. Also the caption cue-count bucket (its original home). */
export function countBucket(n: number): string {
  if (n <= 0) return '0';
  if (n <= 10) return '1-10';
  if (n <= 50) return '11-50';
  if (n <= 200) return '51-200';
  return '200+';
}

/**
 * Cue count for `studio_captions_generated`. Same boundaries the old
 * caption-lane local helper used, so the data is continuous across the rename.
 */
export const cueCountBucket = countBucket;

/** How many files arrived in one import gesture. */
export function batchBucket(n: number): string {
  if (n <= 1) return '1';
  if (n <= 5) return '2-5';
  if (n <= 20) return '6-20';
  return '20+';
}

/** File size for media imports. */
export function fileSizeBucket(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb < 10) return '<10mb';
  if (mb < 100) return '10-100mb';
  if (mb < 1024) return '100mb-1gb';
  return '1gb+';
}

/** Timeline duration of a project. */
export function timelineDurationBucket(seconds: number): string {
  if (seconds <= 0) return '0';
  if (seconds < 30) return '<30s';
  if (seconds < 120) return '30s-2m';
  if (seconds < 600) return '2m-10m';
  if (seconds < 1800) return '10m-30m';
  return '30m+';
}

/** How long an editing session lasted. */
export function sessionSecondsBucket(seconds: number): string {
  if (seconds < 60) return '<1m';
  if (seconds < 300) return '1-5m';
  if (seconds < 900) return '5-15m';
  if (seconds < 2700) return '15-45m';
  return '45m+';
}

/**
 * A ratio of two durations — e.g. render seconds / timeline seconds, where
 * "1-2x" reads as "the export took one to two times realtime".
 */
export function ratioBucket(ratio: number): string {
  if (!Number.isFinite(ratio) || ratio < 0) return 'unknown';
  if (ratio < 0.25) return '<0.25x';
  if (ratio < 0.5) return '0.25-0.5x';
  if (ratio < 1) return '0.5-1x';
  if (ratio < 2) return '1-2x';
  if (ratio < 4) return '2-4x';
  return '4x+';
}

/** Interactive latency (seek, save round-trip). */
export function latencyMsBucket(ms: number): string {
  if (ms < 50) return '<50ms';
  if (ms < 200) return '50-200ms';
  if (ms < 500) return '200-500ms';
  if (ms < 1000) return '500ms-1s';
  return '1s+';
}

/** Editor time-to-interactive. Coarser than latencyMsBucket — a load, not a keystroke. */
export function ttiMsBucket(ms: number): string {
  if (ms < 1000) return '<1s';
  if (ms < 2500) return '1-2.5s';
  if (ms < 5000) return '2.5-5s';
  if (ms < 10000) return '5-10s';
  return '10s+';
}

/** Preview frame rate. 55+ means "effectively at the 60fps bar". */
export function fpsBucket(fps: number): string {
  if (fps < 15) return '<15';
  if (fps < 30) return '15-30';
  if (fps < 45) return '30-45';
  if (fps < 55) return '45-55';
  return '55+';
}

/** Dropped-frame ratio (0..1) over a sampling window. */
export function droppedFrameRatioBucket(ratio: number): string {
  if (ratio <= 0) return '0';
  if (ratio < 0.01) return '<1%';
  if (ratio < 0.05) return '1-5%';
  if (ratio < 0.15) return '5-15%';
  return '15%+';
}
