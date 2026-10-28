'use client';

import React from 'react';
import { useLocalization } from '@/i18n/useLocalization';
import { Segmented } from '@/components/darkroom/segmented';
import { VOICE_SHIFT_MAX_SEMITONES, VOICE_SHIFT_PRESETS, clampSemitones, type Formant, type ShiftPreset } from '@/lib/voices/shift';
import { LABEL } from './shared';

/**
 * The shifter controls (MM78 decision 3): a ±12 semitone slider, the formant toggle and
 * preset chips that set the pair MM77's Go table defines (lib/voices/shift.ts mirrors
 * it). Instant (rubberband on the server, no model) and counted as one `ops`.
 * Moving the slider or the toggle after a preset clears the preset, so the request
 * carries exactly what is on screen.
 */
export interface ShiftSettings {
  semitones: number;
  formant: Formant;
  preset: ShiftPreset['id'] | null;
}

export const DEFAULT_SHIFT: ShiftSettings = { semitones: 0, formant: 'preserved', preset: null };

export function applyPreset(id: ShiftPreset['id']): ShiftSettings {
  const p = VOICE_SHIFT_PRESETS.find((x) => x.id === id)!;
  return { semitones: p.semitones, formant: p.formant, preset: p.id };
}

export const VoiceShifter: React.FC<{
  value: ShiftSettings;
  onChange: (next: ShiftSettings) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
  const { t } = useLocalization('interface');
  const id = React.useId();
  return (
    <div className="space-y-4">
      <div role="group" aria-label={t('voiceTools.shifter.presetsLabel')} className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">{t('voiceTools.shifter.presetsLabel')}</span>
        {VOICE_SHIFT_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled={disabled}
            aria-pressed={value.preset === p.id}
            className={`min-h-8 rounded-full border px-3 text-xs transition-colors ${
              value.preset === p.id ? 'border-primary bg-primary/15 text-foreground' : 'border-edge text-foreground hover:bg-surface-2'
            }`}
            onClick={() => onChange(applyPreset(p.id))}
          >
            {t(`voiceTools.shifter.presets.${p.id}`)}
          </button>
        ))}
      </div>
      <div>
        <label htmlFor={`${id}-st`} className={LABEL}>
          {t('voiceTools.shifter.semitonesLabel')}{' '}
          <span className="num text-muted-foreground" aria-live="polite">
            {t('voiceTools.shifter.semitonesValue', { value: value.semitones > 0 ? `+${value.semitones}` : String(value.semitones) })}
          </span>
        </label>
        <input
          id={`${id}-st`}
          type="range"
          className="w-full accent-[var(--accent-primary)]"
          min={-VOICE_SHIFT_MAX_SEMITONES}
          max={VOICE_SHIFT_MAX_SEMITONES}
          step={1}
          value={value.semitones}
          disabled={disabled}
          onChange={(e) => onChange({ ...value, semitones: clampSemitones(Number(e.target.value)), preset: null })}
        />
      </div>
      <Segmented<Formant>
        name={`${id}-formant`}
        label={t('voiceTools.shifter.formantLabel')}
        value={value.formant}
        onValueChange={(formant) => onChange({ ...value, formant, preset: null })}
        options={[
          { value: 'preserved', label: t('voiceTools.shifter.formants.preserved') },
          { value: 'shifted', label: t('voiceTools.shifter.formants.shifted') },
        ]}
      />
    </div>
  );
};

export default VoiceShifter;
