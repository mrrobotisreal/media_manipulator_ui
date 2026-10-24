# Darkroom E2E suite (part 22)

> **WORKSTATION-ONLY.** These Playwright specs drive a real browser against a
> deployed UI + API (real database, S3, ffmpeg pipeline) and write real
> projects. They never run on the laptop, never in `npm test`, and never in the
> laptop gates. The laptop typechecks and lints the code (`npm run typecheck`,
> `npm run lint` cover `e2e/`) and nothing more. Never point it at production.

## What it covers

| Spec | Journey |
| --- | --- |
| `specs/darkroom-journey.e2e.ts` | create project (9:16 canvas preset) -> batch-import video + audio fixtures -> place on timeline -> edit (split, transition, keyframe, title clip) -> **Saved** -> reload -> project intact, no false recovery prompt -> export to completion -> download the file -> the persistent Exports panel lists it |
| `specs/darkroom-recovery.e2e.ts` | edit offline so only the local IndexedDB draft has it -> close the whole browser context mid-edit -> reopen with the saved storage -> recovery prompt -> Recover -> the edit is back and saves |

Scoped to what shipped (parts 03-21). Not covered, deliberately: the CreaTV
embed (needs a CreaTV host page), the mixer/EQ, speed/reverse, voiceover
(needs a fake microphone: add `E2E_CHROMIUM_ARGS="--use-fake-device-for-media-stream --use-fake-ui-for-media-stream"` and a spec), and preview-vs-export pixel parity (that is `npm run parity`).

The editor must load whether WebGL or the canvas fallback is active, so the
specs assert the editor chrome, not the renderer.

## Prerequisites (workstation)

- The stack deployed and reachable: this UI (a production build or `next start`), the API, Postgres, Redis, S3-compatible storage, ffmpeg. The UI must have been built with `NEXT_PUBLIC_API_BASE_URL` pointing at that API.
- `ffmpeg` on PATH (fixture generation only).
- Node deps installed (`npm ci`), and a Chromium for Playwright: `npx playwright install --with-deps chromium`.
- A signed-in test user if the stack gates studio behind an account: sign in once, save the Playwright storage state, and pass it via `E2E_STORAGE_STATE`. Anonymous sessions work where the stack allows guest studio use (the editor identifies guests by session id).
- Disk and queue headroom for a few tiny renders.

## One-time and per-run commands

```bash
npm run e2e:fixtures                       # generates e2e/fixtures/{clipA.mp4,clipB.mp4,tone.wav} (tiny, gitignored)
E2E_BASE_URL=https://darkroom.workstation.example \
E2E_API_URL=https://api.workstation.example/api \
  npm run e2e                              # whole suite, headless
npm run e2e -- specs/darkroom-journey.e2e.ts   # one spec
npm run e2e -- --headed                    # watch it (needs a display; headless is the default)
npx playwright show-report e2e/report      # HTML report after a failure
```

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `E2E_BASE_URL` | `http://localhost:3000` | Deployed UI origin. |
| `E2E_API_URL` | unset | API base the UI was built with; if set, a `GET {E2E_API_URL}/health` preflight runs first. |
| `E2E_STORAGE_STATE` | unset | Path to a Playwright `storageState` JSON of a signed-in user. |
| `E2E_CHROMIUM_ARGS` | none | Extra Chromium flags (space-separated), e.g. the parity harness' ANGLE/EGL pair to run on the GPU path. |
| `E2E_EXPORT_TIMEOUT_MS` | `600000` | How long the export step waits for the render to finish. |

## Browser

Full Chromium via `channel: 'chromium'` (Playwright >= 1.49, new headless), per
research ticket 02, instead of the default headless shell. E2E needs
functionality, not GPU parity, so no GPU flags are set by default; Chromium
silently falls back to SwiftShader/software WebGL in headless Linux and the
editor handles that.

## Gate contract (laptop vs workstation)

| Where | Runs | Never runs |
| --- | --- | --- |
| Laptop | `npm run typecheck && npm run lint && npm test && npm run build` | `npm run e2e`, `npm run parity` |
| Workstation | `npm run e2e`, `npm run parity` (plus everything above) | against production |

`vitest.config.mts` excludes `e2e/**`; spec files end `.e2e.ts` so neither
vitest nor Next collects them as tests. The same contract is in
`docs/content-studio/README.md` at the workspace root.

## Maintaining the specs

- Selectors are roles, labels and titles from `i18n/locales/en-us/interface/tools.json`. If copy changes, update the string here; the single test id is `timeline-clip` (clip blocks in `components/content-studio/timeline.tsx`).
- The journey is one serial describe: steps depend on the previous step's project. A failure skips the rest by design.
- Each run creates uniquely named projects (`e2e-<timestamp>-<rand>`); clean them up in the stack's admin tooling periodically.
- Adding a feature spec: reuse `helpers.ts`, keep it independent (its own project name), and prefer title/label selectors over CSS.
