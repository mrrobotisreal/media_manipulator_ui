'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DRIFT_THRESHOLD_MS, frameStep, needsCorrection } from './syncMath';
import { estimateFps } from './videoFps';

/** Frames sampled per video for the fps estimate. */
const FPS_SAMPLE_FRAMES = 30;
const RATES = [0.5, 1, 1.5, 2] as const;
export const PLAYBACK_RATES: readonly number[] = RATES;

type FrameVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: (now: number, meta: { mediaTime: number }) => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

export interface SyncedVideosState {
  playing: boolean;
  buffering: boolean;
  currentTime: number;
  duration: number;
  rate: number;
  /** True when sound from the RESULT video (B) is audible. A is always muted. */
  soundOn: boolean;
  /** Measured by requestVideoFrameCallback; null until ~30 frames played or unsupported. */
  fpsA: number | null;
  fpsB: number | null;
  /** Largest decoded width reported by either video. */
  maxVideoWidth: number;
}

export interface SyncedVideos {
  /** Attach to the two `<video>` elements: A = original (the clock), B = result. */
  refA: (el: HTMLVideoElement | null) => void;
  refB: (el: HTMLVideoElement | null) => void;
  state: SyncedVideosState;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (seconds: number) => void;
  setRate: (rate: number) => void;
  toggleSound: () => void;
  /** Steps both videos by one frame (pauses first). */
  stepFrame: (dir: 1 | -1) => void;
}

const INITIAL: SyncedVideosState = {
  playing: false,
  buffering: false,
  currentTime: 0,
  duration: 0,
  rate: 1,
  soundOn: false,
  fpsA: null,
  fpsB: null,
  maxVideoWidth: 0,
};

const safePlay = (el: HTMLVideoElement) => {
  try {
    const p = el.play() as Promise<void> | undefined;
    p?.catch?.(() => undefined);
  } catch {
    // jsdom / autoplay policy: the next user gesture retries.
  }
};
const safePause = (el: HTMLVideoElement) => {
  try {
    el.pause();
  } catch {
    // ignore
  }
};

/**
 * Two `<video>` elements, one transport.
 *
 * Sync strategy: A is the clock. While playing, a `requestVideoFrameCallback` loop on A
 * (fallback `requestAnimationFrame` when the browser has none) compares B to A and hard-sets
 * B only when drift exceeds `DRIFT_THRESHOLD_MS` (80 ms), so playback never stutters from
 * constant seeking. Play, pause, seek and rate changes are hard-synced immediately.
 * `waiting` on either element pauses both; when both can play again and the user still
 * wants playback, both resume together. Elements remounted by a layout switch pick the
 * stored position back up on `loadedmetadata`.
 */
