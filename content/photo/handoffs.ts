/**
 * MM100 decision 7: the existing one-shot image tool pages point at the matching Aperture page. Each
 * gets one sentence (appended to `whatItDoes`, or `advancedDetails` when the page has no list of
 * its own) and one `related` entry ("Fine-tune in Aperture"). Applied where TOOL_PAGES is assembled
 * (content/toolPages.ts), so the entries themselves stay untouched. A locale override that replaces
 * those arrays wholesale simply drops the added sentence until its MM102 body ticket.
 */
import { PHOTO_BRAND } from '@/lib/photo/brand';
import type { ToolPageContent, ToolRelatedLink } from '@/content/toolPages';

interface Handoff {
  sentence: string;
  link: ToolRelatedLink;
}

export const PHOTO_HANDOFFS: Record<string, Handoff> = {
  'image-filters': {
    sentence: `To tune a look instead of applying a fixed filter, ${PHOTO_BRAND} gives every effect its own sliders, a mask and an opacity, and saves your combination as a preset.`,
    link: { label: `Fine-tune in ${PHOTO_BRAND}`, to: '/tools/aperture', description: 'Adjustment layers with sliders, masks and presets.' },
  },
  'grayscale-image': {
    sentence: `For control over how each color becomes a shade of gray, the Black & white panel in ${PHOTO_BRAND} has six channel sliders and an optional tint.`,
    link: { label: `Fine-tune in ${PHOTO_BRAND}`, to: '/tools/black-and-white-photo', description: 'Six channel sliders and an optional tint.' },
  },
  'sharpen-image': {
    sentence: `For control over amount, radius and threshold, use ${PHOTO_BRAND}, whose Detail panel sharpens the brightness only and previews the result live.`,
    link: { label: `Fine-tune in ${PHOTO_BRAND}`, to: '/tools/sharpen-photo-online', description: 'Amount, radius and threshold, with a live 100% view.' },
  },
  'blur-image': {
    sentence: `To blur only part of a photo, add a Blur layer in ${PHOTO_BRAND} and limit it with a gradient, a radial or a brush mask.`,
    link: { label: `Fine-tune in ${PHOTO_BRAND}`, to: '/tools/aperture', description: 'Blur and other adjustments limited by masks.' },
  },
  'rotate-image': {
    sentence: `For a few degrees instead of a quarter turn, ${PHOTO_BRAND} straightens a tilted photo by angle or by drawing a line along the horizon, and crops the empty corners for you.`,
    link: { label: `Fine-tune in ${PHOTO_BRAND}`, to: '/tools/straighten-photo', description: 'Straighten by angle or along a line.' },
  },
  'crop-image': {
    sentence: `To crop and correct perspective in one pass, the Geometry panel in ${PHOTO_BRAND} combines crop, straighten, flip and a four-corner perspective warp.`,
    link: { label: `Fine-tune in ${PHOTO_BRAND}`, to: '/tools/fix-perspective-photo', description: 'Crop, straighten and perspective in one transform.' },
  },
  'image-resizer': {
    sentence: `If the picture also needs its light or color fixed before you size it, make those edits in ${PHOTO_BRAND} first and export a size cap of 12, 24, 64 or 120 megapixels.`,
    link: { label: `Fine-tune in ${PHOTO_BRAND}`, to: '/tools/aperture', description: 'Edit light and color, then export at a size cap.' },
  },
  'compress-image': {
    sentence: `When the photo needs a quick tone or color fix before it is compressed, edit it in ${PHOTO_BRAND} and export JPG, WebP or AVIF with a quality of your choice in the same step.`,
    link: { label: `Fine-tune in ${PHOTO_BRAND}`, to: '/tools/aperture', description: 'Edit, then export with the quality you choose.' },
  },
  'add-text-to-image': {
    sentence: `${PHOTO_BRAND} does not add text, so add your caption here and use ${PHOTO_BRAND} for the light and color of the photo underneath it.`,
    link: { label: `Fine-tune in ${PHOTO_BRAND}`, to: '/tools/aperture', description: 'Light and color adjustments for the photo itself.' },
  },
  'remove-background-from-image': {
    sentence: `To change only the subject or only the background, ${PHOTO_BRAND} can select the subject with the same kind of model and then apply any adjustment to just that selection.`,
    link: { label: `Fine-tune in ${PHOTO_BRAND}`, to: '/tools/select-by-color', description: 'Select by color or subject, then adjust only that part.' },
  },
  'ai-image-upscaler': {
    sentence: `If the photo also has blemishes, ${PHOTO_BRAND} heals them with an inpainting model on our GPU, so you can clean the picture before you enlarge it.`,
    link: { label: `Fine-tune in ${PHOTO_BRAND}`, to: '/tools/remove-blemishes', description: 'Heal spots and blemishes before enlarging.' },
  },
};

/** The tool with its hand-off sentence and link added (unchanged when the slug has none). */
export function withPhotoHandoff(tool: ToolPageContent): ToolPageContent {
  const h = PHOTO_HANDOFFS[tool.slug];
  if (!h) return tool;
  const hasList = tool.whatItDoes.length > 0;
  return {
    ...tool,
    ...(hasList ? { whatItDoes: [...tool.whatItDoes, h.sentence] } : { advancedDetails: [...(tool.advancedDetails ?? []), h.sentence] }),
    related: [...tool.related, h.link].slice(-6),
  };
}
