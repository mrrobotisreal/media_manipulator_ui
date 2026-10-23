'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { useLocalization } from '@/i18n/useLocalization';
import { clampWipe, clipPathForWipe, stepWipe, WIPE_KEYS, wipeFromPointer } from '@/lib/results/compare';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from './use-reduced-motion';

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
  const { t } = useLocalization('interface');
  const reduced = usePrefersReducedMotion();
  const [inner, setInner] = useState(() => clampWipe(defaultValue));
  const pct = clampWipe(value ?? inner);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

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
  const shownPct = !reduced && !revealed && !settled ? 100 : pct;

  const commit = useCallback(
    (next: number) => {
      setRevealed(true);
      setSettled(true);
      setInner(next);
      onChange?.(next);
    },
    [onChange],
  );

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== undefined && e.button > 0) return;
    dragging.current = true;
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // Synthetic or already-released pointers throw; dragging still works via move events.
    }
    const rect = stageRef.current?.getBoundingClientRect();
    if (rect) commit(wipeFromPointer(e.clientX, rect));
    e.currentTarget.querySelector<HTMLElement>('[role="slider"]')?.focus({ preventScroll: true });
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (rect) commit(wipeFromPointer(e.clientX, rect));
  };
  const release = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      // Already released.
    }
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!WIPE_KEYS.has(e.key)) return;
    e.preventDefault();
    commit(stepWipe(pct, e.key, e.shiftKey));
  };

  const rounded = Math.round(pct);
  return (
    <div
      ref={stageRef}
      className={cn('relative w-full select-none overflow-hidden rounded-lg border border-edge bg-background', className)}
      style={{ aspectRatio, touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      data-testid="compare-slider"
    >
      <div className="flex h-full w-full items-center justify-center">{after}</div>
      <div
        className={cn('absolute inset-0 flex items-center justify-center', animate ? 'mm-compare-reveal' : undefined)}
        style={{
          clipPath: clipPathForWipe(shownPct, 'ltr'),
          transition: reduced || !animate ? undefined : 'clip-path 600ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        data-testid="compare-before"
      >
        {before}
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-primary shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
        style={{
          left: `${shownPct}%`,
          transition: reduced || !animate ? undefined : 'left 600ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <div
          role="slider"
          tabIndex={0}
          aria-label={t('resultPanel.compareModes.slider')}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={rounded}
          aria-valuetext={t('resultPanel.compareModes.sliderValue', {
            before: beforeLabel,
            after: afterLabel,
            beforePct: String(rounded),
            afterPct: String(100 - rounded),
          })}
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border-2 border-primary bg-surface-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          style={{ touchAction: 'none' }}
        >
          <span aria-hidden="true">&#8596;</span>
        </div>
      </div>
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
