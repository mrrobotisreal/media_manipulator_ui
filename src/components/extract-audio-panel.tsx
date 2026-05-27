import React, { useState } from 'react';
import { Music } from 'lucide-react';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import useSpecializedMediaTool from '@/lib/useSpecializedMediaTool';
import SpecializedToolShell from '@/components/specialized-tool-shell';
import { useLocalization } from '@/i18n/useLocalization';

const FORMAT_VALUES = ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg'] as const;

const ExtractAudioPanel: React.FC = () => {
  const { t } = useLocalization('interface');
  const [format, setFormat] = useState<typeof FORMAT_VALUES[number]>('mp3');
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
      uploadHint={t('extractAudio.uploadHint')}
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
            <label className="block text-sm font-medium text-card-foreground mb-1">{t('extractAudio.formatLabel')}</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as typeof format)}
              className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
            >
              {FORMAT_VALUES.map((value) => (
                <option key={value} value={value}>{t(`extractAudio.formats.${value}`)}</option>
              ))}
            </select>
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
