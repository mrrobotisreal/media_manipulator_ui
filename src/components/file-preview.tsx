import { useState } from 'react';
import { Eye, Music } from 'lucide-react';
import { getFileType } from '@/lib/utils';

const FilePreview: React.FC<{ file: File; resultUrl?: string }> = ({ file, resultUrl }) => {
  const [showResult, setShowResult] = useState(false);
  const fileType = getFileType(file);
  const previewUrl = showResult && resultUrl ? resultUrl : URL.createObjectURL(file);

  const togglePreview = () => {
    if (resultUrl) setShowResult(!showResult);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={togglePreview}
          disabled={!resultUrl}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
        >
          <Eye size={16} />
          {showResult ? 'Show Original' : 'Show Result'}
        </button>
      </div>

      <div className="bg-muted/50 rounded-lg overflow-hidden border">
        {fileType === 'image' && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-contain bg-background"
          />
        )}
        {fileType === 'video' && (
          <video
            src={previewUrl}
            controls
            className="w-full h-48 bg-black"
          />
        )}
        {fileType === 'audio' && (
          <div className="p-8 flex flex-col items-center justify-center h-48">
            <Music size={48} className="text-muted-foreground mb-4" />
            <audio src={previewUrl} controls className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreview;
