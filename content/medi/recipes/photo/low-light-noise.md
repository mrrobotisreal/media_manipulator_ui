---
id: "low-light-noise"
editor: "photo"
title: "Clean up a noisy low-light photo"
intents: ["it is grainy", "reduce the noise", "night photo is noisy", "clean up the speckles", "phone photo in the dark"]
difficulty: "intermediate"
ops_example: true
tools: ["reduce-image-noise"]
---

## When to use

High-ISO photos: night, concerts, indoors without light.

## What a pro does and why

Colour noise (coloured blotches) can be removed strongly with little loss; luminance noise needs a lighter touch or the image turns waxy. A professional removes colour noise first, then some luminance noise, then restores edges with gentle, high-threshold sharpening.

## Ops

```json
{
  "summary": "Reduce noise",
  "ops": [
    {"op": "add_layer", "type": "noiseReduction", "params": {"luminance": 30, "color": 55}},
    {"op": "add_layer", "type": "sharpen", "params": {"amount": 40, "radius": 1, "threshold": 12}}
  ]
}
```

## How to adjust

Looks plastic: luminance 15. Colour blotches remain: color 75. Leave a little texture rather than removing it all.

## Success criteria

- meanLuma 0.3-0.5
