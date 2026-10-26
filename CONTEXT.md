# Web UI (media-manipulator-ui)

The customer-facing Next.js app for media-manipulator.com: media tool pages, the Darkroom editor, marketing/SEO pages. This glossary is the ubiquitous language for this context — use these terms in code comments, docs, tickets, and UI copy.

## Language

### Naming: the editor

**Darkroom**:
The user-facing product name for the browser-based multi-track video editor — the platform's flagship tool. All *publicly visible* references (UI copy, page titles, SEO, tutorials, admin UI labels) say "Darkroom". This matches CreaTV, which embeds the same editor under the same name.
_Avoid_: "Content Studio" in anything a user can see.

**Content Studio**:
The internal/engineering name for the same editor. All code identifiers keep it: route segments (`/tools/content-studio`, `/embed/content-studio`), directories (`components/content-studio`, `lib/studio`), backend API paths (`/api/studio/*`), DB tables (`studio_*`), and analytics identifiers (`feature: 'studio'`). The Darkroom rename is **cosmetic-only by decision** — renaming identifiers would churn the codebase and break the deployed CreaTV embed contract.
_Avoid_: renaming code identifiers, API paths, or analytics event vocabulary to "darkroom".

**Darkroom Instrument**:
The site-wide visual design system (`components/darkroom/*` — panels, segmented controls, stat tiles). Named for its darkroom-style theme; it is **not** the Darkroom editor product. When ambiguity is possible, say "Darkroom Instrument (design system)" vs "Darkroom (editor)".

### Naming: the Motion editor

**Motion**:
The user-facing name for the SVG + SVG-animation editor (`/motion/[projectId]`, chromeless like `/dr`; public landing page `/tools/motion`, MM48). All *publicly visible* references say "Motion", and the one copy constant is `MOTION_BRAND` in `lib/vector/brand.ts` (no other "Motion" string literal in editor code; `lib/vector/brand.test.ts` enforces it). Shown as "Motion (beta)" until the first full release.
_Avoid_: "vector" in anything a user can see; the `motion` npm package (we do not depend on it).

**vector**:
The code identifier for the same editor, everywhere: directories `components/vector/`, `lib/vector/`, API `/api/vector/*`, tables `vector_*`, analytics `vector_*` and `feature: 'vector'`, env `VECTOR_*`. Cosmetic-only brand, exactly like Darkroom/`studio` (design `docs/design/MOTION_SVG_ANIMATOR.md` §1, ADR-0012).

### Motion domain

**VectorDoc**:
The Motion document, v1 (Zod in `lib/vector/vectorTypes.ts`, Go mirror `internal/vector/doc.go`): canvas, preview fps, duration, a layer tree, `defs` (gradients, masks, clip paths, filters, symbols) and animation tracks. **Additive-only**: new fields optional, never renamed, unknown `version` rejected, unknown keys kept. The shared fixture docs in `lib/vector/fixtures/` are the cross-side contract (`fixtures/README.md`).

**Layer**:
One node of the VectorDoc tree: `group` (has children) or a shape (`path`, `rect`, `ellipse`, `line`, `polyline`, `polygon`, `text`, `image`, `use`), or a raw layer. Every layer has a document-unique id matching `[A-Za-z_][\w-]*`.

**Raw layer**:
A `raw` layer holds imported SVG markup the model does not cover (patterns, filters beyond one blur, `foreignObject`, SMIL, multi-line text, un-inlinable styles…). It round-trips byte-stable and is not editable; scripts, event handlers and external references are stripped before it is stored.

**Track**:
One animated property of one layer (`{layerId, property, keyframes, extras}`), with preset, cubic-bezier or hold easing per keyframe. The shape is fixed in v1; tracks are created from MM44 on. The segment from one keyframe to the next uses the LEFT keyframe's easing; a **hold** keeps the value until the next keyframe, then jumps. `sampleTrack` (`lib/vector/sampleTrack.ts`) is the one definition of a track's value at time t: the preview renders from it and the CSS exporter is tested against it.

