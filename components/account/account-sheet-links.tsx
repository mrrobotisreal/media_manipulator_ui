'use client';

import * as React from 'react';
import Link from 'next/link';

import { useAuth } from '@/lib/auth/AuthProvider';
import { useLocalization } from '@/i18n/useLocalization';
import { cn } from '@/lib/utils';

/**
 * The account entries in the mobile/tablet nav sheet.
 *
 * Below sm the nav bar has no room for a "Sign in" button, so this is where it
 * lives instead — nothing in the account surface may be reachable only on a
 * wide screen. Same 44px tap target and the same visual grammar as the nav
 * links it sits under.
 */
const ROW =
  'flex min-h-[44px] items-center justify-center rounded-md px-4 py-2 text-lg font-medium ' +
  'text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground';

export const AccountSheetLinks: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
  const auth = useAuth();
  const { t } = useLocalization(['interface']);

  if (!auth) return null;

  return (
    <>
      <span aria-hidden="true" className="my-1 h-px bg-edge" />
      <Link href="/pricing" onClick={onNavigate} className={ROW}>
        {t('interface:authModal.plans.comparePlans')}
      </Link>
      {auth.user ? (
        <>
          <Link href="/account" onClick={onNavigate} className={ROW}>
            {t('interface:accountMenu.account')}
          </Link>
          <button
            type="button"
            className={cn(ROW, 'w-full')}
            onClick={() => {
              onNavigate();
              void auth.signOut();
            }}
          >
            {t('interface:accountMenu.signOut')}
          </button>
        </>
      ) : (
        <button
          type="button"
          className={cn(ROW, 'w-full')}
          onClick={() => {
            onNavigate();
            auth.openAuth({ intent: 'signin', source: 'nav_sheet' });
          }}
        >
          {t('interface:accountMenu.signIn')}
        </button>
      )}
    </>
  );
};

export default AccountSheetLinks;
