---
id: "audio-volume-balance"
editor: "studio"
title: "Balance clip loudness"
intents: ["this clip is too quiet", "one part is louder", "balance the volume", "make the voice louder", "volume is uneven"]
difficulty: "basic"
ops_example: true
tools: ["normalize-audio", "adjust-audio-volume"]
---

## When to use

Clips recorded at different levels.

## What a pro does and why

Set clip gain so speech peaks feel similar, then use export loudness normalisation for the final level. Small steps (3 to 6 dB) are usually enough; boosting a very quiet clip also boosts its noise.

## Ops

```json
{
  "summary": "Quiet clip +4 dB",
  "reason": "This clip is quieter than the others, so I raise it by 4 dB to match",
  "ops": [
    {"op": "set_volume", "clipId": "CLIP_ID", "gainDb": 4}
  ]
}
```

## How to adjust

Still quiet: +6 dB. Distorts: back to +2 and use the podcast preset (compression) instead.
