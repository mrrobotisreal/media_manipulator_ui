# Content Studio v2 — Premiere-parity upgrade

This document summarizes the EDL v2 contract, the effect registry, the
preview↔export parity rules, and the known divergences introduced by the
WebGL2 compositor + audio suite + auto-captions work.

## 1. EDL v2 contract

Zod is the single source of truth (`lib/studioTypes.ts`); the Go structs in
`internal/models/studio.go` mirror it byte-for-byte (camelCase JSON). All v2
fields are **optional / additive** — v1 projects load, render, and export
identically (guarded by `TestSanitizeTracks_V1NoOp` and
`TestBuildMultiTrackExportArgs_LegacyV1Regression`).

**Clip** gains (all optional, absent = no effect):

| field | meaning | range |
|---|---|---|
| `transform` | `{x,y,scale,rotationDeg}` — normalized center offset, uniform scale, clockwise rotation | x/y −1..1, scale 0.01..10, rot −360..360 |
| `crop` | normalized edge fractions of the **source** | each 0..1, left+right<1, top+bottom<1 |
| `blendMode` | `normal\|multiply\|screen\|overlay\|lighten\|darken\|addition\|difference` | — |
| `effects[]` | ordered stack, discriminated on `type`: `lumetri` / `lut` / `chromakey` (each has `id`, `enabled`) | see registry |
| `volumeKeyframes[]` | `{t,gain}` — `t` is seconds from the clip's timeline start; overrides flat `volume` | gain 0..2 |
| `pan` | stereo balance | −1..1 |

`volume` ceiling raised **1.0 → 2.0** (+6dB), matching Premiere.

**Project** gains: `schemaVersion` (=2), `captions[]` (`{id,startSeconds,endSeconds,text}`),
`captionStyle`, `captionsEnabled`, `audio` (ducking config).

### Persistence

- `studio_projects.tracks` (JSONB) — unchanged.
- `studio_projects.captions` (JSONB) — **new v2 sidecar** holding
  `{schemaVersion, cues, style, enabled, audio}`. Kept separate from `tracks`
  so the caption-generate job (`SaveCaptions` → `jsonb_set '{cues}'`) and the
  autosave PUT never clobber each other. Migration `20260614002`.
- `studio_assets.s3_key_peaks` (TEXT) — waveform peaks key. Migration `20260614001`.
- `media_kind` CHECK relaxed to allow `'lut'`. Migration `20260614003`.

`normalizeProject()` (TS) upgrades v1→v2 in memory on load; the repo stamps
`schemaVersion=2` on read. `models.SanitizeTracks` / `SanitizeCaptions` /
`SanitizeCaptionStyle` / `SanitizeAudioConfig` clamp every field on save **and**
before export, so the export compiler trusts the plan.

## 2. Effect registry

`lib/studio/effectRegistry.ts` is the ONLY place a parameter's range/default is
declared on the TS side. It feeds (a) the inspector sliders, (b) the WebGL
uniform packer, and (c) — by name + range parity — the Go ffmpeg emitter
(`internal/services/studio_export.go`, which references the registry by path).
Adding a parameter = edit the registry + the Zod schema + the Go clamp.

## 3. Preview ↔ export parity (part 12: closed or bounded)

The **server render is authoritative** (ADR ws/0002); the WebGL2 preview
implements the SAME stated math, and the residual is bounded per effect by the
machine-readable tolerance table `lib/studio/parityTolerances.ts` (enforced by
the part-13 workstation harness; prose rationale + calibration protocol in
`docs/content-studio/design/03-parity-tolerances.md` at the workspace root).
The shared transform spec (crop → fit → center+offset → clockwise rotate;
fragment order eq → lumetri → lut → chromakey → opacity → blend) is written
verbatim in both `lib/studio/glCompositor.ts` and
`internal/services/studio_export.go`.

### Closed in part 12 (both sides now state one spec)

- **Lumetri**: the shader mirrors the export chain stage-for-stage with
  per-stage clamps — `2^exposure` → `colorbalance` midtones (exact weight
  curve) → `vf_vibrance`'s exact formula → `eq`-equivalent contrast/saturation
  (chroma decoupled from luma contrast). Reference math + unit tests:
  `lib/studio/colorMath.ts`.
