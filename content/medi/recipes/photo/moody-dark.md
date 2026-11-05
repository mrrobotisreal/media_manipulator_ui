---
id: "moody-dark"
editor: "photo"
title: "Moody, dark and desaturated"
intents: ["make it moody", "dark and atmospheric", "dramatic look", "muted colours", "cinematic and dark"]
difficulty: "intermediate"
ops_example: true
tools: ["split-toning", "add-vignette"]
---

## When to use

Portraits, streets, forests or anything that should feel quiet, heavy or dramatic.

## What a pro does and why

Mood comes from dark, controlled highlights, deep but not crushed blacks, fewer colours and a colour split: cool shadows with slightly warm highlights. A vignette pulls the eye inward. A professional keeps skin from going grey by using saturation -20 to -30, not lower.

## Ops

```json
{
  "summary": "Moody grade",
  "ops": [
    {"op": "add_layer", "type": "tone", "params": {"highlights": -30, "shadows": -10, "blacks": -20}},
    {"op": "add_layer", "type": "vibranceSaturation", "params": {"saturation": -25}},
    {"op": "add_layer", "type": "splitTone", "params": {"shadows": {"hue": 210, "saturation": 20}, "highlights": {"hue": 40, "saturation": 12}, "balance": -10}},
    {"op": "add_layer", "type": "vignette", "params": {"amount": -30, "midpoint": 45, "feather": 60}}
  ]
}
```

## How to adjust

Too dark: raise `shadows` to 5. Too grey: saturation -15. Colder: shadow hue 220, saturation 30. Less obvious edges: vignette `amount` -15. Warmer overall: highlight saturation 20.

## Success criteria

- meanLuma 0.2-0.38
- shadowsClipped <= 0.03
