'use client';

import * as React from 'react';

import type { Histogram } from '@/lib/photo/gl/histogram';
import { cn } from '@/lib/utils';

type Channel = 'luma' | 'r' | 'g' | 'b' | 'rgb';
const COLORS: Record<string, string> = { luma: '#9ca3af', r: '#ef4444', g: '#22c55e', b: '#3b82f6' };

/** Canvas histogram plot (RGB overlay or one channel). Always LTR. */
export function HistogramPlot({ histogram, channel = 'rgb', className }: { histogram: Histogram | null; channel?: Channel; className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext?.('2d');
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    if (!histogram || histogram.max === 0) return;
    const draw = (bins: Uint32Array, color: string, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      for (let i = 0; i < 256; i += 1) {
        const h = Math.sqrt(bins[i] / histogram.max) * c.height;
        ctx.fillRect(i, c.height - h, 1, h);
      }
    };
    if (channel === 'rgb') {
      draw(histogram.r, COLORS.r, 0.45);
      draw(histogram.g, COLORS.g, 0.45);
      draw(histogram.b, COLORS.b, 0.45);
    } else {
      draw(histogram[channel], COLORS[channel], 0.8);
    }
    ctx.globalAlpha = 1;
  }, [histogram, channel]);
  return <canvas ref={ref} width={256} height={96} dir="ltr" className={cn('rounded bg-surface-2', className)} data-testid="histogram" />;
}
