'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Download, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { useSaveProject } from '@/lib/useStudioProject';
import { useStartStudioExport, studioDownloadUrl } from '@/lib/useStudioExport';
import { useStudioJobProgress } from '@/lib/useStudioJob';

const exportFormSchema = z.object({
  fileName: z.string().min(1, 'Enter a file name').max(120),
  quality: z.enum(['low', 'medium', 'high']),
});
type ExportFormValues = z.infer<typeof exportFormSchema>;

/**
 * Export dialog — saves the project (the server renders from the persisted EDL)
 * then kicks off the NVENC render, subscribes to the job over SSE, and offers
 * the result via /api/download/:jobId.
 */
const ExportDialog: React.FC<{ projectId: string; disabled?: boolean }> = ({ projectId, disabled }) => {
  const { t } = useLocalization('interface');
  const [open, setOpen] = React.useState(false);
  const [jobId, setJobId] = React.useState<string | null>(null);

  const projectName = useStudioStore((s) => s.project?.name ?? 'export');
  const toSaveRequest = useStudioStore((s) => s.toSaveRequest);
  const markSaved = useStudioStore((s) => s.markSaved);
  const saveMutation = useSaveProject();
  const { startExport, isStarting } = useStartStudioExport(projectId);

  const job = useStudioJobProgress(jobId, {
    onError: (msg) => toast.error('Export failed', { description: msg }),
  });

  const form = useForm<ExportFormValues>({
    resolver: zodResolver(exportFormSchema),
    defaultValues: { fileName: projectName.replace(/\s+/g, '-').toLowerCase(), quality: 'high' },
  });

  const reset = () => {
    setJobId(null);
    form.reset({ fileName: projectName.replace(/\s+/g, '-').toLowerCase(), quality: 'high' });
  };

  const onSubmit = async (values: ExportFormValues) => {
    const req = toSaveRequest();
    if (!req) return;
    try {
      const saved = await saveMutation.mutateAsync({ id: projectId, req });
      markSaved(saved);
    } catch (err) {
      toast.error('Failed to save project', { description: (err as Error).message });
      return;
    }
    try {
      const res = await startExport({ fileName: values.fileName, preset: values.quality });
      setJobId(res.jobId);
    } catch (err) {
      toast.error('Failed to start export', { description: (err as Error).message });
    }
  };

  const busy = saveMutation.isPending || isStarting;
  const rendering = !!jobId && job?.status !== 'completed' && job?.status !== 'failed';
  const done = job?.status === 'completed';

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <Upload className="w-4 h-4 mr-2" />
          {t('contentStudio.export.button')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('contentStudio.export.title')}</DialogTitle>
          <DialogDescription>{t('contentStudio.export.description')}</DialogDescription>
        </DialogHeader>

        {!jobId ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fileName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contentStudio.export.fileName')}</FormLabel>
                    <FormControl>
                      <Input placeholder="my-edit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contentStudio.export.quality')}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">{t('contentStudio.export.qualityHigh')}</SelectItem>
                        <SelectItem value="medium">{t('contentStudio.export.qualityMedium')}</SelectItem>
                        <SelectItem value="low">{t('contentStudio.export.qualityLow')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={busy}>
                  {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {t('contentStudio.export.start')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            {rendering && (
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('contentStudio.export.rendering')} {job?.progress ?? 0}%
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all" style={{ width: `${job?.progress ?? 0}%` }} />
                </div>
              </div>
            )}
            {job?.status === 'failed' && (
              <p className="text-sm text-destructive">{job.error || t('contentStudio.export.failed')}</p>
            )}
            {done && (
              <div className="space-y-3">
                <p className="text-sm text-emerald-500">{t('contentStudio.export.ready')}</p>
                <Button asChild>
                  <a href={studioDownloadUrl(jobId)} download>
                    <Download className="w-4 h-4 mr-2" />
                    {t('contentStudio.export.download')}
                  </a>
                </Button>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={reset}>
                {t('contentStudio.export.again')}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
