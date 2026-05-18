import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Download,
  Image as ImageIcon,
  Video as VideoIcon,
  Music,
  X,
  Sparkles,
} from 'lucide-react';
import { getFileType } from '@/lib/utils';
import ImageConversionForm from '@/components/image-conversion-form';
import VideoConversionForm from '@/components/video-conversion-form';
import AudioConversionForm from '@/components/audio-conversion-form';
import useConvertFile, { type UploadFileResponse } from '@/lib/useConvertFile';
import useGetJobStatus, { type ConversionJob } from '@/lib/useGetJobStatus';
import useDownloadFile from '@/lib/useDownloadFile';
import type { ConversionFormData } from '@/schemas/types';
import {
  trackFileConversion,
  trackFileDownload,
  trackFileUpload,
  getSafeFileExtension,
} from '@/lib/analytics';

export type EmbeddedMediaKind = 'image' | 'video' | 'audio';

interface EmbeddedToolPanelProps {
  /** Default media kind to bias the panel toward when no file is selected yet. */
  defaultMediaKind: EmbeddedMediaKind;
  /** Heading shown above the panel. */
  title?: string;
  /** Short description shown under the heading. */
  description?: string;
  /** Render the panel in a more compact layout. Defaults to true. */
  compact?: boolean;
  /** Pre-fill the file input accept attribute. */
  acceptOverride?: string;
}

const ACCEPT_MAP: Record<EmbeddedMediaKind, string> = {
  image: 'image/*',
  video: 'video/*',
  audio: 'audio/*',
};

const ICON_MAP: Record<EmbeddedMediaKind, React.ReactNode> = {
  image: <ImageIcon className="w-5 h-5" />,
  video: <VideoIcon className="w-5 h-5" />,
  audio: <Music className="w-5 h-5" />,
};

const DEFAULT_TITLES: Record<EmbeddedMediaKind, string> = {
  image: 'Try the image converter',
  video: 'Try the video converter',
  audio: 'Try the audio converter',
};

const DEFAULT_DESCRIPTIONS: Record<EmbeddedMediaKind, string> = {
  image:
    'Upload an image and pick a format. The same converter as the homepage — no signup required.',
  video:
    'Upload a video to convert, compress, or trim. The same converter as the homepage — no signup required.',
  audio:
    'Upload an audio file to convert or compress. The same converter as the homepage — no signup required.',
};

/**
 * Compact, embedded version of the homepage converter for tutorial pages.
 *
 * Reuses the same form components, upload hook, status poller, and download
 * helper as the full app so behavior stays consistent. Intentionally omits
 * conversion history, ads, and the result modal — tutorials only need the
 * core "upload → convert → download" loop.
 */
