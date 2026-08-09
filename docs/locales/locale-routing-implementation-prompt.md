# PROMPT: Locale-prefixed routes (restore SSG) + six-language registry + full hardcoded-string sweep

> **How to use:** paste this file's contents (or reference it) as the task prompt in a fresh Claude session opened in `media-manipulator-ui/`. It is written as direct instructions to that session. Work through the phases in order; the validation gates must be green at the end of every phase, so the work can safely be split across multiple sessions at any phase boundary.

---

## Context — what exists today (read this before touching anything)

The site is a Next.js App Router app (**heads-up: this Next version has breaking changes — `middleware.ts` is now `proxy.ts`, `cookies()`/`params` are async, etc. Read the guides in `node_modules/next/dist/docs/` before writing code**, per `AGENTS.md`).

A two-language i18n system (en-US + ru-RU) shipped on 2026-08-08 and works like this:

1. **Translation files**: 9 JSON shards per language under `i18n/locales/<code-lowercase>/` — `interface/{_core,components,tools,forms,panels,pages}.json`, `error/_core.json`, `accessibility/{_core,components}.json`. en-US and ru-RU are complete and key-parity-verified (Russian has 4 plural forms `_one/_few/_many/_other` wherever English has `_one/_other` — i18next v26 uses `Intl.PluralRules`).
2. **Three registries must agree** — adding/registering a language touches all three, and missing one silently falls back to English on that surface:
   - `i18n/resources.ts` — eager client bundle (interface `_core`+`components`+`tools`, error, accessibility) + the `supportedLanguages` array that drives the nav dropdown.
   - `lib/i18n/ensureShard.ts` — `SHARD_LOADERS` map that lazy-loads `forms.json`+`panels.json` per language for the tool panels.
   - `lib/i18n/server.tsx` — `LOCALES` map bundling all 9 shards for React Server Components (`getServerT(ns, locale)` / `<ServerTrans locale>`), with per-key fallback to en-US.
3. **Server-rendered static views** (about, how-it-works, tutorials index, tutorials/content-studio, blog index, privacy-policy, terms-of-service, pricing, account, 404) currently resolve locale **per request from the `mm-language` cookie** via `lib/i18n/requestLocale.ts`, and each view already accepts and threads a `locale?: string` prop down to `getServerT`/`<ServerTrans>`. The `LanguageSelector` (`components/language-selector.tsx`, rendered in `components/top-nav.tsx`) writes the cookie + localStorage and calls `router.refresh()`.
4. **The cost of the cookie approach — the main thing THIS task fixes**: reading `cookies()` flipped those routes from SSG (`○`) to per-request SSR (`ƒ`). Before the i18n change, `/about`, `/blog`, `/pricing`, `/tutorials`, etc. were prerendered static. The goal is to restore SSG by moving locale into the URL path and `generateStaticParams`, per the official guide `node_modules/next/dist/docs/01-app/02-guides/internationalization.md`.
5. **Client re-render plumbing** already handles late resources: `i18n/index.ts` initializes i18next with `bindI18n: "languageChanged loaded"`, `bindI18nStore: "added removed"`.

### Known deliberate decisions — do not undo

- "**Darkroom**" is the user-facing brand for Content Studio; code identifiers, API paths, analytics keep `studio`. Never rename identifiers. `components/darkroom/` is the design system, unrelated to the editor.
- The consent flow's "type DELETE to confirm" literal stays **English** — `components/consent/consent-preferences.tsx` compares `confirmText !== 'DELETE'` hardcoded. The ru strings intentionally instruct typing the English word DELETE.
- Brand names, file formats/codecs (MP4, H.264…), tool/model names (FFmpeg, Real-ESRGAN…) stay untranslated in every language.
- `/embed/*` is framed by CreaTV under a CSP contract (`next.config.ts`) — its URLs and behavior must not change. `/dr/*` is a private partner portal — not localized, not in sitemaps.
- AdSense review is pending — anything reducing crawlable content or changing indexed English URLs is a regression. **Existing English URLs must not change.**

---

## The deliverables

