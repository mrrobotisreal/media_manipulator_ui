---
id: "manual-cinematic-grade"
editor: "studio"
title: "Hand-built cinematic grade with Lumetri"
intents: ["grade it like a movie by hand", "lower saturation and add contrast", "film grade without a lut", "subtle cinematic colour", "warm cinematic tone"]
difficulty: "intermediate"
ops_example: true
tools: ["adjust-video-color"]
---

## When to use

The user wants control over the grade, or a look adjusted to one clip.

## What a pro does and why

The Lumetri numbers behind a film look: contrast up about 10 %, saturation down 10 to 20 %, a small warm temperature shift and a little vibrance so skin keeps life while the rest is muted. Exposure only if the clip is under or over.

## Ops

```json
{
  "summary": "Cinematic Lumetri grade",
  "ops": [
    {"op": "grade", "clipIds": "all", "lumetri": {"contrast": 1.1, "saturation": 0.85, "temperature": 8, "vibrance": 0.15}}
  ]
}
```

Clip ids come from the timeline digest; `"all"` grades every video and image clip.

## How to adjust

Too muted: saturation 0.95. Too warm: temperature 3. Flat: contrast 1.2. Cooler night feel: temperature -12, tint 4.
