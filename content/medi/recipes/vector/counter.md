---
id: "counter"
editor: "vector"
title: "Number counter"
intents: ["animated number counter", "count up to 10000", "stats animation", "number goes up", "counting animation"]
difficulty: "intermediate"
ops_example: true
tools: ["motion"]
---

## When to use

Stats and milestones: "10,000 users".

## What a pro does and why

Counting reads well over 1 to 2 s with an ease-out so it slows near the final value; the label stays still. SVG text has no number track, so the template builds stepped text frames (hold easing) for the count.

## Ops

```json
{
  "summary": "Count to 10,000",
  "ops": [
    {"op": "template", "kind": "counter", "value": 10000, "text": "users", "at": 0, "duration": 1800}
  ]
}
```

The `template` op builds the layers and keyframes in one step (MM110 `lib/vector/templates.ts`); its options are kind, text, colors, at and duration.

## How to adjust

Too fast: duration 2500. Formatting (commas, %) is part of `text` around the number.
