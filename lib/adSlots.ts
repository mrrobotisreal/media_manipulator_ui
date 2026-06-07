/**
 * Review-safe runtime ad-slot map.
 *
 * This file used to mix real numeric AdSense slots with hundreds of
 * placeholder strings across header/footer/sidebar/anchor/incontent
 * placements. For the AdSense review build it has been reduced to ONLY the
 * in-content slots of the review-allowed tools — the single placement that may
 * ever render an ad (and even that is disabled by default via env).
 *
 * - No placeholder string remains here; every value is a real numeric slot.
 * - In-content placeholders were replaced with the generic Native MREC
 *   (336x280) unit `7160565051`. Real per-tool in-content slots are preserved.
 * - Header/footer/sidebar/mobile-anchor/post-conversion/index-page slots are
 *   intentionally NOT exposed at runtime. The full historical inventory
 *   (including those slots) is preserved in docs/adsense-slot-inventory.md.
 */

import { isRealAdSenseSlot } from '@/lib/adsenseConfig';

type ReviewToolAdSlotSet = {
  incontent?: string | null;
};

// Generic catch-all Native MREC (336x280) unit, used for review-allowed tools
// whose dedicated in-content unit was never provisioned (formerly placeholder).
const GENERIC_INCONTENT_MREC = '7160565051';

export const REVIEW_TOOL_AD_SLOTS: Record<string, ReviewToolAdSlotSet> = {
  'content-studio': { incontent: '9121607896' },
  'remove-exif-metadata': { incontent: '6634896969' },
  'compress-video': { incontent: '6261464667' },
  'extract-audio-from-video': { incontent: '5082142140' },
  'convert-video-to-animated-gif': { incontent: '6530955187' },
  'transcribe-video': { incontent: '2863172919' },
  'transcode-to-hls': { incontent: '2974853558' },
  // Formerly placeholder — replaced with the generic Native MREC unit.
  'compress-image': { incontent: GENERIC_INCONTENT_MREC },
  'image-resizer': { incontent: GENERIC_INCONTENT_MREC },
  'remove-background-from-image': { incontent: GENERIC_INCONTENT_MREC },
  'image-to-pdf': { incontent: GENERIC_INCONTENT_MREC },
  'pdf-to-jpg': { incontent: GENERIC_INCONTENT_MREC },
  'video-trimmer': { incontent: GENERIC_INCONTENT_MREC },
};

/** Returns the validated in-content slot for a tool slug, or null. */
export function getReviewToolInContentAdSlot(slug: string): string | null {
  const slot = REVIEW_TOOL_AD_SLOTS[slug]?.incontent ?? null;
  return isRealAdSenseSlot(slot) ? slot : null;
}
