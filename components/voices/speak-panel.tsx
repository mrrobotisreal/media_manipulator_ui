'use client';

import React from 'react';
import { AudioLines } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import type { ConversionJob } from '@/lib/useGetJobStatus';
import { useSpeak, useSpeakPreset } from '@/lib/useVoices';
import {
  VOICE_EXAGGERATION_DEFAULT,
  VOICE_EXAGGERATION_MAX,
  VOICE_EXAGGERATION_MIN,
} from '@/lib/voices/consent';
import type { SavedVoice, VoicesCapabilities } from '@/lib/voices/voicesApi';
import { VoiceJobResult, jobFromStart } from './voice-job-result';
import { VoicePicker, type VoiceChoice } from './voice-picker';
import { WarmingUp } from './warming-up';
import { BUTTON_PRIMARY, FIELD, LABEL, Spinner, VoiceError, useDefaultVoiceLanguage, useLanguageName, useVoiceErrorMessage } from './shared';

/**
 * Generate speech (MM78 decision 3): text with a live counter against the tier's cap
 * (capabilities `limits.textMaxChars` = voicesMaxSeconds × 18), a language from the
 * capabilities list, Chatterbox's emotion slider (0.25 to 2, default 0.5, saved voices
 * only: the preset route ignores it) and Generate. Saved voices need an account;
 * presets run for everyone within the anonymous ai_ops allowance.
 */
export function presetLanguages(caps: VoicesCapabilities, presetId: string): string[] {
  const p = caps.presets.find((x) => x.id === presetId);
  return p?.languages && p.languages.length > 0 ? p.languages : caps.languages;
}