- **Blend modes**: one semantic both sides —
  `out = mix(backdrop, blendRGB(backdrop, src), layerAlpha)`. The export
  blends on `gbrp` (per-RGB-channel, `overlay` conditions on the backdrop)
  and windows by the layer's real alpha via `alphaextract`/`alphamerge` +
  straight-alpha `overlay`. Dissolves into blend-mode clips now work in export.
- **LUT intensity < 1**: both sides are the linear `mix(c, graded, intensity)`
  — part 12 fixed the export's inverted `blend all_opacity` input order
  (graded is now the top input).
- **Audio crossfades**: equal-power (`qsin`) on BOTH sides — the preview
  applies `audioFadeGain()` (previewEngine) with the export's exact fade
  placement. **Video alpha dissolves are linear on both sides, by spec.**
- **Auto-ducking**: preview is now **level-driven** like the export — voice
  peaks (`/peaks`) → the `sidechaincompress` transfer curve (threshold 0.02,
  `ratio = clamp(1+duckAmountDb,1,20)`, makeup 1) → pure attack/release
  envelope (`lib/studio/duckingEnvelope.ts`). Documented approximations: peak
  vs RMS detection, hard vs soft knee, rAF-rate smoothing. Without peaks
  (embed backends, still loading) it degrades to presence-driven full level.

### Intended policies / degraded modes (documented, not divergences)

- **Effect stack**: BOTH sides honor the first **enabled** effect of each type
  (`pickEffects` ↔ `buildGLLayer`); extra same-type effects are ignored
  identically. Ordered stacks arrive with the P2 adjustment-layer work.
- **Rotation sign**: both clockwise-positive; the harness's rotation scenario
  verifies ffmpeg `rotate` spins the same way on the server.
- **Volume boost > 1.0** is honored in the Web Audio preview path but clamped
  to 1.0 in the non-Web-Audio fallback (`HTMLMediaElement.volume` max).
- **WebGL fallback**: on context-creation failure or `webglcontextlost`, the
  preview reverts to the pooled-`<video>` CSS path (CSS `filter`
  approximations, no LUT/chroma/blend) — degraded by design, outside the
  harness's scope; the surface never blanks.

## 4. Server assumptions (please confirm)

- **ffmpeg** with `colorbalance`, `vibrance`, `lut3d`, `chromakey`, `despill`,
  `stereotools`, `sidechaincompress`, `loudnorm`, `subtitles` (libass) filters.
- **libass/fontconfig** resolves the ASS `Fontname: Sans` for caption burn-in.
  To pin a specific family, expose `CONTENT_STUDIO_CAPTION_FONTS_DIR` and set the
  font name accordingly (currently relies on fontconfig's default sans).
- **DeepFilterNet** (`DeepFilterBin`) + **Demucs** (`DemucsBin`) for the
  derive-asset AI actions; **whisper-ctranslate2** for caption generation
  (reuses the transcription service's current model/language defaults).
- All Content Studio ffmpeg runs pin to `CONTENT_STUDIO_GPU_INDEX` (default 1).

## 5. New API surface

- `GET /api/studio/assets/:id/peaks` — waveform peaks JSON (ingest + on-demand backfill).
- `GET /api/studio/assets/:id/file` — raw original (used to fetch `.cube` LUTs).
- `POST /api/studio/assets/:id/derive` — AI audio (`voice_clean`/`split_vocals`/`split_instrumental`) → new asset.
- `POST /api/studio/projects/:id/captions/generate` — whisper transcription → cues.
- `StudioExportRequest.loudness` — `'' | streaming | podcast | broadcast`.

Rate limits (`cmd/api/main.go`): derive + captions share the analysis bucket;
export shares the transcode bucket.

## 6. Telemetry

**Superseded by ADR ws/0003** (part 10): Content Studio analytics now use the
first-party `studio_*` event taxonomy in `lib/analytics/events.ts` (mirrored by
the analytics service's Go catalog), with the edit-summary aggregator and
bucket helpers in `lib/analytics/buckets.ts`. The `lib/studio/telemetry.ts`
event list described here is historical.
