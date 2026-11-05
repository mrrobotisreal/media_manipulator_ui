---
id: "color-balance-grade"
editor: "photo"
title: "Subtle colour grade with Colour Balance"
intents: ["cool shadows warm highlights", "colour grade subtly", "colour balance", "add a slight tint to shadows", "film colour feel"]
difficulty: "intermediate"
ops_example: true
tools: ["color-balance-photo"]
---

## When to use

A gentle, deliberate colour feel without a strong look.

## What a pro does and why

Colour Balance shifts shadows, midtones and highlights separately. Classic grading: cool (blue) shadows and warm highlights, small numbers, with luminosity preserved so brightness does not change.

## Ops

```json
{
  "summary": "Cool shadows, warm highlights",
  "reason": "You asked for a graded look: cool shadows and warm highlights separate subject from background",
  "ops": [
    {"op": "add_layer", "type": "colorBalance", "params": {"shadows": {"r": -6, "g": 0, "b": 12}, "highlights": {"r": 8, "g": 3, "b": -6}, "preserveLuminosity": true}}
  ]
}
```

## How to adjust

More obvious: double the shadow blue. Greenish: add r +3 in midtones. Undo the feel: lower layer opacity.
