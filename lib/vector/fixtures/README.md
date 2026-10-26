# `VectorDoc` v1 fixtures: the shared contract with MM43

These files are **the cross-side contract** between the UI's Zod model
(`lib/vector/vectorTypes.ts`) and the API's Go sanitizer
(`media_manipulator_api/internal/vector/doc.go`, MM43), exactly like
`lib/studio/ease.fixtures.json` is for keyframe curves. Copy them
**byte-identical** into `internal/vector/testdata/` and change both sides in
the same change, or neither.

## Shared contract (copy to Go testdata)

Canonical documents. Each must parse, and re-serialise to the same bytes:

| File | Covers |
|---|---|
| `defaults.json` | the proposed defaults: 512×512, `transparent`, 3000 ms, 24 fps (canonical form of `inputs/defaults.json`) |
| `animated.json` | a full `Track` set: presets, `cubicBezier`, `hold`, colour values, `gradientStop[i].color`, `strokeDashoffset`, `motionPath` + `extras` |
| `additive.json` | unknown keys at every level (doc, canvas, defs, layer) survive (additive rule); `locked`, `attrs`, `image` data URI |
| `shapes.json` | rect, circle → ellipse, ellipse, line, polyline, polygon, path, transform |
| `gradients.json` | linear + radial, `href` template inheritance, `gradientTransform`, `spreadMethod`, stop opacity |
| `masks.json` | mask with content units, blur filter |
| `clippath.json` | clipPath (user space + objectBoundingBox with transform) on a group and a shape |
| `text.json` | single-line text with font fields; multi-line text as a `raw` layer |
| `use-symbol.json` | `symbol` with viewBox, `use` of a symbol and of a layer |
| `nested-groups.json` | nested groups, anchored transform, root presentation attributes, hidden layer |
| `unsupported.json` | `raw` layers (pattern, filter, SMIL, `<a>`, `<switch>`), `ids` on raw layers; `foreignObject`, `<script>`, handlers, external refs and un-inlinable `<style>` are gone |

`inputs/*.json`: non-canonical documents that must parse (defaults filled).
`invalid/*.json`: documents that must be rejected (`version` 2 or missing,
dangling gradient/mask/use refs, duplicate ids, `use` cycles, raw markup with
`<script`/`on*=`/external or unquoted `href`/CDATA/`<iframe>`/`<style>`/
entity-encoded `javascript:`, tracks on missing layers or bad property names,
bad ids, external image hrefs, `attrs` names outside the allowlist, CSS-escaped
paints, a `url()` background, unknown layer types).
Both directories are part of the contract too.

## Safety rules the Go sanitizer must mirror

- `rawMarkupIssues` (`vectorTypes.ts`): no `<script`, no
  `iframe|object|embed|frame|frameset|applet|meta|link|base|form|input|button|textarea|select|template|noscript|portal|style`
  elements, no CDATA / comments / declarations, no character references other
  than `&amp; &lt; &gt; &quot; &apos;` and the whitespace refs, no `on*=`, no
  `srcdoc|formaction|srcset|ping|background=`, no `javascript:|vbscript:|data:text/html`,
  no unquoted attributes, `href`/`src` only `#id` or a base64 raster data URI,
  no animated `href`, no `url()` other than `url(#id)`, no `image-set(`, no
  `@import`, no backslash inside an attribute value.
- `PAINT_PATTERN` / `COLOR_PATTERN` for every paint, stop colour and
  `canvas.background` (no backslash, no `url(` other than `url(#id)`).
- `attrs` names: the `SAFE_ATTRS` allowlist (`svgMap.ts`) or `data-*`; values
  pass the same no-escape/no-external-url rule.

## Canonical JSON

`serializeVectorDoc`: `JSON.stringify(doc, null, 2)` plus `\n`.

- Known keys in **schema order** (the order of the Zod shape, i.e. the order
  in the files above), unknown (additive) keys after them in input order.
- Optional fields are **absent** when unset, never `null`.
- `canvas.viewBox` is always present on output (derived from width/height when
  absent on input); `defs` always has all five arrays.
