---
id: "title-pop-template"
editor: "vector"
title: "Title pop template"
intents: ["quick animated headline", "pop text template", "animated title card", "headline animation", "word pops on screen"]
difficulty: "basic"
ops_example: true
tools: ["motion"]
---

## When to use

The user wants a finished animated headline.

## What a pro does and why

The template creates the text centred on the canvas with the scale overshoot and fade already keyed.

## Ops

```json
{
  "summary": "Title pop",
  "ops": [
    {"op": "template", "kind": "titlePop", "text": "New collection", "colors": ["#ffffff"], "at": 0}
  ]
}
```

The `template` op builds the layers and keyframes in one step (MM110 `lib/vector/templates.ts`); its options are kind, text, colors, at and duration.

## How to adjust

Bigger: `update_layer` with `fontSize` on the text. Later start: `at` 500.
