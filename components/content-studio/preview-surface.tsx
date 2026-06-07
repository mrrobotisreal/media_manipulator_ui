'use client';

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import {
  resolveActiveClips,
  topVideoClip,
  timelineDuration,
  studioProxyUrl,
  transitionRamp,
  cssFilterForAdjustments,
} from '@/lib/studio/previewEngine';

// Pool of decoders. Kept small to respect Safari's ~4–6 concurrent <video>
// decoder cap; elements are reassigned as clips enter/leave the playhead.
const POOL_SIZE = 4;

interface Slot {
  clipId: string | null;
  srcAssetId: string | null;
}

interface AudioGraph {
  ctx: AudioContext | null;
  sources: (MediaElementAudioSourceNode | null)[];
  slotGains: (GainNode | null)[]; // per-slot clip volume
  trackGains: Map<string, GainNode>; // per-track mute/master
}

/**
 * Preview surface (Option A, full multi-track). The timeline is the clock: a
 * requestAnimationFrame loop advances the playhead, the resolver decides which
 * clips are active per track, and we assign each to a pooled <video>, seek it,
 * and play it. The top-most video track's element is shown (honoring opacity);
 * the rest play hidden purely for their audio. Audio is summed through a Web
 * Audio graph — one GainNode per track (mute) and a per-slot gain (clip volume)
 * — so mixing is honored live.
 *
 * KNOWN LIMITATION: driving HTMLMediaElement.currentTime from a wall clock
 * drifts on long timelines (decode jitter, variable seek latency), and clip
 * boundaries can flash when the proxy element reloads a new source. The robust
 * fix is to decode into AudioBuffers and schedule them on the AudioContext
 * clock (sample-accurate), and to use WebCodecs/canvas for video. That is a
 * deliberate future migration of this module — NOT built here.
 */
