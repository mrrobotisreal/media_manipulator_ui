---
id: "cinematic-grade"
editor: "studio"
title: "Cinematic grade"
intents: ["make it cinematic", "movie look", "film look for my video", "cinematic colour grade", "make it look like a film"]
difficulty: "basic"
ops_example: true
tools: ["content-studio", "adjust-video-color"]
---

## When to use

Vlogs, travel, short films: anything that should feel like cinema rather than a phone video.

## What a pro does and why

A cinematic grade is restrained: slightly lower saturation, a touch of extra contrast, warm skin against cooler surroundings, and often a 2.39:1 letterbox. The `cinematic` look bundles the grade; letterbox bars are two black rectangles on a title clip over the whole timeline.

## Ops

```json
{
  "summary": "Cinematic grade",
  "ops": [
    {"op": "apply_look", "clipIds": "all", "lookId": "cinematic", "intensity": 0.8}
  ]
}
```

Clip ids come from the timeline digest; `"all"` grades every video and image clip. Letterbox: add a `title` with two full-width black rectangles, or crop with `set_canvas` only if the user wants a different frame.

## How to adjust

Too strong: `intensity` 0.5. Want more colour: use the `teal-orange` look. Darker, heavier: `moody`.
