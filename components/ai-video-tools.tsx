'use client';

import React from 'react';
import { Controller, useWatch } from 'react-hook-form';
import type { Control, UseFormSetValue } from 'react-hook-form';
import { Sparkles } from 'lucide-react';
import { Trans } from 'react-i18next';
import InfoTooltip from '@/components/info-tooltip';
import { useLocalization } from '@/i18n/useLocalization';

interface AIVideoToolsProps {
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const AIVideoTools: React.FC<AIVideoToolsProps> = ({ control, setValue }) => {
  const { t } = useLocalization(['interface', 'accessibility']);
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
      setValue('temporal.frameRate.target', undefined, { shouldDirty: true });
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
        {t('interface:aiVideoTools.title')}
        <InfoTooltip
          ariaLabel={t('accessibility:videoForm.aiTooltip')}
          width="lg"
          content={
            <div className="space-y-1">
              <p>
                <Trans i18nKey="interface:aiVideoTools.tooltipIntro" components={{ strong: <strong /> }} />
              </p>
              <p className="mt-1">
                {t('interface:aiVideoTools.tooltipBestFor')}
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
            {t('interface:aiVideoTools.operationLabel')}
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
                <option value="none">{t('interface:aiVideoTools.operations.none_short')}</option>
                <option value="frame_interpolation">{t('interface:aiVideoTools.operations.frame_interpolation')}</option>
              </select>
            )}
          />
        </div>

        {isFrameInterpolation && (
          <div className="space-y-4">
            <div className="rounded-md border border-pink-200 dark:border-pink-900/60 bg-pink-50/50 dark:bg-pink-950/30 p-3 text-sm text-card-foreground space-y-1">
              <p>
                {t('interface:aiVideoTools.intro')}
              </p>
              <p className="text-muted-foreground">
                {t('interface:aiVideoTools.gpuNote')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ai-target-fps"
                  className="block text-sm font-medium mb-1 text-card-foreground"
                >
                  {t('interface:aiVideoTools.frameInterpolation.targetFpsLabel')}
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
                  {t('interface:aiVideoTools.frameInterpolation.modelLabel')}
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
                      <option value="rife-v4.6">{t('interface:aiVideoTools.frameInterpolation.models.rife-v4.6')}</option>
                      <option value="rife-v4">{t('interface:aiVideoTools.frameInterpolation.models.rife-v4')}</option>
                      <option value="rife-v2.3">{t('interface:aiVideoTools.frameInterpolation.models.rife-v2.3')}</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="ai-quality"
                  className="block text-sm font-medium mb-1 text-card-foreground"
                >
                  {t('interface:aiVideoTools.frameInterpolation.qualityLabel')}
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
                      <option value="low">{t('interface:aiVideoTools.frameInterpolation.qualityOptions.low')}</option>
                      <option value="medium">{t('interface:aiVideoTools.frameInterpolation.qualityOptions.medium')}</option>
                      <option value="high">{t('interface:aiVideoTools.frameInterpolation.qualityOptions.high')}</option>
                    </select>
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="ai-max-height"
                  className="block text-sm font-medium mb-1 text-card-foreground"
                >
                  {t('interface:aiVideoTools.frameInterpolation.maxHeightLabel')}
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
                {t('interface:aiVideoTools.frameInterpolation.preserveAudio')}
              </label>
            </div>

            <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
              <li>{t('interface:aiVideoTools.notes.mp4')}</li>
              <li>{t('interface:aiVideoTools.notes.trim')}</li>
              <li>{t('interface:aiVideoTools.notes.artifacts')}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIVideoTools;
