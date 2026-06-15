/**
 * Tiny bridge so the clip inspector (chroma-key swatch) can arm the eyedropper
 * that lives on the preview surface (which owns the WebGL canvas + readPixels).
 * The inspector calls requestEyedrop(cb); the preview registers an arm function
 * and invokes cb('#RRGGBB') on the next click, then disarms.
 */
type ArmFn = (cb: (hex: string) => void) => void;

let armFn: ArmFn | null = null;

export function registerEyedropper(fn: ArmFn | null): void {
  armFn = fn;
}

/** Returns true if the preview is mounted and the eyedropper was armed. */
export function requestEyedrop(cb: (hex: string) => void): boolean {
  if (!armFn) return false;
  armFn(cb);
  return true;
}

export function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}
