'use client';

import React from 'react';
import { Play, Save } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import { useDesignVoice, usePreviewDesign } from '@/lib/useVoices';
import { VOICE_DESCRIPTION_MAX_CHARS, VOICE_DESIGN_PREVIEWS_PER_DESCRIPTION, VOICE_NAME_MAX_CHARS } from '@/lib/voices/consent';
import { VoiceApiError, previewBlob, type SavedVoice, type VoicesCapabilities } from '@/lib/voices/voicesApi';
import { VoicesSignInPrompt, WarmingUp } from './warming-up';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, FIELD, LABEL, Spinner, VoiceError, VoiceNote, useDefaultVoiceLanguage, useLanguageName, useVoiceErrorMessage } from './shared';

/**
 * Describe a voice, preview it, keep it (MM78 decision 3; MM77 §10.4).
 *
 * Previews are uncounted but limited: 3 per description (and language) per hour on the
 * server. The counter here mirrors it: "previews left: n of 3" counts down per
 * description, Preview is disabled at 0 with a message, and a changed description
 * starts again at 3. A 429 `preview_limit` from the server (another tab, a reload) sets
 * the counter to 0 as well. "Keep this voice" sends the seed the last preview returned,
 * so the kept voice is exactly the one heard.
 *
 * Chips append an English trait to the description (Qwen3-TTS reads descriptions best
 * in English; the visible chip label is translated).
 */
export const DESIGN_CHIPS = {
  gender: { female: 'female', male: 'male', neutral: 'androgynous' },
  age: { young: 'young adult', middleAged: 'middle-aged', older: 'older' },
  accent: { american: 'American accent', british: 'British accent', australian: 'Australian accent', irish: 'Irish accent' },
  tone: { warm: 'warm', bright: 'bright', deep: 'deep', raspy: 'slightly raspy', soft: 'soft-spoken' },
  pace: { slow: 'slow pace', measured: 'measured pace', fast: 'fast pace' },
} as const;

/** Append a trait to a description, comma-separated, once. */
export function appendTrait(description: string, trait: string): string {
  const d = description.trim().replace(/[,\s]+$/, '');
  if (!d) return trait;
  if (d.toLowerCase().split(/,\s*/).includes(trait.toLowerCase())) return d;
  return `${d}, ${trait}`;
}

/** The key the server's preview limit is per: description (case-insensitive) + language. */
export function previewKey(description: string, language: string): string {
  return `${description.trim().toLowerCase()}|${language}`;
}

interface PreviewState {
  url: string;
  seed: number;
  key: string;
}

