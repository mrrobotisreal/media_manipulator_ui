'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/i18n/useLocalization';
import type { NormalizedRect } from '@/lib/imageRestoreTypes';

interface CropSelectorProps {
  file: File;
  crop: NormalizedRect | null;
  onCropChange: (crop: NormalizedRect | null) => void;
  /** 0 = auto, or explicit 2 / 4 — drives the estimated output dimensions. */
  scale: number;
  /** Pixel budget from capabilities (output area cap). */
  maxOutputPixels: number;
  disabled?: boolean;
}

type Handle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
type InteractionMode = 'move' | 'draw' | Handle;

interface ActiveInteraction {
  mode: InteractionMode;
  pointerId: number;
  startPointerX: number;
  startPointerY: number;
  startRect: NormalizedRect;
  containerWidth: number;
  containerHeight: number;
}

const MIN_SIZE = 0.02;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const HANDLES: Handle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

const resolveEffectiveScale = (scale: number, cropHeightPx: number): number => {
  if (scale === 0) return cropHeightPx > 0 && cropHeightPx <= 540 ? 4 : 2;
  return scale;
};

// CropSelector shows the uploaded image and lets the user optionally drag a
// single normalized crop rect to focus restoration on. Default is the whole
// image (crop === null). Single-rect variant of the remove-object overlay:
// drag empty space to draw, drag the body to move, drag the 8 handles to
// resize, arrow keys to nudge. The crop is applied server-side on the original
// bytes — never client-side (quality loss).
const CropSelector: React.FC<CropSelectorProps> = ({
  file,
  crop,
  onCropChange,
  scale,
  maxOutputPixels,
  disabled = false,
}) => {
  const { t } = useLocalization('interface');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const interactionRef = useRef<ActiveInteraction | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [natW, setNatW] = useState(0);
  const [natH, setNatH] = useState(0);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const it = interactionRef.current;
      if (!it || event.pointerId !== it.pointerId) return;
      const dx = (event.clientX - it.startPointerX) / it.containerWidth;
      const dy = (event.clientY - it.startPointerY) / it.containerHeight;
      const s = it.startRect;
      let next: NormalizedRect = { ...s };
      switch (it.mode) {
        case 'move': {
          next.x = Math.min(clamp01(s.x + dx), 1 - s.width);
          next.y = Math.min(clamp01(s.y + dy), 1 - s.height);
          break;
        }
        case 'draw':
        case 'se':
          next = { ...s, width: Math.max(MIN_SIZE, Math.min(1 - s.x, s.width + dx)), height: Math.max(MIN_SIZE, Math.min(1 - s.y, s.height + dy)) };
          break;
        case 'e':
          next = { ...s, width: Math.max(MIN_SIZE, Math.min(1 - s.x, s.width + dx)) };
          break;
        case 's':
          next = { ...s, height: Math.max(MIN_SIZE, Math.min(1 - s.y, s.height + dy)) };
          break;
        case 'n': {
          const bottom = s.y + s.height;
          const top = Math.min(clamp01(s.y + dy), bottom - MIN_SIZE);
          next = { ...s, y: top, height: bottom - top };
          break;
        }
        case 'w': {
          const right = s.x + s.width;
          const left = Math.min(clamp01(s.x + dx), right - MIN_SIZE);
          next = { ...s, x: left, width: right - left };
          break;
        }
        case 'ne': {
          const bottom = s.y + s.height;
          const top = Math.min(clamp01(s.y + dy), bottom - MIN_SIZE);
          next = { ...s, y: top, height: bottom - top, width: Math.max(MIN_SIZE, Math.min(1 - s.x, s.width + dx)) };
          break;
        }
        case 'nw': {
          const bottom = s.y + s.height;
          const top = Math.min(clamp01(s.y + dy), bottom - MIN_SIZE);
          const right = s.x + s.width;
          const left = Math.min(clamp01(s.x + dx), right - MIN_SIZE);
          next = { x: left, y: top, width: right - left, height: bottom - top };
          break;
        }
        case 'sw': {
          const right = s.x + s.width;
          const left = Math.min(clamp01(s.x + dx), right - MIN_SIZE);
          next = { ...s, x: left, width: right - left, height: Math.max(MIN_SIZE, Math.min(1 - s.y, s.height + dy)) };
          break;
        }
      }
      onCropChange(next);
    },
    [onCropChange],
  );

  const onPointerUp = useCallback((event: PointerEvent) => {
    const it = interactionRef.current;
    if (!it || event.pointerId !== it.pointerId) return;
    interactionRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  const begin = (event: React.PointerEvent, mode: InteractionMode, rect: NormalizedRect) => {
    if (disabled) return;
    const container = containerRef.current;
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    event.stopPropagation();
    event.preventDefault();
    (event.target as Element).setPointerCapture?.(event.pointerId);
    interactionRef.current = {
      mode,
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startRect: rect,
      containerWidth: bounds.width,
      containerHeight: bounds.height,
    };
  };

  const handleContainerPointerDown = (event: React.PointerEvent) => {
    if (disabled || event.button !== 0) return;
    const container = containerRef.current;
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    const x = clamp01((event.clientX - bounds.left) / bounds.width);
    const y = clamp01((event.clientY - bounds.top) / bounds.height);
    const seed: NormalizedRect = { x, y, width: MIN_SIZE, height: MIN_SIZE };
    onCropChange(seed);
    (event.target as Element).setPointerCapture?.(event.pointerId);
    interactionRef.current = {
      mode: 'draw',
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startRect: seed,
      containerWidth: bounds.width,
      containerHeight: bounds.height,
    };
  };

  const nudge = (dx: number, dy: number) => {
    if (disabled || !crop) return;
    onCropChange({
      ...crop,
      x: Math.min(clamp01(crop.x + dx), 1 - crop.width),
      y: Math.min(clamp01(crop.y + dy), 1 - crop.height),
    });
  };

  // Live readout dimensions.
  const cropW = crop ? Math.max(1, Math.round(crop.width * natW)) : natW;
  const cropH = crop ? Math.max(1, Math.round(crop.height * natH)) : natH;
  const effScale = resolveEffectiveScale(scale, cropH);
  const outW = cropW * effScale;
  const outH = cropH * effScale;
  const overBudget = maxOutputPixels > 0 && outW * outH > maxOutputPixels && natW > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{t('imageRestore.selector.title')}</h3>
        <button
          type="button"
          disabled={disabled || !crop}
          onClick={() => onCropChange(null)}
          className="text-xs text-blue-600 hover:underline disabled:opacity-50 disabled:no-underline"
        >
          {t('imageRestore.selector.useEntireImage')}
        </button>
      </div>

      <div
        ref={containerRef}
        onPointerDown={handleContainerPointerDown}
        className={cn(
          'relative inline-block w-full overflow-hidden rounded-lg border border-border bg-black/40 select-none touch-none',
          disabled ? 'cursor-not-allowed opacity-70' : 'cursor-crosshair',
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={t('imageRestore.selector.previewAlt')}
          className="block w-full h-auto select-none pointer-events-none"
          draggable={false}
          onLoad={(e) => {
            setNatW(e.currentTarget.naturalWidth);
            setNatH(e.currentTarget.naturalHeight);
          }}
        />
        {crop && (
          <div
            onPointerDown={(event) => begin(event, 'move', crop)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') nudge(-0.01, 0);
              else if (e.key === 'ArrowRight') nudge(0.01, 0);
              else if (e.key === 'ArrowUp') nudge(0, -0.01);
              else if (e.key === 'ArrowDown') nudge(0, 0.01);
              else return;
              e.preventDefault();
            }}
            tabIndex={0}
            role="group"
            aria-label={t('imageRestore.selector.regionLabel')}
            style={{
              left: `${crop.x * 100}%`,
              top: `${crop.y * 100}%`,
              width: `${crop.width * 100}%`,
              height: `${crop.height * 100}%`,
            }}
            className="absolute border-2 border-blue-500 bg-blue-500/15 rounded-md cursor-move shadow-[0_0_10px_rgba(59,130,246,0.45)]"
          >
            {HANDLES.map((handle) => (
              <span
                key={handle}
                onPointerDown={(event) => begin(event, handle, crop)}
                className={cn('absolute w-2.5 h-2.5 bg-white border border-blue-500 rounded-sm', handleCursor(handle), handlePosition(handle))}
              />
            ))}
          </div>
        )}
        {!crop && !disabled && (
          <div className="absolute inset-x-0 bottom-2 text-center pointer-events-none">
            <span className="inline-flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
              {t('imageRestore.selector.dragHint')}
            </span>
          </div>
        )}
      </div>

      {natW > 0 && (
        <p className="text-sm text-muted-foreground">
          {crop ? t('imageRestore.selector.cropReadout', { w: cropW, h: cropH }) : t('imageRestore.selector.fullReadout', { w: cropW, h: cropH })}
          {' · '}
          {t('imageRestore.selector.outputReadout', { w: outW, h: outH, scale: effScale })}
        </p>
      )}
      {overBudget && (
        <p className="text-sm rounded-md border border-amber-400/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-2">
          {t('imageRestore.selector.overBudget')}
        </p>
      )}
    </div>
  );
};

const handleCursor = (handle: Handle): string => {
  switch (handle) {
    case 'n':
    case 's':
      return 'cursor-ns-resize';
    case 'e':
    case 'w':
      return 'cursor-ew-resize';
    case 'nw':
    case 'se':
      return 'cursor-nwse-resize';
    case 'ne':
    case 'sw':
      return 'cursor-nesw-resize';
  }
};

const handlePosition = (handle: Handle): string => {
  switch (handle) {
    case 'nw':
      return '-left-1.5 -top-1.5';
    case 'n':
      return 'left-1/2 -translate-x-1/2 -top-1.5';
    case 'ne':
      return '-right-1.5 -top-1.5';
    case 'e':
      return '-right-1.5 top-1/2 -translate-y-1/2';
    case 'se':
      return '-right-1.5 -bottom-1.5';
    case 's':
      return 'left-1/2 -translate-x-1/2 -bottom-1.5';
    case 'sw':
      return '-left-1.5 -bottom-1.5';
    case 'w':
      return '-left-1.5 top-1/2 -translate-y-1/2';
  }
};

export default CropSelector;
