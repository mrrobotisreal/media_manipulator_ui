/**
 * The user-facing brand of the photo editor (design `docs/design/PHOTO_EDITOR.md`
 * §2, ticket MM97 decision 1). Every code identifier says `photo`; UI copy
 * interpolates this constant into the i18n strings. The brand is swappable:
 * change it here and in the i18n JSON.
 *
 * This is the ONLY place the brand word may appear as a string literal outside
 * the i18n JSON (`brand.test.ts` enforces it).
 */
export const PHOTO_BRAND = 'Aperture';
