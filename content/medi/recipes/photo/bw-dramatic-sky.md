---
id: "bw-dramatic-sky"
editor: "photo"
title: "Dramatic black and white with a dark sky"
intents: ["dramatic black and white", "dark sky black and white", "moody monochrome landscape", "ansel adams look", "high contrast bw"]
difficulty: "intermediate"
ops_example: true
tools: ["black-and-white-photo"]
---

## When to use

Landscapes and architecture with blue sky and clouds.

## What a pro does and why

Film photographers used a red filter to turn blue sky nearly black and make clouds glow. The `blackWhite` mixer does the same: blues and cyans far down, reds and yellows up. Contrast and clarity then add bite.

## Ops

```json
{
  "summary": "Dramatic BW, dark sky",
  "reason": "You want drama: black and white with the sky pulled darker for contrast",
  "ops": [
    {"op": "add_layer", "type": "blackWhite", "params": {"reds": 80, "yellows": 70, "greens": 30, "cyans": -20, "blues": -60, "magentas": 60}},
    {"op": "add_layer", "type": "brightnessContrast", "params": {"contrast": 30}},
    {"op": "add_layer", "type": "clarity", "params": {"amount": 25}}
  ]
}
```

## How to adjust

Sky too black or noisy: `blues` -30. Foliage too dark: `greens` 60. Less gritty: clarity 10.
