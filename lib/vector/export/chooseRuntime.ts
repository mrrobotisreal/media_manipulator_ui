/**
 * Runtime chooser for animated SVG export (ticket MM45 decision 8, design
 * §3.3.3): CSS only when EVERY animated feature is expressible in CSS in
 * every major engine (Chromium, Firefox, Safari); otherwise the inline MIT
 * anime.js runtime (`./anime.ts`).
 *
 *   property                         CSS everywhere?   why
 *   transform.* / opacity / fill /   yes               MM44
 *     stroke / strokeWidth
 *   strokeDashoffset (draw-on)       yes               `stroke-dashoffset`
 *   motionPath (basic)               yes               `offset-path: path()`, Safari 16+
 *   motionPath, autoOrient AND a     no → anime        `offset-rotate` composed with a
 *     rotation track AND an anchor                     separately animated rotation about a
 *                                                      non-zero anchor (decision 3 edge case)
 *   gradientStop[i].color            yes               `stop-color` on `<stop>`
 *   gradientStop[i].offset           no → anime        `offset` is not a CSS property everywhere
 *   d (morph)                        no → anime        Safari has no CSS `d`
 *   filter.blur                      no → anime        CSS `filter: blur()` is not applied to
 *                                                      SVG shapes in Safari (MDN BCD
 *                                                      `css.properties.filter.svg_elements`:
 *                                                      Safari false, webkit.org/b/246106), so
 *                                                      the SVG `<feGaussianBlur>` is animated
 *   mask / clip content tracks       as their property (ordinary layer tracks)
 *
 * `reasons` lists the features that force anime, once each, in table order;
 * it is non-empty exactly when the runtime is anime. `forceAnime` lets the
 * user choose anime anyway (never the reverse: CSS cannot be forced when it
 * cannot express the document).
 */
import { advancedKind } from '@/lib/vector/advanced';
import { resolveTransform } from '@/lib/vector/geometry';
import { findDocLayer } from '@/lib/vector/advanced';
import type { VectorDoc } from '@/lib/vector/vectorTypes';

export type ExportRuntime = 'css' | 'anime';

/**
 * Blur needs the runtime while Safari ignores CSS `filter` on SVG shapes
 * (webkit.org/b/246106, open on 2026-10-25). Flip to false once Safari ships
 * it: the CSS exporter already writes `filter: blur()` (golden `css/blur`).
 */
export const BLUR_NEEDS_RUNTIME = true;

/** Why a document needs the anime.js runtime (i18n `vector.exportDialog.reasons.<code>`). */
export type AnimeReason = 'morph' | 'stopOffset' | 'blur' | 'motionRotate';
export const ANIME_REASONS: readonly AnimeReason[] = ['morph', 'stopOffset', 'blur', 'motionRotate'];

export interface RuntimeChoice {
  runtime: ExportRuntime;
  reasons: AnimeReason[];
}

const changes = (keys: ReadonlyArray<{ value: number | string }>) => keys.some((k) => k.value !== keys[0].value);

/** The anime triggers of a document, in `ANIME_REASONS` order. */
export function animeReasons(doc: VectorDoc): AnimeReason[] {
  const found = new Set<AnimeReason>();
  const rotated = new Set<string>();
  for (const tr of doc.animations) if (tr.property === 'transform.rotation' && changes(tr.keyframes)) rotated.add(tr.layerId);
  for (const tr of doc.animations) {
    if (tr.keyframes.length === 0) continue;
    switch (advancedKind(tr.property)) {
      case 'morph':
        if (changes(tr.keyframes)) found.add('morph');
        break;
      case 'stopOffset':
        if (changes(tr.keyframes)) found.add('stopOffset');
        break;
      case 'blur':
        if (BLUR_NEEDS_RUNTIME && changes(tr.keyframes)) found.add('blur');
        break;
      case 'motion': {
        if (tr.extras?.autoOrient !== true || !rotated.has(tr.layerId)) break;
        const layer = findDocLayer(doc, tr.layerId);
        const tf = resolveTransform(layer && layer.type !== 'raw' ? layer.transform : undefined);
        const anchoredTrack = doc.animations.some((x) => x.layerId === tr.layerId && /^transform\.anchor[XY]$/.test(x.property) && x.keyframes.some((k) => k.value !== 0));
        if (tf.anchorX !== 0 || tf.anchorY !== 0 || anchoredTrack) found.add('motionRotate');
        break;
      }
      default:
        break;
    }
  }
  return ANIME_REASONS.filter((r) => found.has(r));
}

/** `chooseRuntime(doc) → {runtime, reasons}` (module comment). */
export function chooseRuntime(doc: VectorDoc, opts: { forceAnime?: boolean } = {}): RuntimeChoice {
  const reasons = animeReasons(doc);
  if (reasons.length > 0) return { runtime: 'anime', reasons };
  return { runtime: opts.forceAnime ? 'anime' : 'css', reasons: [] };
}
