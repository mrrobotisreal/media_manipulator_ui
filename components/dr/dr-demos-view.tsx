'use client';

import Link from 'next/link';
import { ChevronRight, FlaskConical } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Demos landing: whole-card-clickable nav grid, structurally identical to
// dr-home-view.tsx. One item for now — more demos slot in by extending NAV.
const NAV = [
  {
    href: '/dr/demos/chat-lab',
    title: 'DR AI Chat Test Lab',
    description:
      'Chat with different AI models via OpenRouter — compare results for OCR, structured extraction, and general tasks.',
    icon: FlaskConical,
  },
] as const;

export default function DrDemosView() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Demos</h1>
        <p className="mt-1 text-muted-foreground">Product walkthroughs and prototype demonstrations.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {NAV.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full gap-3 p-5 transition-colors hover:border-primary/50 hover:bg-accent/40">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <div>
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
