import { Controller, useWatch } from 'react-hook-form';
import { Crop, Scissors, Sparkles } from 'lucide-react';
import InfoTooltip from '@/components/info-tooltip';

const ConversionOptions: React.FC<{
  fileType: 'image' | 'video' | 'audio';
  control: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onCropClick?: () => void;
  onTrimClick?: () => void;
  cropStatus?: string;
  trimStatus?: string;
}> = ({ fileType, control, onCropClick, onTrimClick, cropStatus, trimStatus }) => {
  if (fileType === 'image') {
    return (
      <div className="space-y-4">
        {/* Crop Button */}
        {onCropClick && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground flex items-center gap-2">
                  Image Cropping
                  <InfoTooltip
                    ariaLabel="About image cropping"
                    content="Open a visual crop selector to keep only part of the image. Cropping runs before resize and filters, so dimensions you set below apply to the cropped region. Skip this if you want the whole image."
                  />
                </h3>
                <p className="text-sm text-muted-foreground">
                  {cropStatus || "Select the portion of the image you want to keep"}
                </p>
              </div>
              <button
                type="button"
                onClick={onCropClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Crop className="w-4 h-4" />
                {cropStatus ? 'Edit Crop' : 'Crop Image'}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              Format
              <InfoTooltip
                ariaLabel="About image format"
                content="The output file type. JPG is best for photos, PNG keeps transparency and is great for graphics, WebP is a modern smaller format, and GIF is for legacy or animated use cases."
              />
            </label>
            <Controller
              name="format"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                  <option value="gif">GIF</option>
                </select>
              )}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              Quality (%)
              <InfoTooltip
                ariaLabel="About image quality"
                content="Compression quality for JPG and WebP outputs (1–100). 85 is a balanced default. Lower values shrink file size at the cost of artifacts; values above 95 rarely show a visible difference. Ignored for PNG and GIF."
              />
            </label>
            <Controller
              name="quality"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <input
                  {...field}
                  type="number"
                  min="1"
                  max="100"
                  value={value || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === '' ? undefined : Number(val));
                  }}
                  className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
                />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              Width (px)
              <InfoTooltip
                ariaLabel="About image width"
                content="Target width in pixels. Leave blank to keep the original width or scale proportionally based on the Height field. The image is auto-oriented from EXIF before resize so the dimensions match what you see in the preview."
              />
            </label>
            <Controller
              name="width"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <input
                  {...field}
                  type="number"
                  placeholder="Auto"
                  value={value || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === '' ? undefined : Number(val));
                  }}
                  className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
              )}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              Height (px)
              <InfoTooltip
                ariaLabel="About image height"
                content="Target height in pixels. Leave blank to keep the original height or scale proportionally based on the Width field. Setting both Width and Height forces an exact size and may stretch the image."
              />
            </label>
            <Controller
              name="height"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <input
                  {...field}
                  type="number"
                  placeholder="Auto"
                  value={value || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === '' ? undefined : Number(val));
                  }}
                  className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              Filter
              <InfoTooltip
                ariaLabel="About image filters"
                content="Apply a single ImageMagick effect to the output: grayscale, sepia, blur/sharpen, swirl, barrel distortion, oil painting, vintage, emboss, charcoal, sketch, or a fixed rotation. Choose None to skip filters."
              />
            </label>
            <Controller
              name="filter"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                  <option value="none">None</option>
                  <option value="grayscale">Grayscale</option>
                  <option value="sepia">Sepia</option>
                  <option value="blur">Blur</option>
                  <option value="sharpen">Sharpen</option>
                  <option value="swirl">Swirl</option>
                  <option value="barrel-distortion">Barrel Distortion</option>
                  <option value="oil-painting">Oil Painting</option>
                  <option value="vintage">Vintage</option>
                  <option value="emboss">Emboss</option>
                  <option value="charcoal">Charcoal</option>
                  <option value="sketch">Sketch</option>
                  <option value="rotate-45º">Rotate 45º</option>
                  <option value="rotate-90º">Rotate 90º</option>
                  <option value="rotate-180º">Rotate 180º</option>
                  <option value="rotate-270º">Rotate 270º</option>
                </select>
              )}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              Tint Color
              <InfoTooltip
                ariaLabel="About tint color"
                content="Lay a 30% colored tint over the image. Useful for branded thumbnails or duotones. Leave the color picker at black (#000000) to skip the tint."
              />
            </label>
            <Controller
              name="tint"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="color"
                  className="w-full p-1 border border-input rounded-lg h-10 bg-input focus:ring-2 focus:ring-ring"
                />
              )}
            />
          </div>
        </div>
      </div>
    );
  }

  if (fileType === 'video') {
    return (
      <VideoConversionOptions
        control={control}
        onTrimClick={onTrimClick}
        trimStatus={trimStatus}
      />
    );
  }

  if (fileType === 'audio') {
    return (
      <div className="space-y-4">
        {/* Trim Button */}
        {onTrimClick && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground flex items-center gap-2">
                  Audio Trimming
                  <InfoTooltip
                    ariaLabel="About audio trimming"
                    content="Open a waveform player to pick a start and end time. Only the selected segment is encoded into the output file."
                  />
                </h3>
                <p className="text-sm text-muted-foreground">
                  {trimStatus || "Select the portion of the audio you want to keep"}
                </p>
              </div>
              <button
                type="button"
                onClick={onTrimClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Scissors className="w-4 h-4" />
                {trimStatus ? 'Edit Trim' : 'Trim Audio'}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              Format
              <InfoTooltip
                ariaLabel="About audio format"
                content="The output codec/container. MP3 has universal support; WAV/FLAC/ALAC are lossless; AAC is efficient for streaming; OGG, Opus, AC3 and DTS target specific workflows."
              />
            </label>
            <Controller
              name="format"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                  <option value="mp3">MP3</option>
                  <option value="wav">WAV</option>
                  <option value="aac">AAC</option>
                  <option value="ogg">OGG</option>
                </select>
              )}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              Bitrate (kbps)
              <InfoTooltip
                ariaLabel="About audio bitrate"
                content="Controls compression quality vs. file size for lossy formats. 128 kbps is fine for podcasts, 192–256 kbps is a strong default for music, and 320 kbps is the maximum MP3 quality. Ignored for WAV, FLAC, and ALAC (lossless)."
              />
            </label>
            <Controller
              name="bitrate"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                  <option value="128">128</option>
                  <option value="192">192</option>
                  <option value="256">256</option>
                  <option value="320">320</option>
                </select>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              Speed Multiplier
              <InfoTooltip
                ariaLabel="About audio speed multiplier"
                content="Playback tempo from 0.25x (slow) to 4x (fast). Pitch is preserved using FFmpeg's atempo filter, chained automatically for extreme values."
              />
            </label>
            <Controller
              name="speed"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <input
                  {...field}
                  type="number"
                  min="0.25"
                  max="4"
                  step="0.25"
                  value={value || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === '' ? 1 : Number(val));
                  }}
                  className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
                />
              )}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              Volume Multiplier
              <InfoTooltip
                ariaLabel="About volume multiplier"
                content="Linear gain factor from 0.1x to 2x. 1.0 leaves the level unchanged. For finer dB control, use the Amplify slider in Advanced Audio Effects."
              />
            </label>
            <Controller
              name="volume"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <input
                  {...field}
                  type="number"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={value || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === '' ? 1 : Number(val));
                  }}
                  className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
                />
              )}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

