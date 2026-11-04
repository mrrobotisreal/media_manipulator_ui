---
id: "remove-blemishes"
editor: "photo"
title: "Remove blemishes, spots and small objects"
intents: ["remove this spot", "get rid of the pimple", "remove dust spots", "clean up the blemish", "erase a small object"]
difficulty: "basic"
ops_example: false
tools: ["remove-blemishes", "remove-object-from-photo"]
---

## When to use

Small defects: spots, dust, a stray hair, a small sign.

## What a pro does and why

Healing replaces the marked pixels with plausible texture from around them. In Aperture that is the Heal panel: the user paints over the spot and an AI model fills it. Medi cannot paint, so the right move is to explain the two steps and offer the button; it spends one AI operation per heal, so the user decides.

## Ops

No op list. Answer with `suggest_action {kind: "heal", label: "Open Heal"}` and one line: paint over the spot with a brush slightly larger than it, then press Heal. For larger objects mention the remove-object tool page.

## How to adjust

Edge of the fix visible: paint a bigger area. Repeated texture: heal in two smaller passes.
