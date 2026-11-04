---
id: "tint-photo-filter"
editor: "photo"
title: "Tint a photo with a colour filter"
intents: ["tint the photo blue", "add a colour filter", "make it sepia", "colour wash", "warming filter"]
difficulty: "basic"
ops_example: true
tools: ["tint-photo"]
---

## When to use

The user wants an overall colour wash.

## What a pro does and why

The photo filter simulates a coloured glass filter while preserving luminosity, so it tints without darkening. Density 15 to 35 is natural; higher is a deliberate wash.

## Ops

```json
{
  "summary": "Blue filter",
  "ops": [
    {"op": "add_layer", "type": "photoFilter", "params": {"color": "#0f7fff", "density": 25, "preserveLuminosity": true}}
  ]
}
```

## How to adjust

Sepia: color `#a2702f`, density 40 on top of a black-and-white layer. Subtler: density 12.