**Playhead edit / autokey** (MM44):
The canvas and inspector show and edit the document at the playhead. Changing an animated property there writes a keyframe at the playhead instead of changing the static layer. With **autokey** on (off by default), changing an un-animated property also starts a track. `mutateAt` / `foldAt` in `lib/vector/vectorStore.ts` (logic in `lib/vector/timeEdit.ts`). Scrubbing, play and the play range are view state and never undo steps.

**Animator** (MM45):
A one-click action in the animator panel (`components/vector/animator-panel.tsx`, pure ops in `lib/vector/animators.ts`) that creates the tracks for one effect on the selected layer, from the playhead to the end: **Draw on** (`stroke-dasharray` = outline length, `strokeDashoffset` L → 0), **Motion path** (`motionPath` 0 → 1 along a guide path, centre on the path), **Morph** (`d` keys normalised to one command sequence), **Gradient** (`gradientStop[i].color` per stop), **Mask/Clip** (a track on the mask or clip content layer itself) and **Blur** (`filter.blur` stdDeviation). Each is one undo step. `advanced.ts` defines what every advanced track targets.

**Morph normalisation** (MM45):
Rewriting the `d` keys of one morph track so all have the same command sequence (absolute cubics, same count per subpath, start point and winding aligned; `lib/vector/morph.ts`, in-house, no flubber). Morph keys are stored normalised, so exporters never recompute them; two keys whose sequences differ hold instead of morphing.

**Export runtime** (MM45):
How an animated SVG export plays: **CSS** (one `<style>`, no script) or **anime** (the tree-shaken MIT anime.js runtime + a small player in one inline `<script>`, licence notice first). `chooseRuntime` (`lib/vector/export/chooseRuntime.ts`) picks CSS only when every feature is CSS in Chromium, Firefox and Safari; `reasons` say why not (morph, stop position, blur, motion-path rotation edge case). Both count as the one server format `svg_animated`. Scripts do not run inside `<img>`.

**Lottie unsupported list** (MM46):
The single list of what Lottie cannot carry in either direction (`lib/vector/export/lottieSupport.ts`, `LOTTIE_EXPORT_UNSUPPORTED` + `LOTTIE_IMPORT_UNSUPPORTED`). The Lottie writer and reader never drop anything silently: each gap becomes a warning `{layerId, feature, reason}` with a feature code from this list, and the export dialog / import dialog show it (`vector.lottie.unsupported.<feature>`). Target: Lottie spec 1.0.1, LottieFiles "Basic" feature set.

**Code export** (MM46):
A counted export of the animation as source code: React component (`.tsx`, server format `react_tsx`), JS or TS module (`js_ts`), Flutter widget (`.dart`, `flutter`). Pure functions with byte-golden fixtures; strings from the document reach the source only through the language's string-literal escaper (`jsString`, `dartString`). The Flutter export is **native** (`flutter_svg` + `AnimationController`, when `canExportNativeFlutter`: transform / opacity / colour / stroke width only) or a **WebView player** (`webview_flutter`, every other document; opaque background).

**Raster export / frame-baked SVG** (MM47):
A counted export rendered frame by frame in the browser: GIF (`gif`), PNG sequence zip (`png_sequence`), MP4 (`mp4`), WebM (`webm`). Each frame is a **frame-baked SVG**, `serializeSvg(sampleDoc(doc, t))` with every animated property resolved to a constant at `t = i / fps` (never the wall clock), drawn through a Blob-URL `<img>` onto one reused canvas (`lib/vector/raster/frames.ts`). The document is re-validated and the exact SVG text re-checked before any `<img>`, so external references never load and the canvas is never tainted. GIF uses the in-house encoder (`gifEncoder.ts`, one global palette, Worker); video uses WebCodecs + `mediabunny` (MPL-2.0, unmodified, lazy-loaded). Options are pre-clamped to the caller's tier caps (`clampRasterOptions`); the **capability probe** (`probeRaster`) asks `VideoEncoder.isConfigSupported` per codec.
_Avoid_: "render" alone (Darkroom renders on the server), "screen recording".

