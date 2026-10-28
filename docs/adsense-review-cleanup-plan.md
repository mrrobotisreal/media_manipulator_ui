# AdSense Review Cleanup Plan

Goal: turn the Next.js App Router app into a clean, AdSense-review-safe site
where important public routes render real body HTML in view-source, AdSense
cannot render placeholders, only review-safe pages are indexed/sitemapped, and
Content Studio / tools / blog / tutorial routes are real working pages.

## Current scaffold state (start of this pass)

- Next.js 16.2.7, React 19.2.4, Tailwind v4, App Router at `app/`.
- Path alias `@/*` → repo root.
- Migrated from a Vite SPA; primary pages already SSG'd: `/`, `/about`,
  `/how-it-works`, `/privacy-policy`, `/terms-of-service`, `not-found`.

## App Router routes that exist (before this pass)

`/`, `/about`, `/how-it-works`, `/privacy-policy`, `/terms-of-service`,
`not-found`.

## Missing App Router routes (added this pass)

`/tools`, `/tools/content-studio`, `/tools/[slug]`, `/tutorials` (+ detail
routes), `/blog` (+ detail routes), `app/sitemap.ts`, `app/robots.ts`.

## Risks identified & mitigations

| Risk | Mitigation |
| --- | --- |
| **Placeholder ad risk** — 221 `PLACEHOLDER-*` strings in `lib/adSlots.ts` could reach `data-ad-slot`. | Refactored `lib/adSlots.ts` to a review-safe in-content-only map; placeholders replaced with real generic units or removed. `isRealAdSenseSlot` rejects anything non-numeric. Audit script fails on any `PLACEHOLDER-` in runtime/build. |
| **Global AdSense script risk** — `app/layout.tsx` loaded `pagead2.googlesyndication.com` unconditionally. | Removed the global script. AdSense JS only loads inside a guarded `<AdBanner>` when `shouldRenderAdSense()` passes (disabled by default via env). |
| **Mobile anchor ad risk** — `MobileAnchorAd` rendered globally in `app/providers.tsx`. | Removed from providers; component neutralized to render `null`. Audit fails if re-imported by active routes. |
| **Alternative ad networks** — `alternative-ad-banner.tsx` could inject AdSense/PropellerAds/Carbon/Infolinks. | Neutralized to render `null`; not imported anywhere. |
| **Static sitemap risk** — `public/sitemap.xml` listed 77 URLs incl. thin/placeholder pages. | Replaced with `app/sitemap.ts` limited to core + review-allowed tool pages. |
| **Blank Content Studio content risk** — empty `content-studio` entry in `content/toolPages.ts`. | Fully populated with original guide/FAQ/schema content; `/tools/content-studio` server-renders a substantial crawlable guide around the client editor. |
| **Client-only SEO risk** — head was mutated client-side in the Vite app. | All metadata + JSON-LD are server-rendered via the Metadata API and `<JsonLd>`. |

## Ad placement rules (review build)

- AdSense disabled by default (`NEXT_PUBLIC_ADSENSE_ENABLED=false`).
- Mock ads only in non-production when `NEXT_PUBLIC_MOCK_ADS_ENABLED=true`.
- The only eligible placement is a single **in-content** unit on individual
  `/tools/<slug>` pages, after substantial body copy, far from action buttons.
- No ads on `/`, `/tools`, `/about`, `/how-it-works`, `/privacy-policy`,
  `/terms-of-service`, `/blog`, `/tutorials`, `/404`, or auth/account pages.
- No header/footer/sidebar/anchor/post-conversion ads. No side rails. No sticky.

## Review-safe sitemap strategy

`app/sitemap.ts` emits the core routes (13 since MM85, including `/contact`),
the review-allowed tool slugs (`content/reviewAllowlist.ts`) and, since MM85
(2026-10-28, ADR-0016 ¶4), the three blog posts and six tutorials: they are
original, bylined (Mitchell Wintrow) and dated, and are the best writing on the
site. Every `lastModified` is a real date (`content/pageDates.ts`, a tool's
`lastReviewed`, a post's `dateModified`), never the build time.
`app/sitemap.test.ts` freezes the list (37 URLs with the flag off).

## Final acceptance checks

1. `npm run typecheck`, `npm run lint`, `npm run build`, `npm run audit:ads` all pass.
2. View-source of `/`, `/tools`, `/tools/content-studio`, review tool pages,
   `/about`, `/how-it-works`, `/tutorials`, `/blog`, legal pages contains real
   body copy, H1, and JSON-LD where applicable.
3. No `PLACEHOLDER-` outside `docs/adsense-slot-inventory.md`.
4. No `adsbygoogle` on disallowed pages.
5. `/sitemap.xml` contains only the review-safe URL set.
6. No `MobileAnchorAd` / side rails / sticky ads render.
7. Footer + top-nav links all resolve to real routes.

## Post-approval flip checklist (MM34)

Do this only after AdSense has approved the site. Until then
`NEXT_PUBLIC_SEO_FULL_INDEX` stays unset and everything above applies unchanged.

1. Set `NEXT_PUBLIC_SEO_FULL_INDEX=true` in the UI deploy environment and
   rebuild (it is inlined at build time; a restart alone is not enough).
2. Effect: `/sitemap.xml` grows from 25 URLs per set to core + all 75
   `content/toolPages.ts` slugs + 3 blog + 5 tutorial details + `/changelog`;
   non-allowlisted tool pages lose `noindex`; `PENDING_ALLOWLIST` pages index.
3. Verify `/sitemap.xml`, view-source of one formerly noindex tool page
   (`/tools/ai-image-upscaler`) shows `index, follow`, and `/robots.txt` still
   disallows `/admin/`, `/private/`, `/dr`, `/r/`. `/status` stays noindex.
4. Submit the sitemap in Search Console (manual, not part of the code).
5. Rollback: unset the variable and rebuild; the sitemap returns to the
   review-safe set (frozen by `app/sitemap.test.ts`).
