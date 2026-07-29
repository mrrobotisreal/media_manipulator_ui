/**
 * Path data for the aperture mark, on a 24×24 viewBox centred at (12, 12).
 *
 * These live in their own module rather than in `wordmark.tsx` because both the
 * static mark and the animated one (`aperture-motion.tsx`) need them, and
 * `aperture-motion` is imported *by* `wordmark` — keeping the geometry here is
 * what stops that from becoming an import cycle. `wordmark.tsx` re-exports them,
 * so it remains the public home of the mark.
 *
 * Hard-coded rather than computed at render time for two reasons: the mark is
 * rendered inside client components (the nav), so trigonometry would run in the
 * browser on every mount for a shape that never changes; and identical output on
 * server and client is guaranteed rather than assumed.
 *
 * Reproduce with polar(r, θ) = (12 + r·cos θ, 12 + r·sin θ), rounded to 2dp:
 *
 *   BARREL         circle r = 10, stroke 1.5 (so its stroke spans 9.25 … 10.75)
 *   OPENING_BLADES flat-top hexagon, r = 3.9,  vertices at θ = 0°, 60° … 300°
 *   BLADE_SEAMS    six lines, polar(3.9, θ) → polar(9.5, θ + 28°)
 *   OPENING_IRIS   flat-top hexagon, r = 4.6   (the original, larger opening)
 *
 * Three numbers carry the whole drawing, and each was chosen against a render:
 *
 *   28°  is what separates "aperture" from "gear". Seams drawn straight out
 *        along the radius read as sun rays; the tangential offset is the entire
 *        cue that these are overlapping leaves.
 *   9.5  lands inside the barrel's stroke band, so each seam MERGES into the
 *        barrel instead of stopping near it. Ending short (8.6 was tried) leaves
 *        six floating slivers that read as spokes, not blades.
 *   3.9  is a smaller opening than the plain iris uses. The blades need annulus
 *        to live in; at 4.6 they are stubs.
 *
 * Butt caps, not round: round caps put a visible bead on the end of every seam,
 * which at 6x magnification reads as a spider rather than a mechanism. The
 * animated mark depends on this too — its hidden rays are zero-length segments,
 * which only render as nothing under butt caps.
 */

export const OPENING_BLADES =
  'M15.9 12 L13.95 15.38 L10.05 15.38 L8.1 12 L10.05 8.62 L13.95 8.62 Z';

export const BLADE_SEAMS = [
  'M15.9 12 L20.39 16.46',
  'M13.95 15.38 L12.33 21.49',
  'M10.05 15.38 L3.94 17.03',
  'M8.1 12 L3.61 7.54',
  'M10.05 8.62 L11.67 2.51',
  'M13.95 8.62 L20.06 6.97',
].join(' ');

export const OPENING_IRIS =
  'M16.6 12 L14.3 15.98 L9.7 15.98 L7.4 12 L9.7 8.02 L14.3 8.02 Z';
