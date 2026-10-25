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
| `unsupported.json` | `raw` layers (pattern, filter, foreignObject, SMIL, `<a>`, `<switch>`), `ids` on raw layers |

`inputs/*.json`: non-canonical documents that must parse (defaults filled).
`invalid/*.json`: documents that must be rejected (`version` 2 or missing,
dangling gradient/mask/use refs, duplicate ids, `use` cycles, raw markup with
`<script`/`on*=`/external `href`, tracks on missing layers or bad property
names, bad ids, external image hrefs, `attrs` handlers, unknown layer types).
Both directories are part of the contract too.

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
