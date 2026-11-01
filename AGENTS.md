<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Naming: "Darkroom" = Content Studio

The multi-track video editor is branded **Darkroom** in all user-visible copy, but keeps **Content Studio** / `studio` in every code identifier (routes, dirs, API paths, analytics `feature: 'studio'`). The rename is cosmetic-only by decision — never rename identifiers or break the CreaTV embed contract. Note: `components/darkroom/` is the site-wide **design system** ("Darkroom Instrument"), unrelated to the editor. Full glossary: `CONTEXT.md`.

## Testing

`npm test` (Vitest, single CI-style pass) is a **required local gate** alongside `npm run typecheck && npm run lint && npm run build`. Unit tests are co-located `*.test.ts` files next to their sources (e.g. `lib/studio/previewEngine.test.ts`); config is `vitest.config.mts` per the official Next.js Vitest guide. Tests must need no network, DB, server, or real browser — jsdom is the environment, but the suites cover pure logic. Playwright/E2E and parity-harness suites remain **workstation-only**: write them here, never run them on this machine.
<!-- END:nextjs-agent-rules -->

## Code navigation: graphify knowledge graph

`graphify-out/graph.json` (gitignored, local) is an AST + docs knowledge graph of this repo: ~9.5k nodes (every file, component, function, type, import/call edge) plus concepts from `CONTEXT.md`, `README.md` and `docs/`, grouped into ~220 named communities (e.g. "Darkroom Embed Bridge (CreaTV)", "Motion Raster Frames", "Translator Draft Store"). Use it instead of chains of grep:

- Before the first grep/search/source read for a codebase question, run `graphify query "<question>"` (add `--budget 2000` to cap output). Use `graphify explain "<Symbol or file.tsx>"` for one node and its neighbours and `graphify path "<A>" "<B>"` for how two things connect. Read raw files only for the lines the graph pointed to. Put this rule in every subagent prompt that explores code.
- `graphify-out/GRAPH_REPORT.md` is the architecture overview (god nodes, communities, cohesion); read it only for broad review.
- After changing code, run `graphify update .` (AST only, ~15s, no LLM) so the graph stays current. Doc changes (`*.md`) need `/graphify --update` to re-extract their concepts.
- If `graphify-out/` is missing (fresh clone or worktree), build it with `/graphify .`. Exclusions live in `.graphifyignore` (locale JSON, goldens/fixtures, media/fonts).
