'use client';

import { useId, useState } from 'react';
import { Segmented } from '@/components/darkroom/segmented';
import { Stat } from '@/components/darkroom/stat';
import { useLocalization } from '@/i18n/useLocalization';
import { cn } from '@/lib/utils';
import type { ViewerProps } from './types';
import { CHECKERBOARD, useZoom } from './use-zoom';

/**
 * Image viewer: fit / 1x / 2x zoom by CSS transform and a transparency-grid toggle, so a
 * background-removal result can be judged against something other than a flat panel colour.
 */
export function ImageViewer({ src, fileName, role }: ViewerProps) {
  const { t } = useLocalization('interface');
  const name = useId();
  const { zoom, setZoom, grid, setGrid, imageStyle } = useZoom();
  const [natural, setNatural] = useState<{ width: number; height: number } | null>(null);
  if (!src) return null;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          name={`${name}-zoom`}
          label={t('resultPanel.image.zoom')}
          value={zoom}
          onValueChange={setZoom}
          options={[
            { value: 'fit', label: t('resultPanel.image.fit') },
            { value: '1x', label: '1×' },
            { value: '2x', label: '2×' },
          ]}
          className="w-48"
        />
        <button
          type="button"
          aria-pressed={grid}
          onClick={() => setGrid((v) => !v)}
          className={cn(
            'rounded-md border px-3 py-1.5 text-sm transition-colors',
            grid ? 'border-primary text-foreground' : 'border-edge text-muted-foreground hover:text-foreground',
          )}
        >
          {t('resultPanel.image.transparencyGrid')}
        </button>
        {natural && (
          <Stat
            orientation="inline"
            label={t('resultPanel.image.dimensions')}
            value={`${natural.width} × ${natural.height}`}
          />
        )}
      </div>
      <div
        className={cn(
          'flex max-h-[calc(100dvh-20rem)] min-h-40 items-center justify-center overflow-auto rounded-lg border border-edge',
          grid ? CHECKERBOARD : 'bg-background',
        )}
        data-testid={`image-stage-${role}`}
      >
        <img
          src={src}
          alt={role === 'original' ? t('resultPanel.image.originalAlt', { fileName }) : t('resultPanel.image.resultAlt', { fileName })}
          decoding="async"
          onLoad={(e) => setNatural({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight })}
          className={cn('object-contain', zoom === 'fit' && 'max-h-[calc(100dvh-22rem)] max-w-full')}
          style={imageStyle}
          data-zoom={zoom}
        />
      </div>
    </div>
  );
}

export default ImageViewer;
