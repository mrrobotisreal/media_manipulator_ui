'use client';

import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, ImageOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getBaseURL } from '@/lib/utils';
import { useLocalization } from '@/i18n/useLocalization';
import type { ImageRestoreResultEntry, ImageRestoreResultsResponse } from '@/lib/imageRestoreTypes';

interface ResultsGridProps {
  jobId: string;
  data: ImageRestoreResultsResponse;
}

// ResultsGrid renders the inline comparison: the prepared original next to
// every output, ordered as the manifest orders them (pre-clean → general →
// face) so it reads as a provenance trail. Clicking a result opens a two-pane
// original-vs-result compare modal. Pre-clean outputs show a non-generative
// "fidelity" badge; face outputs show the generative-reconstruction note.
//
// Preview <img> requests carry no auth header on the Firebase-gated
// deployment, so a failed load falls back to "included in download" rather
// than a broken image.
const ResultsGrid: React.FC<ResultsGridProps> = ({ jobId, data }) => {
  const { t } = useLocalization('interface');
  const [active, setActive] = useState<ImageRestoreResultEntry | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const previewUrl = (id: string) => `${getBaseURL()}/image-restore/${jobId}/result/${id}`;
  const markFailed = (id: string) => setFailedImages((prev) => new Set(prev).add(id));

  const renderThumb = (entry: ImageRestoreResultEntry, large = false) => {
    if (failedImages.has(entry.id)) {
      return (
        <div className="flex aspect-square w-full flex-col items-center justify-center gap-1 bg-muted text-center text-xs text-muted-foreground">
          <ImageOff className="h-5 w-5" aria-hidden="true" />
          {t('imageRestore.results.includedInDownload')}
        </div>
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={previewUrl(entry.id)}
        alt={entry.label}
        className={large ? 'block max-h-[70vh] w-auto mx-auto' : 'block w-full h-auto'}
        loading="lazy"
        onError={() => markFailed(entry.id)}
      />
    );
  };

  const Badge = ({ entry }: { entry: ImageRestoreResultEntry }) => {
    if (entry.fidelityNote || entry.kind === 'preclean') {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 text-[10px] font-medium">
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
          {t('imageRestore.results.fidelityBadge')}
        </span>
      );
    }
    if (entry.generativeNote || entry.kind === 'face') {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 text-[10px] font-medium">
          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
          {t('imageRestore.results.generativeBadge')}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {/* Original */}
        <figure className="space-y-1">
          <div className="overflow-hidden rounded-lg border border-border bg-black/40">{renderThumb(data.original)}</div>
          <figcaption className="text-xs text-muted-foreground">
            {t('imageRestore.results.originalCaption', { w: data.original.width, h: data.original.height })}
          </figcaption>
        </figure>

        {/* Results */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {data.results.map((entry) => (
            <figure key={entry.id} className="space-y-1">
              <button
                type="button"
                disabled={entry.status !== 'completed'}
                onClick={() => entry.status === 'completed' && setActive(entry)}
                className="block w-full overflow-hidden rounded-lg border border-border bg-black/40 disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {entry.status === 'completed' ? (
                  renderThumb(entry)
                ) : (
                  <div className="flex aspect-square w-full flex-col items-center justify-center gap-1 bg-destructive/10 p-2 text-center text-xs text-destructive">
                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                    {entry.error || t('imageRestore.results.failed')}
                  </div>
                )}
              </button>
              <figcaption className="space-y-0.5">
                <span className="flex items-center justify-between gap-1">
                  <span className="text-xs font-medium truncate">{entry.label}</span>
                  <Badge entry={entry} />
                </span>
                {entry.status === 'completed' && entry.width > 0 && (
                  <span className="block text-[11px] text-muted-foreground">
                    {entry.width}×{entry.height}
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{active?.label}</DialogTitle>
          </DialogHeader>
          {active && (
            <div className="grid gap-3 md:grid-cols-2">
              <figure className="space-y-1">
                <div className="overflow-hidden rounded-lg border border-border bg-black/40">{renderThumb(data.original, true)}</div>
                <figcaption className="text-center text-xs text-muted-foreground">
                  {t('imageRestore.results.compareOriginal')}
                </figcaption>
              </figure>
              <figure className="space-y-1">
                <div className="overflow-hidden rounded-lg border border-border bg-black/40">{renderThumb(active, true)}</div>
                <figcaption className="text-center text-xs text-muted-foreground">{active.label}</figcaption>
              </figure>
              {(active.generativeNote || active.fidelityNote) && (
                <p className="md:col-span-2 text-xs text-muted-foreground">
                  {active.generativeNote || active.fidelityNote}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResultsGrid;
