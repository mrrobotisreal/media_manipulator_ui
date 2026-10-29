'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import { QuotaMeter } from '@/components/account/quota-meter';
import { analytics, EVENTS } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useLocalization } from '@/i18n/useLocalization';
import { NAV_HIT_EXTENSION } from '@/components/nav-control';
import { cn } from '@/lib/utils';

/**
 * The nav's account slot: the everyday and AI allowance meters, then either a
 * sign-in button or the account menu.
 *
 * Phase 2 reserved 88px here precisely so filling it now costs no layout shift.
 * Every state is 36px tall and the container holds a minimum width, so the
 * transition from "resolving" to "signed in" moves nothing on the page.
 *
 * The signed-in dropdown is code-split: it is the only Radix menu in the app's
 * shared chrome, and shipping it to every anonymous visitor cost ~20 KB
 * gzipped on the first load of every route for a control they cannot open.
 */
const AccountDropdown = dynamic(() => import('@/components/account/account-dropdown'), {
  ssr: false,
  // The same 36px square the real trigger occupies, so the chunk arriving
  // does not nudge the nav.
  loading: () => <span aria-hidden="true" className="size-9 shrink-0" />,
});

export const AccountMenu: React.FC = () => {
  const auth = useAuth();
  const { t } = useLocalization(['interface']);

  if (!auth) return null;

  return (
    // gap-2: two 4px hit-area extensions (MM88, components/nav-control.ts).
    <div className="flex items-center gap-2">
      <QuotaMeter />
      {/* MM90: the AI allowance, a separate counter, beside the everyday one. From md up:
          below that the row has no room for a second meter at 44px targets (the budget is
          in top-nav.tsx), and the nav sheet shows both meters instead. */}
      <QuotaMeter metric="ai_ops" className="hidden md:flex" />
      {auth.user ? (
        <AccountDropdown />
      ) : (
        <Button
          variant="ghost"
          size="sm"
          // Hidden on the narrowest phones: at 360px the nav is wordmark +
          // menu + theme + meter, and a fourth control pushed the row past the
          // viewport edge. The meter still opens this same panel, and the sheet
          // menu carries an explicit "Sign in" entry, so nothing is unreachable.
          className={cn(
            NAV_HIT_EXTENSION,
            'hidden h-9 shrink-0 px-2.5 text-sm text-muted-foreground hover:bg-surface-2 hover:text-foreground sm:inline-flex',
          )}
          onClick={() => {
            // Only rendered when signed out, so from_tier is always 'anonymous' — which is
            // what separates "create an account" intent from "buy Premium" intent in any
            // report over upgrade_cta_clicked. `placement` mirrors the `source` passed to
            // openAuth so the two attributions cannot drift apart.
            analytics.track(EVENTS.UPGRADE_CTA_CLICKED, {
              placement: 'top_nav',
              from_tier: auth.tier,
            });
            auth.openAuth({ intent: 'signin', source: 'top_nav' });
          }}
        >
          {t('interface:accountMenu.signIn')}
        </Button>
      )}
    </div>
  );
};

export default AccountMenu;
