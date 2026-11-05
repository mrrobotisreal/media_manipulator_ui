---
id: "vertical-reframe"
editor: "studio"
title: "Reframe a horizontal video for vertical"
intents: ["make it vertical", "convert to 9:16", "reframe for tiktok", "shorts from a landscape video", "portrait version"]
difficulty: "intermediate"
ops_example: true
tools: ["crop-video", "resize-video"]
---

## When to use

Turning a 16:9 video into a 9:16 Short, Reel or TikTok.

## What a pro does and why

Change the canvas to 9:16, then scale each clip up so it fills the height (about 3.2× for 16:9 into 9:16) and move it so the subject stays in frame. A slightly smaller scale with a blurred copy behind is an alternative for wide shots.

## Ops

```json
{
  "summary": "Reframe to 9:16",
  "reason": "You want a vertical video, so I switch the canvas to 9:16 and recentre the clip",
  "ops": [
    {"op": "set_canvas", "aspect": "9:16"},
    {"op": "set_transform", "clipId": "CLIP_ID", "scale": 3.16, "x": 0}
  ]
}
```

Move `x` towards the subject (negative = left) using the preview frame; repeat per clip.

## How to adjust

Subject cut off: adjust `x` per clip, or keyframe `positionX` to follow it. Too zoomed: scale 2.5 and accept bars.
