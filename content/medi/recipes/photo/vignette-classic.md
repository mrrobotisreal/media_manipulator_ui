---
id: "vignette-classic"
editor: "photo"
title: "A subtle vignette"
intents: ["add a vignette", "darken the corners", "frame the subject", "soft dark edges", "old lens look"]
difficulty: "basic"
ops_example: true
tools: ["add-vignette"]
---

## When to use

To focus attention on the centre or add a lens feel.

## What a pro does and why

A good vignette is barely noticed: amount -20 to -35, a wide midpoint, a soft feather, and highlight protection so bright corners (sky) do not go grey.

## Ops

```json
{
  "summary": "Subtle vignette",
  "ops": [
    {"op": "add_layer", "type": "vignette", "params": {"amount": -28, "midpoint": 45, "roundness": 0, "feather": 65, "highlights": 30}}
  ]
}
```

## How to adjust

Too visible: amount -15. More oval: `roundness` -40. White vignette for an airy feel: amount 25.
