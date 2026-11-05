---
id: "shape-morph"
editor: "vector"
title: "Morph one shape into another"
intents: ["morph this shape", "turn the circle into a star", "shape transformation", "morph icons", "path morph"]
difficulty: "advanced"
ops_example: true
tools: ["motion"]
---

## When to use

Icon transitions (play to pause, menu to close), playful shape changes.

## What a pro does and why

Morph interpolates the path data. It looks best between shapes of similar size with a 0.4 to 0.8 s ease-in-out; very different point counts are normalised automatically but can twist.

## Ops

```json
{
  "summary": "Morph to target",
  "reason": "You asked for a morph: the shape animates its path toward the target shape",
  "ops": [
    {"op": "apply_animator", "layerIds": ["SOURCE_PATH_ID"], "animator": "morph", "span": {"start": 0, "end": 600, "easing": "easeBoth"}, "options": {"targetId": "TARGET_PATH_ID"}}
  ]
}
```

Both ids come from the digest; the target is usually hidden after the morph is applied.

## How to adjust

Twisting: draw the target with a similar starting point. Slower: end 900.
