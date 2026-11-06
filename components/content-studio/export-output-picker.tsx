'use client';

import React from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useLocalization } from '@/i18n/useLocalization';
import { analytics, EVENTS } from '@/lib/analytics';
import { publishLimitRefusal } from '@/lib/auth/quotaBus';
import { studioHost } from '@/lib/studio/telemetry';
import {
  CODEC_NAMES,
  bitrateOptions,
  codecOptions,
  containerOptions,
  fitChoice,
  lockFor,
  outputWarnings,
  presetOptions,
  type OptionLock,
  type OutputChoice,
  type StudioOutputAccess,
  type StudioOutputTable,
} from '@/lib/studio/studioOutputs';
import type { ExportMode } from '@/lib/studio/exportOptions';
import type { Tier } from '@/lib/auth/accountApi';

/**
 * MM118: the export dialog's output section. Everyone sees the preset list; Premium and Pro
 * also get an Advanced toggle with container → video → audio pickers filtered by the API's
 * output table (invalid choices greyed with the reason), audio bitrate and channels.
 *
 * Locked options stay VISIBLE with a plan badge: choosing one does not select it, it records
 * `studio_export_format_locked` and opens the same upgrade interstitial a 403
 * format_not_in_plan would (the server still enforces the plan on Export).
 */
export interface ExportOutputPickerProps {
  table: StudioOutputTable;
  access: StudioOutputAccess;
  mode: ExportMode;
  outputPreset: string;
  output: OutputChoice;
  onChange: (next: { mode: ExportMode; outputPreset: string; output: OutputChoice }) => void;
}

const LOCK_VALUE = '__locked__:';

