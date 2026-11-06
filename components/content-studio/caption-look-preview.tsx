'use client';

import React from 'react';
import { buildASS } from '@/lib/studio/captions/ass';
import type { CaptionLook } from '@/lib/studio/captions/captionLooks';
import { startJassub, type JassubInstance } from '@/lib/studio/captions/jassubPreview';

/**
 * A look's thumbnail drawn by JASSUB on a fixed sample (MM121 decision 7): the same generator and
 * libass as the preview and the export, so what the card shows is what the look renders. The
 * sample time sits on the second word so highlight/pop/karaoke all show their effect. Falls back
 * to the look's name on a plain swatch if the renderer cannot start.
 */
const SAMPLE_W = 640;
const SAMPLE_H = 360;
const SAMPLE_T = 0.75;
const SAMPLE_CUE = [{
  id: 's', startSeconds: 0, endSeconds: 3, text: 'Make it pop',
  words: [
    { text: 'Make', startSeconds: 0.1, endSeconds: 0.5 },
    { text: 'it', startSeconds: 0.55, endSeconds: 0.95 },
    { text: 'pop', startSeconds: 1, endSeconds: 1.6 },
  ],
}];

const CaptionLookPreview: React.FC<{ look: CaptionLook; label: string }> = ({ look, label }) => {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let inst: JassubInstance | null = null;
    let cancelled = false;
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 w-full h-full';
    host.appendChild(canvas);
    // Thumbnails ignore position (always centred) so every look is readable at card size.
    const style = { ...look.style, position: 'middle' as const, fontSizePct: Math.max(look.style.fontSizePct * 1.6, 9) };
    startJassub(canvas, buildASS(SAMPLE_CUE, style, SAMPLE_W, SAMPLE_H), [style.fontFamily ?? 'DejaVu Sans'])
      .then((i) => {
        if (cancelled) return void i.destroy();
        inst = i;
        const w = Math.max(1, host.clientWidth * Math.min(2, window.devicePixelRatio || 1));
        return i.manualRender({ expectedDisplayTime: performance.now(), width: Math.round(w), height: Math.round((w * SAMPLE_H) / SAMPLE_W), mediaTime: SAMPLE_T }, true);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      if (inst) void inst.destroy();
      else canvas.remove();
    };
  }, [look]);
  return (
    <div ref={hostRef} className="relative w-full aspect-video rounded bg-[linear-gradient(135deg,#2b3a55,#5a3f5e)] overflow-hidden" aria-hidden>
      {failed && <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white/80">{label}</span>}
    </div>
  );
};

export default CaptionLookPreview;
