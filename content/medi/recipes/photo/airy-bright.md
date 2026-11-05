---
id: "airy-bright"
editor: "photo"
title: "Light and airy"
intents: ["bright and airy", "light and clean", "soft pastel look", "make it feel fresh", "wedding style bright"]
difficulty: "basic"
ops_example: true
tools: ["brighten-image"]
---

## When to use

Weddings, food, interiors, lifestyle: the picture should feel light, clean and soft.

## What a pro does and why

Airy means bright midtones and open shadows with low contrast, gently lifted blacks and slightly reduced saturation, with a warm white balance so whites do not go blue. A professional avoids clipping: brightness comes from midtones and shadows, not from pushing whites.

## Ops

```json
{
  "summary": "Airy look",
  "reason": "You asked for an airy look: lift the shadows and whites, soften the contrast",
  "ops": [
    {"op": "add_layer", "type": "exposure", "params": {"ev": 0.4}},
    {"op": "add_layer", "type": "tone", "params": {"shadows": 30, "blacks": 15, "highlights": -10}},
    {"op": "add_layer", "type": "curves", "params": {"master": {"points": [{"x": 0, "y": 0.05}, {"x": 0.5, "y": 0.56}, {"x": 1, "y": 1}]}}},
    {"op": "add_layer", "type": "vibranceSaturation", "params": {"saturation": -10, "vibrance": 5}},
    {"op": "add_layer", "type": "whiteBalance", "params": {"temperature": 8}}
  ]
}
```

## How to adjust

Too washed: remove the curves layer or lower its first point to y 0.02. Too warm: `temperature` 3. Brighter still: `ev` 0.6 while watching highlights.

## Success criteria

- meanLuma 0.55-0.7
- highlightsClipped <= 0.03
