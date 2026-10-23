'use client';

import { useState, type CSSProperties } from 'react';

export type Zoom = 'fit' | '1x' | '2x';

export const CHECKERBOARD =
  'bg-[length:16px_16px] bg-[position:0_0,8px_8px] bg-[image:conic-gradient(var(--surface-3)_25%,transparent_0_50%,var(--surface-3)_0_75%,transparent_0)]';

/** Zoom (fit / 1x / 2x) and the transparency-grid toggle, shared by ImageViewer and the compare views. */
export function useZoom(initial: Zoom = 'fit') {
  const [zoom, setZoom] = useState<Zoom>(initial);
  const [grid, setGrid] = useState(false);
  return { zoom, setZoom, grid, setGrid, imageStyle: zoomStyle(zoom) };
}

export function zoomStyle(zoom: Zoom): CSSProperties | undefined {
  return zoom === 'fit' ? undefined : { transform: `scale(${zoom === '2x' ? 2 : 1})`, transformOrigin: 'center', imageRendering: 'auto' };
}
