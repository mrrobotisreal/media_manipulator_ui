import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Wordmark — replaces the glitch-face brand type (Rubik Glitch, 407 KB for two
 * words) and the unsized 80×80 image tag that was 22% of a 360px viewport.
 *
 * A lens aperture in safelight coral plus a two-tone type lockup: the ring is the
 * barrel, the hexagonal opening is the iris. Six blades, because a physical iris
 * built from six leaves is what makes hexagonal bokeh. Nothing here needs a
 * webfont beyond Inter, and nothing here is a raster asset — the mark is inline
 * SVG coloured by `currentColor`, so it costs no request, stays sharp at any
 * size, and follows the theme in both directions.
 *
 * The brand string is passed in rather than read from i18n so this can stay a
 * server component; call sites keep using `t('interface:common.brand')`.
 * Splitting on the last space keeps the two-tone treatment working for a
 * translated brand, and degrades to a single tone if there is no space.
 */

type WordmarkSize = 'sm' | 'lg';

/**
 * The nav mark is 28px rather than 24px. At 24 the blade seams are legible but
 * cramped, and the whole point of drawing blades is that a first-time visitor
 * recognises a camera aperture without being told. The nav is a fixed h-14/h-16,
 * so the extra 4px changes no layout and costs no CLS.
 */
const SIZES: Record<WordmarkSize, { mark: string; text: string; gap: string }> =
  {
    sm: { mark: 'size-7', text: 'text-base', gap: 'gap-2' },
    lg: { mark: 'size-9', text: 'text-2xl', gap: 'gap-2.5' },
  };

/* ---------------------------------------------------------------------------
 * The aperture drawing
 *
 * Two versions are kept side by side, selected by ONE constant. Reverting to the
 * plain iris is a one-word edit and touches nothing else — no geometry to
 * re-derive, no sizes to put back.
 * ------------------------------------------------------------------------- */

type ApertureStyle = 'blades' | 'iris';

/**
 * Which drawing the mark uses.
 *
 *   'blades' — six-blade iris: the opening plus the seams where the leaves
 *              overlap. Reads unmistakably as a camera aperture from 20px up.
 *   'iris'   — opening only, no seams. Quieter, and what shipped in v14.
 *
 * ⇦ CHANGE THIS ONE WORD TO SWITCH BACK.
 */
const APERTURE: ApertureStyle = 'blades';

/**
 * Path data for both drawings, on a 24×24 viewBox centred at (12, 12).
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
 * which at 6x magnification reads as a spider rather than a mechanism.
 */
const OPENING_BLADES =
  'M15.9 12 L13.95 15.38 L10.05 15.38 L8.1 12 L10.05 8.62 L13.95 8.62 Z';

const BLADE_SEAMS = [
  'M15.9 12 L20.39 16.46',
  'M13.95 15.38 L12.33 21.49',
  'M10.05 15.38 L3.94 17.03',
  'M8.1 12 L3.61 7.54',
  'M10.05 8.62 L11.67 2.51',
  'M13.95 8.62 L20.06 6.97',
].join(' ');

const OPENING_IRIS = 'M16.6 12 L14.3 15.98 L9.7 15.98 L7.4 12 L9.7 8.02 L14.3 8.02 Z';

function ApertureMark({ className }: { className?: string }) {
  const blades = APERTURE === 'blades';
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn('shrink-0 text-primary', className)}
    >
      {/* Barrel */}
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Iris opening */}
      <path d={blades ? OPENING_BLADES : OPENING_IRIS} fill="currentColor" />
      {blades && (
        // Blade seams. Thinner than the barrel so the mark keeps one dominant
        // outline instead of reading as a tangle of equal-weight lines.
        <path d={BLADE_SEAMS} fill="none" stroke="currentColor" strokeWidth="1.2" />
      )}
    </svg>
  );
}

export interface WordmarkProps extends React.ComponentProps<'span'> {
  size?: WordmarkSize;
  /** The brand string, e.g. t('interface:common.brand'). */
  text?: string;
  /**
   * Hide the type and keep only the mark (tight mobile chrome). The brand name
   * stays in the accessibility tree either way.
   */
  showText?: boolean;
}

export function Wordmark({
  size = 'sm',
  text = 'Media Manipulator',
  showText = true,
  className,
  ...props
}: WordmarkProps) {
  const s = SIZES[size];
  const split = text.lastIndexOf(' ');
  const lead = split > 0 ? text.slice(0, split) : text;
  const trail = split > 0 ? text.slice(split + 1) : '';

  return (
    <span
      className={cn('inline-flex items-center', s.gap, className)}
      {...props}
    >
      <ApertureMark className={s.mark} />

      {showText ? (
        <span
          className={cn(
            'font-sans font-semibold leading-none tracking-tight',
            s.text
          )}
        >
          <span className="text-foreground">{lead}</span>
          {trail && (
            <>
              {' '}
              <span className="text-muted-foreground">{trail}</span>
            </>
          )}
        </span>
      ) : (
        <span className="sr-only">{text}</span>
      )}
    </span>
  );
}

export default Wordmark;
