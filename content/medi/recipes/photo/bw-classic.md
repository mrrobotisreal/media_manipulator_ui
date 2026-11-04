---
id: "bw-classic"
editor: "photo"
title: "Classic black and white"
intents: ["black and white", "convert to monochrome", "make it grayscale", "classic bw photo", "timeless black and white"]
difficulty: "basic"
ops_example: true
tools: ["black-and-white-photo", "grayscale-image"]
---

## When to use

Portraits, street, architecture; any image where colour distracts.

## What a pro does and why

A good conversion is not plain greyscale: each colour range gets its own brightness. The `bw-film` look gives a balanced film-like mix with a gentle S-curve and grain; `bw-high-contrast` darkens blues and adds clarity for drama. Portraits usually want reds and yellows bright so skin glows.

## Ops

```json
{
  "summary": "Black and white (film)",
  "ops": [
    {"op": "apply_preset", "presetId": "bw-film"}
  ]
}
```

## How to adjust

More drama: switch to `bw-high-contrast`. Skin too dark: add a `blackWhite` layer with `reds` 70 and `yellows` 70. Warm tone like old prints: `blackWhite` `tint` with hue 35, saturation 15.
