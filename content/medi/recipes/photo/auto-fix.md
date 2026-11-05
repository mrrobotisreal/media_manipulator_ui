---
id: "auto-fix"
editor: "photo"
title: "One-click fix, then refine"
intents: ["fix this photo", "make it look better", "auto enhance", "quick fix", "improve the photo"]
difficulty: "basic"
ops_example: true
tools: ["aperture", "fix-photo-exposure"]
---

## When to use

The user wants a general improvement with no specific direction.

## What a pro does and why

Start from the image's own histogram: `auto_tone` runs the same analysis as the built-in `auto` look (levels, exposure and white balance from the photo). A professional then adds a modest vibrance lift instead of saturation, because vibrance protects skin and already-strong colours.

## Ops

```json
{
  "summary": "Auto tone and a little colour",
  "ops": [
    {"op": "auto_tone"},
    {"op": "add_layer", "type": "vibranceSaturation", "params": {"vibrance": 15}}
  ]
}
```

## How to adjust

Too strong: lower the opacity of the auto layers to 0.6 with `update_layer`. Colours too loud: set `vibrance` to 5. Then ask what feels off (brightness, colour, sharpness) and use the matching recipe.

## Success criteria

- meanLuma 0.38-0.58
- shadowsClipped <= 0.01
- highlightsClipped <= 0.01
