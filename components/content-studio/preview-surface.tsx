'use client';

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import {
  resolveActiveClips,
  topVideoClip,
  studioProxyUrl,
  transitionRamp,
  audioFadeGain,
  clipTransitionState,
  clipValuesAt,
  cssFilterForAdjustments,
  studioAssetFileUrl,
  type ClipValues,
  type TransitionLayerState,
} from '@/lib/studio/previewEngine';
import { peekPeaks, prefetchPeaks } from '@/lib/studio/usePeaks';
import { useStudioBackend } from '@/lib/studio/studioBackendProvider';
import {
  INITIAL_DUCK_ENVELOPE,
  advanceEnvelope,
  bedGainForVoiceLevel,
  peakLevelAt,
  type DuckEnvelopeState,
} from '@/lib/studio/duckingEnvelope';
import { GLCompositor, type GLLayer } from '@/lib/studio/glCompositor';
import { rasterTitle, titleRasterKey } from '@/lib/studio/titleRaster';
import { ensureStudioFontsLoaded } from '@/lib/studio/titleFonts';
import type { ActiveClip } from '@/lib/studio/previewEngine';
import { parseCubeLut } from '@/lib/studio/lutParser';
import { registerEyedropper, rgbToHex } from '@/lib/studio/eyedropper';
import { DEFAULT_CAPTION_STYLE, type StudioTitle } from '@/lib/studioTypes';
import { Segmented } from '@/components/darkroom/segmented';
import {
  QUALITY_SCALE,
  createFrameStats,
  createGovernor,
  frameStatsPush,
  governorPause,
  governorSecond,
  governorSetUserLevel,
  type GovernorState,
  type QualityLevel,
} from '@/lib/studio/qualityGovernor';
import { editSummary, perf } from '@/lib/studio/telemetry';

