---
id: "spin-loader"
editor: "vector"
title: "Looping spinner or rotating icon"
intents: ["make a loading spinner", "rotate forever", "spinning icon", "loop rotation", "loader animation"]
difficulty: "basic"
ops_example: true
tools: ["motion"]
---

## When to use

Loaders, rotating badges, gears.

## What a pro does and why

A spinner is a constant-speed rotation from 0 to 360 degrees with linear easing and loop on, so there is no visible pause at the seam. Rotate around the centre.

## Ops

```json
{
  "summary": "Looping spin",
  "reason": "You asked for a loader: a looping rotation that repeats forever",
  "ops": [
    {"op": "animate", "layerId": "LAYER_ID", "property": "transform.rotation", "keyframes": [{"t": 0, "value": 0, "easing": "linear"}, {"t": 1000, "value": 360, "easing": "linear"}]},
    {"op": "set_duration", "ms": 1000},
    {"op": "set_loop", "loop": true}
  ]
}
```

## How to adjust

Slower: 1600 ms for both. Wobble instead: rotate -8 to 8 degrees with ease-in-out.