const EmbeddedToolPanel: React.FC<EmbeddedToolPanelProps> = ({
  defaultMediaKind,
  title,
  description,
  compact = true,
  acceptOverride,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const [conversionOptions, setConversionOptions] =
    useState<ConversionFormData | null>(null);
  const [originalMediaUrl, setOriginalMediaUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: jobStatusData } = useGetJobStatus(conversionJob);
  const { downloadFile } = useDownloadFile();

  const fileType = selectedFile ? getFileType(selectedFile) : null;
  const effectiveKind: EmbeddedMediaKind =
    fileType && fileType !== 'unknown' ? (fileType as EmbeddedMediaKind) : defaultMediaKind;

  const handleUploadStart = useCallback(
    (jobId: string) => {
      if (!selectedFile) return;
      setConversionJob({
        id: jobId,
        status: 'processing',
        originalFile: selectedFile,
        progress: 0,
      });
    },
    [selectedFile],
  );

  const { mutate, isPending, uploadProgress } = useConvertFile(
    (res: UploadFileResponse) => handleUploadStart(res.jobId),
  );

  useEffect(() => {
    if (!selectedFile) {
      setOriginalMediaUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setOriginalMediaUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  useEffect(() => {
    if (jobStatusData) {
      setConversionJob((prev) => (prev ? { ...prev, ...jobStatusData } : null));
    }
  }, [jobStatusData]);

  const acceptableForKind = (file: File): boolean => {
    const kind = getFileType(file);
    return kind === defaultMediaKind;
  };

  const onFileChosen = (file: File) => {
    if (!acceptableForKind(file)) {
      // Still accept it but warn — tutorial author may want flexibility.
      // We do not block — getFileType returns the actual kind for the form.
    }
    setSelectedFile(file);
    setConversionJob(null);
    setConversionOptions(null);
    trackFileUpload(getFileType(file), file.size, file.name);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileChosen(file);
  };

  const handleConvert = (data: ConversionFormData) => {
    if (!selectedFile) return;
    setConversionOptions(data);
    setConversionJob(null);
    const fromFormat =
      selectedFile.name.split('.').pop()?.toLowerCase() || 'unknown';
    trackFileConversion(fromFormat, data.format, selectedFile.size);
    mutate({ file: selectedFile, options: data });
  };

  const getConvertedFilename = () => {
    if (!selectedFile || !conversionOptions) return selectedFile?.name || 'converted_file';
    const originalName = selectedFile.name;
    const nameWithoutExt =
      originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    return `${nameWithoutExt}.${conversionOptions.format}`;
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
    if (!conversionJob?.id) return;
    try {
      const blob = await downloadFile(conversionJob.id);
      const fileName = getConvertedFilename();
      saveBlobToDisk(blob, fileName);
      trackFileDownload(fileName, effectiveKind);
    } catch (err) {
      console.error('Embedded tool download failed', err);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setConversionJob(null);
    setConversionOptions(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isProcessing =
    isPending || conversionJob?.status === 'processing';
  const isCompleted = conversionJob?.status === 'completed';
  const accept = acceptOverride || ACCEPT_MAP[defaultMediaKind];

  const heading = title || DEFAULT_TITLES[defaultMediaKind];
  const subheading = description || DEFAULT_DESCRIPTIONS[defaultMediaKind];

  return (
    <section
      className={`bg-card border border-border rounded-lg ${compact ? 'p-5' : 'p-6'} my-8 sci-fi-frame-inner`}
      aria-label="Embedded media converter"
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="mt-1 text-blue-600">{ICON_MAP[defaultMediaKind]}</span>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" /> Try it now
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium">{heading}.</span> {subheading}
          </p>
        </div>
      </div>

      {!selectedFile ? (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-card-foreground mb-1">
            Choose a {defaultMediaKind} file
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            File stays on our servers for at most 24 hours and is then deleted.
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
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0 text-blue-600">
                {ICON_MAP[effectiveKind]}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-card-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB ·{' '}
                  {getSafeFileExtension(selectedFile.name)}
                </p>
              </div>
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

          {effectiveKind === 'image' && (
            <ImageConversionForm
              onSubmit={handleConvert}
              isLoading={isProcessing}
              imageUrl={originalMediaUrl || undefined}
            />
          )}
          {effectiveKind === 'video' && (
            <VideoConversionForm
              onSubmit={handleConvert}
              isLoading={isProcessing}
              videoUrl={originalMediaUrl || undefined}
            />
          )}
          {effectiveKind === 'audio' && (
            <AudioConversionForm
              onSubmit={handleConvert}
              isLoading={isProcessing}
              audioUrl={originalMediaUrl || undefined}
            />
          )}

          {isProcessing && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {uploadProgress > 0
                  ? `Uploading ${uploadProgress}%`
                  : 'Working on your file…'}{' '}
                {conversionJob?.progress ? `· ${conversionJob.progress}%` : ''}
              </p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${conversionJob?.progress || uploadProgress || 0}%`,
                  }}
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
              Download {getConvertedFilename()}
            </button>
          )}

          {conversionJob?.status === 'failed' && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              Conversion failed. Try again or open the full converter.
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-4">
        Need the full feature set?{' '}
        <Link to="/" className="text-blue-600 hover:underline">
          Open the full converter
        </Link>{' '}
        — it includes the conversion history, transcript flow, and AI tools.
      </p>
    </section>
  );
};

export default EmbeddedToolPanel;
