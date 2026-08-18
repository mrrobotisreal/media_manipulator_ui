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
 *   BLADE_SEAMS    six blade bars, polar(4.775, θ − 60.18°) → polar(9.6, θ + 34.54°)
 *   OPENING_IRIS   flat-top hexagon, r = 4.6   (the original, larger opening)
 *
 * BLADE_SEAMS is the classic overlapping-shutter-leaf construction, matching
 * the brand reference image. Each bar lies along a hexagon EDGE LINE — the line
 * through edge V(k−1)→Vk of the r = 3.9 hexagon, extended past Vk toward the
 * barrel — with the bar's body entirely on the exterior side of that line: the
 * stroke centerline is the edge line offset outward by 0.75 (half the 1.5
 * stroke), so the bar's inner edge IS the edge line. Centering the stroke on
 * the line instead juts it past the hexagon edge and stair-steps it mid-edge.
 *
 *   0.45  the butt end is tucked this far back along the edge BEFORE V(k−1),
 *         which buries the entire butt cap inside the previous blade's body —
 *         no bar end is ever visible (anywhere in 0 … 0.866 back conceals it).
 *         With the butt buried, each blade fills the 60° wedge at its vertex,
 *         the iris reads as a pinwheel, and every black opening tapers to a
 *         clean point where one blade's outer edge meets the next blade's
 *         inner-edge line — the only corners in the figure are blade-edge
 *         intersections, exactly like physical shutter leaves.
 *   9.6   where the centerline ends, inside the barrel's stroke band
 *         (9.25 … 10.75), so each bar MERGES flush into the barrel instead of
 *         stopping near it.
 *   1.5   bar stroke width — identical to the barrel, one stroke weight across
 *         the whole mark.
 *
 * Derivation: S = V(k−1) − 0.45·û + 0.75·n̂ and E = S + s·û with |E| = 9.6,
 * where û is the unit edge direction and n̂ the outward unit normal. In the
 * animated mark's ray-pool polar form this is [4.775, −60.18°, 9.6, +34.54°]
 * on every 4th of its 24 slots.
 *
 * Butt caps, not round: round caps put a visible bead on the end of every bar,
 * which at 6x magnification reads as a spider rather than a mechanism. The
 * animated mark depends on this too — its hidden rays are zero-length segments,
 * which only render as nothing under butt caps.
 */

export const OPENING_BLADES =
  'M15.9 12 L13.95 15.38 L10.05 15.38 L8.1 12 L10.05 8.62 L13.95 8.62 Z';

export const BLADE_SEAMS = [
  'M14.37 7.86 L19.91 17.44',
  'M16.77 11.99 L11.24 21.57',
  'M14.4 16.13 L3.33 16.13',
  'M9.63 16.14 L4.09 6.56',
  'M7.23 12.01 L12.76 2.43',
  'M9.6 7.87 L20.67 7.87',
].join(' ');

export const OPENING_IRIS =
  'M16.6 12 L14.3 15.98 L9.7 15.98 L7.4 12 L9.7 8.02 L14.3 8.02 Z';
