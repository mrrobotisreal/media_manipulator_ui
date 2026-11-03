'use client';

/**
 * Canvas-tool state for the Aperture editor (MM98): which tool owns the
 * pointer, the mask view, the brush settings, and which layer/component the
 * mask tools edit. Not part of the document and not undoable.
 */
import { create } from 'zustand';

import { DEFAULT_BRUSH, type BrushSettings } from '@/lib/photo/brushEngine';
import type { MaskView } from '@/lib/photo/gl/maskPlan';
import { nextMaskView } from '@/lib/photo/gl/maskPlan';
import type { AspectPreset } from '@/lib/photo/toolMath';

export type ToolId = 'none' | 'gradient' | 'radial' | 'brush' | 'eyedropper' | 'crop' | 'straighten' | 'perspective' | 'heal' | 'redEye';

export interface ToolState {
  tool: ToolId;
  maskView: MaskView;
  brush: BrushSettings;
  /** Layer whose mask the mask tools edit (usually the selection). */
  maskLayerId: string | null;
  /** Index of the selected component inside that mask, or -1. */
  component: number;
  aspect: AspectPreset;
  /** Red-eye radius as a fraction of the long side (default 2 %). */
  redEyeRadius: number;
  /** Rule-of-thirds grid (shown while dragging the straighten slider and with the crop tool). */
  grid: boolean;
  /** Re-compute the largest inner crop after rotate/perspective edits. */
  autoCrop: boolean;
  setGrid: (g: boolean) => void;
  setAutoCrop: (a: boolean) => void;
  setTool: (t: ToolId) => void;
  toggleTool: (t: ToolId) => void;
  cycleMaskView: () => void;
  setMaskView: (v: MaskView) => void;
  setBrush: (p: Partial<BrushSettings>) => void;
  setMaskLayer: (id: string | null) => void;
  setComponent: (i: number) => void;
  setAspect: (a: AspectPreset) => void;
  setRedEyeRadius: (r: number) => void;
}

export const createToolStore = () =>
  create<ToolState>((set) => ({
    tool: 'none',
    maskView: 'off',
    brush: DEFAULT_BRUSH,
    maskLayerId: null,
    component: -1,
    aspect: 'free',
    redEyeRadius: 0.02,
    grid: false,
    autoCrop: false,
    setGrid: (grid) => set({ grid }),
    setAutoCrop: (autoCrop) => set({ autoCrop }),
    setTool: (tool) => set({ tool }),
    toggleTool: (t) => set((s) => ({ tool: s.tool === t ? 'none' : t })),
    cycleMaskView: () => set((s) => ({ maskView: nextMaskView(s.maskView) })),
    setMaskView: (maskView) => set({ maskView }),
    setBrush: (p) => set((s) => ({ brush: { ...s.brush, ...p } })),
    setMaskLayer: (maskLayerId) => set((s) => (s.maskLayerId === maskLayerId ? {} : { maskLayerId, component: -1 })),
    setComponent: (component) => set({ component }),
    setAspect: (aspect) => set({ aspect }),
    setRedEyeRadius: (redEyeRadius) => set({ redEyeRadius: Math.min(0.2, Math.max(0.002, redEyeRadius)) }),
  }));

export const useToolStore = createToolStore();
