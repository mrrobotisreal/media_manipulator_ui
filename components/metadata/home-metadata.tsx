'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import { useMetadataAnalytics } from '@/lib/metadata/useMetadataAnalytics';
import type { MetadataDocument } from '@/lib/metadata/types';
import { LazyMetadataInspector } from './metadata-inspector-lazy';
import { useMetadataInspect } from './use-metadata-data';

/** Files at or below this size are inspected automatically; larger video/audio waits for a click. */
export const AUTO_INSPECT_MAX_BYTES = 100 * 1024 * 1024;

/** Images and documents always auto-inspect (their reports are cheap); everything else is size-gated. */
export function shouldAutoInspect(file: Pick<File, 'size'>, kind: string): boolean {
  return kind === 'image' || kind === 'pdf' || file.size <= AUTO_INSPECT_MAX_BYTES;
}

const PLACEHOLDER: MetadataDocument = {
  schemaVersion: 1,
  file: { name: '', sizeBytes: 0, mime: '', kind: 'unknown' },
  tools: [],
  entries: [],
  warnings: [],
};

export interface HomeMetadataProps {
  file: File;
  kind: string;
  /** True while the file is mid-upload; an on-demand inspection waits for it. */
  uploading: boolean;
}

/**
 * The home screen's "what is in this file" block. Mount it with `key={...}` per selected
 * file: a new file remounts it, which resets the on-demand request, and the query cache keys
 * the report per file so re-selecting the same file does not re-upload it.
 */
export default function HomeMetadata({ file, kind, uploading }: HomeMetadataProps) {
  const { t } = useLocalization('interface');
  const auto = shouldAutoInspect(file, kind);
  const [requested, setRequested] = useState(false);
  const q = useMetadataInspect(file, { enabled: (auto || requested) && !uploading });
  const analytics = useMetadataAnalytics('home', q.data);

  if (!auto && !requested) {
    return (
      <button
        type="button"
        onClick={() => setRequested(true)}
        disabled={uploading}
        data-testid="home-inspect-button"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-[var(--accent-primary-hover)] disabled:bg-surface-3"
      >
        <Search aria-hidden="true" className="size-4" />
        {t('metadata.home.inspect', { defaultValue: 'Inspect metadata' })}
      </button>
    );
  }
  if (q.status === 'error') return null; // passive: conversion below still works
  return (
    <div data-testid="home-metadata" className="space-y-2">
      {q.data ? (
        <LazyMetadataInspector document={q.data} surface="home" fileName={file.name} status="ready" onEvent={analytics.onEvent} />
      ) : (
        <LazyMetadataInspector document={{ ...PLACEHOLDER, file: { ...PLACEHOLDER.file, name: file.name, sizeBytes: file.size } }} surface="home" status="loading" />
      )}
      <p className="text-xs text-muted-foreground">
        {t('metadata.home.privacyNote', { defaultValue: 'Inspection happens on our servers; the file is deleted after analysis.' })}
      </p>
    </div>
  );
}