interface VideoConversionOptionsProps {
  control: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onTrimClick?: () => void;
  trimStatus?: string;
}

// VideoConversionOptions lives in its own component so we can call useWatch
// without breaking the rules of hooks when the parent renders a different
// fileType branch. It also keeps the GIF-only fields close to the format
// dropdown that gates them.
const VideoConversionOptions: React.FC<VideoConversionOptionsProps> = ({ control, onTrimClick, trimStatus }) => {
  const format = useWatch({ control, name: 'format' });
  const isGIF = format === 'gif';

  return (
    <div className="space-y-4">
      {/* Trim Button */}
      {onTrimClick && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-card-foreground flex items-center gap-2">
                Video Trimming
                <InfoTooltip
                  ariaLabel="About video trimming"
                  content="Open a player to scrub through the video and pick a start/end time. Only that segment is encoded into the output. Trimming works regardless of the output codec — including animated GIF."
                />
              </h3>
              <p className="text-sm text-muted-foreground">
                {trimStatus || 'Select the portion of the video you want to keep'}
              </p>
            </div>
            <button
              type="button"
              onClick={onTrimClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Scissors className="w-4 h-4" />
              {trimStatus ? 'Edit Trim' : 'Trim Video'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
            Format
            <InfoTooltip
              ariaLabel="About video format"
              content="The output container and codec. MP4 (H.264+AAC) is the safest default for the web. WebM uses VP9+Opus and is great for open-web embeds. MOV/MKV/AVI/WMV/FLV target specific workflows; ProRes/DNxHD are high-bitrate editing codecs. GIF (Animated) downscales and palettizes the clip via ffmpeg + gifsicle — perfect for short, silent loops."
            />
          </label>
          <Controller
            name="format"
            control={control}
            render={({ field }) => (
              <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                <option value="mp4">MP4</option>
                <option value="webm">WebM</option>
                <option value="avi">AVI</option>
                <option value="mov">MOV</option>
                <option value="gif">GIF (Animated)</option>
              </select>
            )}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
            Quality
            <InfoTooltip
              ariaLabel="About video quality"
              content="Picks an x264 CRF preset under the hood. Low ≈ CRF 30 (small file), Medium ≈ CRF 23 (balanced default), High ≈ CRF 18 (visually transparent on most footage). Ignored for GIF output — use the GIF panel below to tune palette size and frame rate instead."
            />
          </label>
          <Controller
            name="quality"
            control={control}
            render={({ field }) => (
              <select {...field} disabled={isGIF} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring disabled:opacity-50">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
            Width (px)
            <InfoTooltip
              ariaLabel="About video width"
              content="Target output width in pixels. Leave blank to keep the original or scale proportionally from the height. Combine with Preserve aspect ratio to avoid stretching. When the format is GIF, leaving this blank uses the width from the Animated GIF panel below."
            />
          </label>
          <Controller
            name="width"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <input
                {...field}
                type="number"
                placeholder="Auto"
                value={value || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(val === '' ? undefined : Number(val));
                }}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              />
            )}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
            Height (px)
            <InfoTooltip
              ariaLabel="About video height"
              content="Target output height in pixels. Leave blank to keep the original or scale proportionally from the width. Ignored for GIF output — height is computed from width to keep the aspect ratio (and rounded to a multiple of 4)."
            />
          </label>
          <Controller
            name="height"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <input
                {...field}
                type="number"
                placeholder={isGIF ? 'Auto (from width)' : 'Auto'}
                disabled={isGIF}
                value={value || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(val === '' ? undefined : Number(val));
                }}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring disabled:opacity-50"
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
            Speed Multiplier
            <InfoTooltip
              ariaLabel="About speed multiplier"
              content="Playback speed from 0.25x (slow motion) to 4x (fast). Video PTS and audio tempo are adjusted together so the result stays in sync. For GIF output, control playback feel using the Frame rate and Frame delay knobs in the Animated GIF panel."
            />
          </label>
          <Controller
            name="speed"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <input
                {...field}
                type="number"
                min="0.25"
                max="4"
                step="0.25"
                disabled={isGIF}
                value={value || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(val === '' ? 1 : Number(val));
                }}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring disabled:opacity-50"
              />
            )}
          />
        </div>
        <div className="flex items-center gap-2">
          <Controller
            name="preserveAspectRatio"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <div className="flex flex-row justify-start items-center space-x-2">
                <label className="neon-checkbox">
                  <input type="checkbox" {...field} checked={value || false} onChange={(e) => onChange(e.target.checked)} />
                  <div className="neon-checkbox__frame">
                    <div className="neon-checkbox__box">
                      <div className="neon-checkbox__check-container">
                        <svg viewBox="0 0 24 24" className="neon-checkbox__check">
                          <path d="M3,12.5l7,7L21,5"></path>
                        </svg>
                      </div>
                      <div className="neon-checkbox__glow"></div>
                      <div className="neon-checkbox__borders">
                        <span></span><span></span><span></span><span></span>
                      </div>
                    </div>
                    <div className="neon-checkbox__effects">
                      <div className="neon-checkbox__particles">
                        <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span> <span></span><span></span><span></span><span></span>
                      </div>
                      <div className="neon-checkbox__rings">
                        <div className="ring"></div>
                        <div className="ring"></div>
                        <div className="ring"></div>
                      </div>
                      <div className="neon-checkbox__sparks">
                        <span></span><span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                </label>
                <span className="text-sm text-card-foreground">Preserve aspect ratio</span>
              </div>
              // <label className="flex items-center space-x-2">
              //   <input
              //     {...field}
              //     type="checkbox"
              //     checked={field.value}
              //     className="rounded border-input bg-input focus:ring-2 focus:ring-ring"
              //   />
              //   <span className="text-sm text-card-foreground">Preserve aspect ratio</span>
              // </label>
            )}
          />
          <InfoTooltip
            ariaLabel="About preserve aspect ratio"
            content="When both Width and Height are set, this uses an FFmpeg force_original_aspect_ratio=decrease scale so the video fits within the box without stretching. Turn it off to force an exact (potentially stretched) size. GIF output always preserves aspect ratio."
          />
        </div>
      </div>

      {isGIF && (
        <div className="border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 rounded-lg p-4 space-y-4">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-medium text-card-foreground flex items-center gap-2">
                Animated GIF Settings
                <InfoTooltip
                  ariaLabel="About animated GIF settings"
                  content="GIF conversion runs in two stages: ffmpeg downscales the video and samples it at the chosen frame rate, then gifsicle quantizes the palette and optimizes the output. The Convert/Transcribe controls above for Quality, Height, and Speed are skipped for GIF since this panel takes over."
                />
              </h3>
              <p className="text-sm text-muted-foreground">
                Tune the ffmpeg → gifsicle pipeline. Defaults match a good
                screencast preset (900px wide, 12 fps, 128 colors).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
                Width (px)
                <InfoTooltip
                  ariaLabel="About GIF width"
                  content="Output width in pixels. Height is computed automatically to preserve the aspect ratio (rounded to a multiple of 4 to keep ffmpeg happy). 480–900 is a good range for screencasts; smaller values shrink the file fast."
                />
              </label>
              <Controller
                name="gif.width"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <input
                    {...field}
                    type="number"
                    min="16"
                    max="2000"
                    value={value ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange(val === '' ? undefined : Number(val));
                    }}
                    className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
                  />
                )}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
                Frame rate (fps)
                <InfoTooltip
                  ariaLabel="About GIF frame rate"
                  content="How many frames per second ffmpeg samples from the source video before handing it to gifsicle. 12 fps looks smooth for screen recordings; raise to 18–24 for motion-heavy clips, drop to 8–10 to shrink the file."
                />
              </label>
              <Controller
                name="gif.fps"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <input
                    {...field}
                    type="number"
                    min="1"
                    max="50"
                    value={value ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange(val === '' ? undefined : Number(val));
                    }}
                    className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
                Colors
                <InfoTooltip
                  ariaLabel="About GIF colors"
                  content="Maximum palette size gifsicle quantizes to (2–256). 128 is a strong default; drop to 64 to shrink the file on flat UI footage, raise to 256 for photographic clips with smooth gradients."
                />
              </label>
              <Controller
                name="gif.colors"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <input
                    {...field}
                    type="number"
                    min="2"
                    max="256"
                    value={value ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange(val === '' ? undefined : Number(val));
                    }}
                    className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
                  />
                )}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
                Frame delay
                <InfoTooltip
                  ariaLabel="About GIF frame delay"
                  content="gifsicle inter-frame delay in 1/100s. Lower = faster playback. 3 (= 30ms) is a snappy screencast feel; 6–10 produces a slower, more deliberate loop. Independent of the ffmpeg sampling rate above."
                />
              </label>
              <Controller
                name="gif.delay"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <input
                    {...field}
                    type="number"
                    min="1"
                    max="100"
                    value={value ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange(val === '' ? undefined : Number(val));
                    }}
                    className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
                  />
                )}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
                Optimize level
                <InfoTooltip
                  ariaLabel="About GIF optimize level"
                  content="gifsicle --optimize level. 1 is fastest with the biggest output, 3 is slowest with the smallest output. Stick with 3 unless you're iterating on a long clip and want a quick draft."
                />
              </label>
              <Controller
                name="gif.optimize"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <select
                    {...field}
                    value={value ?? 3}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring"
                  >
                    <option value={1}>1 — fast, larger file</option>
                    <option value={2}>2 — balanced</option>
                    <option value={3}>3 — smallest, slower</option>
                  </select>
                )}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionOptions;
