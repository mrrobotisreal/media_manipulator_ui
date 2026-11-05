---
id: "logo-draw-on"
editor: "vector"
title: "Logo reveal by drawing the outline"
intents: ["logo reveal", "draw my logo", "animate the logo outline", "signature animation", "line drawing reveal"]
difficulty: "intermediate"
ops_example: true
tools: ["motion", "convert-png-to-svg"]
---

## When to use

A vector logo (SVG) should appear as if drawn, then fill in.

## What a pro does and why

The classic reveal draws the strokes over 1 to 1.5 s, then fades the fill in over the last 0.4 s, then holds. The `drawOn` animator handles the stroke-dash maths; a fill-opacity fade finishes it. Raster logos must be vectorized first (the PNG-to-SVG tool).

## Ops

```json
{
  "summary": "Logo draw-on reveal",
  "reason": "You asked for the logo to draw itself: a stroke animator reveals the outline over time",
  "ops": [
    {"op": "apply_animator", "layerIds": ["LOGO_PATH_ID"], "animator": "drawOn", "span": {"start": 0, "end": 1400, "easing": "easeBoth"}}
  ]
}
```

Use every outline path id of the logo from the digest in `layerIds`. The fill fade at the end is part of the ready-made version, `{"op":"template","kind":"logoReveal","at":0}` on the selected logo.

## How to adjust

Faster: end 900. Lines appear all at once: give each path its own span, staggered by 150 ms.
