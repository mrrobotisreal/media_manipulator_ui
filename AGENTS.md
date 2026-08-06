<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Naming: "Darkroom" = Content Studio

The multi-track video editor is branded **Darkroom** in all user-visible copy, but keeps **Content Studio** / `studio` in every code identifier (routes, dirs, API paths, analytics `feature: 'studio'`). The rename is cosmetic-only by decision — never rename identifiers or break the CreaTV embed contract. Note: `components/darkroom/` is the site-wide **design system** ("Darkroom Instrument"), unrelated to the editor. Full glossary: `CONTEXT.md`.

## Testing

`npm test` (Vitest, single CI-style pass) is a **required local gate** alongside `npm run typecheck && npm run lint && npm run build`. Unit tests are co-located `*.test.ts` files next to their sources (e.g. `lib/studio/previewEngine.test.ts`); config is `vitest.config.mts` per the official Next.js Vitest guide. Tests must need no network, DB, server, or real browser — jsdom is the environment, but the suites cover pure logic. Playwright/E2E and parity-harness suites remain **workstation-only**: write them here, never run them on this machine.
<!-- END:nextjs-agent-rules -->
