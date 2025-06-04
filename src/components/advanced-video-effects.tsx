import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { ChevronDown, ChevronRight, Palette, Move, Clock, Settings } from 'lucide-react';

interface AdvancedVideoEffectsProps {
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const AdvancedVideoEffects: React.FC<AdvancedVideoEffectsProps> = ({ control }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const SectionHeader: React.FC<{
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string
  }> = ({ id, title, icon, description }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-center gap-3">
        {icon}
        <div className="text-left">
          <h3 className="font-medium text-card-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {expandedSections.has(id) ? (
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      ) : (
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-card-foreground">Advanced Video Effects</h3>

      {/* Visual Effects Section */}
      <div className="space-y-2">
        <SectionHeader
          id="visual"
          title="Visual Effects"
          icon={<Palette className="w-5 h-5 text-blue-600" />}
          description="Color correction, blur/sharpen, artistic effects, and noise control"
        />

        {expandedSections.has('visual') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            {/* Color/Exposure */}
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Color & Exposure</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Brightness</label>
                  <Controller
                    name="visualEffects.brightness"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="range"
                        min="-100"
                        max="100"
                        step="5"
                        value={value || 0}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full"
                      />
                    )}
                  />
                  <div className="text-xs text-muted-foreground text-center">-100 to +100</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Contrast</label>
                  <Controller
                    name="visualEffects.contrast"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="range"
                        min="-100"
                        max="100"
                        step="5"
                        value={value || 0}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full"
                      />
                    )}
                  />
                  <div className="text-xs text-muted-foreground text-center">-100 to +100</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Saturation</label>
                  <Controller
                    name="visualEffects.saturation"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="range"
                        min="-100"
                        max="100"
                        step="5"
                        value={value || 0}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full"
                      />
                    )}
                  />
                  <div className="text-xs text-muted-foreground text-center">-100 to +100</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Hue</label>
                  <Controller
                    name="visualEffects.hue"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="range"
                        min="-180"
                        max="180"
                        step="5"
                        value={value || 0}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full"
                      />
                    )}
                  />
                  <div className="text-xs text-muted-foreground text-center">-180° to +180°</div>
                </div>
              </div>
            </div>

            {/* Blur/Sharpen */}
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Blur & Sharpen</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Gaussian Blur</label>
                  <Controller
                    name="visualEffects.gaussianBlur"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <input
                        {...field}
                        type="range"
                        min="0"
                        max="50"
                        step="1"
                        value={value || 0}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full"
                      />
                    )}
                  />
                  <div className="text-xs text-muted-foreground text-center">0 to 50px</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-card-foreground">Artistic Effect</label>
                  <Controller
                    name="visualEffects.artistic"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground">
                        <option value="none">None</option>
                        <option value="oil-painting">Oil Painting</option>
                        <option value="watercolor">Watercolor</option>
                        <option value="sketch">Sketch</option>
                        <option value="emboss">Emboss</option>
                        <option value="edge-detection">Edge Detection</option>
                        <option value="posterize">Posterize</option>
                      </select>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transform Section */}
      <div className="space-y-2">
        <SectionHeader
          id="transform"
          title="Geometric Transform"
          icon={<Move className="w-5 h-5 text-green-600" />}
          description="Rotation, flipping, cropping, and padding"
        />

        {expandedSections.has('transform') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">Rotation (degrees)</label>
                <Controller
                  name="transform.rotation"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <input
                      {...field}
                      type="number"
                      min="-360"
                      max="360"
                      step="1"
                      value={value || 0}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === '' ? 0 : Number(val));
                      }}
                      className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Controller
                  name="transform.flipHorizontal"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <label className="flex items-center space-x-2">
                      <input
                        {...field}
                        type="checkbox"
                        checked={value || false}
                        onChange={(e) => onChange(e.target.checked)}
                        className="rounded border-input bg-input"
                      />
                      <span className="text-sm text-card-foreground">Flip Horizontal</span>
                    </label>
                  )}
                />

                <Controller
                  name="transform.flipVertical"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <label className="flex items-center space-x-2">
                      <input
                        {...field}
                        type="checkbox"
                        checked={value || false}
                        onChange={(e) => onChange(e.target.checked)}
                        className="rounded border-input bg-input"
                      />
                      <span className="text-sm text-card-foreground">Flip Vertical</span>
                    </label>
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Temporal Effects Section */}
      <div className="space-y-2">
        <SectionHeader
          id="temporal"
          title="Temporal Effects"
          icon={<Clock className="w-5 h-5 text-purple-600" />}
          description="Speed control, reverse, frame rate, and stabilization"
        />

        {expandedSections.has('temporal') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="temporal.reverse"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <label className="flex items-center space-x-2">
                      <input
                        {...field}
                        type="checkbox"
                        checked={value || false}
                        onChange={(e) => onChange(e.target.checked)}
                        className="rounded border-input bg-input"
                      />
                      <span className="text-sm text-card-foreground">Reverse Video</span>
                    </label>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="temporal.pingPong"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <label className="flex items-center space-x-2">
                      <input
                        {...field}
                        type="checkbox"
                        checked={value || false}
                        onChange={(e) => onChange(e.target.checked)}
                        className="rounded border-input bg-input"
                      />
                      <span className="text-sm text-card-foreground">Ping-Pong Loop</span>
                    </label>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">Target Frame Rate</label>
                <Controller
                  name="temporal.frameRate.target"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <input
                      {...field}
                      type="number"
                      min="1"
                      max="120"
                      step="1"
                      placeholder="Auto"
                      value={value || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === '' ? undefined : Number(val));
                      }}
                      className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground"
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="temporal.stabilization.enabled"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <label className="flex items-center space-x-2">
                      <input
                        {...field}
                        type="checkbox"
                        checked={value || false}
                        onChange={(e) => onChange(e.target.checked)}
                        className="rounded border-input bg-input"
                      />
                      <span className="text-sm text-card-foreground">Video Stabilization</span>
                    </label>
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Processing Section */}
      <div className="space-y-2">
        <SectionHeader
          id="advanced"
          title="Advanced Processing"
          icon={<Settings className="w-5 h-5 text-red-600" />}
          description="Deinterlacing, HDR processing, and color space conversion"
        />

        {expandedSections.has('advanced') && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Controller
                  name="advanced.deinterlace"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <label className="flex items-center space-x-2">
                      <input
                        {...field}
                        type="checkbox"
                        checked={value || false}
                        onChange={(e) => onChange(e.target.checked)}
                        className="rounded border-input bg-input"
                      />
                      <span className="text-sm text-card-foreground">Deinterlace Video</span>
                    </label>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">Output Color Space</label>
                <Controller
                  name="advanced.colorSpace.output"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="w-full p-2 border border-input rounded-lg bg-input text-card-foreground">
                      <option value="rec709">Rec.709 (Standard)</option>
                      <option value="rec2020">Rec.2020 (HDR)</option>
                      <option value="srgb">sRGB</option>
                      <option value="p3">Display P3</option>
                    </select>
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedVideoEffects;