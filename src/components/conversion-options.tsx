import { Controller } from 'react-hook-form';

const ConversionOptions: React.FC<{
  fileType: 'image' | 'video' | 'audio';
  control: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}> = ({ fileType, control }) => {
  if (fileType === 'image') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-card-foreground">Format</label>
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
            <label className="block text-sm font-medium mb-1 text-card-foreground">Quality (%)</label>
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
            <label className="block text-sm font-medium mb-1 text-card-foreground">Width (px)</label>
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
            <label className="block text-sm font-medium mb-1 text-card-foreground">Height (px)</label>
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
            <label className="block text-sm font-medium mb-1 text-card-foreground">Filter</label>
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
                </select>
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-card-foreground">Tint Color</label>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-card-foreground">Format</label>
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
            <label className="block text-sm font-medium mb-1 text-card-foreground">Quality</label>
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
            <label className="block text-sm font-medium mb-1 text-card-foreground">Width (px)</label>
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
            <label className="block text-sm font-medium mb-1 text-card-foreground">Height (px)</label>
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
            <label className="block text-sm font-medium mb-1 text-card-foreground">Speed Multiplier</label>
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
          <div className="flex items-center">
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
          </div>
        </div>
      </div>
    );
  }

  if (fileType === 'audio') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-card-foreground">Format</label>
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
            <label className="block text-sm font-medium mb-1 text-card-foreground">Bitrate (kbps)</label>
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
            <label className="block text-sm font-medium mb-1 text-card-foreground">Speed Multiplier</label>
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
            <label className="block text-sm font-medium mb-1 text-card-foreground">Volume Multiplier</label>
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
