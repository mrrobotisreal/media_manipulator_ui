import type { StudioMediaKind, StudioTrackKind } from '@/lib/studioTypes';

/**
 * Which media-bin assets a track accepts when dropped (pure).
 * Video tracks hold video and still images; audio tracks hold audio; LUTs are
 * graded onto clips, never placed on a track.
 */
export function trackAcceptsAsset(trackKind: StudioTrackKind, assetKind: StudioMediaKind): boolean {
  if (assetKind === 'lut') return false;
  if (trackKind === 'video') return assetKind === 'video' || assetKind === 'image';
  return assetKind === 'audio';
}
