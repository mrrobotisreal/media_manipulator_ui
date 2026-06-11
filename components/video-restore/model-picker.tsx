'use client';

import React from 'react';
import { useLocalization } from '@/i18n/useLocalization';
import type { RestoreModelId, RestoreModelInfo } from '@/lib/restoreTypes';

interface ModelPickerProps {
  models: RestoreModelInfo[];
  selected: RestoreModelId[];
  onSelectedChange: (ids: RestoreModelId[]) => void;
  includeFrames: boolean;
  onIncludeFramesChange: (value: boolean) => void;
  /** Estimated frame count of the current selection (for per-model ETAs). */
  estFrames: number;
  disabled?: boolean;
}

const formatEstimate = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return '';
  if (totalSeconds < 90) return `~${Math.max(1, Math.round(totalSeconds))} sec`;
  if (totalSeconds < 90 * 60) return `~${Math.round(totalSeconds / 60)} min`;
  return `~${(totalSeconds / 3600).toFixed(1)} hr`;
};

// ModelPicker renders the two model groups as checkbox cards. Group A
// (frame-by-frame enhancers) results include enhanced frames + video; Group B
// (video restoration models) are video-only. Unavailable models stay visible
// but disabled, with the server's reason as the tooltip.
const ModelPicker: React.FC<ModelPickerProps> = ({
  models,
  selected,
  onSelectedChange,
  includeFrames,
  onIncludeFramesChange,
  estFrames,
  disabled = false,
}) => {
  const { t } = useLocalization('interface');

  const available = models.filter((m) => m.available);
  const frameModels = models.filter((m) => m.group === 'frame');
  const videoModels = models.filter((m) => m.group === 'video');

  const toggle = (id: RestoreModelId) => {
    if (selected.includes(id)) {
      onSelectedChange(selected.filter((s) => s !== id));
    } else {
      onSelectedChange([...selected, id]);
    }
  };

  const totalEstSeconds = models
    .filter((m) => selected.includes(m.id))
    .reduce((sum, m) => sum + m.estSecondsPerFrame * estFrames, 0);

  const renderCard = (model: RestoreModelInfo) => {
    const checked = selected.includes(model.id);
    const cardDisabled = disabled || !model.available;
    const estSeconds = model.estSecondsPerFrame * estFrames;
    return (
      <label
        key={model.id}
        title={!model.available && model.reason ? model.reason : undefined}
        className={`flex items-start gap-3 rounded-lg border p-3 transition-colors motion-reduce:transition-none ${
          cardDisabled
            ? 'border-border bg-muted/40 opacity-60 cursor-not-allowed'
            : checked
              ? 'border-blue-500 bg-blue-500/10 cursor-pointer'
              : 'border-border bg-background/40 hover:border-blue-400/60 cursor-pointer'
        }`}
      >
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-blue-600"
          checked={checked}
          disabled={cardDisabled}
          onChange={() => toggle(model.id)}
          aria-label={model.displayName}
        />
        <span className="flex-1 min-w-0">
          <span className="flex items-baseline justify-between gap-2">
            <span className="font-medium text-sm">{model.displayName}</span>
            {model.available && estFrames > 0 && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">{formatEstimate(estSeconds)}</span>
            )}
          </span>
          <span className="block text-xs text-muted-foreground mt-0.5">
            {t(`videoRestore.models.${model.id}.description`)}
          </span>
          {!model.available && (
            <span className="block text-xs text-destructive mt-1">
              {model.reason || t('videoRestore.picker.unavailable')}
            </span>
          )}
        </span>
      </label>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{t('videoRestore.picker.title')}</h3>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            className="text-blue-600 hover:underline disabled:opacity-50 disabled:no-underline"
            disabled={disabled || available.length === 0}
            onClick={() => onSelectedChange(available.map((m) => m.id))}
          >
            {t('videoRestore.picker.selectAll')}
          </button>
          <span className="text-muted-foreground">·</span>
          <button
            type="button"
            className="text-blue-600 hover:underline disabled:opacity-50 disabled:no-underline"
            disabled={disabled || selected.length === 0}
            onClick={() => onSelectedChange([])}
          >
            {t('videoRestore.picker.selectNone')}
          </button>
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          {t('videoRestore.picker.frameGroup')}
        </legend>
        <div className="grid gap-2 sm:grid-cols-3">{frameModels.map(renderCard)}</div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          {t('videoRestore.picker.videoGroup')}
        </legend>
        <div className="grid gap-2 sm:grid-cols-3">{videoModels.map(renderCard)}</div>
      </fieldset>

      <label className={`flex items-start gap-3 rounded-lg border border-border p-3 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-blue-600"
          checked={includeFrames}
          disabled={disabled}
          onChange={(e) => onIncludeFramesChange(e.target.checked)}
        />
        <span className="flex-1">
          <span className="block text-sm font-medium">{t('videoRestore.picker.includeFrames')}</span>
          <span className="block text-xs text-muted-foreground mt-0.5">
            {t('videoRestore.picker.includeFramesHint')}
          </span>
          {includeFrames && (
            <span className="block text-xs text-amber-600 dark:text-amber-400 mt-1">
              {t('videoRestore.picker.includeFramesWarning')}
            </span>
          )}
        </span>
      </label>

      <p className="text-sm text-muted-foreground">
        {selected.length === 0
          ? t('videoRestore.picker.noneSelected')
          : t('videoRestore.picker.runningTotal', {
              count: selected.length,
              estimate: formatEstimate(totalEstSeconds) || '—',
            })}
      </p>
    </div>
  );
};

export default ModelPicker;
