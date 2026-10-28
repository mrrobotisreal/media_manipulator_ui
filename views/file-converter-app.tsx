'use client';

import React, { lazy, Suspense, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Trans } from 'react-i18next';
import { Upload, Download, Loader2, Image, Video, Music, X, Settings, FileText, BookOpen, HelpCircle, Sparkles, Film, Clapperboard, ArrowRight } from 'lucide-react';
import { cn, getFileType } from '@/lib/utils';
import FilePreview from '@/components/file-preview';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { withToolShards } from '@/lib/i18n/ensureShard';
import type { ConversionFormData } from '@/schemas/types';

// Each conversion form pulls in its own schema, form fields, and helpers.
// Lazy-loading keeps the homepage chunk light — we only fetch the form
// matching the kind of file the user actually drops in.
//
// `withToolShards` chains the forms/panels translation bundles onto the same
// Suspense boundary, so the homepage never ships those 65 KB of JSON and no
// form can render before its strings have arrived.
const ImageConversionForm = lazy(() => withToolShards(() => import('@/components/image-conversion-form')));
const VideoConversionForm = lazy(() => withToolShards(() => import('@/components/video-conversion-form')));
const AudioConversionForm = lazy(() => withToolShards(() => import('@/components/audio-conversion-form')));
const TranscribeForm = lazy(() => withToolShards(() => import('@/components/transcribe-form')));
const VideoTranscodeForm = lazy(() => withToolShards(() => import('@/components/video-transcode-form')));
// AI Document Scan island — the panel owns its own upload/SSE/result-modal flow,
// so the home page needs no extra job plumbing for it.
const DocumentScanPanel = lazy(() => withToolShards(() => import('@/components/document-scan/document-scan-panel')));

const FormFallback: React.FC = () => {
  const { t } = useLocalization('interface');
  return (
    <div className="text-sm text-muted-foreground py-4">{t('home.fileLoadingConverter')}</div>
  );
};
import useConvertFile, { type UploadFileResponse } from '@/lib/useConvertFile';
import useTranscribeFile, { type TranscribeFormData, type TranscribeUploadResponse } from '@/lib/useTranscribeFile';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import useGetJobStatus from '@/lib/useGetJobStatus';
import { downloadResult, useDownloadStatus } from '@/lib/results/downloadController';
import { DownloadStatusLine } from '@/components/results/download-status';
import { describe as describeResult } from '@/lib/results/describe';
import { peekResultBlob } from '@/lib/results/useResultBlob';
import { ResultPanel } from '@/components/results/result-panel';
import { QuotaChip } from '@/components/quota-chip';
import { RecentStrip } from '@/components/history/recent-strip';
import {
  EVENTS,
  getVisitorId,
  normalizeMediaKind,
  safeFileExtension,
  trackFileChoice,
  ToolAnalyticsProvider,
  useAnalytics,
  useToolAnalytics,
} from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Panel } from '@/components/darkroom/panel';
import { ProcessingIndicator } from '@/components/darkroom/processing-indicator';

/** Lazy chunk: the inspector flow adds nothing to the home route's first load. */
const HomeMetadata = dynamic(() => import('@/components/metadata/home-metadata'), { ssr: false });

type WorkflowMode = 'convert' | 'transcribe' | 'transcode' | 'document';

interface ConversionHistoryItem {
  jobId: string;
  mediaKind: 'image' | 'video' | 'audio' | 'pdf' | 'unknown';
  mode: WorkflowMode;
  fileName: string;
  outputFileName: string;
  format: string;
  originalUrl: string;
  startedAt: number;
  completedAt?: number;
  status: 'processing' | 'completed' | 'failed';
  blob?: Blob;
  /** From the job snapshot at completion; feed the ResultPanel header and viewer choice. */
  resultSizeBytes?: number;
  expiresAt?: string;
  resultMime?: string;
  metadataAvailable?: { original: boolean; result: boolean };
  strippedCount?: number;
  error?: string;
}

interface PendingConversionDetails {
  mediaKind: 'image' | 'video' | 'audio' | 'pdf' | 'unknown';
  mode: WorkflowMode;
  fileName: string;
  outputFileName: string;
  format: string;
  originalUrl: string;
  startedAt: number;
}

/**
 * The homepage converter.
 *
 * Wrapped in a ToolAnalyticsProvider with slug `null`. That is deliberate and not an
 * oversight: this surface is a tool, but it has no `content/toolPages.ts` record, and giving
 * it a made-up slug would merge its numbers with /tools/image-converter in every per-tool
 * report. `null` means "the homepage converter", the media kind comes from the selected
 * file, and the events are still fully attributed by page_type and pathname.
 */
const FileConverterApp: React.FC = () => (
  <ToolAnalyticsProvider slug={null} viewEntryPoint="homepage">
    <FileConverterAppInner />
  </ToolAnalyticsProvider>
);

/**
 * A history row's Download (MM80): its own spinner + "Preparing download…" label and the
 * shared status line, read from the download controller by job id.
 */
