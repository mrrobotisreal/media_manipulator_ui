---
id: "lut-intensity"
editor: "photo"
title: "Tame a LUT that is too strong"
intents: ["the lut is too strong", "reduce the lut", "blend the lut", "lut intensity", "soften the colour look"]
difficulty: "basic"
ops_example: true
tools: ["apply-lut-to-photo"]
---

## When to use

A LUT layer already exists (the user loaded a .cube file) and the look is too heavy.

## What a pro does and why

Most creative LUTs are designed for log footage and look harsh on normal photos. Mixing the LUT at 40 to 70 % is the usual fix. Medi cannot create a LUT; the user loads the .cube file in the LUT panel.

## Ops

```json
{
  "summary": "LUT at 60 %",
  "reason": "The LUT look is too strong, so I bring its intensity down to 60 percent",
  "ops": [
    {"op": "update_layer", "layerId": "LAYER_ID_FROM_DIGEST", "params": {"intensity": 0.6}}
  ]
}
```

Use the id of the `lut` layer from the digest.

## How to adjust

Still heavy: 0.4. Contrast too strong: also set the layer `blend` to `color` so it changes colour but not brightness.
