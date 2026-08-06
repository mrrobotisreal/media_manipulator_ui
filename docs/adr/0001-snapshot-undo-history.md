# Undo/redo is snapshot history over the document slice, not a command pattern

Content Studio (Darkroom) undo/redo wraps the Zustand store's *document* slice (the EDL: tracks, clips, captions, audio config) in temporal past/future snapshot stacks, rather than converting the ~50 store actions into command objects with hand-written inverses. Store updates are already immutable, so snapshots share structure and stay cheap even on large projects, and every future editing feature gets undo for free instead of owing an inverse (the classic source of silent history corruption).

Package decisions that ride with this:

- **Scope**: only document state is undoable. Selection, playhead, zoom, and panel layout never enter history — undo must not teleport the playhead.
- **Grouping**: continuous gestures (clip drag, trim drag, slider scrub) collapse to one history entry, committed on gesture end via an explicit transaction/batch API the UI calls.
- **Depth/persistence**: ~100 entries, session-only. History is never persisted server-side; a reload starts fresh (autosave persists the *result* of an undo like any other edit).
- **Keys**: Cmd/Ctrl+Z undo; Cmd/Ctrl+Shift+Z and Ctrl+Y redo.
- Semantic entry labels ("Undo Split") are optional metadata that can be added later without changing the architecture.
