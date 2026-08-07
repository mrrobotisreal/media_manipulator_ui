import type { StudioAudioConfig, StudioTrack } from '../lib/studioTypes';

/**
 * The golden-EDL file format shared by all three harness legs (capture page,
 * cmd/parity-render, comparator). One JSON per parity scenario in ./goldens/,
 * named `<scenarioId>.json`.
 */

export interface GoldenAsset {
  /** Fixture file name inside parity-harness/fixtures/ (see make-fixtures.sh). */
  file: string;
  kind: 'video' | 'audio' | 'lut';
  hasAudio?: boolean;
}

export interface GoldenProject {
  fps: number;
  width: number;
  height: number;
  tracks: StudioTrack[];
  audio?: StudioAudioConfig;
}

export interface GoldenFile {
  /** Row id in lib/studio/parityTolerances.ts (defaults to the file stem). */
  toleranceId?: string;
  description: string;
  /**
   * 0-based OUTPUT frame indices to sample. Pick frames at least one frame
   * away from clip boundaries — the two pipelines round boundary frames
   * differently, which is a sampling artifact, not a parity failure.
   */
  sampleFrames: number[];
  project: GoldenProject;
  /**
   * Optional second variant for POLICY scenarios (e.g.
   * effect_stack_first_per_type): when present, the comparator diffs
   * project-vs-projectRef WITHIN each pipeline instead of across pipelines.
   */
  projectRef?: GoldenProject;
  assets: Record<string, GoldenAsset>;
}

export type GoldenVariantKey = 'project' | 'projectRef';
