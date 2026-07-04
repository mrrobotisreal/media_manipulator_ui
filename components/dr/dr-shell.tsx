'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDrAuthState, drSignOut } from '@/lib/dr/auth';

// Minimal private chrome for the authenticated portal. Deliberately NOT the
// public top-nav/footer (those are stripped for /dr in app/providers.tsx) and
// renders no ad components of any kind. Only mounted inside DrAuthGate, so the
// user is authenticated by the time this renders.
export default function DrShell({ children }: { children: React.ReactNode }) {
  const { user } = useDrAuthState();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await drSignOut();
    } finally {
      router.replace('/dr/auth');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
