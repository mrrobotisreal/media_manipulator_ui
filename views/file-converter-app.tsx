'use client';

import React, { lazy, Suspense, useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Trans } from 'react-i18next';
import { Upload, Download, Image, Video, Music, X, Settings, Search, FileText, BookOpen, HelpCircle, Sparkles, Film, Clapperboard, ArrowRight } from 'lucide-react';
import { getFileType } from '@/lib/utils';
import FilePreview from '@/components/file-preview';
import FileDetails from '@/components/file-details';
import { useLocalization } from '@/i18n/useLocalization';
import type { ConversionFormData } from '@/schemas/types';

// Each conversion form pulls in its own schema, form fields, and helpers.
// Lazy-loading keeps the homepage chunk light — we only fetch the form
// matching the kind of file the user actually drops in.
const ImageConversionForm = lazy(() => import('@/components/image-conversion-form'));
const VideoConversionForm = lazy(() => import('@/components/video-conversion-form'));
const AudioConversionForm = lazy(() => import('@/components/audio-conversion-form'));
const TranscribeForm = lazy(() => import('@/components/transcribe-form'));
const TranscribeResultView = lazy(() => import('@/components/transcribe-result-view'));
const VideoTranscodeForm = lazy(() => import('@/components/video-transcode-form'));
// AI Document Scan island — the panel owns its own upload/SSE/result-modal flow,
// so the home page needs no extra job plumbing for it.
const DocumentScanPanel = lazy(() => import('@/components/document-scan/document-scan-panel'));

const FormFallback: React.FC = () => {
  const { t } = useLocalization('interface');
  return (
    <div className="text-sm text-muted-foreground py-4">{t('home.fileLoadingConverter')}</div>
  );
};
import useConvertFile, { type UploadFileResponse } from '@/lib/useConvertFile';
import useTranscribeFile, { type TranscribeFormData, type TranscribeUploadResponse } from '@/lib/useTranscribeFile';
import { useTranscribeResult, useAnalysisResult } from '@/lib/useTranscribeResult';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import useGetJobStatus from '@/lib/useGetJobStatus';
import useDownloadFile from '@/lib/useDownloadFile';
import useIdentifyFile from '@/lib/useIdentifyFile';
import {
  trackFileUpload,
  trackFileConversion,
  trackConversionSuccess,
  trackConversionFailure,
  trackFileDownload,
  trackUserSession,
  trackMixpanelEvent,
  getSafeFileExtension,
} from '@/lib/analytics';
import { trackFirstPartyError, trackFirstPartyEvent } from '@/lib/firstPartyAnalytics';
import { initializeIndexedIdentity } from '@/lib/indexedIdentity';

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
  objectUrl?: string;
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

