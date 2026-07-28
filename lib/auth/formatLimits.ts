// Rendering helpers for the numbers /api/tiers serves.
//
// Formatting only — no policy. Every value passed in came from the server, so
// nothing here may invent, round up, or default a limit into existence.

import type { TierLimits } from './accountApi';

/** "200 MB", "1 GB", "5 GB". Binary units, because that is how upload caps are set. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—';
  const gb = bytes / 1024 ** 3;
  if (gb >= 1) {
    return `${Number.isInteger(gb) ? gb : gb.toFixed(1)} GB`;
  }
  return `${Math.round(bytes / 1024 ** 2)} MB`;
}

/** "5 min", "20 min", "2 hr" — the pricing page's own phrasing. */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—';
  if (seconds % 3600 === 0 && seconds >= 3600) {
    const hours = seconds / 3600;
    return `${hours} hr`;
  }
  if (seconds >= 60) return `${Math.round(seconds / 60)} min`;
  return `${seconds} sec`;
}

/** "24 hr", "7 days", "30 days". */
export function formatRetention(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return '—';
  if (hours < 48) return `${hours} hr`;
  const days = Math.round(hours / 24);
  return days === 1 ? '1 day' : `${days} days`;
}

/**
 * A short, local rendering of when the allowance comes back.
 *
 * Deliberately relative and vague ("in about 4 hours") rather than a UTC
 * timestamp: the reset is at UTC midnight, which is a meaningless wall-clock
 * time to most visitors, and a precise countdown would read as a pressure tactic.
 */
export function formatResetsIn(iso: string | null | undefined): string {
  if (!iso) return '';
  const at = Date.parse(iso);
  if (Number.isNaN(at)) return '';
  const minutes = Math.round((at - Date.now()) / 60_000);
  if (minutes <= 1) return 'in a moment';
  if (minutes < 60) return `in ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours <= 1) return 'in about an hour';
  return `in about ${hours} hours`;
}

/** The ladder's top rung as a label: 1080p / 1440p / 2160p. */
export function formatOutputHeight(limits: TierLimits): string {
  return `${limits.maxOutputHeight}`;
}