export function useSyncedVideos(): SyncedVideos {
  // Elements live in refs (they are mutated imperatively); `attached` re-runs the effect when
  // a layout switch mounts a different pair.
  const elA = useRef<HTMLVideoElement | null>(null);
  const elB = useRef<HTMLVideoElement | null>(null);
  const [attached, setAttached] = useState(0);
  const refA = useCallback((el: HTMLVideoElement | null) => {
    if (elA.current === el) return;
    elA.current = el;
    setAttached((n) => n + 1);
  }, []);
  const refB = useCallback((el: HTMLVideoElement | null) => {
    if (elB.current === el) return;
    elB.current = el;
    setAttached((n) => n + 1);
  }, []);
  const [state, setState] = useState<SyncedVideosState>(INITIAL);

  // Transport intent survives remounts and buffering pauses.
  const intent = useRef({ playing: false, time: 0, rate: 1, soundOn: false });
  const patch = useCallback((p: Partial<SyncedVideosState>) => setState((s) => ({ ...s, ...p })), []);

  useEffect(() => {
    const a = elA.current;
    const b = elB.current;
    if (!a || !b) return;
    let alive = true;
    const handles: Array<() => void> = [];
    const listen = (el: HTMLVideoElement, type: string, fn: (e: Event) => void) => {
      el.addEventListener(type, fn);
      handles.push(() => el.removeEventListener(type, fn));
    };
    const bothReady = () => a.readyState >= 3 && b.readyState >= 3;
    const applyIntent = () => {
      a.muted = true;
      b.muted = !intent.current.soundOn;
      a.playbackRate = intent.current.rate;
      b.playbackRate = intent.current.rate;
    };
    const alignB = () => {
      if (Math.abs(b.currentTime - a.currentTime) > 0.001) b.currentTime = a.currentTime;
    };
    applyIntent();

    // A is the clock.
    listen(a, 'play', () => {
      alignB();
      if (b.paused) safePlay(b);
    });
    listen(a, 'pause', () => {
      if (!b.paused) safePause(b);
    });
    listen(a, 'seeking', alignB);
    listen(a, 'seeked', alignB);
    listen(a, 'ratechange', () => {
      if (b.playbackRate !== a.playbackRate) b.playbackRate = a.playbackRate;
    });
    listen(a, 'timeupdate', () => {
      intent.current.time = a.currentTime;
      patch({ currentTime: a.currentTime });
    });
    listen(a, 'ended', () => {
      intent.current.playing = false;
      safePause(b);
      patch({ playing: false, currentTime: a.currentTime });
    });
    // B never drives A: a B-side seek (or its own seek landing) is pulled back to A.
    listen(b, 'seeked', alignB);

    const onMeta = () => {
      const duration = [a.duration, b.duration].find((d) => Number.isFinite(d) && d > 0) ?? 0;
      patch({ duration, maxVideoWidth: Math.max(a.videoWidth || 0, b.videoWidth || 0) });
      if (intent.current.time > 0) {
        a.currentTime = intent.current.time;
        b.currentTime = intent.current.time;
      }
      applyIntent();
    };
    listen(a, 'loadedmetadata', onMeta);
    listen(b, 'loadedmetadata', onMeta);
    listen(a, 'durationchange', onMeta);

    // Buffering: either side stalling stops both; both ready resumes if the user was playing.
    const onWaiting = () => {
      if (!intent.current.playing) return;
      safePause(a);
      safePause(b);
      patch({ buffering: true });
    };
    const onCanPlay = () => {
      if (!intent.current.playing || !bothReady()) return;
      alignB();
      safePlay(a);
      safePlay(b);
      patch({ buffering: false, playing: true });
    };
    listen(a, 'waiting', onWaiting);
    listen(b, 'waiting', onWaiting);
    listen(a, 'canplay', onCanPlay);
    listen(b, 'canplay', onCanPlay);

    // Drift correction + fps sampling.
    const va = a as FrameVideo;
    const vb = b as FrameVideo;
    const hasRvfc = typeof va.requestVideoFrameCallback === 'function';
    const samplesA: number[] = [];
    const samplesB: number[] = [];
    let rafId = 0;
    let rvfcA = 0;
    let rvfcB = 0;
    const correct = () => {
      if (!a.paused && needsCorrection(a.currentTime, b.currentTime, DRIFT_THRESHOLD_MS)) {
        b.currentTime = a.currentTime;
      }
    };
    if (hasRvfc) {
      const loopA = (_now: number, meta: { mediaTime: number }) => {
        if (!alive) return;
        correct();
        if (samplesA.length < FPS_SAMPLE_FRAMES) {
          samplesA.push(meta.mediaTime);
          if (samplesA.length === FPS_SAMPLE_FRAMES) patch({ fpsA: estimateFps(samplesA) });
        }
        rvfcA = va.requestVideoFrameCallback!(loopA);
      };
      const loopB = (_now: number, meta: { mediaTime: number }) => {
        if (!alive) return;
        samplesB.push(meta.mediaTime);
        if (samplesB.length === FPS_SAMPLE_FRAMES) {
          patch({ fpsB: estimateFps(samplesB) });
          return;
        }
        rvfcB = vb.requestVideoFrameCallback!(loopB);
      };
      rvfcA = va.requestVideoFrameCallback!(loopA);
      rvfcB = vb.requestVideoFrameCallback!(loopB);
    } else {
      const tick = () => {
        if (!alive) return;
        correct();
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      alive = false;
      handles.forEach((off) => off());
      if (rafId) cancelAnimationFrame(rafId);
      if (rvfcA) va.cancelVideoFrameCallback?.(rvfcA);
      if (rvfcB) vb.cancelVideoFrameCallback?.(rvfcB);
    };
  }, [attached, patch]);

  const play = useCallback(() => {
    const a = elA.current;
    const b = elB.current;
    if (!a || !b) return;
    intent.current.playing = true;
    patch({ playing: true });
    if (a.readyState >= 3 && b.readyState >= 3) {
      b.currentTime = a.currentTime;
      safePlay(a);
      safePlay(b);
    } else {
      patch({ buffering: true });
    }
  }, [patch]);

  const pause = useCallback(() => {
    intent.current.playing = false;
    patch({ playing: false, buffering: false });
    if (elA.current) safePause(elA.current);
    if (elB.current) safePause(elB.current);
  }, [patch]);

  const seek = useCallback(
    (seconds: number) => {
      if (!Number.isFinite(seconds)) return;
      const t = Math.max(0, seconds);
      intent.current.time = t;
      if (elA.current) elA.current.currentTime = t;
      if (elB.current) elB.current.currentTime = t;
      patch({ currentTime: t });
    },
    [patch],
  );

  const setRate = useCallback(
    (rate: number) => {
      intent.current.rate = rate;
      if (elA.current) elA.current.playbackRate = rate;
      if (elB.current) elB.current.playbackRate = rate;
      patch({ rate });
    },
    [patch],
  );

  const toggleSound = useCallback(() => {
    const soundOn = !intent.current.soundOn;
    intent.current.soundOn = soundOn;
    if (elB.current) elB.current.muted = !soundOn;
    patch({ soundOn });
  }, [patch]);

  const stepFrame = useCallback(
    (dir: 1 | -1) => {
      const a = elA.current;
      if (!a || !elB.current) return;
      pause();
      const fps = state.fpsA ?? state.fpsB ?? 30;
      seek(frameStep(fps, a.currentTime, dir, state.duration || undefined));
    },
    [pause, seek, state.duration, state.fpsA, state.fpsB],
  );

  const toggle = useCallback(() => (intent.current.playing ? pause() : play()), [pause, play]);

  return { refA, refB, state, play, pause, toggle, seek, setRate, toggleSound, stepFrame };
}
