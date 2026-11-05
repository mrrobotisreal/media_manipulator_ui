---
id: "blur-in"
editor: "vector"
title: "Blur-in entrance"
intents: ["blur in", "text comes into focus", "soft focus entrance", "dreamy text reveal", "fade in with blur"]
difficulty: "basic"
ops_example: true
tools: ["motion"]
---

## When to use

Elegant entrances for text or images.

## What a pro does and why

Combine a short blur that clears (about 0.5 s) with an opacity fade; a slight scale from 1.05 to 1 adds depth. The `blur` animator keys the filter.

## Ops

```json
{
  "summary": "Blur-in",
  "reason": "You asked for a blur-in: the layer starts blurred and sharpens as it appears",
  "ops": [
    {"op": "apply_animator", "layerIds": ["LAYER_ID"], "animator": "blur", "span": {"start": 0, "end": 500, "easing": "easeOut"}},
    {"op": "animate", "layerId": "LAYER_ID", "property": "opacity", "keyframes": [{"t": 0, "value": 0, "easing": "easeOut"}, {"t": 400, "value": 1, "easing": "linear"}]}
  ]
}
```

## How to adjust

Softer: span end 800. Safari note: blur exports through the animation runtime, not plain CSS.
