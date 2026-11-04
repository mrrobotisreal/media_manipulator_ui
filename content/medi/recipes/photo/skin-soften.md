---
id: "skin-soften"
editor: "photo"
title: "Soften skin naturally"
intents: ["soften the skin", "smooth skin", "portrait retouch", "reduce wrinkles a little", "beauty retouch"]
difficulty: "intermediate"
ops_example: true
tools: ["remove-blemishes"]
---

## When to use

Close portraits where skin texture is harsher than the user wants.

## What a pro does and why

Natural retouching lowers mid-frequency contrast (clarity and texture) on skin only and keeps eyes and hair sharp. The built-in `portrait-soften` look does a balanced version on the whole image; restricting it to skin colours with a colour-range mask keeps the rest crisp. Single spots are a job for Heal.

## Ops

```json
{
  "summary": "Soft skin",
  "ops": [
    {"op": "add_layer", "type": "clarity", "params": {"amount": -25}, "mask": {"components": [{"kind": "colorRange", "colors": [{"r": 224, "g": 172, "b": 150}, {"r": 190, "g": 130, "b": 105}], "fuzziness": 45}]}},
    {"op": "add_layer", "type": "texture", "params": {"amount": -20}, "mask": {"components": [{"kind": "colorRange", "colors": [{"r": 224, "g": 172, "b": 150}, {"r": 190, "g": 130, "b": 105}], "fuzziness": 45}]}}
  ]
}
```

Pick the two skin colours from the frame (a lit and a shadowed patch). Quick whole-image version: `{"op":"apply_preset","presetId":"portrait-soften"}`.

## How to adjust

Plastic look: clarity -12, texture -10. Background also softened: lower `fuzziness` to 30. Spots and blemishes: suggest `heal` (one AI operation per heal).
