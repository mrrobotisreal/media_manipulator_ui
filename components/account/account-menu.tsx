'use client';

import * as React from 'react';
import Link from 'next/link';
import { LogOut, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { QuotaMeter } from '@/components/account/quota-meter';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useLocalization } from '@/i18n/useLocalization';

/**
 * The nav's account slot: the daily-allowance meter, then either a sign-in
 * button or the account menu.
 *
 * The slot was reserved at 88px in Phase 2 precisely so filling it now costs no
 * layout shift. Every state here is the same height (36px) and the container
 * has a minimum width, so the transition from "resolving" to "signed in" moves
 * nothing on the page.
 */
export const AccountMenu: React.FC = () => {
  const auth = useAuth();
  const { t } = useLocalization(['interface', 'accessibility']);

  if (!auth) return null;

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch {
      toast.error(t('interface:accountMenu.signOutFailed'));
    }
  };

  const tierLabel = t(`interface:accountMenu.tier.${auth.tier}`);

  return (
    <div className="flex items-center gap-1">
      <QuotaMeter />

      {auth.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 shrink-0 rounded-full hover:bg-surface-2"
              aria-label={t('accessibility:accountMenu.open')}
            >
              <UserIcon aria-hidden="true" className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="truncate text-sm font-medium text-foreground">
                {auth.user.displayName || auth.user.email}
              </span>
              <span className="num text-xs text-muted-foreground">{tierLabel}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account">{t('interface:accountMenu.account')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/pricing">{t('interface:authModal.plans.comparePlans')}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => void handleSignOut()}>
              <LogOut aria-hidden="true" className="size-4" />
              {t('interface:accountMenu.signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 shrink-0 px-2.5 text-sm text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          onClick={() => auth.openAuth({ intent: 'signin', source: 'top_nav' })}
        >
          {t('interface:accountMenu.signIn')}
        </Button>
      )}
    </div>
  );
};

export default AccountMenu;
