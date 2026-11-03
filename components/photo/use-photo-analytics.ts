'use client';

import * as React from 'react';

import { EVENTS, type PhotoEditorSource } from '@/lib/analytics/events';
import { photoMegapixelBucket, vectorMsBucket } from '@/lib/analytics/buckets';
import {
  bitmapHasAlpha,
  exportStartedProps,
  failReason,
  getPhotoBatchContext,
  maskKindOf,
  photoTracker,
  savedProps,
  sourceFormatOf,
  startPhotoAnalytics,
  type PhotoTracker,
} from '@/lib/photo/analytics';
import {
  setAdjustmentListener,
  setMm98Listener,
  setMm99Listener,
} from '@/lib/photo/seams';
import type { PhotoDoc } from '@/lib/photo/photoTypes';

/**
 * The Aperture editor's analytics wiring (MM101 decision 4), in one hook so the
 * editor shell only hands it the moments it knows about. It installs the editor's
 * three seam listeners (`lib/photo/seams.ts`):
 *
 *   - adjustment (debounced 600 ms in the seam, keys only) -> `photo_adjustment_changed`;
 *   - MM98: mask added, AI mask and heal request/complete/fail (with `ms` and a
 *     mapped `reason`), compare -> `photo_mask_added`, `photo_ai_mask_*`,
 *     `photo_heal_*`, `photo_compare_used`;
 *   - MM99: preset applied -> `photo_preset_applied`; batch started ->
 *     `photo_export_started` (the export dialog tells it the format and size);
 *
 * and returns the callbacks for the moments the shell owns: `opened`, `created`,
 * `saved`. Everything goes through the consent-gated tracker (lib/photo/analytics.ts):
 * with no stored `granted` decision, or on a translator deployment, nothing is sent.
 * The analytics client is started here, once.
 */
export function usePhotoAnalytics(opts: { track?: PhotoTracker } = {}) {
  const track = opts.track ?? photoTracker;
  const trackRef = React.useRef(track);
  React.useEffect(() => {
    trackRef.current = track;
  }, [track]);

  React.useEffect(() => {
    startPhotoAnalytics();
  }, []);

  React.useEffect(() => {
    const t = () => trackRef.current;
    // AI requests are timed from request to outcome; one in flight per kind.
    const t0: { mask: number | null; heal: number | null } = { mask: null, heal: null };
    const took = (k: 'mask' | 'heal') => {
      const start = t0[k];
      t0[k] = null;
      return vectorMsBucket(start === null ? 0 : Date.now() - start);
    };
    const offAdjust = setAdjustmentListener((type, param) => t().track(EVENTS.PHOTO_ADJUSTMENT_CHANGED, { adjustment: type, param }));
    const off98 = setMm98Listener({
      onMaskAdded: (kind) => {
        const mask_kind = maskKindOf(kind);
        if (mask_kind) t().track(EVENTS.PHOTO_MASK_ADDED, { mask_kind });
      },
      onAiMaskRequested: () => {
        t0.mask = Date.now();
        t().track(EVENTS.PHOTO_AI_MASK_REQUESTED, {});
      },
      onAiMaskCompleted: () => t().track(EVENTS.PHOTO_AI_MASK_COMPLETED, { ms: took('mask') }),
      onAiMaskFailed: (reason) => t().track(EVENTS.PHOTO_AI_MASK_FAILED, { ms: took('mask'), reason: failReason(reason) }),
      onHealRequested: () => {
        t0.heal = Date.now();
        t().track(EVENTS.PHOTO_HEAL_REQUESTED, {});
      },
      onHealCompleted: () => t().track(EVENTS.PHOTO_HEAL_COMPLETED, { ms: took('heal') }),
      onHealFailed: (reason) => t().track(EVENTS.PHOTO_HEAL_FAILED, { ms: took('heal'), reason: failReason(reason) }),
      onCompareUsed: (mode) => {
        if (mode === 'hold' || mode === 'split' || mode === 'wipe') t().track(EVENTS.PHOTO_COMPARE_USED, { mode });
      },
    });
    const off99 = setMm99Listener({
      // A browser-local (or account) preset has no stable public id: it reports as `custom`.
      onPresetApplied: (id, builtin) => t().track(EVENTS.PHOTO_PRESET_APPLIED, { preset_id: builtin ? id : 'custom', builtin }),
      onBatchStarted: (n) => {
        const ctx = getPhotoBatchContext();
        if (ctx) t().track(EVENTS.PHOTO_EXPORT_STARTED, exportStartedProps({ ...ctx, batchSize: n }));
      },
    });
    return () => {
      offAdjust();
      off98();
      off99();
    };
  }, []);

  return React.useMemo(
    () => ({
      /** The editor finished opening a photo (once per opened document). */
      opened: (source: PhotoEditorSource, localDecode: boolean) => trackRef.current.track(EVENTS.PHOTO_EDITOR_OPENED, { source, local_decode: localDecode }),
      /** A NEW project was made from a photo file (not for reopened ones). */
      created: (file: { name: string }, bitmap: { width: number; height: number }) => {
        const source_format = sourceFormatOf(file.name);
        trackRef.current.track(EVENTS.PHOTO_PROJECT_CREATED, {
          source_format,
          megapixels_bucket: photoMegapixelBucket((bitmap.width * bitmap.height) / 1_000_000),
          has_alpha: bitmapHasAlpha(bitmap as ImageBitmap, source_format),
        });
      },
      /** An account save landed. */
      saved: (doc: PhotoDoc) => trackRef.current.track(EVENTS.PHOTO_PROJECT_SAVED, savedProps(doc)),
      track: (...args: Parameters<PhotoTracker['track']>) => trackRef.current.track(...args),
    }),
    [],
  );
}

