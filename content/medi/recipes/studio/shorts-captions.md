---
id: "shorts-captions"
editor: "studio"
title: "Caption styling for Shorts, Reels and TikTok"
intents: ["style captions for tiktok", "big captions", "subtitles for shorts", "captions in the middle", "readable subtitles"]
difficulty: "basic"
ops_example: true
tools: ["generate-vtt-captions", "srt-generator"]
---

## When to use

Vertical social videos, which are mostly watched without sound.

## What a pro does and why

Short-form captions are large (5 to 7 % of the height), high contrast, with a solid background box and short lines, kept away from the bottom where the app's own buttons and text sit. Captions must exist first: generating them is an AI job, suggested as an action.

## Ops

```json
{
  "summary": "Shorts caption style",
  "ops": [
    {"op": "set_caption_style", "fontSizePct": 6.5, "color": "#FFFFFF", "backgroundColor": "#000000", "backgroundOpacity": 0.7, "position": "bottom", "maxWidthPct": 80}
  ]
}
```

If the digest says captions are off, answer with `suggest_action {kind: "generate_captions"}` first, then style them.

## How to adjust

Hidden by app buttons: position top. Too big: 5. Brand look: a coloured `backgroundColor`.
