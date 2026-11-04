---
id: "freeze-frame"
editor: "studio"
title: "Freeze frame"
intents: ["freeze the frame", "pause on this moment", "hold the picture", "freeze here and add text", "still frame in the video"]
difficulty: "basic"
ops_example: true
tools: ["content-studio"]
---

## When to use

Emphasising a moment, often with a title over it ("that's me").

## What a pro does and why

Hold one frame for 1 to 3 s at the exact moment, optionally with a slight zoom and a title. A freeze cannot also be sped up or reversed.

## Ops

```json
{
  "summary": "Freeze 2 s",
  "ops": [
    {"op": "freeze_frame", "clipId": "CLIP_ID", "at": 4.2, "duration": 2}
  ]
}
```

## How to adjust

Too long: 1 s. Add impact: a `title` op at the same time.
