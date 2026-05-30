import React, { useState } from 'react';
import { Crop, Maximize2, RotateCw } from 'lucide-react';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import type { VideoTransformPresets, EmbeddedVideoFormat } from '@/components/embedded-tool-panel';
import type { ConversionFormData } from '@/schemas/types';
import useConvertFile from '@/lib/useConvertFile';
import SpecializedToolShell from '@/components/specialized-tool-shell';
import { useLocalization } from '@/i18n/useLocalization';

const FORMATS: EmbeddedVideoFormat[] = ['mp4', 'webm', 'mov', 'mkv'];
const ROTATIONS = [90, 180, 270] as const;

/**
 * VideoTransformPanel is the focused UI for /tools/crop-video,
 * /tools/resize-video, and /tools/rotate-video. It runs the standard
 * video-conversion engine (useConvertFile) but surfaces only the control the
 * page is about (driven by presets.emphasis), sending the matching
 * transform/width/height payload.
 */
const VideoTransformPanel: React.FC<{ presets: VideoTransformPresets }> = ({ presets }) => {
  const { t } = useLocalization('interface');
  const emphasis = presets.emphasis;
  const lockedFormat = presets.lockedOutputFormat;

  const [format, setFormat] = useState<EmbeddedVideoFormat>(lockedFormat ?? presets.defaultOutputFormat ?? 'mp4');
  // Resize state
  const [width, setWidth] = useState<number | ''>(presets.defaultWidth ?? '');
  const [height, setHeight] = useState<number | ''>(presets.defaultHeight ?? '');
  const [preserveAspect, setPreserveAspect] = useState(true);
  // Rotate state
  const [rotation, setRotation] = useState<number>(presets.defaultRotation ?? 90);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  // Crop state
  const [cropX, setCropX] = useState<number>(presets.defaultCrop?.x ?? 0);
  const [cropY, setCropY] = useState<number>(presets.defaultCrop?.y ?? 0);
  const [cropW, setCropW] = useState<number | ''>(presets.defaultCrop?.width ?? '');
  const [cropH, setCropH] = useState<number | ''>(presets.defaultCrop?.height ?? '');

  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const submitFormat = lockedFormat ?? format;
  const { mutate, isPending, uploadProgress } = useConvertFile((res) => {
    setConversionJob({
      id: res.jobId,
      status: 'processing',
      originalFile: new File([], 'temp'),
      progress: 0,
    });
  });

  const cropValid = emphasis !== 'crop' || (typeof cropW === 'number' && cropW > 0 && typeof cropH === 'number' && cropH > 0);
  const resizeValid = emphasis !== 'resize' || (typeof width === 'number' && width > 0) || (typeof height === 'number' && height > 0);
  const valid = cropValid && resizeValid;

  const buildOptions = (): ConversionFormData => {
    const options: Record<string, unknown> = {
      format: submitFormat,
      quality: 'medium',
      speed: 1,
      preserveAspectRatio: emphasis === 'resize' ? preserveAspect : true,
    };
    if (emphasis === 'resize') {
      if (typeof width === 'number') options.width = width;
      if (typeof height === 'number') options.height = height;
    } else if (emphasis === 'rotate') {
      options.transform = { rotation, flipHorizontal: flipH, flipVertical: flipV };
    } else if (emphasis === 'crop') {
      options.transform = {
        crop: { x: cropX, y: cropY, width: Number(cropW), height: Number(cropH) },
      };
    }
    return options as unknown as ConversionFormData;
  };

  const icon = emphasis === 'crop' ? <Crop className="w-4 h-4" /> : emphasis === 'rotate' ? <RotateCw className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />;

  return (
    <SpecializedToolShell
      accept="video/*"
      uploadHint={t('videoTransform.uploadHint')}
      conversionJob={conversionJob}
      setConversionJob={setConversionJob}
      isUploading={isPending}
      uploadProgress={uploadProgress}
      outputExtensionHint={submitFormat}
      previewConfig={{ originalMediaKind: 'video', finalMediaKind: 'video' }}
      renderForm={({ file, isProcessing }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!valid) return;
            mutate({ file, options: buildOptions() });
          }}
          className="space-y-4"
        >
          {presets.expectedInput && (
            <p className="text-xs text-muted-foreground">
              {t('videoTransform.expectedInput', { format: presets.expectedInput.toUpperCase() })}
            </p>
          )}

          {emphasis === 'resize' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoTransform.widthLabel')}</label>
                  <input
                    type="number"
                    min="1"
                    max="4096"
                    placeholder={t('videoTransform.autoPlaceholder')}
                    value={width}
                    onChange={(e) => setWidth(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoTransform.heightLabel')}</label>
                  <input
                    type="number"
                    min="1"
                    max="4096"
                    placeholder={t('videoTransform.autoPlaceholder')}
                    value={height}
                    onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-card-foreground">
                <input
                  type="checkbox"
                  checked={preserveAspect}
                  onChange={(e) => setPreserveAspect(e.target.checked)}
                  className="rounded border-input bg-input focus:ring-2 focus:ring-ring"
                />
                {t('videoTransform.preserveAspect')}
              </label>
              <p className="text-xs text-muted-foreground">{t('videoTransform.resizeNote')}</p>
            </>
          )}

          {emphasis === 'rotate' && (
            <>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoTransform.rotationLabel')}</label>
                <select
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                >
                  {ROTATIONS.map((r) => (
                    <option key={r} value={r}>{t(`videoTransform.rotations.${r}`)}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-card-foreground">
                  <input type="checkbox" checked={flipH} onChange={(e) => setFlipH(e.target.checked)} className="rounded border-input bg-input focus:ring-2 focus:ring-ring" />
                  {t('videoTransform.flipH')}
                </label>
                <label className="flex items-center gap-2 text-sm text-card-foreground">
                  <input type="checkbox" checked={flipV} onChange={(e) => setFlipV(e.target.checked)} className="rounded border-input bg-input focus:ring-2 focus:ring-ring" />
                  {t('videoTransform.flipV')}
                </label>
              </div>
              <p className="text-xs text-muted-foreground">{t('videoTransform.rotateNote')}</p>
            </>
          )}

          {emphasis === 'crop' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoTransform.cropX')}</label>
                  <input type="number" min="0" value={cropX} onChange={(e) => setCropX(Math.max(0, Number(e.target.value) || 0))} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoTransform.cropY')}</label>
                  <input type="number" min="0" value={cropY} onChange={(e) => setCropY(Math.max(0, Number(e.target.value) || 0))} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoTransform.cropW')}</label>
                  <input type="number" min="1" value={cropW} onChange={(e) => setCropW(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoTransform.cropH')}</label>
                  <input type="number" min="1" value={cropH} onChange={(e) => setCropH(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{t('videoTransform.cropNote')}</p>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">{t('videoTransform.formatLabel')}</label>
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
                {t('videoTransform.outputLocked', { format: lockedFormat.toUpperCase() })}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isProcessing || !valid}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {icon}
            {isProcessing ? t('videoTransform.running') : t(`videoTransform.submit.${emphasis}`)}
          </button>
        </form>
      )}
    />
  );
};

export default VideoTransformPanel;
