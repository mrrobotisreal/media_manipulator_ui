import Link from 'next/link';
import { AudioLines, Repeat, Wand2 } from 'lucide-react';

import { Panel } from '@/components/darkroom/panel';
import { VoiceShowcase } from '@/components/voices/voice-showcase';
import { voiceShowcaseCopy } from '@/components/voices/voice-showcase-section';
import { defaultDemoLanguageFor } from '@/content/voices';
import { localizeHref } from '@/i18n/locales';
import { getServerT, ServerTrans } from '@/lib/i18n/server';

const SUMRAK_URL = 'https://www.winapps.io/projects/sumrak';

/** MM78: the "Make your own" cards, one per voice tool page. */
const MAKE_YOUR_OWN = [
  { key: 'clone', href: '/tools/voice-cloning', Icon: AudioLines },
  { key: 'design', href: '/tools/voice-designer', Icon: Wand2 },
  { key: 'change', href: '/tools/voice-changer', Icon: Repeat },
] as const;

/**
 * /voices: Mitchell Wintrow's two ElevenLabs voices, playable in eight
 * languages, with links into the ElevenLabs voice library. A server component;
 * the only client island is the player.
 */
const VoicesPage: React.FC<{ locale?: string }> = ({ locale }) => {
  const loc = locale ?? 'en-US';
  const t = getServerT('interface', loc);
  const steps = t('interface:voices.howTo.steps', { returnObjects: true }) as string[];

  return (
    <div className="container mx-auto max-w-[1100px] px-4 py-12 md:py-16">
      <header className="mb-10 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-data">
          {t('interface:voices.eyebrow')}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl">
          {t('interface:voices.title')}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t('interface:voices.intro')}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t('interface:voices.made')}</p>
      </header>

      <Panel level="1" as="section">
        <VoiceShowcase copy={voiceShowcaseCopy(t)} placement="voices_page" defaultLang={defaultDemoLanguageFor(loc)} />
      </Panel>

      <Panel level="1" as="section" className="mt-6" title={t('interface:voices.makeYourOwn.title')} titleAs="h2">
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{t('interface:voices.makeYourOwn.intro')}</p>
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {MAKE_YOUR_OWN.map(({ key, href, Icon }) => (
            <li key={key}>
              <Link
                href={localizeHref(href, loc)}
                className="flex h-full flex-col rounded-lg border border-edge p-4 transition-colors hover:border-primary/50 hover:bg-surface-2"
              >
                <Icon aria-hidden="true" className="size-5 text-primary" />
                <span className="mt-3 font-medium text-foreground">{t(`interface:voices.makeYourOwn.cards.${key}.title`)}</span>
                <span className="mt-1 flex-1 text-sm text-muted-foreground">{t(`interface:voices.makeYourOwn.cards.${key}.body`)}</span>
                <span className="mt-3 text-sm text-primary">{t('interface:voices.makeYourOwn.open')}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">{t('interface:voices.makeYourOwn.note')}</p>
      </Panel>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Panel level="1" as="section" title={t('interface:voices.howTo.title')} titleAs="h2">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </Panel>
        <Panel level="1" as="section" title={t('interface:voices.darkroom.title')} titleAs="h2">
          <p className="text-sm text-muted-foreground">{t('interface:voices.darkroomTip')}</p>
          <Link
            href={localizeHref('/tools/content-studio', loc)}
            className="mt-4 inline-flex text-sm text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            Darkroom
          </Link>
          <p className="mt-6 border-t border-edge pt-4 text-sm text-muted-foreground">
            <ServerTrans
              locale={loc}
              i18nKey="interface:voices.sumrak"
              components={{
                linkSumrak: (
                  <a
                    href={SUMRAK_URL}
                    className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                  />
                ),
              }}
            />
          </p>
        </Panel>
      </div>
    </div>
  );
};

export default VoicesPage;