function HistoryDownloadButton({ jobId, disabled, label, preparingLabel, onDownload }: {
  jobId: string;
  disabled: boolean;
  label: string;
  preparingLabel: string;
  onDownload: () => void;
}) {
  const status = useDownloadStatus(jobId);
  const preparing = status.phase === 'preparing';
  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        disabled={disabled || preparing}
        aria-busy={preparing || undefined}
        onClick={onDownload}
        className="inline-flex items-center gap-1.5 text-sm bg-success text-success-foreground px-3 py-2 rounded-lg hover:bg-success/90 disabled:bg-surface-3 disabled:cursor-not-allowed transition-colors"
      >
        {preparing && <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />}
        {preparing ? preparingLabel : label}
      </button>
      {(status.phase === 'started' || status.phase === 'failed') && (
        <DownloadStatusLine status={status} onRetry={onDownload} className="text-xs" />
      )}
    </div>
  );
}

const FileConverterAppInner: React.FC = () => {
  const { t, formatFileSize, formatTime } = useLocalization(['interface', 'accessibility', 'error']);
  const localized = useLocalizedHref();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const [conversionOptions, setConversionOptions] = useState<ConversionFormData | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [conversionStartTime, setConversionStartTime] = useState<number | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [resultSurface, setResultSurface] = useState<'home' | 'history'>('home');
  const [autoOpenedResultJobId, setAutoOpenedResultJobId] = useState<string | null>(null);
  const [conversionHistory, setConversionHistory] = useState<ConversionHistoryItem[]>([]);
  const [activeResultJobId, setActiveResultJobId] = useState<string | null>(null);
  const conversionHistoryRef = useRef<ConversionHistoryItem[]>([]);
  const pendingConversionRef = useRef<PendingConversionDetails | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [workflowMode, setWorkflowMode] = useState<WorkflowMode>('convert');

  // slug (null) + media_kind ride along on everything trackTool emits.
  const { track: trackTool, setMediaKind: setToolMediaKind } = useToolAnalytics();
  // Nullable: this view also renders inside the chromeless trees where there is no
  // AuthProvider. Only used to read the tier's file-size ceiling for `file_rejected`.
  const auth = useAuth();
  const { reportError } = useAnalytics();

  const { data: jobStatusData } = useGetJobStatus(conversionJob);

  /**
   * One place for `file_selected`, shared by the picker and the drop handler.
   *
   * The two paths used to duplicate the call, which is how they came to disagree about what
   * they sent. `source` distinguishes them, because drag-and-drop versus click is a real UX
   * signal on a file-conversion site.
   */
  const trackFileChosen = useCallback(
    (file: File, source: 'picker' | 'drop') => {
      const fileKind = getFileType(file);
      setToolMediaKind(normalizeMediaKind(fileKind));
      // `unsupported` is what this converter's own render decides: with no recognised
      // media kind it shows "unsupported file" and offers no form, so the file never
      // enters the funnel. trackFileChoice turns that into `file_rejected` instead of
      // `file_selected` — see its comment for why the two are mutually exclusive here and
      // additive for the size ceiling.
      trackFileChoice(trackTool, file, fileKind, {
        source,
        unsupported: fileKind === 'unknown',
        limitBytes: auth?.limits?.maxFileBytes,
      });
    },
    [auth?.limits?.maxFileBytes, setToolMediaKind, trackTool],
  );

  const handleUploadStart = useCallback((jobId: string) => {
    setConversionStartTime(Date.now());
    const pending = pendingConversionRef.current;
    setConversionJob({
      id: jobId,
      status: 'processing',
      originalFile: selectedFile!,
      progress: 0,
    });
    if (pending) {
      setConversionHistory(prev => [
        {
          jobId,
          mediaKind: pending.mediaKind,
          mode: pending.mode,
          fileName: pending.fileName,
          outputFileName: pending.outputFileName,
          format: pending.format,
          originalUrl: pending.originalUrl,
          startedAt: pending.startedAt,
          status: 'processing',
        },
        ...prev,
      ]);
    }
  }, [selectedFile]);

  const { mutate, isPending, uploadProgress, uploadPhase } = useConvertFile((res: UploadFileResponse) => {
    handleUploadStart(res.jobId);
  });

  const {
    mutate: transcribeMutate,
    isPending: isTranscribePending,
    uploadProgress: transcribeUploadProgress,
    uploadPhase: transcribeUploadPhase,
  } = useTranscribeFile((res: TranscribeUploadResponse) => {
    handleUploadStart(res.jobId);
  });


  const fileType = selectedFile ? getFileType(selectedFile) : null;

  useEffect(() => {
    if (!selectedFile || getFileType(selectedFile) !== 'image') {
      setOriginalImageUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setOriginalImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  useEffect(() => {
    conversionHistoryRef.current = conversionHistory;
  }, [conversionHistory]);

  useEffect(() => {
    return () => {
      conversionHistoryRef.current.forEach(item => {
        URL.revokeObjectURL(item.originalUrl);
      });
    };
  }, []);

  // The homepage converter IS a tool, so it announces itself at the top of the funnel with
  // slug `null` — it has no toolPages.ts record, and inventing one would make it collide
  // with /tools/image-converter in every per-tool report.
  //
  // Identity bootstrap is gone: lib/analytics/identity.ts mints the visitor id
  // synchronously on first read, so there is nothing to await and nothing to fail. The old
  // `trackUserSession({ user_type })` call is gone too — new-vs-returning is now derived
  // server-side from `visitors.visit_count`, which is correct across devices and does not
  // depend on a `hasVisited` localStorage flag that a cleared browser resets.
  //
  // `tool_viewed` itself is emitted by the ToolAnalyticsProvider above (viewEntryPoint
  // 'homepage'), so the same one component owns the top of the funnel on every tool
  // surface — including the four /tools pages with custom panels, which is why it moved.
  useEffect(() => {
    // Touch the visitor id so it exists before the first tool event needs it.
    getVisitorId();
  }, []);

  React.useEffect(() => {
    if (jobStatusData) {
      const previousStatus = conversionJob?.status;
      setConversionJob(prev => prev ? { ...prev, ...jobStatusData } : null);

      // The terminal funnel events, on the status TRANSITION.
      //
      // NOTE: useGetJobStatus also emits job_completed / job_failed on the same transition,
      // and takeJobDuration consumes the timing entry — so whichever runs first gets the
      // duration and the other is a duplicate. That duplication is REMOVED here: this view
      // now only maintains its own history state, and the events come from the hook, which
      // is the one place every tool's polling goes through.
      if (previousStatus === 'processing' && jobStatusData.status === 'completed') {
        setConversionHistory(prev => prev.map(item => item.jobId === jobStatusData.id
          ? {
              ...item,
              status: 'completed',
              completedAt: Date.now(),
              resultSizeBytes: jobStatusData.resultSizeBytes,
              expiresAt: jobStatusData.expiresAt,
              resultMime: jobStatusData.resultMime,
              metadataAvailable: jobStatusData.metadataAvailable,
              strippedCount: jobStatusData.strippedCount,
            }
          : item
        ));
      }

      // Same reasoning as the completed branch: job_failed comes from useGetJobStatus.
      if (previousStatus === 'processing' && jobStatusData.status === 'failed') {
        setConversionHistory(prev => prev.map(item => item.jobId === jobStatusData.id
          ? { ...item, status: 'failed', error: jobStatusData.error || 'Conversion failed' }
          : item
        ));
      }
    }
  }, [jobStatusData, conversionJob?.status, conversionStartTime, conversionOptions, fileType, selectedFile]);

  // File drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setConversionJob(null);
      setConversionOptions(null);
      setIsResultModalOpen(false);
      setActiveResultJobId(null);
      setWorkflowMode('convert');

      trackFileChosen(file, 'drop');
    }
    // trackFileChosen is a stable useCallback; listing it would churn this handler's
    // identity on every render for no benefit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setConversionJob(null);
      setConversionOptions(null);
      setIsResultModalOpen(false);
      setActiveResultJobId(null);
      setWorkflowMode('convert');

      trackFileChosen(file, 'picker');
    }
  };

  const handleConvert = (data: ConversionFormData) => {
    if (!selectedFile) return;
    const originalName = selectedFile.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const outputFileName = `${nameWithoutExt}.${data.format}`;
    const mediaKind = getFileType(selectedFile);
    pendingConversionRef.current = {
      mediaKind,
      mode: 'convert',
      fileName: selectedFile.name,
      outputFileName,
      format: data.format,
      originalUrl: URL.createObjectURL(selectedFile),
      startedAt: Date.now(),
    };
    setConversionOptions(data); // Store the conversion options
    setConversionJob(null);
    setIsResultModalOpen(false);
    setAutoOpenedResultJobId(null);
    setActiveResultJobId(null);
    setActiveResultJobId(null);

    // Which options people actually touch, one priority-3 event per non-default option.
    // These are the lowest-value events in the catalog and the first evicted under
    // pressure, which is exactly right for a slider.
    Object.entries(data)
      .filter(([key, value]) => key !== 'format' && value !== null && value !== undefined && value !== '')
      .forEach(([key, value]) => {
        trackTool(EVENTS.OPTIONS_CHANGED, {
          option: key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value),
        });
      });

    // No "conversion started" event here. `job_started` is emitted by useConvertFile once
    // the API has ACCEPTED the job and returned a jobId — counting clicks the server later
    // rejected as conversions made the funnel's success rate look worse than it was.
    mutate({ file: selectedFile, options: data });
  };

  const handleTranscribe = (data: TranscribeFormData) => {
    if (!selectedFile) return;
    const mediaKind = getFileType(selectedFile);
    if (mediaKind !== 'video' && mediaKind !== 'audio') return;
    const originalName = selectedFile.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const outputFileName = `${nameWithoutExt}_transcript.${data.format}`;
    pendingConversionRef.current = {
      mediaKind,
      mode: 'transcribe',
      fileName: selectedFile.name,
      outputFileName,
      format: data.format,
      originalUrl: URL.createObjectURL(selectedFile),
      startedAt: Date.now(),
    };
    setConversionOptions({ format: data.format } as unknown as ConversionFormData);
    setConversionJob(null);
    setIsResultModalOpen(false);
    setAutoOpenedResultJobId(null);
    setActiveResultJobId(null);
    transcribeMutate({ file: selectedFile, options: data });
    // The transcribe workflow's own job_started comes from useTranscribeFile. This records
    // the workflow CHOICE, which is a different question: how many homepage visitors reach
    // for transcription rather than conversion.
    trackTool(
      EVENTS.FEATURE_USED,
      { feature: 'transcribe', action: 'submitted', value: data.format },
      { media_kind: normalizeMediaKind(mediaKind), feature: 'transcribe' },
    );
  };

  const getConvertedFilename = () => {
    if (!selectedFile || !conversionOptions) return selectedFile?.name || 'converted_file';

    const originalName = selectedFile.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const newExtension = conversionOptions.format;
    if (workflowMode === 'transcribe') {
      return `${nameWithoutExt}_transcript.${newExtension}`;
    }

    return `${nameWithoutExt}.${newExtension}`;
  };

  /**
   * Open the shared ResultPanel for a finished job.
   *
   * Four buttons reach this (the inline Show result, the history list, the transcribe view
   * and the auto-open effect after a conversion completes). Fetching the bytes, the
   * Original/Result toggle and `result_previewed` (once per job) now belong to ResultPanel,
   * so all this does is pick the job and open the dialog.
   */
  const loadResultPreview = useCallback((jobId = conversionJob?.id, openModal = true, surface: 'home' | 'history' = 'home') => {
    if (!jobId) return;
    const historyItem = conversionHistory.find(item => item.jobId === jobId);
    const isCompleted = historyItem?.status === 'completed' || (conversionJob?.id === jobId && conversionJob.status === 'completed');
    if (!historyItem || !isCompleted) return;
    setActiveResultJobId(jobId);
    setResultSurface(surface);
    if (openModal) setIsResultModalOpen(true);
  }, [conversionHistory, conversionJob?.id, conversionJob?.status]);

  const cacheHistoryBlob = useCallback((jobId: string, blob: Blob) => {
    setConversionHistory(prev => prev.some(item => item.jobId === jobId && !item.blob)
      ? prev.map(item => item.jobId === jobId && !item.blob ? { ...item, blob } : item)
      : prev);
  }, []);

  useEffect(() => {
    if (
      conversionJob?.status === 'completed' &&
      conversionJob.id !== autoOpenedResultJobId &&
      conversionHistory.some(item => item.jobId === conversionJob.id)
    ) {
      setAutoOpenedResultJobId(conversionJob.id);
      loadResultPreview(conversionJob.id, true);
    }
  }, [autoOpenedResultJobId, conversionHistory, conversionJob?.id, conversionJob?.status, loadResultPreview]);

  // MM80: small bytes already in memory are saved directly; anything else gets a signed link
  // and the browser's own download manager (never `response.blob()` of a huge result).
  // Status (preparing / started / failed) and the double-click guard live in the shared
  // download controller, so this button, the history row and the result modal agree.
  const handleDownload = async (jobId = conversionJob?.id, fileName = getConvertedFilename()) => {
    if (!jobId) return;
    const historyItem = conversionHistory.find(item => item.jobId === jobId);
    const mediaKind = normalizeMediaKind(historyItem?.mediaKind || fileType || undefined);
    const result = await downloadResult({
      jobId,
      fileName,
      cachedBlob: historyItem?.blob ?? peekResultBlob(jobId),
      sizeBytes: historyItem?.resultSizeBytes,
      track: trackTool,
      trackOptions: { job_id: jobId, media_kind: mediaKind },
      outputFormat: historyItem?.format || conversionOptions?.format || safeFileExtension(fileName),
      includeJobDuration: true,
    });
    if (result.outcome === 'failed') {
      console.error('Download failed:', result.error);
      reportError(result.error, { stage: 'download' });
    }
  };

  const mainDownloadStatus = useDownloadStatus(conversionJob?.id);

  const clearFile = () => {
    // `after` is what makes this event worth having: a reset following a failure is a RETRY
    // (the visitor is still trying), and one following a completed job is a fresh start
    // (they succeeded and came back for more). Those are opposite signals.
    trackTool(EVENTS.TOOL_RESET, {
      after:
        conversionJob?.status === 'failed'
          ? 'failure'
          : conversionJob?.status === 'completed'
            ? 'success'
            : 'idle',
    });
    setSelectedFile(null);
    setConversionJob(null);
    setConversionOptions(null);
    setConversionStartTime(null);
    setIsResultModalOpen(false);
    setAutoOpenedResultJobId(null);
    setWorkflowMode('convert');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-6 h-6" />;
      case 'video': return <Video className="w-6 h-6" />;
      case 'audio': return <Music className="w-6 h-6" />;
      default: return <Upload className="w-6 h-6" />;
    }
  };

  const isLoading = isPending || isTranscribePending || conversionJob?.status === 'processing';
  const activePhase = isTranscribePending ? transcribeUploadPhase : uploadPhase;
  const activeProgress = isTranscribePending ? transcribeUploadProgress : uploadProgress;
  const uploadPhaseLabel = activePhase === 'requesting-url'
    ? t('interface:home.progress.preparingUpload')
    : activePhase === 'uploading-to-s3'
      ? t('interface:home.progress.uploadingToS3')
      : activePhase === 'finalizing'
        ? t('interface:home.progress.finalizing')
        : workflowMode === 'transcribe'
          ? t('interface:home.progress.startingTranscription')
          : t('interface:home.progress.startingConversion');

  const formatHistoryTime = (timestamp: number) => formatTime(timestamp);
  const activeHistoryItem = activeResultJobId
    ? conversionHistory.find(item => item.jobId === activeResultJobId)
    : undefined;
  const activeDescriptor = useMemo(() => {
    if (!activeHistoryItem) return null;
    const originalKind = activeHistoryItem.mediaKind === 'image' || activeHistoryItem.mediaKind === 'video' || activeHistoryItem.mediaKind === 'audio'
      ? activeHistoryItem.mediaKind
      : 'unknown';
    return describeResult({
      job: {
        id: activeHistoryItem.jobId,
        resultFileName: activeHistoryItem.outputFileName,
        resultSizeBytes: activeHistoryItem.resultSizeBytes,
        expiresAt: activeHistoryItem.expiresAt,
        resultMime: activeHistoryItem.resultMime,
        metadataAvailable: activeHistoryItem.metadataAvailable,
        strippedCount: activeHistoryItem.strippedCount,
      },
      mode: activeHistoryItem.mode,
      original: {
        file: null,
        objectUrl: activeHistoryItem.originalUrl,
        fileName: activeHistoryItem.fileName,
        kind: originalKind,
      },
    });
  }, [activeHistoryItem]);

  return (
    <>
      {activeHistoryItem && (
        <ResultPanel
          variant="modal"
          surface={resultSurface}
          open={isResultModalOpen}
          onOpenChange={setIsResultModalOpen}
          descriptor={activeDescriptor!}
          title={activeHistoryItem.mode === 'transcribe' ? t('interface:home.result.transcriptResult') : t('interface:home.result.convertedPreview')}
          subtitle={activeHistoryItem.mode === 'transcribe'
            ? t('interface:home.result.transcriptSubtitle', { filename: activeHistoryItem.fileName })
            : t('interface:home.result.convertedSubtitle', { filename: activeHistoryItem.fileName })}
          downloadFileName={activeHistoryItem.outputFileName}
          onDownload={() => handleDownload(activeHistoryItem.jobId, activeHistoryItem.outputFileName)}
          seedBlob={activeHistoryItem.blob}
          onBlobLoaded={(blob) => cacheHistoryBlob(activeHistoryItem.jobId, blob)}
        />
      )}

      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-center p-4 pt-8">
        <header className="w-full max-w-5xl text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-card-foreground tracking-tight">
            {t('interface:home.hero.title')}
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('interface:home.hero.subtitle')}
          </p>
          <QuotaChip busy={isLoading} className="mt-4 justify-center" />
        </header>

        <RecentStrip className="mx-auto mb-6 w-full max-w-5xl" />

        <div className="mx-auto grid w-full max-w-[1600px] gap-6 lg:grid-cols-2">
          {/* File Upload Section */}
          <Panel level="1" className="w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-card-foreground">
              <Upload className="w-5 h-5" />
              {t('interface:home.upload.title')}
            </h2>

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  'flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center sm:p-8',
                  'transition-[background-color,border-color,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-instrument)]',
                  isDragOver
                    ? 'border-primary bg-primary/10 shadow-[var(--glow-primary)]'
                    : 'border-edge-strong hover:border-primary/60 hover:bg-surface-2/40'
                )}
              >
                <Upload
                  aria-hidden="true"
                  className={cn(
                    'mb-4 size-10 transition-colors duration-[var(--dur-base)] sm:size-12',
                    isDragOver ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <p className="mb-2 text-lg font-medium text-card-foreground">
                  {t('interface:home.upload.dragDrop')}
                </p>
                <p className="mb-4 text-muted-foreground">
                  {t('interface:home.upload.orClickSelect')}
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[44px] rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground transition-colors duration-[var(--dur-base)] ease-[var(--ease-instrument)] hover:bg-[var(--accent-primary-hover)]"
                >
                  {t('interface:home.upload.chooseFile')}
                </button>
                <p className="num mt-4 text-xs text-muted-foreground">image · video · audio</p>
                {/* Visually hidden but still in the a11y tree, so it needs
                    its own name — the visible button is a sibling, not a label. */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept="image/*,video/*,audio/*"
                  className="hidden"
                  aria-label={t('interface:home.upload.chooseFile')}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(fileType!)}
                    <div>
                      <p className="font-medium text-card-foreground">{selectedFile.name}</p>
                      <p className="num text-sm text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearFile}
                    className="text-muted-foreground hover:text-card-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Preview */}
                <FilePreview
                  file={selectedFile}
                  resultAvailable={conversionJob?.status === 'completed'}
                  onShowResult={() => loadResultPreview(conversionJob?.id, true)}
                />

                {/* Metadata inspector (MM11): auto for images, documents and files up to 100 MB. */}
                <HomeMetadata
                  key={`${selectedFile.name}:${selectedFile.size}:${selectedFile.lastModified}`}
                  file={selectedFile}
                  kind={getFileType(selectedFile)}
                  uploading={isPending || isTranscribePending}
                />

              </div>
            )}

            {conversionHistory.length > 0 && (
              <div className="bg-card rounded-lg border p-4 space-y-3 mt-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-card-foreground">{t('interface:home.history.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('interface:home.history.subtitle')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-sm bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors"
                  >
                    {t('interface:home.history.newConversion')}
                  </button>
                </div>
                <div className="space-y-2">
                  {conversionHistory.map((item, index) => (
                    <div key={item.jobId} className="border border-border rounded-lg p-3">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium text-card-foreground flex items-center gap-2">
                            {item.mode === 'transcribe' ? <FileText className="w-6 h-6" /> : getFileIcon(item.mediaKind)}
                            <span>
                              {t('interface:home.history.itemLabel', { number: conversionHistory.length - index, filename: item.outputFileName })}
                              {item.mode === 'transcribe' && (
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                  {t('interface:home.history.transcriptBadge')}
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.status === 'processing'
                              ? t('interface:home.history.startedProcessing', { time: formatHistoryTime(item.startedAt) })
                              : item.status === 'completed'
                                ? t('interface:home.history.completedAt', { time: formatHistoryTime(item.completedAt || item.startedAt) })
                                : item.error || (item.mode === 'transcribe' ? t('interface:home.history.transcriptionFailed') : t('interface:home.history.conversionFailed'))}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={item.status !== 'completed'}
                            onClick={() => loadResultPreview(item.jobId, true, 'history')}
                            className="text-sm bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-[var(--accent-primary-hover)] disabled:bg-surface-3 disabled:cursor-not-allowed transition-colors"
                          >
                            {t('interface:home.history.preview')}
                          </button>
                          <HistoryDownloadButton
                            jobId={item.jobId}
                            disabled={item.status !== 'completed'}
                            label={t('interface:home.history.download')}
                            preparingLabel={t('interface:resultPanel.downloadStatus.preparing')}
                            onDownload={() => void handleDownload(item.jobId, item.outputFileName)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </Panel>

          {/* Conversion Options */}
          <Panel level="1" className="w-full max-w-4xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-card-foreground">
              <Settings className="w-5 h-5" />
              {workflowMode === 'transcribe'
                ? t('interface:home.options.transcriptionOptions')
                : workflowMode === 'transcode'
                  ? t('interface:home.options.transcodeOptions')
                  : workflowMode === 'document'
                    ? t('interface:home.options.documentScanOptions')
                    : t('interface:home.options.conversionOptions')}
            </h2>

            {selectedFile && (fileType === 'video' || fileType === 'audio') && (
              <div className="flex rounded-lg border overflow-hidden mb-4">
                <button
                  type="button"
                  onClick={() => setWorkflowMode('convert')}
                  className={`flex-1 px-4 py-2 text-sm transition-colors flex items-center justify-center gap-2 ${
                    workflowMode === 'convert'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-card-foreground hover:bg-muted'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  {t('interface:home.options.convert')}
                </button>
                <button
                  type="button"
                  onClick={() => setWorkflowMode('transcribe')}
                  className={`flex-1 px-4 py-2 text-sm transition-colors flex items-center justify-center gap-2 ${
                    workflowMode === 'transcribe'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-card-foreground hover:bg-muted'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  {t('interface:home.options.transcribe')}
                </button>
                {fileType === 'video' && (
                  <button
                    type="button"
                    onClick={() => setWorkflowMode('transcode')}
                    className={`flex-1 px-4 py-2 text-sm transition-colors flex items-center justify-center gap-2 ${
                      workflowMode === 'transcode'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-card-foreground hover:bg-muted'
                    }`}
                  >
                    <Film className="w-4 h-4" />
                    {t('interface:home.options.transcode')}
                  </button>
                )}
              </div>
            )}

            {/* Image: convert vs. AI document scan (scanned page / handwriting
                → searchable PDF / Word). The document panel owns its own
                upload/SSE/result-modal flow. */}
            {selectedFile && fileType === 'image' && (
              <div className="flex rounded-lg border overflow-hidden mb-4">
                <button
                  type="button"
                  onClick={() => setWorkflowMode('convert')}
                  className={`flex-1 px-4 py-2 text-sm transition-colors flex items-center justify-center gap-2 ${
                    workflowMode === 'convert'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-card-foreground hover:bg-muted'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  {t('interface:home.options.convert')}
                </button>
                <button
                  type="button"
                  onClick={() => setWorkflowMode('document')}
                  className={`flex-1 px-4 py-2 text-sm transition-colors flex items-center justify-center gap-2 ${
                    workflowMode === 'document'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-card-foreground hover:bg-muted'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  {t('interface:home.options.scanDocument')}
                </button>
              </div>
            )}

            {selectedFile && fileType && fileType !== 'unknown' ? (
              <div className="space-y-6">
                <Suspense fallback={<FormFallback />}>
                  {workflowMode === 'document' && fileType === 'image' ? (
                    <DocumentScanPanel
                      enableReorder={false}
                      initialFiles={selectedFile ? [selectedFile] : []}
                    />
                  ) : workflowMode === 'transcode' && fileType === 'video' ? (
                    <VideoTranscodeForm file={selectedFile} />
                  ) : workflowMode === 'transcribe' && (fileType === 'video' || fileType === 'audio') ? (
                    <TranscribeForm
                      mediaKind={fileType}
                      isLoading={isLoading}
                      onSubmit={handleTranscribe}
                    />
                  ) : (
                    <>
                      {fileType === 'image' && (
                        <ImageConversionForm
                          onSubmit={handleConvert}
                          isLoading={isLoading}
                          imageUrl={originalImageUrl || undefined}
                          file={selectedFile || undefined}
                        />
                      )}
                      {fileType === 'video' && (
                        <VideoConversionForm
                          onSubmit={handleConvert}
                          isLoading={isLoading}
                          videoUrl={selectedFile ? URL.createObjectURL(selectedFile) : undefined}
                        />
                      )}
                      {fileType === 'audio' && (
                        <AudioConversionForm
                          onSubmit={handleConvert}
                          isLoading={isLoading}
                          audioUrl={selectedFile ? URL.createObjectURL(selectedFile) : undefined}
                        />
                      )}
                    </>
                  )}
                </Suspense>

                {/* Download Button */}
                {conversionJob?.status === 'completed' && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => void handleDownload()}
                      disabled={mainDownloadStatus.phase === 'preparing'}
                      aria-busy={mainDownloadStatus.phase === 'preparing' || undefined}
                      className="w-full bg-success text-success-foreground py-3 px-6 rounded-lg hover:bg-success/90 transition-colors flex items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-80"
                    >
                      {mainDownloadStatus.phase === 'preparing' ? (
                        <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin motion-reduce:animate-none" />
                      ) : (
                        <Download aria-hidden="true" className="w-4 h-4" />
                      )}
                      {mainDownloadStatus.phase === 'preparing'
                        ? t('interface:resultPanel.downloadStatus.preparing')
                        : t('interface:home.download.downloadAs', { filename: getConvertedFilename() })}
                    </button>
                    {mainDownloadStatus.phase === 'started' || mainDownloadStatus.phase === 'failed' ? (
                      <DownloadStatusLine
                        status={mainDownloadStatus}
                        onRetry={() => void handleDownload()}
                        className="justify-center text-center"
                      />
                    ) : (
                      <p className="text-xs text-muted-foreground text-center">
                        {t('interface:home.download.fileWillBeDownloaded', { filename: getConvertedFilename() })}
                      </p>
                    )}
                  </div>
                )}

                {/* Progress Display */}
                {(isPending || isTranscribePending) && (fileType === 'video' || workflowMode === 'transcribe') && (
                  <ProcessingIndicator
                    value={activeProgress > 0 ? activeProgress : undefined}
                    label={uploadPhaseLabel}
                  />
                )}

                {isLoading && conversionJob?.progress && (
                  <ProcessingIndicator
                    value={conversionJob.progress}
                    showValue={false}
                    label={t('interface:home.progress.percentComplete', { percent: conversionJob.progress })}
                  />
                )}

                {conversionJob?.status === 'failed' && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-destructive">
                      {t('interface:home.progress.conversionFailed')}
                    </p>
                  </div>
                )}
              </div>
            ) : selectedFile ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {t('interface:home.upload.unsupportedFile')}
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">{t('interface:home.gettingStarted.title')}</h3>
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">1</span>
                      <div>
                        <p className="font-medium text-card-foreground">{t('interface:home.gettingStarted.step1.title')}</p>
                        <p className="text-sm text-muted-foreground">
                          <Trans i18nKey="interface:home.gettingStarted.step1.body" components={{ em: <em /> }} />
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-data/10 text-data font-semibold flex items-center justify-center text-sm">2</span>
                      <div>
                        <p className="font-medium text-card-foreground">{t('interface:home.gettingStarted.step2.title')}</p>
                        <p className="text-sm text-muted-foreground">
                          <Trans i18nKey="interface:home.gettingStarted.step2.body" components={{ em: <em /> }} />
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-premium/10 text-premium font-semibold flex items-center justify-center text-sm">3</span>
                      <div>
                        <p className="font-medium text-card-foreground">{t('interface:home.gettingStarted.step3.title')}</p>
                        <p className="text-sm text-muted-foreground">
                          <Trans i18nKey="interface:home.gettingStarted.step3.body" components={{ em: <em /> }} />
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-premium/10 dark:bg-premium/60 text-premium dark:text-premium font-semibold flex items-center justify-center text-sm">4</span>
                      <div>
                        <p className="font-medium text-card-foreground">{t('interface:home.gettingStarted.step4.title')}</p>
                        <p className="text-sm text-muted-foreground">
                          <Trans i18nKey="interface:home.gettingStarted.step4.body" components={{ em: <em /> }} />
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="border border-primary/30 bg-primary/10 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-card-foreground">{t('interface:home.localAi.title')}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('interface:home.localAi.body')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-data mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-card-foreground">{t('interface:home.notSure.title')}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('interface:home.notSure.body')}
                      </p>
                      <Link
                        href={localized('/tutorials')}
                        className="inline-flex items-center gap-2 mt-3 bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors text-sm"
                      >
                        <BookOpen className="w-4 h-4" />
                        {t('interface:home.notSure.cta')}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-premium mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-card-foreground">{t('interface:home.howItWorks.title')}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('interface:home.howItWorks.body')}
                      </p>
                      <Link
                        href={localized('/how-it-works')}
                        className="inline-flex items-center gap-2 mt-3 bg-card border border-border text-card-foreground px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                      >
                        <HelpCircle className="w-4 h-4" />
                        {t('interface:home.howItWorks.cta')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Panel>
        </div>

        {/* Progress Bar */}
        {conversionJob?.status === 'processing' && (
          <div className="mt-6 bg-card rounded-xl shadow-lg p-6 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">{t('interface:home.progress.converting')}</span>
              <span className="text-sm text-muted-foreground">
                {conversionJob.progress || 0}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${conversionJob.progress || 0}%` }}
              />
            </div>
          </div>
        )}

        {/* MM85: the converter comes first on every viewport; the popular chips and
            the Darkroom card follow it rather than pushing it below the fold. */}
        <p className="mt-8 text-sm font-medium text-muted-foreground">{t('interface:home.hero.popularLabel')}</p>
        <nav aria-label={t('accessibility:home.popularTools')} className="mx-auto mt-3 flex w-full max-w-5xl flex-wrap items-center justify-center gap-2 text-sm">
          <Link href={localized('/tools')} className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-[var(--accent-primary-hover)] transition-colors">{t('interface:home.hero.allTools')}</Link>
          <Link href={localized('/tools/remove-exif-metadata')} className="px-3 py-1.5 rounded-full bg-card border border-border text-card-foreground hover:bg-muted transition-colors">{t('interface:home.hero.removeExif')}</Link>
          <Link href={localized('/tools/compress-video')} className="px-3 py-1.5 rounded-full bg-card border border-border text-card-foreground hover:bg-muted transition-colors">{t('interface:home.hero.compressVideo')}</Link>
          <Link href={localized('/tools/transcribe-video')} className="px-3 py-1.5 rounded-full bg-card border border-border text-card-foreground hover:bg-muted transition-colors">{t('interface:home.hero.transcribeVideo')}</Link>
          <Link href={localized('/tools/transcode-to-hls')} className="px-3 py-1.5 rounded-full bg-card border border-border text-card-foreground hover:bg-muted transition-colors">{t('interface:home.hero.transcodeHls')}</Link>
          {/* Review-visible chips link only to review-allowlisted tool pages. */}
          <Link href={localized('/tools/compress-image')} className="px-3 py-1.5 rounded-full bg-card border border-border text-card-foreground hover:bg-muted transition-colors">{t('interface:home.hero.compressImage')}</Link>
          <Link href={localized('/tools/image-resizer')} className="px-3 py-1.5 rounded-full bg-card border border-border text-card-foreground hover:bg-muted transition-colors">{t('interface:home.hero.resizeImage')}</Link>
          <Link href={localized('/tools/extract-audio-from-video')} className="px-3 py-1.5 rounded-full bg-card border border-border text-card-foreground hover:bg-muted transition-colors">{t('interface:home.hero.extractAudio')}</Link>
        </nav>

        {/* Content Studio call-to-action */}
        <Link
          href={localized('/tools/content-studio')}
          className="group mt-8 mb-8 block w-full max-w-5xl rounded-lg border border-edge border-l-2 border-l-data bg-surface-1 p-4 shadow-[inset_0_1px_0_var(--edge-highlight)] transition-shadow duration-[var(--dur-base)] ease-[var(--ease-instrument)] hover:shadow-[var(--glow-data)] sm:p-6"
          // No aria-label. The card's own text — title, badge, description,
          // CTA — is a better accessible name than a two-word override, and an
          // aria-label that omits the visible text fails WCAG 2.5.3 Label in
          // Name (the visible label must appear in the accessible name).
        >
          <div className="flex items-center gap-4">
            <div className="shrink-0 rounded-lg bg-data/10 p-3">
              <Clapperboard className="w-7 h-7 text-data" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-semibold text-card-foreground">
                  {t('interface:home.contentStudioCta.title')}
                </span>
                {/* text-success-foreground, not text-foreground: #ECEFF4 on
                    #4ADE80 measures 1.51:1. Every bg-success fill takes the
                    paired foreground token (globals.css). */}
                <span className="inline-flex items-center gap-1 rounded-md bg-success px-2 py-0.5 text-xs font-medium text-success-foreground">
                  <Sparkles className="w-3 h-3" />
                  {t('interface:home.contentStudioCta.badge')}
                </span>
              </span>
              <p className="text-sm text-muted-foreground mt-1">{t('interface:home.contentStudioCta.body')}</p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-data group-hover:translate-x-0.5 transition-transform shrink-0">
              {t('interface:home.contentStudioCta.cta')}
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </div>
    </>
  );
};

export default FileConverterApp;
