import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { PARITY_TOLERANCES, parityTolerance, type ParityTolerance } from '../lib/studio/parityTolerances';
import {
  PASSTHROUGH_SANITY_PSNR,
  SWIFTSHADER_HEADROOM,
  diffImage,
  evaluateMetric,
  meanDeltaE,
  psnr,
  type FrameBuf,
  type NoiseFloor,
} from './imageMetrics';
import { encodePng } from './png';
import type { GoldenFile } from './goldenTypes';

/**
 * Comparator leg of the parity harness: diffs the WebGL captures against the
 * ffmpeg frames per golden scenario, calibrated by the passthrough noise floor
 * (design/03-parity-tolerances.md "Calibration protocol"). Policy scenarios
 * (goldens with `projectRef`) are compared project-vs-projectRef WITHIN each
 * pipeline instead. Passes are quiet; failures print metrics and write
 * amplified diff PNGs next to the frames.
 */

export interface CompareOptions {
  /** parity-harness directory (goldens live in ./goldens). */
  harnessDir: string;
  /** Output directory that run.ts / cmd/parity-render wrote frames into. */
  outDir: string;
  /** SwiftShader fallback mode → extra tolerance headroom. */
  fallback: boolean;
  /** Optional scenario-id filter. */
  scenarios?: string[];
}

export interface FrameResult {
  frame: number;
  comparison: 'cross' | 'webgl-policy' | 'ffmpeg-policy';
  psnr: number;
  deltaE: number;
  pass: boolean;
}

export interface ScenarioResult {
  id: string;
  toleranceId: string;
  metric: ParityTolerance['metric'];
  threshold: number;
  effectiveThreshold: number;
  pass: boolean;
  frames: FrameResult[];
  error?: string;
}

export interface CompareReport {
  fallback: boolean;
  noiseFloor: NoiseFloor;
  passthroughSanityPsnr: number;
  scenarios: ScenarioResult[];
  pass: boolean;
  uncoveredToleranceIds: string[];
}

function loadGoldens(harnessDir: string, filter?: string[]): Map<string, GoldenFile> {
  const dir = join(harnessDir, 'goldens');
  const out = new Map<string, GoldenFile>();
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
    const id = basename(f, '.json');
    if (filter && filter.length > 0 && !filter.includes(id)) continue;
    out.set(id, JSON.parse(readFileSync(join(dir, f), 'utf8')) as GoldenFile);
  }
  return out;
}

function readFrame(path: string, width: number, height: number): FrameBuf {
  const data = readFileSync(path);
  if (data.length !== width * height * 4) {
    throw new Error(`${path}: expected ${width * height * 4} RGBA bytes, got ${data.length}`);
  }
  return { width, height, data };
}

function comparePair(
  outDir: string,
  id: string,
  golden: GoldenFile,
  frame: number,
  aLeg: string,
  bLeg: string,
  comparison: FrameResult['comparison'],
  row: ParityTolerance,
  floor: NoiseFloor,
  fallback: boolean,
): FrameResult {
  const { width, height } = golden.project;
  const a = readFrame(join(outDir, id, aLeg, `f${frame}.rgba`), width, height);
  const b = readFrame(join(outDir, id, bLeg, `f${frame}.rgba`), width, height);
  const p = psnr(a, b);
  const dE = meanDeltaE(a, b);
  const value = row.metric === 'psnr' ? p : dE;
  const { pass } = evaluateMetric(row, value, floor, fallback);
  if (!pass) {
    const diff = diffImage(a, b);
    writeFileSync(join(outDir, id, `diff_${comparison}_f${frame}.png`), encodePng(width, height, diff.data));
  }
  return { frame, comparison, psnr: p, deltaE: dE, pass };
}

/** Neutral floor for within-pipeline policy comparisons (no cross-pipeline noise). */
const POLICY_FLOOR: NoiseFloor = { psnr: 40, deltaE: 1 };

