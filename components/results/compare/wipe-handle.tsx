'use client';

import { useRef, type KeyboardEvent, type PointerEvent, type RefObject } from 'react';
import { useLocalization } from '@/i18n/useLocalization';
import { clampWipe, stepWipe, WIPE_KEYS, wipeFromPointer } from '@/lib/results/compare';

/** Pointer handlers for a wipe stage: capture on down, follow on move, release on up/cancel. */
export function useWipePointer(stageRef: RefObject<HTMLElement | null>, onChange: (value: number) => void) {
  const dragging = useRef(false);
  const apply = (clientX: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (rect) onChange(wipeFromPointer(clientX, rect));
  };
  return {
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (e.button !== undefined && e.button > 0) return;
      dragging.current = true;
      try {
        e.currentTarget.setPointerCapture?.(e.pointerId);
      } catch {
        // Synthetic or already-released pointers throw; move events still arrive.
      }
      apply(e.clientX);
      e.currentTarget.querySelector<HTMLElement>('[role="slider"]')?.focus({ preventScroll: true });
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      if (dragging.current) apply(e.clientX);
    },
    onPointerUp: release,
    onPointerCancel: release,
  };
  function release(e: PointerEvent<HTMLElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      // Already released.
    }
  }
}

export interface WipeHandleProps {
  value: number;
  onChange: (value: number) => void;
  beforeLabel: string;
  afterLabel: string;
  /** Position to draw at when it differs from `value` (the initial reveal). */
  displayValue?: number;
  animated?: boolean;
}

/** The divider line and its single `role="slider"` knob. Position it inside a `relative` stage. */
export function WipeHandle({ value, onChange, beforeLabel, afterLabel, displayValue, animated }: WipeHandleProps) {
  const { t } = useLocalization('interface');
  const pct = clampWipe(value);
  const rounded = Math.round(pct);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!WIPE_KEYS.has(e.key)) return;
    e.preventDefault();
    onChange(stepWipe(pct, e.key, e.shiftKey));
  };
  return (
    <div
      className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-primary shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
      style={{
        left: `${displayValue ?? pct}%`,
        transition: animated ? 'left 600ms cubic-bezier(0.2, 0.8, 0.2, 1)' : undefined,
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
  );
}
