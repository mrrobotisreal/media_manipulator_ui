import Link from 'next/link';

import { Panel } from '@/components/darkroom/panel';
import { VoiceShowcase, type VoicePlacement, type VoiceShowcaseCopy } from '@/components/voices/voice-showcase';
import { defaultDemoLanguageFor, VOICES } from '@/content/voices';
import { localizeHref } from '@/i18n/locales';
import { getServerT } from '@/lib/i18n/server';

type T = ReturnType<typeof getServerT>;

/** Resolves every string the client showcase shows, for one locale. */
export function voiceShowcaseCopy(t: T): VoiceShowcaseCopy {
  const voices = Object.fromEntries(
    VOICES.map((voice) => [
      voice.id,
      {
        role: t(`interface:voices.roles.${voice.role}`),
        description: t(`interface:voices.${voice.copyKey}.description`),
        demoTitle: t(`interface:voices.${voice.copyKey}.demoTitle`),
        demoDescription: t(`interface:voices.${voice.copyKey}.demoDescription`),
        useVoice: t('interface:voices.useVoice', { values: { name: voice.name } }),
      },
    ]),
  ) as VoiceShowcaseCopy['voices'];
  return {
    languageLabel: t('interface:voices.languageLabel'),
    languageHint: t('interface:voices.languageHint'),
    voices,
  };
}

/**
 * The compact voices panel for pages other than /voices: a short pitch, both
 * demos, and a link through to the full page. `variant` picks the copy
 * (`voices.home.*` or `voices.darkroom.*`) and doubles as the analytics
 * placement.
 */
export function VoiceShowcaseSection({
  locale,
  variant,
  className,
}: {
  locale: string;
  variant: Extract<VoicePlacement, 'home' | 'darkroom'>;
  className?: string;
}) {
  const t = getServerT('interface', locale);
  return (
    <Panel
      level="1"
      as="section"
      eyebrow={variant === 'home' ? t('interface:voices.home.eyebrow') : undefined}
      title={t(`interface:voices.${variant}.title`)}
      titleAs="h2"
      className={className}
    >
      <p className="mb-5 text-sm text-muted-foreground">{t(`interface:voices.${variant}.body`)}</p>
      <VoiceShowcase
        copy={voiceShowcaseCopy(t)}
        placement={variant}
        defaultLang={defaultDemoLanguageFor(locale)}
        compact
      />
      <Link
        href={localizeHref('/voices', locale)}
        className="mt-5 inline-flex text-sm text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
      >
        {t(`interface:voices.${variant}.cta`)}
      </Link>
    </Panel>
  );
}

export default VoiceShowcaseSection;
