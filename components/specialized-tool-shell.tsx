'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import useGetJobStatus, { type ConversionJob } from '@/lib/useGetJobStatus';
import { describe as describeResult } from '@/lib/results/describe';
import { ResultPanel } from '@/components/results/result-panel';
import { getFileType } from '@/lib/utils';
import {
  EVENTS,
  normalizeMediaKind,
  safeFileExtension,
  trackFileChoice,
  useToolAnalytics,
} from '@/lib/analytics';
import { useLocalization } from '@/i18n/useLocalization';
import { useAuth } from '@/lib/auth/AuthProvider';

/**
 * SpecializedToolShell renders the common upload → progress → download UX
 * for the single-file specialized media tools (waveform, extract audio,
 * extract video-only, extract frames). It owns the file-picker + drag/drop
 * state, the job-status poller, and the download button — leaving each
 * specialized panel to render only its tool-specific options form.
 */

export interface SpecializedToolShellRenderArgs {
  file: File;
  isProcessing: boolean;
  conversionJob: ConversionJob | null;
  triggerSubmit: () => void;
  setSubmitHandler: (handler: () => void) => void;
}

/**
 * SpecializedToolPreviewConfig is now only a HINT for `describe()`.
 *
 * Every completed job renders the shared ResultPanel (viewer, Original/Result toggle,
 * Download). The kind comes from the result file name's extension first; `finalMediaKind`
 * only decides when the extension cannot ('zip' means an archive).
 */
export interface SpecializedToolPreviewConfig {
  /** What kind of media the final result is. Use 'zip' when the result isn't
   *  browser-previewable. */
  finalMediaKind: 'audio' | 'video' | 'image' | 'zip';
  /** Optional override for the result panel heading. */
  title?: string;
}

interface SpecializedToolShellProps {
  /** "image/*", "video/*", "audio/*", or a comma-list of extensions. */
  accept: string;
  /** Human-readable name of the kind of file users should upload. */
  uploadHint: string;
  /** The job (if any) for status polling + download. */
  conversionJob: ConversionJob | null;
  setConversionJob: (job: ConversionJob | null) => void;
  /** Whether the current mutation is still uploading. */
  isUploading: boolean;
  /** Optional 0–100 upload progress for the inline progress bar. */
  uploadProgress?: number;
  /** Render-prop for the tool's options form. The renderer is called once a
   *  file is picked. The shell injects the file + a submit-handler setter so
   *  the panel can register its submit callback. */
  renderForm: (args: SpecializedToolShellRenderArgs) => React.ReactNode;
  /** Suggested output extension for the download button label. */
  outputExtensionHint?: string;
  /** Hint for the result kind and panel heading; see SpecializedToolPreviewConfig. */
  previewConfig?: SpecializedToolPreviewConfig;
}

const SpecializedToolShell: React.FC<SpecializedToolShellProps> = ({
  accept,
  uploadHint,
  conversionJob,
  setConversionJob,
  isUploading,
  uploadProgress,
  renderForm,
  outputExtensionHint,
  previewConfig,
}) => {
  const { t, formatFileSize } = useLocalization('interface');
  // tool_slug and media_kind arrive from the ToolAnalyticsProvider that tool-landing-page
  // wraps around the panel — this shell is shared by ten different tools and must not
  // guess which one it is rendering inside.
  const { track: trackTool, setMediaKind } = useToolAnalytics();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Nullable outside the AuthProvider (the chromeless trees). Read only for the tier's
  // file-size ceiling on `file_rejected`.
  const auth = useAuth();
  const submitRef = useRef<() => void>(() => {});

  const { data: jobStatusData } = useGetJobStatus(conversionJob);

  useEffect(() => {
    if (jobStatusData) {
      setConversionJob({ ...(conversionJob || jobStatusData), ...jobStatusData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobStatusData]);

  const onFileChosen = (file: File) => {
    setSelectedFile(file);
    setConversionJob(null);

    // The chosen file decides the media kind for every subsequent event in this tool.
    const fileKind = getFileType(file);
    setMediaKind(normalizeMediaKind(fileKind));
    // `unsupported` is only the unrecognised-type case here. This shell is shared by ten
    // tools with ten different `accept` strings, and a stricter per-tool check would have
    // to duplicate that vocabulary — the picker already enforces `accept`, and the API
    // enforces the rest. See lib/analytics/fileChoice.ts for the event semantics.
    trackFileChoice(trackTool, file, fileKind, {
      unsupported: fileKind === 'unknown',
      limitBytes: auth?.limits?.maxFileBytes,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileChosen(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileChosen(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearFile = () => {
    // Read the outcome before the job state is discarded — a retry after a failure and a
    // fresh start after a download are the two things this event exists to separate.
    trackTool(EVENTS.TOOL_RESET, {
      after:
        conversionJob?.status === 'completed'
          ? 'success'
          : conversionJob?.status === 'failed'
            ? 'failure'
            : 'idle',
    });
    setSelectedFile(null);
    setConversionJob(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // resultFilename is the suggested filename the modal's Download button
  // and the standalone download button both use. Kept in one place so
  // the two paths can never disagree.
  const resultFilename = (): string => {
    if (!selectedFile) return 'result';
    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
    const ext = outputExtensionHint || 'bin';
    return `${baseName}.${ext.replace(/^\./, '')}`;
  };

  const isProcessing = isUploading || conversionJob?.status === 'processing';
  const isCompleted = conversionJob?.status === 'completed';
  const isFailed = conversionJob?.status === 'failed';

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? 'border-primary bg-primary/10'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
        >
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-card-foreground mb-1">{t('specializedToolShell.dropHere', { hint: uploadHint })}</p>
          <p className="text-sm text-muted-foreground mb-4">
            {t('specializedToolShell.selectHint')}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors"
          >
            {t('specializedToolShell.selectFile')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="min-w-0">
              <p className="font-medium text-card-foreground truncate">{selectedFile.name}</p>
              <p className="num text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)} · {safeFileExtension(selectedFile.name)}
              </p>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="text-muted-foreground hover:text-card-foreground transition-colors"
              aria-label={t('specializedToolShell.removeFile')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {renderForm({
            file: selectedFile,
            isProcessing: !!isProcessing,
            conversionJob,
            triggerSubmit: () => submitRef.current(),
            setSubmitHandler: (handler) => {
              submitRef.current = handler;
            },
          })}

          {isProcessing && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {uploadProgress && uploadProgress > 0 && uploadProgress < 100
                  ? t('specializedToolShell.uploadingPercent', { percent: uploadProgress })
                  : t('specializedToolShell.workingOnFile')}{' '}
                {conversionJob?.progress ? `· ${conversionJob.progress}%` : ''}
              </p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${conversionJob?.progress || uploadProgress || 0}%` }}
                />
              </div>
            </div>
          )}

          {isCompleted && conversionJob && (
            <ResultPanel
              descriptor={describeResult({
                job: conversionJob,
                originalFile: selectedFile,
                kindHint: previewConfig
                  ? previewConfig.finalMediaKind === 'zip'
                    ? 'archive'
                    : previewConfig.finalMediaKind
                  : undefined,
                fallbackFileName: resultFilename(),
              })}
              title={previewConfig?.title}
              downloadFileName={resultFilename()}
              onRunAnother={clearFile}
            />
          )}
          {isFailed && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              {conversionJob?.error || t('specializedToolShell.jobFailed')}
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default SpecializedToolShell;
