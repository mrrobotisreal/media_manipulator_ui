/** Frame-rate estimation and hints for the compare header. Pure. */

export const MIN_FPS_SAMPLES = 5;

/**
 * Estimate fps from `mediaTime` values (seconds) gathered by requestVideoFrameCallback.
 * Uses the median delta between consecutive distinct samples, so a dropped frame (one
 * double-length gap) does not move it. Returns null with fewer than 5 samples.
 */
export function estimateFps(samples: number[]): number | null {
  const clean = samples.filter((s) => Number.isFinite(s));
  if (clean.length < MIN_FPS_SAMPLES) return null;
  const deltas: number[] = [];
  for (let i = 1; i < clean.length; i++) {
    const d = clean[i] - clean[i - 1];
    if (d > 0) deltas.push(d);
  }
  if (deltas.length < MIN_FPS_SAMPLES - 1) return null;
  deltas.sort((a, b) => a - b);
  const mid = deltas.length >> 1;
  const median = deltas.length % 2 ? deltas[mid] : (deltas[mid - 1] + deltas[mid]) / 2;
  if (!(median > 0)) return null;
  return Math.round((1 / median) * 100) / 100;
}

/** Reads a dotted path from nested options. */
function dig(source: unknown, path: string[]): unknown {
  let cur: unknown = source;
  for (const key of path) {
    if (cur === null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur;
}

const toFps = (v: unknown): number | null => {
  const n = typeof v === 'string' ? Number.parseFloat(v) : typeof v === 'number' ? v : Number.NaN;
  return Number.isFinite(n) && n > 0 && n <= 1000 ? n : null;
};

/**
 * Target fps for the interpolation tool: `temporal.frameRate.target`, else the AI form's
 * `ai.frameInterpolation.targetFps` (what components/ai-video-tools.tsx actually writes).
 * Null for every other task.
 */
export function fpsHint(task: string | undefined, options: unknown): number | null {
  if (task !== 'ai_frame_interpolation' && task !== 'frame_interpolation') return null;
  return toFps(dig(options, ['temporal', 'frameRate', 'target'])) ?? toFps(dig(options, ['ai', 'frameInterpolation', 'targetFps']));
}
