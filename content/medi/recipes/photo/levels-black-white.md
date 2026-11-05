---
id: "levels-black-white"
editor: "photo"
title: "Set black and white points with Levels"
intents: ["use levels", "the image has no true black", "set the white point", "foggy photo fix", "stretch the histogram"]
difficulty: "intermediate"
ops_example: true
tools: ["photo-levels"]
---

## When to use

The histogram does not reach either end (scans, haze, flat phone shots).

## What a pro does and why

Moving the input black and white points to where the data starts and ends restores full range; the gamma slider then sets midtone brightness. Read the clipping from the digest histogram stats.

## Ops

```json
{
  "summary": "Levels black and white",
  "reason": "The histogram does not reach the ends, so I set the black and white points",
  "ops": [
    {"op": "add_layer", "type": "levels", "params": {"master": {"inBlack": 0.05, "inWhite": 0.94, "gamma": 1.05}}}
  ]
}
```

## How to adjust

Shadows crush: `inBlack` 0.02. Too bright: `gamma` 0.95. Colour cast: adjust the r/g/b channels the same way.

## Success criteria

- shadowsClipped <= 0.01
- highlightsClipped <= 0.01
- lumaStd >= 0.18