const PreviewSurface: React.FC = () => {
  const { t, formatDuration } = useLocalization('interface');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const poolEls = React.useRef<(HTMLVideoElement | null)[]>(Array(POOL_SIZE).fill(null));
  const slots = React.useRef<Slot[]>(Array.from({ length: POOL_SIZE }, () => ({ clipId: null, srcAssetId: null })));
  const audio = React.useRef<AudioGraph>({
    ctx: null,
    sources: Array(POOL_SIZE).fill(null),
    slotGains: Array(POOL_SIZE).fill(null),
    trackGains: new Map(),
  });
  const rafRef = React.useRef<number | null>(null);
  const lastTsRef = React.useRef(0);
  const [boxH, setBoxH] = React.useState(0);

  const isPlaying = useStudioStore((s) => s.isPlaying);
  const playhead = useStudioStore((s) => s.playhead);
  const project = useStudioStore((s) => s.project);
  const assets = useStudioStore((s) => s.assets);
  const setPlayhead = useStudioStore((s) => s.setPlayhead);
  const pause = useStudioStore((s) => s.pause);
  const play = useStudioStore((s) => s.play);

  const tracks = project?.tracks ?? [];
  const fps = project?.fps ?? 30;
  const duration = timelineDuration(tracks);
  const activeNow = resolveActiveClips(tracks, playhead);
  const topNow = topVideoClip(activeNow);
  const building = !!topNow && assets[topNow.clip.assetId]?.status !== 'ready';
  const hasClips = tracks.some((tr) => tr.clips.length > 0);

  // Text/location overlays for the active video clips (faked over the surface;
  // the export draws them in with drawtext).
  const projectHeight = project?.height ?? 1080;
  const textItems = activeNow
    .filter((a) => a.trackKind === 'video')
    .flatMap((a) =>
      (a.clip.textOverlays ?? []).map((ov) => ({
        key: a.clip.id + ov.id,
        ov,
        opacity: (a.clip.opacity ?? 1) * transitionRamp(a.clip, playhead),
      })),
    );

  // --- Web Audio wiring (created lazily within a user gesture) ---
  const ensureAudioGraph = React.useCallback(() => {
    const a = audio.current;
    if (a.ctx) {
      if (a.ctx.state === 'suspended') void a.ctx.resume().catch(() => {});
      return;
    }
    try {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      a.ctx = ctx;
      for (let i = 0; i < POOL_SIZE; i += 1) {
        const el = poolEls.current[i];
        if (!el) continue;
        try {
          const src = ctx.createMediaElementSource(el);
          const g = ctx.createGain();
          g.gain.value = 0;
          src.connect(g);
          a.sources[i] = src;
          a.slotGains[i] = g;
        } catch {
          // element may already be tapped; ignore
        }
      }
    } catch {
      a.ctx = null;
    }
  }, []);

  const trackGain = React.useCallback((trackId: string): GainNode | null => {
    const a = audio.current;
    if (!a.ctx) return null;
    let g = a.trackGains.get(trackId);
    if (!g) {
      g = a.ctx.createGain();
      g.gain.value = 1;
      g.connect(a.ctx.destination);
      a.trackGains.set(trackId, g);
    }
    return g;
  }, []);

  const routeSlotAudio = React.useCallback(
    (i: number, trackId: string, clipVolume: number, trackMuted: boolean) => {
      const a = audio.current;
      const g = a.slotGains[i];
      const el = poolEls.current[i];
      if (a.ctx && g) {
        const tg = trackGain(trackId);
        try {
          g.disconnect();
        } catch {
          /* not connected yet */
        }
        if (tg) {
          g.connect(tg);
          tg.gain.value = trackMuted ? 0 : 1;
        }
        g.gain.value = clipVolume;
        if (el) {
          el.muted = false;
          el.volume = 1;
        }
      } else if (el) {
        // Fallback when Web Audio is unavailable: per-element output sums at the
        // system mixer. Coarser, but keeps mute + per-clip volume working.
        el.muted = trackMuted;
        el.volume = clipVolume;
      }
    },
    [trackGain],
  );

  const silenceSlot = React.useCallback((i: number) => {
    const g = audio.current.slotGains[i];
    if (g) g.gain.value = 0;
    const el = poolEls.current[i];
    if (el) el.muted = true;
  }, []);

  // syncFrame reconciles the decoder pool to the timeline at time t. Reads live
  // store state so it's safe to call from rAF and from paused-seek effects.
  const syncFrame = React.useCallback(
    (t: number, playing: boolean) => {
      const st = useStudioStore.getState();
      const trks = st.project?.tracks ?? [];
      const active = resolveActiveClips(trks, t);
      const activeIds = new Set(active.map((a) => a.clip.id));
      // Stacking order for active video clips: bottom track first, later-starting
      // clip on top (so a dissolving-in clip sits above its predecessor). Small
      // z-indices keep the status overlays (z-10) on top.
      const zOf = new Map<string, number>();
      active
        .filter((a) => a.trackKind === 'video')
        .sort((x, y) => x.trackIndex - y.trackIndex || x.clip.timelineStart - y.clip.timelineStart)
        .forEach((a, idx) => zOf.set(a.clip.id, idx + 1));

      // Release slots whose clip left the playhead.
      slots.current.forEach((slot, i) => {
        if (slot.clipId && !activeIds.has(slot.clipId)) {
          slot.clipId = null;
          const el = poolEls.current[i];
          if (el) {
            el.pause();
            el.style.opacity = '0';
            el.style.filter = 'none';
          }
          silenceSlot(i);
        }
      });

      // Assign/refresh a slot per active clip whose proxy is ready.
      for (const a of active) {
        const entry = st.assets[a.clip.assetId];
        if (!entry || entry.status !== 'ready') continue;
        let i = slots.current.findIndex((s) => s.clipId === a.clip.id);
        if (i < 0) i = slots.current.findIndex((s) => s.clipId === null);
        if (i < 0) continue; // pool exhausted — skip extra concurrent clip
        const slot = slots.current[i];
        const el = poolEls.current[i];
        if (!el) continue;
        slot.clipId = a.clip.id;
        if (slot.srcAssetId !== a.clip.assetId) {
          slot.srcAssetId = a.clip.assetId;
          el.src = studioProxyUrl(a.clip.assetId);
        }
        const threshold = playing ? 0.3 : 0.05;
        if (Math.abs(el.currentTime - a.sourceTime) > threshold) {
          try {
            el.currentTime = a.sourceTime;
          } catch {
            /* element not seekable yet */
          }
        }
        if (a.trackKind === 'video') {
          // Composite every active video clip: opacity = base × dissolve ramp,
          // stacked by track then timeline position, with color adjustments.
          el.style.opacity = String((a.clip.opacity ?? 1) * transitionRamp(a.clip, t));
          el.style.zIndex = String(zOf.get(a.clip.id) ?? 1);
          el.style.filter = cssFilterForAdjustments(a.clip.adjustments);
        } else {
          el.style.opacity = '0';
        }
        routeSlotAudio(i, a.trackId, a.clip.volume ?? 1, a.trackMuted);
        if (playing) {
          if (el.paused) void el.play().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      }
    },
    [routeSlotAudio, silenceSlot],
  );

  // Playback loop.
  React.useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      poolEls.current.forEach((el) => el?.pause());
      return;
    }
    lastTsRef.current = performance.now();
    const step = (ts: number) => {
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      const st = useStudioStore.getState();
      const total = timelineDuration(st.project?.tracks ?? []);
      const head = st.playhead + dt;
      if (total > 0 && head >= total) {
        st.setPlayhead(total);
        st.pause();
        return;
      }
      syncFrame(head, true);
      st.setPlayhead(head);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isPlaying, syncFrame]);

  // Paused seek/paint — show the frame(s) under the playhead. Depend on the
  // stable `project` reference (changes on any EDL edit) rather than the
  // freshly-allocated `tracks` array.
  React.useEffect(() => {
    if (isPlaying) return;
    syncFrame(playhead, false);
  }, [playhead, isPlaying, syncFrame, project]);

  // Track the preview box height so text-overlay font sizes (authored in
  // project pixels) scale to the rendered surface.
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setBoxH(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Tear down the audio graph on unmount.
  React.useEffect(
    () => () => {
      const a = audio.current;
      if (a.ctx) void a.ctx.close().catch(() => {});
      a.ctx = null;
      a.trackGains.clear();
    },
    [],
  );

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
      return;
    }
    ensureAudioGraph();
    play();
    // Kick element playback inside the gesture so autoplay-with-sound is allowed.
    syncFrame(useStudioStore.getState().playhead, true);
  };

  const frameStep = (dir: 1 | -1) => {
    pause();
    setPlayhead(playhead + dir * (1 / Math.max(1, fps)));
  };

  return (
    <div className="flex flex-col gap-2">
      <div ref={containerRef} className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-border">
        {Array.from({ length: POOL_SIZE }).map((_, i) => (
          <video
            key={i}
            ref={(el) => {
              poolEls.current[i] = el;
            }}
            crossOrigin="anonymous"
            playsInline
            className="absolute inset-0 w-full h-full object-contain"
            style={{ opacity: 0 }}
          />
        ))}
        {textItems.map(({ key, ov, opacity }) => (
          <div
            key={key}
            className="absolute pointer-events-none"
            style={{
              left: `${ov.x * 100}%`,
              top: `${ov.y * 100}%`,
              transform: `translate(${-ov.x * 100}%, ${-ov.y * 100}%)`,
              zIndex: 8,
              opacity,
            }}
          >
            <span
              style={{
                fontSize: `${(ov.fontSize / projectHeight) * boxH}px`,
                color: ov.color,
                background: 'rgba(0,0,0,0.4)',
                padding: '0.1em 0.3em',
                lineHeight: 1.1,
                whiteSpace: 'pre',
                fontWeight: 600,
              }}
            >
              {ov.text}
            </span>
          </div>
        ))}
        {!hasClips && (
          <div className="absolute inset-0 z-10 flex items-center justify-center text-sm text-muted-foreground">
            {t('contentStudio.preview.empty')}
          </div>
        )}
        {building && (
          <div className="absolute inset-0 z-10 flex items-center justify-center text-sm text-amber-400 bg-black/60">
            {t('contentStudio.preview.building')}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={() => setPlayhead(0)} title={t('contentStudio.transport.start')}>
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => frameStep(-1)} title={t('contentStudio.transport.prevFrame')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="default" onClick={handlePlayPause} title={t('contentStudio.transport.playPause')}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button size="icon" variant="ghost" onClick={() => frameStep(1)} title={t('contentStudio.transport.nextFrame')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => setPlayhead(duration)} title={t('contentStudio.transport.end')}>
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground tabular-nums">
          {formatDuration(playhead)} / {formatDuration(duration)}
        </div>
      </div>
    </div>
  );
};

export default PreviewSurface;
