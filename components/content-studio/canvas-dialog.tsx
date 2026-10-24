'use client';

import React from 'react';
import { Frame } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { editSummary } from '@/lib/studio/telemetry';
import { CANVAS_PRESETS, canvasPresetKey, clampCanvas } from '@/lib/studio/exportOptions';

/**
 * Project settings: Change canvas. Updates width/height through the store (one
 * undoable history entry). Clips keep their transforms and the compositor
 * letterboxes - nothing is reframed automatically, which the confirm step says
 * out loud. The new size only affects the preview and FUTURE exports; the
 * output-height tier cap is enforced by the server at export time, like for any
 * canvas.
 */
const CanvasDialog: React.FC = () => {
  const { t } = useLocalization('interface');
  const width = useStudioStore((s) => s.project?.width ?? 1920);
  const height = useStudioStore((s) => s.project?.height ?? 1080);
  const setCanvas = useStudioStore((s) => s.setCanvas);
  const [open, setOpen] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [w, setW] = React.useState(String(width));
  const [h, setH] = React.useState(String(height));

  const pick = (pw: number, ph: number) => {
    setW(String(pw));
    setH(String(ph));
  };
  const next = clampCanvas(Number(w), Number(h));
  const changed = next.width !== width || next.height !== height;
  const activeKey = canvasPresetKey(next.width, next.height);

  const apply = () => {
    setCanvas(next.width, next.height);
    editSummary.increment('canvasChanges');
    editSummary.increment('uiInvocations');
    setConfirming(false);
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (o) pick(width, height);
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            title={t('contentStudio.canvas.open')}
            aria-label={t('contentStudio.canvas.open')}
          >
            <Frame className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('contentStudio.canvas.title')}</DialogTitle>
            <DialogDescription>
              {t('contentStudio.canvas.current', { width, height })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label={t('contentStudio.canvas.presets')}>
              {CANVAS_PRESETS.map((p) => (
                <Button
                  key={p.key}
                  type="button"
                  size="sm"
                  variant={activeKey === p.key ? 'secondary' : 'outline'}
                  aria-pressed={activeKey === p.key}
                  onClick={() => pick(p.width, p.height)}
                >
                  {p.key}
                </Button>
              ))}
              <Button type="button" size="sm" variant={activeKey === 'custom' ? 'secondary' : 'outline'} aria-pressed={activeKey === 'custom'} disabled>
                {t('contentStudio.canvas.custom')}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="cs-canvas-w">{t('contentStudio.canvas.width')}</Label>
                <Input id="cs-canvas-w" inputMode="numeric" value={w} onChange={(e) => setW(e.target.value.replace(/\D/g, ''))} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cs-canvas-h">{t('contentStudio.canvas.height')}</Label>
                <Input id="cs-canvas-h" inputMode="numeric" value={h} onChange={(e) => setH(e.target.value.replace(/\D/g, ''))} />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">{t('contentStudio.canvas.hint', { width: next.width, height: next.height })}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('contentStudio.canvas.cancel')}
            </Button>
            <Button disabled={!changed} onClick={() => setConfirming(true)}>
              {t('contentStudio.canvas.apply')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('contentStudio.canvas.confirmTitle', { width: next.width, height: next.height })}</AlertDialogTitle>
            <AlertDialogDescription>{t('contentStudio.canvas.confirmBody')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('contentStudio.canvas.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={apply}>{t('contentStudio.canvas.confirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CanvasDialog;
