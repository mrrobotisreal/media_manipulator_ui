'use client';

import React from 'react';
import { Info, Loader2 } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import { VoiceApiError, voiceErrorKey, voiceErrorValues } from '@/lib/voices/voicesApi';
import { cn } from '@/lib/utils';

/**
 * Small pieces every voices panel shares (MM78). Copy comes from panels.json
 * `voiceTools.*`, merged by the tool page's shard loader.
 */

export const BUTTON_PRIMARY =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 font-medium text-primary-foreground transition-colors hover:bg-[var(--accent-primary-hover)] disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-muted-foreground';
export const BUTTON_SECONDARY =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-edge px-4 py-2 text-sm text-foreground transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50';
export const FIELD = 'w-full rounded-lg border border-input bg-input p-2 text-sm text-card-foreground';
export const LABEL = 'mb-1 block text-sm font-medium text-card-foreground';

/** The localized message for a failed voices request. */
export function useVoiceErrorMessage(): (err: unknown) => string {
  const { t } = useLocalization('interface');
  return React.useCallback(
    (err: unknown) => {
      if (err instanceof VoiceApiError) return t(voiceErrorKey(err.code), voiceErrorValues(err));
      return t('voiceTools.errors.generic');
    },
    [t],
  );
}

/** An inline error line, announced to screen readers. */
export const VoiceError: React.FC<{ message: string | null; className?: string }> = ({ message, className }) =>
  message ? (
    <p role="alert" className={cn('rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive', className)}>
      {message}
    </p>
  ) : null;

/** A short informational note. */
export const VoiceNote: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <p className={cn('flex items-start gap-2 text-xs leading-relaxed text-muted-foreground', className)}>
    <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" />
    <span>{children}</span>
  </p>
);

export const Spinner: React.FC = () => <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />;

/** Display name of a language code in the page's language ("de" → "Deutsch" / "German"). */
export function useLanguageName(): (code: string) => string {
  const { language } = useLocalization('interface');
  const locale = language?.code ?? 'en-US';
  return React.useMemo(() => {
    let names: Intl.DisplayNames | null = null;
    try {
      names = new Intl.DisplayNames([locale], { type: 'language' });
    } catch {
      names = null;
    }
    return (code: string) => {
      try {
        return names?.of(code) ?? code;
      } catch {
        return code;
      }
    };
  }, [locale]);
}

/** The page language as a voices language code when it is in `list`, else `fallback`. */
export function useDefaultVoiceLanguage(list: readonly string[], fallback = 'en'): string {
  const { language } = useLocalization('interface');
  const code = (language?.code ?? 'en').slice(0, 2).toLowerCase();
  return list.includes(code) ? code : list.includes(fallback) ? fallback : (list[0] ?? fallback);
}
