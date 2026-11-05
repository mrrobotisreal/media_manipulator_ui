'use client';

import React, { useState } from 'react';
import { Minimize2 } from 'lucide-react';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import type {
  VideoCompressorPresets,
  EmbeddedVideoFormat,
  EmbeddedVideoCompressionPreset,
  EmbeddedVideoCodec,
} from '@/components/embedded-tool-panel';
import type { ConversionFormData } from '@/schemas/types';
import useConvertFile from '@/lib/useConvertFile';
import SpecializedToolShell from '@/components/specialized-tool-shell';
import { useLocalization } from '@/i18n/useLocalization';
import { COMPRESSION_LEVELS, COMPRESSION_RESOLUTIONS, COMPRESSOR_CODEC_CHOICES, COMPRESSOR_CRF, COMPRESSOR_FORMATS, LEVEL_CRF } from '@/lib/assistant/toolOptions/fields';
import { compressorState } from '@/lib/assistant/toolOptions/prefill';
import { compressorRequest } from '@/lib/assistant/toolOptions/requests';

const LEVELS: readonly EmbeddedVideoCompressionPreset[] = COMPRESSION_LEVELS;
const FORMATS: readonly EmbeddedVideoFormat[] = COMPRESSOR_FORMATS;
const RESOLUTIONS = COMPRESSION_RESOLUTIONS;
type Resolution = (typeof RESOLUTIONS)[number];

// Friendly compression level -> CRF. Mirrors the backend README mapping
// (smallest ~31, balanced ~26, high quality ~22).
// (The numbers live in lib/assistant/toolOptions/fields.ts, shared with Medi's option schema.)
// Quality enum is still sent for backward-compat / validation; CRF refines it.
const LEVEL_QUALITY: Record<EmbeddedVideoCompressionPreset, 'low' | 'medium' | 'high'> = {
  smallest: 'low',
  balanced: 'medium',
  high_quality: 'high',
};

/**
 * VideoCompressorPanel is the focused UI for /tools/video-compressor and
 * /tools/compress-mp4. It runs the standard video-conversion engine
 * (useConvertFile) with compression-oriented options — a friendly level that
 * maps to a CRF, an optional codec, an optional resolution downscale, and an
 * optional audio strip — instead of exposing the full advanced video form.
 */
const VideoCompressorPanel: React.FC<{ presets?: VideoCompressorPresets }> = ({ presets }) => {
  const { t } = useLocalization('interface');
  const lockedFormat = presets?.lockedOutputFormat;
  const link = presets?.options ? compressorState(presets.options) : {};
  const [level, setLevel] = useState<EmbeddedVideoCompressionPreset>((link.level as EmbeddedVideoCompressionPreset) ?? presets?.defaultPreset ?? 'balanced');
  const [format, setFormat] = useState<EmbeddedVideoFormat>(lockedFormat ?? (link.format as EmbeddedVideoFormat) ?? presets?.defaultOutputFormat ?? 'mp4');
  const [codec, setCodec] = useState<EmbeddedVideoCodec>((link.codec as EmbeddedVideoCodec) ?? presets?.defaultCodec ?? 'h264');
  const [resolution, setResolution] = useState<Resolution>((link.resolution as Resolution) ?? 'keep');
  const [stripAudio, setStripAudio] = useState(link.stripAudio ?? false);
  // CRF override (MM116a): empty = the level's own CRF. A deep link may set it; the user may edit it.
  const [crfOverride, setCrfOverride] = useState<number | ''>(link.crf ?? '');
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);

  const submitFormat = lockedFormat ?? format;
  const { mutate, isPending, uploadProgress } = useConvertFile((res) => {
    setConversionJob({
      id: res.jobId,
      status: 'processing',
      originalFile: new File([], 'temp'),
      progress: 0,
    });
  });

  const buildOptions = (): ConversionFormData =>
    compressorRequest({ level, format: submitFormat, codec, resolution, stripAudio, crfOverride });

  return (
    <SpecializedToolShell
      accept="video/*"
      uploadHint={t('videoCompressor.uploadHint')}
      conversionJob={conversionJob}
      setConversionJob={setConversionJob}
      isUploading={isPending}
      uploadProgress={uploadProgress}
      outputExtensionHint={submitFormat}
      previewConfig={{ finalMediaKind: 'video' }}
      renderForm={({ file, isProcessing }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate({ file, options: buildOptions() });
          }}
          className="space-y-4"
        >
          {presets?.expectedInput && (
            <p className="text-xs text-muted-foreground">
              {t('videoCompressor.expectedInput', { format: presets.expectedInput.toUpperCase() })}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoCompressor.levelLabel')}</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as EmbeddedVideoCompressionPreset)}
              className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{t(`videoCompressor.levels.${l}`)}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">{t(`videoCompressor.levelHints.${level}`)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoCompressor.formatLabel')}</label>
              <select
                value={submitFormat}
                onChange={(e) => setFormat(e.target.value as EmbeddedVideoFormat)}
                disabled={Boolean(lockedFormat)}
                aria-disabled={Boolean(lockedFormat)}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>{f.toUpperCase()}</option>
                ))}
              </select>
              {lockedFormat && (
                <span className="mt-1 inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {t('videoCompressor.outputLocked', { format: lockedFormat.toUpperCase() })}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoCompressor.resolutionLabel')}</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as Resolution)}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
              >
                {RESOLUTIONS.map((r) => (
                  <option key={r} value={r}>{t(`videoCompressor.resolutions.${r}`)}</option>
                ))}
              </select>
            </div>
          </div>

          {submitFormat !== 'webm' && (
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoCompressor.codecLabel')}</label>
              <select
                value={codec}
                onChange={(e) => setCodec(e.target.value as EmbeddedVideoCodec)}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
              >
                {COMPRESSOR_CODEC_CHOICES.map((c) => (
                  <option key={c} value={c}>{t(`videoCompressor.codecs.${c}`)}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoCompressor.crfLabel')}</label>
            <input
              type="number"
              inputMode="numeric"
              min={COMPRESSOR_CRF.min}
              max={COMPRESSOR_CRF.max}
              step={1}
              value={crfOverride}
              placeholder={String(LEVEL_CRF[level])}
              onChange={(e) => {
                const v = e.target.value;
                setCrfOverride(v === '' ? '' : Math.min(COMPRESSOR_CRF.max, Math.max(COMPRESSOR_CRF.min, Math.round(Number(v)) || COMPRESSOR_CRF.min)));
              }}
              className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">{t('videoCompressor.crfHint', { min: COMPRESSOR_CRF.min, max: COMPRESSOR_CRF.max })}</p>
          </div>

          <label className="flex items-center gap-2 text-sm text-card-foreground">
            <input
              type="checkbox"
              checked={stripAudio}
              onChange={(e) => setStripAudio(e.target.checked)}
              className="rounded border-input bg-input focus:ring-2 focus:ring-ring"
            />
            {t('videoCompressor.stripAudio')}
          </label>

          <p className="text-xs text-muted-foreground">{t('videoCompressor.note')}</p>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-[var(--accent-primary-hover)] disabled:bg-surface-3 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Minimize2 className="w-4 h-4" />
            {isProcessing ? t('videoCompressor.running') : t('videoCompressor.submit')}
          </button>
        </form>
      )}
    />
  );
};

export default VideoCompressorPanel;
