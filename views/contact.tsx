import React from 'react';
import Link from 'next/link';

import ContactForm, { type ContactFormLabels } from '@/components/contact/contact-form';
import { Panel } from '@/components/darkroom/panel';
import { localizeHref } from '@/i18n/locales';
import { PRIVACY_EMAIL, SUPPORT_EMAIL } from '@/lib/contact';
import { getServerT, ServerTrans } from '@/lib/i18n/server';

/**
 * MM85 `/contact`. Everything a reviewer or a visitor needs is server-rendered:
 * who runs the site, both addresses as mailto links, the response time, what to
 * put in a bug report and a link to /status. The form is the only client island.
 */
const linkClass =
  'text-primary underline decoration-primary/40 underline-offset-2 hover:text-[var(--accent-primary-hover)] hover:decoration-primary';

const K = 'contact';

const ContactPage: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  const loc = locale ?? 'en-US';
  const f = (key: string) => t(`${K}.form.${key}`);
  const labels: ContactFormLabels = {
    title: f('title'),
    name: f('name'),
    email: f('email'),
    emailHint: f('emailHint'),
    subject: f('subject'),
    subjects: {
      bug: f('subjects.bug'),
      billing: f('subjects.billing'),
      privacy: f('subjects.privacy'),
      press: f('subjects.press'),
      other: f('subjects.other'),
    },
    message: f('message'),
    // No values passed: {{count}}/{{max}}/{{reference}}/{{email}} stay for the island to fill.
    messageCount: f('messageCount'),
    honeypot: f('honeypot'),
    submit: f('submit'),
    sending: f('sending'),
    sentTitle: f('sentTitle'),
    sentBody: f('sentBody'),
    sendAnother: f('sendAnother'),
    invalid: {
      name: f('invalidName'),
      email: f('invalidEmail'),
      subject: f('invalidSubject'),
      message: f('invalidMessage'),
    },
    rateLimited: f('rateLimited'),
    failed: f('failed'),
  };
  const bugItems = t(`${K}.bugItems`, { returnObjects: true }) as string[];

  return (
    <div className="px-4 sm:px-6" data-testid="contact-page">
      <Panel level="1" as="section" className="mx-auto my-2 max-w-5xl">
        <h1 className="mb-3 text-4xl font-bold text-card-foreground">{t(`${K}.title`)}</h1>
        <p className="mb-8 text-lg text-muted-foreground">{t(`${K}.intro`)}</p>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="mb-3 text-2xl font-semibold text-card-foreground">{t(`${K}.emailTitle`)}</h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm">{t(`${K}.supportLabel`)}</dt>
                  <dd>
                    <a href={`mailto:${SUPPORT_EMAIL}`} className={linkClass} dir="ltr" data-testid="contact-support-email">
                      {SUPPORT_EMAIL}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm">{t(`${K}.privacyLabel`)}</dt>
                  <dd>
                    <a href={`mailto:${PRIVACY_EMAIL}`} className={linkClass} dir="ltr" data-testid="contact-privacy-email">
                      {PRIVACY_EMAIL}
                    </a>
                  </dd>
                </div>
              </dl>
              <p className="mt-3">{t(`${K}.responseTime`)}</p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-card-foreground">{t(`${K}.bugTitle`)}</h2>
              <p className="mb-2">{t(`${K}.bugIntro`)}</p>
              <ul className="mb-3 list-disc space-y-1 ps-6">
                {bugItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mb-3">{t(`${K}.bugNoFiles`)}</p>
              <p>
                <ServerTrans
                  locale={locale}
                  i18nKey={`interface:${K}.statusNote`}
                  components={{ linkStatus: <Link href={localizeHref('/status', loc)} className={linkClass} /> }}
                />
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-card-foreground">{t(`${K}.whoTitle`)}</h2>
              <p>
                <ServerTrans
                  locale={locale}
                  i18nKey={`interface:${K}.whoBody`}
                  components={{
                    strong: <strong />,
                    linkAbout: <Link href={localizeHref('/about', loc)} className={linkClass} />,
                  }}
                />
              </p>
            </section>
          </div>

          <section aria-labelledby="contact-form-heading">
            <Panel level="2" className="lg:p-6">
              <h2 id="contact-form-heading" className="mb-4 text-2xl font-semibold text-card-foreground">
                {labels.title}
              </h2>
              <ContactForm labels={labels} />
              <p className="mt-4 text-xs text-muted-foreground">
                <ServerTrans
                  locale={locale}
                  i18nKey={`interface:${K}.privacyNote`}
                  components={{ linkPrivacy: <Link href={localizeHref('/privacy-policy', loc)} className={linkClass} /> }}
                />
              </p>
            </Panel>
          </section>
        </div>
      </Panel>
    </div>
  );
};

export default ContactPage;
