import type { StudioAsset } from '@/lib/studioTypes';

/**
 * The right-trim bound for a clip, in source seconds. Title clips and still
 * images have no source length, so they may be stretched without limit; media
 * clips are bound by the asset duration. The result is a TRANSIENT gesture
 * bound only: Infinity must never be written into the document (JSON turns it
 * into null).
 */
export function clipTrimBound(
  asset: Pick<StudioAsset, 'mediaKind' | 'durationSeconds'> | undefined,
  isTitle: boolean,
): number {
  if (isTitle || asset?.mediaKind === 'image') return Number.POSITIVE_INFINITY;
  return asset?.durationSeconds ?? 0;
}