1. **Locale-prefixed routes with SSG restored** for all public pages: English stays at the existing unprefixed URLs; other languages live at `/ru/...`, `/uk/...`, `/he/...`, `/de/...`, `/es/...`. All of these prerender statically via `generateStaticParams`.
2. **Four new languages registered end-to-end** — 🇺🇦 Ukrainian `uk-UA`, 🇮🇱 Hebrew `he-IL` (**`dir: 'rtl'`**), 🇩🇪 German `de-DE`, 🇪🇸 Spanish `es-ES`. For now their 9 shard files are **verbatim copies of the en-US files** (they will be translated in later dedicated sessions), but they must be fully registered: dropdown entries, routes, all three registries, sitemap/hreflang. Selecting them must work and simply display English.
3. **A complete hardcoded-English sweep**: every user-visible hardcoded English string on the site moves into the translation files with an English key **and a real Russian translation** (the copied uk/he/de/es files just gain the same English strings).
4. All existing validation gates green: `npm run typecheck && npm run lint && npm test && npm run build`, plus the new parity test (Phase 6).

---

## Phase 0 — Read the docs, then plan the route tree

Read before writing any code:

- `node_modules/next/dist/docs/01-app/02-guides/internationalization.md` — the `app/[lang]` + `generateStaticParams` + proxy pattern this plan follows.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` — **`proxy.ts` replaces `middleware.ts` in this Next version**; check the export name, matcher config, and rewrite/redirect APIs.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md` and `page.md` — route groups with multiple root layouts, async `params`, `PageProps<'/[lang]'>` / `LayoutProps` typed helpers.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md` and the `sitemap` file-convention doc (for `alternates.languages` hreflang support).
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md` (and `global-not-found` if present in this version) — how 404 works once routes move into a dynamic segment.

Then inventory the current route tree (`find app -name page.tsx`) and produce a short written migration map in your plan before moving files.

## Phase 1 — Locale registry + copy-paste locale files

1. Create a single source of truth for the six locales (extend `i18n/resources.ts` or a small new `i18n/locales.ts` imported by everything else):

   | i18next code | URL prefix | Native label | English label | Flag | dir |
   |---|---|---|---|---|---|
   | `en-US` | *(none — unprefixed)* | English | English | 🇺🇸 | ltr |
   | `ru-RU` | `/ru` | Русский | Russian | 🇷🇺 | ltr |
   | `uk-UA` | `/uk` | Українська | Ukrainian | 🇺🇦 | ltr |
   | `he-IL` | `/he` | עברית | Hebrew | 🇮🇱 | **rtl** |
   | `de-DE` | `/de` | Deutsch | German | 🇩🇪 | ltr |
   | `es-ES` | `/es` | Español | Spanish | 🇪🇸 | ltr |

   Include helpers: `urlPrefixToCode`, `codeToUrlPrefix`, `isSupportedPrefix`. The `SupportedLanguage` interface in `resources.ts` already has `dir?: 'ltr' | 'rtl'` — set it for Hebrew.
2. Copy the nine en-US shard files verbatim into `i18n/locales/uk-ua/`, `i18n/locales/he-il/`, `i18n/locales/de-de/`, `i18n/locales/es-es/` (script the copy; do not retype). **These stay byte-identical to en-US in this task** — later translation sessions will overwrite them.
3. Register all four new languages in **all three registries** (resources.ts imports+spreads+`supportedLanguages`, ensureShard.ts `SHARD_LOADERS`, server.tsx `LOCALES`). This alone makes the dropdown show six working entries.

## Phase 2 — Route migration: `app/(localized)/[lang]/` + `proxy.ts`

**URL scheme (decided):** English keeps every existing unprefixed URL. Other locales get the short prefix (`/ru/about`, `/he/tools/compress-image`). Implementation:

1. Split the route tree with **route groups so there are two root layouts**:
   - `app/(localized)/[lang]/layout.tsx` — the localized root layout (moved from `app/layout.tsx`): renders `<html lang={...} dir={...}>` from the `lang` param (map URL prefix → full code; Hebrew gets `dir="rtl"`), fonts, theme bootstrap, providers, TopNav/footer chrome. Add `generateStaticParams()` returning the **five prefixed locales** (`ru`, `uk`, `he`, `de`, `es`) **plus `en`** (see step 3), and validate the param — unknown values call `notFound()`.
   - `app/(system)/…` — `/dr/**` and `/embed/**` move here with their own root layout preserving today's exact behavior (they already have nested layouts; give the group a minimal root layout equivalent to the current one). **Do not alter their URLs.** `robots.ts`, `sitemap.ts`, icons, `app/globals.css` handling stay top-level (metadata routes don't need a layout — verify against the docs).
