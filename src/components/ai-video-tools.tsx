import React from 'react';
import { Controller, useWatch } from 'react-hook-form';
import type { Control, UseFormSetValue } from 'react-hook-form';
import { Sparkles } from 'lucide-react';
import InfoTooltip from '@/components/info-tooltip';

interface AIVideoToolsProps {
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * AI Video Tools panel.
 *
 * v1 ships a single operation — AI Frame Interpolation — wired up to the
 * rife-ncnn-vulkan helper script on the GPU server. Selecting the operation
 * flips a few related form fields so the submitted payload is consistent:
 *
 * - format is forced to MP4 (the only output the script produces today).
 * - any user-set temporal.frameRate.target is cleared — AI interpolation owns
 *   the output FPS.
 *
 * The UI keeps the rest of the Advanced Video Effects panel visible because
 * those controls still affect non-AI conversions, but a note explains that
 * AI frame interpolation bypasses most of the visual/temporal filter chain.
 */
const AIVideoTools: React.FC<AIVideoToolsProps> = ({ control, setValue }) => {
  const operation = useWatch({ control, name: 'ai.operation' }) as
    | 'none'
    | 'frame_interpolation'
    | undefined;
  const isFrameInterpolation = operation === 'frame_interpolation';

  const handleOperationChange = (value: 'none' | 'frame_interpolation') => {
    if (value === 'frame_interpolation') {
      setValue('ai.enabled', true, { shouldDirty: true });
      setValue('ai.operation', 'frame_interpolation', { shouldDirty: true });
      setValue('format', 'mp4', { shouldDirty: true });
      // AI interpolation owns the output FPS — clear any manually-set target.
      setValue('temporal.frameRate.target', undefined, { shouldDirty: true });
      // Apply sensible defaults if the user hasn't touched them yet.
      setValue('ai.frameInterpolation.targetFps', 60, { shouldDirty: true });
      setValue('ai.frameInterpolation.model', 'rife-v4.6', { shouldDirty: true });
      setValue('ai.frameInterpolation.quality', 'medium', { shouldDirty: true });
      setValue('ai.frameInterpolation.maxHeight', 720, { shouldDirty: true });
      setValue('ai.frameInterpolation.preserveAudio', true, { shouldDirty: true });
    } else {
      setValue('ai.enabled', false, { shouldDirty: true });
      setValue('ai.operation', 'none', { shouldDirty: true });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-pink-600" />
        AI Video Tools
        <InfoTooltip
          ariaLabel="About AI Video Tools"
          width="lg"
          content={
            <div className="space-y-1">
              <p>
                AI Video Tools currently includes <strong>AI Frame Interpolation</strong>,
                which generates new in-between frames so motion plays back more
                smoothly.
              </p>
              <p className="mt-1">
                Best for taking 24/30fps footage up to 60fps or 60fps up to 120fps.
                This is GPU-heavy and currently always outputs MP4.
              </p>
            </div>
          }
        />
      </h3>

      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border space-y-4">
        <div>
          <label
            htmlFor="ai-operation-select"
            className="block text-sm font-medium mb-1 text-card-foreground"
          >
            Operation
          </label>
          <Controller
            name="ai.operation"
            control={control}
            defaultValue="none"
            render={({ field }) => (
              <select
                id="ai-operation-select"
                value={field.value || 'none'}
                onChange={(e) =>
                  handleOperationChange(
                    e.target.value as 'none' | 'frame_interpolation',
                  )
                }
                className="w-full p-2 border border-input rounded-md text-card-foreground bg-card"
              >
                <option value="none">None</option>
                <option value="frame_interpolation">AI Frame Interpolation</option>
              </select>
            )}
          />
        </div>

        {isFrameInterpolation && (
          <div className="space-y-4">
            <div className="rounded-md border border-pink-200 dark:border-pink-900/60 bg-pink-50/50 dark:bg-pink-950/30 p-3 text-sm text-card-foreground space-y-1">
              <p>
                AI frame interpolation creates in-between frames for smoother motion.
                Best for 24/30fps → 60fps or 60fps → 120fps clips.
              </p>
              <p className="text-muted-foreground">
                This is GPU-heavy and currently outputs MP4. For long or 4K videos,
                use a lower max processing height first. This is different from
                basic FPS conversion — AI interpolation synthesizes new frames
                rather than duplicating them, and bypasses most other visual /
                temporal filters in v1.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ai-target-fps"
                  className="block text-sm font-medium mb-1 text-card-foreground"
                >
                  Target frame rate
                </label>
                <Controller
                  name="ai.frameInterpolation.targetFps"
                  control={control}
                  defaultValue={60}
                  render={({ field }) => (
                    <select
                      id="ai-target-fps"
                      value={field.value || 60}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      className="w-full p-2 border border-input rounded-md text-card-foreground bg-card"
                    >
                      <option value={48}>48 FPS</option>
                      <option value={60}>60 FPS</option>
                      <option value={120}>120 FPS</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="ai-rife-model"
                  className="block text-sm font-medium mb-1 text-card-foreground"
                >
                  RIFE model
                </label>
                <Controller
                  name="ai.frameInterpolation.model"
                  control={control}
                  defaultValue="rife-v4.6"
                  render={({ field }) => (
                    <select
                      id="ai-rife-model"
                      value={field.value || 'rife-v4.6'}
                      onChange={field.onChange}
                      className="w-full p-2 border border-input rounded-md text-card-foreground bg-card"
                    >
                      <option value="rife-v4.6">RIFE v4.6 — recommended</option>
                      <option value="rife-v4">RIFE v4</option>
                      <option value="rife-v2.3">RIFE v2.3 — compatibility</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="ai-quality"
                  className="block text-sm font-medium mb-1 text-card-foreground"
                >
                  Quality
                </label>
                <Controller
                  name="ai.frameInterpolation.quality"
                  control={control}
                  defaultValue="medium"
                  render={({ field }) => (
                    <select
                      id="ai-quality"
                      value={field.value || 'medium'}
                      onChange={field.onChange}
                      className="w-full p-2 border border-input rounded-md text-card-foreground bg-card"
                    >
                      <option value="low">Low — faster encode</option>
                      <option value="medium">Medium — balanced</option>
                      <option value="high">High — slower encode</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="ai-max-height"
                  className="block text-sm font-medium mb-1 text-card-foreground"
                >
                  Max processing height
                </label>
                <Controller
                  name="ai.frameInterpolation.maxHeight"
                  control={control}
                  defaultValue={720}
                  render={({ field }) => (
                    <select
                      id="ai-max-height"
                      value={field.value || 720}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      className="w-full p-2 border border-input rounded-md text-card-foreground bg-card"
                    >
                      <option value={360}>360p</option>
                      <option value={480}>480p</option>
                      <option value={720}>720p</option>
                      <option value={1080}>1080p</option>
                    </select>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Controller
                name="ai.frameInterpolation.preserveAudio"
                control={control}
                defaultValue={true}
                render={({ field }) => (
                  <input
                    id="ai-preserve-audio"
                    type="checkbox"
                    checked={field.value !== false}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4"
                  />
                )}
              />
              <label
                htmlFor="ai-preserve-audio"
                className="text-sm text-card-foreground"
              >
                Preserve audio track from the source
              </label>
            </div>

            <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
              <li>Output is always MP4 (H.264 + AAC) in v1.</li>
              <li>
                Trim is disabled with AI frame interpolation in v1 — trim the
                clip separately first if needed.
              </li>
              <li>
                Fast motion, scene cuts, hair, hands, wheels, and occlusions
                can show interpolation artifacts. Preview before publishing.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIVideoTools;
