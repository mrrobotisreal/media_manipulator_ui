'use client';

import * as React from 'react';
import { Download, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLocalization } from '@/i18n/useLocalization';
import { useLocalizedHref } from '@/i18n/useLocalizedHref';
import { saveBlobToDisk } from '@/lib/results/save';
import { MOTION_BRAND } from '@/lib/vector/brand';
import { canExportCss, exportAnimatedSvgCss } from '@/lib/vector/export/css';
import { serializeSvg, svgFileName } from '@/lib/vector/exportSvg';
import { countVectorExport, type VectorExportRefusal, type VectorExportResult, type VectorExportRequest } from '@/lib/vector/exportsApi';
import { sampleDoc } from '@/lib/vector/sampleTrack';
import { isIrreversibleActionHidden } from '@/lib/translator/mode';
import type { VectorDoc } from '@/lib/vector/vectorTypes';
import { cn } from '@/lib/utils';

/**
 * The Motion export dialog, first version (ticket MM44 decision 9).
 *
 *   - Static SVG: free and UNCOUNTED (§3.4). Serialises the frame at the
 *     playhead and downloads. Zero API calls.
 *   - Animated SVG (CSS): counted. Calls `POST /api/vector/exports` FIRST and
 *     runs the exporter only on `{ok:true}`; 429 / 403 / 422 show a message
 *     with a plain link to /pricing (upgrade routing by ladder is MM49).
 *     The remaining count comes from the response.
 *   - Lottie, code, GIF and video are listed disabled, "Coming soon" (MM46/MM47).
 *
 * Translator deployments (MM52) hide the counted format: it spends a server
 * allowance, which is an irreversible action there. Static SVG stays.
 *
 * Dependencies are injectable for tests (`count`, `save`). The editor mounts the
 * dialog only while it is open, so every opening starts from a clean status.
 */
export interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doc: VectorDoc;
  name: string;
  /** Playhead (ms): static SVG exports this frame. */
  time: number;
  /** Server project id, when saved (absent for local / anonymous). */
  projectId?: string;
  /** Signed-in? Anonymous exports carry the "made with" comment. */
  signedIn: boolean;
  count?: (req: VectorExportRequest) => Promise<VectorExportResult>;
  save?: (blob: Blob, fileName: string) => void;
}

type Format = 'svg_animated' | 'svg_static';
const COMING_SOON = ['lottie', 'react_tsx', 'flutter', 'gif', 'mp4'] as const;

type Status =
  | { kind: 'idle' }
  | { kind: 'counting' }
  | { kind: 'done'; remaining: number | null }
  | { kind: 'refused'; refusal: VectorExportRefusal }
  | { kind: 'invalid' };

