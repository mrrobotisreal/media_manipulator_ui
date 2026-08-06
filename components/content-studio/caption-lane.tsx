'use client';

import React from 'react';
import { Captions, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { useGenerateCaptions, serializeSRT, serializeVTT, downloadText } from '@/lib/useStudioCaptions';
import { useStudioJobProgress } from '@/lib/useStudioJob';
import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL } from '@/lib/utils';
import { studioProjectSchema } from '@/lib/studioTypes';
import { analytics, EVENTS } from '@/lib/analytics';

/**
 * Bucket a cue count.
 *
 * Buckets rather than the raw number for the same reason the old studio telemetry module
 * did it: an exact cue count on a long video is close to a fingerprint of that specific
 * media, and "did they generate a few captions or hundreds" is the only question anyone
 * actually asks of it.
 */
function cueCountBucket(n: number): string {
  if (n <= 0) return '0';
  if (n <= 10) return '1-10';
  if (n <= 50) return '11-50';
  if (n <= 200) return '51-200';
  return '200+';
}

export const CAPTION_LANE_HEIGHT = 28;
const MIN_CUE = 0.3;
const LANGUAGES = ['', 'en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'zh'];

/**
 * CaptionControls — the caption lane header cluster (lives in the timeline
 * toolbar): generate (with language + overwrite confirm), .srt/.vtt export, and
 * the captions-enabled toggle.
 */
export const CaptionControls: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { t } = useLocalization('interface');
  const project = useStudioStore((s) => s.project);
  const setCaptions = useStudioStore((s) => s.setCaptions);
  const setCaptionStyle = useStudioStore((s) => s.setCaptionStyle);
  const setCaptionsEnabled = useStudioStore((s) => s.setCaptionsEnabled);
  const { generate, isGenerating } = useGenerateCaptions(projectId);
  const [jobId, setJobId] = React.useState<string | null>(null);
  const [language, setLanguage] = React.useState('');

  useStudioJobProgress(jobId, {
    onComplete: () => {
      setJobId(null);
      // The server wrote the cues; pull the fresh project and push them into the store.
      void (async () => {
        try {
          const res = await authedFetch(`${getBaseURL()}/studio/projects/${projectId}`);
          if (!res.ok) return;
          const fresh = studioProjectSchema.parse(await res.json());
          setCaptions(fresh.captions);
          if (fresh.captionStyle) setCaptionStyle(fresh.captionStyle);
          // Content Studio events map to `feature_used`, not to the tool funnel: the studio
          // is an editor, not an upload → job → download flow, and forcing it into the funnel
          // would corrupt the conversion rates the funnel exists to measure.
          //
          // PRIVACY: the cue COUNT, bucketed. Never the caption text — that is a transcript
          // of someone's media and is forbidden in event properties.
          analytics.track(
            EVENTS.FEATURE_USED,
            {
              feature: 'studio',
              action: 'captions_generated',
              value: cueCountBucket(fresh.captions.length),
            },
            { feature: 'studio' },
          );
          toast.success('Captions ready');
        } catch {
          /* ignore */
        }
      })();
    },
    onError: (msg) => {
      setJobId(null);
      toast.error(t('contentStudio.captions.failed'), { description: msg });
    },
  });

  if (!project) return null;
  const cues = project.captions;
  const hasCues = cues.length > 0;
  const generating = isGenerating || !!jobId;

  const onGenerate = async () => {
    if (hasCues && !window.confirm(t('contentStudio.captions.overwriteConfirm'))) return;
    try {
      const res = await generate(language);
      setJobId(res.jobId);
    } catch (err) {
      toast.error(t('contentStudio.captions.failed'), { description: (err as Error).message });
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <Captions className="w-4 h-4 text-muted-foreground" />
      <Select value={language || 'auto'} onValueChange={(v) => setLanguage(v === 'auto' ? '' : v)}>
        <SelectTrigger className="h-7 w-24 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((l) => (
            <SelectItem key={l || 'auto'} value={l || 'auto'} className="text-xs">
              {l === '' ? t('contentStudio.captions.languageAuto') : l.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" variant="ghost" className="h-7" disabled={generating} onClick={onGenerate}>
        {generating ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Captions className="w-3.5 h-3.5 mr-1" />}
        {generating ? t('contentStudio.captions.generating') : t('contentStudio.captions.generate')}
      </Button>
      {hasCues && (
        <>
          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => downloadText(`${project.name || 'captions'}.srt`, serializeSRT(cues), 'application/x-subrip')}>
            <Download className="w-3.5 h-3.5 mr-1" />
            {t('contentStudio.captions.exportSrt')}
          </Button>
          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => downloadText(`${project.name || 'captions'}.vtt`, serializeVTT(cues), 'text/vtt')}>
            <Download className="w-3.5 h-3.5 mr-1" />
            {t('contentStudio.captions.exportVtt')}
          </Button>
          <div className="flex items-center gap-1 ml-1">
            <Switch checked={project.captionsEnabled} onCheckedChange={setCaptionsEnabled} aria-label={t('contentStudio.captions.show')} />
          </div>
        </>
      )}
    </div>
  );
};

