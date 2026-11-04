---
id: "motion-path-follow"
editor: "vector"
title: "Move along a path"
intents: ["move along a path", "follow a curve", "plane flying along a route", "animate on a path", "motion path"]
difficulty: "intermediate"
ops_example: true
tools: ["motion"]
---

## When to use

Something should travel along a curve: a plane on a map, a ball arc, a dot on a route.

## What a pro does and why

The `motionPath` animator moves the layer along a guide path over the span; auto-orient rotates it to follow the direction. Ease in-out reads as natural acceleration.

## Ops

```json
{
  "summary": "Follow the path",
  "ops": [
    {"op": "apply_animator", "layerIds": ["LAYER_ID"], "animator": "motionPath", "span": {"start": 0, "end": 2000, "easing": "easeBoth"}, "options": {"pathId": "GUIDE_PATH_ID", "autoOrient": true}}
  ]
}
```

## How to adjust

Should not rotate: `autoOrient` false. Speed: change `end`.
