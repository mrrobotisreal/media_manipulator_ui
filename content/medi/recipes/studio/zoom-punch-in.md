---
id: "zoom-punch-in"
editor: "studio"
title: "Punch-in zoom for emphasis"
intents: ["zoom in on my face", "punch in", "add a zoom for emphasis", "zoom on the punchline", "quick zoom"]
difficulty: "basic"
ops_example: true
tools: ["content-studio"]
---

## When to use

Talking videos: emphasise a line with a quick zoom, a classic YouTube technique.

## What a pro does and why

A punch-in is a fast scale change (1.0 to 1.2 within 0.2 s) held for the line, then back. It works best on 4K or 1080p sources so the zoom stays sharp.

## Ops

```json
{
  "summary": "Punch-in zoom",
  "ops": [
    {"op": "set_keyframes", "clipId": "CLIP_ID", "property": "scale", "keyframes": [{"t": 3, "value": 1, "ease": "easeOut"}, {"t": 3.2, "value": 1.2, "ease": "hold"}, {"t": 5, "value": 1, "ease": "linear"}]}
  ]
}
```

## How to adjust

Too big: 1.12. Hard cut instead of move: ease `hold` on the first keyframe.
