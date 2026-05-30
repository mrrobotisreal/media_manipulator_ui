import { Controller, useWatch } from 'react-hook-form';
import { Crop, Scissors, Sparkles } from 'lucide-react';
import InfoTooltip from '@/components/info-tooltip';
import type { EmbeddedVideoFormat } from '@/components/embedded-tool-panel';
import { useLocalization } from '@/i18n/useLocalization';

const ConversionOptions: React.FC<{
  fileType: 'image' | 'video' | 'audio';
  control: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onCropClick?: () => void;
  onTrimClick?: () => void;
  cropStatus?: string;
  trimStatus?: string;
  /** When set (image), the output-format select is locked to this value. */
  lockedFormat?: 'jpg' | 'png' | 'webp' | 'gif' | 'avif' | 'pdf' | 'svg' | 'ico';
  /** When set (video), the output-format select is locked to this value. */
  lockedVideoFormat?: EmbeddedVideoFormat;
  /** When true (image), visually highlight the width/height controls. */
  emphasizeResize?: boolean;
}> = ({ fileType, control, onCropClick, onTrimClick, cropStatus, trimStatus, lockedFormat, lockedVideoFormat, emphasizeResize }) => {
  const { t } = useLocalization('interface');

  if (fileType === 'image') {
    return (
      <div className="space-y-4">
        {/* Crop Button */}
        {onCropClick && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-card-foreground flex items-center gap-2">
                  {t('conversionOptions.image.cropping.title')}
                  <InfoTooltip
                    ariaLabel={t('conversionOptions.image.cropping.tooltipAria')}
                    content={t('conversionOptions.image.cropping.tooltip')}
                  />
                </h3>
                <p className="text-sm text-muted-foreground">
                  {cropStatus || t('conversionOptions.image.cropping.selectPortion')}
                </p>
              </div>
              <button
                type="button"
                onClick={onCropClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Crop className="w-4 h-4" />
                {cropStatus ? t('conversionOptions.image.cropping.editCrop') : t('conversionOptions.image.cropping.cropImage')}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              {t('conversionOptions.image.format.label')}
              <InfoTooltip
                ariaLabel={t('conversionOptions.image.format.tooltipAria')}
                content={t('conversionOptions.image.format.tooltip')}
              />
            </label>
            <Controller
              name="format"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  disabled={Boolean(lockedFormat)}
                  aria-disabled={Boolean(lockedFormat)}
                  className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                  <option value="gif">GIF</option>
                  <option value="avif">AVIF</option>
                  <option value="pdf">PDF</option>
                  <option value="svg">SVG</option>
                  <option value="ico">ICO</option>
                </select>
              )}
            />
            {lockedFormat && (
              <span className="mt-1 inline-flex items-center gap-1 rounded bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                {t('conversionOptions.image.format.locked', { format: lockedFormat.toUpperCase() })}
              </span>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              {t('conversionOptions.image.quality.label')}
              <InfoTooltip
                ariaLabel={t('conversionOptions.image.quality.tooltipAria')}
                content={t('conversionOptions.image.quality.tooltip')}
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

        {emphasizeResize && (
          <div className="rounded-md border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 px-3 py-2 text-sm text-card-foreground">
            {t('conversionOptions.image.resizeEmphasis')}
          </div>
        )}

        <div className={`grid grid-cols-2 gap-4${emphasizeResize ? ' rounded-lg ring-2 ring-blue-300 dark:ring-blue-800 p-2' : ''}`}>
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              {t('conversionOptions.image.width.label')}
              <InfoTooltip
                ariaLabel={t('conversionOptions.image.width.tooltipAria')}
                content={t('conversionOptions.image.width.tooltip')}
              />
            </label>
            <Controller
              name="width"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <input
                  {...field}
                  type="number"
                  placeholder={t('conversionOptions.image.width.placeholder')}
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
              {t('conversionOptions.image.height.label')}
              <InfoTooltip
                ariaLabel={t('conversionOptions.image.height.tooltipAria')}
                content={t('conversionOptions.image.height.tooltip')}
              />
            </label>
            <Controller
              name="height"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <input
                  {...field}
                  type="number"
                  placeholder={t('conversionOptions.image.height.placeholder')}
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
              {t('conversionOptions.image.filter.label')}
              <InfoTooltip
                ariaLabel={t('conversionOptions.image.filter.tooltipAria')}
                content={t('conversionOptions.image.filter.tooltip')}
              />
            </label>
            <Controller
              name="filter"
              control={control}
              render={({ field }) => (
                <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring">
                  <option value="none">{t('conversionOptions.image.filter.options.none')}</option>
                  <option value="grayscale">{t('conversionOptions.image.filter.options.grayscale')}</option>
                  <option value="sepia">{t('conversionOptions.image.filter.options.sepia')}</option>
                  <option value="blur">{t('conversionOptions.image.filter.options.blur')}</option>
                  <option value="sharpen">{t('conversionOptions.image.filter.options.sharpen')}</option>
                  <option value="swirl">{t('conversionOptions.image.filter.options.swirl')}</option>
                  <option value="barrel-distortion">{t('conversionOptions.image.filter.options.barrel-distortion')}</option>
                  <option value="oil-painting">{t('conversionOptions.image.filter.options.oil-painting')}</option>
                  <option value="vintage">{t('conversionOptions.image.filter.options.vintage')}</option>
                  <option value="emboss">{t('conversionOptions.image.filter.options.emboss')}</option>
                  <option value="charcoal">{t('conversionOptions.image.filter.options.charcoal')}</option>
                  <option value="sketch">{t('conversionOptions.image.filter.options.sketch')}</option>
                  <option value="rotate-45º">{t('conversionOptions.image.filter.options.rotate-45º')}</option>
                  <option value="rotate-90º">{t('conversionOptions.image.filter.options.rotate-90º')}</option>
                  <option value="rotate-180º">{t('conversionOptions.image.filter.options.rotate-180º')}</option>
                  <option value="rotate-270º">{t('conversionOptions.image.filter.options.rotate-270º')}</option>
                </select>
              )}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              {t('conversionOptions.image.tint.label')}
              <InfoTooltip
                ariaLabel={t('conversionOptions.image.tint.tooltipAria')}
                content={t('conversionOptions.image.tint.tooltip')}
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
        lockedFormat={lockedVideoFormat}
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
                  {t('conversionOptions.audio.trimming.title')}
                  <InfoTooltip
                    ariaLabel={t('conversionOptions.audio.trimming.tooltipAria')}
                    content={t('conversionOptions.audio.trimming.tooltip')}
                  />
                </h3>
                <p className="text-sm text-muted-foreground">
                  {trimStatus || t('conversionOptions.audio.trimming.selectPortion')}
                </p>
              </div>
              <button
                type="button"
                onClick={onTrimClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Scissors className="w-4 h-4" />
                {trimStatus ? t('conversionOptions.audio.trimming.editTrim') : t('conversionOptions.audio.trimming.trimAudio')}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
              {t('conversionOptions.audio.format.label')}
              <InfoTooltip
                ariaLabel={t('conversionOptions.audio.format.tooltipAria')}
                content={t('conversionOptions.audio.format.tooltip')}
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
              {t('conversionOptions.audio.bitrate.label')}
              <InfoTooltip
                ariaLabel={t('conversionOptions.audio.bitrate.tooltipAria')}
                content={t('conversionOptions.audio.bitrate.tooltip')}
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
              {t('conversionOptions.audio.speed.label')}
              <InfoTooltip
                ariaLabel={t('conversionOptions.audio.speed.tooltipAria')}
                content={t('conversionOptions.audio.speed.tooltip')}
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
              {t('conversionOptions.audio.volume.label')}
              <InfoTooltip
                ariaLabel={t('conversionOptions.audio.volume.tooltipAria')}
                content={t('conversionOptions.audio.volume.tooltip')}
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
  /** When set, the output-format select is locked to this value. */
  lockedFormat?: EmbeddedVideoFormat;
}

// VideoConversionOptions lives in its own component so we can call useWatch
// without breaking the rules of hooks when the parent renders a different
// fileType branch. It also keeps the GIF-only fields close to the format
// dropdown that gates them.
const VideoConversionOptions: React.FC<VideoConversionOptionsProps> = ({ control, onTrimClick, trimStatus, lockedFormat }) => {
  const { t } = useLocalization('interface');
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
                {t('conversionOptions.video.trimming.title')}
                <InfoTooltip
                  ariaLabel={t('conversionOptions.video.trimming.tooltipAria')}
                  content={t('conversionOptions.video.trimming.tooltip')}
                />
              </h3>
              <p className="text-sm text-muted-foreground">
                {trimStatus || t('conversionOptions.video.trimming.selectPortion')}
              </p>
            </div>
            <button
              type="button"
              onClick={onTrimClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Scissors className="w-4 h-4" />
              {trimStatus ? t('conversionOptions.video.trimming.editTrim') : t('conversionOptions.video.trimming.trimVideo')}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
            {t('conversionOptions.video.format.label')}
            <InfoTooltip
              ariaLabel={t('conversionOptions.video.format.tooltipAria')}
              content={t('conversionOptions.video.format.tooltip')}
            />
          </label>
          <Controller
            name="format"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={Boolean(lockedFormat)}
                aria-disabled={Boolean(lockedFormat)}
                className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="mp4">{t('conversionOptions.video.format.options.mp4')}</option>
                <option value="webm">{t('conversionOptions.video.format.options.webm')}</option>
                <option value="avi">{t('conversionOptions.video.format.options.avi')}</option>
                <option value="mov">{t('conversionOptions.video.format.options.mov')}</option>
                <option value="mkv">{t('conversionOptions.video.format.options.mkv')}</option>
                <option value="flv">{t('conversionOptions.video.format.options.flv')}</option>
                <option value="wmv">{t('conversionOptions.video.format.options.wmv')}</option>
                <option value="prores">{t('conversionOptions.video.format.options.prores')}</option>
                <option value="dnxhd">{t('conversionOptions.video.format.options.dnxhd')}</option>
                <option value="gif">{t('conversionOptions.video.format.options.gif')}</option>
              </select>
            )}
          />
          {lockedFormat && (
            <span className="mt-1 inline-flex items-center gap-1 rounded bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
              {t('conversionOptions.video.format.locked', { format: lockedFormat.toUpperCase() })}
            </span>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
            {t('conversionOptions.video.quality.label')}
            <InfoTooltip
              ariaLabel={t('conversionOptions.video.quality.tooltipAria')}
              content={t('conversionOptions.video.quality.tooltip')}
            />
          </label>
          <Controller
            name="quality"
            control={control}
            render={({ field }) => (
              <select {...field} disabled={isGIF} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground focus:ring-2 focus:ring-ring disabled:opacity-50">
                <option value="low">{t('conversionOptions.video.quality.options.low')}</option>
                <option value="medium">{t('conversionOptions.video.quality.options.medium')}</option>
                <option value="high">{t('conversionOptions.video.quality.options.high')}</option>
              </select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
            {t('conversionOptions.video.width.label')}
            <InfoTooltip
              ariaLabel={t('conversionOptions.video.width.tooltipAria')}
              content={t('conversionOptions.video.width.tooltip')}
            />
          </label>
          <Controller
            name="width"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <input
                {...field}
                type="number"
                placeholder={t('conversionOptions.video.width.placeholder')}
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
            {t('conversionOptions.video.height.label')}
            <InfoTooltip
              ariaLabel={t('conversionOptions.video.height.tooltipAria')}
              content={t('conversionOptions.video.height.tooltip')}
            />
          </label>
          <Controller
            name="height"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <input
                {...field}
                type="number"
                placeholder={isGIF ? t('conversionOptions.video.height.placeholderGif') : t('conversionOptions.video.height.placeholder')}
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
            {t('conversionOptions.video.speed.label')}
            <InfoTooltip
              ariaLabel={t('conversionOptions.video.speed.tooltipAria')}
              content={t('conversionOptions.video.speed.tooltip')}
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
                <span className="text-sm text-card-foreground">{t('conversionOptions.video.preserveAspectRatio.label')}</span>
              </div>
            )}
          />
          <InfoTooltip
            ariaLabel={t('conversionOptions.video.preserveAspectRatio.tooltipAria')}
            content={t('conversionOptions.video.preserveAspectRatio.tooltip')}
          />
        </div>
      </div>

      {isGIF && (
        <div className="border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 rounded-lg p-4 space-y-4">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-medium text-card-foreground flex items-center gap-2">
                {t('conversionOptions.video.gif.title')}
                <InfoTooltip
                  ariaLabel={t('conversionOptions.video.gif.tooltipAria')}
                  content={t('conversionOptions.video.gif.tooltip')}
                />
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('conversionOptions.video.gif.subtitle')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 text-card-foreground flex items-center gap-2">
                {t('conversionOptions.video.gif.width.label')}
                <InfoTooltip
                  ariaLabel={t('conversionOptions.video.gif.width.tooltipAria')}
                  content={t('conversionOptions.video.gif.width.tooltip')}
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
                {t('conversionOptions.video.gif.fps.label')}
                <InfoTooltip
                  ariaLabel={t('conversionOptions.video.gif.fps.tooltipAria')}
                  content={t('conversionOptions.video.gif.fps.tooltip')}
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
                {t('conversionOptions.video.gif.colors.label')}
                <InfoTooltip
                  ariaLabel={t('conversionOptions.video.gif.colors.tooltipAria')}
                  content={t('conversionOptions.video.gif.colors.tooltip')}
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
                {t('conversionOptions.video.gif.delay.label')}
                <InfoTooltip
                  ariaLabel={t('conversionOptions.video.gif.delay.tooltipAria')}
                  content={t('conversionOptions.video.gif.delay.tooltip')}
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
                {t('conversionOptions.video.gif.optimize.label')}
                <InfoTooltip
                  ariaLabel={t('conversionOptions.video.gif.optimize.tooltipAria')}
                  content={t('conversionOptions.video.gif.optimize.tooltip')}
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
                    <option value={1}>{t('conversionOptions.video.gif.optimize.options.1')}</option>
                    <option value={2}>{t('conversionOptions.video.gif.optimize.options.2')}</option>
                    <option value={3}>{t('conversionOptions.video.gif.optimize.options.3')}</option>
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
