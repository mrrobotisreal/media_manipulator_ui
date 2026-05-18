import { Controller } from 'react-hook-form';
import { Crop, Scissors } from 'lucide-react';
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
                    content="Open a player to scrub through the video and pick a start/end time. Only that segment is encoded into the output. Trimming works regardless of the output codec."
                  />
                </h3>
                <p className="text-sm text-muted-foreground">
                  {trimStatus || "Select the portion of the video you want to keep"}
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
                content="The output container and codec. MP4 (H.264+AAC) is the safest default for the web. WebM uses VP9+Opus and is great for open-web embeds. MOV/MKV/AVI/WMV/FLV target specific workflows; ProRes/DNxHD are high-bitrate editing codecs."
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
                </select>
              )}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              Quality
              <InfoTooltip
                ariaLabel="About video quality"
                content="Picks an x264 CRF preset under the hood. Low ≈ CRF 30 (small file), Medium ≈ CRF 23 (balanced default), High ≈ CRF 18 (visually transparent on most footage)."
              />
            </label>
            <Controller
              name="quality"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
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
                content="Target output width in pixels. Leave blank to keep the original or scale proportionally from the height. Combine with Preserve aspect ratio to avoid stretching."
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
                content="Target output height in pixels. Leave blank to keep the original or scale proportionally from the width."
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
              Speed Multiplier
              <InfoTooltip
                ariaLabel="About speed multiplier"
                content="Playback speed from 0.25x (slow motion) to 4x (fast). Video PTS and audio tempo are adjusted together so the result stays in sync."
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
          <div className="flex items-center gap-2">
            <Controller
              name="preserveAspectRatio"
              control={control}
              render={({ field }) => (
                <label className="flex items-center space-x-2">
                  <input
                    {...field}
                    type="checkbox"
                    checked={field.value}
                    className="rounded border-input bg-input focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-sm text-card-foreground">Preserve aspect ratio</span>
                </label>
              )}
            />
            <InfoTooltip
              ariaLabel="About preserve aspect ratio"
              content="When both Width and Height are set, this uses an FFmpeg force_original_aspect_ratio=decrease scale so the video fits within the box without stretching. Turn it off to force an exact (potentially stretched) size."
            />
          </div>
        </div>
      </div>
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

export default ConversionOptions;
