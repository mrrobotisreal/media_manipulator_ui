'use client';

import { useEffect, useState } from 'react';
import { useLocalization } from '@/i18n/useLocalization';
import {
  STEM_FORMAT_CHOICES,
  effectiveStemFormat,
  estimateStemBytes,
  wavNeedsHint,
  type StemFormatChoice,
} from '@/lib/audio/stemFormat';

/**
 * Duration of a local media file (seconds), read from its metadata by a detached media
 * element: no upload, no decode of the whole file. `null` until known or when unreadable.
 */
export function useMediaDuration(url: string | null | undefined): number | null {
  // Keyed by URL so a new file never shows the previous file's duration (no reset in the effect).
  const [state, setState] = useState<{ url: string; seconds: number } | null>(null);
  useEffect(() => {
    if (!url || typeof document === 'undefined') return;
    const media = document.createElement('audio');
    media.preload = 'metadata';
    const onLoaded = () => {
      if (Number.isFinite(media.duration) && media.duration > 0) setState({ url, seconds: media.duration });
    };
    media.addEventListener('loadedmetadata', onLoaded);
    media.src = url;
    return () => {
      media.removeEventListener('loadedmetadata', onLoaded);
      media.removeAttribute('src');
    };
  }, [url]);
  return state && url && state.url === url ? state.seconds : null;
}

export interface StemFormatSelectProps {
  value: StemFormatChoice;
  onChange: (next: StemFormatChoice) => void;
  /** The chosen file (what "Same as input" resolves from). */
  fileName?: string | null;
  fileType?: string | null;
  /** Seconds, when known; drives the size estimates. */
  durationSeconds?: number | null;
}

/**
 * MM81: the "Output format" select of the vocal tools. "Same as input" is recommended and
 * sends `auto` (the API resolves it); each option shows its estimated size, and WAV gets a
 * hint when it would be over 500 MB.
 */
export function StemFormatSelect({ value, onChange, fileName, fileType, durationSeconds }: StemFormatSelectProps) {
  const { t, formatFileSize } = useLocalization('interface');
  const sameAs = effectiveStemFormat('auto', fileName, fileType);

  const labelFor = (choice: StemFormatChoice): string => {
    const base =
      choice === 'auto'
        ? fileName
          ? t('audioForm.stemFormat.options.autoWithFormat', { format: sameAs.toUpperCase() })
          : t('audioForm.stemFormat.options.auto')
        : t(`audioForm.stemFormat.options.${choice}`);
    const bytes = estimateStemBytes(effectiveStemFormat(choice, fileName, fileType), durationSeconds);
    return bytes !== null ? t('audioForm.stemFormat.withEstimate', { label: base, size: formatFileSize(bytes, 0) }) : base;
  };

  const wavBytes = estimateStemBytes('wav', durationSeconds);
  const showWavHint = value === 'wav' && wavNeedsHint(wavBytes);

  return (
    <div className="space-y-1" data-testid="stem-format">
      <label className="block">
        <span className="block text-sm font-medium mb-1 text-card-foreground">{t('audioForm.stemFormat.label')}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as StemFormatChoice)}
          className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
        >
          {STEM_FORMAT_CHOICES.map((choice) => (
            <option key={choice} value={choice}>
              {labelFor(choice)}
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs text-muted-foreground">
        {durationSeconds ? t('audioForm.stemFormat.help') : t('audioForm.stemFormat.helpNoEstimate')}
      </p>
      {showWavHint && wavBytes !== null && (
        <p role="note" className="text-xs text-amber-600 dark:text-amber-400" data-testid="stem-wav-hint">
          {t('audioForm.stemFormat.wavHint', { size: formatFileSize(wavBytes, 0) })}
        </p>
      )}
    </div>
  );
}
