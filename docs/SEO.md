# Media Manipulator SEO & Analytics Playbook

This doc explains how SEO metadata, GA4, and prerendering are wired up in the
UI repo, and how to add a new public page without breaking those systems.

For performance/lazy-loading/font work, see `docs/PERFORMANCE.md`.

## At a glance

| Concern | Source of truth |
| --- | --- |
| Per-route `<title>`, description, canonical, OG, Twitter, JSON-LD | `src/lib/seo.ts` |
| SPA route metadata updater | `src/components/seo-head.tsx` (`useSeoMeta`, `applySeoMeta`) |
| GA4 SPA pageviews | `src/lib/gtag.ts` + `RouteAnalytics` in `src/Router.tsx` |
| First-party analytics | `src/lib/firstPartyAnalytics.ts` |
| Core Web Vitals | `src/lib/webVitals.ts` (initialised in `src/main.tsx`) |
| Sitemap | `public/sitemap.xml` |
| Robots | `public/robots.txt` |
| Prerender (post-build) | `scripts/prerender.ts` (run by `npm run build`) |
| Keyword & content cluster map | `src/content/keywordMap.ts` |
| Tool landing-page content | `src/content/toolPages.ts` |
| Reusable tool landing component | `src/pages/tools/tool-landing-page.tsx` |
| Embedded tool panel | `src/components/embedded-tool-panel.tsx` |
| Tool flow diagram | `src/components/tool-flow-diagram.tsx` |
| Reusable internal-link cards | `src/components/related-links.tsx` |

## GA4 setup

- Measurement ID lives at `import.meta.env.VITE_GA_MEASUREMENT_ID`
  (defaults to `G-6J910CMHRY`).
- `index.html` loads the gtag snippet but **disables auto pageview**
  (`send_page_view: false`).
- Pageviews are dispatched from `RouteAnalytics` in `src/Router.tsx` on every
  React Router location change — both GA4 and the first-party endpoint
  receive a `page_view` event.
- Don't add `gtag('config', ...)` elsewhere; use `trackGoogleEvent` /
  `trackGooglePageView` from `src/lib/gtag.ts`.

## Search Console

- Sitemap URL to submit: `https://www.media-manipulator.com/sitemap.xml`.
- Verification uses the `<meta name="google-adsense-account">` /
  `google-site-verification` tag pattern. Add a verification meta tag in
  `index.html` if Google asks for one — keep it inside `<head>` and don't
  remove the existing AdSense meta.
- Use the URL Inspection tool to confirm prerendered pages show the correct
  title/description after deploy.

## Add a new route (blog / tutorial / general page)

1. Build the page component under `src/pages/...`.
2. Register it in `src/Router.tsx` with a `<Route>` — use `React.lazy()`
   so the chunk loads on demand. See `docs/PERFORMANCE.md`.
3. Add a `RouteSeo` entry to `src/lib/seo.ts`:
   - Pick title (≤ 60 chars where possible), description (~155 chars).
   - Set `canonicalUrl` via the `buildCanonical` helper.
   - Pick the right JSON-LD types — `Article` for blog posts, `TechArticle`
     for tutorials, `WebApplication` for tool landing pages.
   - Always include a `BreadcrumbList` for nested routes.
4. Add a `<url>` block to `public/sitemap.xml` with today's `lastmod` and
   an appropriate `priority`.
5. (Optional) Add a `KeywordCluster` to `src/content/keywordMap.ts` so
   internal-link components can surface the new page automatically.
6. Re-build with `npm run build` — the prerender step picks up the new
   route and emits a static `dist/<path>/index.html`.

## Add a new /tools landing page

Tool landing pages are data-driven from `src/content/toolPages.ts` so a
single component (`src/pages/tools/tool-landing-page.tsx`) renders them
all. Adding a new tool is content-only:

1. Add a new entry to `TOOL_PAGES` in `src/content/toolPages.ts`. Fill in
   `slug`, `h1`, `metaTitle`, `metaDescription`, `embed`, `flowSteps`,
   `useCases`, `faq`, `related`, `primaryKeyword`, `secondaryKeywords`,
   and the rest of the `ToolPageContent` shape.
2. The route is already wired (`<Route path="/tools/:slug" element={<ToolPage />} />`
   in `src/Router.tsx`). It looks the slug up via `getToolBySlug`.
3. `src/lib/seo.ts` builds the `RouteSeo` for `/tools/<slug>` from the
   `ToolPageContent` automatically — including `WebApplication`,
   `BreadcrumbList`, and `FAQPage` JSON-LD. No manual SEO entry needed.
4. Add a `<url>` entry to `public/sitemap.xml` for `/tools/<slug>`.
5. (Optional) Add or update a `KeywordCluster` in
   `src/content/keywordMap.ts` so the new tool surfaces in internal-link
   sections automatically.
