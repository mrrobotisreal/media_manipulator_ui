import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Info, Eye, EyeOff } from 'lucide-react';
import type { FileIdentificationResponse } from '@/lib/useIdentifyFile';

interface FileDetailsProps {
  fileDetails: FileIdentificationResponse;
  className?: string;
}

const FileDetails: React.FC<FileDetailsProps> = ({ fileDetails, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRawOutput, setShowRawOutput] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const formatValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) return <span className="text-muted-foreground italic">N/A</span>;
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toLocaleString();
    if (typeof value === 'string') return value;

    // Handle arrays
    if (Array.isArray(value)) {
      return (
        <div className="text-muted-foreground italic">
          Array ({value.length} items) - expand to view
        </div>
      );
    }

    // Handle objects
    if (typeof value === 'object') {
      const keys = Object.keys(value as Record<string, unknown>);
      return (
        <div className="text-muted-foreground italic">
          Object ({keys.length} properties) - expand to view
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
          <div className="text-sm text-muted-foreground mb-2">[Array with {value.length} items]</div>
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
          <div className="text-sm text-muted-foreground mb-2">{`{Object with ${entries.length} properties}`}</div>
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
      return <p className="text-muted-foreground italic">No additional details available</p>;
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
                    {isExpanded ? 'Collapse' : 'Expand'}
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

  return (
    <div className={`bg-card rounded-lg border shadow-sm ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-card-foreground">File Details</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFileTypeColor(fileDetails.fileType)}`}>
              {fileDetails.fileType.toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-card-foreground transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm font-medium text-card-foreground">File Name</div>
            <div className="text-sm text-muted-foreground truncate" title={fileDetails.fileName}>
              {fileDetails.fileName}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-card-foreground">File Size</div>
            <div className="text-sm text-muted-foreground">
              {formatFileSize(fileDetails.fileSize)}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-card-foreground">MIME Type</div>
            <div className="text-sm text-muted-foreground">
              {fileDetails.mimeType}
            </div>
          </div>
        </div>

        {/* Tool Info */}
        <div className="mb-4">
          <div className="text-sm font-medium text-card-foreground">Analysis Tool</div>
          <div className="text-sm text-muted-foreground">
            {fileDetails.tool}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            <div>
              <h4 className="text-md font-medium text-card-foreground mb-3">Technical Details</h4>
              {renderDetailsSection()}
            </div>

            {/* Raw Output Toggle */}
            <div className="border-t pt-4">
              <button
                onClick={() => setShowRawOutput(!showRawOutput)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-card-foreground transition-colors mb-3"
              >
                {showRawOutput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showRawOutput ? 'Hide' : 'Show'} Raw Command Output
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