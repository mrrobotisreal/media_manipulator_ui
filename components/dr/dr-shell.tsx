'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDrAuthState, drSignOut } from '@/lib/dr/auth';

// Minimal private chrome for the authenticated portal. Deliberately NOT the
// public top-nav/footer (those are stripped for /dr in app/providers.tsx) and
// renders no ad components of any kind. Only mounted inside DrAuthGate, so the
// user is authenticated by the time this renders.
export default function DrShell({ children }: { children: React.ReactNode }) {
  const { user } = useDrAuthState();
  const router = useRouter();
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);

  // The Communication/Feedback workspace is a full-bleed, three-pane app that
  // owns its own internal scrolling — it escapes the centered max-w-5xl reading
  // column every other portal route uses. This is the ONLY route where the shell
  // layout differs; all other routes keep the exact classes below (zero visual
  // change elsewhere).
  const isFeedback = pathname?.startsWith('/dr/feedback') ?? false;

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await drSignOut();
    } finally {
      router.replace('/dr/auth');
    }
  };

  return (
    <div className={cn('flex flex-col bg-background', isFeedback ? 'h-screen' : 'min-h-screen')}>
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/dr" className="font-semibold tracking-tight">
            Double Raven <span className="text-muted-foreground">× Media Manipulator</span>
          </Link>
          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
            )}
            <Button variant="outline" size="sm" onClick={handleSignOut} disabled={signingOut}>
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>
      {isFeedback ? (
        <main className="flex min-h-0 w-full flex-1 flex-col">{children}</main>
      ) : (
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
      )}
    </div>
  );
}
