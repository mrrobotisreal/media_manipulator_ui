'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Circle, Download, Loader2, RotateCcw, Upload, XCircle } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import useRestoreCapabilities from '@/lib/useRestoreCapabilities';
import useVideoRestore from '@/lib/useVideoRestore';
import useTranscodeJobStatus from '@/lib/useTranscodeJobStatus';
import type { TranscodeJobStage } from '@/lib/transcodeTypes';
import type { RestoreModelId } from '@/lib/restoreTypes';
import SnippetSelector, { type SnippetSelection } from './snippet-selector';
import ModelPicker from './model-picker';

const ASSUMED_FPS = 30;

const stageIcon = (status: TranscodeJobStage['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" aria-hidden="true" />;
    case 'processing':
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin motion-reduce:animate-none shrink-0" aria-hidden="true" />;
    case 'failed':
      return <XCircle className="w-4 h-4 text-destructive shrink-0" aria-hidden="true" />;
    case 'skipped':
      return <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" aria-hidden="true" />;
    default:
      return <Circle className="w-4 h-4 text-muted-foreground/60 shrink-0" aria-hidden="true" />;
  }
};

const formatCountdown = (expiresAt: string, now: number): string | null => {
  const remainingMs = new Date(expiresAt).getTime() - now;
  if (!Number.isFinite(remainingMs) || remainingMs <= 0) return null;
  const totalMinutes = Math.floor(remainingMs / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

// VideoRestorePanel is the interactive island for /tools/ai-video-restoration:
// pick a video → drag-select a short snippet → choose restoration models →
// upload + start → live stage checklist → download the results tarball.
const VideoRestorePanel: React.FC = () => {
  const { t, formatFileSize } = useLocalization('interface');
  const capabilitiesQuery = useRestoreCapabilities();
  const caps = capabilitiesQuery.data;

  const [file, setFile] = useState<File | null>(null);
  const [selection, setSelection] = useState<SnippetSelection>({ start: 0, end: 5 });
  const [selectedModels, setSelectedModels] = useState<RestoreModelId[]>(['realesrgan']);
  const [includeFrames, setIncludeFrames] = useState(true);
  const [jobId, setJobId] = useState<string | null>(null);
  const [fileError, setFileError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [downloadedOnce, setDownloadedOnce] = useState(false);
  const [nowTick, setNowTick] = useState(() => Date.now());
  const autoDownloadedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const restore = useVideoRestore((result) => setJobId(result.jobId));
  const { data: job } = useTranscodeJobStatus(jobId);

  const maxClipSeconds = caps?.maxClipSeconds ?? 15;
  const recommendedClipSeconds = caps?.recommendedClipSeconds ?? 10;
  const maxFrames = caps?.maxFrames ?? 450;

  const windowSeconds = Math.max(0, selection.end - selection.start);
  const estFrames = Math.round(windowSeconds * ASSUMED_FPS);
  const estSecondsPerFrameTotal = useMemo(() => {
    if (!caps) return 0;
    return caps.models
      .filter((m) => selectedModels.includes(m.id))
      .reduce((sum, m) => sum + m.estSecondsPerFrame, 0);
  }, [caps, selectedModels]);

  const acceptFile = (candidate: File | undefined) => {
    setFileError('');
    if (!candidate) return;
    if (!candidate.type.startsWith('video/')) {
      setFileError(t('videoRestore.panel.notAVideo'));
      return;
    }
    if (caps && candidate.size > caps.maxUploadSizeBytes) {
      setFileError(t('videoRestore.panel.tooLarge', { max: formatFileSize(caps.maxUploadSizeBytes) }));
      return;
    }
    setFile(candidate);
  };

  // Auto-download exactly once on completion. The ref guard means re-renders
  // and replayed SSE snapshots can never refire it.
  useEffect(() => {
    if (job?.status === 'completed' && job.resultUrl && !autoDownloadedRef.current) {
      autoDownloadedRef.current = true;
      const a = document.createElement('a');
      a.href = job.resultUrl;
      a.download = job.resultFileName || 'restoration_results.tar.gz';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setDownloadedOnce(true);
    }
  }, [job?.status, job?.resultUrl, job?.resultFileName]);

  // Expiry countdown tick.
  useEffect(() => {
    if (job?.status !== 'completed' || !job.expiresAt) return;
    const timer = setInterval(() => setNowTick(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, [job?.status, job?.expiresAt]);

  const handleDownload = () => {
    if (!job?.resultUrl) return;
    const a = document.createElement('a');
    a.href = job.resultUrl;
    a.download = job.resultFileName || 'restoration_results.tar.gz';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setDownloadedOnce(true);
  };

  const handleReset = () => {
    setFile(null);
    setJobId(null);
    setFileError('');
    setSelection({ start: 0, end: 5 });
    setDownloadedOnce(false);
    autoDownloadedRef.current = false;
    restore.reset();
  };

  const selectionValid = windowSeconds >= 0.5 && windowSeconds <= maxClipSeconds + 0.001;
  const canSubmit = !!file && selectionValid && selectedModels.length > 0 && !restore.isPending && !jobId;

  const modelStages = (job?.stages ?? []).filter((s) => s.key.startsWith('model_'));
  const countdown = job?.expiresAt ? formatCountdown(job.expiresAt, nowTick) : null;

  if (capabilitiesQuery.isLoading) {
    return (
      <div className="my-6 rounded-lg border border-border bg-background/40 p-8 text-center text-sm text-muted-foreground">
        {t('videoRestore.panel.loading')}
      </div>
    );
  }
  if (caps && !caps.enabled) {
    return (
      <div className="my-6 rounded-lg border border-border bg-background/40 p-8 text-center text-sm text-muted-foreground">
        {t('videoRestore.panel.disabled')}
      </div>
    );
  }

  return (
    <div className="my-6 space-y-6">
      {/* Step 1 — file */}
      {!file && (
        <div
          className={`rounded-lg border-2 border-dashed p-10 text-center transition-colors motion-reduce:transition-none cursor-pointer ${
            isDragOver ? 'border-blue-500 bg-blue-500/10' : 'border-border bg-background/40 hover:border-blue-400/60'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            acceptFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
          }}
        >
          <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
          <p className="font-medium">{t('videoRestore.panel.dropTitle')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('videoRestore.panel.dropHint')}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => acceptFile(e.target.files?.[0])}
          />
        </div>
      )}
      {fileError && <p className="text-sm text-destructive">{fileError}</p>}

      {/* Step 2+3 — snippet + models */}
      {file && !jobId && (
        <>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm truncate">
              <span className="text-muted-foreground">{t('videoRestore.panel.fileLabel')}</span>{' '}
              <span className="font-medium">{file.name}</span>{' '}
              <span className="text-muted-foreground">({formatFileSize(file.size)})</span>
            </p>
            <button type="button" onClick={handleReset} className="text-xs text-blue-600 hover:underline whitespace-nowrap">
              {t('videoRestore.panel.changeFile')}
            </button>
          </div>

          <SnippetSelector
            file={file}
            maxClipSeconds={maxClipSeconds}
            recommendedClipSeconds={recommendedClipSeconds}
            maxFrames={maxFrames}
            selection={selection}
            onSelectionChange={setSelection}
            estSecondsPerFrameTotal={estSecondsPerFrameTotal}
            disabled={restore.isPending}
          />

          {caps && (
            <ModelPicker
              models={caps.models}
              selected={selectedModels}
              onSelectedChange={setSelectedModels}
              includeFrames={includeFrames}
              onIncludeFramesChange={setIncludeFrames}
              estFrames={estFrames}
              disabled={restore.isPending}
            />
          )}

          {restore.isPending ? (
            <div className="space-y-2" aria-live="polite">
              <p className="text-sm text-muted-foreground">
                {restore.uploadPhase === 'uploading-to-s3'
                  ? t('videoRestore.panel.uploading', { percent: restore.uploadProgress })
                  : restore.uploadPhase === 'starting'
                    ? t('videoRestore.panel.startingJob')
                    : t('videoRestore.panel.preparingUpload')}
              </p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 motion-reduce:transition-none"
                  style={{ width: `${restore.uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={!canSubmit}
              onClick={() =>
                restore.mutate({
                  file,
                  clipStartSeconds: Math.round(selection.start * 1000) / 1000,
                  clipEndSeconds: Math.round(selection.end * 1000) / 1000,
                  models: selectedModels,
                  scale: 0,
                  includeFrames,
                })
              }
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors motion-reduce:transition-none"
            >
              {t('videoRestore.panel.submit', { count: selectedModels.length })}
            </button>
          )}
        </>
      )}

      {/* Step 4 — job progress */}
      {jobId && job && (
        <div className="space-y-4">
          <ul className="space-y-1.5" aria-live="polite">
            {(job.stages ?? []).map((stage) => (
              <li key={stage.key} className="flex items-center gap-2 text-sm">
                {stageIcon(stage.status)}
                <span className={stage.status === 'pending' ? 'text-muted-foreground' : ''}>{stage.label}</span>
                {stage.status === 'failed' && stage.key.startsWith('model_') && (
                  <span className="text-xs rounded bg-destructive/10 text-destructive px-1.5 py-0.5">
                    {t('videoRestore.panel.modelFailedBadge')}
                  </span>
                )}
                {stage.status === 'failed' && !stage.key.startsWith('model_') && stage.message && (
                  <span className="text-xs text-destructive">{stage.message}</span>
                )}
              </li>
            ))}
          </ul>

          {job.status === 'processing' || job.status === 'pending' ? (
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 motion-reduce:transition-none"
                style={{ width: `${job.progress ?? 0}%` }}
              />
            </div>
          ) : null}

          {job.status === 'failed' && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 space-y-3">
              <p className="text-sm text-destructive">{job.error || t('videoRestore.panel.genericFailure')}</p>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                {t('videoRestore.panel.startOver')}
              </button>
            </div>
          )}

          {job.status === 'completed' && (
            <div className="rounded-md border border-green-500/40 bg-green-500/10 p-4 space-y-3">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                {t('videoRestore.panel.completedTitle')}
              </p>
              {modelStages.length > 0 && (
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {modelStages.map((stage) => (
                    <li key={stage.key}>
                      {stage.label}:{' '}
                      {stage.status === 'completed'
                        ? t('videoRestore.panel.modelSucceeded')
                        : t('videoRestore.panel.modelFailed')}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition-colors motion-reduce:transition-none"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  {downloadedOnce ? t('videoRestore.panel.downloadAgain') : t('videoRestore.panel.download')}
                </button>
                <span className="text-xs text-muted-foreground">
                  {job.resultSizeBytes ? <>{formatFileSize(job.resultSizeBytes)} · </> : null}
                  {countdown
                    ? t('videoRestore.panel.linkExpiresIn', { countdown })
                    : t('videoRestore.panel.linkExpired')}
                </span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                {t('videoRestore.panel.restoreAnother')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoRestorePanel;