export function ExportDialog({ open, onOpenChange, doc, name, time, projectId, signedIn, count = countVectorExport, save = saveBlobToDisk }: ExportDialogProps) {
  const { t } = useLocalization('interface');
  const countedHidden = isIrreversibleActionHidden();
  const [format, setFormat] = React.useState<Format>(countedHidden ? 'svg_static' : 'svg_animated');
  const [status, setStatus] = React.useState<Status>({ kind: 'idle' });
  const cssCheck = React.useMemo(() => canExportCss(doc), [doc]);

  const exportStatic = () => {
    const svg = serializeSvg(sampleDoc(doc, time));
    save(new Blob([svg], { type: 'image/svg+xml' }), svgFileName(name));
    setStatus({ kind: 'done', remaining: null });
  };

  const exportAnimated = async () => {
    if (!cssCheck.ok) {
      setStatus({ kind: 'invalid' });
      return;
    }
    setStatus({ kind: 'counting' });
    const result = await count({
      ...(projectId ? { projectId } : {}),
      format: 'svg_animated',
      durationMs: doc.duration,
      height: Math.round(doc.canvas.height),
      fps: Math.round(doc.fps),
    });
    if (!result.ok) {
      setStatus({ kind: 'refused', refusal: result.refusal });
      return;
    }
    // Only now: the unit is spent server-side.
    const svg = exportAnimatedSvgCss(doc, { anonymous: !signedIn });
    save(new Blob([svg], { type: 'image/svg+xml' }), svgFileName(name));
    setStatus({ kind: 'done', remaining: result.granted.remaining });
  };

  const run = () => (format === 'svg_static' ? exportStatic() : void exportAnimated());
  const busy = status.kind === 'counting';

  const option = (id: Format, title: string, hint: string, extra?: React.ReactNode) => (
    <label
      key={id}
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-md border border-edge p-3 hover:bg-surface-2',
        format === id && 'border-edge-strong bg-surface-2',
      )}
    >
      <input type="radio" name="vector-export-format" value={id} checked={format === id} onChange={() => setFormat(id)} className="mt-1" />
      <span className="min-w-0">
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
        {extra}
      </span>
    </label>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !busy && onOpenChange(o)}>
      <DialogContent className="sm:max-w-lg" data-testid="vector-export-dialog">
        <DialogHeader>
          <DialogTitle>
            {t('vector.exportDialog.title')}{' '}
            <span className="ms-1 rounded-full border border-premium/40 bg-premium/10 px-2 py-0.5 align-middle text-[10px] font-medium uppercase tracking-wider text-premium">
              {t('vector.beta', { brand: MOTION_BRAND })}
            </span>
          </DialogTitle>
          <DialogDescription>{t('vector.exportDialog.description')}</DialogDescription>
        </DialogHeader>

        <div role="radiogroup" aria-label={t('vector.exportDialog.formats')} className="space-y-2">
          {!countedHidden &&
            option(
              'svg_animated',
              t('vector.exportDialog.animated'),
              t('vector.exportDialog.animatedHint'),
              !cssCheck.ok ? <span className="mt-1 block text-xs text-destructive">{t('vector.exportDialog.unsupported')}</span> : null,
            )}
          {option('svg_static', t('vector.exportDialog.static'), t('vector.exportDialog.staticHint'))}
          <ul className="space-y-1 pt-1" aria-label={t('vector.exportDialog.comingSoon')}>
            {COMING_SOON.map((f) => (
              <li key={f} className="flex items-center justify-between rounded-md border border-dashed border-edge px-3 py-2 text-xs text-text-subtle">
                <span>{t(`vector.exportDialog.formats_${f}`)}</span>
                <span className="uppercase tracking-wider">{t('vector.exportDialog.comingSoon')}</span>
              </li>
            ))}
          </ul>
        </div>

        <div role="status" aria-live="polite" className="min-h-5 text-sm" data-testid="vector-export-status">
          {status.kind === 'done' && (
            <span className="text-data">
              {status.remaining === null
                ? t('vector.exportDialog.doneStatic')
                : status.remaining < 0
                  ? t('vector.exportDialog.doneUnlimited')
                  : t('vector.exportDialog.done', { count: status.remaining })}
            </span>
          )}
          {status.kind === 'invalid' && <span className="text-destructive">{t('vector.exportDialog.unsupported')}</span>}
          {status.kind === 'refused' && <RefusalMessage refusal={status.refusal} />}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            {t('common.close')}
          </Button>
          <Button onClick={run} disabled={busy || (format === 'svg_animated' && !cssCheck.ok)}>
            {busy ? <Loader2 className="animate-spin" /> : <Download />}
            {t('vector.exportDialog.export')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RefusalMessage({ refusal }: { refusal: VectorExportRefusal }) {
  const { t } = useLocalization('interface');
  const localized = useLocalizedHref();
  const message = (() => {
    switch (refusal.kind) {
      case 'limit':
        return t('vector.exportDialog.limit', { count: refusal.limit });
      case 'locked':
        return t('vector.exportDialog.locked');
      case 'cap':
        return refusal.cap === 'duration'
          ? t('vector.exportDialog.capDuration', { seconds: Math.round(refusal.max / 100) / 10 })
          : t('vector.exportDialog.capOther');
      case 'unavailable':
        return t('vector.exportDialog.unavailable');
    }
  })();
  const upgrade = refusal.kind !== 'unavailable' && !isIrreversibleActionHidden();
  return (
    <span className="text-destructive" data-refusal={refusal.kind}>
      {message}{' '}
      {upgrade && (
        // Plain /pricing link in the editor's language (MM49 routes by ladder).
        <a href={localized('/pricing')} className="font-medium text-foreground underline underline-offset-2">
          {t('vector.exportDialog.upgrade')}
        </a>
      )}
    </span>
  );
}
