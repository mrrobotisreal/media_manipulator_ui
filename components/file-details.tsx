'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Info, Eye, EyeOff } from 'lucide-react';
import type { FileIdentificationResponse } from '@/lib/useIdentifyFile';
import { useLocalization } from '@/i18n/useLocalization';

interface FileDetailsProps {
  fileDetails: FileIdentificationResponse;
  className?: string;
}

const FileDetails: React.FC<FileDetailsProps> = ({ fileDetails, className = '' }) => {
  const { t, formatFileSize } = useLocalization('interface');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRawOutput, setShowRawOutput] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const formatValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) return <span className="text-muted-foreground italic">{t('fileDetails.notAvailable')}</span>;
    if (typeof value === 'boolean') return value ? t('common.yes') : t('common.no');
    if (typeof value === 'number') return value.toLocaleString();
    if (typeof value === 'string') return value;

    // Handle arrays
    if (Array.isArray(value)) {
      return (
        <div className="text-muted-foreground italic">
          {t('fileDetails.arraySummary', { count: value.length })}
        </div>
      );
    }

    // Handle objects
    if (typeof value === 'object') {
      const keys = Object.keys(value as Record<string, unknown>);
      return (
        <div className="text-muted-foreground italic">
          {t('fileDetails.objectSummary', { count: keys.length })}
        </div>
      );
    }

    return String(value);
  };

  const renderNestedValue = (value: unknown, depth: number = 0): React.ReactNode => {
    if (value === null || value === undefined) return <span className="text-muted-foreground italic">null</span>;
    if (typeof value === 'boolean') return <span className={value ? 'text-green-600' : 'text-red-600'}>{value ? 'true' : 'false'}</span>;
    if (typeof value === 'number') return <span className="text-blue-600">{value.toLocaleString()}</span>;
    if (typeof value === 'string') return <span className="text-gray-800 dark:text-gray-200">"{value}"</span>;

    // Handle arrays
    if (Array.isArray(value)) {
      return (
        <div className="ml-4 border-l-2 border-gray-200 pl-3">
          <div className="text-sm text-muted-foreground mb-2">{t('fileDetails.arrayLabel', { count: value.length })}</div>
          {value.map((item, index) => (
            <div key={index} className="mb-2">
              <span className="text-xs text-muted-foreground mr-2">{index}:</span>
              {renderNestedValue(item, depth + 1)}
            </div>
          ))}
        </div>
      );
    }

    // Handle objects
    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      return (
        <div className="ml-4 border-l-2 border-gray-200 pl-3">
          <div className="text-sm text-muted-foreground mb-2">{t('fileDetails.objectLabel', { count: entries.length })}</div>
          {entries.map(([key, val]) => (
            <div key={key} className="mb-2">
              <span className="text-sm font-medium text-purple-600 mr-2">{key}:</span>
              {renderNestedValue(val, depth + 1)}
            </div>
          ))}
        </div>
      );
    }

    return String(value);
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-green-100 text-green-800';
      case 'audio': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDetailsSection = () => {
    const detailEntries = Object.entries(fileDetails.details);

    if (detailEntries.length === 0) {
      return <p className="text-muted-foreground italic">{t('fileDetails.noAdditional')}</p>;
    }

    return (
      <div className="space-y-3">
        {detailEntries.map(([key, value]) => {
          const isComplex = typeof value === 'object' && value !== null;
          const isExpanded = expandedSections[key];

          return (
            <div key={key} className="bg-muted/30 rounded p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-card-foreground capitalize">
                  {key.replace(/[_-]/g, ' ')}
                </div>
                {isComplex && (
                  <button
                    onClick={() => toggleSection(key)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-card-foreground transition-colors"
                  >
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    {isExpanded ? t('fileDetails.collapse') : t('fileDetails.expand')}
                  </button>
                )}
              </div>

              <div className="mt-2">
                {isComplex && isExpanded ? (
                  <div className="max-h-64 overflow-y-auto">
                    {renderNestedValue(value)}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground break-words">
                    {formatValue(value)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMetadataSection = (title: string, values?: Record<string, unknown>) => {
    const entries = Object.entries(values || {}).filter(([, value]) => value !== null && value !== undefined && value !== '');
    if (entries.length === 0) {
      return (
        <div className="bg-muted/30 rounded p-3">
          <h4 className="text-md font-medium text-card-foreground mb-2">{title}</h4>
          <p className="text-sm text-muted-foreground italic">{t('fileDetails.noMetadataFound')}</p>
        </div>
      );
    }
    return (
      <div className="bg-muted/30 rounded p-3">
        <h4 className="text-md font-medium text-card-foreground mb-3">{title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {entries.map(([key, value]) => (
            <div key={key}>
              <div className="text-xs font-medium text-card-foreground">{key}</div>
              <div className="text-sm text-muted-foreground break-words">{formatValue(value)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAdvancedMetadataSection = () => {
    const advanced = fileDetails.imageMetadata?.advancedDeviceMetadata || {};
    const groupEntries = Object.entries(advanced).filter(([, values]) => Object.keys(values || {}).length > 0);
    if (groupEntries.length === 0) {
      return renderMetadataSection(t('fileDetails.advancedDeviceMetadata'), {});
    }
    const sectionKey = 'advancedDeviceMetadata';
    const isExpanded = expandedSections[sectionKey];
    return (
      <div className="bg-muted/30 rounded p-3">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-card-foreground">{t('fileDetails.advancedDeviceMetadata')}</h4>
          <button
            onClick={() => toggleSection(sectionKey)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-card-foreground transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {isExpanded ? (
          <div className="mt-3 space-y-3 max-h-96 overflow-y-auto">
            {groupEntries.map(([group, values]) => (
              <div key={group} className="border border-border rounded p-3">
                <div className="text-sm font-medium text-card-foreground mb-2">{group}</div>
                {renderNestedValue(values)}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">
            {t('fileDetails.metadataGroupsAvailable', { count: groupEntries.length })}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-card rounded-lg border shadow-sm ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex flex-col items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">{t('fileDetails.title')}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFileTypeColor(fileDetails.fileType)}`}>
              {fileDetails.fileType.toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-card-foreground transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {isExpanded ? t('fileDetails.collapse') : t('fileDetails.expand')}
          </button>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm font-medium text-card-foreground">{t('fileDetails.fileName')}</div>
            <div className="text-sm text-muted-foreground truncate" title={fileDetails.fileName}>
              {fileDetails.fileName}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-card-foreground">{t('fileDetails.fileSize')}</div>
            <div className="text-sm text-muted-foreground">
              {formatFileSize(fileDetails.fileSize)}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-card-foreground">{t('fileDetails.mimeType')}</div>
            <div className="text-sm text-muted-foreground">
              {fileDetails.mimeType}
            </div>
          </div>
        </div>

        {/* Tool Info */}
        <div className="mb-4">
          <div className="text-sm font-medium text-card-foreground">{t('fileDetails.analysisTool')}</div>
          <div className="text-sm text-muted-foreground">
            {fileDetails.tool}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            {fileDetails.imageMetadata && (
              <div className="space-y-4">
                {renderMetadataSection(t('fileDetails.container'), fileDetails.imageMetadata.container)}
                {renderMetadataSection(t('fileDetails.exifTiff'), fileDetails.imageMetadata.exifTiff)}
                {renderMetadataSection(t('fileDetails.gpsLocation'), fileDetails.imageMetadata.gpsLocation)}
                {renderAdvancedMetadataSection()}
              </div>
            )}

            <div>
              <h4 className="text-md font-medium text-card-foreground mb-3">{t('fileDetails.technicalDetails')}</h4>
              {renderDetailsSection()}
            </div>

            {/* Raw Output Toggle */}
            <div className="border-t pt-4">
              <button
                onClick={() => setShowRawOutput(!showRawOutput)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-card-foreground transition-colors mb-3"
              >
                {showRawOutput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showRawOutput ? t('fileDetails.hideRawOutput') : t('fileDetails.showRawOutput')}
              </button>

              {showRawOutput && (
                <div className="bg-muted/50 rounded p-3">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
                    {fileDetails.rawOutput}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDetails;