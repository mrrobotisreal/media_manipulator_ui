'use client';

import * as React from 'react';

import { useLocalization } from '@/i18n/useLocalization';
import { formatBytes } from '@/lib/auth/formatLimits';
import { probeRaster, pickCodec, videoBitrate, type RasterProbe } from '@/lib/vector/raster/capabilities';
import { RASTER_FORMATS, RASTER_MAX_OUTPUT_BYTES, clampRasterOptions, estimateBytes, isVideoFormat, outputSize, type RasterFormat, type RasterOptions } from '@/lib/vector/raster/caps';
import { frameCount } from '@/lib/vector/raster/frames';
import type { RasterPlan } from '@/lib/vector/raster/plan';
import type { RasterProgress } from '@/lib/vector/raster/pipeline';
import { DEFAULT_BACKGROUND, type VectorDoc } from '@/lib/vector/vectorTypes';
import { cn } from '@/lib/utils';

/**
 * The raster part of the Motion export dialog (ticket MM47 decision 7): the
 * GIF / PNG sequence / MP4 / WebM options, their availability, and the
 * settings of the selected one. State lives in the dialog; this file is
 * presentation plus the pure availability rule.
 */

/** Why a raster option cannot be picked. */
export type RasterBlock =
  /** The caller's tier lacks the format, but a higher public tier has it. */
  | 'locked'
  /** No public tier offers the format yet (MP4/WebM/PNG sequence until MM49). */
  | 'notOnAnyPlan'
  /** WebCodecs missing or insecure context: "Use Chrome or Edge for video export". */
  | 'useChromium'
  /** WebCodecs present but no codec for this container. */
  | 'noCodec'
  | null;

export function rasterBlock(format: RasterFormat, plan: RasterPlan | null, probe: RasterProbe | null): RasterBlock {
  const caps = plan?.caps;
  if (caps?.formats && !caps.formats.includes(format)) {
    return plan?.publicFormats && !plan.publicFormats.has(format) ? 'notOnAnyPlan' : 'locked';
  }
  if (isVideoFormat(format) && probe) {
    if (!probe.webcodecs) return 'useChromium';
    if (!pickCodec(probe, format)) return 'noCodec';
  }
  return null;
}

/** Default options for a format: the document's own height and fps, the whole document. */
export function defaultRasterOptions(format: RasterFormat, doc: VectorDoc): RasterOptions {
  return { format, height: Math.round(doc.canvas.height), fps: Math.round(doc.fps), startMs: 0, endMs: doc.duration };
}

/** The probe, once per dialog. Null until it answers. */
export function useRasterProbe(probe: () => Promise<RasterProbe>): RasterProbe | null {
  const [p, setP] = React.useState<RasterProbe | null>(null);
  React.useEffect(() => {
    let live = true;
    probe().then((r) => live && setP(r), () => live && setP(null));
    return () => {
      live = false;
    };
  }, [probe]);
  return p;
}

export const defaultProbe = () => probeRaster();

export interface GifSettings {
  transparent: boolean;
  dither: boolean;
  /** 0 = forever, n = plays. */
  plays: number;
}

const field = 'h-7 min-w-0 rounded-md border border-edge bg-surface-2 px-2 font-mono text-xs tabular-nums text-foreground outline-none focus-visible:border-data disabled:opacity-50';

export function RasterBlockNote({ block }: { block: RasterBlock }) {
  const { t } = useLocalization('interface');
  if (!block) return null;
  return (
    <span className="mt-1 block text-xs text-muted-foreground" data-raster-block={block}>
      {t(`vector.raster.block.${block}`)}
    </span>
  );
}

export interface RasterSettingsProps {
  doc: VectorDoc;
  options: RasterOptions;
  onOptions: (o: RasterOptions) => void;
  plan: RasterPlan | null;
  gif: GifSettings;
  onGif: (g: GifSettings) => void;
  disabled: boolean;
}

