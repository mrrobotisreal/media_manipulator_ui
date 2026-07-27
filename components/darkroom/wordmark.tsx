import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Wordmark — replaces the glitch-face brand type (Rubik Glitch, 407 KB for two
 * words) and the unsized 80×80 image tag that was 22% of a 360px viewport.
 *
 * An aperture mark in safelight coral plus a two-tone type lockup. The mark is
 * two geometric shapes — a ring and a hexagonal iris — chosen because they stay
 * crisp at 20px, where blade-and-spoke aperture drawings turn to mud. Nothing
 * here needs a webfont beyond Inter, and nothing here is a raster asset.
 *
 * The brand string is passed in rather than read from i18n so this can stay a
 * server component; call sites keep using `t('interface:common.brand')`.
 * Splitting on the last space keeps the two-tone treatment working for a
 * translated brand, and degrades to a single tone if there is no space.
 */

type WordmarkSize = 'sm' | 'lg';

const SIZES: Record<WordmarkSize, { mark: string; text: string; gap: string }> =
  {
    sm: { mark: 'size-6', text: 'text-base', gap: 'gap-2' },
    lg: { mark: 'size-9', text: 'text-2xl', gap: 'gap-2.5' },
  };

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
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        className={cn('shrink-0 text-primary', s.mark)}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {/* Hexagonal iris — flat-top hexagon, r = 4.6 */}
        <path
          d="M16.6 12 14.3 15.98H9.7L7.4 12l2.3-3.98h4.6z"
          fill="currentColor"
        />
      </svg>

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
