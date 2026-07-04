'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight, MessageSquare, Presentation } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Portal home: three equal, whole-card-clickable nav options.
const NAV = [
  {
    href: '/dr/docs',
    title: 'Documentation',
    description: 'Architecture design docs and technical references.',
    icon: BookOpen,
  },
  {
    href: '/dr/demos',
    title: 'Demos',
    description: 'Product walkthroughs and prototype demonstrations.',
    icon: Presentation,
  },
  {
    href: '/dr/feedback',
    title: 'Communication / Feedback',
    description: 'Share notes, questions, and feedback with the team.',
    icon: MessageSquare,
  },
] as const;

export default function DrHomeView() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Double Raven <span className="text-muted-foreground">× Media Manipulator</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Partner portal — pick where you want to go.</p>
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
