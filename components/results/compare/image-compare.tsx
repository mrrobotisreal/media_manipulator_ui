'use client';

import { useId, useState } from 'react';
import { Segmented } from '@/components/darkroom/segmented';
import { Stat } from '@/components/darkroom/stat';
import { useLocalization } from '@/i18n/useLocalization';
import { formatDelta } from '@/lib/results/compare';
import { cn } from '@/lib/utils';
import { CHECKERBOARD, useZoom } from '../viewers/use-zoom';
import { CompareSlider } from './compare-slider';
import type { CompareSide, CompareViewProps } from './types';

type Natural = { width: number; height: number } | null;

/**
 * Image compare: wipe, side-by-side or toggle over one shared zoom and transparency-grid
 * state, with a size/dimension readout (and delta) for each side underneath.
 */
export function ImageCompare({ mode, original, result }: CompareViewProps) {
  const { t, formatFileSize } = useLocalization('interface');
  const name = useId();
  const { zoom, setZoom, grid, setGrid, imageStyle } = useZoom();
  const [dims, setDims] = useState<{ original: Natural; result: Natural }>({ original: null, result: null });
  const [side, setSide] = useState<'original' | 'result'>('result');

  const img = (which: 'original' | 'result', s: CompareSide, hidden = false) => (
    <img
      key={which}
      src={s.src}
      hidden={hidden}
      alt={which === 'original' ? t('resultPanel.image.originalAlt', { fileName: s.fileName }) : t('resultPanel.image.resultAlt', { fileName: s.fileName })}
      decoding="async"
      draggable={false}
      onLoad={(e) => {
        const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
        setDims((d) => ({ ...d, [which]: { width, height } }));
      }}
      className={cn('object-contain', zoom === 'fit' && 'max-h-full max-w-full')}
      style={imageStyle}
      data-zoom={zoom}
    />
  );

  const stage = (children: React.ReactNode, testId: string) => (
    <div
      className={cn(
        'flex max-h-[calc(100dvh-24rem)] min-h-40 items-center justify-center overflow-auto rounded-lg border border-edge',
        grid ? CHECKERBOARD : 'bg-background',
      )}
      data-testid={testId}
    >
      {children}
    </div>
  );

  const ratio = dims.result ?? dims.original;
  let body: React.ReactNode;
  if (mode === 'side_by_side') {
    body = (
      <div className="grid gap-3 sm:grid-cols-2">
        <figure className="space-y-1">
          <figcaption className="text-xs text-muted-foreground">{t('resultPanel.original')}</figcaption>
          {stage(img('original', original), 'image-stage-original')}
        </figure>
        <figure className="space-y-1">
          <figcaption className="text-xs text-muted-foreground">{t('resultPanel.result')}</figcaption>
          {stage(img('result', result), 'image-stage-result')}
        </figure>
      </div>
    );
  } else if (mode === 'toggle') {
    body = (
      <div className="space-y-3">
        <Segmented
          name={`${name}-side`}
          label={t('resultPanel.compareModes.label')}
          value={side}
          onValueChange={setSide}
          options={[
            { value: 'original', label: t('resultPanel.original') },
            { value: 'result', label: t('resultPanel.result') },
          ]}
          className="w-56"
        />
        {stage(
          <>
            {img('original', original, side !== 'original')}
            {img('result', result, side !== 'result')}
          </>,
          `image-stage-${side}`,
        )}
      </div>
    );
  } else {
    body = (
      <CompareSlider
          before={img('original', original)}
          after={img('result', result)}
          beforeLabel={t('resultPanel.original')}
          afterLabel={t('resultPanel.result')}
          aspectRatio={ratio ? `${ratio.width} / ${ratio.height}` : '4 / 3'}
          className={cn('max-h-[calc(100dvh-24rem)]', grid && CHECKERBOARD)}
        />
    );
  }

  const delta = formatDelta(original.sizeBytes, result.sizeBytes);
  const dimsText = (n: Natural) => (n ? `${n.width} × ${n.height}` : '—');
  const bytesText = (n?: number) => (n === undefined ? '—' : formatFileSize(n));
  return (
    <div className="flex w-full flex-col gap-3" data-compare-mode={mode}>
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
      </div>
      {body}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4" data-testid="image-compare-stats">
        <Stat label={`${t('resultPanel.original')} · ${t('resultPanel.image.dimensions')}`} value={dimsText(dims.original)} />
        <Stat label={`${t('resultPanel.result')} · ${t('resultPanel.image.dimensions')}`} value={dimsText(dims.result)} />
        <Stat label={`${t('resultPanel.original')} · ${t('resultPanel.size')}`} value={bytesText(original.sizeBytes)} />
        <Stat
          label={`${t('resultPanel.result')} · ${t('resultPanel.size')}`}
          value={delta ? `${bytesText(result.sizeBytes)} (${delta})` : bytesText(result.sizeBytes)}
          accent={delta?.startsWith('−') ? 'data' : 'default'}
        />
      </div>
    </div>
  );
}

export default ImageCompare;
