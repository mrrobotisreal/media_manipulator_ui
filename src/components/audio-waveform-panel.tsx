import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Sparkles, Waves } from 'lucide-react';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import useSpecializedMediaTool from '@/lib/useSpecializedMediaTool';
import SpecializedToolShell from '@/components/specialized-tool-shell';

/**
 * AudioWaveformPanel renders the audio-waveform generator. Defaults bias
 * toward the most-requested creator workflow: a wide (10:1) MP4 waveform
 * video that drops cleanly into editors and social previews. Advanced
 * controls (mode previews, split channels, custom colors, scale/draw) live
 * in a collapsed section so the basic flow stays approachable.
 */

type OutputSelection = 'video' | 'image' | 'both';

interface AspectRatioPreset {
  id: string;
  label: string;
  description?: string;
  sizes: { id: string; label: string; width: number; height: number }[];
}

const PRESETS: AspectRatioPreset[] = [
  {
    id: '10x1',
    label: '10:1 — Wide waveform (recommended)',
    description: 'Classic wide-strip look — great for podcasts, music previews, and editing timelines.',
    sizes: [
      { id: 'small-10x1', label: '1000×100 (small)', width: 1000, height: 100 },
      { id: 'medium-10x1', label: '1600×160 (medium)', width: 1600, height: 160 },
      { id: 'large-10x1', label: '2400×240 (large)', width: 2400, height: 240 },
      { id: 'xl-10x1', label: '3840×384 (extra large)', width: 3840, height: 384 },
    ],
  },
  {
    id: '8x1',
    label: '8:1 — Wide waveform',
    sizes: [
      { id: 'small-8x1', label: '1024×128 (small)', width: 1024, height: 128 },
      { id: 'medium-8x1', label: '1600×200 (medium)', width: 1600, height: 200 },
      { id: 'large-8x1', label: '2400×300 (large)', width: 2400, height: 300 },
      { id: 'xl-8x1', label: '3200×400 (extra large)', width: 3200, height: 400 },
    ],
  },
  {
    id: '6x1',
    label: '6:1 — Balanced wide waveform',
    sizes: [
      { id: 'small-6x1', label: '960×160 (small)', width: 960, height: 160 },
      { id: 'medium-6x1', label: '1440×240 (medium)', width: 1440, height: 240 },
      { id: 'large-6x1', label: '2160×360 (large)', width: 2160, height: 360 },
      { id: 'xl-6x1', label: '2880×480 (extra large)', width: 2880, height: 480 },
    ],
  },
  {
    id: '16x9',
    label: '16:9 — Standard video / social preview',
    sizes: [
      { id: 'small-16x9', label: '1280×720 (small)', width: 1280, height: 720 },
      { id: 'medium-16x9', label: '1920×1080 (medium)', width: 1920, height: 1080 },
      { id: 'large-16x9', label: '2560×1440 (large)', width: 2560, height: 1440 },
      { id: 'xl-16x9', label: '3840×2160 (extra large)', width: 3840, height: 2160 },
    ],
  },
  {
    id: '1x1',
    label: '1:1 — Square social preview',
    sizes: [
      { id: 'small-1x1', label: '720×720 (small)', width: 720, height: 720 },
      { id: 'medium-1x1', label: '1080×1080 (medium)', width: 1080, height: 1080 },
      { id: 'large-1x1', label: '1440×1440 (large)', width: 1440, height: 1440 },
      { id: 'xl-1x1', label: '2160×2160 (extra large)', width: 2160, height: 2160 },
    ],
  },
];

const MODE_OPTIONS: { value: 'point' | 'line' | 'p2p' | 'cline'; label: string; description: string; preview: string }[] = [
  {
    value: 'point',
    label: 'Point',
    description: 'A single dot per sample — clean and minimal.',
    preview: '· · · · · · · ·',
  },
  {
    value: 'line',
    label: 'Line',
    description: 'A vertical bar per sample — bolder presence.',
    preview: '| | | | | | | |',
  },
  {
    value: 'p2p',
    label: 'Point to point',
    description: 'A dot per sample plus connecting lines — flowing look.',
    preview: '·—·—·—·—·—·—·—·',
  },
  {
    value: 'cline',
    label: 'Centered line',
    description: 'Vertical line centered on the axis — symmetrical look.',
    preview: '╎╎╎╎╎╎╎╎',
  },
];

const FPS_PRESETS = [15, 24, 25, 30, 60];

