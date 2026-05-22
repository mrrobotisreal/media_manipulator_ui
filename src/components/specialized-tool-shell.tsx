import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, Download, X } from 'lucide-react';
import useGetJobStatus, { type ConversionJob } from '@/lib/useGetJobStatus';
import useDownloadFile from '@/lib/useDownloadFile';
import { getFileType } from '@/lib/utils';
import { getSafeFileExtension, trackFileDownload, trackFileUpload } from '@/lib/analytics';

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
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<() => void>(() => {});

  const { downloadFile } = useDownloadFile();
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
    setSelectedFile(null);
    setConversionJob(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = async () => {
    if (!conversionJob?.id || !selectedFile) return;
    try {
      const blob = await downloadFile(conversionJob.id);
      const originalName = selectedFile.name;
      const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
      const ext = outputExtensionHint || 'bin';
      const fileName = `${baseName}.${ext.replace(/^\./, '')}`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      trackFileDownload(fileName, getFileType(selectedFile));
    } catch (err) {
      console.error('Specialized tool download failed', err);
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
          <p className="font-medium text-card-foreground mb-1">Drop your {uploadHint} here</p>
          <p className="text-sm text-muted-foreground mb-4">
            or click to select from your computer. Files stay on our servers for at most 24 hours and are then deleted.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Select file
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
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · {getSafeFileExtension(selectedFile.name)}
              </p>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="text-muted-foreground hover:text-card-foreground transition-colors"
              aria-label="Remove file"
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
                  ? `Uploading ${uploadProgress}%`
                  : 'Working on your file…'}{' '}
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
            <button
              type="button"
              onClick={() => void handleDownload()}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download result
            </button>
          )}
          {isFailed && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              {conversionJob?.error || 'Job failed. Try a different file or refresh.'}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SpecializedToolShell;