export const VoiceDesigner: React.FC<{
  caps: VoicesCapabilities;
  signedIn: boolean;
  onKept: (voice: SavedVoice) => void;
}> = ({ caps, signedIn, onKept }) => {
  const { t } = useLocalization('interface');
  const languageName = useLanguageName();
  const errorMessage = useVoiceErrorMessage();
  const id = React.useId();
  const [description, setDescription] = React.useState('');
  const defaultLanguage = useDefaultVoiceLanguage(caps.designLanguages);
  const [language, setLanguage] = React.useState<string | null>(null);
  const lang = language && caps.designLanguages.includes(language) ? language : defaultLanguage;
  const [used, setUsed] = React.useState<Record<string, number>>({});
  const [preview, setPreview] = React.useState<PreviewState | null>(null);
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [kept, setKept] = React.useState(false);
  const previewMutation = usePreviewDesign();
  const keepMutation = useDesignVoice();

  const key = previewKey(description, lang);
  const left = Math.max(0, VOICE_DESIGN_PREVIEWS_PER_DESCRIPTION - (used[key] ?? 0));
  const trimmed = description.trim();
  const tooLong = [...trimmed].length > VOICE_DESCRIPTION_MAX_CHARS;
  const canPreview = !!trimmed && !tooLong && left > 0 && !previewMutation.isPending;
  // The kept voice must be the one heard: same description and language as the preview.
  const previewMatches = !!preview && preview.key === key;
  const nameOk = name.trim().length >= 1 && [...name.trim()].length <= VOICE_NAME_MAX_CHARS;

  // Revoke the preview's object URL when it is replaced or the panel unmounts.
  React.useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview.url);
  }, [preview]);

  const runPreview = () => {
    if (!canPreview) return;
    setError(null);
    setKept(false);
    const k = key;
    previewMutation.mutate(
      { description: trimmed, language: lang },
      {
        onSuccess: (res) => {
          setUsed((u) => ({ ...u, [k]: (u[k] ?? 0) + 1 }));
          setPreview({ url: URL.createObjectURL(previewBlob(res)), seed: res.seed, key: k });
        },
        onError: (err) => {
          if (err instanceof VoiceApiError && err.code === 'preview_limit') {
            setUsed((u) => ({ ...u, [k]: VOICE_DESIGN_PREVIEWS_PER_DESCRIPTION }));
          }
          setError(errorMessage(err));
        },
      },
    );
  };

  const keep = () => {
    if (!preview || !previewMatches || !nameOk || !signedIn) return;
    setError(null);
    keepMutation.mutate(
      { name: name.trim(), description: trimmed, language: lang, seed: preview.seed },
      {
        onSuccess: (voice) => {
          setKept(true);
          onKept(voice);
        },
        onError: (err) => setError(errorMessage(err)),
      },
    );
  };

  return (
    <section className="space-y-4" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="text-base font-semibold text-foreground">
        {t('voiceTools.designer.title')}
      </h3>
      <div>
        <label htmlFor={`${id}-desc`} className={LABEL}>
          {t('voiceTools.designer.descriptionLabel')}
        </label>
        <textarea
          id={`${id}-desc`}
          className={`${FIELD} min-h-24`}
          value={description}
          placeholder={t('voiceTools.designer.placeholder')}
          aria-describedby={`${id}-hint`}
          aria-invalid={tooLong || undefined}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted-foreground">
          {t('voiceTools.designer.hint')}
        </p>
      </div>
      <div className="space-y-2">
        {(Object.keys(DESIGN_CHIPS) as Array<keyof typeof DESIGN_CHIPS>).map((group) => (
          <div key={group} role="group" aria-label={t(`voiceTools.designer.chipGroups.${group}`)} className="flex flex-wrap items-center gap-2">
            <span className="w-20 shrink-0 text-xs text-muted-foreground">{t(`voiceTools.designer.chipGroups.${group}`)}</span>
            {Object.entries(DESIGN_CHIPS[group]).map(([chip, trait]) => (
              <button
                key={chip}
                type="button"
                className="min-h-8 rounded-full border border-edge px-3 text-xs text-foreground transition-colors hover:bg-surface-2"
                onClick={() => setDescription((d) => appendTrait(d, trait))}
              >
                {t(`voiceTools.designer.chips.${chip}`)}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div>
        <label htmlFor={`${id}-lang`} className={LABEL}>
          {t('voiceTools.designer.languageLabel')}
        </label>
        <select id={`${id}-lang`} className={FIELD} value={lang} onChange={(e) => setLanguage(e.target.value)}>
          {caps.designLanguages.map((l) => (
            <option key={l} value={l}>
              {languageName(l)}
            </option>
          ))}
        </select>
        <VoiceNote className="mt-1">{t('voiceTools.designer.languageNote')}</VoiceNote>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={BUTTON_SECONDARY} disabled={!canPreview} onClick={runPreview}>
          {previewMutation.isPending ? <Spinner /> : <Play aria-hidden="true" className="size-4" />}
          {previewMutation.isPending ? t('voiceTools.designer.previewing') : t('voiceTools.designer.preview')}
        </button>
        <span aria-live="polite" className="text-sm tabular-nums text-muted-foreground" data-testid="previews-left">
          {t('voiceTools.designer.previewsLeft', { left, max: VOICE_DESIGN_PREVIEWS_PER_DESCRIPTION })}
        </span>
      </div>
      {left === 0 && trimmed ? (
        <p className="text-sm text-muted-foreground" data-testid="previews-used">
          {t('voiceTools.designer.previewsUsed')}
        </p>
      ) : null}
      <WarmingUp warm={caps.warm} inFlight={previewMutation.isPending || keepMutation.isPending} />
      {preview ? (
        <audio controls src={preview.url} className="w-full" aria-label={t('voiceTools.designer.previewLabel')} data-testid="design-preview" />
      ) : null}
      {preview ? (
        signedIn ? (
          <div className="space-y-3 rounded-lg border border-edge p-3">
            <p className="font-medium text-foreground">{t('voiceTools.designer.keepTitle')}</p>
            <div>
              <label htmlFor={`${id}-name`} className={LABEL}>
                {t('voiceTools.designer.nameLabel')}
              </label>
              <input
                id={`${id}-name`}
                className={FIELD}
                value={name}
                maxLength={VOICE_NAME_MAX_CHARS}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button type="button" className={BUTTON_PRIMARY} disabled={!previewMatches || !nameOk || keepMutation.isPending} onClick={keep}>
              {keepMutation.isPending ? <Spinner /> : <Save aria-hidden="true" className="size-4" />}
              {keepMutation.isPending ? t('voiceTools.designer.keeping') : t('voiceTools.designer.keep')}
            </button>
            {kept ? (
              <p role="status" className="text-sm text-success">
                {t('voiceTools.designer.kept')}
              </p>
            ) : null}
          </div>
        ) : (
          <VoicesSignInPrompt source="voice_designer_keep" />
        )
      ) : null}
      <VoiceError message={error} />
    </section>
  );
};

export default VoiceDesigner;