2. Move every public page under `app/(localized)/[lang]/`: `page.tsx` (home), `about`, `how-it-works`, `tutorials/**` (all 6), `blog/**` (index + 3 guides), `tools/**` (index, `[slug]`, the 4 dedicated tool pages), `pricing`, `privacy-policy`, `terms-of-service`, `account`, and the not-found view. Each page reads `const { lang } = await params`, maps prefix → full locale code, and passes it where the cookie locale went before — **the `locale` prop threading through all the static views already exists; reuse it.**
3. Create `proxy.ts` (repo root or as the docs specify) that:
   - **Rewrites** unprefixed public paths to the `en` segment internally (`/about` → `/en/about`) so English URLs never change. The `en`-prefixed static output exists because `generateStaticParams` includes `en`.
   - **Redirects** (permanent) any explicit `/en/...` request to the unprefixed URL, so English never has two live URLs (duplicate content).
   - Passes through untouched: `/ru|uk|he|de|es/...`, `/dr/**`, `/embed/**`, `/api/**` (if present), `/_next/**`, `/sw.js`, `robots.txt`, `sitemap.xml`, icon/static files. Get the matcher right from `proxy.md` — and confirm rewrites serve prerendered static pages under `next start` (they do in current Next, but verify).
   - **No automatic locale detection/redirects** based on `Accept-Language` or cookie — a crawler and a user at the same URL must always get the same content (SEO/AdSense safety). The stored preference is only used by client-side UI (see Phase 3).
4. **Remove the cookie-rendering mechanism**: pages stop calling `getRequestLocale()` (delete `lib/i18n/requestLocale.ts` or reduce it to the preference-cookie name constant), so nothing in the localized tree reads request-time APIs. **Acceptance check:** `npm run build` route table shows `○`/`●` (static/SSG) for all localized public routes — not `ƒ`. `/pricing` should return to its ISR design (`revalidate = 300`, restore its original comment about staying prerendered). `/account` may stay dynamic if it genuinely needs request data — check what it does; its labels come from params now either way.
5. 404 handling: a catch-all inside `[lang]` (e.g. `app/(localized)/[lang]/[...rest]/page.tsx` calling `notFound()`) plus the group's `not-found.tsx` rendering the existing localized `NotFoundView` with the segment's locale; keep a sensible root-level 404 for paths outside both groups. Follow whatever this Next version's docs prescribe.
6. Internal links: within the localized tree, links to public pages must preserve the current locale (`/ru/about` must not link back to English `/tools`). Build a small helper — e.g. `useLocalizedHref()` (client) and a `localizeHref(href, lang)` util (server) — and apply it to nav, footer, RelatedLinks, in-copy `<Link>`s (the `ServerTrans` component maps like `linkTutorials`), breadcrumbs, and the home-page chips. This is fiddly and easy to miss — grep for `href="/` across `views/`, `components/` and fix systematically; leave `/dr`, `/embed`, external URLs, and `mailto:` alone.

## Phase 3 — Client-side language: URL-driven, hydration-safe

1. **The URL is now the source of truth for language.** The client i18next instance must render the same language the server HTML was built with, or hydration flashes wrong-language text:
   - Pass the locale from `app/(localized)/[lang]/layout.tsx` into the client `Providers` (`app/providers.tsx` moves with the layout) and initialize react-i18next with it **before first client render**.
   - Beware the module-level i18next singleton in `i18n/index.ts` when client components are SSR'd: a shared server-side singleton is a cross-request race once locales differ per URL. Use the standard App Router pattern — `createInstance()` per server render inside a `TranslationsProvider` client component (`I18nextProvider`), memoized on the client. Consult react-i18next's SSR/App-Router docs; keep `useLocalization`'s public API unchanged so no call sites change.
   - `detectInitialLanguage()` (localStorage/cookie/navigator sniffing) is no longer how the active language is chosen — it only informs the *switcher's* "suggest my language" affordance if you keep one. Simplest correct behavior: active language = URL locale, full stop.
