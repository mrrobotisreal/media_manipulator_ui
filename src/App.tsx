import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Download, Image, Video, Music, X, Settings, Search, FileText } from 'lucide-react';
import { getFileType } from '@/lib/utils';
import FilePreview from '@/components/file-preview';
import FileDetails from '@/components/file-details';
import AdBanner from '@/components/ad-banner';
import AlternativeAdBanner from '@/components/alternative-ad-banner';
import type { ConversionFormData } from '@/schemas/types';
import ImageConversionForm from '@/components/image-conversion-form';
import VideoConversionForm from '@/components/video-conversion-form';
import AudioConversionForm from '@/components/audio-conversion-form';
import TranscribeForm from '@/components/transcribe-form';
import TranscribeResultView from '@/components/transcribe-result-view';
import useConvertFile, { type UploadFileResponse } from '@/lib/useConvertFile';
import useTranscribeFile, { type TranscribeFormData, type TranscribeUploadResponse } from '@/lib/useTranscribeFile';
import { useTranscribeResult, useAnalysisResult } from '@/lib/useTranscribeResult';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import useGetJobStatus from '@/lib/useGetJobStatus';
import useDownloadFile from './lib/useDownloadFile';
import useIdentifyFile from '@/lib/useIdentifyFile';
import {
  trackFileUpload,
  trackFileConversion,
  trackConversionSuccess,
  trackConversionFailure,
  trackFileDownload,
  trackPageView,
  trackUserSession,
} from '@/lib/analytics';
import { trackFirstPartyError, trackFirstPartyEvent } from '@/lib/firstPartyAnalytics';
import { initializeIndexedIdentity } from '@/lib/indexedIdentity';
import mixpanel from 'mixpanel-browser';

type WorkflowMode = 'convert' | 'transcribe';

interface ConversionHistoryItem {
  jobId: string;
  mediaKind: 'image' | 'video' | 'audio' | 'unknown';
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
  mediaKind: 'image' | 'video' | 'audio' | 'unknown';
  mode: WorkflowMode;
  fileName: string;
  outputFileName: string;
  format: string;
  originalUrl: string;
  startedAt: number;
}