const FileConverterApp: React.FC = () => {
  const { t, formatFileSize, formatTime } = useLocalization(['interface', 'accessibility', 'error']);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const [conversionOptions, setConversionOptions] = useState<ConversionFormData | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [conversionStartTime, setConversionStartTime] = useState<number | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [resultView, setResultView] = useState<'original' | 'final'>('final');
  const [isLoadingResultPreview, setIsLoadingResultPreview] = useState(false);
  const [resultPreviewError, setResultPreviewError] = useState<string | null>(null);
  const [autoOpenedResultJobId, setAutoOpenedResultJobId] = useState<string | null>(null);
  const resultImageUrlRef = useRef<string | null>(null);
  const [conversionHistory, setConversionHistory] = useState<ConversionHistoryItem[]>([]);
  const [activeResultJobId, setActiveResultJobId] = useState<string | null>(null);
  const conversionHistoryRef = useRef<ConversionHistoryItem[]>([]);
  const pendingConversionRef = useRef<PendingConversionDetails | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [workflowMode, setWorkflowMode] = useState<WorkflowMode>('convert');

  const { data: jobStatusData } = useGetJobStatus(conversionJob);
  const { data: fileDetails, mutate: identifyFile, isPending: isIdentifying, reset: resetIdentification } = useIdentifyFile();

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

  const { downloadFile } = useDownloadFile();

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
      if (resultImageUrlRef.current) {
        URL.revokeObjectURL(resultImageUrlRef.current);
      }
      conversionHistoryRef.current.forEach(item => {
        URL.revokeObjectURL(item.originalUrl);
        if (item.objectUrl) {
          URL.revokeObjectURL(item.objectUrl);
        }
      });
    };
  }, []);

  // Initialize analytics on component mount. RouteAnalytics in Router.tsx
  // owns the page-view fire (firstParty + GA + Mixpanel), so we only handle
  // user-session/identity bootstrap here.
  useEffect(() => {
    void initializeIndexedIdentity().catch(error => {
      trackFirstPartyError('identity_init', error);
    });

    const isReturningUser = localStorage.getItem('hasVisited') === 'true';
    trackUserSession({
      user_type: isReturningUser ? 'returning' : 'new'
    });

    if (!isReturningUser) {
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  React.useEffect(() => {
    if (jobStatusData) {
      const previousStatus = conversionJob?.status;
      setConversionJob(prev => prev ? { ...prev, ...jobStatusData } : null);

      // Track conversion completion
      if (previousStatus === 'processing' && jobStatusData.status === 'completed') {
        const processingTime = conversionStartTime ? (Date.now() - conversionStartTime) / 1000 : 0;
        const inputFormat = selectedFile?.name.split('.').pop()?.toLowerCase() || 'unknown';
        const outputFormat = conversionOptions?.format || 'unknown';
        const conversionType = `${inputFormat}_to_${outputFormat}`;
        const inputSizeMB = selectedFile ? selectedFile.size / 1024 / 1024 : 0;

        trackConversionSuccess(
          conversionOptions ? `${fileType}_to_${conversionOptions.format}` : 'unknown',
          processingTime
        );

        // Enhanced mixpanel tracking for conversion success
        trackMixpanelEvent('Conversion Completed', {
          input_format: inputFormat,
          output_format: outputFormat,
          conversion_type: conversionType,
          processing_duration_seconds: processingTime,
          input_file_size_mb: inputSizeMB,
          user_tier: 'free',
          success: true,
          file_type: fileType || 'unknown'
        });
        trackFirstPartyEvent('conversion_completed', {
          source_format: inputFormat,
          target_format: outputFormat,
          duration_ms: Math.round(processingTime * 1000),
          processing_time_seconds: processingTime,
          size_bytes: selectedFile?.size || 0,
          success: true,
        }, {
          mediaKind: fileType || 'unknown',
          conversionJobId: jobStatusData.id,
        });
        setConversionHistory(prev => prev.map(item => item.jobId === jobStatusData.id
          ? { ...item, status: 'completed', completedAt: Date.now() }
          : item
        ));
      }

      // Track conversion failure
      if (previousStatus === 'processing' && jobStatusData.status === 'failed') {
        const inputFormat = selectedFile?.name.split('.').pop()?.toLowerCase() || 'unknown';
        const outputFormat = conversionOptions?.format || 'unknown';
        const fileSizeMB = selectedFile ? selectedFile.size / 1024 / 1024 : 0;

        trackConversionFailure(
          conversionOptions ? `${fileType}_to_${conversionOptions.format}` : 'unknown'
        );

        // Enhanced mixpanel tracking for conversion failure
        trackMixpanelEvent('Conversion Failed', {
          input_format: inputFormat,
          output_format: outputFormat,
          error_type: jobStatusData.error || 'processing_error',
          error_message: jobStatusData.error || 'Conversion failed',
          user_tier: 'free',
          file_size_mb: fileSizeMB,
          file_type: fileType || 'unknown'
        });
        trackFirstPartyEvent('conversion_failed', {
          source_format: inputFormat,
          target_format: outputFormat,
          error_message: jobStatusData.error || 'Conversion failed',
          error_type: jobStatusData.error || 'processing_error',
          success: false,
        }, {
          mediaKind: fileType || 'unknown',
          conversionJobId: jobStatusData.id,
        });
        trackFirstPartyError('conversion_processing', jobStatusData.error || 'Conversion failed', {
          source_format: inputFormat,
          target_format: outputFormat,
        }, {
          mediaKind: fileType || 'unknown',
          conversionJobId: jobStatusData.id,
        });
        setConversionHistory(prev => prev.map(item => item.jobId === jobStatusData.id
          ? { ...item, status: 'failed', error: jobStatusData.error || 'Conversion failed' }
          : item
        ));
      }
    }
  }, [jobStatusData, conversionJob?.status, conversionStartTime, conversionOptions, fileType, selectedFile]);

  // Track file identification results
  useEffect(() => {
    if (fileDetails && selectedFile) {
      trackMixpanelEvent('File Identification Completed', {
        file_extension: getSafeFileExtension(selectedFile.name),
        file_type: fileDetails.fileType,
        detected_mime_type: fileDetails.mimeType,
        file_size_mb: fileDetails.fileSize / 1024 / 1024,
        identification_tool: fileDetails.tool,
        user_tier: 'free',
        success: true
      });
    }
  }, [fileDetails, selectedFile]);

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
      setResultBlob(null);
      setResultImageUrl(null);
      setResultPreviewError(null);
      setActiveResultJobId(null);
      setWorkflowMode('convert');
      if (resultImageUrlRef.current) {
        URL.revokeObjectURL(resultImageUrlRef.current);
        resultImageUrlRef.current = null;
      }

      // Track file upload
      trackFileUpload(getFileType(file), file.size, file.name);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setConversionJob(null);
      setConversionOptions(null);
      setIsResultModalOpen(false);
      setResultBlob(null);
      setResultImageUrl(null);
      setResultPreviewError(null);
      setActiveResultJobId(null);
      setWorkflowMode('convert');
      if (resultImageUrlRef.current) {
        URL.revokeObjectURL(resultImageUrlRef.current);
        resultImageUrlRef.current = null;
      }

      // Track file upload
      trackFileUpload(getFileType(file), file.size, file.name);
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
    setResultBlob(null);
    setResultImageUrl(null);
    setResultPreviewError(null);
    setAutoOpenedResultJobId(null);
    setActiveResultJobId(null);
    setActiveResultJobId(null);
    if (resultImageUrlRef.current) {
      URL.revokeObjectURL(resultImageUrlRef.current);
      resultImageUrlRef.current = null;
      setResultImageUrl(null);
    }

    // Track conversion start
    const fromFormat = selectedFile.name.split('.').pop()?.toLowerCase() || 'unknown';
    trackFileConversion(fromFormat, data.format, selectedFile.size);
    Object.entries(data)
      .filter(([key, value]) => key !== 'format' && value !== null && value !== undefined && value !== '')
      .forEach(([key, value]) => {
        trackFirstPartyEvent('feature_usage', {
          feature_name: key,
          action: 'option_set',
          value: typeof value === 'object' ? JSON.stringify(value) : String(value),
        }, {
          featureName: key,
          mediaKind: fileType || 'unknown',
        });
      });

    mutate({ file: selectedFile, options: data });
    trackMixpanelEvent('Conversion Started', {
      input_format: fromFormat,
      output_format: data.format,
      conversion_type: `${fromFormat}_to_${data.format}`,
      user_tier: 'free',
      is_batch_conversion: false,
      settings_used: Object.keys(data)
        .filter(key => key !== 'format' && data[key as keyof ConversionFormData] !== null && data[key as keyof ConversionFormData] !== undefined)
        .map(key => `${key} | ${data[key as keyof ConversionFormData]}`)
    });
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
    setResultBlob(null);
    setResultImageUrl(null);
    setResultPreviewError(null);
    setAutoOpenedResultJobId(null);
    setActiveResultJobId(null);
    if (resultImageUrlRef.current) {
      URL.revokeObjectURL(resultImageUrlRef.current);
      resultImageUrlRef.current = null;
    }
    transcribeMutate({ file: selectedFile, options: data });
    trackFirstPartyEvent('feature_usage', {
      feature_name: 'transcribe',
      action: 'submitted',
      target_format: data.format,
      language_hint: data.language || '',
      size_bytes: selectedFile.size,
    }, {
      featureName: 'transcribe',
      mediaKind,
    });
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

  const loadResultPreview = useCallback(async (jobId = conversionJob?.id, openModal = true) => {
    if (!jobId) return;
    const historyItem = conversionHistory.find(item => item.jobId === jobId);
    const isCompleted = historyItem?.status === 'completed' || (conversionJob?.id === jobId && conversionJob.status === 'completed');
    if (!historyItem || !isCompleted) return;
    if (historyItem.mode === 'transcribe') {
      setActiveResultJobId(jobId);
      setResultView('final');
      setResultPreviewError(null);
      if (openModal) setIsResultModalOpen(true);
      return;
    }
    if (activeResultJobId === jobId && resultImageUrl && resultBlob) {
      setResultView('final');
      if (openModal) setIsResultModalOpen(true);
      return;
    }

    try {
      setIsLoadingResultPreview(true);
      setResultPreviewError(null);
      const blob = historyItem?.blob || await downloadFile(jobId);
      const url = historyItem.objectUrl || URL.createObjectURL(blob);
      resultImageUrlRef.current = null;
      setResultBlob(blob);
      setResultImageUrl(url);
      setActiveResultJobId(jobId);
      setConversionHistory(prev => prev.map(item => item.jobId === jobId ? { ...item, blob, objectUrl: url } : item));
      setResultView('final');
      if (openModal) setIsResultModalOpen(true);
    } catch (error) {
      console.error('Failed to load result preview:', error);
      const message = error instanceof Error ? error.message : t('error:conversion.previewFailed');
      setResultPreviewError(message);
      trackFirstPartyError('result_preview', error, {
        file_type: historyItem?.mediaKind || 'unknown',
      }, {
        mediaKind: historyItem?.mediaKind || 'unknown',
        conversionJobId: jobId,
      });
    } finally {
      setIsLoadingResultPreview(false);
    }
  }, [activeResultJobId, conversionHistory, conversionJob?.id, conversionJob?.status, downloadFile, resultBlob, resultImageUrl]);

  useEffect(() => {
    if (
      conversionJob?.status === 'completed' &&
      conversionJob.id !== autoOpenedResultJobId &&
      conversionHistory.some(item => item.jobId === conversionJob.id)
    ) {
      setAutoOpenedResultJobId(conversionJob.id);
      void loadResultPreview(conversionJob.id, true);
    }
  }, [autoOpenedResultJobId, conversionHistory, conversionJob?.id, conversionJob?.status, loadResultPreview]);

  const handleDownload = async (jobId = conversionJob?.id, fileName = getConvertedFilename()) => {
    if (jobId) {
      try {
        const historyItem = conversionHistory.find(item => item.jobId === jobId);
        const blob = historyItem?.blob || (activeResultJobId === jobId ? resultBlob : null) || await downloadFile(jobId);
        if (!historyItem?.blob) {
          setConversionHistory(prev => prev.map(item => item.jobId === jobId ? { ...item, blob } : item));
        }
        saveBlobToDisk(blob, fileName);
        const mediaKind = historyItem?.mediaKind || fileType || 'unknown';

        // Track file download
        trackFileDownload(fileName, mediaKind);

        // Enhanced mixpanel tracking for download
        const outputSizeMB = blob.size / 1024 / 1024;
        const inputSizeMB = selectedFile ? selectedFile.size / 1024 / 1024 : 0;
        const compressionRatio = inputSizeMB > 0 ? inputSizeMB / outputSizeMB : 1;

        trackMixpanelEvent('File Downloaded', {
          file_type: mediaKind,
          output_format: historyItem?.format || conversionOptions?.format || 'unknown',
          file_extension: getSafeFileExtension(fileName),
          file_size_mb: outputSizeMB,
          compression_ratio: compressionRatio,
          user_tier: 'free',
          conversion_id: jobId
        });
        trackFirstPartyEvent('download', {
          output_format: conversionOptions?.format || 'unknown',
          file_extension: getSafeFileExtension(fileName),
          size_bytes: blob.size,
          success: true,
        }, {
          mediaKind,
          conversionJobId: jobId,
        });
      } catch (error) {
        console.error('Download failed:', error);
        const mediaKind = conversionHistory.find(item => item.jobId === jobId)?.mediaKind || fileType || 'unknown';
        trackFirstPartyError('download', error, {
          file_type: mediaKind,
        }, {
          mediaKind,
          conversionJobId: jobId,
        });

        // Track download failure
        trackMixpanelEvent('Download Failed', {
          error_message: error instanceof Error ? error.message : 'Unknown error',
          file_type: mediaKind,
          conversion_id: jobId,
          user_tier: 'free'
        });
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setConversionJob(null);
    setConversionOptions(null);
    setConversionStartTime(null);
    setIsResultModalOpen(false);
    setResultBlob(null);
    setResultPreviewError(null);
    setAutoOpenedResultJobId(null);
    setWorkflowMode('convert');
    if (resultImageUrlRef.current) {
      URL.revokeObjectURL(resultImageUrlRef.current);
      resultImageUrlRef.current = null;
      setResultImageUrl(null);
    }
    resetIdentification();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleIdentifyFile = () => {
    if (selectedFile) {
      identifyFile(selectedFile);
      trackFirstPartyEvent('feature_usage', {
        feature_name: 'file_identification',
        action: 'started',
        file_extension: getSafeFileExtension(selectedFile.name),
        size_bytes: selectedFile.size,
      }, {
        featureName: 'file_identification',
        mediaKind: fileType || 'unknown',
      });

      // Enhanced mixpanel tracking for file identification
      trackMixpanelEvent('File Identification Started', {
        file_extension: getSafeFileExtension(selectedFile.name),
        file_type: fileType || 'unknown',
        file_size_mb: selectedFile.size / 1024 / 1024,
        user_tier: 'free'
      });
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
  const isTranscribeResultActive = !!activeHistoryItem && activeHistoryItem.mode === 'transcribe' && activeHistoryItem.status === 'completed';
  const { data: transcribeResult, isLoading: isTranscribeResultLoading } = useTranscribeResult(
    isTranscribeResultActive ? activeHistoryItem!.jobId : null,
    isTranscribeResultActive,
  );
  const { data: transcribeAnalysis, isLoading: isTranscribeAnalysisLoading } = useAnalysisResult(
    isTranscribeResultActive ? activeHistoryItem!.jobId : null,
    isTranscribeResultActive,
  );

  return (
    <>
      {isResultModalOpen && activeHistoryItem && (
        <div className="fixed inset-0 z-50 bg-black/80 p-4 flex items-center justify-center">
          <div className="bg-card shadow-2xl w-full max-w-7xl max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden sci-fi-frame">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-semibold text-card-foreground">
                  {activeHistoryItem.mode === 'transcribe' ? t('interface:home.result.transcriptResult') : t('interface:home.result.convertedPreview')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeHistoryItem.mode === 'transcribe'
                    ? t('interface:home.result.transcriptSubtitle', { filename: activeHistoryItem.fileName })
                    : t('interface:home.result.convertedSubtitle', { filename: activeHistoryItem.fileName })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {activeHistoryItem.mode !== 'transcribe' && (
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
                      {t('interface:home.result.original')}
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
                      {t('interface:home.result.final')}
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => void handleDownload(activeHistoryItem.jobId, activeHistoryItem.outputFileName)}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {t('interface:common.download')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsResultModalOpen(false)}
                  className="text-muted-foreground hover:text-card-foreground transition-colors p-2"
                  aria-label={t('accessibility:home.closePreview')}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-muted/30 flex-1 min-h-0 flex items-center justify-center">
              {activeHistoryItem.mode === 'transcribe' ? (
                <Suspense fallback={<FormFallback />}>
                  <TranscribeResultView
                    result={transcribeResult ?? null}
                    analysis={transcribeAnalysis ?? null}
                    isLoading={isTranscribeResultLoading}
                    isAnalysisLoading={isTranscribeAnalysisLoading}
                  />
                </Suspense>
              ) : isLoadingResultPreview ? (
                <p className="text-card-foreground">{t('interface:home.result.loadingPreview')}</p>
              ) : resultPreviewError ? (
                <div className="text-center space-y-3">
                  <p className="text-destructive">{resultPreviewError}</p>
                  <button
                    type="button"
                    onClick={() => void loadResultPreview(activeResultJobId || conversionJob?.id, true)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t('interface:home.result.tryLoadingAgain')}
                  </button>
                </div>
              ) : (
                <>
                  {activeHistoryItem.mediaKind === 'image' && (
                    <img
                      src={resultView === 'original' ? activeHistoryItem.originalUrl : resultImageUrl || undefined}
                      alt={resultView === 'original' ? t('interface:home.result.originalImageAlt') : t('interface:home.result.convertedImageAlt')}
                      className="max-w-full max-h-[calc(100vh-14rem)] object-contain rounded-lg bg-background"
                    />
                  )}
                  {activeHistoryItem.mediaKind === 'video' && activeHistoryItem.format === 'gif' && resultView === 'final' && (
                    <img
                      src={resultImageUrl || undefined}
                      alt={t('interface:home.result.convertedGifAlt')}
                      className="max-w-full max-h-[calc(100vh-14rem)] object-contain rounded-lg bg-background"
                    />
                  )}
                  {activeHistoryItem.mediaKind === 'video' && !(activeHistoryItem.format === 'gif' && resultView === 'final') && (
                    <video
                      key={`${activeHistoryItem.jobId}-${resultView}`}
                      src={resultView === 'original' ? activeHistoryItem.originalUrl : resultImageUrl || undefined}
                      controls
                      className="max-w-full max-h-[calc(100vh-14rem)] rounded-lg bg-black"
                    />
                  )}
                  {activeHistoryItem.mediaKind === 'audio' && (
                    <div className="w-full max-w-3xl bg-background rounded-lg border p-8">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Music className="w-16 h-16 text-muted-foreground" />
                        <p className="text-card-foreground font-medium">
                          {resultView === 'original' ? activeHistoryItem.fileName : activeHistoryItem.outputFileName}
                        </p>
                        <audio
                          key={`${activeHistoryItem.jobId}-${resultView}`}
                          src={resultView === 'original' ? activeHistoryItem.originalUrl : resultImageUrl || undefined}
                          controls
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-8xl mx-auto p-4 pt-8 flex justify-center items-center flex-col">
        <header className="w-full max-w-5xl text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-card-foreground tracking-tight">
            {t('interface:home.hero.title')}
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('interface:home.hero.subtitle')}
          </p>
          <nav aria-label={t('accessibility:home.popularTools')} className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <Link href="/tools" className="px-3 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">{t('interface:home.hero.allTools')}</Link>
            <Link href="/tools/remove-exif-metadata" className="px-3 py-1.5 rounded-full bg-card border border-border text-card-foreground hover:bg-muted transition-colors">{t('interface:home.hero.removeExif')}</Link>
            <Link href="/tools/compress-video" className="px-3 py-1.5 rounded-full bg-card border border-border text-card-foreground hover:bg-muted transition-colors">{t('interface:home.hero.compressVideo')}</Link>
            <Link href="/tools/transcribe-video" className="px-3 py-1.5 rounded-full bg-card border border-border text-card-foreground hover:bg-muted transition-colors">{t('interface:home.hero.transcribeVideo')}</Link>
            <Link href="/tools/transcode-to-hls" className="px-3 py-1.5 rounded-full bg-card border border-border text-card-foreground hover:bg-muted transition-colors">{t('interface:home.hero.transcodeHls')}</Link>
            {/* Review-visible chips link only to review-allowlisted tool pages. */}
            <Link href="/tools/compress-image" className="px-3 py-1.5 rounded-full bg-card border border-border text-card-foreground hover:bg-muted transition-colors">Compress image</Link>
            <Link href="/tools/image-resizer" className="px-3 py-1.5 rounded-full bg-card border border-border text-card-foreground hover:bg-muted transition-colors">Resize image</Link>
            <Link href="/tools/extract-audio-from-video" className="px-3 py-1.5 rounded-full bg-card border border-border text-card-foreground hover:bg-muted transition-colors">Extract audio</Link>
          </nav>
        </header>

        {/* Content Studio call-to-action */}
        <Link
          href="/tools/content-studio"
          className="w-full max-w-5xl mb-8 group block sci-fi-frame-green bg-card p-5"
          aria-label={t('interface:home.contentStudioCta.title')}
        >
          <div className="flex items-center gap-4">
            <div className="shrink-0 rounded-lg bg-green-600/10 p-3">
              <Clapperboard className="w-7 h-7 text-green-500" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-semibold text-card-foreground">
                  {t('interface:home.contentStudioCta.title')}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-green-600 px-2 py-0.5 text-xs font-medium text-white">
                  <Sparkles className="w-3 h-3" />
                  {t('interface:home.contentStudioCta.badge')}
                </span>
              </span>
              <p className="text-sm text-muted-foreground mt-1">{t('interface:home.contentStudioCta.body')}</p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-green-500 group-hover:translate-x-0.5 transition-transform shrink-0">
              {t('interface:home.contentStudioCta.cta')}
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>

        <div className="grid 2xl:grid-cols-2 gap-6 max-w-8xl">
          {/* File Upload Section */}
          <div className="bg-card shadow-lg p-6 sci-fi-frame max-w-4xl min-w-3xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-card-foreground">
              <Upload className="w-5 h-5" />
              {t('interface:home.upload.title')}
            </h2>

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-card-foreground mb-2">
                  {t('interface:home.upload.dragDrop')}
                </p>
                <p className="text-muted-foreground mb-4">
                  {t('interface:home.upload.orClickSelect')}
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('interface:home.upload.chooseFile')}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept="image/*,video/*,audio/*"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(fileType!)}
                    <div>
                      <p className="font-medium text-card-foreground">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
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
                  onShowResult={() => void loadResultPreview(conversionJob?.id, true)}
                />

                {/* Identify File Button */}
                <button
                  onClick={handleIdentifyFile}
                  disabled={isIdentifying}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  {isIdentifying ? t('interface:home.upload.analyzing') : t('interface:home.upload.identifyDetails')}
                </button>

                {/* File Details */}
                {fileDetails && (
                  <FileDetails
                    fileDetails={fileDetails}
                    className="mt-4"
                  />
                )}

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
                    className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
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
                            onClick={() => void loadResultPreview(item.jobId, true)}
                            className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                          >
                            {t('interface:home.history.preview')}
                          </button>
                          <button
                            type="button"
                            disabled={item.status !== 'completed'}
                            onClick={() => void handleDownload(item.jobId, item.outputFileName)}
                            className="text-sm bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                          >
                            {t('interface:home.history.download')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Conversion Options */}
          <div className="bg-card shadow-lg p-6 sci-fi-frame max-w-4xl min-w-3xl">
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
                      ? 'bg-blue-600 text-white'
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
                      ? 'bg-blue-600 text-white'
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
                        ? 'bg-blue-600 text-white'
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
                      ? 'bg-blue-600 text-white'
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
                      ? 'bg-blue-600 text-white'
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
                      onClick={() => void handleDownload()}
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      {t('interface:home.download.downloadAs', { filename: getConvertedFilename() })}
                    </button>
                    <p className="text-xs text-muted-foreground text-center">
                      {t('interface:home.download.fileWillBeDownloaded', { filename: getConvertedFilename() })}
                    </p>
                  </div>
                )}

                {/* Progress Display */}
                {(isPending || isTranscribePending) && (fileType === 'video' || workflowMode === 'transcribe') && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {uploadPhaseLabel} {activeProgress > 0 ? `${activeProgress}%` : ''}
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${activeProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {isLoading && conversionJob?.progress && (
                  <div className="text-center flex flex-col items-center justify-center">
                    <div className="blob-sphere-loader mb-12 mt-8">
                      <div className="blob-sphere-loader-inner">
                        <div className="blob-sphere b1"></div>
                        <div className="blob-sphere b2"></div>
                        <div className="blob-sphere b3"></div>
                        <div className="blob-sphere b4"></div>
                        <div className="blob-sphere b5"></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('interface:home.progress.percentComplete', { percent: conversionJob.progress })}
                    </p>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${conversionJob.progress}%` }}
                      />
                    </div>
                  </div>
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
                      <span className="shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-semibold flex items-center justify-center text-sm">1</span>
                      <div>
                        <p className="font-medium text-card-foreground">{t('interface:home.gettingStarted.step1.title')}</p>
                        <p className="text-sm text-muted-foreground">
                          <Trans i18nKey="interface:home.gettingStarted.step1.body" components={{ em: <em /> }} />
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-300 font-semibold flex items-center justify-center text-sm">2</span>
                      <div>
                        <p className="font-medium text-card-foreground">{t('interface:home.gettingStarted.step2.title')}</p>
                        <p className="text-sm text-muted-foreground">
                          <Trans i18nKey="interface:home.gettingStarted.step2.body" components={{ em: <em /> }} />
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 font-semibold flex items-center justify-center text-sm">3</span>
                      <div>
                        <p className="font-medium text-card-foreground">{t('interface:home.gettingStarted.step3.title')}</p>
                        <p className="text-sm text-muted-foreground">
                          <Trans i18nKey="interface:home.gettingStarted.step3.body" components={{ em: <em /> }} />
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300 font-semibold flex items-center justify-center text-sm">4</span>
                      <div>
                        <p className="font-medium text-card-foreground">{t('interface:home.gettingStarted.step4.title')}</p>
                        <p className="text-sm text-muted-foreground">
                          <Trans i18nKey="interface:home.gettingStarted.step4.body" components={{ em: <em /> }} />
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
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
                    <BookOpen className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-card-foreground">{t('interface:home.notSure.title')}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('interface:home.notSure.body')}
                      </p>
                      <Link
                        href="/tutorials"
                        className="inline-flex items-center gap-2 mt-3 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <BookOpen className="w-4 h-4" />
                        {t('interface:home.notSure.cta')}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-card-foreground">{t('interface:home.howItWorks.title')}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('interface:home.howItWorks.body')}
                      </p>
                      <Link
                        href="/how-it-works"
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
          </div>
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
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${conversionJob.progress || 0}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FileConverterApp;
