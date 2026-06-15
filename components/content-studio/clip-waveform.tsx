'use client';

import React from 'react';
import { usePeaks } from '@/lib/studio/usePeaks';
import { useStudioStore } from '@/lib/studioStore';
import { clipDuration } from '@/lib/studio/previewEngine';
import type { StudioClip, StudioVolumeKeyframe } from '@/lib/studioTypes';

/**
 * Per-clip audio waveform + volume rubber band. Draws mirrored min/max peak bars
 * for the clip's [sourceIn, sourceOut] slice at the current zoom, plus the volume
 * automation line (flat at `volume`, or a polyline through `volumeKeyframes`).
 *
 * When `editable`, an overlay handles rubber-band gestures: drag a dot to retime
 * (clamped between neighbours) / re-gain it, Alt+click the line to add a
 * keyframe, double-click a dot to remove. Gestures call stopPropagation so they
 * don't start a dnd-kit clip drag; plain drags fall through to reposition the clip.
 */
interface Props {
  clip: StudioClip;
  assetId: string;
  width: number; // CSS px (the clip block content width)
  height: number; // CSS px
  selected: boolean;
  editable?: boolean;
}

const HIT_RADIUS = 8;
const MAX_DEVICE_WIDTH = 4096;
const EPS = 0.01;

const gainToY = (gain: number, h: number): number => h * (1 - gain / 2); // 2→top, 1→center, 0→bottom
const yToGain = (y: number, h: number): number => Math.max(0, Math.min(2, 2 * (1 - y / h)));

const ClipWaveform: React.FC<Props> = ({ clip, assetId, width, height, selected, editable }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const peaksQuery = usePeaks(assetId);
  const setVolumeKeyframes = useStudioStore((s) => s.setVolumeKeyframes);
  const addVolumeKeyframe = useStudioStore((s) => s.addVolumeKeyframe);
  const removeVolumeKeyframe = useStudioStore((s) => s.removeVolumeKeyframe);

  const dur = clipDuration(clip);
  const kfs = clip.volumeKeyframes;
  const flatVolume = clip.volume ?? 1;
  const peaks = peaksQuery.data;
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{ index: number } | null>(null);
  const showRubberBand = !!editable || (!!kfs && kfs.length > 0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = () => {
      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
      const cssW = Math.max(1, width);
      const cssH = Math.max(1, height);
      const devW = Math.min(MAX_DEVICE_WIDTH, Math.round(cssW * dpr));
      const devH = Math.round(cssH * dpr);
      if (canvas.width !== devW) canvas.width = devW;
      if (canvas.height !== devH) canvas.height = devH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, devW, devH);

      // --- waveform bars ---
      if (peaks && peaks.length > 0 && dur > 0) {
        const halfH = devH / 2;
        ctx.fillStyle = selected ? 'rgba(125,211,252,0.85)' : 'rgba(125,211,252,0.5)';
        const bps = peaks.bucketsPerSecond;
        for (let x = 0; x < devW; x += 1) {
          const t0 = clip.sourceIn + (x / devW) * dur;
          const t1 = clip.sourceIn + ((x + 1) / devW) * dur;
          const b0 = Math.floor(t0 * bps);
          const b1 = Math.max(b0, Math.floor(t1 * bps));
          const stride = Math.max(1, Math.floor((b1 - b0) / 32));
          let amp = 0;
          for (let b = b0; b <= b1; b += stride) {
            if (b < 0 || b >= peaks.length) continue;
            const mn = peaks.peaks[b * 2];
            const mx = peaks.peaks[b * 2 + 1];
            const a = Math.max(Math.abs(mn), Math.abs(mx)) / 127;
            if (a > amp) amp = a;
          }
          const barH = amp * halfH;
          ctx.fillRect(x, halfH - barH, 1, Math.max(1, barH * 2));
        }
      }

      // --- volume rubber band ---
      if (showRubberBand && dur > 0) {
        // unity (1.0) reference
        ctx.strokeStyle = 'rgba(255,255,255,0.16)';
        ctx.lineWidth = 1;
        const yc = gainToY(1, devH);
        ctx.beginPath();
        ctx.moveTo(0, yc);
        ctx.lineTo(devW, yc);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(250,204,21,0.95)';
        ctx.lineWidth = Math.max(1, dpr);
        ctx.beginPath();
        if (kfs && kfs.length > 0) {
          kfs.forEach((k, i) => {
            const x = (Math.min(dur, Math.max(0, k.t)) / dur) * devW;
            const y = gainToY(k.gain, devH);
            if (i === 0) ctx.moveTo(0, y);
            ctx.lineTo(x, y);
            if (i === kfs.length - 1) ctx.lineTo(devW, y);
          });
        } else {
          const y = gainToY(flatVolume, devH);
          ctx.moveTo(0, y);
          ctx.lineTo(devW, y);
        }
        ctx.stroke();

        if (kfs && kfs.length > 0) {
          ctx.fillStyle = 'rgba(250,204,21,1)';
          for (const k of kfs) {
            const x = (Math.min(dur, Math.max(0, k.t)) / dur) * devW;
            const y = gainToY(k.gain, devH);
            ctx.beginPath();
            ctx.arc(x, y, Math.max(2.5, dpr * 2.5), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [peaks, width, height, selected, dur, clip.sourceIn, flatVolume, kfs, showRubberBand]);

  // --- rubber-band pointer editing (CSS-space coordinates) ---
  const hitDot = (localX: number, localY: number): number => {
    if (!kfs || kfs.length === 0 || dur <= 0) return -1;
    for (let i = 0; i < kfs.length; i += 1) {
      const x = (Math.min(dur, Math.max(0, kfs[i].t)) / dur) * width;
      const y = gainToY(kfs[i].gain, height);
      if (Math.abs(x - localX) <= HIT_RADIUS && Math.abs(y - localY) <= HIT_RADIUS) return i;
    }
    return -1;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!editable || dur <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    const idx = hitDot(localX, localY);
    if (idx >= 0) {
      e.stopPropagation();
      e.preventDefault();
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
      dragRef.current = { index: idx };
      return;
    }
    if (e.altKey) {
      // Add a keyframe on the line.
      e.stopPropagation();
      e.preventDefault();
      const t = (localX / width) * dur;
      addVolumeKeyframe(clip.id, t, yToGain(localY, height));
    }
    // Otherwise let the event bubble to the clip's dnd-kit drag.
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || !kfs) return;
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    const prev = drag.index > 0 ? kfs[drag.index - 1].t + EPS : 0;
    const next = drag.index < kfs.length - 1 ? kfs[drag.index + 1].t - EPS : dur;
    const t = Math.max(prev, Math.min(next, (localX / width) * dur));
    const gain = yToGain(localY, height);
    const updated: StudioVolumeKeyframe[] = kfs.map((k, i) => (i === drag.index ? { t, gain } : k));
    setVolumeKeyframes(clip.id, updated);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    if (!editable) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const idx = hitDot(e.clientX - rect.left, e.clientY - rect.top);
    if (idx >= 0) {
      e.stopPropagation();
      removeVolumeKeyframe(clip.id, idx);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width, height }} />
      {editable && (
        <div
          className="absolute inset-0 touch-none pointer-events-auto"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={onDoubleClick}
        />
      )}
    </div>
  );
};

export default ClipWaveform;
