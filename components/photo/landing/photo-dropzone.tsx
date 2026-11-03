'use client';

/**
 * The drop zone of an Aperture tool page (MM100 decision 2). It is the same in every
 * locale: the chosen photo goes to the unlocalized editor route `/photo/new` through
 * the IndexedDB hand-off (lib/photo/handoff.ts) with the page's panel (and look) in the
 * query. Every string arrives as a prop from the server component, so the island loads
 * no i18n shard. The editor does its own validation and decoding.
 */
import * as React from 'react';
import { ImageUp } from 'lucide-react';

import { handoffHref, putHandoff } from '@/lib/photo/handoff';
import type { PhotoPanelId } from '@/lib/photo/panelIds';

export interface PhotoDropzoneLabels {
  drop: string;
  choose: string;
  hint: string;
  opening: string;
  /** Link text for "open the editor without a photo". */
  openEmpty: string;
}

export const PHOTO_ACCEPT = 'image/*,.heic,.heif,.tif,.tiff';

/** The editor URL for a page with no photo chosen (the editor's own drop zone). */
export const PHOTO_EDITOR_HREF = '/photo/new';

export default function PhotoDropzone({
  panel,
  preset,
  title,
  description,
  labels,
  navigate = (href: string) => window.location.assign(href),
  stash = putHandoff,
}: {
  panel: PhotoPanelId;
  preset?: string;
  title: string;
  description: string;
  labels: PhotoDropzoneLabels;
  /** Test seams. */
  navigate?: (href: string) => void;
  stash?: typeof putHandoff;
}) {
  const input = React.useRef<HTMLInputElement>(null);
  const [over, setOver] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const choose = React.useCallback(
    async (file: File | undefined) => {
      if (!file || busy) return;
      setBusy(true);
      const stored = await stash(file, panel, preset ?? null);
      // Storage unavailable: the editor's own drop zone is the fallback (nothing is lost).
      navigate(stored ? handoffHref(panel, preset ?? null) : PHOTO_EDITOR_HREF);
    },
    [busy, navigate, panel, preset, stash],
  );

  return (
    <div className="mt-6 rounded-lg border border-edge border-l-2 border-l-data bg-surface-1 p-4 sm:p-6" data-testid="photo-dropzone" data-panel={panel} data-preset={preset ?? ''}>
      <h2 className="text-base font-semibold text-card-foreground">{title}</h2>
      <p className="mb-4 mt-1 text-sm text-muted-foreground">{description}</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void choose(e.dataTransfer.files[0]);
        }}
        className={`flex flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 text-center ${over ? 'border-primary bg-primary/10' : 'border-edge'}`}
      >
        <ImageUp className="size-8 text-data" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">{busy ? labels.opening : labels.drop}</p>
        <button
          type="button"
          disabled={busy}
          onClick={() => input.current?.click()}
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-[var(--accent-primary-hover)] disabled:opacity-60"
        >
          {labels.choose}
        </button>
        <input
          ref={input}
          type="file"
          accept={PHOTO_ACCEPT}
          className="sr-only"
          data-testid="photo-dropzone-input"
          aria-label={labels.choose}
          onChange={(e) => void choose(e.target.files?.[0])}
        />
        <p className="text-xs text-muted-foreground">{labels.hint}</p>
      </div>
      <p className="mt-3 text-sm">
        <a href={PHOTO_EDITOR_HREF} data-testid="photo-open-empty" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
          {labels.openEmpty}
        </a>
      </p>
    </div>
  );
}