export const SpeakPanel: React.FC<{
  caps: VoicesCapabilities;
  saved: SavedVoice[];
  /** Pre-selected voice (the one just created or kept). */
  initialChoice?: VoiceChoice | null;
  signedIn: boolean;
}> = ({ caps, saved, initialChoice, signedIn }) => {
  const { t } = useLocalization('interface');
  const languageName = useLanguageName();
  const errorMessage = useVoiceErrorMessage();
  const fallbackChoice: VoiceChoice | null =
    initialChoice ?? (signedIn && saved[0] ? { kind: 'voice', id: saved[0].id } : caps.presets[0] ? { kind: 'preset', id: caps.presets[0].id } : null);
  // A newly created / kept voice (initialChoice changes) wins over an earlier pick:
  // the pick is remembered together with the initialChoice it was made under.
  const [picked, setPicked] = React.useState<{ under: VoiceChoice | null | undefined; choice: VoiceChoice | null } | null>(null);
  const choice = picked && picked.under === initialChoice ? picked.choice : null;
  const setChoice = (c: VoiceChoice | null) => setPicked({ under: initialChoice, choice: c });
  const effective = choice ?? fallbackChoice;
  const languages = effective?.kind === 'preset' ? presetLanguages(caps, effective.id) : caps.languages;
  const defaultLanguage = useDefaultVoiceLanguage(languages);
  const [language, setLanguage] = React.useState<string | null>(null);
  const lang = language && languages.includes(language) ? language : defaultLanguage;
  const [text, setText] = React.useState('');
  const [exaggeration, setExaggeration] = React.useState(VOICE_EXAGGERATION_DEFAULT);
  const [job, setJob] = React.useState<ConversionJob | null>(null);
  // The language the running job was requested in (voice_generated, MM79).
  const [jobLanguage, setJobLanguage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const speak = useSpeak();
  const speakPreset = useSpeakPreset();
  const pending = speak.isPending || speakPreset.isPending;
  const counterId = React.useId();

  const max = caps.limits.textMaxChars;
  const used = [...text.trim()].length;
  const over = used > max;
  const running = !!job && job.status !== 'completed' && job.status !== 'failed';
  const canGenerate = !!effective && used > 0 && !over && max > 0 && !pending && !running;

  const generate = () => {
    if (!effective || !canGenerate) return;
    setError(null);
    setJob(null);
    const onSuccess = (res: { jobId: string }) => {
      setJobLanguage(lang);
      setJob(jobFromStart(res.jobId));
    };
    const onError = (err: unknown) => setError(errorMessage(err));
    if (effective.kind === 'voice') {
      speak.mutate({ voiceId: effective.id, text: text.trim(), language: lang, exaggeration }, { onSuccess, onError });
    } else {
      speakPreset.mutate({ preset: effective.id, text: text.trim(), language: lang }, { onSuccess, onError });
    }
  };

  return (
    <section className="space-y-4" aria-labelledby={`${counterId}-title`}>
      <h3 id={`${counterId}-title`} className="text-base font-semibold text-foreground">
        {t('voiceTools.speak.title')}
      </h3>
      <VoicePicker saved={saved} presets={caps.presets} value={effective} onChange={setChoice} showSaved={signedIn} disabled={pending} />
      <div>
        <label htmlFor={`${counterId}-text`} className={LABEL}>
          {t('voiceTools.speak.textLabel')}
        </label>
        <textarea
          id={`${counterId}-text`}
          className={`${FIELD} min-h-32`}
          value={text}
          placeholder={t('voiceTools.speak.placeholder')}
          aria-describedby={counterId}
          aria-invalid={over || undefined}
          onChange={(e) => setText(e.target.value)}
        />
        <p id={counterId} aria-live="polite" className={`mt-1 text-xs tabular-nums ${over ? 'text-destructive' : 'text-muted-foreground'}`} data-testid="speak-counter">
          {t('voiceTools.speak.counter', { used, max })}
          {over ? ` · ${t('voiceTools.speak.overLimit', { max })}` : ''}
        </p>
        {max <= 0 ? <p className="text-sm text-muted-foreground">{t('voiceTools.speak.notAllowed')}</p> : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${counterId}-lang`} className={LABEL}>
            {t('voiceTools.speak.languageLabel')}
          </label>
          <select id={`${counterId}-lang`} className={FIELD} value={lang} onChange={(e) => setLanguage(e.target.value)}>
            {languages.map((l) => (
              <option key={l} value={l}>
                {languageName(l)}
              </option>
            ))}
          </select>
        </div>
        {effective?.kind === 'voice' ? (
          <div>
            <label htmlFor={`${counterId}-ex`} className={LABEL}>
              {t('voiceTools.speak.exaggerationLabel')} <span className="num text-muted-foreground">{exaggeration.toFixed(2)}</span>
            </label>
            <input
              id={`${counterId}-ex`}
              type="range"
              className="w-full accent-[var(--accent-primary)]"
              min={VOICE_EXAGGERATION_MIN}
              max={VOICE_EXAGGERATION_MAX}
              step={0.05}
              value={exaggeration}
              aria-describedby={`${counterId}-ex-hint`}
              onChange={(e) => setExaggeration(Number(e.target.value))}
            />
            <p id={`${counterId}-ex-hint`} className="text-xs text-muted-foreground">
              {t('voiceTools.speak.exaggerationHint')}
            </p>
          </div>
        ) : null}
      </div>
      <button type="button" className={`${BUTTON_PRIMARY} w-full`} disabled={!canGenerate} onClick={generate}>
        {pending ? <Spinner /> : <AudioLines aria-hidden="true" className="size-4" />}
        {pending ? t('voiceTools.speak.generating') : t('voiceTools.speak.generate')}
      </button>
      <WarmingUp warm={caps.warm} inFlight={pending || running} />
      <VoiceError message={error} />
      {job ? <VoiceJobResult job={job} setJob={setJob} task="voice_tts" language={jobLanguage ?? undefined} fallbackFileName="speech_voice.mp3" onRunAnother={() => setJob(null)} /> : null}
    </section>
  );
};

export default SpeakPanel;