const AudioWaveformPanel: React.FC = () => {
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

  return (
    <SpecializedToolShell
      accept="audio/*"
      uploadHint="audio file"
      conversionJob={conversionJob}
      setConversionJob={setConversionJob}
      isUploading={isPending}
      uploadProgress={uploadProgress}
      outputExtensionHint={ext}
      renderForm={({ file, isProcessing }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            buildAndSubmit(file);
          }}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">Output</label>
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
                  {opt === 'video' ? 'Waveform video' : opt === 'image' ? 'Waveform image' : 'Both (ZIP)'}
                </button>
              ))}
            </div>
            {outputSelection === 'both' && (
              <p className="text-xs text-muted-foreground mt-1">
                Both outputs will be packaged into a single .zip you can download in one click.
              </p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {(outputSelection === 'video' || outputSelection === 'both') && (
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Video format</label>
                <select
                  value={videoFormat}
                  onChange={(e) => setVideoFormat(e.target.value as 'mp4' | 'webm')}
                  className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                >
                  <option value="mp4">MP4 (recommended)</option>
                  <option value="webm">WebM</option>
                </select>
              </div>
            )}
            {(outputSelection === 'image' || outputSelection === 'both') && (
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Image format</label>
                <select
                  value={imageFormat}
                  onChange={(e) => setImageFormat(e.target.value as 'png' | 'webp')}
                  className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                >
                  <option value="png">PNG (recommended)</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-1">Aspect ratio &amp; size</label>
            <select
              value={presetId}
              disabled={customSize}
              onChange={(e) => setPresetId(e.target.value)}
              className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground disabled:opacity-60"
            >
              {PRESETS.map((preset) => (
                <optgroup key={preset.id} label={preset.label}>
                  {preset.sizes.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <label className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={customSize} onChange={(e) => setCustomSize(e.target.checked)} />
              Use custom width / height
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
                  placeholder="Width"
                />
                <input
                  type="number"
                  min={64}
                  max={7680}
                  value={height}
                  onChange={(e) => setHeight(Math.max(64, Math.min(7680, Number(e.target.value) || 0)))}
                  className="p-2 border border-input rounded-lg bg-input text-card-foreground"
                  placeholder="Height"
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
            Advanced waveform settings
          </button>

          {advancedOpen && (
            <div className="space-y-4 border border-border rounded-lg p-4 bg-background/40">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">Render mode</label>
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
                        {opt.label}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
                      <pre className="mt-2 text-xs font-mono text-card-foreground/80 select-none">{opt.preview}</pre>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Render mode applies to the waveform video. Image output uses a still-frame renderer that ignores the mode setting.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Frame rate</label>
                <div className="flex items-center gap-2">
                  <select
                    value={rateMode}
                    onChange={(e) => setRateMode(e.target.value as 'rate' | 'n')}
                    className="p-2 border border-input rounded-lg bg-input text-card-foreground"
                  >
                    <option value="rate">Use frame rate</option>
                    <option value="n">Use samples per column (n)</option>
                  </select>
                  {rateMode === 'rate' ? (
                    <select
                      value={String(rate)}
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="p-2 border border-input rounded-lg bg-input text-card-foreground"
                    >
                      {FPS_PRESETS.map((f) => (
                        <option key={f} value={String(f)}>{f} fps{f === 25 ? ' (default)' : ''}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      min={1}
                      max={1024}
                      value={n}
                      onChange={(e) => setN(Math.max(0, Math.min(1024, Number(e.target.value) || 0)))}
                      placeholder="e.g. 64"
                      className="p-2 border border-input rounded-lg bg-input text-card-foreground w-32"
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose either the output frame rate <em>or</em> the number of audio samples drawn per column. Not both.
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm text-card-foreground">
                <input type="checkbox" checked={splitChannels} onChange={(e) => setSplitChannels(e.target.checked)} />
                Split stereo channels (draw left and right separately)
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Primary color</label>
                  <input
                    type="color"
                    value={colorPrimary}
                    onChange={(e) => setColorPrimary(e.target.value)}
                    className="h-10 w-full p-1 border border-input rounded-lg bg-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Secondary color (split mode)</label>
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
                  <label className="block text-sm font-medium text-card-foreground mb-1">Scale</label>
                  <select
                    value={scale}
                    onChange={(e) => setScale(e.target.value as typeof scale)}
                    className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                  >
                    <option value="lin">lin — most direct/accurate</option>
                    <option value="log">log — makes quiet parts more visible</option>
                    <option value="sqrt">sqrt — gentle boost to quiet parts</option>
                    <option value="cbrt">cbrt — stronger boost to quiet parts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Draw</label>
                  <select
                    value={draw}
                    onChange={(e) => setDraw(e.target.value as typeof draw)}
                    className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                  >
                    <option value="scale">scale (default)</option>
                    <option value="full">full</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isProcessing ? 'Generating waveform…' : 'Generate waveform'}
          </button>
        </form>
      )}
    />
  );
};

export default AudioWaveformPanel;