**Account project / browser-only project** (MM44):
A Motion project is either browser-only (a `local-…` id; it lives only in the IndexedDB draft, the only kind anonymous users have) or an account project (a server UUID in `vector_projects`, saved with `If-Match` revisions, 409 on a conflict). "Save to account" turns the first into the second and replaces the URL. The draft is kept until a save succeeds.

**Motion plan table** (MM48):
The format-and-allowance table on `/tools/motion`, a pure model over the public `GET /api/tiers` body (`lib/vector/planTable.ts`, rendered server-side by `components/vector/landing/motion-landing.tsx`). Columns are the public tiers the API returns (Pro only when it serves a `pro` row, with the "Best for Motion" chip); a format is ticked when the tier's `vectorFormats` lists it, and a format no tier lists is "coming soon" (the export dialog's "not available on any plan yet"). No numbers or locks are literals, so MM49's Pro formats appear with no UI change.
_Avoid_: hard-coding a Motion allowance anywhere outside `/api/tiers`.

### Editor domain

**EDL** (Edit Decision List):
The persisted document describing an edit — tracks, clips, effects, captions, audio config. Zod schema in `lib/studioTypes.ts`, mirrored byte-for-byte (camelCase) by the Go backend. The wire contract between editor and render pipeline.

**Studio Project**:
One saved editor document (an EDL plus name/fps/canvas size), owned by a signed-in user or an anonymous session.

**Studio Asset**:
An ingested media source (video, audio, or LUT) belonging to a project, with server-generated proxy, filmstrip sprite, and waveform peaks.

**Embed protocol**:
The versioned, origin-validated postMessage contract between a host (CreaTV) and the `/embed/content-studio` iframe. A compatibility boundary — never break it, only extend it.

### Localization

**Locale registry**:
`i18n/locales.ts`, the one place a locale is registered (code, URL prefix, native label, flag, direction, `translated`). `npm run i18n:gen` (`scripts/gen-i18n-registry.mjs`) turns it into the checked-in `i18n/generated/*.generated.ts` files that every shard consumer imports. Adding a locale = one row + a copy of `i18n/locales/en-us/` (minus `interface/metadata.json`) + `npm run i18n:gen`; `i18n/generated/registry.test.ts` fails when the generated files are stale.
_Avoid_: hand-listing locales or locale directories anywhere else.

**Byte-copy locale**:
A registered locale whose shard files are still exact copies of en-US, with `translated: false`. It is routable and selectable, but noindex, absent from the sitemap, hreflang and `llms.txt`. A translation session overwrites its files and flips the flag.

**Client bundle (i18n)**:
Only English's eager shards ship in client JS. Every other locale's eager bundle is read on the server by the `[lang]` layout (`i18n/localeResources.ts`) and passed to `<Providers resources>`, so first-load JS does not grow with the locale count. `forms`/`panels` stay lazy (`lib/i18n/ensureShard.ts`); `pages`/`articles` are server-only.

**Translator locale**:
Any non-English locale (`translatorLocales` in `i18n/locales.ts`). Each has a translator deployment at branch `translate/<prefix>` and domain `<prefix>.translate.media-manipulator.com`. Scripts and workflows read the list from `node scripts/list-locales.mjs` (`--json`, `--codes`).

**Translator mode**:
A build with `NEXT_PUBLIC_DEPLOY_ROLE=translator` (a `translate/<prefix>` Vercel branch; production never sets it). It is hardened: `X-Robots-Tag: noindex, nofollow`, robots disallow-all, empty sitemap, no GA4/AdSense/consent/first-party analytics, `/dr` 404, and no Checkout, account deletion or Darkroom export (`isIrreversibleActionHidden()`). It is **armed** (markers, scanner, MM53 panel) only when `NEXT_PUBLIC_TRANSLATOR_LOCALE` is also a translator locale. Every flag lives in `lib/translator/mode.ts`, the only translator module app code may import statically. `npm run check:no-translator` proves a production build holds none of it.
_Avoid_: "staging", "preview mode" (a Vercel preview without the role is plain production behaviour).

