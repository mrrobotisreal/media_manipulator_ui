'use client';

import React from 'react';
import Link from 'next/link';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import type { SavedVoice, VoicesList } from '@/lib/voices/voicesApi';
import { useLanguageName } from './shared';

/** "n of N voices saved" (N = -1 is unlimited, the operator row). */
export function usageText(t: (k: string, o?: Record<string, unknown>) => string, list: Pick<VoicesList, 'used' | 'limit'>): string {
  return list.limit < 0
    ? t('voiceTools.clone.usageUnlimited', { used: list.used })
    : t('voiceTools.clone.usage', { used: list.used, limit: list.limit });
}

/**
 * The caller's saved voices on a tool page (MM78 decision 4): name, kind, language, the
 * preview MP3 (a short-lived presigned URL from the API) and "Use this voice". Rename and
 * delete live in Account → Voices.
 */
export const MyVoices: React.FC<{
  list: VoicesList;
  selectedId?: string | null;
  onUse?: (voice: SavedVoice) => void;
}> = ({ list, selectedId, onUse }) => {
  const { t } = useLocalization('interface');
  const localized = useLocalizedHref();
  const languageName = useLanguageName();
  return (
    <section className="space-y-3" aria-label={t('voiceTools.myVoices.title')}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">{t('voiceTools.myVoices.title')}</h3>
        <span className="num text-xs text-muted-foreground" data-testid="my-voices-usage">
          {usageText(t, list)}
        </span>
      </div>
      {list.voices.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('voiceTools.myVoices.empty')}</p>
      ) : (
        <ul className="divide-y divide-edge rounded-lg border border-edge">
          {list.voices.map((v) => (
            <li key={v.id} className="flex flex-wrap items-center gap-3 p-3" data-testid="my-voice">
              <div className="min-w-40 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{v.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t(`voiceTools.myVoices.kinds.${v.kind}`)} · {languageName(v.languageHint)}
                </p>
              </div>
              {v.previewUrl ? (
                <audio controls preload="none" src={v.previewUrl} className="h-9 max-w-full" aria-label={t('voiceTools.myVoices.preview', { name: v.name })} />
              ) : null}
              {onUse ? (
                <button
                  type="button"
                  aria-pressed={selectedId === v.id}
                  className="min-h-9 rounded-lg border border-edge px-3 text-sm text-foreground transition-colors hover:bg-surface-2 aria-pressed:border-primary"
                  onClick={() => onUse(v)}
                >
                  {selectedId === v.id ? t('voiceTools.myVoices.inUse') : t('voiceTools.myVoices.use')}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      <Link href={`${localized('/account')}?tab=voices`} className="inline-flex text-sm text-primary underline decoration-primary/40 underline-offset-2">
        {t('voiceTools.myVoices.manage')}
      </Link>
    </section>
  );
};

export default MyVoices;
