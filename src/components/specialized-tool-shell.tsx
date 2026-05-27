import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, Download, X, Play, Music } from 'lucide-react';
import useGetJobStatus, { type ConversionJob } from '@/lib/useGetJobStatus';
import useDownloadFile from '@/lib/useDownloadFile';
import { getFileType } from '@/lib/utils';
import { getSafeFileExtension, trackFileDownload, trackFileUpload } from '@/lib/analytics';
import { useLocalization } from '@/i18n/useLocalization';

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
 * SpecializedToolPreviewConfig opts the result modal in. When supplied, a
 * "Preview result" button appears alongside Download once the job completes.
 * Clicking it opens a modal that mirrors the home-page result viewer — toggle
 * between the original input and the final output, then download from inside
 * the modal.
 *
 * For ZIP outputs (e.g. waveform "both", extracted frames) we still show the
 * modal but render a "preview not available" message on the Final tab so the
 * user can fall back to plain download.
 */
export interface SpecializedToolPreviewConfig {
  /** What kind of media the original uploaded file is. Drives the Original
   *  tab in the modal. */
  originalMediaKind: 'audio' | 'video' | 'image';
  /** What kind of media the final result is. Drives the Final tab in the
   *  modal. Use 'zip' when the result isn't browser-previewable. */
  finalMediaKind: 'audio' | 'video' | 'image' | 'zip';
  /** Optional override label for the result modal header. */
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
  /** Opt in to the in-browser result preview modal. When omitted, only the
   *  download button is shown after completion. */
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<() => void>(() => {});

