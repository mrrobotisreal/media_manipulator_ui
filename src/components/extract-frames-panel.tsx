import React, { useState } from 'react';
import { Film } from 'lucide-react';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import useSpecializedMediaTool from '@/lib/useSpecializedMediaTool';
import SpecializedToolShell from '@/components/specialized-tool-shell';

type FramesMode = 'every_n_seconds' | 'fps' | 'timestamp';

const ExtractFramesPanel: React.FC = () => {
  const [mode, setMode] = useState<FramesMode>('every_n_seconds');
  const [intervalSeconds, setIntervalSeconds] = useState<number>(5);
  const [fps, setFps] = useState<number>(1);
  const [timestamps, setTimestamps] = useState<string>('');
  const [format, setFormat] = useState<'jpg' | 'png' | 'webp'>('jpg');
  const [maxFrames, setMaxFrames] = useState<number>(300);
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
      outputExtensionHint="zip"
      renderForm={({ file, isProcessing }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const options: Record<string, unknown> = {
              mode: 'extract_frames',
              // The backend reads the per-tool sub-mode from `frameMode` to
              // avoid colliding with the outer dispatcher's `mode` key.
              frameMode: mode,
              format,
              maxFrames,
            };
            if (mode === 'every_n_seconds') {
              options.intervalSeconds = intervalSeconds;
            } else if (mode === 'fps') {
              options.fps = fps;
            } else if (mode === 'timestamp') {
              const list = timestamps
                .split(',')
                .map((t) => Number(t.trim()))
                .filter((n) => Number.isFinite(n) && n >= 0);
              options.timestamps = list;
            }
            mutate({
              file,
              options: options as never,
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Extraction mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as FramesMode)}
              className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
            >
              <option value="every_n_seconds">Every N seconds</option>
              <option value="fps">Specific frames per second</option>
              <option value="timestamp">Specific timestamps</option>
            </select>
          </div>

          {mode === 'every_n_seconds' && (
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Seconds between frames</label>
              <input
                type="number"
                step={0.1}
                min={0.1}
                max={600}
                value={intervalSeconds}
                onChange={(e) => setIntervalSeconds(Math.max(0.1, Math.min(600, Number(e.target.value) || 0.1)))}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
              />
            </div>
          )}

          {mode === 'fps' && (
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Frames per second</label>
              <input
                type="number"
                step={0.1}
                min={0.05}
                max={60}
                value={fps}
                onChange={(e) => setFps(Math.max(0.05, Math.min(60, Number(e.target.value) || 0.05)))}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
              />
            </div>
          )}

          {mode === 'timestamp' && (
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Timestamps in seconds (comma-separated)</label>
              <input
                type="text"
                value={timestamps}
                onChange={(e) => setTimestamps(e.target.value)}
                placeholder="e.g. 1, 5.5, 12, 30"
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Image format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'jpg' | 'png' | 'webp')}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
              >
                <option value="jpg">JPG</option>
                <option value="png">PNG (lossless)</option>
                <option value="webp">WebP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Max frames</label>
              <input
                type="number"
                min={1}
                max={1000}
                value={maxFrames}
                onChange={(e) => setMaxFrames(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Frames are bundled into a single ZIP for download. We cap the count to keep jobs fast and predictable; raise the limit if you really need more.
          </p>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Film className="w-4 h-4" />
            {isProcessing ? 'Extracting frames…' : 'Extract frames'}
          </button>
        </form>
      )}
    />
  );
};

export default ExtractFramesPanel;
