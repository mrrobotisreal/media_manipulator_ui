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
import { useAuth } from '@/lib/auth/AuthProvider';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';

/**
 * The signed-in half of the nav account slot.
 *
 * Split out of AccountMenu and loaded with next/dynamic because it is the only
 * thing in the app that pulls @radix-ui/react-dropdown-menu (and its popper,
 * portal, focus-scope and dismissable-layer dependencies) into the root client
 * chunk — about 20 KB gzipped on every route, for a control that a signed-out
 * visitor can never open. Phase 3 spent its whole budget on not shipping unused
 * UI in the first load; this keeps that.
 *
 * The trigger is the same 36px square as the signed-out button, so swapping
 * them costs no layout.
 */
export const AccountDropdown: React.FC = () => {
  const auth = useAuth();
  const { t } = useLocalization(['interface', 'accessibility']);
  const localized = useLocalizedHref();

  if (!auth?.user) return null;

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch {
      toast.error(t('interface:accountMenu.signOutFailed'));
    }
  };

  return (
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
          <span className="num text-xs text-muted-foreground">
            {t(`interface:accountMenu.tier.${auth.tier}`)}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={localized('/account')}>{t('interface:accountMenu.account')}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={localized('/pricing')}>{t('interface:authModal.plans.comparePlans')}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void handleSignOut()}>
          <LogOut aria-hidden="true" className="size-4" />
          {t('interface:accountMenu.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountDropdown;
