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

## 3. Preview ↔ export parity

The **server render is authoritative**; the WebGL2 preview approximates it as
closely as possible. The shared transform spec (crop → fit → center+offset →
clockwise rotate; fragment order eq → lumetri → lut → chromakey → opacity →
blend) is written verbatim in both `lib/studio/glCompositor.ts` and
`internal/services/studio_export.go`.

Exact matches: `eq` adjustments, crop, transform position/scale, exposure
(`c·2^exposure` ↔ `colorchannelmixer`), LUT (trilinear), volume keyframes
(piecewise ↔ `volume='…':eval=frame`).

### Known divergences (intentional / documented)

- **Lumetri temperature/tint**: preview uses a linear RGB shift (`±0.15·t`);
  export uses `colorbalance`. Both warm/cool; the curves differ slightly.
- **Effect stack**: preview honors the **first enabled** effect of each type;
  export does the same (fixed chain order). Multiple effects of one type beyond
  the first are ignored in both.
- **Blend modes**: export uses ffmpeg `blend=all_mode=` (which ignores source
  alpha for some modes) within the clip's enable window; blend + dissolve
  interaction can differ slightly from the shader.
- **LUT intensity < 1**: export uses `split`+`blend=all_opacity`; preview uses a
  shader `mix`.
- **Auto-ducking**: export is **level-driven** (`sidechaincompress`); preview is
  **presence-driven** (ramps non-voice tracks toward `10^(-dB/20)` while a
  voice-track clip is present). `ratio = clamp(1+duckAmountDb, 1, 20)` is a
  heuristic.
- **Audio crossfades**: export adds `:curve=qsin` (equal-power) to afades — a
  deliberate global improvement over linear. Video alpha fades stay **linear**.
- **Rotation sign**: both use clockwise-positive `rotationDeg`; verify ffmpeg
  `rotate` direction on the server matches the shader.
- **Volume boost > 1.0** is honored in the Web Audio preview path but clamped to
  1.0 in the non-Web-Audio fallback (`HTMLMediaElement.volume` max).
- **WebGL fallback**: on context-creation failure or `webglcontextlost`, the
  preview reverts to the pooled-`<video>` CSS path (CSS `filter` approximations,
  no LUT/chroma/blend); the surface never blanks.

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

Derived-metadata only (`lib/studio/telemetry.ts`) — never text/filenames:
`studio_effect_added {type}`, `studio_captions_generated {cueCountBucket}`,
`studio_export {hasLut, hasChromaKey, loudness}`.
