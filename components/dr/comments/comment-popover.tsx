'use client';

import { useEffect, useRef } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CommentPopoverProps {
  rect: DOMRect | null;
  onAdd: () => void;
  onDismiss: () => void;
}

// Small floating card near the selection with a single "Add comment" action.
// Dismisses on Escape or outside click (the outside-click listener is armed on
// the next tick so the mouseup that opened it doesn't immediately close it).
export default function CommentPopover({ rect, onAdd, onDismiss }: CommentPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rect) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss();
    };
    window.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => document.addEventListener('mousedown', onDown), 0);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
      window.clearTimeout(t);
    };
  }, [rect, onDismiss]);

  if (!rect) return null;

  // Position just above the selection's end rect, kept on-screen.
  const top = rect.top < 52 ? rect.bottom + 8 : rect.top - 44;
  const left = Math.min(Math.max(8, rect.left), window.innerWidth - 56);

  return (
    <div ref={ref} style={{ position: 'fixed', top, left, zIndex: 50 }} className="animate-in fade-in-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="secondary" className="shadow-md" onClick={onAdd} aria-label="Add comment">
              <MessageSquarePlus className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add comment</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
