// Frequency cap for the limit interstitial (MM33 decision 3 and 6): at most one per distinct
// limit per browser session. "Maybe later" and simply closing it both count, because the
// slot is claimed when the dialog opens, not when it is dismissed.

import type { InterstitialDetail } from '@/components/account/upgrade-interstitial';

const PREFIX = 'mm.limitInterstitial.';

/** The distinct-limit key: the same string the analytics `cta_id` carries. */
export function limitKeyOf(input: InterstitialDetail): string {
  return input.kind === 'quota' ? `quota_${input.detail.metric}` : input.detail.error;
}

/**
 * Claims this limit's once-per-session slot. True means "show it"; false means it was already
 * shown this session. Blocked storage errs toward silence, like every other nudge here.
 */
export function claimInterstitial(key: string): boolean {
  try {
    if (window.sessionStorage.getItem(PREFIX + key) === '1') return false;
    window.sessionStorage.setItem(PREFIX + key, '1');
    return true;
  } catch {
    return false;
  }
}
