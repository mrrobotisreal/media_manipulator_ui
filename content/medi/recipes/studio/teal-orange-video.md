---
id: "teal-orange-video"
editor: "studio"
title: "Teal and orange for video"
intents: ["teal and orange video", "blockbuster colours", "orange skin teal background", "action movie look", "hollywood grade"]
difficulty: "basic"
ops_example: true
tools: ["adjust-video-color"]
---

## When to use

Travel, action and city footage with people in it.

## What a pro does and why

Skin sits in the orange band; pushing the rest of the image towards teal separates people from backgrounds. The `teal-orange` look does it with a strength control.

## Ops

```json
{
  "summary": "Teal and orange",
  "reason": "You asked for teal and orange: a built-in look gives warm skin against cool shadows",
  "ops": [
    {"op": "apply_look", "clipIds": "all", "lookId": "teal-orange", "intensity": 0.7}
  ]
}
```

Clip ids come from the timeline digest; `"all"` grades every video and image clip.

## How to adjust

Skin too orange: intensity 0.5. Subtler: try `cinematic`.

## Success criteria

- meanLuma 0.3-0.5
- highlightsClipped <= 0.02
