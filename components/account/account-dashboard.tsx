'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';

import { Panel } from '@/components/darkroom/panel';
import { Button } from '@/components/ui/button';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { CheckoutReturn } from '@/components/account/checkout-return';
import type { AccountCopy } from '@/components/account/account-copy';
import { BillingTab } from '@/components/account/tabs/billing-tab';
import { HistoryTab } from '@/components/account/tabs/history-tab';
import { OverviewTab, type OverviewExtras } from '@/components/account/tabs/overview-tab';
import { PrivacyTab } from '@/components/account/tabs/privacy-tab';
import { ProfileTab } from '@/components/account/tabs/profile-tab';
import { ProjectsTab } from '@/components/account/tabs/projects-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalization } from '@/i18n/useLocalization';
import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import { VerifyNotice } from '@/components/account/verify-notice';
import { ACCOUNT_TABS, accountTabHref, parseAccountTab, type AccountTab } from '@/lib/account/tabs';

/**
 * The live half of /account: URL-routed tabs (`?tab=`).
 *
 * Every label arrives as a prop from the server component that owns the page, so `pages.json`
 * never crosses into a client chunk (§0.5.13-14). Only the numbers are fetched here, by the
 * tab components in ./tabs.
 */

export interface AccountLabels extends OverviewExtras {
  copy: AccountCopy;
}

export const AccountDashboard: React.FC<{ labels: AccountLabels }> = ({ labels }) => {
  const { copy } = labels;
  const auth = useAuth();
  const searchParams = useSearchParams();
  const { dir } = useLocalization('interface');
  const tab = parseAccountTab(searchParams?.get('tab'));

  const selectTab = React.useCallback((next: AccountTab) => {
    // Rewrite only the query string, in place. usePathname() is the internal
    // rewritten path (/en/account for English), so router.replace(pathname)
    // navigated to /en/account, which the proxy 308s back to /account and the
    // tab change was lost. Next syncs replaceState into useSearchParams when the
    // state is not its own (__NA), so pass null as its docs do.
    window.history.replaceState(null, '', accountTabHref(window.location, next));
  }, []);

  const signedIn = !!auth?.user;
  React.useEffect(() => {
  }, [signedIn, tab]);

  if (!auth || auth.loading) {
    // The heading has to exist in the loading state too (Lighthouse heading-order).
    return (
      <Panel title={copy.usageTitle} titleAs="h2">
        <PanelLoading variant="inline" label={copy.usageTitle} />
      </Panel>
    );
  }

  if (!auth.user) {
    return (
      <Panel className="max-w-xl">
        <h2 className="text-lg font-semibold text-foreground">{copy.signedOutTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.signedOutBody}</p>
        <Button
          className="mt-4"
          onClick={() => {
            analytics.track(EVENTS.UPGRADE_CTA_CLICKED, { placement: 'account_page', from_tier: auth.tier });
            auth.openAuth({ intent: 'signin', source: 'account_page' });
          }}
        >
          {copy.signInCta}
        </Button>
      </Panel>
    );
  }

  const uid = auth.user.uid;

  return (
    <>
      <CheckoutReturn />
      {auth.operatorEligibility === 'unverified' ? (
        <div className="mb-6">
          <VerifyNotice labels={copy.verify} />
        </div>
      ) : null}
      <Tabs value={tab} onValueChange={(value) => selectTab(parseAccountTab(value))} dir={dir} className="gap-6">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <TabsList aria-label={copy.tabs.label} className="h-auto w-max min-w-full justify-start gap-1 sm:min-w-0">
            {ACCOUNT_TABS.map((id) => (
              <TabsTrigger key={id} value={id} className="min-h-11 flex-none px-4 sm:min-h-9">
                {copy.tabs[id]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview">
          <OverviewTab copy={copy} extras={labels} onOpenPrivacy={() => selectTab('privacy')} />
        </TabsContent>
        <TabsContent value="history">
          <HistoryTab copy={copy} uid={uid} />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsTab copy={copy} uid={uid} />
        </TabsContent>
        <TabsContent value="billing">
          <div className="max-w-xl">
            <BillingTab />
          </div>
        </TabsContent>
        <TabsContent value="privacy">
          <PrivacyTab copy={copy} uid={uid} />
        </TabsContent>
        <TabsContent value="profile">
          <ProfileTab copy={copy} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AccountDashboard;
