---
id: "straighten-and-crop"
editor: "photo"
title: "Straighten and crop for the destination"
intents: ["straighten the horizon", "it is crooked", "crop for instagram", "make it square", "crop to 4:5"]
difficulty: "basic"
ops_example: true
tools: ["straighten-photo", "crop-image"]
---

## When to use

Tilted horizons, and any crop for a platform (Instagram 4:5, stories 9:16, YouTube 16:9).

## What a pro does and why

Straighten first, then crop, so the crop does not need to change. Small angles (under 3 degrees) are usually the fix; read the tilt from the frame. Then use the destination aspect and keep the subject on a rule-of-thirds line.

## Ops

```json
{
  "summary": "Straighten and crop 4:5",
  "ops": [
    {"op": "set_geometry", "straighten": -2, "crop": {"aspect": "4:5"}}
  ]
}
```

## How to adjust

Wrong direction: flip the sign. Subject cut off: use a crop `rect` that keeps it. Mirror image: `flipH` true.
