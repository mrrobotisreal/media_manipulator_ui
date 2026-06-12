'use client';

import React, { useRef, useState } from 'react';
import { CheckCircle2, Circle, Download, Loader2, RotateCcw, Upload, XCircle } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import useImageRestoreCapabilities from '@/lib/useImageRestoreCapabilities';
import useImageRestore from '@/lib/useImageRestore';
import useImageRestoreResults from '@/lib/useImageRestoreResults';
import useTranscodeJobStatus from '@/lib/useTranscodeJobStatus';
import type { TranscodeJobStage } from '@/lib/transcodeTypes';
import type { ImageRestoreModelId, NormalizedRect } from '@/lib/imageRestoreTypes';
import CropSelector from './crop-selector';
import ImageModelPicker from './model-picker';
import ResultsGrid from './results-grid';

const FIXED_STAGE_KEYS = new Set(['queued', 'prepare', 'package', 'completed']);

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

// ImageRestorePanel is the interactive island for /tools/ai-image-restoration:
// pick an image → optionally crop → optionally pre-clean → choose general +
// face models / chain → upload + start → live stage checklist → inline
// comparison grid + results tarball download.
const ImageRestorePanel: React.FC = () => {
  const { t, formatFileSize } = useLocalization('interface');
  const capabilitiesQuery = useImageRestoreCapabilities();
  const caps = capabilitiesQuery.data;

  const [file, setFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<NormalizedRect | null>(null);
  const [preclean, setPreclean] = useState<ImageRestoreModelId[]>([]);
  const [general, setGeneral] = useState<ImageRestoreModelId[]>(['realesrgan']);
  const [face, setFace] = useState<ImageRestoreModelId[]>([]);
  const [precleanEnabled, setPrecleanEnabled] = useState(false);
  const [faceEnabled, setFaceEnabled] = useState(false);
  const [chain, setChain] = useState(false);
  const [scale, setScale] = useState(0);
  const [fbcnnQf, setFbcnnQf] = useState(0);
  const [codeformerFidelity, setCodeformerFidelity] = useState(0.7);
  const [jobId, setJobId] = useState<string | null>(null);
  const [fileError, setFileError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [downloadedOnce, setDownloadedOnce] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const restore = useImageRestore((result) => setJobId(result.jobId));
  const { data: job } = useTranscodeJobStatus(jobId);
  const completed = job?.status === 'completed';
  const { data: results } = useImageRestoreResults(jobId, !!completed);

  const acceptFile = (candidate: File | undefined) => {
    setFileError('');
    if (!candidate) return;
    if (!candidate.type.startsWith('image/')) {
      setFileError(t('imageRestore.panel.notAnImage'));
      return;
    }
    if (caps && candidate.size > caps.maxUploadSizeBytes) {
      setFileError(t('imageRestore.panel.tooLarge', { max: formatFileSize(caps.maxUploadSizeBytes) }));
      return;
    }
    setFile(candidate);
    setCrop(null);
  };

  const handleDownload = () => {
    if (!job?.resultUrl) return;
    const a = document.createElement('a');
    a.href = job.resultUrl;
    a.download = job.resultFileName || 'image_restoration_results.tar.gz';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setDownloadedOnce(true);
  };

  const handleReset = () => {
    setFile(null);
    setCrop(null);
    setJobId(null);
    setFileError('');
    setPreclean([]);
    setGeneral(['realesrgan']);
    setFace([]);
    setPrecleanEnabled(false);
    setFaceEnabled(false);
    setChain(false);
    setScale(0);
    setFbcnnQf(0);
    setCodeformerFidelity(0.7);
    setDownloadedOnce(false);
    restore.reset();
  };

  const totalSelected = preclean.length + general.length + face.length;
  const canSubmit = !!file && totalSelected > 0 && !restore.isPending && !jobId;

  if (capabilitiesQuery.isLoading) {
    return (
      <div className="my-6 rounded-lg border border-border bg-background/40 p-8 text-center text-sm text-muted-foreground">
        {t('imageRestore.panel.loading')}
      </div>
    );
  }
  if (caps && !caps.enabled) {
    return (
      <div className="my-6 rounded-lg border border-border bg-background/40 p-8 text-center text-sm text-muted-foreground">
        {t('imageRestore.panel.disabled')}
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
          <p className="font-medium">{t('imageRestore.panel.dropTitle')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('imageRestore.panel.dropHint')}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => acceptFile(e.target.files?.[0])}
          />
        </div>
      )}
      {fileError && <p className="text-sm text-destructive">{fileError}</p>}

      {/* Step 2+ — crop + models + scale */}
      {file && !jobId && caps && (
        <>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm truncate">
              <span className="text-muted-foreground">{t('imageRestore.panel.fileLabel')}</span>{' '}
              <span className="font-medium">{file.name}</span>{' '}
              <span className="text-muted-foreground">({formatFileSize(file.size)})</span>
            </p>
            <button type="button" onClick={handleReset} className="text-xs text-blue-600 hover:underline whitespace-nowrap">
              {t('imageRestore.panel.changeFile')}
            </button>
          </div>

          <CropSelector
            file={file}
            crop={crop}
            onCropChange={setCrop}
            scale={scale}
            maxOutputPixels={caps.maxOutputPixels}
            disabled={restore.isPending}
          />

          <ImageModelPicker
            file={file}
            models={caps.models}
            preclean={preclean}
            onPrecleanChange={setPreclean}
            general={general}
            onGeneralChange={setGeneral}
            face={face}
            onFaceChange={setFace}
            precleanEnabled={precleanEnabled}
            onPrecleanEnabledChange={setPrecleanEnabled}
            faceEnabled={faceEnabled}
            onFaceEnabledChange={setFaceEnabled}
            chain={chain}
            onChainChange={setChain}
            fbcnnQf={fbcnnQf}
            onFbcnnQfChange={setFbcnnQf}
            codeformerFidelity={codeformerFidelity}
            onCodeformerFidelityChange={setCodeformerFidelity}
            maxOutputs={caps.maxOutputs}
            disabled={restore.isPending}
          />

          {/* Scale */}
          <fieldset className="space-y-1.5">
            <legend className="text-sm font-semibold">{t('imageRestore.panel.scaleLabel')}</legend>
            <div className="flex gap-2">
              {[
                { value: 0, label: t('imageRestore.panel.scaleAuto') },
                { value: 2, label: '2x' },
                { value: 4, label: '4x' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  disabled={restore.isPending}
                  onClick={() => setScale(opt.value)}
                  className={`rounded-md border px-4 py-1.5 text-sm transition-colors motion-reduce:transition-none ${
                    scale === opt.value ? 'border-blue-500 bg-blue-500/10 font-medium' : 'border-input hover:bg-muted'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{t('imageRestore.panel.scaleHint')}</p>
          </fieldset>

          {restore.isPending ? (
            <div className="space-y-2" aria-live="polite">
              <p className="text-sm text-muted-foreground">
                {restore.uploadPhase === 'uploading'
                  ? t('imageRestore.panel.uploading', { percent: restore.uploadProgress })
                  : restore.uploadPhase === 'starting'
                    ? t('imageRestore.panel.startingJob')
                    : t('imageRestore.panel.preparingUpload')}
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
                  options: {
                    crop: crop ?? undefined,
                    preclean,
                    models: general,
                    faceModels: face,
                    chain,
                    scale,
                    codeformerFidelity,
                    fbcnnQualityFactor: fbcnnQf,
                  },
                })
              }
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors motion-reduce:transition-none"
            >
              {t('imageRestore.panel.submit', { count: totalSelected })}
            </button>
          )}
        </>
      )}

      {/* Step 3 — job progress + results */}
      {jobId && job && (
        <div className="space-y-4">
          <ul className="space-y-1.5" aria-live="polite">
            {(job.stages ?? []).map((stage) => (
              <li key={stage.key} className="flex items-center gap-2 text-sm">
                {stageIcon(stage.status)}
                <span className={stage.status === 'pending' ? 'text-muted-foreground' : ''}>{stage.label}</span>
                {stage.status === 'failed' && !FIXED_STAGE_KEYS.has(stage.key) && (
                  <span className="text-xs rounded bg-destructive/10 text-destructive px-1.5 py-0.5">
                    {t('imageRestore.panel.unitFailedBadge')}
                  </span>
                )}
                {stage.status === 'failed' && FIXED_STAGE_KEYS.has(stage.key) && stage.message && (
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
              <p className="text-sm text-destructive">{job.error || t('imageRestore.panel.genericFailure')}</p>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                {t('imageRestore.panel.startOver')}
              </button>
            </div>
          )}

          {completed && (
            <div className="space-y-4">
              <div className="rounded-md border border-green-500/40 bg-green-500/10 p-4 space-y-3">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  {t('imageRestore.panel.completedTitle')}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition-colors motion-reduce:transition-none"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    {downloadedOnce ? t('imageRestore.panel.downloadAgain') : t('imageRestore.panel.download')}
                  </button>
                  {job.resultSizeBytes ? (
                    <span className="text-xs text-muted-foreground">
                      {t('imageRestore.panel.downloadSize', { size: formatFileSize(job.resultSizeBytes) })}
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  {t('imageRestore.panel.restoreAnother')}
                </button>
              </div>

              {results && <ResultsGrid jobId={jobId} data={results} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageRestorePanel;
