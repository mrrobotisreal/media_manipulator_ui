---
id: "hue-shift-object"
editor: "photo"
title: "Change the colour of one thing (hue shift)"
intents: ["change the colour of the shirt", "make the green car blue", "shift the hue", "recolour an object", "different colour for the dress"]
difficulty: "intermediate"
ops_example: true
tools: ["adjust-image-hue", "change-image-color"]
---

## When to use

One colour in the image should become another.

## What a pro does and why

An HSL layer with a single range moves only that hue. Pick the range centre from the frame, keep the width tight, and shift `hue` by the difference (green 120 to blue 240 is +120, the maximum is 180). Mask it to the object when other things share the colour.

## Ops

```json
{
  "summary": "Shift greens to blue",
  "reason": "The greens are the target, so I shift only that hue range toward blue",
  "ops": [
    {"op": "add_layer", "type": "hsl", "params": {"ranges": [{"id": "target", "center": 120, "width": 35, "feather": 25, "hue": 120, "saturation": 5, "lightness": 0}]}}
  ]
}
```

## How to adjust

Edges keep the old colour: `width` 50. Other objects change too: add a radial or colour-range mask. Looks fake: lower saturation by 10 and match lightness.
