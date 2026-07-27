import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Stat — a label/value pair for the measured metadata the tools display
 * everywhere: dimensions, duration, bitrate, size, codec, sample rate.
 *
 * Material rule 4 of the Darkroom system: every number in the product is
 * monospace with tabular figures. This is the single highest-leverage detail for
 * the "professional instrument" read, and it also stops values from jittering as
 * they update during a conversion, because tabular digits are equal-width.
 */

type StatAccent = 'default' | 'data' | 'premium' | 'primary' | 'danger';

const VALUE_TONE: Record<StatAccent, string> = {
  default: 'text-foreground',
  data: 'text-data',
  premium: 'text-premium',
  primary: 'text-primary',
  danger: 'text-destructive',
};

export interface StatProps extends React.ComponentProps<'div'> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Tints the value only — the label stays quiet so rows still scan. */
  accent?: StatAccent;
  /** Label above value (default) or side by side. */
  orientation?: 'stacked' | 'inline';
  /**
   * Wrap the value instead of truncating it. Use for values whose length is
   * unbounded (raw metadata, MIME strings, file paths) where clipping would
   * hide information rather than tidy it.
   */
  wrap?: boolean;
}

export function Stat({
  label,
  value,
  accent = 'default',
  orientation = 'stacked',
  wrap = false,
  className,
  ...props
}: StatProps) {
  return (
    <div
      data-slot="stat"
      className={cn(
        orientation === 'stacked'
          ? 'flex flex-col gap-0.5'
          : 'flex items-baseline justify-between gap-3',
        'min-w-0',
        className
      )}
      {...props}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          'num text-sm',
          wrap ? 'break-words' : 'truncate',
          VALUE_TONE[accent]
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default Stat;