// hexWithOpacity → rgba() string for the caption background box.
function hexWithOpacity(hex: string, opacity: number): string {
  const h = hex.replace('#', '');
  if (h.length !== 6) return `rgba(0,0,0,${opacity})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

// hexToRgb01 converts "#RRGGBB" → [r,g,b] in 0..1 for the chroma-key uniform.
function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  if (h.length !== 6) return [0, 1, 0];
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

// buildGLLayer maps an active video clip + its texture source to a compositor
// layer. Effect-stack lookup takes the FIRST ENABLED effect of each type — the
// export does the same (pickEffects in studio_export.go), so the cap is a
// consistent, intended policy on both sides (part 12; ordered stacks arrive
// with the P2 adjustment-layer work). Part 15: `values` carries the per-frame
// keyframed transform/opacity/effect-params (clipValuesAt); a keyframed param
// overrides the effect's static field through the same uniforms. Part 16: a
// title clip passes `src.imageKey` (its raster texture) instead of a pool slot
// and flows through the identical layer pipeline.
function buildGLLayer(
  a: ActiveClip,
  src: { slot: number; srcW: number; srcH: number; imageKey?: string },
  trs: TransitionLayerState,
  comp: GLCompositor,
  values: ClipValues,
): GLLayer {
  const clip = a.clip;
  const eq = clip.adjustments
    ? { brightness: clip.adjustments.brightness, contrast: clip.adjustments.contrast, saturation: clip.adjustments.saturation }
    : undefined;
  const ov = (effectId: string, param: string, fallback: number): number =>
    values.effects?.[`${effectId}.${param}`] ?? fallback;
  let lumetri: GLLayer['lumetri'];
  let lut: GLLayer['lut'];
  let chroma: GLLayer['chroma'];
  for (const e of clip.effects ?? []) {
    if (!e.enabled) continue;
    if (e.type === 'lumetri' && !lumetri) {
      lumetri = {
        exposure: ov(e.id, 'exposure', e.exposure),
        contrast: ov(e.id, 'contrast', e.contrast),
        saturation: ov(e.id, 'saturation', e.saturation),
        temperature: ov(e.id, 'temperature', e.temperature),
        tint: ov(e.id, 'tint', e.tint),
        vibrance: ov(e.id, 'vibrance', e.vibrance),
      };
    } else if (e.type === 'lut' && !lut && comp.hasLut(e.lutAssetId)) {
      lut = { key: e.lutAssetId, intensity: ov(e.id, 'intensity', e.intensity) };
    } else if (e.type === 'chromakey' && !chroma) {
      chroma = {
        keyColor: hexToRgb01(e.keyColor),
        similarity: ov(e.id, 'similarity', e.similarity),
        blend: ov(e.id, 'blend', e.blend),
        despill: ov(e.id, 'despill', e.despill),
      };
    }
  }
  // Typed transitions (part 14): alpha multiplies in, push/slide offsets add to
  // the clip's (possibly keyframed) transform position, the wipe mask passes
  // straight through.
  const transform = {
    x: values.transform.x + trs.offsetX,
    y: values.transform.y + trs.offsetY,
    scale: values.transform.scale,
    rotationDeg: values.transform.rotationDeg,
  };
  return {
    slot: src.slot,
    imageKey: src.imageKey,
    srcW: src.srcW,
    srcH: src.srcH,
    transform,
    crop: clip.crop,
    opacity: values.opacity * trs.alpha,
    blendMode: clip.blendMode,
    eq,
    lumetri,
    lut,
    chroma,
    wipe: trs.wipe,
  };
}

// Pool of decoders. Kept small to respect Safari's ~4–6 concurrent <video>
// decoder cap; elements are reassigned as clips enter/leave the playhead.
const POOL_SIZE = 4;

// Persisted preview-quality choice (part 11). Session-default 'full' when
// storage is unavailable.
const QUALITY_STORAGE_KEY = 'mm_studio_preview_quality';

const isQualityLevel = (v: string | null): v is QualityLevel =>
  v === 'full' || v === 'half' || v === 'quarter';

interface Slot {
  clipId: string | null;
  srcAssetId: string | null;
}

interface AudioGraph {
  ctx: AudioContext | null;
  sources: (MediaElementAudioSourceNode | null)[];
  slotGains: (GainNode | null)[]; // per-slot clip volume
  slotPans: (StereoPannerNode | null)[]; // per-slot clip pan (static + keyframed, part 15)
  trackGains: Map<string, GainNode>; // per-track mute/master
  // Master bus + stereo metering tap (trackGains → master → destination, and
  // master → splitter → 2× analyser for the dBFS meters).
  master: GainNode | null;
  splitter: ChannelSplitterNode | null;
  analyserL: AnalyserNode | null;
  analyserR: AnalyserNode | null;
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
const PreviewSurface: React.FC<{ focused?: boolean }> = ({ focused = false }) => {
  const { t } = useLocalization('interface');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const poolEls = React.useRef<(HTMLVideoElement | null)[]>(Array(POOL_SIZE).fill(null));
  const slots = React.useRef<Slot[]>(Array.from({ length: POOL_SIZE }, () => ({ clipId: null, srcAssetId: null })));
  const audio = React.useRef<AudioGraph>({
    ctx: null,
    sources: Array(POOL_SIZE).fill(null),
    slotGains: Array(POOL_SIZE).fill(null),
    slotPans: Array(POOL_SIZE).fill(null),
    trackGains: new Map(),
    master: null,
    splitter: null,
    analyserL: null,
    analyserR: null,
  });
  const rafRef = React.useRef<number | null>(null);
  const lastTsRef = React.useRef(0);
  const meterCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const meterHold = React.useRef({ l: -60, r: -60 });
  // Scratch buffers for the level meter, sized to the analyser's fftSize on
  // first use and reused every frame thereafter.
  const meterBuffers = React.useRef<{
    l: Float32Array<ArrayBuffer> | null;
    r: Float32Array<ArrayBuffer> | null;
  }>({ l: null, r: null });
  const [boxH, setBoxH] = React.useState(0);
  const [boxW, setBoxW] = React.useState(0);

  // Title raster cache (part 16): clip id → offscreen 2D canvas + content key.
  // Re-rastered only when the title JSON or the backing size changes (the
  // dirty-flag contract) — never per frame.
  const titleRasterCache = React.useRef<Map<string, { canvas: HTMLCanvasElement; key: string }>>(new Map());
  // Bumped when the @font-face set finishes loading so cached rasters drawn
  // with fallback fonts are invalidated exactly once.
  const fontsVersionRef = React.useRef(0);

  // WebGL2 compositor (the accurate visual layer). When unavailable or after a
  // context loss we fall back to the pooled-<video> CSS path; glOkRef gates the
  // hot loop without re-creating syncFrame.
  const glCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const compositorRef = React.useRef<GLCompositor | null>(null);
  const glOkRef = React.useRef(false);
  const [glOk, setGlOk] = React.useState(false);
  const syncFrameRef = React.useRef<((t: number, playing: boolean) => void) | null>(null);
  const lutRequested = React.useRef<Set<string>>(new Set());
  const [eyedropArmed, setEyedropArmed] = React.useState(false);
  const eyedropCbRef = React.useRef<((hex: string) => void) | null>(null);

  // Preview quality (part 11). The governor is the source of truth (a pure
  // state machine in lib/studio/qualityGovernor.ts); the ref feeds the rAF
  // loop, the two state values drive the selector + "Reduced quality" badge.
  const govRef = React.useRef<GovernorState>(createGovernor('full'));
  const frameStatsRef = React.useRef(createFrameStats());
  const [userQuality, setUserQuality] = React.useState<QualityLevel>('full');
  const [effectiveQuality, setEffectiveQuality] = React.useState<QualityLevel>('full');
  const [qualityDegraded, setQualityDegraded] = React.useState(false);

  // Per-slot seek bookkeeping (part 11): at most one in-flight seek per
  // element (newest target wins, re-issued on `seeked`), and the intent
  // timestamp that turns into the seek-latency perf sample.
  const seekIntentAt = React.useRef<(number | null)[]>(Array(POOL_SIZE).fill(null));
  const pendingSeekTarget = React.useRef<(number | null)[]>(Array(POOL_SIZE).fill(null));

  const applyGovernor = React.useCallback((next: GovernorState) => {
    govRef.current = next;
    setEffectiveQuality(next.effectiveLevel);
    setQualityDegraded(next.degraded);
  }, []);

  // Restore the persisted choice after hydration (an initializer read would
  // mismatch the server-rendered markup).
  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(QUALITY_STORAGE_KEY);
      if (isQualityLevel(stored)) {
        setUserQuality(stored);
        applyGovernor(governorSetUserLevel(govRef.current, stored));
      }
    } catch {
      // storage unavailable — session default stands
    }
  }, [applyGovernor]);

  // Level-driven ducking preview (part 12): the envelope state lives across
  // frames; the peaks capability gates the prefetch (embed backends without
  // /peaks degrade to presence-driven ducking inside syncFrame).
  const duckEnvRef = React.useRef<DuckEnvelopeState>(INITIAL_DUCK_ENVELOPE);
  const peaksCapable = useStudioBackend().capabilities.peaks;

  const isPlaying = useStudioStore((s) => s.isPlaying);
  const playhead = useStudioStore((s) => s.playhead);
  const project = useStudioStore((s) => s.project);
  const assets = useStudioStore((s) => s.assets);
  const setPlayhead = useStudioStore((s) => s.setPlayhead);
  const pause = useStudioStore((s) => s.pause);
  const play = useStudioStore((s) => s.play);

  // These five derivations ran unmemoized on every render, i.e. 60 times a
  // second during playback: two full timeline scans plus three array walks.
  // Memoizing on [tracks, playhead] keeps them to once per frame at worst, and
  // free on the renders playback did not cause (selection, zoom, asset ingest).
  const tracks = React.useMemo(() => project?.tracks ?? [], [project?.tracks]);
  const fps = project?.fps ?? 30;
  const duration = useStudioStore((s) => s.duration);
  const activeNow = React.useMemo(() => resolveActiveClips(tracks, playhead), [tracks, playhead]);
  const topNow = React.useMemo(() => topVideoClip(activeNow), [activeNow]);
  // Title clips are assetless and always renderable — never "building".
  const building = !!topNow && !topNow.clip.title && assets[topNow.clip.assetId]?.status !== 'ready';
  const hasClips = React.useMemo(() => tracks.some((tr) => tr.clips.length > 0), [tracks]);

  // Warm the voice-track clips' waveform peaks so the level-driven ducking
  // preview can read them synchronously at rAF time (module cache in usePeaks).
  const projectAudio = project?.audio;
  const voiceAssetIds = React.useMemo(() => {
    if (!projectAudio?.duckingEnabled || !projectAudio.duckVoiceTrackId) return [] as string[];
    const voiceTrack = tracks.find((tr) => tr.id === projectAudio.duckVoiceTrackId);
    if (!voiceTrack) return [] as string[];
    return Array.from(new Set(voiceTrack.clips.map((c) => c.assetId)));
  }, [projectAudio, tracks]);
  React.useEffect(() => {
    if (!peaksCapable) return;
    for (const id of voiceAssetIds) prefetchPeaks(id);
  }, [peaksCapable, voiceAssetIds]);

  // Safe-margin guides (part 16): shown while a single selected clip is a
  // title clip (action-safe 90% / title-safe 80% of the frame).
  const selectedClipIds = useStudioStore((s) => s.selectedClipIds);
  const selectedTitle = React.useMemo(() => {
    if (selectedClipIds.length !== 1) return false;
    for (const tr of tracks) {
      const c = tr.clips.find((cc) => cc.id === selectedClipIds[0]);
      if (c) return !!c.title;
    }
    return false;
  }, [selectedClipIds, tracks]);

  // Active title clips for the CSS fallback path (no WebGL): drawn as DOM
  // canvases via the same raster engine. The GL path never uses these.
  const fallbackTitleItems = React.useMemo(() => {
    if (glOk) return [];
    return activeNow
      .filter((a) => a.trackKind === 'video' && !!a.clip.title)
      .map((a) => {
        const vals = clipValuesAt(a.clip, playhead - a.clip.timelineStart);
        return {
          key: a.clip.id,
          title: a.clip.title!,
          transform: vals.transform,
          opacity: vals.opacity * transitionRamp(a.clip, playhead),
          z: 7,
        };
      });
  }, [glOk, activeNow, playhead]);

  // Text/location overlays for the active video clips (faked over the surface;
  // the export draws them in with drawtext).
  const projectHeight = project?.height ?? 1080;
  const textItems = React.useMemo(
    () =>
      activeNow
        .filter((a) => a.trackKind === 'video')
        .flatMap((a) =>
          (a.clip.textOverlays ?? []).map((ov) => ({
            key: a.clip.id + ov.id,
            ov,
            opacity: (a.clip.opacity ?? 1) * transitionRamp(a.clip, playhead),
          })),
        ),
    [activeNow, playhead],
  );

  // Active caption cue (DOM overlay above the canvas), gated by captionsEnabled.
  const captionStyle = project?.captionStyle ?? DEFAULT_CAPTION_STYLE;
  const captionsEnabled = project?.captionsEnabled ?? true;
  const captions = project?.captions;
  const activeCue = React.useMemo(
    () =>
      captionsEnabled
        ? (captions ?? []).find((c) => playhead >= c.startSeconds && playhead < c.endSeconds)
        : undefined,
    [captions, captionsEnabled, playhead],
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
      // Master bus + stereo metering tap.
      const master = ctx.createGain();
      master.gain.value = 1;
      master.connect(ctx.destination);
      try {
        const splitter = ctx.createChannelSplitter(2);
        const analyserL = ctx.createAnalyser();
        const analyserR = ctx.createAnalyser();
        analyserL.fftSize = 1024;
        analyserR.fftSize = 1024;
        master.connect(splitter);
        splitter.connect(analyserL, 0);
        splitter.connect(analyserR, 1);
        a.splitter = splitter;
        a.analyserL = analyserL;
        a.analyserR = analyserR;
      } catch {
        // metering is optional; ignore if the splitter can't be created
      }
      a.master = master;
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
          // Per-slot pan stage (part 15). StereoPanner is equal-power, matching
          // the mental model of stereotools balance on the export side; when
          // unavailable the slot output is the gain node and pan is a no-op.
          try {
            const p = ctx.createStereoPanner();
            g.connect(p);
            a.slotPans[i] = p;
          } catch {
            a.slotPans[i] = null;
          }
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
      g.connect(a.master ?? a.ctx.destination);
      a.trackGains.set(trackId, g);
    }
    return g;
  }, []);

  // Which track each slot's gain node is currently wired to. Re-wiring the
  // graph is only correct — and only cheap — when that actually changes;
  // `routeSlotAudio` runs once per active clip per animation frame, and
  // disconnect/connect on every one of those was audible churn in the graph as
  // well as wasted work.
  const slotRouting = React.useRef<Array<string | null>>([]);

  const routeSlotAudio = React.useCallback(
    (i: number, trackId: string, clipVolume: number, clipPan: number, trackMuted: boolean) => {
      const a = audio.current;
      const g = a.slotGains[i];
      const p = a.slotPans[i];
      // The slot's OUTPUT node (pan stage when available, else the gain).
      const out = p ?? g;
      const el = poolEls.current[i];
      if (a.ctx && g && out) {
        if (slotRouting.current[i] !== trackId) {
          const tg = trackGain(trackId);
          try {
            out.disconnect();
          } catch {
            /* not connected yet */
          }
          if (tg) {
            out.connect(tg);
            // Track gain (mute + ducking) is owned by applyTrackGains below so
            // it can ramp smoothly; here we only ensure the slot is connected.
          }
          slotRouting.current[i] = tg ? trackId : null;
        }
        g.gain.value = clipVolume;
        if (p) p.pan.value = Math.max(-1, Math.min(1, clipPan));
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
    // The slot is free; the next clip to claim it must be re-routed even if it
    // happens to live on the same track.
    slotRouting.current[i] = null;
  }, []);

  // drawMeters paints a compact stereo dBFS level meter (−60..0) with peak-hold
  // ticks from the master analysers. Called from the playback rAF loop only.
  const drawMeters = React.useCallback(() => {
    const canvas = meterCanvasRef.current;
    const ctx2d = canvas?.getContext('2d');
    if (!canvas || !ctx2d) return;
    const a = audio.current;
    const W = canvas.width;
    const H = canvas.height;
    ctx2d.clearRect(0, 0, W, H);
    const barW = Math.floor((W - 2) / 2);
    const channels: Array<[AnalyserNode | null, 'l' | 'r']> = [
      [a.analyserL, 'l'],
      [a.analyserR, 'r'],
    ];
    channels.forEach(([an, side], idx) => {
      let db = -60;
      if (an) {
        // Reuse one buffer per channel. Allocating two Float32Array(1024)s here
        // meant ~480 KB/s of garbage during playback, all of it identical in
        // size and lifetime — the textbook case for hoisting.
        let buf = meterBuffers.current[side];
        if (!buf || buf.length !== an.fftSize) {
          buf = new Float32Array(an.fftSize);
          meterBuffers.current[side] = buf;
        }
        an.getFloatTimeDomainData(buf);
        let peak = 0;
        for (let i = 0; i < buf.length; i += 1) {
          const v = Math.abs(buf[i]);
          if (v > peak) peak = v;
        }
        db = peak > 0 ? Math.max(-60, 20 * Math.log10(peak)) : -60;
      }
      const prev = meterHold.current[side];
      meterHold.current[side] = Math.max(-60, db > prev ? db : prev - 1.5); // ~1.5 dB/frame decay
      const x = idx * (barW + 2);
      ctx2d.fillStyle = 'rgba(255,255,255,0.08)';
      ctx2d.fillRect(x, 0, barW, H);
      const lvl = Math.max(0, Math.min(1, (db + 60) / 60)) * H;
      ctx2d.fillStyle = db > -3 ? '#ef4444' : db > -12 ? '#f59e0b' : '#22c55e';
      ctx2d.fillRect(x, H - lvl, barW, lvl);
      const holdY = H - Math.max(0, Math.min(1, (meterHold.current[side] + 60) / 60)) * H;
      ctx2d.fillStyle = 'rgba(255,255,255,0.85)';
      ctx2d.fillRect(x, Math.max(0, Math.min(H - 1, holdY - 1)), barW, 2);
    });
  }, []);

  // syncFrame reconciles the decoder pool to the timeline at time t. Reads live
  // store state so it's safe to call from rAF and from paused-seek effects.
  const syncFrame = React.useCallback(
    (t: number, playing: boolean) => {
      const st = useStudioStore.getState();
      const trks = st.project?.tracks ?? [];
      const active = resolveActiveClips(trks, t);
      const activeIds = new Set(active.map((a) => a.clip.id));
      // Hidden video tracks (part 05 field): their clips still play for audio,
      // but never reach the composite — no compositor upload, no CSS layer.
      const hiddenTrackIds = new Set<string>();
      for (const tr of trks) {
        if (tr.hidden) hiddenTrackIds.add(tr.id);
      }
      // Stacking order for active video clips: bottom track first, later-starting
      // clip on top (so a dissolving-in clip sits above its predecessor). Small
      // z-indices keep the status overlays (z-10) on top.
      const zOf = new Map<string, number>();
      active
        .filter((a) => a.trackKind === 'video' && !hiddenTrackIds.has(a.trackId))
        .sort((x, y) => x.trackIndex - y.trackIndex || x.clip.timelineStart - y.clip.timelineStart)
        .forEach((a, idx) => zOf.set(a.clip.id, idx + 1));

      // Per-frame keyframed values (part 15), resolved once per active clip and
      // shared by the audio routing + GL layer paths below.
      const valuesByClip = new Map<string, ClipValues>();
      for (const a of active) {
        valuesByClip.set(a.clip.id, clipValuesAt(a.clip, t - a.clip.timelineStart));
      }

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
          seekIntentAt.current[i] = null;
          pendingSeekTarget.current[i] = null;
        }
      });

      // Assign/refresh a slot per active clip whose proxy is ready.
      const gl = glOkRef.current;
      const clipSlots = new Map<string, number>();
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
        clipSlots.set(a.clip.id, i);
        if (slot.srcAssetId !== a.clip.assetId) {
          slot.srcAssetId = a.clip.assetId;
          el.src = studioProxyUrl(a.clip.assetId);
          seekIntentAt.current[i] = null;
          pendingSeekTarget.current[i] = null;
        }
        const vals = valuesByClip.get(a.clip.id) ?? clipValuesAt(a.clip, t - a.clip.timelineStart);
        const threshold = playing ? 0.3 : 0.05;
        if (Math.abs(el.currentTime - a.sourceTime) > threshold) {
          if (el.seeking) {
            // One in-flight seek per element: while the decoder is still
            // seeking, only remember the newest target — the `seeked` handler
            // re-issues it. Scrubbing used to pile a seek per pointer frame
            // onto a still-seeking element.
            pendingSeekTarget.current[i] = a.sourceTime;
          } else {
            pendingSeekTarget.current[i] = null;
            try {
              seekIntentAt.current[i] = performance.now();
              el.currentTime = a.sourceTime;
            } catch {
              seekIntentAt.current[i] = null; /* element not seekable yet */
            }
          }
        }
        if (a.trackKind === 'video') {
          if (hiddenTrackIds.has(a.trackId)) {
            // Hidden track: decode for audio only, never show the frame.
            el.style.opacity = '0';
            el.style.filter = 'none';
          } else if (gl) {
            // The WebGL canvas owns the visuals; keep the decoder hidden.
            el.style.opacity = '0';
            el.style.filter = 'none';
          } else {
            // CSS fallback: composite the decoder elements directly — opacity =
            // (possibly keyframed) base × dissolve ramp, stacked by track then
            // timeline position.
            el.style.opacity = String(vals.opacity * transitionRamp(a.clip, t));
            el.style.zIndex = String(zOf.get(a.clip.id) ?? 1);
            el.style.filter = cssFilterForAdjustments(a.clip.adjustments);
          }
        } else {
          el.style.opacity = '0';
        }
        // Evaluate the clip's volume/pan automation at the current clip-local
        // time so keyframed gain + balance are honored live in preview (the
        // export uses the same curves via volume expressions + the sendcmd
        // sidecar), times the equal-power crossfade — the same qsin curve as
        // the export's afades (part 12).
        const trackClips = trks.find((tr) => tr.id === a.trackId)?.clips;
        const gainNow = vals.volume * (trackClips ? audioFadeGain(a.clip, trackClips, t) : 1);
        routeSlotAudio(i, a.trackId, gainNow, vals.pan, a.trackMuted);
        if (playing) {
          if (el.paused) void el.play().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      }

      // Track gains: mute + LEVEL-DRIVEN auto-ducking (part 12). The bed gain
      // follows the actual voice-track level read from ingested waveform peaks,
      // through the same static compressor curve as the export's
      // sidechaincompress (threshold/ratio mirrored from studio_export.go),
      // smoothed by a pure attack/release envelope over timeline time
      // (lib/studio/duckingEnvelope.ts). Clips whose peaks are unavailable
      // (embed backends without /peaks, or still loading) fall back to
      // presence-driven full level — documented degraded mode. A muted voice
      // track contributes no sidechain key, exactly like the export.
      const ag = audio.current;
      if (ag.ctx) {
        const duckCfg = st.project?.audio;
        const voiceTrackId =
          duckCfg?.duckingEnabled && duckCfg.duckVoiceTrackId ? duckCfg.duckVoiceTrackId : '';
        const voiceTrack = voiceTrackId ? trks.find((tr) => tr.id === voiceTrackId) : undefined;
        const ducking = !!voiceTrack && !voiceTrack.muted;
        let bedTarget = 1;
        if (ducking) {
          let level = 0;
          for (const ac of active) {
            if (ac.trackId !== voiceTrackId) continue;
            const clipGain =
              (valuesByClip.get(ac.clip.id)?.volume ?? 1) *
              audioFadeGain(ac.clip, voiceTrack.clips, t);
            const pk = peekPeaks(ac.clip.assetId);
            level = Math.max(level, (pk ? peakLevelAt(pk, ac.sourceTime) : 1) * clipGain);
          }
          bedTarget = bedGainForVoiceLevel(level, duckCfg?.duckAmountDb ?? 0);
        }
        duckEnvRef.current = advanceEnvelope(duckEnvRef.current, bedTarget, t, {
          attackMs: duckCfg?.duckAttackMs ?? 120,
          releaseMs: duckCfg?.duckReleaseMs ?? 400,
        });
        const envGain = duckEnvRef.current.gain;
        for (const tr of trks) {
          const tg = ag.trackGains.get(tr.id);
          if (!tg) continue;
          let target = tr.muted ? 0 : 1;
          if (ducking && !tr.muted && tr.id !== voiceTrackId) {
            target = Math.min(target, envGain);
          }
          // The envelope owns attack/release; the tiny time constant here only
          // dezippers the per-frame steps.
          tg.gain.setTargetAtTime(target, ag.ctx.currentTime, 0.02);
        }
      }

      // WebGL composite: upload each active video slot's current frame and draw
      // the layers bottom→top (the exact zOf ordering used above). Title clips
      // (part 16) join the same ordering with their raster texture as source.
      const comp = compositorRef.current;
      if (gl && comp && comp.isAvailable()) {
        const pw = st.project?.width ?? 1920;
        const ph = st.project?.height ?? 1080;
        // Hidden tracks are excluded here, which also skips their texture
        // uploads — the per-frame texImage2D is the expensive part.
        const ordered = active
          .filter(
            (a) =>
              a.trackKind === 'video' &&
              (clipSlots.has(a.clip.id) || !!a.clip.title) &&
              !hiddenTrackIds.has(a.trackId),
          )
          .sort((x, y) => (zOf.get(x.clip.id) ?? 0) - (zOf.get(y.clip.id) ?? 0));
        const layers: GLLayer[] = [];
        for (const a of ordered) {
          const trackClips = trks.find((tr) => tr.id === a.trackId)?.clips ?? [];
          const trs = clipTransitionState(a.clip, trackClips, t);
          const vals = valuesByClip.get(a.clip.id) ?? clipValuesAt(a.clip, t - a.clip.timelineStart);
          if (a.clip.title) {
            // Raster (dirty-flag cached) + upload the title texture, then flow
            // through the identical per-clip layer pipeline as video.
            const back = comp.backingSize(pw, ph);
            const key = `${fontsVersionRef.current}:${titleRasterKey(a.clip.title, back.w, back.h)}`;
            let entry = titleRasterCache.current.get(a.clip.id);
            if (!entry || entry.key !== key) {
              const canvas = entry?.canvas ?? document.createElement('canvas');
              canvas.width = back.w;
              canvas.height = back.h;
              const ctx2d = canvas.getContext('2d');
              if (!ctx2d) continue;
              rasterTitle(ctx2d, a.clip.title, back.w, back.h, pw);
              entry = { canvas, key };
              titleRasterCache.current.set(a.clip.id, entry);
            }
            if (!comp.uploadImage(a.clip.id, entry.canvas, key)) continue;
            layers.push(
              buildGLLayer(
                a,
                { slot: -1, srcW: entry.canvas.width, srcH: entry.canvas.height, imageKey: a.clip.id },
                trs,
                comp,
                vals,
              ),
            );
            if (trs.dip && trs.dip.alpha > 0) {
              layers.push({ slot: -1, srcW: pw, srcH: ph, opacity: trs.dip.alpha, solid: trs.dip.color === 'black' ? [0, 0, 0] : [1, 1, 1] });
            }
            continue;
          }
          const i = clipSlots.get(a.clip.id);
          if (i === undefined) continue;
          const el = poolEls.current[i];
          if (!el) continue;
          comp.uploadSlot(i, el, el.currentTime);
          layers.push(buildGLLayer(a, { slot: i, srcW: el.videoWidth || 16, srcH: el.videoHeight || 9 }, trs, comp, vals));
          if (trs.dip && trs.dip.alpha > 0) {
            // Dip color layer: a full-canvas solid quad above both clips,
            // peaking at the transition midpoint (export: color= source + fades).
            layers.push({
              slot: -1,
              srcW: pw,
              srcH: ph,
              opacity: trs.dip.alpha,
              solid: trs.dip.color === 'black' ? [0, 0, 0] : [1, 1, 1],
            });
          }
        }
        comp.composite(layers, pw, ph);
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
      // Pause/stop restores the user-selected quality (part 11) and discards
      // the partial measurement window.
      frameStatsRef.current = createFrameStats();
      applyGovernor(governorPause(govRef.current));
      return;
    }
    lastTsRef.current = performance.now();
    const step = (ts: number) => {
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      const st = useStudioStore.getState();
      // `duration` is cached on the store; this used to rescan every clip on
      // every track, every frame (B9).
      const total = st.duration;
      const head = st.playhead + dt;
      if (total > 0 && head >= total) {
        st.setPlayhead(total);
        st.pause();
        return;
      }
      syncFrame(head, true);
      st.setPlayhead(head);
      drawMeters();
      // Frame measurement + auto-degrade (part 11). The compositor repaints
      // once per rAF, so rAF cadence is the preview frame rate; each completed
      // ~1s window becomes a perf sample and one governor step.
      const fr = frameStatsPush(frameStatsRef.current, dt * 1000);
      frameStatsRef.current = fr.stats;
      if (fr.sample) {
        perf.sample({ fps: fr.sample.fps, droppedFrameRatio: fr.sample.droppedFrameRatio });
        const prev = govRef.current;
        const next = governorSecond(prev, fr.sample.droppedFrameRatio);
        if (next !== prev) {
          if (next.effectiveLevel !== prev.effectiveLevel) {
            perf.sample({ degradeActivation: true, qualityLevel: next.effectiveLevel });
          }
          applyGovernor(next);
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isPlaying, syncFrame, drawMeters, applyGovernor]);

  // Apply the effective quality to the compositor's render scale. Repaint a
  // paused frame immediately so the change is visible without scrubbing.
  React.useEffect(() => {
    const comp = compositorRef.current;
    if (!comp) return;
    comp.setRenderScale(QUALITY_SCALE[effectiveQuality]);
    perf.sample({ qualityLevel: effectiveQuality });
    const st = useStudioStore.getState();
    if (!st.isPlaying) syncFrameRef.current?.(st.playhead, false);
  }, [effectiveQuality, glOk]);

  // Clear the meter (and reset peak-hold) when playback stops.
  React.useEffect(() => {
    if (isPlaying) return;
    meterHold.current = { l: -60, r: -60 };
    const canvas = meterCanvasRef.current;
    const ctx2d = canvas?.getContext('2d');
    if (canvas && ctx2d) ctx2d.clearRect(0, 0, canvas.width, canvas.height);
  }, [isPlaying]);

  // Paused seek/paint — show the frame(s) under the playhead. Depend on the
  // stable `project` reference (changes on any EDL edit) rather than the
  // freshly-allocated `tracks` array.
  React.useEffect(() => {
    if (isPlaying) return;
    syncFrame(playhead, false);
  }, [playhead, isPlaying, syncFrame, project]);

  // Keep a stable handle to the latest syncFrame for once-created callbacks.
  React.useEffect(() => {
    syncFrameRef.current = syncFrame;
  }, [syncFrame]);

  // Recomposite when a paused seek finishes decoding, so scrubbing shows the
  // landed frame in the WebGL path (texImage2D would otherwise upload the old
  // frame before the seek completed). Per-slot handlers also close the seek
  // bookkeeping loop (part 11): report intent→seeked latency, and re-issue the
  // newest coalesced target if the playhead moved while this seek was in
  // flight.
  React.useEffect(() => {
    const els = [...poolEls.current];
    const handlers = els.map((el, i) => {
      if (!el) return null;
      const handler = () => {
        const intent = seekIntentAt.current[i];
        if (intent != null) {
          seekIntentAt.current[i] = null;
          perf.sample({ seekLatencyMs: performance.now() - intent });
        }
        const target = pendingSeekTarget.current[i];
        pendingSeekTarget.current[i] = null;
        if (target != null && Math.abs(el.currentTime - target) > 0.05) {
          try {
            seekIntentAt.current[i] = performance.now();
            el.currentTime = target;
            return; // repaint when the re-issued seek lands
          } catch {
            seekIntentAt.current[i] = null;
          }
        }
        const st = useStudioStore.getState();
        if (!st.isPlaying) syncFrameRef.current?.(st.playhead, false);
      };
      el.addEventListener('seeked', handler);
      return handler;
    });
    return () =>
      els.forEach((el, i) => {
        const h = handlers[i];
        if (el && h) el.removeEventListener('seeked', h);
      });
  }, []);

  // Track the preview box height so text-overlay font sizes (authored in
  // project pixels) scale to the rendered surface.
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setBoxH(entry.contentRect.height);
        setBoxW(entry.contentRect.width);
      }
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
      a.slotGains.fill(null);
      a.slotPans.fill(null);
      slotRouting.current = [];
    },
    [],
  );

  // Initialize the WebGL2 compositor on mount. On creation failure or context
  // loss, glOk flips false and the surface reverts to the CSS/DOM path —
  // graceful degradation, never a blank canvas.
  React.useEffect(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;
    const comp = new GLCompositor();
    comp.onContextLost = () => {
      glOkRef.current = false;
      setGlOk(false);
      // Repaint via the CSS/DOM path so the surface doesn't go blank.
      syncFrameRef.current?.(useStudioStore.getState().playhead, false);
    };
    comp.onContextRestored = () => {
      glOkRef.current = true;
      setGlOk(true);
      // Repaint immediately with the current frame.
      syncFrameRef.current?.(useStudioStore.getState().playhead, false);
    };
    const ok = comp.init(canvas);
    compositorRef.current = comp;
    glOkRef.current = ok;
    setGlOk(ok);
    return () => {
      comp.dispose();
      compositorRef.current = null;
      glOkRef.current = false;
    };
  }, []);

  // Load the curated title fonts once (part 16). When the faces land, bump the
  // raster version so any title drawn with a fallback font re-rasters, and
  // repaint the paused frame.
  React.useEffect(() => {
    let cancelled = false;
    void ensureStudioFontsLoaded().then(() => {
      if (cancelled) return;
      fontsVersionRef.current += 1;
      const st = useStudioStore.getState();
      if (!st.isPlaying) syncFrameRef.current?.(st.playhead, false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Free raster canvases + GL textures of title clips that left the document.
  React.useEffect(() => {
    if (!project) return;
    const live = new Set<string>();
    for (const tr of project.tracks) {
      for (const c of tr.clips) {
        if (c.title) live.add(c.id);
      }
    }
    for (const id of titleRasterCache.current.keys()) {
      if (!live.has(id)) titleRasterCache.current.delete(id);
    }
    compositorRef.current?.pruneImages(live);
  }, [project]);

  // Arm the chroma-key eyedropper when the inspector requests it.
  React.useEffect(() => {
    registerEyedropper((cb) => {
      eyedropCbRef.current = cb;
      setEyedropArmed(true);
    });
    return () => registerEyedropper(null);
  }, []);

  // Load .cube LUTs referenced by any clip effect into the compositor (once
  // each), then recomposite so the grade appears.
  React.useEffect(() => {
    const comp = compositorRef.current;
    if (!comp || !glOk || !project) return;
    const ids = new Set<string>();
    for (const tr of project.tracks) {
      for (const c of tr.clips) {
        for (const e of c.effects ?? []) {
          if (e.type === 'lut' && e.lutAssetId) ids.add(e.lutAssetId);
        }
      }
    }
    ids.forEach((id) => {
      if (comp.hasLut(id) || lutRequested.current.has(id)) return;
      lutRequested.current.add(id);
      fetch(studioAssetFileUrl(id))
        .then((r) => (r.ok ? r.text() : Promise.reject(new Error('lut fetch failed'))))
        .then((text) => {
          comp.loadLut(id, parseCubeLut(text));
          const st = useStudioStore.getState();
          syncFrameRef.current?.(st.playhead, st.isPlaying);
        })
        .catch(() => {
          lutRequested.current.delete(id); // allow retry on next edit
        });
    });
  }, [project, glOk]);

  const onEyedropClick = (e: React.MouseEvent) => {
    if (!eyedropArmed) return;
    const comp = compositorRef.current;
    const canvas = glCanvasRef.current;
    setEyedropArmed(false);
    if (!comp || !canvas) {
      eyedropCbRef.current = null;
      return;
    }
    // Map the click through the object-contain letterbox to backing UV.
    const rect = canvas.getBoundingClientRect();
    const bw = comp.backingW || 16;
    const bh = comp.backingH || 9;
    const scale = Math.min(rect.width / bw, rect.height / bh);
    const contentW = bw * scale;
    const contentH = bh * scale;
    const offX = (rect.width - contentW) / 2;
    const offY = (rect.height - contentH) / 2;
    const u = (e.clientX - rect.left - offX) / contentW;
    const v = (e.clientY - rect.top - offY) / contentH;
    if (u >= 0 && u <= 1 && v >= 0 && v <= 1) {
      const rgb = comp.readPixelNorm(u, v);
      if (rgb) eyedropCbRef.current?.(rgbToHex(rgb[0], rgb[1], rgb[2]));
    }
    eyedropCbRef.current = null;
  };

  const handleQualityChange = (level: QualityLevel) => {
    setUserQuality(level);
    try {
      window.localStorage.setItem(QUALITY_STORAGE_KEY, level);
    } catch {
      // storage unavailable — the choice still applies for this session
    }
    applyGovernor(governorSetUserLevel(govRef.current, level));
    editSummary.increment('uiInvocations');
  };

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
    <div className={cn('flex flex-col gap-2', focused && 'h-full min-h-0')}>
      {/* In focus mode the box fills the available height (flex-1) instead of a
          fixed 16:9 ratio; the composite canvas is object-contain so it
          letterboxes correctly at any size, and the ResizeObserver below keeps
          caption/text font scaling in step with the larger surface. */}
      <div
        ref={containerRef}
        className={cn(
          'relative w-full bg-surface-0 rounded-lg overflow-hidden border border-border',
          focused ? 'flex-1 min-h-0' : 'aspect-video',
        )}
      >
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
        {/* WebGL composite output (hidden when falling back to the CSS path). */}
        <canvas
          ref={glCanvasRef}
          onClick={onEyedropClick}
          className={`absolute inset-0 w-full h-full object-contain ${eyedropArmed ? 'cursor-crosshair z-20' : 'pointer-events-none'}`}
          style={{ display: glOk ? 'block' : 'none' }}
        />
        {/* CSS-fallback title clips (part 16): raster drawn into DOM canvases.
            The GL path composites titles on the WebGL canvas instead. */}
        {fallbackTitleItems.map((item) => (
          <TitleFallbackCanvas
            key={item.key}
            title={item.title}
            projectW={project?.width ?? 1920}
            projectH={project?.height ?? 1080}
            opacity={item.opacity}
            z={item.z}
            transform={item.transform}
          />
        ))}
        {/* Safe-margin guides while a title clip is selected: action-safe 90%,
            title-safe 80% of the PROJECT frame (mapped through the
            object-contain letterbox). */}
        {selectedTitle && boxW > 0 && boxH > 0 && (
          <SafeMarginGuides
            boxW={boxW}
            boxH={boxH}
            projectW={project?.width ?? 1920}
            projectH={project?.height ?? 1080}
          />
        )}
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
        {activeCue && (
          <div
            className="absolute inset-x-0 flex justify-center px-[5%] pointer-events-none"
            style={captionStyle.position === 'top' ? { top: '6%' } : { bottom: '6%' }}
          >
            <span
              style={{
                fontSize: `${(captionStyle.fontSizePct / 100) * boxH}px`,
                color: captionStyle.color,
                background: hexWithOpacity(captionStyle.backgroundColor, captionStyle.backgroundOpacity),
                maxWidth: `${captionStyle.maxWidthPct}%`,
                padding: '0.1em 0.4em',
                borderRadius: '0.2em',
                textAlign: 'center',
                lineHeight: 1.25,
                fontWeight: 600,
                whiteSpace: 'pre-wrap',
                zIndex: 8,
              }}
            >
              {activeCue.text}
            </span>
          </div>
        )}
        {qualityDegraded && (
          <div className="absolute top-2 right-2 z-10 rounded-md bg-surface-0/70 px-2 py-0.5 text-[11px] font-medium text-premium pointer-events-none">
            {t('contentStudio.preview.reducedQuality')}
          </div>
        )}
        {!hasClips && (
          <div className="absolute inset-0 z-10 flex items-center justify-center text-sm text-muted-foreground">
            {t('contentStudio.preview.empty')}
          </div>
        )}
        {building && (
          <div className="absolute inset-0 z-10 flex items-center justify-center text-sm text-premium bg-surface-0/60">
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
        <div className="flex items-center gap-2">
          {glOk && (
            <Segmented<QualityLevel>
              name="studio-preview-quality"
              label={t('contentStudio.preview.quality')}
              value={userQuality}
              onValueChange={handleQualityChange}
              options={[
                { value: 'full', label: t('contentStudio.preview.qualityFull') },
                { value: 'half', label: t('contentStudio.preview.qualityHalf') },
                { value: 'quarter', label: t('contentStudio.preview.qualityQuarter') },
              ]}
              className="text-xs"
            />
          )}
          <canvas
            ref={meterCanvasRef}
            width={18}
            height={28}
            className="rounded-sm bg-surface-0/40"
            aria-hidden="true"
            title={t('contentStudio.transport.levels')}
          />
          <TimecodeReadout duration={duration} />
        </div>
      </div>
    </div>
  );
};

/**
 * CSS-fallback rendering for one active title clip: the raster engine draws
 * into a DOM canvas (object-contain over the surface, like the GL canvas) and
 * the clip transform approximates via CSS — the documented degraded mode, same
 * tier as transitions degrading to alpha ramps without WebGL.
 */
const TitleFallbackCanvas: React.FC<{
  title: StudioTitle;
  projectW: number;
  projectH: number;
  opacity: number;
  z: number;
  transform: { x: number; y: number; scale: number; rotationDeg: number };
}> = ({ title, projectW, projectH, opacity, z, transform }) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  // Cap the fallback raster so a 4K project doesn't allocate a 4K DOM canvas.
  const k = Math.min(1, 1280 / Math.max(projectW, projectH));
  const w = Math.max(2, Math.round(projectW * k));
  const h = Math.max(2, Math.round(projectH * k));
  React.useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let cancelled = false;
    void ensureStudioFontsLoaded().then(() => {
      if (!cancelled) rasterTitle(ctx, title, w, h, projectW);
    });
    return () => {
      cancelled = true;
    };
  }, [title, w, h, projectW]);
  return (
    <canvas
      ref={ref}
      width={w}
      height={h}
      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      style={{
        opacity,
        zIndex: z,
        transform: `translate(${transform.x * 100}%, ${transform.y * 100}%) scale(${transform.scale}) rotate(${transform.rotationDeg}deg)`,
      }}
    />
  );
};

/** The 90% / 80% safe-area rectangles, mapped through the letterbox. */
const SafeMarginGuides: React.FC<{ boxW: number; boxH: number; projectW: number; projectH: number }> = ({
  boxW,
  boxH,
  projectW,
  projectH,
}) => {
  const scale = Math.min(boxW / Math.max(1, projectW), boxH / Math.max(1, projectH));
  const contentW = projectW * scale;
  const contentH = projectH * scale;
  const offX = (boxW - contentW) / 2;
  const offY = (boxH - contentH) / 2;
  const rect = (fraction: number, className: string) => (
    <div
      className={`absolute border pointer-events-none ${className}`}
      style={{
        left: offX + (contentW * (1 - fraction)) / 2,
        top: offY + (contentH * (1 - fraction)) / 2,
        width: contentW * fraction,
        height: contentH * fraction,
        zIndex: 9,
      }}
    />
  );
  return (
    <>
      {rect(0.9, 'border-foreground/25')}
      {rect(0.8, 'border-premium/40 border-dashed')}
    </>
  );
};

/**
 * `MM:SS / MM:SS` transport readout.
 *
 * Its own component with a transient store subscription and a direct
 * `textContent` write: the playhead half changes every frame, and routing that
 * through React would re-render the entire preview surface — canvas, overlays,
 * transport bar — 60 times a second just to repaint eleven characters.
 */
const TimecodeReadout: React.FC<{ duration: number }> = ({ duration }) => {
  const { formatDuration } = useLocalization('interface');
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const apply = (seconds: number) => {
      const el = ref.current;
      if (el) el.textContent = formatDuration(seconds);
    };
    apply(useStudioStore.getState().playhead);
    return useStudioStore.subscribe((s, prev) => {
      if (s.playhead !== prev.playhead) apply(s.playhead);
    });
  }, [formatDuration]);

  return (
    <div className="num text-xs text-muted-foreground">
      <span ref={ref}>{formatDuration(0)}</span> / {formatDuration(duration)}
    </div>
  );
};

export default PreviewSurface;
