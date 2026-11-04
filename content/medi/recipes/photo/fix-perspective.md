---
id: "fix-perspective"
editor: "photo"
title: "Fix converging lines (buildings leaning back)"
intents: ["the building is leaning", "fix the perspective", "vertical lines are tilted", "keystone correction", "make walls straight"]
difficulty: "advanced"
ops_example: false
tools: ["fix-perspective-photo", "straighten-photo"]
---

## When to use

Buildings shot from below look like they fall backwards; documents photographed at an angle.

## What a pro does and why

Perspective correction moves the four corners of the image so vertical lines become parallel. It needs precise corner placement by eye, which the user does best with the Geometry panel corner handles.

## Ops

No op list (corner offsets are not in the op vocabulary). Explain: open Geometry, choose Perspective, drag the top corners outwards until verticals are parallel, then crop. Offer `{"op":"set_geometry","crop":{"aspect":"original"}}` afterwards to trim the empty corners.

## How to adjust

Looks squashed: drag less. Empty corners: crop tighter.
