/** Client-side `.cube` intake for the LUT panel: size + parse checks, then the text goes into the doc. */
import { PHOTO_MAX_LUT_BYTES } from '@/lib/photo/photoTypes';
import { parseCubeLut } from '@/lib/studio/lutParser';

export type LutCheck = { ok: true; text: string; size: number } | { ok: false; reason: 'tooBig' | 'invalid' };

export function checkCubeText(text: string, byteLength = text.length): LutCheck {
  if (byteLength > PHOTO_MAX_LUT_BYTES) return { ok: false, reason: 'tooBig' };
  try {
    const parsed = parseCubeLut(text);
    if (parsed.size > 65) return { ok: false, reason: 'invalid' };
    return { ok: true, text, size: parsed.size };
  } catch {
    return { ok: false, reason: 'invalid' };
  }
}

export async function readCubeFile(file: File): Promise<LutCheck> {
  if (file.size > PHOTO_MAX_LUT_BYTES) return { ok: false, reason: 'tooBig' };
  return checkCubeText(await file.text(), file.size);
}
