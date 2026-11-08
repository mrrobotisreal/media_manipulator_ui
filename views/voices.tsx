import Link from 'next/link';
import { AudioLines, Repeat, Wand2 } from 'lucide-react';

import { Panel } from '@/components/darkroom/panel';
import { VoiceShowcase } from '@/components/voices/voice-showcase';
import { voiceShowcaseCopy } from '@/components/voices/voice-showcase-section';
import { defaultDemoLanguageFor } from '@/content/voices';
import { localizeHref } from '@/i18n/locales';
import { getServerT, ServerTrans } from '@/lib/i18n/server';
import { PageFaq } from '@/components/page-faq';

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
  const list = (key: string) => t(`interface:voices.${key}`, { returnObjects: true }) as string[];
  const chooseItems = t('interface:voices.choose.items', { returnObjects: true }) as Array<{ title: string; body: string }>;
  const exampleItems = t('interface:voices.examples.items', { returnObjects: true }) as Array<{ title: string; body: string }>;
  const faq = t('interface:voices.faq.items', { returnObjects: true }) as Array<{ q: string; a: string }>;
  const link = 'text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary';

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

      <Panel level="1" as="section" className="mt-6" title={t('interface:voices.twoKinds.title')} titleAs="h2" data-testid="voices-two-kinds">
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{t('interface:voices.twoKinds.body')}</p>
      </Panel>

      <section className="mt-10" data-testid="voices-tools">
        <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">{t('interface:voices.tools.title')}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{t('interface:voices.tools.intro')}</p>
        <div className="mt-4 grid gap-6">
          {(['clone', 'design', 'change'] as const).map((key) => (
            <Panel key={key} level="1" as="section" title={t(`interface:voices.tools.${key}.title`)} titleAs="h3">
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{t(`interface:voices.tools.${key}.intro`)}</p>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                {list(`tools.${key}.steps`).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="mt-3 text-sm text-muted-foreground">{t(`interface:voices.tools.${key}.tip`)}</p>
            </Panel>
          ))}
        </div>
      </section>

      <Panel level="1" as="section" className="mt-10" title={t('interface:voices.choose.title')} titleAs="h2">
        <ul className="grid gap-4 md:grid-cols-2">
          {chooseItems.map((item) => (
            <li key={item.title}>
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel level="1" as="section" className="mt-6" title={t('interface:voices.examples.title')} titleAs="h2">
        <div className="grid gap-4">
          {exampleItems.map((item) => (
            <div key={item.title}>
              <h3 className="font-medium text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Panel level="1" as="section" title={t('interface:voices.consent.title')} titleAs="h2" data-testid="voices-consent">
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            {list('consent.paragraphs').map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Panel>
        <Panel level="1" as="section" title={t('interface:voices.watermark.title')} titleAs="h2" data-testid="voices-watermark">
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            {list('watermark.paragraphs').map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Panel>
      </div>

      <Panel level="1" as="section" className="mt-6" title={t('interface:voices.privacy.title')} titleAs="h2" data-testid="voices-privacy">
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {list('privacy.items').map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">{t('interface:voices.privacy.note')}</p>
      </Panel>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Panel level="1" as="section" title={t('interface:voices.limits.title')} titleAs="h2">
          <p className="text-sm leading-relaxed text-muted-foreground">{t('interface:voices.limits.body')}</p>
        </Panel>
        <Panel level="1" as="section" title={t('interface:voices.notFor.title')} titleAs="h2">
          <p className="text-sm leading-relaxed text-muted-foreground">{t('interface:voices.notFor.body')}</p>
        </Panel>
      </div>

      <Panel level="1" as="section" className="mt-6">
        <PageFaq title={t('interface:voices.faq.title')} items={faq} id="voices-faq" headingClassName="text-xl font-semibold mb-4 text-foreground" />
      </Panel>

      <Panel level="1" as="section" className="mt-6" title={t('interface:voices.links.title')} titleAs="h2">
        <ul className="space-y-2 text-sm">
          <li><Link href={localizeHref('/privacy-policy', loc)} className={link}>{t('interface:voices.links.privacy')}</Link></li>
          <li><Link href={localizeHref('/terms-of-service', loc)} className={link}>{t('interface:voices.links.terms')}</Link></li>
          <li><Link href={localizeHref('/pricing', loc)} className={link}>{t('interface:voices.links.pricing')}</Link></li>
        </ul>
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
