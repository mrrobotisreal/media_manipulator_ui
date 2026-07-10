'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { KeyRound, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useDrAuthState, drSignOut } from '@/lib/dr/auth';
import ChangePasswordDialog from './change-password-dialog';

// Minimal private chrome for the authenticated portal. Deliberately NOT the
// public top-nav/footer (those are stripped for /dr in app/providers.tsx) and
// renders no ad components of any kind. Only mounted inside DrAuthGate, so the
// user is authenticated by the time this renders.
export default function DrShell({ children }: { children: React.ReactNode }) {
  const { user } = useDrAuthState();
  const router = useRouter();
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  // The Communication/Feedback workspace and the AI Chat Test Lab are
  // full-bleed, multi-pane apps that own their own internal scrolling — they
  // escape the centered max-w-5xl reading column every other portal route
  // uses. These are the ONLY routes where the shell layout differs; all other
  // routes keep the exact classes below (zero visual change elsewhere).
  const isFullBleed = ['/dr/feedback', '/dr/demos/chat-lab'].some((p) => pathname?.startsWith(p));

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await drSignOut();
    } finally {
      router.replace('/dr/auth');
    }
  };

  return (
    <div className={cn('flex flex-col bg-background', isFullBleed ? 'h-screen' : 'min-h-screen')}>
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/dr" className="font-semibold tracking-tight">
            <div className="flex flex-row items-center justify-center gap-2">
              <img
                src="/DoubleRaven_Icon.png"
                alt="Double Raven"
                className="mx-auto mb-2 size-12 object-contain"
              />
              <span>Double Raven <span className="text-muted-foreground">× Media Manipulator</span></span>
            </div>
          </Link>
          {/* Account menu: email + Change password… + Sign out (the sign-out
              behavior/disabled state is identical to the old standalone button). */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Account">
                <UserCircle className="size-4" />
                {user?.email && (
                  <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="max-w-64 truncate font-normal text-muted-foreground">
                {user?.email ?? 'Signed in'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setChangePasswordOpen(true)}>
                <KeyRound className="size-4" />
                Change password…
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={signingOut} onSelect={() => void handleSignOut()}>
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
        </div>
      </header>
      {isFullBleed ? (
        <main className="flex min-h-0 w-full flex-1 flex-col">{children}</main>
      ) : (
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
      )}
    </div>
  );
}
