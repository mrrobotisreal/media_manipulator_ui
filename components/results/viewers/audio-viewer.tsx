'use client';

import { useEffect, useRef } from 'react';
import { Music } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import { decodePeaks, drawPeaks } from '@/lib/results/peaks';
import type { ViewerProps } from './types';

const BUCKETS = 240;
const WIDTH = 960;
const HEIGHT = 96;

/**
 * Audio: `<audio controls>` plus a peaks canvas. The waveform is decorative and optional:
 * decode is capped at 10 minutes, runs off the element's own URL, and any failure leaves
 * only the player.
 */
export function AudioViewer({ src, fileName, role, descriptor }: ViewerProps) {
  const { t } = useLocalization('interface');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    void decodePeaks(src, BUCKETS).then((peaks) => {
      const canvas = canvasRef.current;
      if (cancelled || !peaks || !canvas) return;
      const color = getComputedStyle(canvas).color || '#8aa';
      drawPeaks(canvas, peaks, color);
      canvas.dataset.ready = 'true';
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!src) return null;
  return (
    <div className="w-full max-w-3xl rounded-lg border border-edge bg-surface-2 p-6">
      <div className="flex flex-col items-center gap-4">
        <Music aria-hidden="true" className="size-10 text-muted-foreground" />
        <p className="max-w-full truncate font-medium text-foreground">{fileName}</p>
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          role="img"
          aria-label={t('resultPanel.audio.waveform')}
          className="h-24 w-full text-data data-[ready=true]:block"
        />
        <audio key={`${descriptor.jobId}-${role}`} src={src} controls className="w-full" />
      </div>
    </div>
  );
}

export default AudioViewer;