- Numbers as JavaScript prints them (`2.5`, `0.707`, `400`); no HTML escaping.

## SVG golden set (UI only)

`*.svg` are the importer's golden inputs; `<name>.json` is the committed
result of importing `<name>.svg`. The idempotence test
(`exportSvg.test.ts`, "SVG → doc → SVG → doc → SVG is a fixed point") runs on
every `.svg` here. Regenerate derived JSON with
`UPDATE_VECTOR_FIXTURES=1 npx vitest run lib/vector/importSvg.test.ts`, then
copy the changed JSON to the Go testdata.

## Keyframe sampler table (UI only, MM44)

`sample.fixtures.json` is **not a document** and **not shared with Go** (there
is no server-side sampling). It is the value table for `sampleTrack` /
`solveCubicBezier` (`lib/vector/sampleTrack.test.ts`). `docFixtures()` skips
`*.fixtures.json`; do not copy it to `internal/vector/testdata/`.

## `loop` (MM44, additive)

`VectorDoc.loop?: boolean` (absent = loops; `false` = plays once). It is
optional and canonical-absent when the animation loops. The Go sanitizer passes
it through today as an unknown doc key (additive rule); MM45 or MM49 should add
it to `docSpec` as an optional boolean so a non-boolean value is rejected.

## MM45 (advanced animators): what the Go sanitizer should add (MM49)

MM45 adds **no new document fields** and **no new contract fixtures**: every
property it animates was already in `TRACK_PROPERTY_PATTERN` (MM42), and the
shared fixtures are unchanged (`animated.json` already carried
`strokeDashoffset`, `gradientStop[1].color` and `motionPath` + `extras`).
What MM45 fixes is the *meaning* of values Go currently passes through
unchecked. Optional tightening for `internal/vector/doc.go` (none is needed
for correctness; the UI refuses bad values at export time):

| Where | Rule | Notes |
|---|---|---|
| `loop` (doc, MM44) | optional boolean | reject non-boolean |
| `animations[].extras` when `property == "motionPath"` | object with optional `pathId` (id pattern, must name a layer in the tree), optional `d` (string ≤ 2 000 000, path-data characters only `[MmLlHhVvCcSsQqTtAaZz0-9eE.,+\-\s]`), optional `autoOrient` (boolean) | unknown extras keys stay allowed (additive) |
| `animations[].extras.gradientId` on `gradientStop[i].*` | optional id that names a gradient | the UI falls back to the layer's fill/stroke gradient |
| keyframe `value` when `property == "d"` | string, path-data characters only (as above) | a morph key; length cap as today |
| keyframe `value` when `property` is `motionPath`, `strokeDashoffset`, `filter.blur`, `gradientStop[i].offset` | number | `filter.blur` ≥ 0; `gradientStop[i].offset` in 0..1 (clamped on render) |
| keyframe `value` when `property == "gradientStop[i].color"` | string matching `COLOR_PATTERN` | same rule as stop colours |

Morph tracks store **normalised** `d` keys (same command sequence in every
key); Go does not need to check that, a non-matching pair simply holds.

## MM46 (Lottie and code exports): nothing for the Go sanitizer

MM46 adds **no document fields** and **changes no shared contract fixture**.
The new files under `fixtures/lottie/` are Lottie JSON inputs for the UI's
reader and round-trip tests (`basic-shapes`, `transform-keys`, `fill-stroke`,
`gradient`, `morph`, `trim`, `hold`, `easing`), plus
`lottie/unsupported-export/*.json` (VectorDocs, one per writer-side
unsupported feature) and `lottie/unsupported-import/*.json` (Lottie, one per
reader-side feature). They are **not** part of the cross-side contract: do
not copy them to `internal/vector/testdata/`. `docFixtures()` lists only this
directory's top-level `*.json`, so they are not picked up as contract docs.

The Lottie writer stores one private key on its viewBox null layer,
`"mm": {"viewBox": [x, y, w, h]}` (players ignore unknown keys), and marks the
background layer `cl: "mm-background"`; these live in the exported Lottie
file, never in a `VectorDoc`.
