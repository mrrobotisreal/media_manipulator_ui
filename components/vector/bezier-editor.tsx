'use client';

import * as React from 'react';

import { useLocalization } from '@/i18n/useLocalization';
import { CSS_EASE, normalizeBezier, solveCubicBezier, type CubicBezier } from '@/lib/vector/bezier';
import { EASING_PRESETS, type Easing } from '@/lib/vector/vectorTypes';
import { cn } from '@/lib/utils';

/**
 * Easing editor for the selected keyframe segment(s) (ticket MM44 decision 5):
 * the five Darkroom presets + hold, and a cubic-bezier curve with two
 * draggable control handles (the end points are fixed at (0,0) and (1,1), so
 * the four numbers are the two handles) and numeric inputs. x is clamped to
 * [0,1] (CSS); y may overshoot to [-1, 2] in the editor.
 *
 * Controlled: `value` is the easing of the selection (null when the selected
 * segments disagree) and `onChange` applies one easing to all of them.
 * Handle drags call `onDragStart`/`onDragEnd` so the store groups a drag
 * into one undo step.
 */
export interface BezierEditorProps {
  value: Easing | null;
  onChange: (easing: Easing) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  disabled?: boolean;
}

const PRESET_IDS = [...EASING_PRESETS, 'hold'] as const;
const SIZE = 160;
const PAD = 28;
const Y_MIN = -1;
const Y_MAX = 2;

/** The cubic-bezier a preset approximates, so switching to "custom" starts from it. */
function curveOf(e: Easing | null): CubicBezier {
  if (!e) return CSS_EASE;
  if (typeof e === 'object') return normalizeBezier(e.cubicBezier);
  switch (e) {
    case 'easeIn':
      return [0.333, 0, 0.667, 0.333]; // the quadratic f², exactly, as a cubic
    case 'easeOut':
      return [0.333, 0.667, 0.667, 1];
    case 'easeBoth':
      return [0.45, 0, 0.55, 1];
    default:
      return [0, 0, 1, 1];
  }
}

const round3 = (v: number) => Math.round(v * 1000) / 1000;

