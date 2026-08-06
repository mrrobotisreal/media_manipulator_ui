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

### Editor domain

**EDL** (Edit Decision List):
The persisted document describing an edit — tracks, clips, effects, captions, audio config. Zod schema in `lib/studioTypes.ts`, mirrored byte-for-byte (camelCase) by the Go backend. The wire contract between editor and render pipeline.

**Studio Project**:
One saved editor document (an EDL plus name/fps/canvas size), owned by a signed-in user or an anonymous session.

**Studio Asset**:
An ingested media source (video, audio, or LUT) belonging to a project, with server-generated proxy, filmstrip sprite, and waveform peaks.

**Embed protocol**:
The versioned, origin-validated postMessage contract between a host (CreaTV) and the `/embed/content-studio` iframe. A compatibility boundary — never break it, only extend it.
