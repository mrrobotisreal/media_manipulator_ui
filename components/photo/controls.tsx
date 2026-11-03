'use client';

import * as React from 'react';

import { Slider } from '@/components/ui/slider';
import { useLocalization } from '@/i18n/useLocalization';
import { usePhotoStore } from '@/lib/photo/photoStore';
import { cn } from '@/lib/utils';

/**
 * AdjustSlider: the editor's one slider (ticket MM97 decision 9). A Radix
 * slider plus a numeric input; double-click resets to the default; arrow keys
 * step; a whole drag (pointer down → up) lands as ONE undo entry through the
 * store's gesture API.
 */
export interface AdjustSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  defaultValue: number;
  /** Called on every change (drag, keys, typing). */
  onChange: (value: number) => void;
  /** Undo label for the gesture (default: the label). */
  gestureLabel?: string;
  /** Decimal places shown in the numeric field. */
  decimals?: number;
  unit?: string;
  className?: string;
  /** Track tint for hue/temperature style sliders. */
  trackClassName?: string;
  disabled?: boolean;
}

export function clampStep(v: number, min: number, max: number, step: number): number {
  const snapped = Math.round(v / step) * step;
  const decimals = (String(step).split('.')[1] ?? '').length;
  return Math.min(max, Math.max(min, Number(snapped.toFixed(decimals))));
}

export function AdjustSlider({ label, value, min, max, step = 1, defaultValue, onChange, gestureLabel, decimals, unit, className, disabled }: AdjustSliderProps) {
  const { t } = useLocalization('interface');
  const id = React.useId();
  const active = React.useRef(false);
  const dp = decimals ?? (String(step).split('.')[1] ?? '').length;
  const [text, setText] = React.useState<string | null>(null);

  const begin = () => {
    if (active.current) return;
    active.current = true;
    usePhotoStore.getState().beginGesture(gestureLabel ?? label);
  };
  const end = () => {
    if (!active.current) return;
    active.current = false;
    usePhotoStore.getState().endGesture();
  };
  React.useEffect(() => () => end(), []);

  const apply = (v: number) => {
    begin();
    onChange(clampStep(v, min, max, step));
  };

  return (
    <div className={cn('space-y-1', className)} data-testid="adjust-slider">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="truncate text-xs text-muted-foreground" onDoubleClick={() => { apply(defaultValue); end(); }}>
          {label}
        </label>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          aria-label={label}
          disabled={disabled}
          className="h-6 w-16 rounded border border-edge bg-surface-2 px-1 text-right font-mono text-xs tabular-nums text-foreground"
          min={min}
          max={max}
          step={step}
          value={text ?? value.toFixed(dp)}
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => {
            setText(e.target.value);
            const n = Number(e.target.value);
            if (e.target.value.trim() !== '' && Number.isFinite(n)) apply(n);
          }}
          onBlur={() => {
            setText(null);
            end();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur();
          }}
        />
        {unit ? <span className="sr-only">{unit}</span> : null}
      </div>
      <div onDoubleClick={() => { apply(defaultValue); end(); }} title={t('photo.slider.reset')}>
        <Slider
          aria-label={label}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={(v) => apply(v[0])}
          onValueCommit={end}
        />
      </div>
    </div>
  );
}

/** A collapsible-looking section header used by every panel. */
export function PanelSection({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="space-y-3 border-b border-edge px-3 py-3" aria-label={title}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function ToggleChip({ pressed, onClick, children, disabled, className }: { pressed: boolean; onClick: () => void; children: React.ReactNode; disabled?: boolean; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'min-h-8 rounded-full border px-3 text-xs transition-colors',
        pressed ? 'border-primary bg-primary/15 text-foreground' : 'border-edge bg-surface-2 text-muted-foreground hover:text-foreground',
        className,
      )}
    >
      {children}
    </button>
  );
}
