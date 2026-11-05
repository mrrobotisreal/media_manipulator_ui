---
id: "overexposed-recovery"
editor: "photo"
title: "Recover a bright, washed-out photo"
intents: ["too bright", "washed out", "overexposed", "the sky is blown out", "tone it down"]
difficulty: "basic"
ops_example: true
tools: ["fix-photo-exposure"]
---

## When to use

Highlights are close to white and the picture looks pale: snow, beach, bright sky, flash too close.

## What a pro does and why

Detail that is truly white cannot come back, but near-white detail can. Lower exposure gently, then pull `highlights` and `whites` hard so bright areas regain texture, and drop `blacks` a little so the image keeps depth.

## Ops

```json
{
  "summary": "Recover highlights",
  "reason": "The highlights are close to clipping, so I pull them down to recover detail",
  "ops": [
    {"op": "add_layer", "type": "exposure", "params": {"ev": -0.5}},
    {"op": "add_layer", "type": "tone", "params": {"highlights": -60, "whites": -25, "blacks": -10}}
  ]
}
```

## How to adjust

Now too dark overall: set `ev` to -0.3. Sky still flat white: that area clipped in camera; say so honestly. Looks dull: add `vibranceSaturation` with `vibrance` 15.

## Success criteria

- meanLuma 0.4-0.6
- highlightsClipped <= 0.01
