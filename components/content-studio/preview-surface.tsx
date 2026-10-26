'use client';

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { anySolo, isTrackAudible } from '@/lib/studio/trackAudibility';
import { EQ_BANDS } from '@/lib/studio/audioPresets';
import { fallbackElementVolume, masterGainOf, peakDb, trackNodeParams } from '@/lib/studio/mixerMath';
import { setMeterSource } from '@/lib/studio/audioBus';
import {
  resolveActiveClips,
  topVideoClip,
  studioProxyUrl,
  studioProxyReversedUrl,
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
import { ensureImage, getImageBitmap, pruneImageCache, subscribeImageCache } from '@/lib/studio/imageCache';
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
import {
  clipSpeed,
  isFreezeClip,
  isReversed,
  maintainsPitch,
  reverseProxyReady,
  reversedProxyTime,
  sourceTimeAt,
} from '@/lib/studio/speed';
import {
  DEFAULT_SEEK_LATENCY_MS,
  createSlotSync,
  masterClockStep,
  nextLatencyEstimate,
  noteSeekIssued,
  planSync,
  upcomingClips,
  WARM_LOOKAHEAD_S,
  type SlotSyncState,
} from '@/lib/studio/playbackSync';
import ReverseWatchers from './reverse-watchers';

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
  /** MM70: a free slot pre-loaded (src + first frame) for a clip about to start. */
  warmFor: string | null;
}

// MM70: an element in the `error` state (e.g. a failed Range request) is dead
// until its src is reloaded; reload at most this often per slot.
const ERROR_RELOAD_COOLDOWN_MS = 2000;

/**
 * One track's mixer chain (part 19):
 *   input -> EQ low shelf -> mid peaking -> high shelf -> compressor ->
 *   fader gain -> track pan -> [duck/mute gain = AudioGraph.trackGains] -> master
 * with a stereo analyser tap after the duck gain (so muted/ducked tracks meter
 * what is actually heard). The export mirrors this order (studio_export.go
 * trackStageParts): EQ -> acompressor -> volume -> stereotools.
 */
interface TrackChain {
  input: GainNode;
  low: BiquadFilterNode;
  mid: BiquadFilterNode;
  high: BiquadFilterNode;
  comp: DynamicsCompressorNode;
  fader: GainNode;
  pan: StereoPannerNode | null;
  tapL: AnalyserNode | null;
  tapR: AnalyserNode | null;
  /** Last applied params key — skips redundant AudioParam writes. */
  key: string;
}

