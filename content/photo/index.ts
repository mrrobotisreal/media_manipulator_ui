/**
 * MM100: the 25 Aperture tool pages. Prose lives in pages-a..d.ts (English); this
 * file adds the wiring every page shares: category `photo`, the review date, and
 * the embed preset naming the editor panel (and built-in look) the page's drop
 * zone opens (ticket decisions 2 and 3). The slugs, panels and looks are the ones
 * built by MM97-MM99 (`lib/photo/panelIds.ts`, `lib/photo/presets/builtin`).
 */
import type { ToolPageContent } from '@/content/toolPages';
import type { PhotoPanelId } from '@/lib/photo/panelIds';
import { PHOTO_PAGES_REVIEWED } from '@/content/photo/dates';
import { PHOTO_ADJUSTMENT_SLUGS } from '@/content/photo/slugs';
import type { PhotoPageBody } from './types';
import pagesA from './pages-a';
import pagesB from './pages-b';
import pagesC from './pages-c';
import pagesD from './pages-d';

/** slug -> the panel to open first and, optionally, the built-in look to apply. */
export const PHOTO_PAGE_WIRING: Record<string, { panel: PhotoPanelId; preset?: string }> = {
  aperture: { panel: 'basic' },
  'brighten-image': { panel: 'basic' },
  'adjust-image-contrast': { panel: 'basic' },
  'fix-photo-exposure': { panel: 'basic' },
  'adjust-image-hue': { panel: 'hsl' },
  'change-image-color': { panel: 'hsl' },
  'color-pop': { panel: 'hsl', preset: 'color-pop-red' },
  'image-saturation': { panel: 'basic' },
  'photo-levels': { panel: 'levels' },
  'photo-curves': { panel: 'curves' },
  'white-balance-photo': { panel: 'basic' },
  'black-and-white-photo': { panel: 'blackWhite', preset: 'bw-film' },
  'tint-photo': { panel: 'photoFilter' },
  'color-balance-photo': { panel: 'colorBalance' },
  'split-toning': { panel: 'splitTone' },
  'apply-lut-to-photo': { panel: 'lut' },
  'invert-image-colors': { panel: 'effects' },
  'posterize-image': { panel: 'effects' },
  'reduce-image-noise': { panel: 'detail' },
  'add-vignette': { panel: 'detail' },
  'sharpen-photo-online': { panel: 'detail' },
  'straighten-photo': { panel: 'geometry' },
  'fix-perspective-photo': { panel: 'geometry' },
  'remove-blemishes': { panel: 'heal' },
  'select-by-color': { panel: 'masks' },
};

export const PHOTO_PAGE_SLUGS = Object.keys(PHOTO_PAGE_WIRING);
/** The 24 adjustment pages (everything but the landing). */
export { PHOTO_ADJUSTMENT_SLUGS };

if (PHOTO_ADJUSTMENT_SLUGS.join() !== PHOTO_PAGE_SLUGS.filter((s) => s !== 'aperture').join()) {
  throw new Error('content/photo/slugs.ts and PHOTO_PAGE_WIRING disagree');
}

const BODIES: PhotoPageBody[] = [...pagesA, ...pagesB, ...pagesC, ...pagesD];

export const PHOTO_TOOL_PAGES: ToolPageContent[] = BODIES.map((b) => {
  const wiring = PHOTO_PAGE_WIRING[b.slug];
  if (!wiring) throw new Error(`photo page ${b.slug} has no wiring`);
  return {
    ...b,
    category: 'photo',
    lastReviewed: PHOTO_PAGES_REVIEWED,
    embed: {
      defaultMediaKind: 'image',
      defaultTask: 'photo_editor',
      preset: { kind: 'photo', panel: wiring.panel, ...(wiring.preset ? { preset: wiring.preset } : {}) },
      title: b.embed.title,
      description: b.embed.description,
    },
  } satisfies ToolPageContent;
});
