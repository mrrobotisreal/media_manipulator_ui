'use client';

import * as React from 'react';
import { ExternalLink } from 'lucide-react';

import { analytics, EVENTS } from '@/lib/analytics';
import { VOICE_DEMO_LANGUAGES, VOICES, type Voice } from '@/content/voices';
import { cn } from '@/lib/utils';

/**
 * Playable demos of Mitchell Wintrow's two ElevenLabs voices: one language
 * picker drives both clips, and each voice links to its ElevenLabs page.
 *
 * A client island with no i18n of its own. The server wrapper
 * (`voice-showcase-section.tsx`) resolves every string for the page's locale,
 * so pages.json never ships to the browser.
 *
 * `placement` names the surface (`voices_page`, `home`, `darkroom`) so plays
 * and click-throughs can be compared by surface. Audio is `preload="none"`:
 * nothing downloads until someone presses play.
 *
 * Analytics:
 *   feature_used { feature: 'voice_demo', action: 'play',     value: { voice, lang, placement } }
 *     once per voice + language per mount
 *   feature_used { feature: 'voice_demo', action: 'complete', value: { voice, lang, placement } }
 *   feature_used { feature: 'voice_demo', action: 'language', value: { lang, placement } }
 *   cta_clicked  { cta_id: 'elevenlabs_voice_<id>', placement, href }   the conversion
 */

export interface VoiceCopy {
  role: string;
  description: string;
  demoTitle: string;
  demoDescription: string;
  useVoice: string;
}

export interface VoiceShowcaseCopy {
  languageLabel: string;
  languageHint: string;
  voices: Record<Voice['id'], VoiceCopy>;
}

export type VoicePlacement = 'voices_page' | 'home' | 'darkroom';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, '0')}`;

function VoiceCard({
  voice,
  copy,
  lang,
  langLabel,
  placement,
  compact,
}: {
  voice: Voice;
  copy: VoiceCopy;
  lang: string;
  langLabel: string;
  placement: VoicePlacement;
  compact: boolean;
}) {
  const ref = React.useRef<HTMLAudioElement>(null);
  const reported = React.useRef(new Set<string>());
  const rendition = voice.renditions.find((r) => r.lang === lang) ?? voice.renditions[0];

  // <source> children change with the language; reload so the new one plays.
  // Skipped on mount, where load() would fetch the file despite preload="none".
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    ref.current?.pause();
    ref.current?.load();
  }, [rendition.lang]);

  const value = { voice: voice.id, lang: rendition.lang, placement };

  return (
    <figure className="flex h-full flex-col gap-3 rounded-md border border-edge bg-surface-2/40 p-4">
      <figcaption className="space-y-1">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-base font-semibold text-foreground">{voice.name}</span>
          <span className="text-xs uppercase tracking-wider text-data">{copy.role}</span>
        </span>
        {!compact && <span className="block text-sm text-muted-foreground">{copy.description}</span>}
        <span className="block text-sm text-card-foreground">
          <bdi>{copy.demoTitle}</bdi>{' '}
          <span className="text-muted-foreground">
            · <bdi>{langLabel}</bdi> · <span className="num">{fmt(rendition.durationSeconds)}</span>
          </span>
        </span>
        {!compact && <span className="block text-xs text-muted-foreground">{copy.demoDescription}</span>}
      </figcaption>
      <audio
        ref={ref}
        controls
        preload="none"
        lang={rendition.lang}
        aria-label={`${voice.name}: ${copy.demoTitle} (${langLabel})`}
        className="mt-auto w-full"
        onPlay={(e) => {
          // One demo at a time across the page.
          document.querySelectorAll('audio').forEach((a) => a !== e.currentTarget && a.pause());
          const key = `${voice.id}:${rendition.lang}`;
          if (!reported.current.has(key)) {
            reported.current.add(key);
            analytics.track(EVENTS.FEATURE_USED, { feature: 'voice_demo', action: 'play', value });
          }
        }}
        onEnded={() =>
          analytics.track(EVENTS.FEATURE_USED, { feature: 'voice_demo', action: 'complete', value })
        }
      >
        {rendition.sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </audio>
      <a
        href={voice.elevenLabsUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          analytics.track(EVENTS.CTA_CLICKED, {
            cta_id: `elevenlabs_voice_${voice.id.replace(/-/g, '_')}`,
            placement,
            href: voice.elevenLabsUrl,
          })
        }
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
      >
        {copy.useVoice}
        <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
      </a>
    </figure>
  );
}

export function VoiceShowcase({
  copy,
  placement,
  defaultLang = VOICE_DEMO_LANGUAGES[0].code,
  compact = false,
  className,
}: {
  copy: VoiceShowcaseCopy;
  placement: VoicePlacement;
  defaultLang?: string;
  /** Hide the longer descriptions, for panels on busier pages. */
  compact?: boolean;
  className?: string;
}) {
  const [lang, setLang] = React.useState(defaultLang);
  const current = VOICE_DEMO_LANGUAGES.find((l) => l.code === lang) ?? VOICE_DEMO_LANGUAGES[0];
  const selectId = React.useId();

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <label htmlFor={selectId} className="font-medium text-foreground">
          {copy.languageLabel}
        </label>
        <select
          id={selectId}
          value={current.code}
          onChange={(e) => {
            setLang(e.target.value);
            analytics.track(EVENTS.FEATURE_USED, {
              feature: 'voice_demo',
              action: 'language',
              value: { lang: e.target.value, placement },
            });
          }}
          className="rounded-md border border-edge bg-surface-2 px-3 py-1.5 text-sm text-foreground"
        >
          {VOICE_DEMO_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code} lang={l.code} dir={l.dir}>
              {l.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">{copy.languageHint}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {VOICES.map((voice) => (
          <VoiceCard
            key={voice.id}
            voice={voice}
            copy={copy.voices[voice.id]}
            lang={current.code}
            langLabel={current.label}
            placement={placement}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
}

export default VoiceShowcase;
