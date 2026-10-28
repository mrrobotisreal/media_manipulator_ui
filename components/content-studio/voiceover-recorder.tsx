'use client';

import React from 'react';
import { Mic, Square, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { useUploadStudioAsset } from '@/lib/useStudioAsset';
import { analytics, EVENTS, fileSizeBucket } from '@/lib/analytics';
import { editSummary, studioHost } from '@/lib/studio/telemetry';
import { nextVoiceoverName } from '@/lib/studio/mediaBin';
import { formatElapsed, voiceoverContentType, voiceoverExtension } from '@/lib/studio/voiceover';
import { useAudioRecorder, type RecordedTake } from '@/components/audio-recorder';

/** Resolve when the asset's ingest finished (store flips to ready) or reject on failure/timeout. */
function waitForAssetReady(assetId: string, timeoutMs = 120_000): Promise<void> {
  return new Promise((resolve, reject) => {
    const check = () => useStudioStore.getState().assets[assetId]?.status;
    const done = (status: string | undefined) => {
      if (status === 'ready') return resolve();
      if (status === 'failed' || status === undefined) return reject(new Error('Voiceover ingest failed'));
    };
    const initial = check();
    if (initial === 'ready') return resolve();
    const timer = setTimeout(() => {
      unsub();
      reject(new Error('Voiceover ingest timed out'));
    }, timeoutMs);
    const unsub = useStudioStore.subscribe((s) => {
      const status = s.assets[assetId]?.status;
      if (status === 'ready' || status === 'failed' || status === undefined) {
        clearTimeout(timer);
        unsub();
        done(status);
      }
    });
  });
}

/**
 * Voiceover recorder (part 21): a mic button for the bin toolbar. Records with
 * MediaRecorder, uploads through the normal ingest queue as "Voiceover N", and
 * on ready drops the clip at the playhead where recording began, on the first
 * audio track with room (creating one when needed). The placement is a normal
 * undoable document edit; the asset itself is bin (server) state.
 */
const VoiceoverRecorder: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { t } = useLocalization('interface');
  const { uploadAsync } = useUploadStudioAsset(projectId);
  const playheadRef = React.useRef(0);

  // MM78: the MediaRecorder I/O lives in the shared hook (components/audio-recorder.tsx);
  // this component keeps the Darkroom part: naming, upload, placement and the toasts.
  const onRecorded = React.useCallback(
    async ({ blob }: RecordedTake) => {
      const baseName = nextVoiceoverName(Object.values(useStudioStore.getState().assets).map((e) => e.asset));
      const file = new File([blob], `${baseName}.${voiceoverExtension(blob.type)}`, {
        type: voiceoverContentType(blob.type),
      });
      analytics.track(
        EVENTS.STUDIO_MEDIA_IMPORTED,
        { kind: 'audio', sizeBucket: fileSizeBucket(file.size), batchBucket: '1', host: studioHost() },
        { feature: 'studio' },
      );
      editSummary.increment('voiceoversRecorded');
      try {
        const result = await uploadAsync(file);
        await waitForAssetReady(result.asset.id);
        useStudioStore.getState().placeAssetAtPlayhead(result.asset.id, playheadRef.current);
        toast.success(t('contentStudio.mediaBin.voiceoverPlaced'));
      } catch {
        // Upload failures already surface as a retryable queue row.
        toast.error(t('contentStudio.mediaBin.voiceoverFailed'));
      }
    },
    [uploadAsync, t],
  );

  const { recording, elapsedMs: elapsed, levelRef, start, stop, cancel } = useAudioRecorder({
    onRecorded: (take) => void onRecorded(take),
    onError: (failure) =>
      toast.error(
        failure === 'denied'
          ? t('contentStudio.mediaBin.micDenied')
          : failure === 'host_blocked'
            ? t('contentStudio.mediaBin.micHostBlocked')
            : t('contentStudio.mediaBin.micUnavailable'),
      ),
    // The clip lands where the playhead was when recording began.
    onStart: () => {
      playheadRef.current = useStudioStore.getState().playhead;
    },
  });

  if (!recording) {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="h-7 px-2"
        onClick={() => void start()}
        title={t('contentStudio.mediaBin.voiceover')}
        aria-label={t('contentStudio.mediaBin.voiceover')}
      >
        <Mic className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div
      className="flex items-center gap-2 rounded-md border border-destructive/60 bg-destructive/10 px-2 py-1"
      role="status"
      aria-label={t('contentStudio.mediaBin.voiceoverRecording')}
    >
      <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" aria-hidden />
      <span className="text-xs tabular-nums text-card-foreground">{formatElapsed(elapsed)}</span>
      <div
        className="w-16 h-1.5 rounded bg-muted overflow-hidden"
        title={t('contentStudio.mediaBin.voiceoverLevel')}
        aria-hidden
      >
        <div ref={levelRef} className="h-full bg-primary" style={{ width: '0%' }} />
      </div>
      <Button size="sm" variant="ghost" className="h-6 px-1.5" onClick={stop} title={t('contentStudio.mediaBin.voiceoverStop')} aria-label={t('contentStudio.mediaBin.voiceoverStop')}>
        <Square className="w-3.5 h-3.5 fill-current" />
      </Button>
      <Button size="sm" variant="ghost" className="h-6 px-1.5" onClick={cancel} title={t('contentStudio.mediaBin.voiceoverCancel')} aria-label={t('contentStudio.mediaBin.voiceoverCancel')}>
        <X className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
};

export default VoiceoverRecorder;
