'use client';

import * as React from 'react';

import { useLocalization } from '@/i18n/useLocalization';
import { IDENTITY_CURVE, insertPoint, isIdentityCurve, movePoint, removePoint } from '@/lib/photo/curveEdit';
import { buildCurveLut } from '@/lib/photo/colorMath';
import type { CurvePoint } from '@/lib/photo/photoTypes';
import { usePhotoStore } from '@/lib/photo/photoStore';
import { cn } from '@/lib/utils';
import { PanelSection, ToggleChip } from '../controls';
import { useAdjustment } from '../use-adjustment';

type Channel = 'master' | 'r' | 'g' | 'b';
const CHANNELS: Channel[] = ['master', 'r', 'g', 'b'];
const STROKE: Record<Channel, string> = { master: 'currentColor', r: '#ef4444', g: '#22c55e', b: '#3b82f6' };
const SIZE = 256;

export function CurvesPanel({ pickedValue, onRequestPick }: { pickedValue?: { r: number; g: number; b: number } | null; onRequestPick?: () => void }) {
  const { t } = useLocalization('interface');
  const { params, update, remove, layer } = useAdjustment('curves');
  const [channel, setChannel] = React.useState<Channel>('master');
  const [drag, setDrag] = React.useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const points: CurvePoint[] = params[channel].points;

  const setPoints = (next: CurvePoint[], label = 'Curves') => {
    if (next === points) return;
    update(label, channel, (p) => ({ ...p, [channel]: { ...p[channel], points: next } }));
  };

  const toUnit = (e: { clientX: number; clientY: number }) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r || r.width === 0) return { x: 0, y: 0 };
    return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
  };

  // Eyedropper hand-off: a picked pixel adds a point on the current curve.
  React.useEffect(() => {
    if (!pickedValue) return;
    const v = channel === 'master' ? 0.2126 * pickedValue.r + 0.7152 * pickedValue.g + 0.0722 * pickedValue.b : pickedValue[channel];
    const x = v / 255;
    const lut = buildCurveLut(points);
    const y = lut[Math.round(x * 255)];
    const ins = insertPoint(points, x, y);
    if (ins.index >= 0) setPoints(ins.points, 'Curves');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedValue]);

  const lut = React.useMemo(() => buildCurveLut(points), [points]);
  const path = React.useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i < 256; i += 4) pts.push(`${i === 0 ? 'M' : 'L'}${(i / 255) * SIZE},${SIZE - lut[i] * SIZE}`);
    pts.push(`L${SIZE},${SIZE - lut[255] * SIZE}`);
    return pts.join(' ');
  }, [lut]);

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const u = toUnit(e);
    let idx = points.findIndex((p) => Math.hypot(p.x - u.x, p.y - u.y) < 0.045);
    if (idx < 0) {
      const ins = insertPoint(points, u.x, u.y);
      if (ins.index < 0) return;
      usePhotoStore.getState().beginGesture('Curves');
      setPoints(ins.points);
      idx = ins.index;
    } else {
      usePhotoStore.getState().beginGesture('Curves');
    }
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDrag(idx);
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (drag === null) return;
    const u = toUnit(e);
    setPoints(movePoint(points, drag, u.x, u.y));
  };
  const onUp = () => {
    if (drag === null) return;
    setDrag(null);
    usePhotoStore.getState().endGesture();
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const step = e.shiftKey ? 0.05 : 0.01;
    const p = points[i];
    if (e.key === 'ArrowUp') setPoints(movePoint(points, i, p.x, p.y + step));
    else if (e.key === 'ArrowDown') setPoints(movePoint(points, i, p.x, p.y - step));
    else if (e.key === 'ArrowLeft') setPoints(movePoint(points, i, p.x - step, p.y));
    else if (e.key === 'ArrowRight') setPoints(movePoint(points, i, p.x + step, p.y));
    else if (e.key === 'Delete' || e.key === 'Backspace') setPoints(removePoint(points, i));
    else return;
    e.preventDefault();
  };

  return (
    <div data-testid="panel-curves">
      <PanelSection
        title={t('photo.panels.curves')}
        actions={
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
            disabled={!layer}
            onClick={() => (isIdentityCurve(points) ? undefined : setPoints(IDENTITY_CURVE.map((p) => ({ ...p })), 'Reset curve'))}
          >
            {t('photo.curves.reset')}
          </button>
        }
      >
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('photo.panels.curves')}>
          {CHANNELS.map((c) => (
            <ToggleChip key={c} pressed={channel === c} onClick={() => setChannel(c)}>
              {t(`photo.curves.channel.${c}`)}
            </ToggleChip>
          ))}
        </div>
        <div dir="ltr">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="application"
            aria-label={t('photo.curves.graph')}
            className="aspect-square w-full touch-none rounded border border-edge bg-surface-2"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            {[0.25, 0.5, 0.75].map((g) => (
              <g key={g} className="stroke-edge" strokeWidth={1}>
                <line x1={g * SIZE} y1={0} x2={g * SIZE} y2={SIZE} />
                <line x1={0} y1={g * SIZE} x2={SIZE} y2={g * SIZE} />
              </g>
            ))}
            <line x1={0} y1={SIZE} x2={SIZE} y2={0} className="stroke-edge" strokeDasharray="4 4" />
            <path d={path} fill="none" stroke={STROKE[channel]} strokeWidth={2} className="text-foreground" />
            {points.map((p, i) => (
              <circle
                key={i}
                data-testid={`curve-point-${i}`}
                role="slider"
                tabIndex={0}
                aria-label={t('photo.curves.point', { index: i + 1 })}
                aria-valuenow={Math.round(p.y * 100)}
                cx={p.x * SIZE}
                cy={SIZE - p.y * SIZE}
                r={6}
                className={cn('cursor-grab fill-background stroke-primary outline-none focus-visible:stroke-[3]', drag === i && 'fill-primary')}
                strokeWidth={2}
                onKeyDown={(e) => onKey(e, i)}
                onDoubleClick={() => setPoints(removePoint(points, i))}
              />
            ))}
          </svg>
        </div>
        {onRequestPick ? (
          <button type="button" className="text-xs text-primary hover:underline" onClick={onRequestPick}>
            {t('photo.curves.pick')}
          </button>
        ) : null}
        {layer && !isIdentityCurve(params.master.points) ? null : null}
        <button type="button" className="hidden" onClick={remove} aria-hidden="true" tabIndex={-1} />
      </PanelSection>
    </div>
  );
}
