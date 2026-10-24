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
import {
  classifyMicError,
  formatElapsed,
  isEmbeddedFrame,
  levelFromTimeDomain,
  pickVoiceoverMime,
  voiceoverContentType,
  voiceoverExtension,
} from '@/lib/studio/voiceover';

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
  const [recording, setRecording] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const levelRef = React.useRef<HTMLDivElement>(null);

  const recRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const cancelledRef = React.useRef(false);
  const startedAtRef = React.useRef(0);
  const playheadRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const ctxRef = React.useRef<AudioContext | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const teardown = React.useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    void ctxRef.current?.close().catch(() => undefined);
    ctxRef.current = null;
    recRef.current = null;
    setRecording(false);
    setElapsed(0);
  }, []);

  // Unmount mid-recording (tab switch, closing the editor): discard and release the mic.
  React.useEffect(
    () => () => {
      cancelledRef.current = true;
      const rec = recRef.current;
      if (rec && rec.state !== 'inactive') {
        try {
          rec.stop();
        } catch {
          // already stopped
        }
      }
      teardown();
    },
    [teardown],
  );

  const finish = React.useCallback(
    async (mime: string) => {
      const chunks = chunksRef.current;
      chunksRef.current = [];
      teardown();
      if (cancelledRef.current || chunks.length === 0) return;
      const blob = new Blob(chunks, { type: mime || chunks[0].type || 'audio/webm' });
      if (blob.size === 0) return;
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
    [teardown, uploadAsync, t],
  );

  const start = async () => {
    if (recording) return;
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      toast.error(t('contentStudio.mediaBin.micUnavailable'));
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      const failure = classifyMicError(err, isEmbeddedFrame(typeof window === 'undefined' ? undefined : window));
      toast.error(
        failure === 'denied'
          ? t('contentStudio.mediaBin.micDenied')
          : failure === 'host_blocked'
            ? t('contentStudio.mediaBin.micHostBlocked')
            : t('contentStudio.mediaBin.micUnavailable'),
      );
      return;
    }
    streamRef.current = stream;
    cancelledRef.current = false;
    chunksRef.current = [];
    playheadRef.current = useStudioStore.getState().playhead;

    const mime = pickVoiceoverMime(MediaRecorder.isTypeSupported?.bind(MediaRecorder));
    let rec: MediaRecorder;
    try {
      rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    } catch {
      stream.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
      toast.error(t('contentStudio.mediaBin.micUnavailable'));
      return;
    }
    recRef.current = rec;
    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    rec.onstop = () => void finish(rec.mimeType || mime);
    rec.start(1000);

    // Level meter: AnalyserNode driven straight into a DOM node (no re-render per frame).
    try {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC) {
        const ctx = new AC();
        ctxRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const data = new Uint8Array(analyser.fftSize);
        const tick = () => {
          analyser.getByteTimeDomainData(data);
          if (levelRef.current) levelRef.current.style.width = `${Math.round(levelFromTimeDomain(data) * 100)}%`;
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      }
    } catch {
      // Meter is cosmetic.
    }

    startedAtRef.current = Date.now();
    setElapsed(0);
    setRecording(true);
    timerRef.current = setInterval(() => setElapsed(Date.now() - startedAtRef.current), 250);
  };

  const stop = () => {
    const rec = recRef.current;
    if (rec && rec.state !== 'inactive') rec.stop();
  };
  const cancel = () => {
    cancelledRef.current = true;
    const rec = recRef.current;
    if (rec && rec.state !== 'inactive') rec.stop();
    else teardown();
  };

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