export function runCompare(opts: CompareOptions): CompareReport {
  const goldens = loadGoldens(opts.harnessDir, opts.scenarios);
  if (goldens.size === 0) throw new Error('no golden scenarios matched');

  // 1) Calibrate the noise floor from the passthrough scenario (protocol §1).
  let floor: NoiseFloor = { psnr: 40, deltaE: 1 };
  const passthrough = goldens.get('passthrough');
  const passthroughRow = parityTolerance('passthrough');
  if (passthrough && passthroughRow) {
    let pSum = 0;
    let dSum = 0;
    for (const frame of passthrough.sampleFrames) {
      const { width, height } = passthrough.project;
      const a = readFrame(join(opts.outDir, 'passthrough', 'webgl', `f${frame}.rgba`), width, height);
      const b = readFrame(join(opts.outDir, 'passthrough', 'ffmpeg', `f${frame}.rgba`), width, height);
      pSum += psnr(a, b);
      dSum += meanDeltaE(a, b);
    }
    floor = { psnr: pSum / passthrough.sampleFrames.length, deltaE: dSum / passthrough.sampleFrames.length };
    console.log(
      `noise floor (passthrough): PSNR ${floor.psnr.toFixed(2)} dB, mean ΔE2000 ${floor.deltaE.toFixed(3)}`,
    );
  } else {
    console.warn('passthrough scenario not in this run — using the assumed noise floor (40 dB / ΔE 1.0)');
  }

  // 2) Per-scenario comparison.
  const results: ScenarioResult[] = [];
  for (const [id, golden] of goldens) {
    const toleranceId = golden.toleranceId ?? id;
    const row = parityTolerance(toleranceId);
    if (!row) {
      results.push({
        id,
        toleranceId,
        metric: 'psnr',
        threshold: NaN,
        effectiveThreshold: NaN,
        pass: false,
        frames: [],
        error: `no tolerance row '${toleranceId}' in parityTolerances.ts`,
      });
      continue;
    }
    const isPolicy = !!golden.projectRef;
    const scenarioFloor = isPolicy ? POLICY_FLOOR : floor;
    const scenarioFallback = isPolicy ? false : opts.fallback;
    const frames: FrameResult[] = [];
    let error: string | undefined;
    try {
      for (const frame of golden.sampleFrames) {
        if (isPolicy) {
          frames.push(
            comparePair(opts.outDir, id, golden, frame, 'webgl', 'webgl_ref', 'webgl-policy', row, scenarioFloor, false),
            comparePair(opts.outDir, id, golden, frame, 'ffmpeg', 'ffmpeg_ref', 'ffmpeg-policy', row, scenarioFloor, false),
          );
        } else {
          frames.push(
            comparePair(opts.outDir, id, golden, frame, 'webgl', 'ffmpeg', 'cross', row, scenarioFloor, scenarioFallback),
          );
        }
      }
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }

    // The passthrough scenario IS the floor — hold it to the absolute sanity
    // bound instead of a threshold derived from itself.
    let pass: boolean;
    let effective: number;
    if (id === 'passthrough') {
      effective = PASSTHROUGH_SANITY_PSNR - (opts.fallback ? SWIFTSHADER_HEADROOM.psnr : 0);
      pass = !error && frames.every((f) => f.psnr >= effective);
      for (const f of frames) f.pass = f.psnr >= effective;
    } else {
      effective = evaluateMetric(row, row.metric === 'psnr' ? Infinity : 0, scenarioFloor, scenarioFallback).effective;
      pass = !error && frames.length > 0 && frames.every((f) => f.pass);
    }
    results.push({
      id,
      toleranceId,
      metric: row.metric,
      threshold: row.threshold,
      effectiveThreshold: effective,
      pass,
      frames,
      error,
    });
  }

  // 3) Coverage: every tolerance row should have at least one golden (only
  //    meaningful on unfiltered runs).
  const covered = new Set([...goldens.values()].map((g, i) => g.toleranceId ?? [...goldens.keys()][i]));
  const uncovered =
    opts.scenarios && opts.scenarios.length > 0
      ? []
      : PARITY_TOLERANCES.map((r) => r.id).filter((rid) => !covered.has(rid));

  // 4) Console table: passes quiet, failures loud.
  for (const r of results) {
    const worst =
      r.metric === 'psnr'
        ? Math.min(...r.frames.map((f) => f.psnr))
        : Math.max(...r.frames.map((f) => f.deltaE));
    const bound = r.metric === 'psnr' ? `≥ ${r.effectiveThreshold.toFixed(1)} dB` : `≤ ${r.effectiveThreshold.toFixed(2)} ΔE`;
    if (r.pass) {
      console.log(`  ok   ${r.id}  (${r.metric} ${Number.isFinite(worst) ? worst.toFixed(2) : '∞'}, ${bound})`);
    } else {
      console.error(`  FAIL ${r.id}  (${r.metric} ${bound})${r.error ? ` — ${r.error}` : ''}`);
      for (const f of r.frames.filter((f) => !f.pass)) {
        console.error(
          `       frame ${f.frame} [${f.comparison}] PSNR ${f.psnr.toFixed(2)} dB, mean ΔE2000 ${f.deltaE.toFixed(3)} → diff_${f.comparison}_f${f.frame}.png`,
        );
      }
    }
  }
  for (const missing of uncovered) {
    console.error(`  FAIL coverage: tolerance row '${missing}' has no golden EDL`);
  }

  const report: CompareReport = {
    fallback: opts.fallback,
    noiseFloor: floor,
    passthroughSanityPsnr: PASSTHROUGH_SANITY_PSNR,
    scenarios: results,
    pass: results.every((r) => r.pass) && uncovered.length === 0,
    uncoveredToleranceIds: uncovered,
  };
  mkdirSync(opts.outDir, { recursive: true });
  const reportPath = join(opts.outDir, 'report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  console.log(`${report.pass ? 'PARITY OK' : 'PARITY FAILURES'} — report: ${reportPath}`);
  return report;
}
