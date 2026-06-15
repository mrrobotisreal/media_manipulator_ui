import { trackFirstPartyEvent } from '@/lib/firstPartyAnalytics';

/**
 * Content Studio telemetry. Privacy: NEVER send caption/transcript text,
 * filenames, or media content — only derived metadata (effect type, count
 * buckets, booleans, preset keys).
 */

function countBucket(n: number): string {
  if (n <= 0) return '0';
  if (n <= 10) return '1-10';
  if (n <= 50) return '11-50';
  if (n <= 200) return '51-200';
  return '200+';
}

export function trackStudioEffectAdded(type: string): void {
  trackFirstPartyEvent('studio_effect_added', { type });
}

export function trackStudioCaptionsGenerated(cueCount: number): void {
  trackFirstPartyEvent('studio_captions_generated', { cueCountBucket: countBucket(cueCount) });
}

export function trackStudioExport(opts: { hasLut: boolean; hasChromaKey: boolean; loudness: string }): void {
  trackFirstPartyEvent('studio_export', {
    hasLut: opts.hasLut,
    hasChromaKey: opts.hasChromaKey,
    loudness: opts.loudness || 'none',
  });
}
