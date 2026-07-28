'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { ProcessingIndicator } from './processing-indicator';

export interface PanelLoadingProps {
  /** What is arriving, in the product's own words: "Loading the video form…". */
  label: string;
  /**
   * `block` — a standalone surface for a whole tool island.
   * `inline` — a form slot inside a panel that already has its own surface.
   */
  variant?: 'block' | 'inline';
  className?: string;
}

/**
 * The single loading state for a code-split panel.
 *
 * Every tool surface in the app is behind a dynamic import, so this is what a
 * visitor sees for the few hundred milliseconds before the panel arrives. It
 * reserves height on purpose — a zero-height loader that pops into a 400px
 * form is a layout shift, and CLS is part of the Lighthouse budget.
 *
 * Motion is the 16px `ProcessingIndicator` ring and nothing else; the global
 * `prefers-reduced-motion` guard neutralises it.
 */
export function PanelLoading({ label, variant = 'block', className }: PanelLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center justify-center gap-3 text-sm text-muted-foreground',
        variant === 'block'
          ? 'my-6 min-h-[200px] rounded-lg border border-edge bg-surface-1 p-8 shadow-[inset_0_1px_0_var(--edge-highlight)]'
          : 'min-h-[140px] py-8',
        className,
      )}
    >
      <ProcessingIndicator compact aria-label={label} />
      <span>{label}</span>
    </div>
  );
}

export default PanelLoading;
