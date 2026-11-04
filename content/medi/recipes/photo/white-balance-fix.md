---
id: "white-balance-fix"
editor: "photo"
title: "Fix a colour cast (too yellow, too blue)"
intents: ["it looks too yellow", "too blue", "fix the colour cast", "white balance", "the whites look orange"]
difficulty: "basic"
ops_example: true
tools: ["white-balance-photo", "tint-photo"]
---

## When to use

Indoor light makes everything orange, shade makes it blue, fluorescent light makes it green.

## What a pro does and why

Temperature moves blue to yellow, tint moves green to magenta. Correct in the opposite direction of the cast while looking at something that should be neutral (white wall, grey street, white shirt). The `warm` and `cool` looks are small creative shifts once neutral.

## Ops

```json
{
  "summary": "Neutral white balance",
  "ops": [
    {"op": "add_layer", "type": "whiteBalance", "params": {"temperature": -20, "tint": 5}}
  ]
}
```

Sign: a yellow/orange cast needs negative `temperature`, a blue cast positive; green needs positive `tint`, magenta negative.

## How to adjust

Overcorrected: halve the values. Want a cosy feel afterwards: apply `warm`; a crisp winter feel: `cool`.
