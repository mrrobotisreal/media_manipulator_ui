# Darkroom preview↔export parity harness (part 13)

> **WORKSTATION-ONLY.** This suite runs on the headless Ubuntu 24.04
> workstation (NVIDIA GPUs) — never on the laptop and never as a laptop gate.
> The laptop only typechecks/lints/tests the harness code (`npm run typecheck`
> / `npm test` cover the comparator math and golden-EDL validity).

The regression harness from ADR ws/0002: every golden EDL in `goldens/` is
rendered through **both** pipelines —

1. **WebGL capture** — the real `GLCompositor` (the editor's accurate preview)
   in GPU-backed headless Chromium, frames read back in-page with
   `gl.readPixels` from the accum FBO (never `page.screenshot()`);
2. **ffmpeg export** — `cmd/parity-render` in `media_manipulator_api`, which
   drives the REAL export compiler (`SanitizeTracks` → `CollectExportRefs` →
   `AssembleExportPlan` → the same `-filter_complex` graph as a user export,
   losslessly encoded);

— and the frames are diffed (PSNR / mean CIEDE2000) against
`lib/studio/parityTolerances.ts`, calibrated by the passthrough noise floor
per `docs/content-studio/design/03-parity-tolerances.md`. Passes are quiet;
failures print metrics and write amplified diff PNGs under `out/<scenario>/`.

## One command

```bash
npm run parity                      # fixture check → capture → render → compare
npm run parity -- --fallback        # SwiftShader rasterizer (see below)
npm run parity -- --scenario lut_full,chromakey
npm run parity -- --skip-capture --skip-render   # re-compare existing frames
npm run parity -- --api-dir /path/to/media_manipulator_api
```

`--api-dir` (or `MM_API_DIR`) defaults to `../media_manipulator_api` next to
this repo. Exit code is non-zero on any parity failure; the machine-readable
result is `parity-harness/out/report.json`.

## Host prerequisites (bring-up checklist)

From research ticket 02 (`.scratch/darkroom-v3/issues/02-…md` — the authority
on this configuration):

1. **NVIDIA driver ≥ 525, headless flavor**: `nvidia-headless-<ver>` **plus
   `libnvidia-gl-<ver>`** — the commonly-forgotten package that ships
   `libEGL_nvidia.so.0` and the glvnd EGL ICD
   (`/usr/share/glvnd/egl_vendor.d/10_nvidia.json`). No X, no Xvfb — obsolete
   for this.
2. If Mesa competes for EGL, force NVIDIA:
   `export __EGL_VENDOR_LIBRARY_FILENAMES=/usr/share/glvnd/egl_vendor.d/10_nvidia.json`.
3. Sanity checks: `eglinfo -B` lists an NVIDIA EGL device; `nvidia-smi` shows
   the Chrome GPU process while a run is capturing.
4. **Chromium via Playwright** (full browser, not the headless shell):
   `npx playwright@<version> install --with-deps chromium`, where `<version>`
   **matches the `playwright-core` version in package.json** (the library
   resolves browsers by its pinned revision). This repo deliberately depends
   on `playwright-core` only, so `npm install` never downloads browsers on
   laptops/Vercel.
5. `ffmpeg` and `go` on PATH (the render leg shells out to both).
6. In Docker: `--gpus all`, `NVIDIA_DRIVER_CAPABILITIES=graphics,utility`, and
   `PARITY_CONTAINER=1` (adds `--no-sandbox --disable-dev-shm-usage`).
7. First run only: `./make-fixtures.sh` (generates the deterministic synthetic
   media fixtures; only `fixtures/fixture.cube` is committed).

Chromium launches with `--use-gl=angle --use-angle=gl-egl --enable-gpu
--ignore-gpu-blocklist --force-color-profile=srgb
--force-device-scale-factor=1` in new-headless mode, and the run **aborts
unless `UNMASKED_RENDERER_WEBGL` matches `/NVIDIA/`** (or `/SwiftShader/`
under `--fallback`) — Chromium falls back to software silently, and frames
from an unknown rasterizer must never be compared.

## SwiftShader fallback (`--fallback`)

`--use-angle=swiftshader --enable-unsafe-swiftshader`: deterministic pure-CPU
rendering, ~10–100× slower — fine for frame checks when the GPU path is
unavailable. It is NOT bit-identical to NVIDIA GL (filtering/rounding LSBs),
so fallback runs get extra tolerance headroom (−2 dB PSNR / +0.5 ΔE, see
`SWIFTSHADER_HEADROOM` in `imageMetrics.ts`).

## Pinning & golden-regeneration events

Rendering is deterministic per **(Chrome version, ANGLE backend, driver
version, GPU)** tuple — not across tuples. Pin Chromium (the Playwright
version) and the NVIDIA driver on the workstation, and treat **any upgrade of
either as a golden-regeneration event**: re-run the harness, expect the noise
floor to move, recalibrate thresholds per the protocol in
`docs/content-studio/design/03-parity-tolerances.md` (commit measured values
with a comment) before trusting failures as regressions. The same applies the
first time the suite ever runs: all thresholds are reasoned, not measured.

## How it works

| Leg | What | Where |
| --- | --- | --- |
| Goldens | Hand-authored v3 EDLs, one per tolerance row (+ the audio-ducking scene) | `goldens/*.json` (format: `goldenTypes.ts`) |
| Fixtures | Deterministic synthetic media (`testsrc2`/`testsrc`/green screen/sine), bt709-tagged | `make-fixtures.sh` → `fixtures/` |
| Capture | esbuild-bundled page importing the real `GLCompositor` + `previewEngine` resolver; driven by `playwright-core` | `capture/`, `run.ts` |
| Render | Go CLI reusing the real export compiler, lossless x264, frame extraction with `in_color_matrix=bt709` | `media_manipulator_api/cmd/parity-render` |
| Compare | PSNR + mean CIEDE2000 vs `parityTolerances.ts`, noise-floor calibrated | `compare.ts`, `imageMetrics.ts` |

Frame-timing contract: output frame `K` is evaluated at `t = K/fps` (what
ffmpeg's `fade`/`enable` expressions see) while fixture videos are seeked to
`t + 0.5/fps` so the browser displays exactly the source frame ffmpeg's
overlay holds at that pts. Pick `sampleFrames` at least one frame away from
clip boundaries.

**Policy scenarios** (goldens with a `projectRef` variant, e.g.
`effect_stack_first_per_type`) are compared project-vs-projectRef **within**
each pipeline — they assert a policy ("duplicate effects behave as
first-enabled-only"), not cross-pipeline closeness.

**Audio**: the `audio_ducking` golden proves the sidechain export graph
renders end-to-end and holds its (untouched) video frames to the passthrough
row. Audio parity itself has no numeric tolerance — audible-equivalence only,
per `design/03-parity-tolerances.md`.

## Adding a golden when shipping a new effect (parts 14+)

1. Add the tolerance row to `lib/studio/parityTolerances.ts` (reasoned
   threshold + note; `status: 'bounded'` if an intentional approximation
   remains), and the rationale to `design/03-parity-tolerances.md`.
2. Add `goldens/<row-id>.json`: minimal EDL exercising the effect at a known
   non-default value, `sampleFrames` away from clip boundaries. Reuse existing
   fixtures; if a new fixture is needed, extend `make-fixtures.sh` (synthetic
   sources only — no media binaries in git).
3. `npm test` on the laptop now enforces schema-validity and row coverage
   (`goldens.test.ts` fails if a tolerance row has no golden).
4. On the workstation: `npm run parity -- --scenario <row-id>`, then a full
   run; calibrate the new threshold against the measured value.

**Pending workstation follow-up (part 14)**: the transition rows
(`transition_dip`, `transition_wipe`, `transition_push`, `transition_slide`)
and the `audio_crossfade` golden have never run on the workstation — their
thresholds are reasoned, not measured. On the next harness run, calibrate the
four transition rows per the protocol above, and eyeball one exported wipe
(the animated-`crop` + varying-frame-size path through `overlay` is the one
part of the transition graphs ffmpeg has not yet proven end-to-end here).

## Layout

```
parity-harness/
  run.ts             orchestrator (fixtures → capture → render → compare)
  compare.ts         comparator + report.json + diff PNGs
  imageMetrics.ts    PSNR, sRGB→Lab, CIEDE2000, tolerance calibration (unit-tested)
  png.ts             dependency-free PNG encoder for diff artifacts
  goldenTypes.ts     golden-EDL file format (shared with the Go CLI)
  goldens/           one JSON per parity scenario
  fixtures/          fixture.cube (committed) + generated media (gitignored)
  capture/           capture page: real GLCompositor + layer builder + stub
  out/               run artifacts (gitignored): frames, diffs, report.json
```

The harness is excluded from the Next build and the root tsconfig;
`npm run typecheck` chains `tsc --noEmit -p parity-harness/tsconfig.json`.
