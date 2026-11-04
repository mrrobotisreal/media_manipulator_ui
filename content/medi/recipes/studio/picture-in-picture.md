---
id: "picture-in-picture"
editor: "studio"
title: "Picture in picture (webcam over screen)"
intents: ["picture in picture", "put the webcam in the corner", "small video over the main one", "reaction video layout", "facecam"]
difficulty: "intermediate"
ops_example: true
tools: ["content-studio"]
---

## When to use

Tutorials, reactions, gaming: a second video small in a corner.

## What a pro does and why

The overlay clip goes on the upper video track, scaled to 25 to 35 % and placed in a corner with a margin. Bottom-right is the convention; avoid where captions sit.

## Ops

```json
{
  "summary": "Webcam bottom-right",
  "ops": [
    {"op": "set_transform", "clipId": "OVERLAY_CLIP_ID", "scale": 0.3, "x": 0.32, "y": 0.3}
  ]
}
```

x and y are fractions of the frame from the centre (positive x = right, positive y = down).

## How to adjust

Covers something: move to top-right (y -0.3). Too small: scale 0.38.
