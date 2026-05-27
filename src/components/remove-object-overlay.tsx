import { useCallback, useEffect, useRef, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/i18n/useLocalization';

export interface RemoveObjectRectangle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface RemoveObjectOverlayProps {
  imageUrl: string;
  rectangles: RemoveObjectRectangle[];
  onChange: (rectangles: RemoveObjectRectangle[]) => void;
  disabled?: boolean;
}

type Handle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
type InteractionMode = 'move' | 'draw' | Handle;

interface ActiveInteraction {
  id: string;
  mode: InteractionMode;
  pointerId: number;
  startPointerX: number;
  startPointerY: number;
  startRect: RemoveObjectRectangle;
  containerWidth: number;
  containerHeight: number;
}

const MIN_SIZE = 0.01;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// RemoveObjectOverlay lets the user mark regions of an image to erase. Each
// rectangle is normalized to [0,1] of the original image so the backend can
// render a same-sized mask without re-measuring the rendered preview. Users
// can:
//   - drag on empty space to draw a new rectangle
//   - drag the body of a rectangle to move it
//   - drag the eight handles to resize
//   - click the trash button on a rectangle to remove it
const RemoveObjectOverlay: React.FC<RemoveObjectOverlayProps> = ({
  imageUrl,
  rectangles,
  onChange,
  disabled = false,
}) => {
  const { t } = useLocalization('interface');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const interactionRef = useRef<ActiveInteraction | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const finishInteraction = useCallback(() => {
    interactionRef.current = null;
  }, []);

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const interaction = interactionRef.current;
      if (!interaction || event.pointerId !== interaction.pointerId) return;
      const dx = (event.clientX - interaction.startPointerX) / interaction.containerWidth;
      const dy = (event.clientY - interaction.startPointerY) / interaction.containerHeight;
      const start = interaction.startRect;

      let nextRect: RemoveObjectRectangle = { ...start };
      switch (interaction.mode) {
        case 'move': {
          const x = clamp01(start.x + dx);
          const y = clamp01(start.y + dy);
          nextRect.x = Math.min(x, 1 - start.width);
          nextRect.y = Math.min(y, 1 - start.height);
          break;
        }
        case 'draw':
        case 'se': {
          const width = Math.max(MIN_SIZE, Math.min(1 - start.x, start.width + dx));
          const height = Math.max(MIN_SIZE, Math.min(1 - start.y, start.height + dy));
          nextRect = { ...start, width, height };
          break;
        }
        case 'e': {
          const width = Math.max(MIN_SIZE, Math.min(1 - start.x, start.width + dx));
          nextRect = { ...start, width };
          break;
        }
        case 's': {
          const height = Math.max(MIN_SIZE, Math.min(1 - start.y, start.height + dy));
          nextRect = { ...start, height };
          break;
        }
        case 'n': {
          const top = clamp01(start.y + dy);
          const bottomEdge = start.y + start.height;
          const newTop = Math.min(top, bottomEdge - MIN_SIZE);
          nextRect = { ...start, y: newTop, height: bottomEdge - newTop };
          break;
        }
        case 'w': {
          const left = clamp01(start.x + dx);
          const rightEdge = start.x + start.width;
          const newLeft = Math.min(left, rightEdge - MIN_SIZE);
          nextRect = { ...start, x: newLeft, width: rightEdge - newLeft };
          break;
        }
        case 'ne': {
          const top = clamp01(start.y + dy);
          const bottomEdge = start.y + start.height;
          const newTop = Math.min(top, bottomEdge - MIN_SIZE);
          const width = Math.max(MIN_SIZE, Math.min(1 - start.x, start.width + dx));
          nextRect = { ...start, y: newTop, height: bottomEdge - newTop, width };
          break;
        }
        case 'nw': {
          const top = clamp01(start.y + dy);
          const bottomEdge = start.y + start.height;
          const newTop = Math.min(top, bottomEdge - MIN_SIZE);
          const left = clamp01(start.x + dx);
          const rightEdge = start.x + start.width;
          const newLeft = Math.min(left, rightEdge - MIN_SIZE);
          nextRect = {
            ...start,
            x: newLeft,
            y: newTop,
            width: rightEdge - newLeft,
            height: bottomEdge - newTop,
          };
          break;
        }
        case 'sw': {
          const left = clamp01(start.x + dx);
          const rightEdge = start.x + start.width;
          const newLeft = Math.min(left, rightEdge - MIN_SIZE);
          const height = Math.max(MIN_SIZE, Math.min(1 - start.y, start.height + dy));
          nextRect = { ...start, x: newLeft, width: rightEdge - newLeft, height };
          break;
        }
      }

      onChange(
        rectangles.map((r) => (r.id === interaction.id ? { ...nextRect, id: r.id } : r)),
      );
    },
    [onChange, rectangles],
  );

  const onPointerUp = useCallback(
    (event: PointerEvent) => {
      const interaction = interactionRef.current;
      if (!interaction || event.pointerId !== interaction.pointerId) return;
      finishInteraction();
    },
    [finishInteraction],
  );

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

  const beginInteraction = (
    event: React.PointerEvent,
    id: string,
    mode: InteractionMode,
    rect: RemoveObjectRectangle,
  ) => {
    if (disabled) return;
    const container = containerRef.current;
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    event.stopPropagation();
    event.preventDefault();
    (event.target as Element).setPointerCapture?.(event.pointerId);
    interactionRef.current = {
      id,
      mode,
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startRect: rect,
      containerWidth: bounds.width,
      containerHeight: bounds.height,
    };
    setActiveId(id);
  };

  const handleContainerPointerDown = (event: React.PointerEvent) => {
    if (disabled || event.button !== 0) return;
    const container = containerRef.current;
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    const x = clamp01((event.clientX - bounds.left) / bounds.width);
    const y = clamp01((event.clientY - bounds.top) / bounds.height);
    const id = `rect_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const seed: RemoveObjectRectangle = { id, x, y, width: MIN_SIZE, height: MIN_SIZE };
    onChange([...rectangles, seed]);
    setActiveId(id);
    (event.target as Element).setPointerCapture?.(event.pointerId);
    interactionRef.current = {
      id,
      mode: 'draw',
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startRect: seed,
      containerWidth: bounds.width,
      containerHeight: bounds.height,
    };
    setHint(t('removeObjectOverlay.dragHint'));
  };

  const removeRectangle = (id: string) => {
    onChange(rectangles.filter((r) => r.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const handles: Handle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        onPointerDown={handleContainerPointerDown}
        className={cn(
          'relative inline-block w-full overflow-hidden rounded-lg border border-border bg-black/40 select-none',
          disabled ? 'cursor-not-allowed opacity-70' : 'cursor-crosshair',
        )}
      >
        <img
          src={imageUrl}
          alt={t('removeObjectOverlay.previewAlt')}
          className="block w-full h-auto select-none pointer-events-none"
          draggable={false}
        />
        {rectangles.map((rect, index) => {
          const isActive = rect.id === activeId;
          return (
            <div
              key={rect.id}
              onPointerDown={(event) => beginInteraction(event, rect.id, 'move', rect)}
              style={{
                left: `${rect.x * 100}%`,
                top: `${rect.y * 100}%`,
                width: `${rect.width * 100}%`,
                height: `${rect.height * 100}%`,
              }}
              className={cn(
                'absolute border-2 rounded-md flex items-start justify-between p-1',
                isActive
                  ? 'border-rose-400 bg-rose-400/15 shadow-[0_0_10px_rgba(244,114,182,0.55)] cursor-move'
                  : 'border-amber-400/90 bg-amber-400/10 hover:bg-amber-400/20 cursor-move',
              )}
            >
              <span
                className={cn(
                  'inline-block px-1 text-[10px] font-semibold leading-tight rounded pointer-events-none',
                  isActive ? 'bg-rose-400 text-black' : 'bg-amber-400/90 text-black',
                )}
              >
                {index + 1}
              </span>
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  removeRectangle(rect.id);
                }}
                disabled={disabled}
                aria-label={t('removeObjectOverlay.removeRectangle', { number: index + 1 })}
                className="bg-black/70 text-white rounded p-0.5 hover:bg-black/90 disabled:opacity-50"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              {handles.map((handle) => (
                <span
                  key={handle}
                  onPointerDown={(event) => beginInteraction(event, rect.id, handle, rect)}
                  className={cn(
                    'absolute w-2.5 h-2.5 bg-white border border-rose-500 rounded-sm',
                    handleCursor(handle),
                    handlePosition(handle),
                  )}
                />
              ))}
            </div>
          );
        })}
        {rectangles.length === 0 && !disabled && (
          <div className="absolute inset-x-0 bottom-2 text-center pointer-events-none">
            <span className="inline-flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
              <Plus className="w-3 h-3" />
              Click and drag on the image to mark an area to remove
            </span>
          </div>
        )}
      </div>
      {hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
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

export default RemoveObjectOverlay;
