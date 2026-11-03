import React from 'react';
import { Panel } from '@/components/darkroom/panel';
import { getServerT } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';

// MA26: the public account-deletion page Google Play requires (a web URL that
// names the app and the developer and explains how to delete an account and what
// is kept). Server component, no client JS, no sign-in needed. Strings: interface:deleteAccount.
const Steps: React.FC<{ items: string[] }> = ({ items }) => (
  <ol className="list-decimal ps-6 space-y-2 mb-4">
    {items.map((s, i) => (
      <li key={i}>{s}</li>
    ))}
  </ol>
);

const Bullets: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="list-disc ps-6 space-y-2 mb-4">
    {items.map((s, i) => (
      <li key={i}>{s}</li>
    ))}
  </ul>
);

const DeleteAccountPage: React.FC<{ locale?: string }> = ({ locale }) => {
  const t = getServerT('interface', locale);
  const list = (key: string) => t(key, { returnObjects: true }) as unknown as string[];
  const h2 = 'text-2xl font-semibold mt-8 mb-3 text-card-foreground';
  const link = 'text-primary underline decoration-primary/40 underline-offset-2';
  return (
    <div className="px-4 sm:px-6">
      <Panel level="1" as="section" className="max-w-3xl mx-auto my-2 text-muted-foreground">
        <h1 className="text-4xl font-bold mb-3 text-card-foreground">{t('deleteAccount.title')}</h1>
        <p className="mb-2 text-card-foreground">Media Manipulator · CreaTV Ltd.</p>
        <p className="text-lg mb-4">{t('deleteAccount.intro')}</p>

        <h2 className={h2}>{t('deleteAccount.inAppTitle')}</h2>
        <Steps items={list('deleteAccount.inAppSteps')} />

        <h2 className={h2}>{t('deleteAccount.webTitle')}</h2>
        <Steps items={list('deleteAccount.webSteps')} />
        <p className="mb-4">
          <a href={localizeHref('/account?tab=privacy', locale ?? 'en-US')} className={link}>
            {t('deleteAccount.webLink')}
          </a>
        </p>

        <h2 className={h2}>{t('deleteAccount.emailTitle')}</h2>
        <p className="mb-4">
          {t('deleteAccount.emailBody')}{' '}
          <a href="mailto:privacy@media-manipulator.com" className={link} dir="ltr">
            privacy@media-manipulator.com
          </a>
        </p>

        <h2 className={h2}>{t('deleteAccount.whatIsDeletedTitle')}</h2>
        <Bullets items={list('deleteAccount.whatIsDeleted')} />

        <h2 className={h2}>{t('deleteAccount.whatIsKeptTitle')}</h2>
        <Bullets items={list('deleteAccount.whatIsKept')} />

        <p className="mb-4">{t('deleteAccount.timing')}</p>
        <p>
          <a href={localizeHref('/privacy-policy', locale ?? 'en-US')} className={link}>
            {t('deleteAccount.moreInfo')}
          </a>
        </p>
      </Panel>
    </div>
  );
};

export default DeleteAccountPage;
