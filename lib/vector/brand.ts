/**
 * The user-facing brand of the SVG + animation editor (design §1, ticket
 * MM42 decision 6). Every code identifier says `vector`; UI copy says this.
 * The brand is swappable like Darkroom's: change it here and in i18n.
 *
 * This is the ONLY place the brand word may appear as a string literal
 * outside the i18n JSON (`brand.test.ts` enforces it). Never confuse it with
 * the `motion` npm package, which we do not depend on.
 */
export const MOTION_BRAND = 'Motion';
