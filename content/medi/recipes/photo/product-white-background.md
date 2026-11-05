---
id: "product-white-background"
editor: "photo"
title: "Clean white background for product photos"
intents: ["make the background pure white", "product photo for a shop", "clean white backdrop", "ecommerce photo", "studio white background"]
difficulty: "intermediate"
ops_example: true
tools: ["brighten-image", "remove-background-from-image"]
---

## When to use

Product on a light but grey or uneven backdrop.

## What a pro does and why

Marketplaces want a background at or very near pure white. Brighten only the bright tones with a luminosity mask so the product keeps its contrast, and remove any colour cast so the white is neutral. If the background is busy, background removal is the right tool instead.

## Ops

```json
{
  "summary": "White background",
  "ops": [
    {"op": "add_layer", "type": "levels", "params": {"master": {"inWhite": 0.86}}, "mask": {"components": [{"kind": "luminosity", "lo": 0.7, "hi": 1, "feather": 0.1}]}},
    {"op": "add_layer", "type": "vibranceSaturation", "params": {"saturation": -60}, "mask": {"components": [{"kind": "luminosity", "lo": 0.75, "hi": 1, "feather": 0.1}]}}
  ]
}
```

## How to adjust

Product edges glow: raise luminosity `lo` to 0.8. Background still grey: `inWhite` 0.8. Many photos: see the bulk product workflow.

## Success criteria

- highlightsClipped <= 0.6
- meanLuma 0.6-0.85
