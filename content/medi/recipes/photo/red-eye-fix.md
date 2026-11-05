---
id: "red-eye-fix"
editor: "photo"
title: "Fix red eyes"
intents: ["red eyes", "fix red eye", "flash made the eyes red", "remove red pupils", "eyes glow red"]
difficulty: "intermediate"
ops_example: true
tools: []
---

## When to use

Flash portraits with red pupils.

## What a pro does and why

Red-eye correction desaturates and darkens red pixels, but only inside a small mask on each eye so lips and clothes are untouched. Place a small radial component on each pupil from the frame (normalised coordinates).

## Ops

```json
{
  "summary": "Fix red eyes",
  "reason": "The pupils read red, so I desaturate and darken only those spots",
  "ops": [
    {"op": "add_layer", "type": "redEye", "params": {}, "mask": {"components": [{"kind": "radial", "center": {"x": 0.42, "y": 0.38}, "rx": 0.02, "ry": 0.02, "feather": 0.3}, {"kind": "radial", "center": {"x": 0.55, "y": 0.38}, "rx": 0.02, "ry": 0.02, "feather": 0.3}]}}
  ]
}
```

## How to adjust

Red ring remains: enlarge `rx`/`ry` to 0.03. Eye positions unclear: ask the user or point them to the Red-eye panel to click each eye.
