'use client';

import { useMemo } from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/i18n/useLocalization';
import { buildRaw } from '@/lib/metadata/raw';
import type { MetadataEntry } from '@/lib/metadata/types';
import { copyText } from './clipboard';

function RawBlock({ title, value, empty }: { title: string; value: object; empty?: string }) {
  const { t } = useLocalization('interface');
  const json = useMemo(() => JSON.stringify(value, null, 2), [value]);
  const isEmpty = Object.keys(value).length === 0;
  const copy = async () => {
    const ok = await copyText(json);
    if (ok) toast.success(t('metadata.copied'));
    else toast.error(t('metadata.copyFailed'));
  };
  return (
    <section className="min-w-0 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        {isEmpty ? null : (
          <Button type="button" variant="outline" size="sm" onClick={copy}>
            <Copy aria-hidden="true" />
            {t('metadata.copyBlock')}
          </Button>
        )}
      </div>
      {isEmpty ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <pre tabIndex={0} className="max-h-[560px] overflow-auto rounded-md border border-edge bg-surface-2 p-3 font-mono text-xs">
          {json}
        </pre>
      )}
    </section>
  );
}

/** Raw view: exiftool-shaped groups beside the synthetic ffprobe groups. Mounted only while Raw is on. */
export function MetadataRaw({ entries }: { entries: readonly MetadataEntry[] }) {
  const { t } = useLocalization('interface');
  const raw = useMemo(() => buildRaw(entries), [entries]);
  return (
    <div data-testid="metadata-raw" className="grid gap-4 p-3 sm:p-4 lg:grid-cols-2">
      <RawBlock title={t('metadata.rawExiftool')} value={raw.exiftool} />
      <RawBlock title={t('metadata.rawFfprobe')} value={raw.ffprobe} empty={t('metadata.rawNoFfprobe')} />
    </div>
  );
}
