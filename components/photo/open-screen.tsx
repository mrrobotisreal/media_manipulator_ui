'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useLocalization } from '@/i18n/useLocalization';
import { PHOTO_BRAND } from '@/lib/photo/brand';
import type { PhotoProjectSummary } from '@/lib/photo/projectsApi';

/** `/photo/new`: the drop zone, the one local project, and (signed in) recent projects. */
export function OpenScreen({
  onFile,
  localName,
  onContinueLocal,
  recent,
  onOpenRecent,
  error,
}: {
  onFile: (file: File) => void;
  localName: string | null;
  onContinueLocal: () => void;
  recent: PhotoProjectSummary[];
  onOpenRecent: (id: string) => void;
  error: string | null;
}) {
  const { t } = useLocalization('interface');
  const input = React.useRef<HTMLInputElement>(null);
  const [over, setOver] = React.useState(false);
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 p-4" data-testid="photo-open">
      <h1 className="text-2xl font-semibold tracking-tight">{t('photo.open.title', { brand: PHOTO_BRAND })}</h1>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const f = e.dataTransfer.files[0];
          if (f) onFile(f);
        }}
        className={`flex flex-col items-center gap-3 rounded-lg border-2 border-dashed p-10 text-center ${over ? 'border-primary bg-primary/10' : 'border-edge'}`}
      >
        <p className="text-sm text-muted-foreground">{t('photo.open.drop')}</p>
        <Button onClick={() => input.current?.click()}>{t('photo.open.choose')}</Button>
        <input ref={input} type="file" accept="image/*,.heic,.heif,.tif,.tiff" className="sr-only" data-testid="photo-file-input" aria-label={t('photo.open.choose')} onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        <p className="text-xs text-muted-foreground">{t('photo.open.hint')}</p>
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {localName !== null ? (
        <Button variant="outline" onClick={onContinueLocal} data-testid="continue-local">
          {t('photo.open.continueLocal')}
          {localName ? `: ${localName}` : ''}
        </Button>
      ) : null}
      {recent.length ? (
        <section aria-label={t('photo.open.recent')} className="space-y-2">
          <h2 className="text-sm font-semibold">{t('photo.open.recent')}</h2>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {recent.map((p) => (
              <li key={p.id}>
                <button type="button" className="w-full rounded border border-edge bg-surface-2 p-2 text-start text-sm hover:border-primary" onClick={() => onOpenRecent(p.id)}>
                  <span className="block truncate">{p.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {p.width}×{p.height}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
