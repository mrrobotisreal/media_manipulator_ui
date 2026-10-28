'use client';

import React from 'react';
import { useLocalization } from '@/i18n/useLocalization';
import type { SavedVoice, VoicePreset } from '@/lib/voices/voicesApi';
import { FIELD, LABEL } from './shared';

/**
 * Pick a saved voice or a preset (MM78 decision 3; MM79 reuses it in Darkroom). A
 * native <select> with two <optgroup>s, so keyboard and screen-reader use is the
 * platform's. Values are `voice:<id>` / `preset:<id>`.
 */
export type VoiceChoice = { kind: 'voice'; id: string } | { kind: 'preset'; id: string };

export function choiceValue(choice: VoiceChoice | null): string {
  return choice ? `${choice.kind}:${choice.id}` : '';
}

export function parseChoice(value: string): VoiceChoice | null {
  const i = value.indexOf(':');
  if (i <= 0) return null;
  const kind = value.slice(0, i);
  const id = value.slice(i + 1);
  if (!id || (kind !== 'voice' && kind !== 'preset')) return null;
  return { kind, id };
}

export const VoicePicker: React.FC<{
  saved: SavedVoice[];
  presets: VoicePreset[];
  value: VoiceChoice | null;
  onChange: (choice: VoiceChoice | null) => void;
  /** Hide saved voices (anonymous visitors only have presets). */
  showSaved?: boolean;
  disabled?: boolean;
  label?: string;
}> = ({ saved, presets, value, onChange, showSaved = true, disabled, label }) => {
  const { t } = useLocalization('interface');
  const id = React.useId();
  const hasSaved = showSaved && saved.length > 0;
  if (!hasSaved && presets.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('voiceTools.picker.none')}</p>;
  }
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label ?? t('voiceTools.picker.label')}
      </label>
      <select id={id} className={FIELD} value={choiceValue(value)} disabled={disabled} onChange={(e) => onChange(parseChoice(e.target.value))}>
        {hasSaved ? (
          <optgroup label={t('voiceTools.picker.saved')}>
            {saved.map((v) => (
              <option key={v.id} value={`voice:${v.id}`}>
                {v.name}
              </option>
            ))}
          </optgroup>
        ) : null}
        {presets.length > 0 ? (
          <optgroup label={t('voiceTools.picker.presets')}>
            {presets.map((p) => (
              <option key={p.id} value={`preset:${p.id}`}>
                {p.name || p.id}
              </option>
            ))}
          </optgroup>
        ) : null}
      </select>
    </div>
  );
};

export default VoicePicker;