interface AudioGraph {
  ctx: AudioContext | null;
  sources: (MediaElementAudioSourceNode | null)[];
  slotGains: (GainNode | null)[]; // per-slot clip volume
  slotPans: (StereoPannerNode | null)[]; // per-slot clip pan (static + keyframed, part 15)
  trackGains: Map<string, GainNode>; // per-track mute/solo/ducking gain (chain output)
  trackChains: Map<string, TrackChain>; // per-track mixer chain (part 19)
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
 * MM70: the playhead advances on the AUDIO OUTPUT clock (masterClockStep),
 * and each element follows it through lib/studio/playbackSync.ts — rate
 * nudges for small drift, one latency-led seek with a cooldown for large
 * drift, automatic recovery from lost seeks / stuck buffers — and the next
 * clip on a track is warmed in a spare slot before its cut. Audio is the
 * master and never stutters; video catches up.
 *
 * KNOWN LIMITATION: driving HTMLMediaElement.currentTime from a timeline clock
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
  const slots = React.useRef<Slot[]>(
    Array.from({ length: POOL_SIZE }, () => ({ clipId: null, srcAssetId: null, warmFor: null })),
  );
  const audio = React.useRef<AudioGraph>({
    ctx: null,
    sources: Array(POOL_SIZE).fill(null),
    slotGains: Array(POOL_SIZE).fill(null),
    slotPans: Array(POOL_SIZE).fill(null),
    trackGains: new Map(),
    trackChains: new Map(),
    master: null,
    splitter: null,
    analyserL: null,
    analyserR: null,
  });
  const rafRef = React.useRef<number | null>(null);
  const lastTsRef = React.useRef(0);
  // MM70 master clock: the last audio-output time the playhead advanced to.
  const lastAudioClockRef = React.useRef<number | null>(null);
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
  // MM70 drift/seek policy state (lib/studio/playbackSync.ts): per-slot seek
  // bookkeeping, plus a seek-latency estimate per media kind that sizes the
  // seek lead. Kept apart because a long-GOP video seek costs far more than an
  // AAC audio seek; one shared estimate would aim audio seconds ahead.
  const slotSync = React.useRef<SlotSyncState[]>(Array.from({ length: POOL_SIZE }, createSlotSync));
  const seekLatencyMs = React.useRef({ video: DEFAULT_SEEK_LATENCY_MS, audio: DEFAULT_SEEK_LATENCY_MS });
  const errorReloadAt = React.useRef<number[]>(Array(POOL_SIZE).fill(-Infinity));

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
  // Part 18: hidden video tracks never reach the composite, in any render path
  // (the WebGL path filters them in syncFrame; this feeds the CSS fallbacks).
  const hiddenIds = React.useMemo(() => new Set(tracks.filter((tr) => tr.hidden).map((tr) => tr.id)), [tracks]);
  const topNow = React.useMemo(() => topVideoClip(activeNow), [activeNow]);
  // Title clips are assetless and always renderable — never "building".
  // A clip whose asset is gone (undone usage-protected delete) is offline, not "building".
  const building =
    !!topNow && !topNow.clip.title && !!assets[topNow.clip.assetId] && assets[topNow.clip.assetId]?.status !== 'ready';
  // Part 17: a reversed clip whose reversed proxy isn't ready yet shows its
  // poster frame (the ordinary proxy, paused) under a "Processing reverse
  // preview…" scrim, with its audio muted.
  const reversePending = React.useMemo(
    () =>
      activeNow.some((a) => {
        if (!isReversed(a.clip)) return false;
        const e = assets[a.clip.assetId];
        return !!e && e.status === 'ready' && !reverseProxyReady(e);
      }),
    [activeNow, assets],
  );
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
      .filter((a) => a.trackKind === 'video' && !!a.clip.title && !hiddenIds.has(a.trackId))
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
  }, [glOk, activeNow, playhead, hiddenIds]);

  // Active still-image clips for the CSS fallback path (no WebGL): plain <img>
  // elements styled like the fallback <video> (opacity x dissolve ramp, stack
  // order, color adjustments).
  const fallbackImageItems = React.useMemo(() => {
    if (glOk) return [];
    return activeNow
      .filter(
        (a) =>
          a.trackKind === 'video' &&
          !hiddenIds.has(a.trackId) &&
          assets[a.clip.assetId]?.asset.mediaKind === 'image' &&
          assets[a.clip.assetId]?.status === 'ready',
      )
      .sort((x, y) => x.trackIndex - y.trackIndex || x.clip.timelineStart - y.clip.timelineStart)
      .map((a, idx) => {
        const vals = clipValuesAt(a.clip, playhead - a.clip.timelineStart);
        return {
          key: a.clip.id,
          src: studioProxyUrl(a.clip.assetId),
          opacity: vals.opacity * transitionRamp(a.clip, playhead),
          z: idx + 1,
          filter: cssFilterForAdjustments(a.clip.adjustments),
        };
      });
  }, [glOk, activeNow, assets, playhead, hiddenIds]);

  // Text/location overlays for the active video clips (faked over the surface;
  // the export draws them in with drawtext).
  const projectHeight = project?.height ?? 1080;
  const textItems = React.useMemo(
    () =>
      activeNow
        .filter((a) => a.trackKind === 'video' && !hiddenIds.has(a.trackId))
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
      // Mixer meters (part 19): the drawer polls these at ~20 Hz; reads reuse
      // two shared buffers, so there is no per-frame allocation.
      const meterBuf = new Float32Array(1024);
      const read = (l: AnalyserNode | null, r: AnalyserNode | null) => {
        if (!l || !r) return null;
        l.getFloatTimeDomainData(meterBuf);
        const dl = peakDb(meterBuf.subarray(0, l.fftSize));
        r.getFloatTimeDomainData(meterBuf);
        return { l: dl, r: peakDb(meterBuf.subarray(0, r.fftSize)) };
      };
      setMeterSource({
        track: (id) => {
          const ch = a.trackChains.get(id);
          return ch ? read(ch.tapL, ch.tapR) : null;
        },
        master: () => read(a.analyserL, a.analyserR),
      });
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

  // Returns the track's chain INPUT node (slots connect here), building the
  // whole chain + duck/mute gain + meter taps on first use.
  const trackGain = React.useCallback((trackId: string): GainNode | null => {
    const a = audio.current;
    if (!a.ctx) return null;
    const existing = a.trackChains.get(trackId);
    if (existing) return existing.input;
    const ctx = a.ctx;
    const input = ctx.createGain();
    const low = ctx.createBiquadFilter();
    low.type = EQ_BANDS.low.type;
    low.frequency.value = EQ_BANDS.low.hz;
    const mid = ctx.createBiquadFilter();
    mid.type = EQ_BANDS.mid.type;
    mid.frequency.value = EQ_BANDS.mid.hz;
    mid.Q.value = EQ_BANDS.mid.q;
    const high = ctx.createBiquadFilter();
    high.type = EQ_BANDS.high.type;
    high.frequency.value = EQ_BANDS.high.hz;
    const comp = ctx.createDynamicsCompressor();
    // Transparent until the track has a compressor (see trackNodeParams).
    comp.threshold.value = 0;
    comp.ratio.value = 1;
    comp.knee.value = 0;
    const fader = ctx.createGain();
    let pan: StereoPannerNode | null = null;
    try {
      pan = ctx.createStereoPanner();
    } catch {
      pan = null;
    }
    const duck = ctx.createGain();
    duck.gain.value = 1;
    input.connect(low);
    low.connect(mid);
    mid.connect(high);
    high.connect(comp);
    comp.connect(fader);
    if (pan) {
      fader.connect(pan);
      pan.connect(duck);
    } else {
      fader.connect(duck);
    }
    duck.connect(a.master ?? ctx.destination);
    let tapL: AnalyserNode | null = null;
    let tapR: AnalyserNode | null = null;
    try {
      const splitter = ctx.createChannelSplitter(2);
      tapL = ctx.createAnalyser();
      tapR = ctx.createAnalyser();
      tapL.fftSize = 512;
      tapR.fftSize = 512;
      duck.connect(splitter);
      splitter.connect(tapL, 0);
      splitter.connect(tapR, 1);
    } catch {
      /* metering is optional */
    }
    a.trackGains.set(trackId, duck);
    a.trackChains.set(trackId, { input, low, mid, high, comp, fader, pan, tapL, tapR, key: '' });
    return input;
  }, []);

  // Writes each track's fader/pan/EQ/compressor and the master fader from the
  // document. Cheap and idempotent (keyed), so it can run every frame from
  // syncFrame and from the paused effect below.
  const applyMixerParams = React.useCallback(() => {
    const a = audio.current;
    if (!a.ctx) return;
    const st = useStudioStore.getState();
    const now = a.ctx.currentTime;
    for (const tr of st.project?.tracks ?? []) {
      const ch = a.trackChains.get(tr.id);
      if (!ch) continue;
      const p = trackNodeParams(tr);
      const key = JSON.stringify(p);
      if (key === ch.key) continue;
      ch.key = key;
      ch.low.gain.setTargetAtTime(p.lowDb, now, 0.01);
      ch.mid.gain.setTargetAtTime(p.midDb, now, 0.01);
      ch.high.gain.setTargetAtTime(p.highDb, now, 0.01);
      ch.comp.threshold.setTargetAtTime(p.comp.thresholdDb, now, 0.01);
      ch.comp.ratio.setTargetAtTime(p.comp.ratio, now, 0.01);
      ch.comp.knee.setTargetAtTime(p.comp.kneeDb, now, 0.01);
      ch.comp.attack.setTargetAtTime(p.comp.attackS, now, 0.01);
      ch.comp.release.setTargetAtTime(p.comp.releaseS, now, 0.01);
      ch.fader.gain.setTargetAtTime(p.gain, now, 0.01);
      if (ch.pan) ch.pan.pan.setTargetAtTime(Math.max(-1, Math.min(1, p.pan)), now, 0.01);
    }
    if (a.master) a.master.gain.setTargetAtTime(masterGainOf(st.project?.audio), now, 0.01);
  }, []);

  // Which track each slot's gain node is currently wired to. Re-wiring the
  // graph is only correct — and only cheap — when that actually changes;
  // `routeSlotAudio` runs once per active clip per animation frame, and
  // disconnect/connect on every one of those was audible churn in the graph as
  // well as wasted work.
  const slotRouting = React.useRef<Array<string | null>>([]);

  const routeSlotAudio = React.useCallback(
    (i: number, trackId: string, clipVolume: number, clipPan: number, trackMuted: boolean, trackGainLinear?: number, masterLinear?: number) => {
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
        // Degraded mode (part 19): clip x track x master composed into the
        // element volume, capped at 1.0; no EQ, compressor or pan.
        el.muted = trackMuted;
        el.volume = fallbackElementVolume(clipVolume, trackGainLinear, masterLinear);
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
      // Part 18 solo: when any audio track is soloed only soloed audio is
      // heard (solo beats mute; video embedded audio goes silent). Mirrors
      // lib/studio/trackAudibility.ts; the export side belongs to part 19.
      const soloOn = anySolo(trks);
      const audibleTrackIds = new Set<string>();
      for (const tr of trks) {
        if (isTrackAudible(tr, soloOn)) audibleTrackIds.add(tr.id);
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

      // Source key a clip plays from (part 17: reversed clips with a ready
      // reversed proxy play that file instead).
      const srcKeyOf = (clip: (typeof active)[number]['clip'], entry: (typeof st.assets)[string]): string =>
        isReversed(clip) && reverseProxyReady(entry) ? `${clip.assetId}:r` : clip.assetId;

      // Assign/refresh a slot per active clip whose proxy is ready.
      const gl = glOkRef.current;
      const nowMs = performance.now();
      const clipSlots = new Map<string, number>();
      for (const a of active) {
        const entry = st.assets[a.clip.assetId];
        if (!entry || entry.status !== 'ready') continue;
        // Still images never take a decoder slot: they draw from the bitmap cache.
        if (entry.asset.mediaKind === 'image') continue;
        // Slot choice (MM70): the clip's own slot, else the slot warmed for it,
        // else a free slot already holding the same source (a split clip or a
        // cut back to the same file keeps its buffered element instead of a
        // cold src reload), else any free slot not warming another clip.
        const want = srcKeyOf(a.clip, entry);
        let i = slots.current.findIndex((s) => s.clipId === a.clip.id);
        if (i < 0) i = slots.current.findIndex((s) => s.clipId === null && s.warmFor === a.clip.id);
        if (i < 0) i = slots.current.findIndex((s) => s.clipId === null && s.srcAssetId === want);
        if (i < 0) i = slots.current.findIndex((s) => s.clipId === null && s.warmFor === null);
        if (i < 0) i = slots.current.findIndex((s) => s.clipId === null);
        if (i < 0) continue; // pool exhausted — skip extra concurrent clip
        const slot = slots.current[i];
        const el = poolEls.current[i];
        if (!el) continue;
        // A newly claimed slot starts with clean sync bookkeeping: a warm-up
        // or the previous clip's seek must not count as this clip's seek.
        // A warm-up seek still in flight counts as issued now, so it is waited
        // for rather than presumed lost.
        if (slot.clipId !== a.clip.id) {
          slotSync.current[i] =
            el.seeking || el.readyState < 3 ? noteSeekIssued(createSlotSync(), nowMs, false) : createSlotSync();
        }
        slot.clipId = a.clip.id;
        slot.warmFor = null;
        clipSlots.set(a.clip.id, i);

        // --- Speed controls (part 17) ---
        // Forward clips play the ordinary proxy at playbackRate = speed
        // (pitch preserved natively unless the clip opts out). Reversed clips
        // play the REVERSED proxy forward, with the source position mirrored
        // through the proxy's duration; until it is ready the ordinary proxy
        // is held paused as a poster frame. Freeze clips hold one frame.
        const frozen = isFreezeClip(a.clip);
        const reversed = isReversed(a.clip);
        const reverseReady = reversed && reverseProxyReady(entry);
        const rate = clipSpeed(a.clip);
        const useReversedSrc = reverseReady;
        const srcKey = want;
        // A dead element (network/decode error) never recovers by seeking:
        // reload its source, rate-limited (MM70).
        if (el.error && slot.srcAssetId === srcKey && nowMs - errorReloadAt.current[i] > ERROR_RELOAD_COOLDOWN_MS) {
          errorReloadAt.current[i] = nowMs;
          slot.srcAssetId = null;
        }
        let freshSrc = false;
        if (slot.srcAssetId !== srcKey) {
          slot.srcAssetId = srcKey;
          el.src = useReversedSrc ? studioProxyReversedUrl(a.clip.assetId) : studioProxyUrl(a.clip.assetId);
          seekIntentAt.current[i] = null;
          pendingSeekTarget.current[i] = null;
          // A fresh src load is the slowest "seek" there is: start the
          // planner's clock so it waits for the load instead of re-seeking,
          // without counting the load as a seek-latency sample.
          slotSync.current[i] = noteSeekIssued(createSlotSync(), nowMs, false);
          freshSrc = true;
        }
        const mediaDur = Number.isFinite(el.duration) && el.duration > 0 ? el.duration : entry.asset.durationSeconds;
        const targetTime = useReversedSrc ? reversedProxyTime(a.sourceTime, mediaDur) : a.sourceTime;
        const latKind = entry.asset.mediaKind === 'audio' ? 'audio' : 'video';
        if (freshSrc) {
          // Start the load at the right place (the default playback start
          // position), ahead by the seek lead while playing.
          try {
            el.currentTime = playing ? targetTime + (seekLatencyMs.current[latKind] / 1000) * rate : targetTime;
          } catch {
            /* applied on the next frame by the planner */
          }
        }
        // Stalled = nothing should sound or advance: a held frame, or a reversed clip still building.
        const stalled = frozen || (reversed && !reverseReady);
        const keepPitch = maintainsPitch(a.clip);
        if (el.preservesPitch !== keepPitch) el.preservesPitch = keepPitch;
        const vals = valuesByClip.get(a.clip.id) ?? clipValuesAt(a.clip, t - a.clip.timelineStart);
        // Drift policy (MM70, lib/studio/playbackSync.ts). The playhead is the
        // master; the element is a slave. Small drift is closed by nudging
        // playbackRate (video only — audio-only clips are never stretched),
        // large drift by ONE seek aimed ahead by the measured seek latency,
        // with a cooldown; an in-flight seek is never stacked on, and a seek
        // or buffer that never completes is re-kicked. The old policy re-seeked
        // to the current target every frame past 0.3 s, so any seek slower than
        // 0.3 s landed behind and re-seeked forever: a frozen picture under
        // perfectly playing audio until pause/play stopped the target moving.
        const nudge = a.trackKind === 'video' && entry.asset.mediaKind !== 'audio';
        const plan = planSync(slotSync.current[i], {
          el,
          target: targetTime,
          baseRate: rate,
          playing: playing && !stalled,
          nowMs,
          latencyMs: seekLatencyMs.current[latKind],
          maxTime: mediaDur > 0 ? mediaDur : undefined,
          nudge,
        });
        slotSync.current[i] = plan.state;
        if (plan.latencySampleMs !== undefined) {
          // Every landed seek (scrub ones too) sizes the lead for the next
          // playing seek; paused seeks already report telemetry via `seeked`.
          seekLatencyMs.current[latKind] = nextLatencyEstimate(seekLatencyMs.current[latKind], plan.latencySampleMs);
          if (playing) perf.sample({ seekLatencyMs: plan.latencySampleMs });
        }
        const act = plan.action;
        if (el.playbackRate !== act.rate) el.playbackRate = act.rate;
        if (act.kind === 'defer') {
          // Paused/scrubbing with a seek in flight: remember only the newest
          // target — the `seeked` handler re-issues it.
          pendingSeekTarget.current[i] = act.time;
        } else if (act.kind === 'seek') {
          pendingSeekTarget.current[i] = null;
          // Playing-mode seeks report latency through the planner (issue →
          // playable); paused ones through the `seeked` handler.
          seekIntentAt.current[i] = act.reason === 'exact' ? nowMs : null;
          if (act.reason !== 'exact') perf.sample(act.reason === 'stuck' ? { stuckRecovery: true } : { resyncSeek: true });
          try {
            el.currentTime = act.time;
          } catch {
            seekIntentAt.current[i] = null; /* element not seekable yet */
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
        // Stalled clips (freeze / reverse still building) are silent.
        routeSlotAudio(
          i,
          a.trackId,
          stalled ? 0 : gainNow,
          vals.pan,
          !audibleTrackIds.has(a.trackId) || stalled,
          trks.find((tr) => tr.id === a.trackId)?.gain,
          masterGainOf(st.project?.audio),
        );
        if (playing && !stalled) {
          if (el.paused) void el.play().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      }

      // Warm the next clip on each track (MM70): while playing, a free slot
      // loads a clip that starts within WARM_LOOKAHEAD_S and parks on its
      // first frame, paused and silent, so the cut plays from a buffered
      // element instead of a cold src load or a long seek. That includes a
      // cut to another part of a file that is already playing: the warm
      // element sits at the new clip's in-point, the playing one does not.
      if (playing) {
        // Only clips inside the lookahead window are collected: this runs per
        // frame and must stay O(clips) without allocating per clip.
        const candidates: Array<{ clipId: string; trackId: string; timelineStart: number; clip: (typeof active)[number]['clip'] }> = [];
        for (const tr of trks) {
          for (const c of tr.clips) {
            if (c.timelineStart > t && c.timelineStart <= t + WARM_LOOKAHEAD_S) {
              candidates.push({ clipId: c.id, trackId: tr.id, timelineStart: c.timelineStart, clip: c });
            }
          }
        }
        const wanted = new Set<string>();
        for (const next of upcomingClips(candidates, t)) {
          if (activeIds.has(next.clipId)) continue;
          const entry = st.assets[next.clip.assetId];
          if (!entry || entry.status !== 'ready' || entry.asset.mediaKind === 'image' || next.clip.title) continue;
          const key = srcKeyOf(next.clip, entry);
          wanted.add(next.clipId);
          let i = slots.current.findIndex((s) => s.clipId === null && s.warmFor === next.clipId);
          if (i < 0) i = slots.current.findIndex((s) => s.clipId === null && s.warmFor === null);
          if (i < 0) break; // pool full: the clip loads on activation, as before
          const slot = slots.current[i];
          const el = poolEls.current[i];
          if (!el) continue;
          if (slot.warmFor !== next.clipId) {
            slot.warmFor = next.clipId;
            silenceSlot(i);
            el.pause();
            if (slot.srcAssetId !== key) {
              slot.srcAssetId = key;
              el.src = key.endsWith(':r') ? studioProxyReversedUrl(next.clip.assetId) : studioProxyUrl(next.clip.assetId);
            }
          }
          const first = sourceTimeAt(next.clip, next.timelineStart);
          const dur = Number.isFinite(el.duration) && el.duration > 0 ? el.duration : entry.asset.durationSeconds;
          const at = key.endsWith(':r') ? reversedProxyTime(first, dur) : first;
          if (!el.seeking && el.readyState >= 1 && Math.abs(el.currentTime - at) > 0.05) {
            try {
              el.currentTime = at;
            } catch {
              /* not seekable yet; retried next frame */
            }
          }
        }
        // A warm slot whose clip is no longer upcoming (seek away, edit) is freed.
        slots.current.forEach((s) => {
          if (s.clipId === null && s.warmFor !== null && !wanted.has(s.warmFor)) s.warmFor = null;
        });
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
        applyMixerParams();
        const duckCfg = st.project?.audio;
        const voiceTrackId =
          duckCfg?.duckingEnabled && duckCfg.duckVoiceTrackId ? duckCfg.duckVoiceTrackId : '';
        const voiceTrack = voiceTrackId ? trks.find((tr) => tr.id === voiceTrackId) : undefined;
        const ducking = !!voiceTrack && audibleTrackIds.has(voiceTrack.id);
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
          const audible = audibleTrackIds.has(tr.id);
          let target = audible ? 1 : 0;
          if (ducking && audible && tr.id !== voiceTrackId) {
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
              (clipSlots.has(a.clip.id) || !!a.clip.title || st.assets[a.clip.assetId]?.asset.mediaKind === 'image') &&
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
          const imgEntry = st.assets[a.clip.assetId];
          if (imgEntry?.asset.mediaKind === 'image') {
            // Still image: one decoded bitmap per asset, uploaded once under the
            // asset id (shared by every clip of it), then the same layer pipeline.
            if (imgEntry.status !== 'ready') continue;
            const bmp = getImageBitmap(a.clip.assetId);
            if (!bmp) {
              void ensureImage(a.clip.assetId);
              continue;
            }
            if (!comp.uploadImage(a.clip.assetId, bmp, a.clip.assetId)) continue;
            layers.push(
              buildGLLayer(
                a,
                { slot: -1, srcW: bmp.width, srcH: bmp.height, imageKey: a.clip.assetId },
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
    [routeSlotAudio, silenceSlot, applyMixerParams],
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
    lastAudioClockRef.current = null;
    const step = (ts: number) => {
      const rafDt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      // Master clock (MM70): advance by the audio output clock when the
      // context runs (interpolated through getOutputTimestamp so it moves
      // smoothly between audio callbacks), else by the rAF delta.
      const ctx = audio.current.ctx;
      let audioNow: number | null = null;
      if (ctx && ctx.state === 'running') {
        audioNow = ctx.currentTime;
        try {
          const ots = ctx.getOutputTimestamp?.();
          if (ots && typeof ots.contextTime === 'number' && typeof ots.performanceTime === 'number' && ots.performanceTime > 0) {
            audioNow = ots.contextTime + Math.max(0, performance.now() - ots.performanceTime) / 1000;
          }
        } catch {
          /* currentTime stands */
        }
      }
      const clock = masterClockStep(lastAudioClockRef.current, audioNow, rafDt);
      lastAudioClockRef.current = clock.audio;
      const dt = clock.dt;
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
      const fr = frameStatsPush(frameStatsRef.current, rafDt * 1000);
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
        // Coalesced targets are a paused/scrubbing mechanism only (MM70): while
        // playing, a target captured before this seek started is already stale
        // by the seek's own latency — re-issuing it landed behind again and fed
        // the seek storm. The rAF planner owns playing-mode seeks.
        if (target != null && !useStudioStore.getState().isPlaying && Math.abs(el.currentTime - target) > 0.05) {
          try {
            seekIntentAt.current[i] = performance.now();
            slotSync.current[i] = noteSeekIssued(slotSync.current[i], performance.now());
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

  // Mixer edits while paused (or between frames): re-apply fader/pan/EQ/comp.
  // During playback syncFrame also applies them every frame.
  const mixerTracks = project?.tracks;
  React.useEffect(() => {
    applyMixerParams();
  }, [mixerTracks, projectAudio, applyMixerParams]);

  // Tear down the audio graph on unmount.
  React.useEffect(
    () => () => {
      const a = audio.current;
      if (a.ctx) void a.ctx.close().catch(() => {});
      a.ctx = null;
      a.trackGains.clear();
      a.trackChains.clear();
      setMeterSource(null);
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

  // A decoded still-image bitmap landing repaints the paused frame.
  React.useEffect(
    () =>
      subscribeImageCache(() => {
        const st = useStudioStore.getState();
        if (!st.isPlaying) syncFrameRef.current?.(st.playhead, false);
      }),
    [],
  );

  // Free raster canvases + GL textures of title clips that left the document.
  React.useEffect(() => {
    if (!project) return;
    const live = new Set<string>();
    const liveImages = new Set<string>();
    for (const tr of project.tracks) {
      for (const c of tr.clips) {
        if (c.title) live.add(c.id);
        // Image textures are keyed by asset id (shared by every clip of it).
        else if (assets[c.assetId]?.asset.mediaKind === 'image') {
          live.add(c.assetId);
          liveImages.add(c.assetId);
        }
      }
    }
    for (const id of titleRasterCache.current.keys()) {
      if (!live.has(id)) titleRasterCache.current.delete(id);
    }
    compositorRef.current?.pruneImages(live);
    pruneImageCache(liveImages);
  }, [project, assets]);

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
            preload="auto"
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
        {/* CSS-fallback still images (no WebGL): same stacking contract as the
            fallback <video> pool. */}
        {fallbackImageItems.map((item) => (
          <img
            key={item.key}
            src={item.src}
            alt=""
            crossOrigin="anonymous"
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ opacity: item.opacity, zIndex: item.z, filter: item.filter }}
          />
        ))}
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
        {/* Part 17: poster frame stays visible beneath a lighter scrim. */}
        {!building && reversePending && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center text-sm text-premium bg-surface-0/40 pointer-events-none"
            role="status"
          >
            {t('contentStudio.speed.processingReverse')}
          </div>
        )}
        <ReverseWatchers />
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
