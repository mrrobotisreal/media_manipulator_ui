'use client';

import { cuesHaveWords } from '@/lib/studio/captions/analytics';
import React from 'react';
import { Captions, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { useGenerateCaptions, serializeSRT, serializeVTT, downloadText } from '@/lib/useStudioCaptions';
import { captionGenerateBridge } from '@/lib/studio/editorBridges';
import { useStudioJobProgress } from '@/lib/useStudioJob';
import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL } from '@/lib/utils';
import { studioProjectSchema } from '@/lib/studioTypes';
import { analytics, EVENTS, cueCountBucket } from '@/lib/analytics';
import { studioHost } from '@/lib/studio/telemetry';
import { useAuth } from '@/lib/auth/AuthProvider';
import { publishLimitRefusal } from '@/lib/auth/quotaBus';
import { retimeBoundary, toggleEmphasis } from '@/lib/studio/captions/wordEdit';
import type { StudioCaptionCue } from '@/lib/studioTypes';

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
          // First-class studio event (part 10, ADR ws/0003), not the tool funnel: the
          // studio is an editor, not an upload → job → download flow, and forcing it into
          // the funnel would corrupt the conversion rates the funnel exists to measure.
          //
          // PRIVACY: the cue COUNT, bucketed (shared helper — same boundaries as the old
          // local one, so the data is continuous). Never the caption text — that is a
          // transcript of someone's media and is forbidden in event properties.
          analytics.track(
            EVENTS.STUDIO_CAPTIONS_GENERATED,
            { cueCountBucket: cueCountBucket(fresh.captions.length), hasWords: cuesHaveWords(fresh.captions), host: studioHost() },
            { feature: 'studio' },
          );
          toast.success(t('toasts.captionsReady'));
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

  const onGenerate = async (lang: string = language) => {
    if (hasCues && !window.confirm(t('contentStudio.captions.overwriteConfirm'))) return;
    try {
      const res = await generate(lang);
      setJobId(res.jobId);
    } catch (err) {
      toast.error(t('contentStudio.captions.failed'), { description: (err as Error).message });
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <CaptionBridge onGenerate={(lang) => void onGenerate(lang ?? language)} disabled={generating} />
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
      <Button size="sm" variant="ghost" className="h-7" disabled={generating} onClick={() => void onGenerate()}>
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
            {selected && (cue.words?.length ?? 0) > 0 && (cue.endSeconds - cue.startSeconds) * zoom >= (cue.words?.length ?? 0) * 6 ? (
              <CaptionWordStrip cue={cue} zoom={zoom} />
            ) : (
              cue.text || '…'
            )}
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

/** studio_caption_word_edited (never caption text). */
export function trackCaptionWordEdit(kind: 'retime' | 'emphasis' | 'reset'): void {
  analytics.track(EVENTS.STUDIO_CAPTION_WORD_EDITED, { kind, source: 'ui', host: studioHost() }, { feature: 'studio' });
}

/**
 * MM122 decision 3: the selected cue's words on the lane. Each word is a button (click toggles
 * emphasis); each boundary between words (and the first start / last end) is a drag handle that
 * retimes it, clamped to its neighbours and snapped to one frame, one undo step per drag.
 * Without the per-word editor (Limits.CaptionWordEdit: Premium and Pro) the words are shown
 * read-only and a drag or click opens the upgrade interstitial instead.
 */
export const CaptionWordStrip: React.FC<{ cue: StudioCaptionCue; zoom: number }> = ({ cue, zoom }) => {
  const { t } = useLocalization('interface');
  const auth = useAuth();
  const canEdit = auth?.limits?.captionWordEdit === true;
  const fps = useStudioStore((s) => s.project?.fps);
  const updateCaption = useStudioStore((s) => s.updateCaption);
  const drag = React.useRef<{ b: number; startX: number; t0: number; moved: boolean } | null>(null);
  const words = cue.words ?? [];
  const x = (sec: number) => (sec - cue.startSeconds) * zoom;
  const bounds = [...words.map((w) => w.startSeconds), words[words.length - 1].endSeconds];

  const locked = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    publishLimitRefusal({ error: 'caption_word_edit', fromClick: true, upgradePath: auth?.tier === 'anonymous' ? 'signup' : 'premium' });
  };
  const onDown = (e: React.PointerEvent, b: number) => {
    if (!canEdit) return locked(e);
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    drag.current = { b, startX: e.clientX, t0: bounds[b], moved: false };
    useStudioStore.getState().beginGesture();
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    e.stopPropagation();
    const live = useStudioStore.getState().project?.captions.find((c) => c.id === cue.id);
    if (!live) return;
    const next = retimeBoundary(live, d.b, d.t0 + (e.clientX - d.startX) / zoom, fps);
    if (next && next !== live.words) {
      d.moved = true;
      updateCaption(cue.id, { words: next });
    }
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    e.stopPropagation();
    drag.current = null;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    useStudioStore.getState().endGesture();
    if (d.moved) trackCaptionWordEdit('retime');
  };
  const onWord = (e: React.MouseEvent, i: number) => {
    if (!canEdit) return locked(e);
    e.stopPropagation();
    const next = toggleEmphasis(cue, i);
    if (next) {
      updateCaption(cue.id, { words: next });
      trackCaptionWordEdit('emphasis');
    }
  };

  return (
    <div className="absolute inset-0" data-testid="caption-word-strip" aria-label={t('contentStudio.captions.words')}>
      {words.map((w, i) => (
        <button
          key={`w${i}`}
          type="button"
          className={`absolute top-0 bottom-0 overflow-hidden px-0.5 text-[9px] leading-[22px] text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
            w.emphasis ? 'bg-premium/45 text-white font-semibold' : 'hover:bg-white/10'
          } ${canEdit ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          style={{ left: x(w.startSeconds), width: Math.max(4, x(w.endSeconds) - x(w.startSeconds)) }}
          title={canEdit ? `${w.text} · ${t('contentStudio.captions.emphasis')}` : t('contentStudio.captions.wordsLockedHint')}
          aria-pressed={!!w.emphasis}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => onWord(e, i)}
          data-testid={`caption-word-${i}`}
        >
          {w.text}
        </button>
      ))}
      {bounds.map((b, i) => (
        <div
          key={`b${i}`}
          role="separator"
          aria-orientation="vertical"
          aria-label={t('contentStudio.captions.wordBoundary', { word: words[Math.min(i, words.length - 1)].text })}
          className={`absolute top-0 bottom-0 w-1.5 -ml-[3px] touch-none ${canEdit ? 'cursor-ew-resize bg-white/30 hover:bg-white/70' : 'cursor-not-allowed bg-white/15'}`}
          style={{ left: x(b) }}
          onPointerDown={(e) => onDown(e, i)}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          data-testid={`caption-boundary-${i}`}
        />
      ))}
    </div>
  );
};

/** MM109: Medi's "Generate captions" button lands here (spends allowance only on that click). */
const CaptionBridge: React.FC<{ onGenerate: (language: string | null) => void; disabled: boolean }> = ({ onGenerate, disabled }) => {
  const ref = React.useRef({ onGenerate, disabled });
  React.useEffect(() => {
    ref.current = { onGenerate, disabled };
  });
  React.useEffect(() => {
    captionGenerateBridge.register((lang) => {
      if (!ref.current.disabled) ref.current.onGenerate(lang ?? null);
    });
    return () => captionGenerateBridge.register(null);
  }, []);
  return null;
};
