import React, { useState } from 'react';
import { Film } from 'lucide-react';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import useSpecializedMediaTool from '@/lib/useSpecializedMediaTool';
import SpecializedToolShell from '@/components/specialized-tool-shell';
import { useLocalization } from '@/i18n/useLocalization';

type FramesMode = 'every_n_seconds' | 'fps' | 'timestamp';

const ExtractFramesPanel: React.FC = () => {
  const { t } = useLocalization('interface');
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
      uploadHint={t('extractFrames.uploadHint')}
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
            <label className="block text-sm font-medium text-card-foreground mb-1">{t('extractFrames.modeLabel')}</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as FramesMode)}
              className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
            >
              <option value="every_n_seconds">{t('extractFrames.modes.every_n_seconds')}</option>
              <option value="fps">{t('extractFrames.modes.fps')}</option>
              <option value="timestamp">{t('extractFrames.modes.timestamp')}</option>
            </select>
          </div>

          {mode === 'every_n_seconds' && (
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">{t('extractFrames.secondsBetween')}</label>
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
              <label className="block text-sm font-medium text-card-foreground mb-1">{t('extractFrames.fpsLabel')}</label>
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
              <label className="block text-sm font-medium text-card-foreground mb-1">{t('extractFrames.timestampsLabel')}</label>
              <input
                type="text"
                value={timestamps}
                onChange={(e) => setTimestamps(e.target.value)}
                placeholder={t('extractFrames.timestampsPlaceholder')}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">{t('extractFrames.imageFormatLabel')}</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'jpg' | 'png' | 'webp')}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
              >
                <option value="jpg">{t('extractFrames.formats.jpg')}</option>
                <option value="png">{t('extractFrames.formats.png')}</option>
                <option value="webp">{t('extractFrames.formats.webp')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">{t('extractFrames.maxFramesLabel')}</label>
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
            {t('extractFrames.zipNote')}
          </p>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Film className="w-4 h-4" />
            {isProcessing ? t('extractFrames.running') : t('extractFrames.submit')}
          </button>
        </form>
      )}
    />
  );
};

export default ExtractFramesPanel;
