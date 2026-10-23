'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { clampWipe, clipPathForWipe } from '@/lib/results/compare';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from './use-reduced-motion';
import { useWipePointer, WipeHandle } from './wipe-handle';

export interface CompareSliderProps {
  /** Left of the handle (Original). */
  before: ReactNode;
  /** Right of the handle (Result). */
  after: ReactNode;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  beforeLabel: string;
  afterLabel: string;
  /** CSS aspect-ratio of the stage, e.g. `4 / 3`. Omit to size to the content. */
  aspectRatio?: string;
  className?: string;
}

/**
 * Wipe compare. Both layers fill the stage; the top one (`before`) is clipped so its left
 * `value`% shows. The handle is the only focusable element and the only `role="slider"`.
 */
export function CompareSlider({
  before,
  after,
  value,
  defaultValue = 50,
  onChange,
  beforeLabel,
  afterLabel,
  aspectRatio,
  className,
}: CompareSliderProps) {
  const reduced = usePrefersReducedMotion();
  const [inner, setInner] = useState(() => clampWipe(defaultValue));
  const pct = clampWipe(value ?? inner);
  const stageRef = useRef<HTMLDivElement>(null);

  // Initial reveal: start with only `before` showing and ease to the value, once.
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);
  const animate = !reduced && !settled;
  useEffect(() => {
    if (reduced) return;
    const raf = requestAnimationFrame(() => setRevealed(true));
    const timer = setTimeout(() => setSettled(true), 700);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [reduced]);
  const shownPct = animate && !revealed ? 100 : pct;

  const commit = (next: number) => {
    setRevealed(true);
    setSettled(true);
    setInner(next);
    onChange?.(next);
  };
  const pointer = useWipePointer(stageRef, commit);

  return (
    <div
      ref={stageRef}
      className={cn('relative w-full select-none overflow-hidden rounded-lg border border-edge bg-background', className)}
      style={{ aspectRatio, touchAction: 'none' }}
      data-testid="compare-slider"
      {...pointer}
    >
      <div className="flex h-full w-full items-center justify-center">{after}</div>
      <div
        className={cn('absolute inset-0 flex items-center justify-center', animate ? 'mm-compare-reveal' : undefined)}
        style={{
          clipPath: clipPathForWipe(shownPct, 'ltr'),
          transition: animate ? 'clip-path 600ms cubic-bezier(0.2, 0.8, 0.2, 1)' : undefined,
        }}
        data-testid="compare-before"
      >
        {before}
      </div>
      <WipeHandle
        value={pct}
        displayValue={shownPct}
        animated={animate}
        onChange={commit}
        beforeLabel={beforeLabel}
        afterLabel={afterLabel}
      />
      <span className="pointer-events-none absolute top-2 left-2 rounded bg-background/80 px-2 py-0.5 text-xs text-foreground">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute top-2 right-2 rounded bg-background/80 px-2 py-0.5 text-xs text-foreground">
        {afterLabel}
      </span>
    </div>
  );
}

export default CompareSlider;