export const ExportOutputPicker: React.FC<ExportOutputPickerProps> = ({ table, access, mode, outputPreset, output, onChange }) => {
  const { t } = useLocalization('interface');
  const presets = presetOptions(access, table);
  const advancedLock = lockFor([], access, true);

  const planName = (r: OptionLock['required']) =>
    r === 'pro' ? 'Pro' : r === 'premium' ? 'Premium' : r === 'free' ? t('contentStudio.export.planFree') : '';

  const hitLock = React.useCallback(
    (lock: OptionLock) => {
      const required = lock.required === 'free' || lock.required === 'premium' || lock.required === 'pro' ? lock.required : undefined;
      if (required) {
        analytics.track(
          EVENTS.STUDIO_EXPORT_FORMAT_LOCKED,
          { option: lock.option, required, tier: (access.tier ?? 'anonymous') as Tier, host: studioHost() },
          { feature: 'studio' },
        );
      }
      // The same dialog a server refusal opens; the upgrade path follows the required plan.
      publishLimitRefusal({
        error: 'format_not_in_plan',
        limitKey: 'studio_format',
        option: lock.option,
        required,
        upgradePath: access.tier === 'anonymous' || required === 'free' ? 'signup' : required,
        fromClick: true,
      });
    },
    [access.tier],
  );

  const badge = (lock: OptionLock | null) =>
    lock && lock.required ? (
      <Badge variant="outline" className="ml-2 gap-1 text-[10px]">
        <Lock aria-hidden />
        {planName(lock.required)}
      </Badge>
    ) : null;

  const warnings = outputWarnings(mode === 'advanced' ? output : presets.find((p) => p.preset.key === outputPreset)?.choice ?? output, table);

  const onPreset = (value: string) => {
    if (value.startsWith(LOCK_VALUE)) {
      const p = presets.find((x) => x.preset.key === value.slice(LOCK_VALUE.length));
      if (p?.lock) hitLock(p.lock);
      return;
    }
    const p = presets.find((x) => x.preset.key === value);
    if (p) onChange({ mode: 'preset', outputPreset: p.preset.key, output: p.choice });
  };

  const setAdvanced = (on: boolean) => {
    if (on && advancedLock) {
      hitLock(advancedLock);
      return;
    }
    const current = presets.find((p) => p.preset.key === outputPreset)?.choice ?? output;
    onChange({ mode: on ? 'advanced' : 'preset', outputPreset, output: on ? current : output });
  };

  const pick = (field: keyof OutputChoice, raw: string) => {
    if (raw.startsWith(LOCK_VALUE)) {
      const [, option, required] = raw.split(':');
      hitLock({ option, required: (required || null) as OptionLock['required'] });
      return;
    }
    const value = field === 'audioBitrate' || field === 'audioChannels' ? Number(raw) : raw;
    const next = fitChoice({ ...output, [field]: value } as OutputChoice, table);
    onChange({ mode: 'advanced', outputPreset, output: next });
  };

  const codecLabel = (key: string) => (key === 'none' ? t('contentStudio.export.noVideo') : CODEC_NAMES[key] ?? key);
  const lockedValue = (lock: OptionLock) => `${LOCK_VALUE}${lock.option}:${lock.required ?? ''}`;

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label>{t('contentStudio.export.format')}</Label>
        <Select value={mode === 'advanced' ? '' : outputPreset} onValueChange={onPreset} disabled={mode === 'advanced'}>
          <SelectTrigger aria-label={t('contentStudio.export.format')}>
            <SelectValue placeholder={t('contentStudio.export.customFormat')} />
          </SelectTrigger>
          <SelectContent>
            {presets.map((p) => (
              <SelectItem key={p.preset.key} value={p.lock ? `${LOCK_VALUE}${p.preset.key}` : p.preset.key}>
                <span className={p.lock ? 'text-muted-foreground' : undefined}>{t(`contentStudio.export.preset_${p.preset.key}`)}</span>
                {badge(p.lock)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="export-advanced" checked={mode === 'advanced'} onCheckedChange={setAdvanced} />
        <Label htmlFor="export-advanced" className="text-sm">
          {t('contentStudio.export.advanced')}
        </Label>
        {badge(advancedLock)}
      </div>

      {mode === 'advanced' && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>{t('contentStudio.export.container')}</Label>
            <Select value={output.container} onValueChange={(v) => pick('container', v)}>
              <SelectTrigger aria-label={t('contentStudio.export.container')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {containerOptions(access, table).map((o) => (
                  <SelectItem key={o.value} value={o.lock ? lockedValue(o.lock) : o.value}>
                    <span className={o.lock ? 'text-muted-foreground' : undefined}>{o.value.toUpperCase()}</span>
                    {badge(o.lock)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(['video', 'audio'] as const).map((kind) => {
            const field = kind === 'video' ? 'videoCodec' : 'audioCodec';
            return (
              <div key={kind} className="space-y-1.5">
                <Label>{t(kind === 'video' ? 'contentStudio.export.videoCodec' : 'contentStudio.export.audioCodec')}</Label>
                <Select value={output[field]} onValueChange={(v) => pick(field, v)}>
                  <SelectTrigger aria-label={t(kind === 'video' ? 'contentStudio.export.videoCodec' : 'contentStudio.export.audioCodec')}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {codecOptions(kind, output.container, access, table, kind === 'audio' ? output.videoCodec : undefined).map((o) => (
                      <SelectItem key={o.value} value={o.lock ? lockedValue(o.lock) : o.value} disabled={!o.valid}>
                        <span className={!o.valid || o.lock ? 'text-muted-foreground' : undefined}>{codecLabel(o.value)}</span>
                        {!o.valid && (
                          <span className="ml-2 text-[10px] text-muted-foreground">
                            {o.invalidBecause === output.container
                              ? t('contentStudio.export.notIn', { container: (o.invalidBecause ?? '').toUpperCase() })
                              : t('contentStudio.export.notWith', { codec: CODEC_NAMES[o.invalidBecause ?? ''] ?? o.invalidBecause })}
                          </span>
                        )}
                        {badge(o.lock)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
          {bitrateOptions(output.audioCodec, table).length > 0 && (
            <div className="space-y-1.5">
              <Label>{t('contentStudio.export.audioBitrate')}</Label>
              <Select value={String(output.audioBitrate)} onValueChange={(v) => pick('audioBitrate', v)}>
                <SelectTrigger aria-label={t('contentStudio.export.audioBitrate')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bitrateOptions(output.audioCodec, table).map((b) => (
                    <SelectItem key={b} value={String(b)}>
                      {t('contentStudio.export.kbps', { value: b })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label>{t('contentStudio.export.audioChannels')}</Label>
            <Select value={String(output.audioChannels)} onValueChange={(v) => pick('audioChannels', v)}>
              <SelectTrigger aria-label={t('contentStudio.export.audioChannels')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {table.channels.map((c) => (
                  <SelectItem key={c} value={String(c)}>
                    {t(c === 1 ? 'contentStudio.export.mono' : 'contentStudio.export.stereo')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <ul className="space-y-1">
          {warnings.map((w) => (
            <li key={w} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
              {t(`contentStudio.export.warning_${w}`)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExportOutputPicker;