interface DragState {
  mode: 'move' | 'l' | 'r';
  id: string;
  startX: number;
  start: number;
  end: number;
}

/**
 * CaptionLaneContent — the cue blocks row (rendered in the timeline's scrollable
 * content between the ruler and the tracks). Click selects; drag the body to
 * move; drag an edge to retime (min 0.3s).
 */
export const CaptionLaneContent: React.FC<{ zoom: number }> = ({ zoom }) => {
  const project = useStudioStore((s) => s.project);
  const selectedCaptionId = useStudioStore((s) => s.selectedCaptionId);
  const selectCaption = useStudioStore((s) => s.selectCaption);
  const updateCaption = useStudioStore((s) => s.updateCaption);
  const drag = React.useRef<DragState | null>(null);

  if (!project) return null;
  const cues = project.captions;

  const onDown = (e: React.PointerEvent, mode: DragState['mode'], clip: { id: string; startSeconds: number; endSeconds: number }) => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    drag.current = { mode, id: clip.id, startX: e.clientX, start: clip.startSeconds, end: clip.endSeconds };
    selectCaption(clip.id);
    // The whole cue move/retime drag collapses to one undo entry (closed in onUp).
    useStudioStore.getState().beginGesture();
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const delta = (e.clientX - d.startX) / zoom;
    if (d.mode === 'move') {
      const len = d.end - d.start;
      const start = Math.max(0, d.start + delta);
      updateCaption(d.id, { startSeconds: start, endSeconds: start + len });
    } else if (d.mode === 'l') {
      const start = Math.max(0, Math.min(d.end - MIN_CUE, d.start + delta));
      updateCaption(d.id, { startSeconds: start });
    } else {
      const end = Math.max(d.start + MIN_CUE, d.end + delta);
      updateCaption(d.id, { endSeconds: end });
    }
  };
  const onUp = (e: React.PointerEvent) => {
    if (!drag.current) return;
    drag.current = null;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    useStudioStore.getState().endGesture();
  };

  return (
    <div className="relative border-b border-border bg-premium/8" style={{ height: CAPTION_LANE_HEIGHT }}>
      {cues.map((cue) => {
        const left = cue.startSeconds * zoom;
        const width = Math.max(10, (cue.endSeconds - cue.startSeconds) * zoom);
        const selected = selectedCaptionId === cue.id;
        return (
          <div
            key={cue.id}
            className={`absolute top-0.5 bottom-0.5 rounded overflow-hidden border touch-none cursor-grab active:cursor-grabbing text-[10px] text-white/90 px-1 leading-[22px] whitespace-nowrap ${
              selected ? 'border-premium/60 ring-1 ring-premium bg-premium/25' : 'border-premium/50 bg-premium/15'
            }`}
            style={{ left, width }}
            title={cue.text}
            onPointerDown={(e) => onDown(e, 'move', cue)}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            {cue.text || '…'}
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize bg-white/10 hover:bg-white/40"
              onPointerDown={(e) => onDown(e, 'l', cue)}
              onPointerMove={onMove}
              onPointerUp={onUp}
            onPointerCancel={onUp}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-1.5 cursor-ew-resize bg-white/10 hover:bg-white/40"
              onPointerDown={(e) => onDown(e, 'r', cue)}
              onPointerMove={onMove}
              onPointerUp={onUp}
            onPointerCancel={onUp}
            />
          </div>
        );
      })}
    </div>
  );
};
