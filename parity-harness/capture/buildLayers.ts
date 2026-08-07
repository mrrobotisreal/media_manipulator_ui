import type { GLCompositor, GLLayer } from '../../lib/studio/glCompositor';
import { resolveActiveClips, transitionRamp, type ActiveClip } from '../../lib/studio/previewEngine';
import type { StudioTrack } from '../../lib/studioTypes';

/**
 * EDL → GLLayer[] for one timeline instant, for the parity capture page.
 *
 * MIRROR WARNING: this reproduces the editor's layer construction —
 * `buildGLLayer` + the zOf ordering in
 * components/content-studio/preview-surface.tsx (which cannot be imported here
 * without dragging the whole React editor into the capture bundle). If that
 * file changes how layers are built or ordered, change this in lockstep.
 * The ordering (trackIndex asc, then timelineStart asc) equals the export's
 * sortVideoSegs in studio_export.go.
 */

// hexToRgb01 — same conversion as preview-surface.tsx.
function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  if (h.length !== 6) return [0, 1, 0];
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

export interface LayerSource {
  slot: number;
  srcW: number;
  srcH: number;
}

/** Video clips active at `t`, in composite (bottom→top) order. */
export function orderedVideoClips(tracks: StudioTrack[], t: number): ActiveClip[] {
  const hidden = new Set(tracks.filter((tr) => tr.kind === 'video' && tr.hidden).map((tr) => tr.id));
  return resolveActiveClips(tracks, t)
    .filter((a) => a.trackKind === 'video' && !hidden.has(a.trackId))
    .sort((x, y) => x.trackIndex - y.trackIndex || x.clip.timelineStart - y.clip.timelineStart);
}

/**
 * Builds the compositor layers for the active clips. `sources` maps clip id →
 * uploaded slot + source dimensions (the caller has already seeked/uploaded).
 */
export function buildLayersAtTime(
  active: ActiveClip[],
  t: number,
  sources: Map<string, LayerSource>,
  comp: GLCompositor,
): GLLayer[] {
  const layers: GLLayer[] = [];
  for (const a of active) {
    const src = sources.get(a.clip.id);
    if (!src) continue;
    const clip = a.clip;
    const eq = clip.adjustments
      ? {
          brightness: clip.adjustments.brightness,
          contrast: clip.adjustments.contrast,
          saturation: clip.adjustments.saturation,
        }
      : undefined;
    let lumetri: GLLayer['lumetri'];
    let lut: GLLayer['lut'];
    let chroma: GLLayer['chroma'];
    for (const e of clip.effects ?? []) {
      if (!e.enabled) continue;
      if (e.type === 'lumetri' && !lumetri) {
        lumetri = {
          exposure: e.exposure,
          contrast: e.contrast,
          saturation: e.saturation,
          temperature: e.temperature,
          tint: e.tint,
          vibrance: e.vibrance,
        };
      } else if (e.type === 'lut' && !lut && comp.hasLut(e.lutAssetId)) {
        lut = { key: e.lutAssetId, intensity: e.intensity };
      } else if (e.type === 'chromakey' && !chroma) {
        chroma = { keyColor: hexToRgb01(e.keyColor), similarity: e.similarity, blend: e.blend, despill: e.despill };
      }
    }
    layers.push({
      slot: src.slot,
      srcW: src.srcW,
      srcH: src.srcH,
      transform: clip.transform,
      crop: clip.crop,
      opacity: (clip.opacity ?? 1) * transitionRamp(clip, t),
      blendMode: clip.blendMode,
      eq,
      lumetri,
      lut,
      chroma,
    });
  }
  return layers;
}
