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
The user-facing name for the SVG + SVG-animation editor (`/motion/[projectId]`, chromeless like `/dr`; public landing page `/tools/motion` arrives with MM48). All *publicly visible* references say "Motion", and the one copy constant is `MOTION_BRAND` in `lib/vector/brand.ts` (no other "Motion" string literal in editor code; `lib/vector/brand.test.ts` enforces it). Shown as "Motion (beta)" until the first full release.
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
One animated property of one layer (`{layerId, property, keyframes, extras}`), with preset, cubic-bezier or hold easing per keyframe. The shape is fixed in v1; tracks are created from MM44 on.

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
