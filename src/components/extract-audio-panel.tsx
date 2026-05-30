import React, { useState } from 'react';
import { Music } from 'lucide-react';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import type { ExtractAudioPresets } from '@/components/embedded-tool-panel';
import useSpecializedMediaTool from '@/lib/useSpecializedMediaTool';
import SpecializedToolShell from '@/components/specialized-tool-shell';
import { useLocalization } from '@/i18n/useLocalization';

const FORMAT_VALUES = ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg'] as const;
type ExtractAudioFormat = typeof FORMAT_VALUES[number];

const ExtractAudioPanel: React.FC<{ presets?: ExtractAudioPresets }> = ({ presets }) => {
  const { t } = useLocalization('interface');
  // A locked format wins over a default; the visible select is disabled but the
  // submitted format always reflects the lock.
  const lockedFormat = presets?.lockedFormat;
  const [format, setFormat] = useState<ExtractAudioFormat>(
    lockedFormat ?? presets?.defaultFormat ?? 'mp3',
  );
  const submitFormat = lockedFormat ?? format;
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
      accept={presets?.accept ?? 'video/*'}
      uploadHint={t('extractAudio.uploadHint')}
      conversionJob={conversionJob}
      setConversionJob={setConversionJob}
      isUploading={isPending}
      uploadProgress={uploadProgress}
      outputExtensionHint={submitFormat}
      renderForm={({ file, isProcessing }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate({
              file,
              options: { mode: 'extract_audio', format: submitFormat },
            });
          }}
          className="space-y-4"
        >
          {presets?.expectedInput && (
            <p className="text-xs text-muted-foreground">
              {t('extractAudio.expectedInput', { format: presets.expectedInput.toUpperCase() })}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">{t('extractAudio.formatLabel')}</label>
            <select
              value={submitFormat}
              onChange={(e) => setFormat(e.target.value as ExtractAudioFormat)}
              disabled={Boolean(lockedFormat)}
              aria-disabled={Boolean(lockedFormat)}
              className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {FORMAT_VALUES.map((value) => (
                <option key={value} value={value}>{t(`extractAudio.formats.${value}`)}</option>
              ))}
            </select>
            {lockedFormat && (
              <span className="mt-1 inline-flex items-center gap-1 rounded bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                {t('extractAudio.outputLocked', { format: lockedFormat.toUpperCase() })}
              </span>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {t('extractAudio.note')}
            </p>
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Music className="w-4 h-4" />
            {isProcessing ? t('extractAudio.running') : t('extractAudio.submit')}
          </button>
        </form>
      )}
    />
  );
};

export default ExtractAudioPanel;
