/**
 * MM100: the Aperture tool-page slugs, dependency-free so content/reviewAllowlist.ts (which client
 * code imports) never pulls the page bodies in. content/photo/index.ts asserts the two agree.
 */
export const PHOTO_ADJUSTMENT_SLUGS = [
  'brighten-image',
  'adjust-image-contrast',
  'fix-photo-exposure',
  'adjust-image-hue',
  'change-image-color',
  'color-pop',
  'image-saturation',
  'photo-levels',
  'photo-curves',
  'white-balance-photo',
  'black-and-white-photo',
  'tint-photo',
  'color-balance-photo',
  'split-toning',
  'apply-lut-to-photo',
  'invert-image-colors',
  'posterize-image',
  'reduce-image-noise',
  'add-vignette',
  'sharpen-photo-online',
  'straighten-photo',
  'fix-perspective-photo',
  'remove-blemishes',
  'select-by-color',
] as const;