/** Size, fps, range (and GIF settings) of the selected raster format, clamped to the plan. */
export function RasterSettings({ doc, options, onOptions, plan, gif, onGif, disabled }: RasterSettingsProps) {
  const { t } = useLocalization('interface');
  const clamp = clampRasterOptions(options, plan?.caps ?? null, doc.duration);
  if (!clamp.available) return null;
  const o = clamp.options;
  const set = (patch: Partial<RasterOptions>) => onOptions({ ...o, ...patch });
  const video = isVideoFormat(o.format);
  const size = outputSize(doc.canvas, o.height, video);
  const frames = frameCount(o.endMs - o.startMs, o.fps);
  const bytes = estimateBytes(o.format, size, frames, videoBitrate(size.width, size.height, o.fps), o.endMs - o.startMs);
  const transparentCanvas = !doc.canvas.background || doc.canvas.background === DEFAULT_BACKGROUND || doc.canvas.background === 'none';
  const sec = (ms: number) => Math.round(ms / 100) / 10;
  return (
    <div className="mt-2 space-y-2 text-xs" data-testid="vector-raster-settings" onClick={(e) => e.stopPropagation()}>
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-muted-foreground">{t('vector.raster.size')}</span>
          <select className={field} value={o.height} disabled={disabled} onChange={(e) => set({ height: Number(e.target.value) })} aria-label={t('vector.raster.size')}>
            {clamp.heights.map((h) => (
              <option key={h} value={h}>
                {t('vector.raster.sizeOption', { height: h, width: outputSize(doc.canvas, h, video).width })}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-muted-foreground">{t('vector.raster.fps')}</span>
          <select className={field} value={o.fps} disabled={disabled} onChange={(e) => set({ fps: Number(e.target.value) })} aria-label={t('vector.raster.fps')}>
            {clamp.fpsChoices.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-muted-foreground">{t('vector.raster.from')}</span>
          <input
            type="number"
            className={field}
            min={0}
            max={sec(doc.duration)}
            step={0.1}
            value={sec(o.startMs)}
            disabled={disabled}
            aria-label={t('vector.raster.from')}
            onChange={(e) => set({ startMs: Math.round(Number(e.target.value) * 1000) })}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-muted-foreground">{t('vector.raster.to')}</span>
          <input
            type="number"
            className={field}
            min={0}
            max={sec(doc.duration)}
            step={0.1}
            value={sec(o.endMs)}
            disabled={disabled}
            aria-label={t('vector.raster.to')}
            onChange={(e) => set({ endMs: Math.round(Number(e.target.value) * 1000) })}
          />
        </label>
      </div>
      {o.format === 'gif' && (
        <div className="space-y-1.5">
          <label className="flex items-center gap-2">
            <span className="text-muted-foreground">{t('vector.raster.gif.loop')}</span>
            <select className={field} value={gif.plays} disabled={disabled} onChange={(e) => onGif({ ...gif, plays: Number(e.target.value) })} aria-label={t('vector.raster.gif.loop')}>
              <option value={0}>{t('vector.raster.gif.forever')}</option>
              {[1, 2, 3, 5].map((n) => (
                <option key={n} value={n}>
                  {t('vector.raster.gif.plays', { count: n })}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-muted-foreground">
            <input type="checkbox" checked={gif.dither} disabled={disabled} onChange={(e) => onGif({ ...gif, dither: e.target.checked })} />
            <span>{t('vector.raster.gif.dither')}</span>
          </label>
          {transparentCanvas && (
            <label className="flex items-center gap-1.5 text-muted-foreground">
              <input type="checkbox" checked={gif.transparent} disabled={disabled} onChange={(e) => onGif({ ...gif, transparent: e.target.checked })} />
              <span>{t('vector.raster.gif.transparent')}</span>
            </label>
          )}
        </div>
      )}
      <p className="text-muted-foreground" data-testid="vector-raster-summary">
        {t('vector.raster.summary', { width: size.width, height: size.height, frames, seconds: sec(o.endMs - o.startMs), size: formatBytes(bytes) })}
      </p>
      {video && transparentCanvas && <p className="text-muted-foreground">{t('vector.raster.flattenWhite')}</p>}
      {clamp.clamped.length > 0 && (
        <p className="text-premium" data-testid="vector-raster-clamped">
          {clamp.clamped.map((axis) => t(`vector.raster.clamped.${axis}`, { height: o.height, fps: o.fps, seconds: sec(clamp.maxDurationMs) })).join(' ')}
        </p>
      )}
      {bytes > RASTER_MAX_OUTPUT_BYTES && <p className="text-destructive">{t('vector.raster.tooLarge')}</p>}
      <p className="text-text-subtle" title={t('vector.raster.cancelCounts')}>
        {t('vector.raster.cancelCounts')}
      </p>
    </div>
  );
}

export function RasterProgressBar({ progress, onCancel }: { progress: RasterProgress | null; onCancel: () => void }) {
  const { t } = useLocalization('interface');
  const pct = !progress ? 0 : progress.phase === 'finalize' ? 100 : Math.round((progress.done / Math.max(1, progress.total)) * 100);
  return (
    <div className="space-y-1.5" data-testid="vector-raster-progress">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {!progress
            ? t('vector.raster.preparing')
            : progress.phase === 'finalize'
              ? t('vector.raster.finalizing')
              : t('vector.raster.progress', { done: progress.done, total: progress.total })}
        </span>
        <button type="button" onClick={onCancel} className="rounded-md border border-edge px-2 py-0.5 hover:bg-surface-2" data-testid="vector-raster-cancel">
          {t('vector.raster.cancel')}
        </button>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={t('vector.raster.progressLabel')}>
        <div className={cn('h-full bg-data transition-[width]')} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export { RASTER_FORMATS };
