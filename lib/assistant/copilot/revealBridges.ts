/**
 * MM114: one reveal bridge per editor (the `lib/studio/editorBridges.ts` pattern). The mounted
 * editor registers a handler; the copilot adapter's `reveal(op)` builds a target from the op and
 * the live document and asks the bridge. The handler selects, opens the panel and flashes the
 * control. No bridge handler registered = `reveal` returns false and "Show me" does nothing.
 */
import { createRevealBridge } from './reveal';

/** Aperture: select a layer, open the panel that edits it, flash the first of `keys` on screen. */
export interface PhotoRevealTarget {
  panel: string | null;
  layerId?: string;
  keys: string[];
}
export const photoRevealBridge = createRevealBridge<PhotoRevealTarget>();

/** Darkroom: select a clip, open the inspector `section` (if any), flash the first of `keys`. */
export interface StudioRevealTarget {
  clipId?: string;
  section?: StudioRevealSection;
  keys: string[];
}
export type StudioRevealSection = 'motion' | 'effects' | 'speed' | 'audio' | 'transition' | 'title';
export const studioRevealBridge = createRevealBridge<StudioRevealTarget>();

/** Motion: select a layer, expand its timeline row (and `property`), flash the first of `keys`. */
export interface VectorRevealTarget {
  layerId?: string;
  property?: string;
  keys: string[];
}
export const vectorRevealBridge = createRevealBridge<VectorRevealTarget>();
