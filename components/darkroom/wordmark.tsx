import * as React from 'react';

import { cn } from '@/lib/utils';

import { AnimatedApertureMark } from './aperture-motion';
import { BLADE_SEAMS, OPENING_BLADES, OPENING_IRIS } from './aperture-paths';

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
 * Mark sizes are set by the finest detail the mark has to resolve, not by the
 * adjacent type.
 *
 * The original constraint was the blade seams: at 24px they were legible but
 * cramped, and a first-time visitor has to read "camera aperture" without being
 * told, so the nav went to 28px. The animated mark raised the bar. Its tightest
 * stage is the chartreuse resonance disc, a 24-tick corona around the rim, and
 * ticks need roughly 4.5px of arc each before they stop reading as ticks and
 * start reading as a fuzzy edge:
 *
 *   28px → π·28 = 88px of circumference  → 3.7px per tick   (muddy)
 *   36px → π·36 = 113px                  → 4.7px per tick   (clean)
 *   44px → π·44 = 138px                  → 5.8px per tick   (clean, and the
 *                                                            mark carries the
 *                                                            footer on its own)
 *
 * Neither bump can shift layout: the nav is a fixed h-14/h-16, so a 36px mark
 * has 10px of slack at the tightest, and the footer lockup sits in normal flow
 * above a tagline with no height constraint to violate. Zero CLS either way.
 *
 * The nav type went 16px → 18px with it. Not to keep pace — the mark is meant to
 * lead its label, the aperture is the brand and the words are the caption — but
 * because at 16px against a 36px mark the lockup tipped from "mark-led" to
 * "mark-heavy". 2:1 reads as hierarchy; 2.25:1 read as a mismatch. The footer is
 * already at 44/24 ≈ 1.8 and needs nothing.
 */
const SIZES: Record<WordmarkSize, { mark: string; text: string; gap: string }> =
  {
    sm: { mark: 'size-9', text: 'text-lg', gap: 'gap-2.5' },
    lg: { mark: 'size-11', text: 'text-2xl', gap: 'gap-3' },
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
 * The path data itself lives in `./aperture-paths`, shared with the animated
 * mark — see that file for how each number was derived. Re-exported below so
 * `wordmark` stays the one place to import the mark's geometry from.
 */
export { BLADE_SEAMS, OPENING_BLADES, OPENING_IRIS };

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
  /**
   * Use the cymatic morphing mark instead of the static one: it renders as the
   * identical coral aperture and then cycles through six resonance figures every
   * 21s. First paint is byte-identical to the static mark, so this is free of
   * hydration mismatch and CLS; `prefers-reduced-motion` and offscreen instances
   * never animate. See `aperture-motion.tsx`.
   */
  animated?: boolean;
}

export function Wordmark({
  size = 'sm',
  text = 'Media Manipulator',
  showText = true,
  animated = false,
  className,
  ...props
}: WordmarkProps) {
  const s = SIZES[size];
  // The animated mark's stage 0 is the six-blade drawing specifically. If
  // APERTURE is flipped back to 'iris', animation silently stands down rather
  // than morphing out of a shape the site isn't showing — the one-word revert
  // above still reverts everything.
  const morphing = animated && APERTURE === 'blades';
  const split = text.lastIndexOf(' ');
  const lead = split > 0 ? text.slice(0, split) : text;
  const trail = split > 0 ? text.slice(split + 1) : '';

  return (
    <span
      className={cn('inline-flex items-center', s.gap, className)}
      {...props}
    >
      {morphing ? (
        <AnimatedApertureMark className={s.mark} />
      ) : (
        <ApertureMark className={s.mark} />
      )}

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
