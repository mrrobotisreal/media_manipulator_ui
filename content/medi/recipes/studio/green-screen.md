---
id: "green-screen"
editor: "studio"
title: "Remove a green screen"
intents: ["remove the green screen", "chroma key", "replace the background", "key out the green", "transparent background video"]
difficulty: "intermediate"
ops_example: false
tools: ["content-studio"]
---

## When to use

Footage shot on a green or blue background.

## What a pro does and why

Chroma key removes one colour. Pick the key colour from a typical background patch, raise similarity until the background disappears, add a little blend for soft edges and despill to remove green fringes. Even lighting matters more than settings.

## Ops

The chroma key effect is added in the clip inspector (Effects → Chroma key); the op vocabulary has no effect-add op in v1, so guide the user: similarity about 0.15–0.25, blend 0.1, despill 0.5, key colour from the eyedropper.

## How to adjust

Holes in the person: lower similarity. Green edges: despill 0.7. Background still visible: raise similarity in small steps.