6. Cross-link from related blog posts, tutorials, and sibling tools'
   `related` arrays.
7. Re-build with `npm run build`.

### Embedded tool panel knobs

The embed config supports these props (all optional except
`defaultMediaKind` and `defaultTask`):

- `defaultMediaKind` — `image | video | audio`
- `defaultTask` — keyed string consumed by the panel for hint copy
- `defaultOutputFormat` — recommended output, shown as a hint banner
- `lockedInputFormat`, `lockedOutputFormat` — informational hints
- `allowedInputFormats` — informational hint
- `acceptOverride` — overrides the file input's `accept` attribute
- `transcribeMode` — switches the embed to the transcribe flow
  (only meaningful for video/audio kinds)

The underlying forms (`ImageConversionForm`, `VideoConversionForm`,
`AudioConversionForm`, `TranscribeForm`) are reused unchanged from the
homepage — settings the user picks in the embedded form are the same
ones the full app exposes.

## JSON-LD authoring rules

- Only **plain JSON** values — no functions, `undefined`, or comments.
- Reuse the helpers in `src/lib/seo.ts` (`articleLd`, `techArticleLd`,
  `breadcrumbList`) so the publisher / dateModified / canonical patterns
  stay consistent.
- Each JSON-LD block injected at runtime is tagged with
  `data-managed-by="media-manipulator-seo"` so the updater can replace it
  on route change without removing the inline JSON-LD shipped from the
  prerender.

## Prerendering

- `npm run build` runs `tsc -b && vite build && npm run prerender`.
- `scripts/prerender.ts` reads `dist/index.html`, then for every route in
  `getAllRouteSeo()` it:
  - replaces the `<title>` with the route title,
  - strips any default meta/OG/Twitter/canonical tags,
  - injects route-specific tags inside the `<head>`,
  - writes `dist/<route>/index.html` (and the root `dist/index.html`).
- The body shell (`<div id="root">…`) is preserved so React hydrates as
  usual when the prerendered file loads.

If a new route needs different behaviour (e.g. a page that depends on
browser-only APIs in render), guard the offending code with
`typeof window !== 'undefined'` so it still loads cleanly through the
prerender step. The prerender script never executes the React tree — it
only patches the HTML — so component side-effects are not invoked.

If the simple HTML rewrite is ever insufficient (e.g. you want real DOM
content prerendered), swap the script for a Puppeteer / Playwright pass.
Keep the same input/output contract: `dist/<route>/index.html` per route.

### Future: Astro migration

Marketing/content pages (blog, tutorials, about, how-it-works, legal) are
strong candidates for a future migration to Astro for true SSG. Keep the
React tool app on the homepage; pull the static content pages over to
Astro one at a time. The current prerender script is a deliberate bridge
solution that gives us SEO-ready HTML today without that migration cost.

## Validation checklist

After making changes:

```bash
npm install              # if any deps were added
npm run lint
npm run build            # type-checks + vite build + prerender
npm run preview          # local server pointing at dist/
```

Then verify:

- **Lint / build** — both run clean.
- **GA4 page_view** — Open DevTools › Network and filter for
  `collect?v=2`. Navigating the SPA should produce a fresh `page_view` per
  route.
- **First-party analytics** — `POST` to
  `analytics.media-manipulator.com/capture` fires on each navigation.
- **No raw filenames** — Inspect any `file_*` event payload; only
  `file_extension`, `file_type`, `file_size_mb`, `media_kind` should appear.
- **Web Vitals** — Look for the `web_vitals` event in both GA4 and first
  party after some scroll/interaction.
- **SEO metadata** — `curl http://localhost:4173/blog/...` (or wherever
  preview is serving) and confirm the response HTML contains the right
  `<title>`, canonical, OG, and JSON-LD blocks.
- **Rich Results Test** — Paste the deployed URL into
  https://search.google.com/test/rich-results to validate JSON-LD.
- **PageSpeed Insights** — Run https://pagespeed.web.dev/ on the homepage
  and a representative blog/tutorial route to monitor LCP/CLS/INP.
- **Search Console URL Inspection** — After deploy, request indexing on
  the new route and confirm Google sees the correct metadata.

## Don't do this

- Don't add `document.title = '...'` inside page components — the central
  SEO updater handles that. Use `applySeoMeta` if you have a non-routed
  view that needs a custom title.
- Don't send raw uploaded file names, full paths, transcript content, or
  AI summaries to analytics. Use `getSafeFileExtension` and keep payloads
  to derived metadata only.
- Don't inline JSON-LD `<script>` tags directly inside React components —
  add them through the SEO map so they roundtrip through the prerender.
- Don't gate public pages behind login or invoke ads inside the embedded
  tutorial converter UI.
