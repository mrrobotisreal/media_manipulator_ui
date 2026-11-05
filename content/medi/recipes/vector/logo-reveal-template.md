---
id: "logo-reveal-template"
editor: "vector"
title: "Logo reveal template"
intents: ["quick logo animation", "intro for my logo", "logo sting", "animate a logo for youtube", "brand reveal"]
difficulty: "basic"
ops_example: true
tools: ["motion"]
---

## When to use

The user wants a finished logo animation without detail.

## What a pro does and why

The template scales the logo from 85 % to 100 % with a soft overshoot while it fades in, then holds; short (about 1.5 s) so it works as an intro sting.

## Ops

```json
{
  "summary": "Logo reveal",
  "reason": "You asked for a logo reveal: the logo template handles timing and easing for you",
  "ops": [
    {"op": "template", "kind": "logoReveal", "at": 0, "duration": 1500}
  ]
}
```

The `template` op builds the layers and keyframes in one step (MM110 `lib/vector/templates.ts`); its options are kind, text, colors, at and duration.

## How to adjust

More drama: duration 2500. Add the drawn outline: use the logo draw-on recipe first.
