import type {
  StudioEffect,
  StudioEffectType,
  StudioLumetriEffect,
  StudioLutEffect,
  StudioChromaKeyEffect,
} from '@/lib/studioTypes';

/**
 * Effect registry — the single, typed source of truth for every effect and
 * transform parameter in Content Studio (EDL v2). It is consumed by:
 *   (a) the clip inspector controls (slider min/max/step/default + i18n label),
 *   (b) the WebGL2 compositor's uniform packer (preview), and
 *   (c) — by parameter NAME + RANGE parity — the Go ffmpeg emitter in
 *       internal/services/studio_export.go (which references this file by path).
 *
 * Adding a parameter here is the ONLY place a range/default is declared on the
 * TS side; everything else reads it. Keep the ranges identical to the Zod
 * schema in lib/studioTypes.ts and the clamps in studio.go.
 */

/** A numeric, slider-driven parameter. */
export interface EffectParam {
  /** field name on the effect/transform object (identical across the boundary) */
  key: string;
  /** i18n key under the `interface` namespace (contentStudio.*) */
  labelKey: string;
  min: number;
  max: number;
  step: number;
  default: number;
  /** optional unit hint for the readout (e.g. '°', 'st', '%') */
  unit?: string;
}

const param = (
  key: string,
  labelKey: string,
  min: number,
  max: number,
  step: number,
  def: number,
  unit?: string,
): EffectParam => ({ key, labelKey, min, max, step, default: def, unit });

/** Motion (Premiere "Motion" effect): position / scale / rotation. */
export const TRANSFORM_PARAMS: EffectParam[] = [
  param('x', 'contentStudio.inspector.motion.x', -1, 1, 0.005, 0),
  param('y', 'contentStudio.inspector.motion.y', -1, 1, 0.005, 0),
  param('scale', 'contentStudio.inspector.motion.scale', 0.01, 10, 0.01, 1),
  param('rotationDeg', 'contentStudio.inspector.motion.rotation', -360, 360, 1, 0, '°'),
];

/** Crop (normalized edge fractions of the source frame). */
export const CROP_PARAMS: EffectParam[] = [
  param('left', 'contentStudio.inspector.crop.left', 0, 0.95, 0.005, 0),
  param('top', 'contentStudio.inspector.crop.top', 0, 0.95, 0.005, 0),
  param('right', 'contentStudio.inspector.crop.right', 0, 0.95, 0.005, 0),
  param('bottom', 'contentStudio.inspector.crop.bottom', 0, 0.95, 0.005, 0),
];

/** Lumetri primary grade. */
export const LUMETRI_PARAMS: EffectParam[] = [
  param('exposure', 'contentStudio.inspector.lumetri.exposure', -3, 3, 0.05, 0, 'st'),
  param('contrast', 'contentStudio.inspector.lumetri.contrast', 0, 2, 0.01, 1),
  param('saturation', 'contentStudio.inspector.lumetri.saturation', 0, 2, 0.01, 1),
  param('temperature', 'contentStudio.inspector.lumetri.temperature', -100, 100, 1, 0),
  param('tint', 'contentStudio.inspector.lumetri.tint', -100, 100, 1, 0),
  param('vibrance', 'contentStudio.inspector.lumetri.vibrance', -2, 2, 0.05, 0),
];

/** LUT mix amount. */
export const LUT_PARAMS: EffectParam[] = [
  param('intensity', 'contentStudio.inspector.lut.intensity', 0, 1, 0.01, 1),
];

/** Chroma key (keyColor is a color swatch, handled outside the slider table). */
export const CHROMAKEY_PARAMS: EffectParam[] = [
  param('similarity', 'contentStudio.inspector.chromakey.similarity', 0.01, 1, 0.01, 0.1),
  param('blend', 'contentStudio.inspector.chromakey.blend', 0, 1, 0.01, 0.1),
  param('despill', 'contentStudio.inspector.chromakey.despill', 0, 1, 0.01, 0.5),
];

/** The slider params for a given effect type. */
export function effectParams(type: StudioEffectType): EffectParam[] {
  switch (type) {
    case 'lumetri':
      return LUMETRI_PARAMS;
    case 'lut':
      return LUT_PARAMS;
    case 'chromakey':
      return CHROMAKEY_PARAMS;
    default:
      return [];
  }
}

/** i18n label key for an effect type (used in the add-effect menu + list). */
export const EFFECT_LABEL_KEYS: Record<StudioEffectType, string> = {
  lumetri: 'contentStudio.inspector.effects.lumetri',
  lut: 'contentStudio.inspector.effects.lut',
  chromakey: 'contentStudio.inspector.effects.chromakey',
};

export const EFFECT_TYPES: StudioEffectType[] = ['lumetri', 'lut', 'chromakey'];

/**
 * Build a fresh effect of `type` with registry defaults. `id` is supplied by the
 * caller (store) so construction stays free of crypto/Date side effects here.
 */
export function makeDefaultEffect(type: StudioEffectType, id: string): StudioEffect {
  switch (type) {
    case 'lumetri': {
      const e: StudioLumetriEffect = {
        type: 'lumetri',
        id,
        enabled: true,
        exposure: 0,
        contrast: 1,
        saturation: 1,
        temperature: 0,
        tint: 0,
        vibrance: 0,
      };
      return e;
    }
    case 'lut': {
      const e: StudioLutEffect = { type: 'lut', id, enabled: true, lutAssetId: '', intensity: 1 };
      return e;
    }
    case 'chromakey': {
      const e: StudioChromaKeyEffect = {
        type: 'chromakey',
        id,
        enabled: true,
        keyColor: '#00FF00',
        similarity: 0.1,
        blend: 0.1,
        despill: 0.5,
      };
      return e;
    }
    default:
      throw new Error(`unknown effect type: ${type as string}`);
  }
}

/** Identity transform (matches studioTransformSchema defaults). */
export const IDENTITY_TRANSFORM = { x: 0, y: 0, scale: 1, rotationDeg: 0 } as const;
/** Zero crop (matches studioCropSchema defaults). */
export const ZERO_CROP = { left: 0, top: 0, right: 0, bottom: 0 } as const;
