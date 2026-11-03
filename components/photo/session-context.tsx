'use client';

import * as React from 'react';

import type { PhotoCapabilities } from '@/lib/photo/projectsApi';
import type { FloatImage } from '@/lib/photo/colorMath';

/** What the MM98 panels need from the editor shell (kept out of the document and the store). */
export interface PhotoSession {
  /** Server project id, or null for the browser-local (guest) project. */
  projectId: string | null;
  signedIn: boolean;
  capabilities: PhotoCapabilities | null;
  /** Displayed-source size (post-geometry size is derived from the doc). */
  source: { width: number; height: number } | null;
  /** The bytes the stateless routes get: the current local base, else the original. */
  currentFile: () => { blob: Blob; name: string } | null;
  /** A ≤ 64 px float thumbnail of the source (mask thumbnails, luminosity backdrop). */
  thumb: FloatImage | null;
  /** The renderer's current histogram (luminosity backdrop). */
  histogram: { luma: Uint32Array; max: number } | null;
  /** Ask the editor to arm the canvas eyedropper for the colour-range mask. */
  requestPick: () => void;
  /** Latest eyedropper result for the colour-range mask (n changes per pick). */
  picked: { r: number; g: number; b: number; n: number; shift: boolean } | null;
  /** Persist a guest subject-mask PNG with the local project. */
  keepLocalMask: (ref: string, blob: Blob) => void;
  /** Heal finished: swap the source to the new base (the editor owns decode + storage). */
  onHealed: (outcome: import('@/lib/photo/aiApi').HealOutcome) => Promise<void>;
}

const Ctx = React.createContext<PhotoSession | null>(null);
export const PhotoSessionProvider = Ctx.Provider;
export function usePhotoSession(): PhotoSession {
  const v = React.useContext(Ctx);
  if (!v) throw new Error('usePhotoSession outside PhotoSessionProvider');
  return v;
}
export const useOptionalPhotoSession = (): PhotoSession | null => React.useContext(Ctx);
