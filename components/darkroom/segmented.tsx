'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Segmented — the Darkroom replacement for the `.gl-radio` glass radio group
 * (137 lines of CSS reproducing a radio group, with a blurred pseudo-element
 * under every option).
 *
 * Built on native `<input type="radio">` rather than a Radix primitive for two
 * reasons: it adds no dependency, and native radios already give correct roving
 * arrow-key focus and form participation, which a hand-rolled version has to
 * reimplement and usually gets wrong.
 *
 * Two layouts, because the real call sites need both:
 *  - `horizontal` — a compact track with a sliding indicator, for short labels.
 *    Segments are equal-width, so the indicator can translate by
 *    `index * 100%` with no measuring, ResizeObserver, or layout thrash.
 *  - `vertical` — option cards with icon, title and description (what
 *    transcribe-form actually renders). Selection is marked by the accent rail
 *    rather than a sliding pill, which does not read correctly stacked.
 */

type Orientation = 'horizontal' | 'vertical';

export interface SegmentedOption<T extends string> {
  value: T;
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedProps<T extends string> {
  /** Radio group name. Must be unique on the page. */
  name: string;
  value: T;
  onValueChange: (value: T) => void;
  options: SegmentedOption<T>[];
  orientation?: Orientation;
  /** Accessible name for the group. */
  label?: string;
  className?: string;
}

const FOCUS =
  'has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-primary has-[input:focus-visible]:outline-offset-2';

export function Segmented<T extends string>({
  name,
  value,
  onValueChange,
  options,
  orientation = 'horizontal',
  label,
  className,
}: SegmentedProps<T>) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );

  if (orientation === 'vertical') {
    return (
      <div
        role="radiogroup"
        aria-label={label}
        className={cn('grid gap-2', className)}
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <label
              key={option.value}
              className={cn(
                'relative flex cursor-pointer gap-3 rounded-md border p-3',
                'transition-colors duration-[var(--dur-fast)] ease-[var(--ease-instrument)]',
                selected
                  ? 'border-edge-strong border-l-2 border-l-primary bg-surface-2'
                  : 'border-edge hover:border-edge-strong hover:bg-surface-2/60',
                option.disabled && 'pointer-events-none opacity-50',
                FOCUS
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                disabled={option.disabled}
                onChange={() => onValueChange(option.value)}
                className="sr-only"
              />
              {/* Radio mark, drawn rather than relying on the native control. */}
              <span
                aria-hidden="true"
                className={cn(
                  'mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border',
                  selected ? 'border-primary' : 'border-control'
                )}
              >
                {selected && (
                  <span className="size-2 rounded-full bg-primary" />
                )}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  {option.icon}
                  {option.label}
                </span>
                {option.description && (
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'relative grid rounded-md border border-edge bg-surface-2 p-0.5',
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
    >
      {/* Sliding indicator. Equal-width segments make translateX exact. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0.5 left-0.5 rounded-sm bg-surface-3 ring-1 ring-edge-strong transition-transform duration-[var(--dur-fast)] ease-[var(--ease-instrument)]"
        style={{
          width: `calc((100% - 0.25rem) / ${options.length})`,
          transform: `translateX(${selectedIndex * 100}%)`,
        }}
      />
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              'relative z-10 flex cursor-pointer items-center justify-center gap-1.5 rounded-sm px-3 py-1.5 text-center text-sm',
              'transition-colors duration-[var(--dur-fast)] ease-[var(--ease-instrument)]',
              selected
                ? 'font-medium text-foreground'
                : 'text-muted-foreground hover:text-foreground',
              option.disabled && 'pointer-events-none opacity-50',
              FOCUS
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              disabled={option.disabled}
              onChange={() => onValueChange(option.value)}
              className="sr-only"
            />
            {option.icon}
            {option.label}
          </label>
        );
      })}
    </div>
  );
}

export default Segmented;