const FileConverterApp: React.FC = () => {
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

  // Initialize analytics on component mount
  useEffect(() => {
    void initializeIndexedIdentity().catch(error => {
      trackFirstPartyError('identity_init', error);
    });
    trackPageView('File Converter Home');

    // Set user session data
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
        mixpanel.track('Conversion Completed', {
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
        mixpanel.track('Conversion Failed', {
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
      mixpanel.track('File Identification Completed', {
        file_name: selectedFile.name,
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
    mixpanel.track('Conversion Started', {
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
      const message = error instanceof Error ? error.message : 'Failed to load converted image preview';
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

        mixpanel.track('File Downloaded', {
          file_name: fileName,
          file_type: mediaKind,
          output_format: historyItem?.format || conversionOptions?.format || 'unknown',
          file_size_mb: outputSizeMB,
          compression_ratio: compressionRatio,
          user_tier: 'free',
          conversion_id: jobId
        });
        trackFirstPartyEvent('download', {
          file_name: fileName,
          output_format: conversionOptions?.format || 'unknown',
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
        mixpanel.track('Download Failed', {
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
        file_name: selectedFile.name,
        size_bytes: selectedFile.size,
      }, {
        featureName: 'file_identification',
        mediaKind: fileType || 'unknown',
      });

      // Enhanced mixpanel tracking for file identification
      mixpanel.track('File Identification Started', {
        file_name: selectedFile.name,
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
    ? 'Preparing secure upload...'
    : activePhase === 'uploading-to-s3'
      ? 'Uploading file directly to S3...'
      : activePhase === 'finalizing'
        ? 'Staging uploaded file on the server...'
        : workflowMode === 'transcribe'
          ? 'Starting transcription...'
          : 'Starting conversion...';

  const formatHistoryTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
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
                  {activeHistoryItem.mode === 'transcribe' ? 'Transcript Result' : 'Converted File Preview'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {activeHistoryItem.mode === 'transcribe'
                    ? `Transcript and AI review for ${activeHistoryItem.fileName}.`
                    : `Toggle between the original and finalized edited version of ${activeHistoryItem.fileName}.`}
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
                      Original
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
                      Final
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => void handleDownload(activeHistoryItem.jobId, activeHistoryItem.outputFileName)}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => setIsResultModalOpen(false)}
                  className="text-muted-foreground hover:text-card-foreground transition-colors p-2"
                  aria-label="Close preview"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-muted/30 flex-1 min-h-0 flex items-center justify-center">
              {activeHistoryItem.mode === 'transcribe' ? (
                <TranscribeResultView
                  result={transcribeResult ?? null}
                  analysis={transcribeAnalysis ?? null}
                  isLoading={isTranscribeResultLoading}
                  isAnalysisLoading={isTranscribeAnalysisLoading}
                />
              ) : isLoadingResultPreview ? (
                <p className="text-card-foreground">Loading converted image...</p>
              ) : resultPreviewError ? (
                <div className="text-center space-y-3">
                  <p className="text-destructive">{resultPreviewError}</p>
                  <button
                    type="button"
                    onClick={() => void loadResultPreview(activeResultJobId || conversionJob?.id, true)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Loading Preview Again
                  </button>
                </div>
              ) : (
                <>
                  {activeHistoryItem.mediaKind === 'image' && (
                    <img
                      src={resultView === 'original' ? activeHistoryItem.originalUrl : resultImageUrl || undefined}
                      alt={resultView === 'original' ? 'Original image' : 'Converted image'}
                      className="max-w-full max-h-[calc(100vh-14rem)] object-contain rounded-lg bg-background"
                    />
                  )}
                  {activeHistoryItem.mediaKind === 'video' && (
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

      {/* Top Banner Ad */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot="6671038874"
          adFormat="leaderboard"
          adPosition="header"
          className="mb-4"
          style={{ minHeight: '90px' }}
          isFlashMock={true}
          utmMedium="homepage_leaderboard_banner"
          utmCampaign="creatv_launch_promo"
          linkURL="https://www.creatv.io/auth"
        />
      </div>

      <div className="max-w-6xl mx-auto p-4 pt-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* File Upload Section */}
          <div className="bg-card shadow-lg p-6 sci-fi-frame">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-card-foreground">
              <Upload className="w-5 h-5" />
              Upload File
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
                  Drag and drop your file here
                </p>
                <p className="text-muted-foreground mb-4">
                  or click to select from your computer
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choose File
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
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
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
                  {isIdentifying ? 'Analyzing...' : 'Identify File Details'}
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
                    <h3 className="font-medium text-card-foreground">Conversion History</h3>
                    <p className="text-sm text-muted-foreground">
                      Reopen or download any image, video, or audio result from this session.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    New Conversion
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
                              #{conversionHistory.length - index} {item.outputFileName}
                              {item.mode === 'transcribe' && (
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                  Transcript
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.status === 'processing'
                              ? `Started ${formatHistoryTime(item.startedAt)} and still processing`
                              : item.status === 'completed'
                                ? `Completed ${formatHistoryTime(item.completedAt || item.startedAt)}`
                                : item.error || (item.mode === 'transcribe' ? 'Transcription failed' : 'Conversion failed')}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={item.status !== 'completed'}
                            onClick={() => void loadResultPreview(item.jobId, true)}
                            className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            disabled={item.status !== 'completed'}
                            onClick={() => void handleDownload(item.jobId, item.outputFileName)}
                            className="text-sm bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sidebar Ad in File Upload Section */}
            {selectedFile && (
              <div className="mt-6">
                <AdBanner
                  adSlot="7449783987"
                  adFormat="rectangle"
                  adPosition="sidebar_upload"
                  className="w-full"
                  style={{ minHeight: '250px' }}
                />
                {/* Alternative ad network as fallback */}
                <div className="mt-4">
                  <AlternativeAdBanner
                    network="infolinks"
                    adSlot="728x90"
                    adFormat="banner"
                    adPosition="sidebar_upload_alt"
                    className="w-full"
                    style={{ minHeight: '90px' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Conversion Options */}
          <div className="bg-card shadow-lg p-6 sci-fi-frame">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-card-foreground">
              <Settings className="w-5 h-5" />
              {workflowMode === 'transcribe' ? 'Transcription Options' : 'Conversion Options'}
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
                  Convert
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
                  Transcribe
                </button>
              </div>
            )}

            {selectedFile && fileType && fileType !== 'unknown' ? (
              <div className="space-y-6">
                {workflowMode === 'transcribe' && (fileType === 'video' || fileType === 'audio') ? (
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

                {/* Download Button */}
                {conversionJob?.status === 'completed' && (
                  <div className="space-y-2">
                    <button
                      onClick={() => void handleDownload()}
                      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download {getConvertedFilename()}
                    </button>
                    <p className="text-xs text-muted-foreground text-center">
                      File will be downloaded as: {getConvertedFilename()}
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
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {conversionJob.progress}% Complete
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
                      Conversion failed. Please try again.
                    </p>
                  </div>
                )}

                {/* Sidebar Ad in Conversion Section */}
                <AdBanner
                  adSlot="6568479981"
                  adFormat="rectangle"
                  adPosition="sidebar_conversion"
                  className="w-full"
                  style={{ minHeight: '250px' }}
                />
                {/* PropellerAds as alternative network */}
                <div className="mt-4">
                  <AlternativeAdBanner
                    network="propellerads"
                    adSlot="your_propeller_zone_id"
                    adFormat="banner"
                    adPosition="sidebar_conversion_propeller"
                    className="w-full"
                    style={{ minHeight: '100px' }}
                  />
                </div>
                {/* InfoLinks for in-text ads */}
                <div className="mt-4">
                  <AlternativeAdBanner
                    network="infolinks"
                    adSlot="infolinks_zone"
                    adFormat="auto"
                    adPosition="sidebar_conversion_infolinks"
                    className="w-full"
                    style={{ minHeight: '60px' }}
                  />
                </div>
              </div>
            ) : selectedFile ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Unsupported file type. Please select an image, video, or audio file.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Select a file to see conversion options
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {conversionJob?.status === 'processing' && (
          <div className="mt-6 bg-card rounded-xl shadow-lg p-6 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">Converting...</span>
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

        {/* Bottom Banner Ad */}
        <div className="mt-8">
          <AdBanner
            adSlot="3633827902"
            adFormat="leaderboard"
            adPosition="footer"
            className="w-full"
            style={{ minHeight: '90px' }}
            isFlashMock={true}
            utmMedium="homepage_leaderboard_banner"
            utmCampaign="creatv_launch_promo"
            linkURL="https://www.creatv.io/auth"
          />
        </div>
      </div>
    </>
  );
};

export default FileConverterApp;
