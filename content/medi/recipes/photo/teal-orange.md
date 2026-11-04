---
id: "teal-orange"
editor: "photo"
title: "Teal and orange (blockbuster look)"
intents: ["teal and orange", "hollywood look", "blockbuster colour", "movie poster colours", "cinematic colour grade"]
difficulty: "intermediate"
ops_example: true
tools: ["split-toning", "color-balance-photo"]
---

## When to use

People in cities, beaches, action shots; anything that should look like a big-budget film still.

## What a pro does and why

Skin sits in the orange range and its opposite is teal, so pushing shadows towards teal and highlights towards orange separates people from the background. A professional then protects skin (keep the orange range natural) and keeps the effect moderate.

## Ops

```json
{
  "summary": "Teal and orange grade",
  "ops": [
    {"op": "add_layer", "type": "splitTone", "params": {"shadows": {"hue": 190, "saturation": 35}, "highlights": {"hue": 30, "saturation": 28}, "balance": 10}},
    {"op": "add_layer", "type": "colorBalance", "params": {"shadows": {"r": -8, "g": 0, "b": 10}, "highlights": {"r": 8, "g": 2, "b": -6}}},
    {"op": "add_layer", "type": "brightnessContrast", "params": {"contrast": 12}}
  ]
}
```

## How to adjust

Too strong: lower both split-tone saturations by 10. Skin looks orange: highlight saturation 18. More teal: shadow hue 185, saturation 45.
