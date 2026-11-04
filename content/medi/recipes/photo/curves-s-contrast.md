---
id: "curves-s-contrast"
editor: "photo"
title: "Add contrast with an S-curve"
intents: ["more contrast", "add punch", "it looks flat", "s curve", "deeper blacks and brighter whites"]
difficulty: "intermediate"
ops_example: true
tools: ["photo-curves", "adjust-image-contrast"]
---

## When to use

The image looks flat or foggy.

## What a pro does and why

An S-curve darkens shadows and brightens highlights while the midpoint stays put, which feels more natural than the contrast slider. Small moves (0.03 to 0.06) are plenty.

## Ops

```json
{
  "summary": "S-curve contrast",
  "ops": [
    {"op": "add_layer", "type": "curves", "params": {"master": {"points": [{"x": 0, "y": 0}, {"x": 0.25, "y": 0.2}, {"x": 0.75, "y": 0.8}, {"x": 1, "y": 1}]}}}
  ]
}
```

## How to adjust

Stronger: 0.25→0.17 and 0.75→0.83. Colours become too saturated: set the layer `blend` to `luminosity`. Faded film feel: raise the first point to y 0.06.
