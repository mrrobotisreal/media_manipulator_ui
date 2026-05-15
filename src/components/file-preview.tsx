import { useEffect, useState } from 'react';
import { Eye, Music } from 'lucide-react';
import { getFileType } from '@/lib/utils';

const FilePreview: React.FC<{
  file: File;
  resultAvailable?: boolean;
  onShowResult?: () => void;
}> = ({ file, resultAvailable = false, onShowResult }) => {
  const [showResult, setShowResult] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileType = getFileType(file);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowResult(false);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const togglePreview = () => {
    if (resultAvailable && onShowResult) {
      setShowResult(true);
      onShowResult();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={togglePreview}
          disabled={!resultAvailable}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
        >
          <Eye size={16} />
          {showResult ? 'Show Result' : 'Show Result'}
        </button>
      </div>

      <div className="bg-muted/50 rounded-lg overflow-hidden border">
        {fileType === 'image' && previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-contain bg-background"
          />
        )}
        {fileType === 'video' && previewUrl && (
          <video
            src={previewUrl}
            controls
            className="w-full h-48 bg-black"
          />
        )}
        {fileType === 'audio' && previewUrl && (
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
