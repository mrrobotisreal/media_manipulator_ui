'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * ProcessingIndicator — the single Darkroom progress affordance. Replaces the
 * atom loader (animated `clip-path`, infinite), the dual-ring `.loader`, and the
 * gooey blob sphere (animated `filter`, infinite, on the home page).
 *
 * Everything here animates `transform` or `opacity` only, so it stays on the
 * compositor. The determinate fill in particular uses `scaleX()` — never
 * `width`, which the old `.progress-loader` animated and which forces layout on
 * every frame.
 *
 * The global `prefers-reduced-motion` guard in globals.css neutralises the
 * sweep and the spin automatically; no per-component logic needed.
 */

type Accent = 'primary' | 'data';

const FILL: Record<Accent, string> = {
  primary: 'bg-primary',
  data: 'bg-data',
};

const SWEEP: Record<Accent, string> = {
  primary:
    'bg-[linear-gradient(90deg,transparent,rgba(255,107,74,0.85),transparent)]',
  data: 'bg-[linear-gradient(90deg,transparent,rgba(94,234,212,0.85),transparent)]',
};

const RING: Record<Accent, string> = {
  primary: 'border-t-primary',
  data: 'border-t-data',
};

export interface ProcessingIndicatorProps {
  /**
   * Completion 0–100. Omit for indeterminate — the caller genuinely does not
   * know the progress, rather than passing 0.
   */
  value?: number;
  /** 16px ring for inline use inside buttons and rows. */
  compact?: boolean;
  /** Visible text beside the bar. */
  label?: React.ReactNode;
  /** Show the numeric percentage. Determinate only. */
  showValue?: boolean;
  accent?: Accent;
  className?: string;
  /** Accessible name when there is no visible `label`. */
  'aria-label'?: string;
}

export function ProcessingIndicator({
  value,
  compact = false,
  label,
  showValue = true,
  accent = 'primary',
  className,
  'aria-label': ariaLabel,
}: ProcessingIndicatorProps) {
  const isDeterminate = typeof value === 'number' && Number.isFinite(value);
  const pct = isDeterminate ? Math.min(100, Math.max(0, value)) : 0;

  if (compact) {
    return (
      <span
        role="status"
        aria-busy="true"
        aria-label={ariaLabel ?? 'Processing'}
        className={cn(
          'inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-edge-strong',
          RING[accent],
          className
        )}
      />
    );
  }

  return (
    <div className={cn('flex w-full items-center gap-3', className)}>
      <div
        role="progressbar"
        aria-label={ariaLabel ?? (label ? undefined : 'Processing')}
        aria-valuemin={isDeterminate ? 0 : undefined}
        aria-valuemax={isDeterminate ? 100 : undefined}
        aria-valuenow={isDeterminate ? Math.round(pct) : undefined}
        aria-busy={isDeterminate ? undefined : true}
        className="relative h-0.5 min-w-0 flex-1 overflow-hidden rounded-full bg-edge"
      >
        {isDeterminate ? (
          <>
            {/* Composited fill: scaleX only, never width. */}
            <div
              className={cn(
                'absolute inset-0 origin-left transition-transform duration-[var(--dur-base)] ease-[var(--ease-instrument)]',
                FILL[accent]
              )}
              style={{ transform: `scaleX(${pct / 100})` }}
            />
            {/* Safelight scan sweeping the filled region. Width is set on value
                change, not animated, so nothing lays out per frame. */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${pct}%` }}
            >
              <div
                className={cn(
                  'h-full w-full animate-[dr-scan_1.6s_var(--ease-instrument)_infinite]',
                  SWEEP[accent]
                )}
              />
            </div>
          </>
        ) : (
          <div
            className={cn(
              'absolute inset-y-0 left-0 w-[30%] animate-[dr-indeterminate_1.2s_ease-in-out_infinite_alternate]',
              FILL[accent]
            )}
          />
        )}
      </div>

      {(label || (isDeterminate && showValue)) && (
        <div className="flex shrink-0 items-baseline gap-2">
          {label && (
            <span className="text-xs text-muted-foreground">{label}</span>
          )}
          {isDeterminate && showValue && (
            <span className="num text-xs text-foreground">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default ProcessingIndicator;
