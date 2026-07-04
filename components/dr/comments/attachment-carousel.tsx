'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DrAttachment } from '@/schemas/drComments';
import ImageViewerModal from './image-viewer-modal';

const THUMB_HEIGHT = 96;

// Horizontal scroll-snap strip of fixed-height thumbnails whose width follows
// each image's aspect ratio (object-cover keeps portrait/landscape/square all
// clean). Overflow arrows appear only when the strip is actually scrollable.
// Built on scroll-snap — no carousel dependency. Clicking a thumbnail opens the
// modal viewer at that image.
export default function AttachmentCarousel({ attachments }: { attachments: DrAttachment[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const check = () => setScrollable(el.scrollWidth > el.clientWidth + 4);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [attachments.length]);

  if (attachments.length === 0) return null;

  const scrollByPx = (dx: number) => scrollerRef.current?.scrollBy({ left: dx, behavior: 'smooth' });

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex snap-x gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {attachments.map((a, i) => {
          const ratio = a.width && a.height ? a.width / a.height : 1;
          const width = Math.min(Math.max(Math.round(THUMB_HEIGHT * (ratio > 0 ? ratio : 1)), 56), 220);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setModalIndex(i)}
              className="shrink-0 snap-start overflow-hidden rounded-md border border-border bg-muted transition-opacity hover:opacity-90"
              style={{ height: THUMB_HEIGHT, width }}
              aria-label="Open image"
            >
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img src={a.viewUrl} alt="" className="h-full w-full object-cover" />
            </button>
          );
        })}
      </div>

      {scrollable && (
        <>
          <ArrowButton side="left" onClick={() => scrollByPx(-220)} />
          <ArrowButton side="right" onClick={() => scrollByPx(220)} />
        </>
      )}

      <ImageViewerModal
        attachments={attachments}
        startIndex={modalIndex ?? 0}
        open={modalIndex !== null}
        onOpenChange={(o) => {
          if (!o) setModalIndex(null);
        }}
      />
    </div>
  );
}

function ArrowButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Scroll left' : 'Scroll right'}
      className={cn(
        'absolute top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 shadow-sm',
        side === 'left' ? 'left-1' : 'right-1',
      )}
    >
      {side === 'left' ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
    </button>
  );
}
