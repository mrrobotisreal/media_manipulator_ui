---
id: "sharpen-for-web"
editor: "photo"
title: "Sharpen for screens and social"
intents: ["make it sharper", "it looks soft", "sharpen for instagram", "crisper details", "a bit blurry"]
difficulty: "basic"
ops_example: true
tools: ["sharpen-photo-online", "sharpen-image"]
---

## When to use

Slightly soft photos, or any image downsized for the web.

## What a pro does and why

Screen sharpening uses a small radius (0.6 to 1.2 px) and moderate amount; a threshold keeps flat areas like skin and sky smooth so noise is not sharpened. Real motion blur cannot be fixed by sharpening; say so.

## Ops

```json
{
  "summary": "Web sharpening",
  "reason": "A web export loses crispness when scaled down, so I add light output sharpening",
  "ops": [
    {"op": "add_layer", "type": "sharpen", "params": {"amount": 80, "radius": 0.9, "threshold": 4}}
  ]
}
```

## How to adjust

Halos on edges: amount 50 or radius 0.6. Noise looks gritty: threshold 10. Large print: radius 1.5. Very blurry: suggest the AI upscaler or restoration tool pages.
