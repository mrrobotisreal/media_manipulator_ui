'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Shared centered "coming soon" placeholder. Provide exactly one action:
//   • goBackFallbackHref → a "Go Back" button (router.back(), falling back to
//     the given href when there is no history) — used by /dr/docs/new.
//   • homeHref → a link back to the given route — used by /dr/demos and
//     /dr/feedback.
interface DrComingSoonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  goBackFallbackHref?: string;
  homeHref?: string;
  homeLabel?: string;
}

export default function DrComingSoon({
  icon,
  title,
  description,
  goBackFallbackHref,
  homeHref,
  homeLabel = 'Back to portal home',
}: DrComingSoonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else if (goBackFallbackHref) {
      router.push(goBackFallbackHref);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-md items-center gap-4 p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">{icon}</div>
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        {goBackFallbackHref && (
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
        )}
        {homeHref && (
          <Button asChild variant="outline">
            <Link href={homeHref}>{homeLabel}</Link>
          </Button>
        )}
      </Card>
    </div>
  );
}