**Key marker**:
An invisible run of U+200C/U+200D, 63 chars, appended to every translated string in translator mode (client `t()` through the `mmKeyMarker` i18next post-processor, server `getServerT`/`ServerTrans`). It encodes a key-registry index. `lib/translator/markerCodec.ts` owns the format. The DOM scanner (`lib/translator/domScanner.ts`) decodes markers and strips them from the page. Metadata uses `getServerMetadataT`, which never marks.

**Key registry**:
`lib/translator/keyRegistry.ts`, which maps a marker index to `{ ns, key, lng }`, where `key` is the *resolved* key (`foo_few`, `items.0.title`). The index is content-derived: locale slot × 2³² + FNV-1a of `ns:key`. Server and client therefore mint identical markers without shared state, which keeps hydration safe.

**Workbench panel**:
The translator-only side panel (`components/translator/workbench-panel.tsx`, MM53), mounted from `app/providers.tsx` through `loadTranslatorWorkbench()` behind the literal `NEXT_PUBLIC_DEPLOY_ROLE` guard, and only after `GET /api/translator/me` allows the signed-in user for this locale. Docks right for LTR, left for RTL. Tabs: This page, All keys, Changes. Its chrome is English (`lib/translator/chromeCopy.ts`), never a locale shard.
_Avoid_: "editor" (that is Darkroom or Motion), "translation panel" (the caption translator tool).

**Draft**:
A translator's pending value for one key, kept in IndexedDB `mm-translator-drafts` (`lib/translator/draftStore.ts`) keyed by locale + file + key, with the `baseValue` it was started from. It exists only while it differs from that base. Drafts are re-applied to the page after reloads, navigation and lazy shard merges (shard first, drafts last). They are never written to the shard files: MM54's submit turns them into a pull request.

**Base SHA**:
The `main` commit SHA plus per-file blob SHAs from `GET /api/translator/base`, stored per locale beside the drafts. It is fetched on the first panel open of a session that has no pending drafts, and on "Refresh base". MM54's conflict check compares it with `main` at submit.

**Mirror branch**:
A `translate/<prefix>` branch: an exact copy of `main` with no commits of its own, which Vercel builds as that locale's translator deployment. `.github/workflows/sync-translate-branches.yml` creates or fast-forwards all 16 on every push to `main` (never `--force`; a diverged mirror fails the job), then pokes `VERCEL_DEPLOY_HOOK_<PREFIX>`. Translator edits never land on a mirror branch; they arrive as pull requests.
_Avoid_: "translation branch" (that is the `i18n/<prefix>/…` PR branch).

**Translator submit**:
`POST /api/translator/submit` (MM54): turns a translator's drafts into one labelled pull request against `main`, on branch `i18n/<prefix>/<yyyymmdd-hhmm>-<slug>`, through the GitHub App. The steps run in order and nothing is written unless all pass: Firebase token + allowlist, a path allowlist (`i18n/locales/<locale dir>/**.json` only, never `metadata.json`), a per-user rate limit, a per-key upstream-conflict check, the stable JSON writer, and the shared validators. The submit modal runs it first as a `?dryRun=1` pre-flight. The PR names the translator by an 8-char uid prefix, never by email. `i18n-pr-guard.yml` re-checks the paths in CI.

**Stable JSON writer**:
`lib/translator/stableJson.ts`: parses a shard into an ordered tree and prints it exactly as the repo formats it (`JSON.stringify(v, null, 2)` + newline, keys in file order, including integer-like keys such as `"1080"` that `JSON.parse` would reorder). Every shard round-trips byte for byte (tested), so a translator PR changes only the edited lines.
