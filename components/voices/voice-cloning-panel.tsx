'use client';

import React from 'react';
import { UserPlus } from 'lucide-react';
import { QuotaChip } from '@/components/quota-chip';
import { useLocalization } from '@/i18n/useLocalization';
import { useCreateVoice, useVoices } from '@/lib/useVoices';
import { VOICE_CONSENT_TEXT_VERSION, VOICE_NAME_MAX_CHARS } from '@/lib/voices/consent';
import type { SavedVoice, VoicesCapabilities } from '@/lib/voices/voicesApi';
import { ConsentGate } from './consent-gate';
import { MyVoices } from './my-voices';
import { SpeakPanel } from './speak-panel';
import { VoiceRecorderPanel, clipPassesGate, type VoiceClip } from './voice-recorder-panel';
import { VoiceToolFrame } from './voice-tool-frame';
import type { VoiceChoice } from './voice-picker';
import { VoicesSignInPrompt, WarmingUp } from './warming-up';
import { BUTTON_PRIMARY, FIELD, LABEL, Spinner, VoiceError, useDefaultVoiceLanguage, useLanguageName, useVoiceErrorMessage } from './shared';

/**
 * /tools/voice-cloning (task `voice_clone`, MM78 decision 4): record or upload 5 to 60 s
 * → consent → Create voice (synchronous, one ai_ops: the 6-language preview) → My voices
 * → speak. Anonymous visitors get the sign-in prompt instead of the create form (nothing
 * is uploaded), and can still speak with a preset voice.
 */
export const CloneForm: React.FC<{ caps: VoicesCapabilities; onCreated: (voice: SavedVoice) => void; atLimit: boolean }> = ({
  caps,
  onCreated,
  atLimit,
}) => {
  const { t } = useLocalization('interface');
  const languageName = useLanguageName();
  const errorMessage = useVoiceErrorMessage();
  const id = React.useId();
  const [clip, setClip] = React.useState<VoiceClip | null>(null);
  const [consent, setConsent] = React.useState(false);
  const [name, setName] = React.useState('');
  const defaultLanguage = useDefaultVoiceLanguage(caps.languages);
  const [language, setLanguage] = React.useState<string | null>(null);
  const lang = language ?? defaultLanguage;
  const [error, setError] = React.useState<string | null>(null);
  const [created, setCreated] = React.useState(false);
  const create = useCreateVoice();
  const nameOk = name.trim().length >= 1 && [...name.trim()].length <= VOICE_NAME_MAX_CHARS;
  const canCreate = clipPassesGate(clip) && consent && nameOk && !atLimit && !create.isPending;

  const submit = () => {
    if (!clip || !canCreate) return;
    setError(null);
    setCreated(false);
    create.mutate(
      {
        reference: clip.file,
        fileName: clip.file.name,
        name: name.trim(),
        languageHint: lang,
        consent: true,
        consentTextVersion: VOICE_CONSENT_TEXT_VERSION,
      },
      {
        onSuccess: (voice) => {
          setCreated(true);
          setClip(null);
          setConsent(false);
          setName('');
          onCreated(voice);
        },
        onError: (err) => setError(errorMessage(err)),
      },
    );
  };

  return (
    <section className="space-y-4" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="text-base font-semibold text-foreground">
        {t('voiceTools.clone.title')}
      </h3>
      <VoiceRecorderPanel gate="reference" clip={clip} onClip={setClip} disabled={create.isPending} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={LABEL}>
            {t('voiceTools.clone.nameLabel')}
          </label>
          <input
            id={`${id}-name`}
            className={FIELD}
            value={name}
            maxLength={VOICE_NAME_MAX_CHARS}
            placeholder={t('voiceTools.clone.namePlaceholder')}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`${id}-lang`} className={LABEL}>
            {t('voiceTools.clone.languageLabel')}
          </label>
          <select id={`${id}-lang`} className={FIELD} value={lang} onChange={(e) => setLanguage(e.target.value)}>
            {caps.languages.map((l) => (
              <option key={l} value={l}>
                {languageName(l)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ConsentGate checked={consent} onChange={setConsent} disabled={create.isPending} />
      <button type="button" className={`${BUTTON_PRIMARY} w-full`} disabled={!canCreate} onClick={submit}>
        {create.isPending ? <Spinner /> : <UserPlus aria-hidden="true" className="size-4" />}
        {create.isPending ? t('voiceTools.clone.creating') : t('voiceTools.clone.create')}
      </button>
      <WarmingUp warm={caps.warm} inFlight={create.isPending} />
      {created ? (
        <p role="status" className="text-sm text-success">
          {t('voiceTools.clone.created')}
        </p>
      ) : null}
      <VoiceError message={error} />
    </section>
  );
};

export const VoiceCloningPanel: React.FC = () => (
  <VoiceToolFrame>{({ caps, signedIn }) => <CloningBody caps={caps} signedIn={signedIn} />}</VoiceToolFrame>
);

export const CloningBody: React.FC<{ caps: VoicesCapabilities; signedIn: boolean }> = ({ caps, signedIn }) => {
  const { t } = useLocalization('interface');
  const voices = useVoices(signedIn);
  const [choice, setChoice] = React.useState<VoiceChoice | null>(null);
  const list = voices.data;
  const atLimit = !!list && list.limit >= 0 && list.used >= list.limit;
  return (
    <div className="space-y-6">
      <QuotaChip metric="ai_ops" />
      {!signedIn ? (
        <VoicesSignInPrompt source="voice_cloning" />
      ) : caps.limits.voicesSaved === 0 ? (
        <p className="text-sm text-muted-foreground">{t('voiceTools.clone.noSaving')}</p>
      ) : (
        <>
          {atLimit && list ? (
            <p className="rounded-lg border border-premium/40 bg-premium/10 p-3 text-sm text-foreground" data-testid="clone-at-limit">
              {t('voiceTools.clone.limitReached', { used: list.used, limit: list.limit })}
            </p>
          ) : null}
          <CloneForm caps={caps} atLimit={atLimit} onCreated={(v) => setChoice({ kind: 'voice', id: v.id })} />
          {list ? <MyVoices list={list} selectedId={choice?.kind === 'voice' ? choice.id : null} onUse={(v) => setChoice({ kind: 'voice', id: v.id })} /> : null}
        </>
      )}
      <SpeakPanel caps={caps} saved={signedIn ? (list?.voices ?? []) : []} initialChoice={choice} signedIn={signedIn} />
    </div>
  );
};

export default VoiceCloningPanel;
