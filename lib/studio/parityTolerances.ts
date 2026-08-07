/**
 * parityTolerances — the machine-readable preview↔export parity contract
 * (part 12; ADR ws/0002). The part-13 harness renders each golden-EDL scenario
 * through BOTH pipelines (headless WebGL capture vs ffmpeg frame) and asserts
 * the metric against these thresholds. The prose companion with per-divergence
 * rationale lives at docs/content-studio/design/03-parity-tolerances.md.
 *
 * INITIAL VALUES ARE REASONED, NOT MEASURED: every threshold below must be
 * calibrated on the workstation against the identity-EDL noise floor (render
 * the SAME passthrough EDL through both pipelines; the measured PSNR is the
 * ceiling any effect scenario can hope for) — see research ticket 02's Answer
 * (.scratch/darkroom-v3/issues/02-…md). Until calibrated, treat a failure
 * within ~2 dB / ~0.5 ΔE of the threshold as "recalibrate", not "regression".
 */

/** psnr: minimum acceptable dB (higher = closer). deltaE: maximum acceptable mean CIEDE2000 (lower = closer). */
export type ParityMetric = 'psnr' | 'deltaE';

export type ParityStatus =
  /** both sides state and implement the same math; residual = quantization/colorspace roundtrips */
  | 'closed'
  /** a known, intentional approximation remains — the threshold carries extra headroom */
  | 'bounded';

export interface ParityTolerance {
  /** Golden-EDL scenario id — the part-13 harness names its EDL fixtures after these. */
  id: string;
  metric: ParityMetric;
  threshold: number;
  status: ParityStatus;
  /** What dominates the residual error (why the threshold is where it is). */
  note: string;
}

export const PARITY_TOLERANCES: readonly ParityTolerance[] = [
  {
    id: 'passthrough',
    metric: 'psnr',
    threshold: 40,
    status: 'closed',
    note: 'noise floor: yuv420p 4:2:0 roundtrip + scaler kernel differences; calibration anchor for every other row',
  },
  {
    id: 'transform_position_scale',
    metric: 'psnr',
    threshold: 38,
    status: 'closed',
    note: 'same transform spec both sides; resampling kernels differ (GL bilinear vs ffmpeg scaler)',
  },
  {
    id: 'transform_rotation',
    metric: 'psnr',
    threshold: 34,
    status: 'bounded',
    note: 'edge antialiasing differs (GL quad sampling vs ffmpeg rotate bilinear + alpha pad)',
  },
  {
    id: 'crop',
    metric: 'psnr',
    threshold: 40,
    status: 'closed',
    note: 'exact spec both sides; residual = passthrough noise floor',
  },
  {
    id: 'opacity_dissolve',
    metric: 'psnr',
    threshold: 38,
    status: 'closed',
    note: 'linear alpha both sides by spec; straight-alpha overlay vs shader mix on subsampled chroma',
  },
  {
    id: 'eq_adjustments',
    metric: 'psnr',
    threshold: 36,
    status: 'closed',
    note: 'same decoupled luma/chroma math; luma coefficient ambiguity (BT.601 vs 709 tagging) at high saturation',
  },
  {
    id: 'lumetri_exposure',
    metric: 'psnr',
    threshold: 38,
    status: 'closed',
    note: 'c·2^exposure both sides; residual = clamp + 8-bit quantization',
  },
  {
    id: 'lumetri_temp_tint',
    metric: 'deltaE',
    threshold: 2.5,
    status: 'closed',
    note: 'shader mirrors colorbalance midtone curve exactly; residual = RGB roundtrip quantization',
  },
  {
    id: 'lumetri_contrast_saturation',
    metric: 'psnr',
    threshold: 36,
    status: 'closed',
    note: 'eq-equivalent math both sides; same luma-coefficient ambiguity as eq_adjustments',
  },
  {
    id: 'lumetri_vibrance',
    metric: 'deltaE',
    threshold: 3,
    status: 'closed',
    note: "shader mirrors vf_vibrance (incl. its swapped r/b luma weights); float vs 8-bit lerp rounding",
  },
  {
    id: 'lut_full',
    metric: 'psnr',
    threshold: 35,
    status: 'closed',
    note: 'trilinear both sides; GL RGB8 3D texture quantizes LUT entries vs ffmpeg float lattice',
  },
  {
    id: 'lut_intensity',
    metric: 'psnr',
    threshold: 35,
    status: 'closed',
    note: 'linear mix(c, graded, intensity) both sides (export orientation fixed in part 12)',
  },
  {
    id: 'chromakey',
    metric: 'psnr',
    threshold: 30,
    status: 'bounded',
    note: 'UV-distance key both sides, but ffmpeg keys on 4:2:0-subsampled chroma vs full-res shader — edge fringe differs',
  },
  {
    id: 'blend_multiply',
    metric: 'psnr',
    threshold: 33,
    status: 'closed',
    note: 'per-RGB-channel blend + alpha-windowed merge both sides; residual = gbrp↔yuv roundtrips',
  },
  {
    id: 'blend_screen',
    metric: 'psnr',
    threshold: 33,
    status: 'closed',
    note: 'same as blend_multiply',
  },
  {
    id: 'blend_overlay',
    metric: 'psnr',
    threshold: 32,
    status: 'bounded',
    note: 'branch point 128/255 (ffmpeg) vs 0.5 (shader) splits a hairline band at the midtone boundary',
  },
  {
    id: 'blend_lighten',
    metric: 'psnr',
    threshold: 33,
    status: 'closed',
    note: 'same as blend_multiply',
  },
  {
    id: 'blend_darken',
    metric: 'psnr',
    threshold: 33,
    status: 'closed',
    note: 'same as blend_multiply',
  },
  {
    id: 'blend_addition',
    metric: 'psnr',
    threshold: 33,
    status: 'closed',
    note: 'same as blend_multiply',
  },
  {
    id: 'blend_difference',
    metric: 'psnr',
    threshold: 33,
    status: 'closed',
    note: 'same as blend_multiply',
  },
  {
    id: 'effect_stack_first_per_type',
    metric: 'psnr',
    threshold: 40,
    status: 'closed',
    note: 'policy check: an EDL with duplicate same-type effects must render identically to the first-enabled-only EDL on both sides',
  },
] as const;

export function parityTolerance(id: string): ParityTolerance | undefined {
  return PARITY_TOLERANCES.find((t) => t.id === id);
}
