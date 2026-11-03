/** Canvas pan/zoom maths (pure). `zoom` is CSS px per image px; `x`,`y` the image's top-left in the viewport. */
export interface View {
  zoom: number;
  x: number;
  y: number;
}
export const MIN_ZOOM = 0.02;
export const MAX_ZOOM = 32;

export const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

/** Fit the image inside the viewport with a margin, centred. Never upscales beyond 1 when `noUpscale`. */
export function fitView(vw: number, vh: number, iw: number, ih: number, margin = 16, noUpscale = false): View {
  if (vw <= 0 || vh <= 0 || iw <= 0 || ih <= 0) return { zoom: 1, x: 0, y: 0 };
  let zoom = Math.min((vw - margin * 2) / iw, (vh - margin * 2) / ih);
  if (noUpscale) zoom = Math.min(1, zoom);
  zoom = clampZoom(zoom);
  return { zoom, x: (vw - iw * zoom) / 2, y: (vh - ih * zoom) / 2 };
}

/** Zoom so that image point under (cx, cy) stays put. */
export function zoomAt(v: View, cx: number, cy: number, factor: number): View {
  const zoom = clampZoom(v.zoom * factor);
  const k = zoom / v.zoom;
  return { zoom, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k };
}

export const panBy = (v: View, dx: number, dy: number): View => ({ ...v, x: v.x + dx, y: v.y + dy });

/** Viewport point → image pixel (normalized 0..1 as well). */
export function toImage(v: View, px: number, py: number, iw: number, ih: number) {
  const ix = (px - v.x) / v.zoom;
  const iy = (py - v.y) / v.zoom;
  return { ix, iy, nx: ix / iw, ny: iy / ih, inside: ix >= 0 && iy >= 0 && ix < iw && iy < ih };
}

/** Distance and midpoint of two pointers (pinch). */
export function pinch(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { dist: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
}
