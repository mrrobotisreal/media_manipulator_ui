/**
 * Meter bus (Darkroom v3 part 19): the preview surface owns the Web Audio
 * graph, the mixer drawer owns the meter UI; this tiny module is the seam.
 * The preview publishes read functions (no per-frame allocation); the mixer
 * polls them at ~20 Hz from rAF only while the drawer is open.
 */
export interface MeterReading {
  /** Peak dBFS per channel, floor -60. */
  l: number;
  r: number;
}

export interface MeterSource {
  /** null when the track has no audio chain yet (nothing has played through it). */
  track: (trackId: string) => MeterReading | null;
  master: () => MeterReading | null;
}

let source: MeterSource | null = null;

export function setMeterSource(s: MeterSource | null): void {
  source = s;
}

export function getMeterSource(): MeterSource | null {
  return source;
}
