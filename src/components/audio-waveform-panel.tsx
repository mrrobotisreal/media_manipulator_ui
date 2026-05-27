import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Sparkles, Waves } from 'lucide-react';
import { Trans } from 'react-i18next';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import useSpecializedMediaTool from '@/lib/useSpecializedMediaTool';
import SpecializedToolShell from '@/components/specialized-tool-shell';
import { useLocalization } from '@/i18n/useLocalization';

/**
 * AudioWaveformPanel renders the audio-waveform generator. Defaults bias
 * toward the most-requested creator workflow: a wide (10:1) MP4 waveform
 * video that drops cleanly into editors and social previews. Advanced
 * controls (mode previews, split channels, custom colors, scale/draw) live
 * in a collapsed section so the basic flow stays approachable.
 */

type OutputSelection = 'video' | 'image' | 'both';

// Size qualifier keys map to localized words ("small", "medium", …). The
// dimensions themselves are universal and rendered numerically, so only the
// qualifier is translated at render time.
type SizeQualifier = 'small' | 'medium' | 'large' | 'xl';

interface AspectRatioPreset {
  id: string;
  sizes: { id: string; width: number; height: number; qualifier: SizeQualifier }[];
}

const PRESETS: AspectRatioPreset[] = [
  {
    id: '10x1',
    sizes: [
      { id: 'small-10x1', width: 1000, height: 100, qualifier: 'small' },
      { id: 'medium-10x1', width: 1600, height: 160, qualifier: 'medium' },
      { id: 'large-10x1', width: 2400, height: 240, qualifier: 'large' },
      { id: 'xl-10x1', width: 3840, height: 384, qualifier: 'xl' },
    ],
  },
  {
    id: '8x1',
    sizes: [
      { id: 'small-8x1', width: 1024, height: 128, qualifier: 'small' },
      { id: 'medium-8x1', width: 1600, height: 200, qualifier: 'medium' },
      { id: 'large-8x1', width: 2400, height: 300, qualifier: 'large' },
      { id: 'xl-8x1', width: 3200, height: 400, qualifier: 'xl' },
    ],
  },
  {
    id: '6x1',
    sizes: [
      { id: 'small-6x1', width: 960, height: 160, qualifier: 'small' },
      { id: 'medium-6x1', width: 1440, height: 240, qualifier: 'medium' },
      { id: 'large-6x1', width: 2160, height: 360, qualifier: 'large' },
      { id: 'xl-6x1', width: 2880, height: 480, qualifier: 'xl' },
    ],
  },
  {
    id: '16x9',
    sizes: [
      { id: 'small-16x9', width: 1280, height: 720, qualifier: 'small' },
      { id: 'medium-16x9', width: 1920, height: 1080, qualifier: 'medium' },
      { id: 'large-16x9', width: 2560, height: 1440, qualifier: 'large' },
      { id: 'xl-16x9', width: 3840, height: 2160, qualifier: 'xl' },
    ],
  },
  {
    id: '1x1',
    sizes: [
      { id: 'small-1x1', width: 720, height: 720, qualifier: 'small' },
      { id: 'medium-1x1', width: 1080, height: 1080, qualifier: 'medium' },
      { id: 'large-1x1', width: 1440, height: 1440, qualifier: 'large' },
      { id: 'xl-1x1', width: 2160, height: 2160, qualifier: 'xl' },
    ],
  },
];

const MODE_OPTIONS: { value: 'point' | 'line' | 'p2p' | 'cline'; preview: string }[] = [
  { value: 'point', preview: '· · · · · · · ·' },
  { value: 'line', preview: '| | | | | | | |' },
  { value: 'p2p', preview: '·—·—·—·—·—·—·—·' },
  { value: 'cline', preview: '╎╎╎╎╎╎╎╎' },
];

const FPS_PRESETS = [15, 24, 25, 30, 60];

