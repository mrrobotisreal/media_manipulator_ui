'use client';

import React from 'react';
import { useLocalization } from '@/i18n/useLocalization';
import { VOICE_CONSENT_TEXT_VERSION } from '@/lib/voices/consent';

/**
 * The consent checkbox for a cloned voice (MM78 decision 3, design VOICES.md §4.4). The
 * caller keeps Create disabled until it is ticked, and sends `consent: true` plus
 * VOICE_CONSENT_TEXT_VERSION, which the Terms' Voices section names.
 */
export const ConsentGate: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }> = ({
  checked,
  onChange,
  disabled,
}) => {
  const { t } = useLocalization('interface');
  const id = React.useId();
  return (
    <div className="rounded-lg border border-edge bg-surface-1/60 p-3">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          className="mt-1 size-4 shrink-0 accent-[var(--accent-primary)]"
          checked={checked}
          disabled={disabled}
          aria-describedby={`${id}-note`}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {t('voiceTools.consent.label')}
        </label>
      </div>
      <p id={`${id}-note`} className="mt-2 ps-7 text-xs text-muted-foreground">
        {t('voiceTools.consent.note', { version: VOICE_CONSENT_TEXT_VERSION })}
      </p>
    </div>
  );
};

export default ConsentGate;
