---
id: "landscape-punch"
editor: "photo"
title: "Landscape punch: depth, clarity and colour"
intents: ["make the landscape pop", "more vivid scenery", "punchy nature photo", "clearer mountains", "enhance a travel photo"]
difficulty: "basic"
ops_example: true
tools: ["image-saturation", "adjust-image-contrast"]
---

## When to use

Scenery that looks hazy, flat or dull.

## What a pro does and why

The `landscape` look combines dehaze, vibrance, clarity and a highlight/shadow balance: the standard landscape workflow. `vivid` is a lighter version (vibrance and clarity) and `punch` adds contrast, vibrance and sharpening for social posts.

## Ops

```json
{
  "summary": "Landscape punch",
  "ops": [
    {"op": "apply_preset", "presetId": "landscape"}
  ]
}
```

## How to adjust

Too much: `intensity` 0.6. Haze remains: add `dehaze` 15. Oversaturated greens: hsl range greens saturation -20. Lighter touch: use `vivid`; for a social post use `punch`.
