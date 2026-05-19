# Media Manipulator Performance Playbook

Practical notes on how the UI repo keeps the initial bundle small, defers
heavy code, and serves fast fonts.

## Route-level lazy loading

`src/Router.tsx` loads every non-shell page with `React.lazy()` + `Suspense`.
This keeps the homepage's first paint light and ships each page as its own
JS chunk.

- The shell (`TopNav`, `Footer`, `RouteAnalytics`) is **not** lazy — it
  drives route-change SEO and analytics, so it must run as soon as the
  app mounts.
- `getSeoForPath` + `applySeoMeta` is called outside the lazy boundary so
  the `<head>` updates as soon as the location changes, regardless of
  whether the page chunk has finished loading.
- The Suspense fallback (`RouteFallback`) is a tiny three-dot pulse — no
  heavy spinner or skeleton tree.

If you add a new page:

1. Build the page component under `src/pages/...`.
2. Add `const MyPage = lazy(() => import('./pages/my-page'));` near the
   top of `src/Router.tsx`.
3. Add `<Route path="/my-page" element={<MyPage />} />` inside the
   existing `<Suspense>` block.

## Bundle chunking

`vite.config.ts` uses Rollup's `manualChunks` to split vendor code into
predictable bundles:

| Chunk | What's inside |
| --- | --- |
| `react-vendor` | React, React-DOM, scheduler, react-router-dom |
| `ui-vendor` | Radix UI, lucide-react |
| `firebase-vendor` | Firebase auth/analytics/performance/firestore |
| `analytics-vendor` | mixpanel-browser, web-vitals |
| `stripe-vendor` | Stripe (if/when used) |
| `query-vendor` | TanStack React Query |
| `form-vendor` | react-hook-form, zod, @hookform/resolvers |

If you add a new heavy dependency, prefer extending the existing chunks
over creating a one-off chunk.

## Lazy-loading heavy editor/conversion components

Heavy pieces (the homepage conversion workspace, modal previews,
TranscribeResultView) are large because they pull in form schemas,
preview canvases, and color/face tooling. Two strategies:

- The route itself is already lazy, so on routes that don't need the
  full converter (blog/tutorial/tool pages) the workspace never loads.
- The tool landing pages use `EmbeddedToolPanel` — a compact embed that
  still reuses the homepage forms. The forms ship in the same chunk as
  the embedding route, not the homepage chunk.

If you add a new heavy modal or AI tool component:

```ts
const HeavyModal = lazy(() => import('./components/heavy-modal'));

// usage
<Suspense fallback={null}>
  {showModal && <HeavyModal ... />}
</Suspense>
```

Avoid lazy-loading tiny presentational components — the per-chunk
overhead outweighs the saved bytes.

## Analytics providers

`src/main.tsx` initializes Mixpanel synchronously today, but most events
fall back to first-party analytics if Mixpanel hasn't loaded. If a
heavier analytics provider is added later, prefer:

- Dynamic `await import('mixpanel-browser')` on first event after page
  interaction, gated by `requestIdleCallback` / `setTimeout`.
- Guarding browser-only APIs with `typeof window !== 'undefined'` so the
  prerender step never executes them.
- Queueing events into a local array before initialization and flushing
  on init.

Critical rules:

- **Never** send raw file names, full paths, transcripts, AI summaries,
  or other user-generated content to any analytics provider. Use
  `getSafeFileExtension` from `src/lib/analytics.ts`.
- Don't break existing event names — downstream dashboards depend on
  them.

## Fonts

`src/index.css` declares three faces:

- `Rubik` (variable, weight 300–900) — site-wide body and headings.
- `Rubik Italic` (variable, weight 300–900) — italic emphasis (`<em>`,
  `.italic`). Browsers only fetch this when a node actually uses italic.
- `Rubik Glitch` (single weight) — used by the brand wordmark in the
  top nav and footer (`font-glitch`).

All three already use `font-display: swap` so text renders immediately
in a system fallback while the custom font streams in.

### Converting TTF to WOFF2

FFmpeg cannot convert TTF to WOFF2. Use either:

```sh
# Option A: Google's woff2 reference implementation
brew install woff2          # macOS
sudo apt install woff2      # Debian/Ubuntu

woff2_compress src/assets/Rubik/Rubik-VariableFont_wght.ttf
woff2_compress src/assets/Rubik/Rubik-Italic-VariableFont_wght.ttf
woff2_compress src/assets/Rubik_Glitch/RubikGlitch-Regular.ttf
```

```sh
# Option B: fonttools / pyftsubset (also lets you subset by Unicode range)
python3 -m pip install "fonttools[woff]" brotli

pyftsubset src/assets/Rubik/Rubik-VariableFont_wght.ttf \
  --output-file=src/assets/Rubik/Rubik-VariableFont_wght.woff2 \
  --flavor=woff2 --layout-features='*' \
  --unicodes='U+0000-00FF,U+2010-205E'

pyftsubset src/assets/Rubik/Rubik-Italic-VariableFont_wght.ttf \
  --output-file=src/assets/Rubik/Rubik-Italic-VariableFont_wght.woff2 \
  --flavor=woff2 --layout-features='*' \
  --unicodes='U+0000-00FF,U+2010-205E'
```

Rubik is licensed under the SIL Open Font License (see `OFL.txt`) which
permits subsetting and re-distribution under the same license.

After the WOFF2 files exist:

1. Update each `@font-face` block in `src/index.css` to list WOFF2 first:

   ```css
   @font-face {
     font-family: "Rubik";
     font-style: normal;
     font-weight: 300 900;
     font-display: swap;
     src: url("./assets/Rubik/Rubik-VariableFont_wght.woff2") format("woff2"),
          url("./assets/Rubik/Rubik-VariableFont_wght.ttf") format("truetype-variations");
   }
   ```

2. Add a preload **only for the main upright Rubik WOFF2** in
   `index.html`'s `<head>` (preloading every face hurts more than helps):

   ```html
   <link
     rel="preload"
     href="/assets/Rubik/Rubik-VariableFont_wght.woff2"
     as="font"
     type="font/woff2"
     crossorigin
   />
   ```

   `/assets/...` only works after Vite copies fonts into the build
   output — verify the hashed path in `dist/assets/` and update the
   `href` to match, or move the WOFF2 into `public/fonts/` so the path
   stays stable.

## Validation

After any of the changes above:

```sh
npm run lint
npm run build
npm run preview
```

Inspect:

- Network panel — initial document, JS, and CSS bytes.
- `dist/assets/` — look for sensibly-sized chunk files
  (`react-vendor-*.js`, route chunks, etc.).
- Lighthouse / PageSpeed Insights — confirm LCP, CLS, INP.
- Search Console URL Inspection — confirm the prerendered HTML has the
  right title, description, canonical, and JSON-LD.
- Rich Results Test — re-check JSON-LD types after editing
  `src/lib/seo.ts` or `src/content/toolPages.ts`.

If lint trips on macOS junk files, clean them with:

```sh
find . -name '._*' -delete
find . -name '.DS_Store' -delete
```

(`.gitignore` and `eslint.config.js` already ignore these patterns.)
