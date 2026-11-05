---
id: "bullet-reveal"
editor: "vector"
title: "Bullet points that reveal one by one"
intents: ["reveal bullet points one by one", "animate a list", "staggered text", "points appear one after another", "list animation"]
difficulty: "intermediate"
ops_example: true
tools: ["motion"]
---

## When to use

Lists, steps, features: anything read in order.

## What a pro does and why

Each line fades in and rises about 12 px over 0.3 s, staggered 0.1 to 0.15 s apart, so the eye follows the order. The template builds the lines and staggers them.

## Ops

```json
{
  "summary": "Bullet reveal",
  "reason": "You asked for bullets one by one: each line enters in sequence",
  "ops": [
    {"op": "template", "kind": "bulletReveal", "text": ["Fast export", "Works in the browser", "No install"], "at": 0}
  ]
}
```

The `template` op builds the layers and keyframes in one step (MM110 `lib/vector/templates.ts`); its options are kind, text, colors, at and duration.

## How to adjust

Slower reading pace: duration longer, or stagger 250 ms. Different spacing: move lines with `animate` on `transform.y`.