const AudioWaveformPanel: React.FC = () => {
  const { t } = useLocalization('interface');
  const [outputSelection, setOutputSelection] = useState<OutputSelection>('video');
  const [videoFormat, setVideoFormat] = useState<'mp4' | 'webm'>('mp4');
  const [imageFormat, setImageFormat] = useState<'png' | 'webp'>('png');
  const [presetId, setPresetId] = useState<string>('medium-10x1');
  const [customSize, setCustomSize] = useState(false);
  const [width, setWidth] = useState<number>(1600);
  const [height, setHeight] = useState<number>(160);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [mode, setMode] = useState<'point' | 'line' | 'p2p' | 'cline'>('point');
  const [rateMode, setRateMode] = useState<'rate' | 'n'>('rate');
  const [rate, setRate] = useState<number>(25);
  const [n, setN] = useState<number>(0);
  const [splitChannels, setSplitChannels] = useState(false);
  const [colorPrimary, setColorPrimary] = useState('#22D3EE');
  const [colorSecondary, setColorSecondary] = useState('#A855F7');
  const [scale, setScale] = useState<'lin' | 'log' | 'sqrt' | 'cbrt'>('lin');
  const [draw, setDraw] = useState<'scale' | 'full'>('scale');
  // Default to true so the waveform video plays in sync with the source audio
  // out of the box — that's the most useful artifact for creators (audiograms,
  // music previews, podcast clips). Toggling off produces a silent waveform.
  const [includeAudio, setIncludeAudio] = useState<boolean>(true);

  const [conversionJob, setConversionJob] = useState<ConversionJob | null>(null);
  const { mutate, isPending, uploadProgress } = useSpecializedMediaTool((res) => {
    setConversionJob({
      id: res.jobId,
      status: 'processing',
      originalFile: new File([], 'temp'),
      progress: 0,
    });
  });

  const resolvedSize = React.useMemo(() => {
    if (customSize) return { width, height };
    for (const preset of PRESETS) {
      const found = preset.sizes.find((s) => s.id === presetId);
      if (found) return { width: found.width, height: found.height };
    }
    return { width: 1600, height: 160 };
  }, [customSize, presetId, width, height]);

  const buildAndSubmit = (file: File) => {
    const waveform: Record<string, unknown> = {
      outputSelection,
      videoFormat,
      imageFormat,
      width: resolvedSize.width,
      height: resolvedSize.height,
      mode,
      splitChannels,
      colorPrimary,
      colorSecondary,
      scale,
      draw,
      // Only relevant when a video is in the output set; the backend ignores
      // the field for image-only runs.
      includeAudio: outputSelection !== 'image' ? includeAudio : false,
    };
    if (rateMode === 'rate') {
      waveform.rate = rate;
    } else if (n > 0) {
      waveform.n = n;
    }
    mutate({
      file,
      options: { mode: 'audio_waveform', waveform },
    });
  };

  const ext = outputSelection === 'both' ? 'zip' : outputSelection === 'image' ? imageFormat : videoFormat;
  // Map the user's output selection to the kind the preview modal should
  // render: a playable video (video, or "both" when previewing the video
  // half doesn't apply — we fall back to the ZIP message), a still image,
  // or a zip-no-preview placeholder.
  const finalMediaKind: 'video' | 'image' | 'zip' =
    outputSelection === 'video' ? 'video' : outputSelection === 'image' ? 'image' : 'zip';

  return (
    <SpecializedToolShell
      accept="audio/*"
      uploadHint={t('audioWaveformPanel.uploadHint')}
      conversionJob={conversionJob}
      setConversionJob={setConversionJob}
      isUploading={isPending}
      uploadProgress={uploadProgress}
      outputExtensionHint={ext}
      previewConfig={{
        originalMediaKind: 'audio',
        finalMediaKind,
        title: t('audioWaveformPanel.previewTitle'),
      }}
      renderForm={({ file, isProcessing }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            buildAndSubmit(file);
          }}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">{t('audioWaveformPanel.output')}</label>
            <div className="grid sm:grid-cols-3 gap-2">
              {(['video', 'image', 'both'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setOutputSelection(opt)}
                  className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                    outputSelection === opt
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-background text-card-foreground border-input hover:bg-muted'
                  }`}
                >
                  {t(`audioWaveformPanel.outputOptions.${opt}`)}
                </button>
              ))}
            </div>
            {outputSelection === 'both' && (
              <p className="text-xs text-muted-foreground mt-1">
                {t('audioWaveformPanel.bothNote')}
              </p>
            )}
          </div>

          {(outputSelection === 'video' || outputSelection === 'both') && (
            <label className="flex items-start gap-3 rounded-lg border border-border bg-background/40 p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAudio}
                onChange={(e) => setIncludeAudio(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm">
                <span className="font-medium text-card-foreground">{t('audioWaveformPanel.includeAudio')}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  {t('audioWaveformPanel.includeAudioNote')}
                </span>
              </span>
            </label>
          )}

          <div className="grid sm:grid-cols-2 gap-3">
            {(outputSelection === 'video' || outputSelection === 'both') && (
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">{t('audioWaveformPanel.videoFormat')}</label>
                <select
                  value={videoFormat}
                  onChange={(e) => setVideoFormat(e.target.value as 'mp4' | 'webm')}
                  className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                >
                  <option value="mp4">{t('audioWaveformPanel.videoFormats.mp4')}</option>
                  <option value="webm">{t('audioWaveformPanel.videoFormats.webm')}</option>
                </select>
              </div>
            )}
            {(outputSelection === 'image' || outputSelection === 'both') && (
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">{t('audioWaveformPanel.imageFormat')}</label>
                <select
                  value={imageFormat}
                  onChange={(e) => setImageFormat(e.target.value as 'png' | 'webp')}
                  className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                >
                  <option value="png">{t('audioWaveformPanel.imageFormats.png')}</option>
                  <option value="webp">{t('audioWaveformPanel.imageFormats.webp')}</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">{t('audioWaveformPanel.aspectRatioSize')}</label>
            <select
              value={presetId}
              disabled={customSize}
              onChange={(e) => setPresetId(e.target.value)}
              className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground disabled:opacity-60"
            >
              {PRESETS.map((preset) => (
                <optgroup key={preset.id} label={t(`audioWaveformPanel.presets.${preset.id}`)}>
                  {preset.sizes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {t('audioWaveformPanel.sizeLabel', { width: s.width, height: s.height, qualifier: t(`audioWaveformPanel.sizeQualifiers.${s.qualifier}`) })}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <label className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={customSize} onChange={(e) => setCustomSize(e.target.checked)} />
              {t('audioWaveformPanel.useCustomSize')}
            </label>
            {customSize && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="number"
                  min={64}
                  max={7680}
                  value={width}
                  onChange={(e) => setWidth(Math.max(64, Math.min(7680, Number(e.target.value) || 0)))}
                  className="p-2 border border-input rounded-lg bg-input text-card-foreground"
                  placeholder={t('audioWaveformPanel.widthPlaceholder')}
                />
                <input
                  type="number"
                  min={64}
                  max={7680}
                  value={height}
                  onChange={(e) => setHeight(Math.max(64, Math.min(7680, Number(e.target.value) || 0)))}
                  className="p-2 border border-input rounded-lg bg-input text-card-foreground"
                  placeholder={t('audioWaveformPanel.heightPlaceholder')}
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-card-foreground"
          >
            {advancedOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {t('audioWaveformPanel.advancedSettings')}
          </button>

          {advancedOpen && (
            <div className="space-y-4 border border-border rounded-lg p-4 bg-background/40">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">{t('audioWaveformPanel.renderMode')}</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {MODE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setMode(opt.value)}
                      className={`text-left rounded-lg border p-3 transition-colors ${
                        mode === opt.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40'
                          : 'border-input hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-medium text-card-foreground">
                        <Waves className="w-4 h-4 text-blue-600" />
                        {t(`audioWaveformPanel.modes.${opt.value}.label`)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{t(`audioWaveformPanel.modes.${opt.value}.description`)}</p>
                      <pre className="mt-2 text-xs font-mono text-card-foreground/80 select-none">{opt.preview}</pre>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t('audioWaveformPanel.renderModeNote')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">{t('audioWaveformPanel.frameRate')}</label>
                <div className="flex items-center gap-2">
                  <select
                    value={rateMode}
                    onChange={(e) => setRateMode(e.target.value as 'rate' | 'n')}
                    className="p-2 border border-input rounded-lg bg-input text-card-foreground"
                  >
                    <option value="rate">{t('audioWaveformPanel.useFrameRate')}</option>
                    <option value="n">{t('audioWaveformPanel.useSamples')}</option>
                  </select>
                  {rateMode === 'rate' ? (
                    <select
                      value={String(rate)}
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="p-2 border border-input rounded-lg bg-input text-card-foreground"
                    >
                      {FPS_PRESETS.map((f) => (
                        <option key={f} value={String(f)}>{f === 25 ? t('audioWaveformPanel.fpsDefaultOption', { fps: f }) : t('audioWaveformPanel.fpsOption', { fps: f })}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      min={1}
                      max={1024}
                      value={n}
                      onChange={(e) => setN(Math.max(0, Math.min(1024, Number(e.target.value) || 0)))}
                      placeholder={t('audioWaveformPanel.samplesPlaceholder')}
                      className="p-2 border border-input rounded-lg bg-input text-card-foreground w-32"
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <Trans i18nKey="interface:audioWaveformPanel.frameRateNote" components={{ em: <em /> }} />
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm text-card-foreground">
                <input type="checkbox" checked={splitChannels} onChange={(e) => setSplitChannels(e.target.checked)} />
                {t('audioWaveformPanel.splitChannels')}
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">{t('audioWaveformPanel.primaryColor')}</label>
                  <input
                    type="color"
                    value={colorPrimary}
                    onChange={(e) => setColorPrimary(e.target.value)}
                    className="h-10 w-full p-1 border border-input rounded-lg bg-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">{t('audioWaveformPanel.secondaryColor')}</label>
                  <input
                    type="color"
                    value={colorSecondary}
                    onChange={(e) => setColorSecondary(e.target.value)}
                    className="h-10 w-full p-1 border border-input rounded-lg bg-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">{t('audioWaveformPanel.scale')}</label>
                  <select
                    value={scale}
                    onChange={(e) => setScale(e.target.value as typeof scale)}
                    className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                  >
                    <option value="lin">{t('audioWaveformPanel.scaleOptions.lin')}</option>
                    <option value="log">{t('audioWaveformPanel.scaleOptions.log')}</option>
                    <option value="sqrt">{t('audioWaveformPanel.scaleOptions.sqrt')}</option>
                    <option value="cbrt">{t('audioWaveformPanel.scaleOptions.cbrt')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">{t('audioWaveformPanel.draw')}</label>
                  <select
                    value={draw}
                    onChange={(e) => setDraw(e.target.value as typeof draw)}
                    className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                  >
                    <option value="scale">{t('audioWaveformPanel.drawOptions.scale')}</option>
                    <option value="full">{t('audioWaveformPanel.drawOptions.full')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            // disabled={isProcessing}
            disabled={true}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {!isProcessing && (
              <div className="atom-loader mr-4">
                <div className="atom-loader-orbits">
                  <div className="atom-loader-orbits__electron"></div>
                  <div className="atom-loader-orbits__electron"></div>
                  <div className="atom-loader-orbits__electron"></div>
                </div>
              </div>
            )}
            {isProcessing ? <Sparkles className="w-4 h-4" /> : null}
            {!isProcessing ? t('audioWaveformPanel.generating') : t('audioWaveformPanel.generate')}
          </button>
        </form>
      )}
    />
  );
};

export default AudioWaveformPanel;
