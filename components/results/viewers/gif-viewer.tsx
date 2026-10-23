'use client';

import { useState } from 'react';
import { Stat } from '@/components/darkroom/stat';
import { useLocalization } from '@/i18n/useLocalization';
import type { ViewerProps } from './types';

/** Animated GIF: a plain `<img>` (the browser animates it) plus its pixel dimensions. */
export function GifViewer({ src, fileName }: ViewerProps) {
  const { t } = useLocalization('interface');
  const [natural, setNatural] = useState<{ width: number; height: number } | null>(null);
  if (!src) return null;
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <img
        src={src}
        alt={t('resultPanel.gif.alt', { fileName })}
        decoding="async"
        onLoad={(e) => setNatural({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight })}
        className="max-h-[calc(100dvh-20rem)] max-w-full rounded-lg border border-edge bg-background object-contain"
      />
      {natural && (
        <Stat orientation="inline" label={t('resultPanel.image.dimensions')} value={`${natural.width} × ${natural.height}`} />
      )}
    </div>
  );
}

export default GifViewer;
