/**
 * Pure playback stepping for the Motion preview (ticket MM44 decisions 4 + 6).
 *
 * The preview renders the model at time t (`sampleDoc`), so play is just a
 * clock that moves the playhead. Time advances by wall-clock but is
 * QUANTISED to the document's preview fps (24 by default, §7): the playhead
 * only ever lands on frame times, exactly like scrubbing with frame snap.
 *
 * Within the play range (or the whole composition): with loop on, time wraps
 * back to the range start; with loop off, play stops on the range end.
 */

export interface PlaybackWindow {
  start: number;
  end: number;
}

export function playWindow(duration: number, range: PlaybackWindow | null): PlaybackWindow {
  if (!range) return { start: 0, end: duration };
  return { start: Math.max(0, range.start), end: Math.min(duration, range.end) };
}

/** Frame duration in ms for a preview fps (guarded). */
export const frameMs = (fps: number) => 1000 / (Number.isFinite(fps) && fps > 0 ? fps : 24);

/** Snap t (ms) to the nearest frame time, as an integer ms. */
export function snapToFrame(t: number, fps: number): number {
  const f = frameMs(fps);
  return Math.round(Math.round(t / f) * f);
}

export interface StepInput {
  /** Playhead when play started (ms). */
  originTime: number;
  /** Wall-clock ms since play started. */
  elapsed: number;
  duration: number;
  fps: number;
  range: PlaybackWindow | null;
  loop: boolean;
}

/** The playhead for `elapsed` ms of play, and whether play should stop. */
export function stepPlayback({ originTime, elapsed, duration, fps, range, loop }: StepInput): { time: number; stop: boolean } {
  const w = playWindow(duration, range);
  const len = w.end - w.start;
  if (len <= 0) return { time: w.start, stop: true };
  const f = frameMs(fps);
  // Frames since start, from the (frame-aligned) origin within the window.
  const origin = originTime < w.start || originTime >= w.end ? w.start : originTime;
  const raw = origin - w.start + Math.floor(elapsed / f) * f;
  if (raw >= len) {
    if (!loop) return { time: w.end, stop: true };
    const wrapped = raw % len;
    return { time: Math.round(w.start + Math.floor(wrapped / f) * f), stop: false };
  }
  return { time: Math.round(w.start + raw), stop: false };
}

/** `m:ss.mmm` (non-negative). */
export function formatTimecode(ms: number): string {
  const t = Math.max(0, Math.round(ms));
  const m = Math.floor(t / 60000);
  const s = Math.floor((t % 60000) / 1000);
  const r = t % 1000;
  return `${m}:${String(s).padStart(2, '0')}.${String(r).padStart(3, '0')}`;
}
