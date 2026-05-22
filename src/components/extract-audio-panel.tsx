import React, { useState } from 'react';
import { Music } from 'lucide-react';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import useSpecializedMediaTool from '@/lib/useSpecializedMediaTool';
import SpecializedToolShell from '@/components/specialized-tool-shell';

const FORMAT_OPTIONS = [
  { value: 'mp3', label: 'MP3 (compact, plays everywhere)' },
  { value: 'wav', label: 'WAV (lossless, large)' },
  { value: 'm4a', label: 'M4A (AAC — good quality, compact)' },
  { value: 'aac', label: 'AAC (raw)' },
  { value: 'flac', label: 'FLAC (lossless)' },
  { value: 'ogg', label: 'OGG (Vorbis)' },
] as const;

const ExtractAudioPanel: React.FC = () => {
  const [format, setFormat] = useState<typeof FORMAT_OPTIONS[number]['value']>('mp3');
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const { mutate, isPending, uploadProgress } = useSpecializedMediaTool((res) => {
    setConversionJob({
      id: res.jobId,
      status: 'processing',
      originalFile: new File([], 'temp'),
      progress: 0,
    });
  });

  return (
    <SpecializedToolShell
      accept="video/*"
      uploadHint="video file"
      conversionJob={conversionJob}
      setConversionJob={setConversionJob}
      isUploading={isPending}
      uploadProgress={uploadProgress}
      outputExtensionHint={format}
      renderForm={({ file, isProcessing }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate({
              file,
              options: { mode: 'extract_audio', format },
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Output audio format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as typeof format)}
              className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
            >
              {FORMAT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              The extracted track keeps the source's full duration and quality. Videos with no audio will return a clear error.
            </p>
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Music className="w-4 h-4" />
            {isProcessing ? 'Extracting…' : 'Extract audio'}
          </button>
        </form>
      )}
    />
  );
};

export default ExtractAudioPanel;
