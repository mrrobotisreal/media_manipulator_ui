'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Scissors } from 'lucide-react';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import type { VideoTrimmerPresets, EmbeddedVideoFormat } from '@/components/embedded-tool-panel';
import useSpecializedMediaTool, { type SpecializedToolOptions } from '@/lib/useSpecializedMediaTool';
import SpecializedToolShell from '@/components/specialized-tool-shell';
import MediaTrimModal from '@/components/media-trim-modal';
import { useLocalization } from '@/i18n/useLocalization';

const FORMATS: EmbeddedVideoFormat[] = ['mp4', 'mov', 'webm'];

/**
 * VideoTrimmerPanel is the focused UI for /tools/video-trimmer,
 * /tools/mp4-trimmer, /tools/video-cutter, and /tools/cut-video-online. It
 * posts the quality-preserving `trim_video` specialized mode (stream-copy when
 * possible) with a start/end range the user picks numerically or via the
 * visual MediaTrimModal scrubber.
 */
const VideoTrimmerPanel: React.FC<{ presets?: VideoTrimmerPresets }> = ({ presets }) => {
  const { t } = useLocalization('interface');
  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const { mutate, isPending, uploadProgress } = useSpecializedMediaTool((res) => {
    setConversionJob({
      id: res.jobId,
      status: 'processing',
      originalFile: new File([], 'temp'),
      progress: 0,
    });
  });

  const lockedFormat = presets?.lockedOutputFormat;

  return (
    <SpecializedToolShell
      accept="video/*"
      uploadHint={t('videoTrimmer.uploadHint')}
      conversionJob={conversionJob}
      setConversionJob={setConversionJob}
      isUploading={isPending}
      uploadProgress={uploadProgress}
      outputExtensionHint={lockedFormat ?? presets?.defaultOutputFormat ?? 'mp4'}
      previewConfig={{ originalMediaKind: 'video', finalMediaKind: 'video' }}
      renderForm={({ file, isProcessing }) => (
        <TrimFields
          file={file}
          isProcessing={isProcessing}
          presets={presets}
          onRun={(options) => mutate({ file, options })}
        />
      )}
    />
  );
};

// TrimFields owns the per-file state (start/end/format/copyMode + the visual
// scrubber's object URL) so the URL is created and revoked with the file's
// lifecycle. It is split out from the panel because the shell only exposes the
// chosen file inside renderForm.
const TrimFields: React.FC<{
  file: File;
  isProcessing: boolean;
  presets?: VideoTrimmerPresets;
  onRun: (options: SpecializedToolOptions) => void;
}> = ({ file, isProcessing, presets, onRun }) => {
  const { t, formatDuration } = useLocalization('interface');
  const lockedFormat = presets?.lockedOutputFormat;
  const [format, setFormat] = useState<EmbeddedVideoFormat>(lockedFormat ?? presets?.defaultOutputFormat ?? 'mp4');
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [reencode, setReencode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const initializedEnd = useRef(false);

  // One object URL per file, revoked on change/unmount. Powers both the visual
  // scrubber modal and the hidden metadata probe that seeds the end time.
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    initializedEnd.current = false;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const submitFormat = lockedFormat ?? format;
  const duration = end - start;
  const valid = end > start && start >= 0 && duration >= 0.1;
  const isCut = presets?.intent === 'cut';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        onRun({
          mode: 'trim_video',
          format: submitFormat,
          startTime: start,
          endTime: end,
          copyMode: reencode ? 'reencode' : 'auto',
        });
      }}
      className="space-y-4"
    >
      {presets?.expectedInput && (
        <p className="text-xs text-muted-foreground">
          {t('videoTrimmer.expectedInput', { format: presets.expectedInput.toUpperCase() })}
        </p>
      )}

      {/* Hidden metadata probe — seeds the end time to the clip's full length so
          the user can immediately tweak the range. */}
      {mediaUrl && (
        <video
          src={mediaUrl}
          preload="metadata"
          className="hidden"
          onLoadedMetadata={(e) => {
            if (initializedEnd.current) return;
            const d = (e.target as HTMLVideoElement).duration;
            if (Number.isFinite(d) && d > 0) {
              setEnd(d);
              initializedEnd.current = true;
            }
          }}
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoTrimmer.startLabel')}</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={start}
            onChange={(e) => setStart(Math.max(0, Number(e.target.value) || 0))}
            className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoTrimmer.endLabel')}</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={end}
            onChange={(e) => setEnd(Math.max(0, Number(e.target.value) || 0))}
            className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {valid
            ? t('videoTrimmer.durationLabel', { duration: formatDuration(duration) })
            : t('videoTrimmer.invalidRange')}
        </p>
        {mediaUrl && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 text-sm rounded-md border border-input bg-input text-card-foreground hover:bg-muted flex items-center gap-2"
          >
            <Scissors className="w-4 h-4" />
            {t('videoTrimmer.pickRange')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoTrimmer.formatLabel')}</label>
          <select
            value={submitFormat}
            onChange={(e) => setFormat(e.target.value as EmbeddedVideoFormat)}
            disabled={Boolean(lockedFormat)}
            aria-disabled={Boolean(lockedFormat)}
            className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>{f.toUpperCase()}</option>
            ))}
          </select>
          {lockedFormat && (
            <span className="mt-1 inline-flex items-center gap-1 rounded bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
              {t('videoTrimmer.outputLocked', { format: lockedFormat.toUpperCase() })}
            </span>
          )}
        </div>
        <label className="flex items-end gap-2 text-sm text-card-foreground pb-2">
          <input
            type="checkbox"
            checked={reencode}
            onChange={(e) => setReencode(e.target.checked)}
            className="rounded border-input bg-input focus:ring-2 focus:ring-ring"
          />
          {t('videoTrimmer.reencodeLabel')}
        </label>
      </div>

      <p className="text-xs text-muted-foreground">
        {reencode ? t('videoTrimmer.reencodeHint') : t('videoTrimmer.note')}
      </p>

      <button
        type="submit"
        disabled={isProcessing || !valid}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <Scissors className="w-4 h-4" />
        {isProcessing
          ? t('videoTrimmer.running')
          : isCut
            ? t('videoTrimmer.submitCut')
            : t('videoTrimmer.submit')}
      </button>

      {mediaUrl && (
        <MediaTrimModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          mediaUrl={mediaUrl}
          mediaType="video"
          initialTrim={valid ? { startTime: start, endTime: end } : undefined}
          onTrimSave={(range) => {
            setStart(range.startTime);
            setEnd(range.endTime);
            initializedEnd.current = true;
          }}
        />
      )}
    </form>
  );
};

export default VideoTrimmerPanel;
