<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Naming: "Darkroom" = Content Studio

The multi-track video editor is branded **Darkroom** in all user-visible copy, but keeps **Content Studio** / `studio` in every code identifier (routes, dirs, API paths, analytics `feature: 'studio'`). The rename is cosmetic-only by decision — never rename identifiers or break the CreaTV embed contract. Note: `components/darkroom/` is the site-wide **design system** ("Darkroom Instrument"), unrelated to the editor. Full glossary: `CONTEXT.md`.
<!-- END:nextjs-agent-rules -->
