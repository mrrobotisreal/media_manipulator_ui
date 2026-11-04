---
id: "posterize-invert"
editor: "photo"
title: "Graphic effects: posterize and invert"
intents: ["posterize", "pop art look", "invert the colours", "negative effect", "poster style"]
difficulty: "basic"
ops_example: true
tools: ["posterize-image", "invert-image-colors"]
---

## When to use

Graphic, poster or pop-art styles, or a negative.

## What a pro does and why

Posterize reduces each channel to a few levels; 4 to 8 levels reads as a poster. Invert flips every colour (a photographic negative). Both are effects, not corrections, so they are often combined with high contrast or a single colour.

## Ops

```json
{
  "summary": "Poster effect",
  "ops": [
    {"op": "add_layer", "type": "brightnessContrast", "params": {"contrast": 25}},
    {"op": "add_layer", "type": "posterize", "params": {"levels": 5}}
  ]
}
```

Negative: `{"op":"add_layer","type":"invert","params":{}}`.

## How to adjust

Too blocky: levels 8. More graphic: add a `threshold` layer at `level` 0.5 for pure black and white.
