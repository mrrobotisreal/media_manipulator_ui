import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Download, Image, Video, Music, X, Settings, Search } from 'lucide-react';
import { getFileType } from '@/lib/utils';
import FilePreview from '@/components/file-preview';
import FileDetails from '@/components/file-details';
import AdBanner from '@/components/ad-banner';
import AlternativeAdBanner from '@/components/alternative-ad-banner';
import type { ConversionFormData } from '@/schemas/types';
import ImageConversionForm from '@/components/image-conversion-form';
import VideoConversionForm from '@/components/video-conversion-form';
import AudioConversionForm from '@/components/audio-conversion-form';
import useConvertFile, { type UploadFileResponse } from '@/lib/useConvertFile';
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
  trackFileIdentification,
  trackPageView,
  trackUserSession,
} from '@/lib/analytics';
import mixpanel from 'mixpanel-browser';

const FileConverterApp: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const [conversionOptions, setConversionOptions] = useState<ConversionFormData | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [conversionStartTime, setConversionStartTime] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: jobStatusData } = useGetJobStatus(conversionJob);
  const { data: fileDetails, mutate: identifyFile, isPending: isIdentifying, reset: resetIdentification } = useIdentifyFile();

  const { mutate, isPending } = useConvertFile((res: UploadFileResponse) => {
    setConversionStartTime(Date.now());
    setConversionJob({
      id: res.jobId,
      status: 'processing',
      originalFile: selectedFile!,
      progress: 0
    });
  });

  const { downloadFile } = useDownloadFile();

  const fileType = selectedFile ? getFileType(selectedFile) : null;

  // Initialize analytics on component mount
  useEffect(() => {
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

      // Track file upload
      trackFileUpload(getFileType(file), file.size, file.name);
    }
  };

  const handleConvert = (data: ConversionFormData) => {
    if (!selectedFile) return;
    setConversionOptions(data); // Store the conversion options

    // Track conversion start
    const fromFormat = selectedFile.name.split('.').pop()?.toLowerCase() || 'unknown';
    trackFileConversion(fromFormat, data.format, selectedFile.size);

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

  const getConvertedFilename = () => {
    if (!selectedFile || !conversionOptions) return selectedFile?.name || 'converted_file';

    const originalName = selectedFile.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    const newExtension = conversionOptions.format;

    return `${nameWithoutExt}.${newExtension}`;
  };

  const handleDownload = async () => {
    if (conversionJob?.id) {
      try {
        const blob = await downloadFile(conversionJob.id);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = getConvertedFilename();
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Track file download
        trackFileDownload(fileName, fileType || 'unknown');

        // Enhanced mixpanel tracking for download
        const outputSizeMB = blob.size / 1024 / 1024;
        const inputSizeMB = selectedFile ? selectedFile.size / 1024 / 1024 : 0;
        const compressionRatio = inputSizeMB > 0 ? inputSizeMB / outputSizeMB : 1;

        mixpanel.track('File Downloaded', {
          file_name: fileName,
          file_type: fileType || 'unknown',
          output_format: conversionOptions?.format || 'unknown',
          file_size_mb: outputSizeMB,
          compression_ratio: compressionRatio,
          user_tier: 'free',
          conversion_id: conversionJob.id
        });
      } catch (error) {
        console.error('Download failed:', error);

        // Track download failure
        mixpanel.track('Download Failed', {
          error_message: error instanceof Error ? error.message : 'Unknown error',
          file_type: fileType || 'unknown',
          conversion_id: conversionJob.id,
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
    resetIdentification();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleIdentifyFile = () => {
    if (selectedFile) {
      identifyFile(selectedFile);

      // Track file identification
      trackFileIdentification(fileType || 'unknown', true);

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

  const isLoading = isPending || conversionJob?.status === 'processing';

  return (
    <>
      {/* Top Banner Ad */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <AdBanner
          adSlot="6671038874"
          adFormat="leaderboard"
          adPosition="header"
          className="mb-4"
          style={{ minHeight: '90px' }}
        />
      </div>

      <div className="max-w-6xl mx-auto p-4 pt-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* File Upload Section */}
          <div className="bg-card rounded-xl shadow-lg p-6 border">
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
                  resultUrl={conversionJob?.resultUrl}
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
          <div className="bg-card rounded-xl shadow-lg p-6 border">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-card-foreground">
              <Settings className="w-5 h-5" />
              Conversion Options
            </h2>

            {selectedFile && fileType && fileType !== 'unknown' ? (
              <div className="space-y-6">
                {fileType === 'image' && (
                  <ImageConversionForm
                    onSubmit={handleConvert}
                    isLoading={isLoading}
                    imageUrl={selectedFile ? URL.createObjectURL(selectedFile) : undefined}
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

                {/* Download Button */}
                {conversionJob?.status === 'completed' && (
                  <div className="space-y-2">
                    <button
                      onClick={handleDownload}
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
          />
          {/* Alternative footer ad */}
          <div className="mt-4">
            <AlternativeAdBanner
              network="infolinks"
              adSlot="728x90"
              adFormat="leaderboard"
              adPosition="footer_alternative"
              className="w-full"
              style={{ minHeight: '90px' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FileConverterApp;
