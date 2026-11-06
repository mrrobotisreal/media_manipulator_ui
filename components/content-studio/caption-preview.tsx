'use client';

import React from 'react';
import { analytics, EVENTS } from '@/lib/analytics';
import { assFontFamilies, buildPreviewASS } from '@/lib/studio/captions/ass';
import { CaptionPreviewError, startJassub, type CaptionFallbackReason, type JassubInstance } from '@/lib/studio/captions/jassubPreview';
import { studioHost } from '@/lib/studio/telemetry';
import { useStudioStore } from '@/lib/studioStore';
import type { StudioCaptionCue, StudioCaptionStyle } from '@/lib/studioTypes';

/**
 * Caption preview (MM121 decision 5): JASSUB (libass/WASM) draws the TS generator's .ass over the
 * preview at the letterboxed project rect, timed by the playhead (paused and playing). The DOM
 * caption overlay is gone; only if JASSUB cannot start does a plain-text fallback show (and
 * `studio_caption_renderer_fallback` is logged once per editor session).
 *
 * Mounted only while captions are on and a cue exists, so the renderer loads lazily.
 */
interface Props {
  cues: StudioCaptionCue[];
  style: StudioCaptionStyle | undefined;
  projectW: number;
  projectH: number;
  boxW: number;
  boxH: number;
}

let fallbackLogged = false;

/** The project rect inside the object-contain box (same math as SafeMarginGuides). */
export function letterbox(boxW: number, boxH: number, projectW: number, projectH: number) {
  const scale = Math.min(boxW / Math.max(1, projectW), boxH / Math.max(1, projectH));
  const w = projectW * scale;
  const h = projectH * scale;
  return { x: (boxW - w) / 2, y: (boxH - h) / 2, w, h };
}

const CaptionPreview: React.FC<Props> = ({ cues, style, projectW, projectH, boxW, boxH }) => {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const instRef = React.useRef<JassubInstance | null>(null);
  const [failed, setFailed] = React.useState<CaptionFallbackReason | null>(null);
  const ass = React.useMemo(() => buildPreviewASS(cues, style, projectW, projectH), [cues, style, projectW, projectH]);
  const fonts = React.useMemo(() => assFontFamilies(cues, style), [cues, style]);
  const assRef = React.useRef(ass);
  const rect = letterbox(boxW, boxH, projectW, projectH);
  const dpr = typeof window !== 'undefined' ? Math.min(2, window.devicePixelRatio || 1) : 1;
  const renderW = Math.max(1, Math.round(rect.w * dpr));
  const renderH = Math.max(1, Math.round(rect.h * dpr));
  const sizeRef = React.useRef({ w: renderW, h: renderH });
  React.useLayoutEffect(() => {
    assRef.current = ass;
    sizeRef.current = { w: renderW, h: renderH };
  });

  const draw = React.useCallback((t: number, repaint = false) => {
    const inst = instRef.current;
    if (!inst) return;
    const { w, h } = sizeRef.current;
    inst.manualRender({ expectedDisplayTime: performance.now(), width: w, height: h, mediaTime: t }, repaint).catch(() => undefined);
  }, []);

  // Start once (a fresh canvas each mount: transferControlToOffscreen is one-shot).
  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 w-full h-full pointer-events-none';
    canvas.dataset.testid = 'caption-preview-canvas';
    host.appendChild(canvas);
    startJassub(canvas, assRef.current, fonts)
      .then((inst) => {
        if (cancelled) {
          void inst.destroy();
          return;
        }
        instRef.current = inst;
        draw(useStudioStore.getState().playhead, true);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const reason: CaptionFallbackReason = e instanceof CaptionPreviewError ? e.reason : 'render_failed';
        setFailed(reason);
        if (!fallbackLogged) {
          fallbackLogged = true;
          analytics.track(EVENTS.STUDIO_CAPTION_RENDERER_FALLBACK, { reason, host: studioHost() }, { feature: 'studio' });
        }
      });
    return () => {
      cancelled = true;
      const inst = instRef.current;
      instRef.current = null;
      if (inst) void inst.destroy();
      else canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one renderer per mount; track + fonts update below
  }, []);

  // New track text (cue or style edits).
  React.useEffect(() => {
    const inst = instRef.current;
    if (!inst) return;
    Promise.resolve(inst.renderer.setTrack(ass)).then(() => draw(useStudioStore.getState().playhead, true)).catch(() => undefined);
  }, [ass, draw]);

  // Size changes (layout, focus mode, DPR).
  React.useEffect(() => {
    draw(useStudioStore.getState().playhead, true);
  }, [renderW, renderH, draw]);

  // Playhead → mediaTime (subscribe outside React renders: the hot loop sets it every frame).
  React.useEffect(() => useStudioStore.subscribe((s, prev) => {
    if (s.playhead !== prev.playhead) draw(s.playhead, !s.isPlaying);
  }), [draw]);

  if (failed) return <CaptionFallbackText cues={cues} style={style} rect={rect} />;
  return (
    <div
      ref={hostRef}
      className="absolute pointer-events-none"
      style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h, zIndex: 8 }}
      data-testid="caption-preview"
    />
  );
};

/** Plain-text fallback when JASSUB cannot start (no styling or animation, by design). */
const CaptionFallbackText: React.FC<{ cues: StudioCaptionCue[]; style: StudioCaptionStyle | undefined; rect: { x: number; y: number; w: number; h: number } }> = ({ cues, style, rect }) => {
  const playhead = useStudioStore((s) => s.playhead);
  const cue = cues.find((c) => playhead >= c.startSeconds && playhead < c.endSeconds);
  if (!cue) return null;
  const pos = style?.position ?? 'bottom';
  return (
    <div
      className="absolute flex justify-center pointer-events-none"
      style={{
        left: rect.x, width: rect.w, zIndex: 8,
        ...(pos === 'top' ? { top: rect.y + rect.h * 0.05 } : pos === 'middle' ? { top: rect.y + rect.h / 2, transform: 'translateY(-50%)' } : { top: rect.y + rect.h * 0.95, transform: 'translateY(-100%)' }),
      }}
      data-testid="caption-fallback"
    >
      <span style={{ fontSize: `${((style?.fontSizePct ?? 4.5) / 100) * rect.h}px`, color: style?.color ?? '#FFFFFF', background: 'rgba(0,0,0,0.55)', padding: '0.1em 0.4em', textAlign: 'center', lineHeight: 1.25, whiteSpace: 'pre-wrap', maxWidth: `${style?.maxWidthPct ?? 90}%` }}>
        {cue.text}
      </span>
    </div>
  );
};

export default CaptionPreview;
