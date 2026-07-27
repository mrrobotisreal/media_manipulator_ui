import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Panel — the Darkroom Instrument container. Replaces all 56 call sites of the
 * old image-based frame classes, which drew their structure from remote
 * border-image WebP files and ate 24–32px of real layout space on every side.
 *
 * Structure here comes from a 1px hairline plus an inset top bevel. Nothing
 * glows at rest; `interactive` adds the hover glow.
 *
 * Migration map from the retired frame classes:
 *   (base frame)   → <Panel level="1">
 *   -inner         → <Panel level="2">
 *   -inner-inner   → <Panel level="2" muted>
 *   -green         → <Panel level="1" accent="data">
 *
 * Responsive padding is built in on purpose. The old call sites hand-rolled
 * `p-12` (96px — 26.7% of a 360px viewport); Panel owns spacing so that bug
 * cannot come back one file at a time. Pass `padding={false}` for panels that
 * host edge-to-edge content such as the timeline.
 */

type PanelLevel = '1' | '2';
type PanelAccent = 'primary' | 'data' | 'premium';

const GLOW: Record<PanelAccent, string> = {
  primary: 'hover:shadow-[var(--glow-primary)]',
  data: 'hover:shadow-[var(--glow-data)]',
  premium: 'hover:shadow-[var(--glow-premium)]',
};

const RAIL: Record<PanelAccent, string> = {
  primary: 'border-l-2 border-l-primary',
  data: 'border-l-2 border-l-data',
  premium: 'border-l-2 border-l-premium',
};

export interface PanelProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Elevation. 1 = panel on the page, 2 = raised control inside a panel. */
  level?: PanelLevel;
  /** Accent-left-rail marking the active panel. One at a time per region. */
  accent?: PanelAccent;
  /** Quieter level-2 fill, for a third level of nesting. */
  muted?: boolean;
  /** Adds the hover glow. Only for panels that are genuinely clickable. */
  interactive?: boolean;
  /** Built-in responsive padding. Disable for edge-to-edge content. */
  padding?: boolean;
  /** Optional header row with a hairline underline. */
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  /** Heading level for `title`, so nesting stays valid for a11y and SEO. */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  as?: 'div' | 'section' | 'article' | 'aside';
}

export function Panel({
  level = '1',
  accent,
  muted = false,
  interactive = false,
  padding = true,
  title,
  eyebrow,
  titleAs: TitleTag = 'h2',
  as: Component = 'div',
  className,
  children,
  ...props
}: PanelProps) {
  const hasHeader = Boolean(title || eyebrow);

  return (
    <Component
      data-slot="panel"
      data-level={level}
      className={cn(
        'border border-edge',
        level === '1'
          ? 'rounded-lg bg-surface-1 shadow-[inset_0_1px_0_var(--edge-highlight)]'
          : 'rounded-md',
        level === '2' && (muted ? 'bg-surface-1/60' : 'bg-surface-2'),
        padding && 'p-4 sm:p-6 lg:p-8',
        accent && RAIL[accent],
        interactive && [
          'transition-shadow duration-[var(--dur-base)] ease-[var(--ease-instrument)]',
          GLOW[accent ?? 'primary'],
        ],
        className
      )}
      {...props}
    >
      {hasHeader && (
        <div className="mb-6 border-b border-edge pb-4">
          {eyebrow && (
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {eyebrow}
            </p>
          )}
          {title && (
            <TitleTag
              className={cn(
                'text-xl font-semibold tracking-tight text-foreground',
                eyebrow && 'mt-1.5'
              )}
            >
              {title}
            </TitleTag>
          )}
        </div>
      )}
      {children}
    </Component>
  );
}

export default Panel;
