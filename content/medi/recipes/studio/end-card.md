---
id: "end-card"
editor: "studio"
title: "End card with a call to action"
intents: ["add an end screen", "subscribe at the end", "end card", "thanks for watching screen", "outro text"]
difficulty: "basic"
ops_example: true
tools: ["content-studio"]
---

## When to use

The last 5 to 20 seconds of a YouTube or social video.

## What a pro does and why

YouTube end screens need 5 to 20 s; leave the centre and right side clear for YouTube's own elements and put a short line (subscribe, follow, link) on the left. For social, a 2 to 3 s card with one clear action is enough.

## Ops

```json
{
  "summary": "End card",
  "ops": [
    {"op": "add_title", "template": "endCard", "lines": ["Thanks for watching", "Subscribe for more"], "start": 58, "duration": 8, "animateIn": "fade"}
  ]
}
```

`start` = the timeline duration minus the card length, from the digest.

## How to adjust

Too long for social: duration 3. Brand colour: style `fillColor`.
