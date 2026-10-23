/**
 * Waveform peaks for the AudioViewer.
 *
 * `computePeaks` is pure (and tested). `decodePeaks` is the browser edge: it decodes the
 * audio with Web Audio and degrades to `null` on anything unexpected, because a missing
 * waveform must never get in the way of the plain `<audio>` player beneath it.
 */

/** Decoding is skipped above this many seconds of audio (design: capped at 10 minutes). */
export const MAX_PEAK_SECONDS = 10 * 60;

/** Max absolute amplitude per bucket, 0..1. Channels are mixed by taking the loudest. */
export function computePeaks(channels: Float32Array[], buckets: number): number[] {
  if (buckets <= 0 || channels.length === 0) return [];
  const length = channels[0].length;
  if (length === 0) return new Array<number>(buckets).fill(0);
  const peaks = new Array<number>(buckets).fill(0);
  const size = length / buckets;
  for (let b = 0; b < buckets; b++) {
    const from = Math.floor(b * size);
    const to = Math.min(length, Math.max(from + 1, Math.floor((b + 1) * size)));
    let max = 0;
    for (const channel of channels) {
      for (let i = from; i < to; i++) {
        const v = Math.abs(channel[i]);
        if (v > max) max = v;
      }
    }
    peaks[b] = Math.min(1, max);
  }
  return peaks;
}

type AudioContextCtor = new () => AudioContext;

/**
 * Decode `src` and return peaks, or null when it cannot (no Web Audio, too long, fetch or
 * decode failure). `durationHint` is the element's reported duration, used to skip the
 * decode of anything over the cap before downloading more than we already have.
 */
export async function decodePeaks(
  src: string,
  buckets: number,
  durationHint?: number,
): Promise<number[] | null> {
  try {
    if (durationHint !== undefined && Number.isFinite(durationHint) && durationHint > MAX_PEAK_SECONDS) {
      return null;
    }
    const w = globalThis as unknown as { AudioContext?: AudioContextCtor; webkitAudioContext?: AudioContextCtor };
    const Ctor = w.AudioContext ?? w.webkitAudioContext;
    if (!Ctor) return null;
    const response = await fetch(src);
    if (!response.ok) return null;
    const data = await response.arrayBuffer();
    const context = new Ctor();
    try {
      const decoded = await context.decodeAudioData(data);
      if (decoded.duration > MAX_PEAK_SECONDS) return null;
      const channels: Float32Array[] = [];
      for (let c = 0; c < decoded.numberOfChannels; c++) channels.push(decoded.getChannelData(c));
      return computePeaks(channels, buckets);
    } finally {
      void context.close?.();
    }
  } catch {
    return null;
  }
}

/**
 * Draw peaks as mirrored bars. Uses an OffscreenCanvas for the raster when the browser has
 * one and blits the bitmap, otherwise draws straight onto the visible canvas.
 */
export function drawPeaks(canvas: HTMLCanvasElement, peaks: number[], color: string): void {
  const { width, height } = canvas;
  const target = canvas.getContext('2d');
  if (!target || width === 0 || height === 0) return;
  const paint = (ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    const barWidth = width / peaks.length;
    const mid = height / 2;
    peaks.forEach((peak, i) => {
      const h = Math.max(1, peak * (height - 2));
      ctx.fillRect(i * barWidth, mid - h / 2, Math.max(1, barWidth - 1), h);
    });
  };
  if (typeof OffscreenCanvas !== 'undefined') {
    try {
      const off = new OffscreenCanvas(width, height);
      const ctx = off.getContext('2d');
      if (ctx) {
        paint(ctx);
        target.clearRect(0, 0, width, height);
        target.drawImage(off, 0, 0);
        return;
      }
    } catch {
      // fall through to direct drawing
    }
  }
  paint(target);
}