2. **Rewire `LanguageSelector`**: choosing a language now **navigates** to the same path under the new locale prefix (strip current prefix → add new; en → unprefixed), via `router.push`. Keep writing the `mm-language` localStorage/cookie as a *preference record* (harmless, useful later), but nothing server-side reads it for rendering anymore. `router.refresh()` is no longer needed. Keep updating `document.documentElement.lang/dir` — though with the layout rendering `<html lang dir>` per segment, verify whether manual syncing is still required at all after navigation.
3. **RTL scope guard for Hebrew**: setting `dir="rtl"` on `<html>` is required and sufficient for this task. The site's CSS uses physical utilities (`ml-*`, `text-left`) in places, so full RTL visual polish is explicitly **out of scope** — do not restyle components; just ensure nothing crashes and text direction flips. Note remaining RTL issues, if any, at the end of your run for a future task.
4. `lib/i18n/ensureShard.ts` keeps working as-is (it keys off `i18n.language`); just confirm the language-changed listener still fires under the new provider setup, and that all six languages are in `SHARD_LOADERS`.

## Phase 4 — SEO: metadata, hreflang, sitemap

1. `lib/metadata.ts` / `lib/seo.ts`: `buildMetadata(path)` becomes locale-aware — `buildMetadata(path, locale)`:
   - **Canonical** per locale (`SITE_ORIGIN + localized path`).
   - **`alternates.languages`** (hreflang) listing all six locales' URLs for that path + `x-default` → the English URL.
   - Localized `<title>`/`description`: follow the existing partial-override pattern (see `i18n/toolPageContent.ts`) — en copy in `lib/seo.ts` stays the source of truth; add a per-locale override map with **real Russian** titles/descriptions for the core pages, everything else falling back to English. Do not fork `lib/seo.ts`'s structure.
