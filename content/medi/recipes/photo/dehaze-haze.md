---
id: "dehaze-haze"
editor: "photo"
title: "Cut haze and fog"
intents: ["it looks hazy", "remove the fog", "clear up the haze", "the view is milky", "foggy landscape fix"]
difficulty: "basic"
ops_example: true
tools: ["adjust-image-contrast"]
---

## When to use

Distant landscapes, city views through smog, shots through glass.

## What a pro does and why

Dehaze restores contrast that scales with haze depth; a little goes a long way. Follow with deeper blacks and a touch of vibrance because removing haze also removes colour cast.

## Ops

```json
{
  "summary": "Remove haze",
  "reason": "The distance looks washed out, so I add contrast and clarity to cut the haze",
  "ops": [
    {"op": "add_layer", "type": "dehaze", "params": {"amount": 30}},
    {"op": "add_layer", "type": "tone", "params": {"blacks": -10}},
    {"op": "add_layer", "type": "vibranceSaturation", "params": {"vibrance": 10}}
  ]
}
```

## How to adjust

Sky turns too dark or blue: dehaze 15. Want the fog as mood: use negative dehaze (-20).
