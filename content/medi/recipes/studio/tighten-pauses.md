---
id: "tighten-pauses"
editor: "studio"
title: "Tighten pauses with markers"
intents: ["remove the pauses", "tighten the edit", "cut out silences", "make it faster paced", "jump cuts"]
difficulty: "intermediate"
ops_example: true
tools: ["content-studio", "transcribe-video"]
---

## When to use

Talking-head videos with long gaps.

## What a pro does and why

Jump cuts remove silence so speech keeps moving. Without word timings Medi cannot hear the pauses; in v1 it marks the spots the user points out (or that are visible as gaps in the waveform) and splits there, and the user deletes the gap with ripple delete. Each cut should keep about 0.1 to 0.2 s of breath so speech does not sound clipped.

## Ops

```json
{
  "summary": "Mark pauses to cut",
  "reason": "The long pauses slow the pace, so I mark them as candidates to cut",
  "ops": [
    {"op": "add_marker", "at": 14.2, "label": "Pause start"},
    {"op": "add_marker", "at": 15.9, "label": "Pause end"}
  ]
}
```

Then ask before deleting: `split` at both marks and `delete_clip` with `ripple` true removes the gap. Ask first because deleting is destructive.

## How to adjust

Too choppy: leave 0.3 s. Want automatic silence removal: say it is not available yet; captions with timings help find pauses.