export function BezierEditor({ value, onChange, onDragStart, onDragEnd, disabled }: BezierEditorProps) {
  const { t } = useLocalization('interface');
  const svgRef = React.useRef<SVGSVGElement>(null);
  const dragging = React.useRef<0 | 1 | null>(null);
  const curve = curveOf(value);
  const custom = value !== null && typeof value === 'object';
  const toX = (x: number) => PAD + x * (SIZE - PAD * 2);
  const toY = (y: number) => SIZE - PAD - ((y - 0) / 1) * (SIZE - PAD * 2);
  const fromPoint = (clientX: number, clientY: number) => {
    const r = svgRef.current?.getBoundingClientRect();
    const sx = ((clientX - (r?.left ?? 0)) / (r?.width || SIZE)) * SIZE;
    const sy = ((clientY - (r?.top ?? 0)) / (r?.height || SIZE)) * SIZE;
    const x = Math.min(1, Math.max(0, (sx - PAD) / (SIZE - PAD * 2)));
    const y = Math.min(Y_MAX, Math.max(Y_MIN, (SIZE - PAD - sy) / (SIZE - PAD * 2)));
    return { x: round3(x), y: round3(y) };
  };

  const setCurve = (c: readonly number[]) => onChange({ cubicBezier: [...normalizeBezier(c)] as [number, number, number, number] });

  const samples = Array.from({ length: 41 }, (_, i) => i / 40);
  const path = value === 'hold'
    ? `M${toX(0)} ${toY(0)} H${toX(1)} V${toY(1)}`
    : samples.map((x, i) => `${i ? 'L' : 'M'}${toX(x).toFixed(2)} ${toY(solveCubicBezier(curve, x)).toFixed(2)}`).join(' ');

  const onPointerDown = (handle: 0 | 1) => (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    dragging.current = handle;
    onDragStart?.();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current === null) return;
    const p = fromPoint(e.clientX, e.clientY);
    const next = [...curve];
    next[dragging.current * 2] = p.x;
    next[dragging.current * 2 + 1] = p.y;
    setCurve(next);
  };
  const onPointerUp = () => {
    if (dragging.current === null) return;
    dragging.current = null;
    onDragEnd?.();
  };

  const handles: Array<[number, number]> = [
    [curve[0], curve[1]],
    [curve[2], curve[3]],
  ];

  return (
    <div className="space-y-2" data-testid="bezier-editor">
      <div role="group" aria-label={t('vector.easing.presets')} className="grid grid-cols-3 gap-1">
        {PRESET_IDS.map((id) => (
          <button
            key={id}
            type="button"
            disabled={disabled}
            aria-pressed={value === id}
            onClick={() => onChange(id)}
            className={cn(
              'h-7 rounded-md border border-edge text-[11px] text-muted-foreground hover:bg-surface-2 disabled:opacity-40',
              value === id && 'border-edge-strong bg-surface-3 text-foreground',
            )}
          >
            {t(`vector.easing.${id}`)}
          </button>
        ))}
        <button
          type="button"
          disabled={disabled}
          aria-pressed={custom}
          onClick={() => setCurve(curve)}
          className={cn(
            'h-7 rounded-md border border-edge text-[11px] text-muted-foreground hover:bg-surface-2 disabled:opacity-40',
            custom && 'border-edge-strong bg-surface-3 text-foreground',
          )}
        >
          {t('vector.easing.custom')}
        </button>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-48 touch-none rounded-md border border-edge bg-surface-2"
        role="img"
        aria-label={t('vector.easing.curve')}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <rect x={toX(0)} y={toY(1)} width={toX(1) - toX(0)} height={toY(0) - toY(1)} fill="none" stroke="var(--edge-control)" strokeDasharray="2 3" />
        <line x1={toX(0)} y1={toY(0)} x2={toX(1)} y2={toY(1)} stroke="var(--edge-control)" strokeOpacity={0.6} />
        <path d={path} fill="none" stroke="var(--accent-data)" strokeWidth={2} />
        {value !== 'hold' &&
          handles.map(([hx, hy], i) => (
            <g key={i}>
              <line x1={toX(i)} y1={toY(i)} x2={toX(hx)} y2={toY(hy)} stroke="var(--accent-primary)" strokeOpacity={0.7} />
              <circle
                data-testid={`bezier-handle-${i + 1}`}
                cx={toX(hx)}
                cy={toY(hy)}
                r={6}
                fill="var(--surface-1)"
                stroke="var(--accent-primary)"
                strokeWidth={2}
                style={{ cursor: disabled ? 'default' : 'grab' }}
                onPointerDown={onPointerDown(i as 0 | 1)}
              />
            </g>
          ))}
        <circle cx={toX(0)} cy={toY(0)} r={3} fill="var(--accent-data)" />
        <circle cx={toX(1)} cy={toY(1)} r={3} fill="var(--accent-data)" />
      </svg>
      <div className="grid grid-cols-4 gap-1">
        {(['x1', 'y1', 'x2', 'y2'] as const).map((k, i) => (
          <label key={k} className="flex min-w-0 flex-col gap-0.5">
            <span className="font-mono text-[10px] text-text-subtle">{k}</span>
            <input
              type="number"
              step={0.05}
              min={i % 2 === 0 ? 0 : Y_MIN}
              max={i % 2 === 0 ? 1 : Y_MAX}
              disabled={disabled || value === 'hold'}
              aria-label={t('vector.easing.handle', { name: k })}
              value={round3(curve[i])}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (e.target.value.trim() === '' || !Number.isFinite(n)) return;
                const next = [...curve];
                next[i] = i % 2 === 0 ? Math.min(1, Math.max(0, n)) : Math.min(Y_MAX, Math.max(Y_MIN, n));
                setCurve(next);
              }}
              className="h-7 w-full min-w-0 rounded-md border border-edge bg-surface-2 px-1 font-mono text-[11px] tabular-nums outline-none focus-visible:border-data disabled:opacity-40"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
