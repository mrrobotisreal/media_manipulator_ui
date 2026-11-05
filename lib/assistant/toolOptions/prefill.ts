/**
 * MM116a: friendly deep-link options -> the form's own state shape. One function per form
 * family; each returns a deep-partial of that form's `defaultValues` (or of a focused panel's
 * initial state), so the form code only merges it over the defaults it already computes.
 * `prefill.test.ts` runs every mapping through the form's real Zod (v3) resolver at the bounds
 * of each range, so a value the schema accepts can never produce a form state the form rejects.
 */
import type { OptionValues } from './codec';

type Dict = Record<string, unknown>;

const isDict = (v: unknown): v is Dict => !!v && typeof v === 'object' && !Array.isArray(v);

/** Deep merge: `over` wins, nested objects merge, `undefined` never overwrites. */
export function mergeDefaults<T extends Dict>(base: T, over: Dict | undefined): T {
  if (!over) return base;
  const out: Dict = { ...base };
  for (const [k, v] of Object.entries(over)) {
    if (v === undefined) continue;
    out[k] = isDict(v) && isDict(out[k]) ? mergeDefaults(out[k] as Dict, v) : v;
  }
  return out as T;
}

const drop = (o: Dict): Dict => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

export function imageFormDefaults(o: OptionValues): Dict {
  const ai = drop({
    faceMode: o.faceMode,
    upscaleScale: o.upscaleScale,
    textDetect: o.textDetect,
    textRedaction: o.textRedaction,
  });
  const overlay = drop({ text: o.overlayText, size: o.textSize, color: o.textColor, gravity: o.textGravity });
  return drop({
    format: o.format,
    quality: o.quality,
    width: o.width,
    height: o.height,
    filter: o.filter,
    metadataMode: o.metadataMode,
    textOverlay: Object.keys(overlay).length ? overlay : undefined,
    vectorize: o.vectorizeThreshold !== undefined ? { threshold: o.vectorizeThreshold } : undefined,
    ai: Object.keys(ai).length ? ai : undefined,
  });
}

export function videoFormDefaults(o: OptionValues): Dict {
  const gif = drop({ width: o.gifWidth, fps: o.gifFps, colors: o.gifColors });
  const visual = drop({ brightness: o.brightness, contrast: o.contrast, saturation: o.saturation });
  const transform = drop({ flipHorizontal: o.flipHorizontal, flipVertical: o.flipVertical });
  const temporal = drop({
    reverse: o.reverse,
    frameRate: o.targetFps !== undefined ? { target: o.targetFps, interpolation: false } : undefined,
    stabilization: o.stabilize !== undefined ? { enabled: o.stabilize } : undefined,
  });
  const ai = o.aiTargetFps !== undefined ? { frameInterpolation: { targetFps: o.aiTargetFps } } : undefined;
  return drop({
    format: o.format,
    quality: o.quality,
    width: o.width,
    height: o.height,
    preserveAspectRatio: o.preserveAspectRatio,
    speed: o.speed,
    gif: Object.keys(gif).length ? gif : undefined,
    visualEffects: Object.keys(visual).length ? visual : undefined,
    transform: Object.keys(transform).length ? transform : undefined,
    temporal: Object.keys(temporal).length ? temporal : undefined,
    ai,
  });
}

export function audioFormDefaults(o: OptionValues): Dict {
  const basic = drop({
    normalize: o.normalize,
    fadeIn: o.fadeIn,
    fadeOut: o.fadeOut,
    equalizer: o.equalizerPreset !== undefined ? { enabled: o.equalizerPreset !== 'none', preset: o.equalizerPreset } : undefined,
  });
  return drop({
    format: o.format,
    bitrate: o.bitrate,
    sampleRate: o.sampleRate,
    channels: o.channels,
    speed: o.speed,
    volume: o.volume,
    basicProcessing: Object.keys(basic).length ? basic : undefined,
    timeBasedEffects:
      o.reverbType !== undefined ? { reverb: { enabled: o.reverbType !== 'none', type: o.reverbType } } : undefined,
    advanced:
      o.pitchSemitones !== undefined ? { pitchShift: { enabled: o.pitchSemitones !== 0, semitones: o.pitchSemitones } } : undefined,
  });
}

/** Trim range an audio/video converter page opens with (start/end in seconds). */
export function trimOf(o: OptionValues): { startTime: number; endTime: number } | undefined {
  const s = typeof o.trimStart === 'number' ? o.trimStart : undefined;
  const e = typeof o.trimEnd === 'number' ? o.trimEnd : undefined;
  if (s === undefined && e === undefined) return undefined;
  if (e === undefined || e <= (s ?? 0)) return undefined;
  return { startTime: s ?? 0, endTime: e };
}

export function pdfFormDefaults(o: OptionValues): Dict {
  return drop({ format: o.format, pageSelection: o.pageSelection, dpi: o.dpi, quality: o.quality });
}

/** Compressor: level wins; `crf` is sent as the exact override. */
export function compressorState(o: OptionValues): { level?: string; crf?: number; format?: string; codec?: string; resolution?: string; stripAudio?: boolean } {
  return drop({ level: o.level, crf: o.crf, format: o.format, codec: o.codec, resolution: o.resolution, stripAudio: o.stripAudio }) as never;
}
