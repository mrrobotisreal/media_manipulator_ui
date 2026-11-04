---
id: "split-and-delete"
editor: "studio"
title: "Cut out a section"
intents: ["cut out this part", "remove the middle section", "delete from here to there", "trim the boring part", "remove a mistake"]
difficulty: "basic"
ops_example: true
tools: ["video-trimmer"]
---

## When to use

A part of a clip should go.

## What a pro does and why

Split at both ends of the unwanted part and ripple-delete it so the rest closes the gap. Always confirm the times before deleting.

## Ops

```json
{
  "summary": "Cut 10–14 s",
  "ops": [
    {"op": "split", "clipId": "CLIP_ID", "at": 10},
    {"op": "split", "clipId": "NEW_CLIP_ID", "at": 14},
    {"op": "delete_clip", "clipId": "MIDDLE_CLIP_ID", "ripple": true}
  ]
}
```

Ask with `ask_user` before running a delete; ids of the new pieces come from the digest after the splits.

## How to adjust

Cut too much: undo (one step) and split 0.5 s later. Jarring: add a short cross dissolve.