  // Preview-modal state. We lazy-create blob URLs only when the user opens
  // the modal so unopened previews don't burn memory, and revoke them on
  // close / unmount / file-change to keep the page leak-free.
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [resultView, setResultView] = useState<'original' | 'final'>('final');
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isLoadingResultPreview, setIsLoadingResultPreview] = useState(false);
  const [resultPreviewError, setResultPreviewError] = useState<string | null>(null);
  const originalUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  const { downloadFile } = useDownloadFile();
  const { data: jobStatusData } = useGetJobStatus(conversionJob);

  useEffect(() => {
    if (jobStatusData) {
      setConversionJob({ ...(conversionJob || jobStatusData), ...jobStatusData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobStatusData]);

  // Keep refs in sync with the latest blob URLs so the unmount cleanup
  // below can revoke them without depending on closure values that get
  // stale across renders.
  useEffect(() => {
    originalUrlRef.current = originalUrl;
  }, [originalUrl]);
  useEffect(() => {
    resultUrlRef.current = resultUrl;
  }, [resultUrl]);

  // Revoke any pending blob URLs on unmount.
  useEffect(() => {
    return () => {
      if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const revokeOriginalUrl = () => {
    if (originalUrlRef.current) {
      URL.revokeObjectURL(originalUrlRef.current);
      originalUrlRef.current = null;
    }
    setOriginalUrl(null);
  };
  const revokeResultUrl = () => {
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
    setResultUrl(null);
    setResultBlob(null);
  };

  const onFileChosen = (file: File) => {
    // Reset any previously-loaded preview state when the user picks a new
    // input file — the old blob URLs are no longer relevant.
    revokeOriginalUrl();
    revokeResultUrl();
    setResultPreviewError(null);
    setIsResultModalOpen(false);
    setSelectedFile(file);
    setConversionJob(null);
    trackFileUpload(getFileType(file), file.size, file.name);
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
    revokeOriginalUrl();
    revokeResultUrl();
    setResultPreviewError(null);
    setIsResultModalOpen(false);
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

  const saveBlobToDisk = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = async () => {
    if (!conversionJob?.id || !selectedFile) return;
    try {
      // Reuse the cached preview blob when present — no need to re-fetch
      // the same artifact when the user already opened the preview modal.
      const blob = resultBlob || (await downloadFile(conversionJob.id));
      if (!resultBlob) setResultBlob(blob);
      const fileName = resultFilename();
      saveBlobToDisk(blob, fileName);
      trackFileDownload(fileName, getFileType(selectedFile));
    } catch (err) {
      console.error('Specialized tool download failed', err);
    }
  };

  // openPreview lazy-fetches the result blob the first time the user opens
  // the modal and creates a blob URL for in-browser playback. It also makes
  // sure an Original blob URL exists for the selected file so the modal can
  // toggle between Original and Final without re-creating URLs on every
  // tab switch.
  const openPreview = async () => {
    if (!previewConfig || !conversionJob?.id || !selectedFile) return;
    setIsResultModalOpen(true);
    setResultView('final');
    if (!originalUrl) {
      const url = URL.createObjectURL(selectedFile);
      originalUrlRef.current = url;
      setOriginalUrl(url);
    }
    if (previewConfig.finalMediaKind === 'zip') {
      // ZIPs can't render inline; we still surface the modal so the user can
      // play the Original side and read the "preview not available" message.
      return;
    }
    if (resultUrl && resultBlob) return;
    try {
      setIsLoadingResultPreview(true);
      setResultPreviewError(null);
      const blob = resultBlob || (await downloadFile(conversionJob.id));
      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResultBlob(blob);
      setResultUrl(url);
    } catch (err) {
      console.error('Failed to load result preview', err);
      setResultPreviewError(err instanceof Error ? err.message : 'Failed to load preview');
    } finally {
      setIsLoadingResultPreview(false);
    }
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
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
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
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)} · {getSafeFileExtension(selectedFile.name)}
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
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${conversionJob?.progress || uploadProgress || 0}%` }}
                />
              </div>
            </div>
          )}

          {isCompleted && (
            previewConfig ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => void openPreview()}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {t('specializedToolShell.previewResult')}
                </button>
                <button
                  type="button"
                  onClick={() => void handleDownload()}
                  className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {t('specializedToolShell.downloadResult')}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => void handleDownload()}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t('specializedToolShell.downloadResult')}
              </button>
            )
          )}
          {isFailed && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              {conversionJob?.error || t('specializedToolShell.jobFailed')}
            </div>
          )}
        </>
      )}

      {/* Result preview modal — opt-in via previewConfig. Mirrors the home-
          page result viewer so the experience is consistent across the app. */}
      {previewConfig && isResultModalOpen && selectedFile && (
        <div className="fixed inset-0 z-50 bg-black/80 p-4 flex items-center justify-center">
          <div className="bg-card shadow-2xl w-full max-w-7xl max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden sci-fi-frame">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-semibold text-card-foreground">
                  {previewConfig.title || t('specializedToolShell.resultPreview')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('specializedToolShell.toggleHint')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-lg border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setResultView('original')}
                    className={`px-4 py-2 text-sm transition-colors ${
                      resultView === 'original'
                        ? 'bg-blue-600 text-white'
                        : 'bg-background text-card-foreground hover:bg-muted'
                    }`}
                  >
                    {t('home.result.original')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setResultView('final')}
                    className={`px-4 py-2 text-sm transition-colors ${
                      resultView === 'final'
                        ? 'bg-blue-600 text-white'
                        : 'bg-background text-card-foreground hover:bg-muted'
                    }`}
                  >
                    {t('home.result.final')}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDownload()}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {t('common.download')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsResultModalOpen(false)}
                  className="text-muted-foreground hover:text-card-foreground transition-colors p-2"
                  aria-label={t('specializedToolShell.closePreview')}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-muted/30 flex-1 min-h-0 flex items-center justify-center">
              {resultView === 'original' ? (
                <SpecializedToolMediaPreview
                  kind={previewConfig.originalMediaKind}
                  src={originalUrl}
                  filename={selectedFile.name}
                />
              ) : isLoadingResultPreview ? (
                <p className="text-card-foreground">{t('specializedToolShell.loadingPreview')}</p>
              ) : resultPreviewError ? (
                <div className="text-center space-y-3">
                  <p className="text-destructive">{resultPreviewError}</p>
                  <button
                    type="button"
                    onClick={() => void openPreview()}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('common.tryAgain')}
                  </button>
                </div>
              ) : previewConfig.finalMediaKind === 'zip' ? (
                <div className="text-center max-w-md space-y-3">
                  <p className="text-card-foreground font-medium">{t('specializedToolShell.zipPreviewTitle')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('specializedToolShell.zipPreviewBody')}
                  </p>
                </div>
              ) : (
                <SpecializedToolMediaPreview
                  kind={previewConfig.finalMediaKind}
                  src={resultUrl}
                  filename={resultFilename()}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * SpecializedToolMediaPreview renders a single piece of media inside the
 * result preview modal — a video for video kinds, an image for images, and
 * an audio player with a filename label for audio kinds. ZIP/no-preview
 * cases are handled by the parent before this component is reached.
 */
interface SpecializedToolMediaPreviewProps {
  kind: 'audio' | 'video' | 'image' | 'zip';
  src: string | null;
  filename: string;
}

const SpecializedToolMediaPreview: React.FC<SpecializedToolMediaPreviewProps> = ({
  kind,
  src,
  filename,
}) => {
  const { t } = useLocalization('interface');
  if (!src) {
    return <p className="text-card-foreground">{t('specializedToolShell.loadingPreview')}</p>;
  }
  if (kind === 'image') {
    return (
      <img
        src={src}
        alt={filename}
        className="max-w-full max-h-[calc(100vh-14rem)] object-contain rounded-lg bg-background"
      />
    );
  }
  if (kind === 'video') {
    return (
      <video
        src={src}
        controls
        className="max-w-full max-h-[calc(100vh-14rem)] rounded-lg bg-black"
      />
    );
  }
  if (kind === 'audio') {
    return (
      <div className="w-full max-w-3xl bg-background rounded-lg border p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <Music className="w-16 h-16 text-muted-foreground" />
          <p className="text-card-foreground font-medium truncate max-w-full">{filename}</p>
          <audio src={src} controls className="w-full" />
        </div>
      </div>
    );
  }
  return null;
};

export default SpecializedToolShell;
