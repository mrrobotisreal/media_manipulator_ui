import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Download, Image, Video, Music, X, Settings, Search } from 'lucide-react';
import { getFileType } from '@/lib/utils';
import FilePreview from '@/components/file-preview';
import FileDetails from '@/components/file-details';
import AdBanner from '@/components/ad-banner';
import type { ConversionFormData } from '@/schemas/types';
import ImageConversionForm from '@/components/image-conversion-form';
import VideoConversionForm from '@/components/video-conversion-form';
import AudioConversionForm from '@/components/audio-conversion-form';
import TopNav from '@/components/top-nav';
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
        trackConversionSuccess(
          conversionOptions ? `${fileType}_to_${conversionOptions.format}` : 'unknown',
          processingTime
        );
      }

      // Track conversion failure
      if (previousStatus === 'processing' && jobStatusData.status === 'failed') {
        trackConversionFailure(
          conversionOptions ? `${fileType}_to_${conversionOptions.format}` : 'unknown'
        );
      }
    }
  }, [jobStatusData, conversionJob?.status, conversionStartTime, conversionOptions, fileType]);

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
      } catch (error) {
        console.error('Download failed:', error);
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
    <div className="min-h-screen bg-[url('/images/background.webp')] bg-center bg-no-repeat bg-cover">
      <TopNav />

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
                  <ImageConversionForm onSubmit={handleConvert} isLoading={isLoading} />
                )}
                {fileType === 'video' && (
                  <VideoConversionForm onSubmit={handleConvert} isLoading={isLoading} />
                )}
                {fileType === 'audio' && (
                  <AudioConversionForm onSubmit={handleConvert} isLoading={isLoading} />
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
        </div>
      </div>
    </div>
  );
};

export default FileConverterApp;