2. `app/sitemap.ts`: emit each existing entry once with `alternates.languages` for all six locales (Next's sitemap type supports this — check the doc), keeping the same review-safe allowlist of paths. English URLs remain the primary `url` values.
3. JSON-LD (`components/seo/json-ld.tsx`): pages pass localized paths; verify nothing hardcodes the unprefixed path in a way that breaks under `/ru/...`.
4. `robots.ts`: unchanged (allowlist logic already excludes `/dr`).

## Phase 5 — The hardcoded-English sweep

Goal: **every user-visible hardcoded English string** goes through `t()` (client) or `getServerT`/`ServerTrans` (server), with an en-US key and a **real Russian translation** added to `i18n/locales/ru-ru/`. The four copied locales automatically inherit the English string (update their files with the same new en keys so parity holds — script this, since they're still byte-copies).

**Confirmed offenders to fix first** (user-reported on the home page):

- `views/file-converter-app.tsx` lines ~828–830 — the three review chips hardcoded as `Compress image`, `Resize image`, `Extract audio` (the sibling chips just above them are properly translated `home.hero.*` keys — add matching keys, e.g. `home.hero.compressImage`, `home.hero.resizeImage`, `home.hero.extractAudio`).
- `components/home/home-content.tsx` — the entire file: `STEPS` array (3 titles + bodies), `eyebrow="How it works"`, `title="Three steps, no account"`, `eyebrow="Popular conversions"`, `title="Jump straight to a tool"`, and the "More detail in how it works, or browse all tools." prose (use `ServerTrans` with link components). This is a server component rendered on `/` — new keys belong in a shard that `lib/i18n/server.tsx` reads (put them in `interface/pages.json` under a new `home.content` section; it is server-only so bundle size is unaffected).
- `components/home/home-content.tsx` `POPULAR` grid — tool **names and taglines** come from `content/toolPages.ts` (data, not JSX). Localize them via the pre-built override mechanism: `i18n/toolPageContent.ts` `TOOL_PAGE_OVERRIDES` — add a `ru-RU` entry with translated `name` + `tagline` for the review-allowlisted slugs (`content/reviewAllowlist.ts`), and make `HomeContent` (and the `/tools` index if it shows the same fields) read through `getLocalizedToolPages(locale)`. **Translating the rest of `toolPages.ts` (h1s, body copy, FAQs of all ~65 tool pages) and `content/keywordMap.ts` is explicitly deferred** — the override mechanism means later sessions can add it incrementally.

**Then sweep the whole site systematically.** Method:

1. Grep for hardcoded display strings in `views/`, `components/`, `app/(localized)/`:
   - JSX text nodes: `grep -rnE '>[A-Z][a-z].*<' --include='*.tsx'` (noisy but effective), plus string props: `aria-label="`, `title="`, `placeholder="`, `alt="` with literal English (≈50 hardcoded `aria-label`s exist today), toast/`alert` messages, `label:`/`title:`/`description:` fields in local const arrays.
   - Exclude: `/dr/**` and `/embed/**` components (out of scope), `console.*`, code literals compared in logic (like `'DELETE'`), analytics event names/payloads (never localize those), test files, and design-system-internal strings never shown to users.
2. For each finding: add an en key in the appropriate shard (respect the existing shard ownership: `_core` = chrome/nav/footer/home, `components.json` = shared components, `forms.json`/`panels.json` = tool surfaces (client, lazy — keep them there so bundle discipline holds), `pages.json` = server-rendered page copy, `accessibility/*` = aria labels, `error/_core` = error strings), swap the code to `t()`/`getServerT`, and add the Russian translation. Match the existing Russian register: «вы» form, «е» not «ё», Скачать/Загрузить/Конвертировать conventions — read the existing ru files for the established glossary before writing new strings.
3. **The long-form article bodies are in scope** and are the biggest chunk: `views/blog/{video-compression,image-optimization,audio-quality}-guide.tsx` (≈1250 lines) and `views/tutorials/{ai-frame-interpolation,audio,image,video}-*.tsx` (≈850 lines) render hardcoded English articles. The codebase already anticipated this — `interface/tools.json` holds `_placeholder` stubs (`tutorialAiFrameInterpolation`, `blogVideoCompression`, …) saying the articles "still render English text directly in the .tsx file until migrated to use t()". Migrate each article's copy into a **new server-only shard** `interface/articles.json` per locale (register it in `lib/i18n/server.tsx` only — NOT in `resources.ts`, keeping ~everything out of client bundles exactly like `pages.json`), using `returnObjects` arrays for paragraph lists as the existing legal pages do, then produce the full Russian translations. This is a lot of translation volume — parallel subagents (one per article, with the glossary and plural rules from the ru files) are the right tool, followed by an independent key-parity + placeholder check like the one in Phase 6. If session limits force a split, finish the chrome/home/aria sweep first and do articles in a follow-up session — but leave the parity test green either way.
4. Keep `t()` keys stable and semantic (`blogVideoCompression.intro.p1`), never positional, and replace the `_placeholder` stubs when the real keys land.

## Phase 6 — Enforcement + validation

1. **Add a Vitest parity test** (e.g. `i18n/localeParity.test.ts`) that walks all six locales against en-US and asserts: identical key trees (normalizing `_one/_few/_many/_other` ↔ `_one/_other`), identical array lengths, and identical `{{placeholder}}` sets per string. This makes "someone added an en key and forgot a locale" a test failure forever. (For the four copied locales this passes trivially until they're translated.)
2. Run the full gate: `npm run typecheck && npm run lint && npm test && npm run build`. Lint has ~78 pre-existing warnings in untouched files; introduce zero new errors.
3. Build-output checks:
   - Route table: all `(localized)` public routes are static (`○`/`●`), ×6 locales; `/dr` and `/embed` unchanged; `/pricing` back on ISR.
   - Grep the prerendered HTML output for leaked raw keys (`interface:` / `interface\.`), for every locale.
   - Spot-check `/ru/...` HTML files contain Cyrillic where expected, and `/he/...` documents carry `dir="rtl"`.
4. **Do not** commit/push, run dev servers, drive a browser, or run DB commands — static gates only; the user verifies UI themselves.
5. Report at the end: route-table before/after, sweep coverage (files touched, keys added per shard, anything deliberately left English and why), any RTL issues noted for later, and any `toolPages.ts`/`keywordMap.ts` surfaces still English by the deferral above.

---

## Out of scope (deliberately)

- Translating uk-UA / he-IL / de-DE / es-ES content (separate later sessions; files exist as en copies).
- Full `content/toolPages.ts` + `content/keywordMap.ts` translation beyond the home-page names/taglines override.
- RTL visual polish beyond `dir="rtl"`.
- `/dr/**` and `/embed/**` localization.
- Localizing analytics event names/payloads (never do this); if a language-switch event seems useful, check `media-manipulator-analytics/` for existing event naming conventions first and keep it consistent.
