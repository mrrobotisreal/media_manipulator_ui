/**
 * MM121 caption analytics helpers (closed vocabularies; never caption text).
 */
import type { StudioCaptionCue, StudioCaptionStyle } from '@/lib/studioTypes';

/** The animation a burn-in export renders: the style's, 'none' when nothing is burned in. */
export function captionAnimationFor(captionsMode: string | undefined, style: StudioCaptionStyle | undefined, hasCaptions: boolean): string {
  const burns = captionsMode === 'burn_in' || (captionsMode === undefined && hasCaptions);
  if (!burns || !hasCaptions) return 'none';
  return style?.animation ?? 'none';
}

/** True when any cue carries word timings. */
export function cuesHaveWords(cues: readonly StudioCaptionCue[] | undefined): boolean {
  return (cues ?? []).some((c) => (c.words?.length ?? 0) > 0);
}
