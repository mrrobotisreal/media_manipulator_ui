import React, { useState } from 'react';
import { VideoOff } from 'lucide-react';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import useSpecializedMediaTool from '@/lib/useSpecializedMediaTool';
import SpecializedToolShell from '@/components/specialized-tool-shell';
import { useLocalization } from '@/i18n/useLocalization';

const ExtractVideoOnlyPanel: React.FC = () => {
  const { t } = useLocalization('interface');
  const [format, setFormat] = useState<'mp4' | 'webm'>('mp4');
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
      uploadHint={t('extractVideoOnly.uploadHint')}
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
              options: { mode: 'extract_video_only', format },
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">{t('extractVideoOnly.formatLabel')}</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'mp4' | 'webm')}
              className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
            >
              <option value="mp4">{t('extractVideoOnly.formats.mp4')}</option>
              <option value="webm">{t('extractVideoOnly.formats.webm')}</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              {t('extractVideoOnly.note')}
            </p>
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <VideoOff className="w-4 h-4" />
            {isProcessing ? t('extractVideoOnly.running') : t('extractVideoOnly.submit')}
          </button>
        </form>
      )}
    />
  );
};

export default ExtractVideoOnlyPanel;
